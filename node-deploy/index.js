#!/usr/bin/env node

const AWS = require('aws-sdk');
const child_process = require('child_process');
const { format } = require('date-fns');
const fs = require('fs');
const path = require('path');
const util = require('util');

const deploymentDir = process.argv[2];
const deploymentDirName = path.basename(deploymentDir);

const rel = relPath => path.resolve(deploymentDir, relPath);

require('dotenv').config({ path: rel('./.deploy.env') });

const exec = util.promisify(child_process.exec);

const getFullDate = () => format(new Date(), 'yyyyMMddHHmmss');

const APPLICATION_NAME = process.env.APPLICATION_NAME;

const MAX_BUFFER_SIZE = 1024 * 1024; // 1 MiB

const awsRegion = process.env.AWS_REGION;

const codeDeployClient = new AWS.CodeDeploy({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  apiVersion: '2014-10-06',
  region: awsRegion,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
});

const s3Client = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  endpoint: new AWS.Endpoint(`https://s3.${awsRegion}.amazonaws.com/`),
  s3ForcePathStyle: true,
  secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET
});

const rootDir = rel(`../${APPLICATION_NAME}`);

(async () => {
  console.log(`Deploying ${APPLICATION_NAME} in 3 seconds...`);
  await new Promise(resolve => setTimeout(resolve, 3000));

  const lockFilePath = rel('../deploy.lock');
  console.log('Checking for lockfile...');
  if (fs.existsSync(lockFilePath)) {
    console.error('Lockfile deploy.lock found! Halting...');
    process.exit();
  }

  console.log('Creating lockfile...');
  fs.writeFileSync(lockFilePath, 'This stops node-deploy from running concurrently with itself. Remove this if node-deploy complains.');

  console.log('Checking environment...');
  if (!fs.existsSync(rel('.production.env'))) {
    console.error('No .production.env found! Halting...');
    process.exit();
  }

  console.log('Copying appspec...');
  fs.copyFileSync(rel('./appspec.yml'), rel('../appspec.yml'));

  console.log('Generating deployment file...');
  const filename = `${deploymentDirName}-deployment-${getFullDate()}.zip`;
  const zipPath = `/tmp/${filename}`;
  await exec(
    `zip -r ${zipPath} . -x terraform/\\* -x node_modules/\\* -x \\*/node_modules/\\* -x \\*/.cache/\\* -x \\*/.git/\\* -x .git/\\* -x \\*.DS_Store`,
    { cwd: rootDir, maxBuffer: MAX_BUFFER_SIZE }
  );

  console.log('Uploading deployment file...');
  await s3Client
    .putObject({
      Body: fs.createReadStream(zipPath),
      Bucket: `microservices-in-person-${APPLICATION_NAME}-deployment`,
      Key: filename
    })
    .promise();

  console.log('Upload complete! Deployment file is', filename);

  console.log('Removing deployment file...');
  fs.unlinkSync(zipPath);

  console.log('Deploying application...');

  await codeDeployClient
    .createDeployment({
      applicationName: `${APPLICATION_NAME}`,
      deploymentGroupName: process.env.CODEDEPLOY_DEPLOYMENT_GROUP_NAME,
      revision: {
        revisionType: 'S3',
        s3Location: {
          bucket: `microservices-in-person-${APPLICATION_NAME}-deployment`,
          bundleType: 'zip',
          key: filename
        }
      }
    })
    .promise();

  console.log('Deployment initiated on CodeDeploy!');

  console.log('Cleaning up...');
  fs.unlinkSync(rel('../deploy.lock'));
  fs.unlinkSync(rel('../appspec.yml'));
})();
