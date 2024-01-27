import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import config from '../config';
import { IEmployee } from 'src/__typedefs/graphqlTypes';
const jwt = require('jsonwebtoken');
//const Redis = require('ioredis');

// our context interface
interface IContext {
  token: string;
  error: number;
}

function decodeToken(token: any): any {
  const base64String = token.split('.')[1];
  const decodedValue = JSON.parse(Buffer.from(base64String, 'base64').toString('ascii'));
  return decodedValue;
}

async function verifyToken(req: Request, res: Response): Promise<IContext> {
  //const redisUrl = `redis://${config.redis.host}:6379`;
  //const redisClient = new Redis(redisUrl);

  if (
    req.body.operationName.indexOf('SignIn') > -1 ||
    req.body.operationName.indexOf('SignUp') > -1 ||
    req.body.operationName.indexOf('ActivateEmployeeAccount') > -1
  ) {
    return { token: '', error: 0 };
  }

  var token = req.headers['x-jwt'];

  if (!token) {
    return { token: '', error: 401 };
  }

  const result = await jwt.verify(token, config.auth.secretKey, async (error: any) => {
    const decoded = decodeToken(token);

    if (!decoded.id && !decoded.email /* || !redisClient.exists(decoded.id)*/) {
      return { token: '', error: 403 };
    }

    if (req.body.operationName.indexOf('SignOut') > -1) {
      /*await redisClient.del(decoded.id, function (err: any, reply: any) {
        if (reply === 1) {
          console.log('redisClient.delete successful');
        }
      });*/

      return { token: '', error: 0 };
    }

    if (error) {
      if (error.toString().indexOf('JsonWebTokenError') >= 0) {
        return { token: '', error: 403 };
      }

      return { token: token, error: 401 };
    } else {
      return { token: token, error: 0 };
      /*const exists = await redisClient.get(decoded.id, (err: any, result: any) => {
        return result;
      });*/
      /*

      //if (exists) {
        return { token: token, error: 0 };
      } else {
        return { token: token, error: 503 };
      }*/
    }
  });

  return { token: result.token, error: result.error };
}

// create context for requests
export default {
  async handleGraphQLContext(req: any, res: any): Promise<IContext> {
    // check the request for the token
    const validation = await verifyToken(req, res);
    return { token: validation.token, error: validation.error };
  },
  hashPassword(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  },
  signToken(employee: IEmployee) {
    /*const redisUrl = `redis://${config.redis.host}:6379`;
    const redisClient = new Redis(redisUrl);

    redisClient.set(user.id, '1', function (err: any, reply: any) {
      if (err) {
        console.log('redisClient.set err ' + err);
      }
      // console.log('redisClient.set reply ' + reply);
    });*/

    return jwt.sign({ id: employee.id, email: employee.email }, config.auth.secretKey, { expiresIn: config.auth.expiresIn });
  },
  signTokenByToken(token: string): string {
    const decoded = decodeToken(token);

    if (!decoded.id || !decoded.email) {
      return '403';
    }
    return jwt.sign({ id: decoded.id, email: decoded.email }, config.auth.secretKey, { expiresIn: config.auth.expiresIn });
  },
  randomTokenString(): string {
    return crypto.randomBytes(40).toString('hex');
  }
};
