import dotenv from 'dotenv';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  port: parseInt(process.env.PORT as string, 10),
  loglevel: process.env.LOG_LEVEL,
  auth: {
    expiresIn: process.env.AUTH_EXPIRES_IN,
    secretKey: process.env.AUTH_SERVICE_KEY
  },
  companiesService: {
    url: process.env.COMPANIES_SERVICE_URL
  },
  employeesService: {
    url: process.env.EMPLOYEES_SERVICE_URL
  },
  packagesService: {
    url: process.env.PACKAGES_SERVICE_URL
  },
  webApp: {
    url: process.env.WEB_APP_URL
  }
};
