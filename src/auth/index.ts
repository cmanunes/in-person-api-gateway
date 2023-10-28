import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import config from '../config';
import { IUser } from '../models/interfaces/user-interface';
const jwt = require('jsonwebtoken');
//const Redis = require('ioredis');

// our context interface
interface IContext {
  token: string;
  error: number;
}

// handle all of the token magic here
function createContext(token: string, error: number): IContext {
  return { token, error };
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
    return { token: '', error: 503 };
  }

  const result = await jwt.verify(token, config.auth.secretKey, async (error: any) => {
    const decoded = decodeToken(token);

    if (!decoded.id && !decoded.email /* || !redisClient.exists(decoded.id)*/) {
      return { token: '', error: 503 };
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
        return { token: '', error: 503 };
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
  async handleGraphQLContext(ctx: { req: Request; res: Response }): Promise<IContext> {
    const { req, res } = ctx;

    return { token: '', error: 0 };

    // check the request for the token
    const validation = await verifyToken(req, res);
    return createContext(validation.token, validation.error);
  },
  hashPassword(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  },
  signToken(user: IUser) {
    /*const redisUrl = `redis://${config.redis.host}:6379`;
    const redisClient = new Redis(redisUrl);

    redisClient.set(user.id, '1', function (err: any, reply: any) {
      if (err) {
        console.log('redisClient.set err ' + err);
      }
      // console.log('redisClient.set reply ' + reply);
    });*/

    return jwt.sign({ id: user.id, email: user.email }, config.auth.secretKey, { expiresIn: config.auth.expiresIn });
  },
  signTokenByToken(token: string): string {
    const decoded = decodeToken(token);

    if (!decoded.id || !decoded.email) {
      return '503';
    }
    return jwt.sign({ id: decoded.id, email: decoded.email }, config.auth.secretKey, { expiresIn: config.auth.expiresIn });
  },
  randomTokenString(): string {
    return crypto.randomBytes(40).toString('hex');
  }
};
