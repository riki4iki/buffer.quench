import jwt from "jsonwebtoken";
import { Unauthorized } from "http-errors";
import { Repository, getManager } from "typeorm";

import { jwtConfig } from "config";
import { Refresh as Session, User } from "models";
import { IPayload, IJwtPair } from "types";

/**
 * Generate token with access token live, get option from config file
 * @param id - user id argument for access token generate,  id will be written in payload
 */
const generateAccess = async (id: string): Promise<string> => {
   const payload: IPayload = {
      id: id,
      jti: jwtConfig.jti,
      iss: jwtConfig.issuer,
      sub: jwtConfig.subject,
      alg: jwtConfig.alg,
   };
   return jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.accessLife,
   });
};
/**
 * Generate token with refresh token live, options get from config file
 * @param id - user id argument for refresh token generate, id will be written in payload
 */
const generateRefresh = async (id: string): Promise<string> => {
   const payload: IPayload = {
      id: id,
      jti: jwtConfig.jti,
      iss: jwtConfig.issuer,
      sub: jwtConfig.subject,
      alg: jwtConfig.alg,
   };
   return jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.refreshLife,
   });
};
/**
 * Expiration value for access token in unix seconds
 */
const expireIn = async (): Promise<number> => {
   return Math.round(new Date().getTime() / 1000);
};
/**
 * Save input refresh token in repository<Refresh>, return Refresh instanse
 * @param refresh - current user refresh token
 * @param user - current user
 */
const createSession = async (refresh: string, user: User): Promise<Session> => {
   const sessionRepository: Repository<Session> = getManager().getRepository(Session);

   const old: Session = await sessionRepository.findOne({
      where: { user: user },
   });
   const session = new Session();
   session.user = user;
   session.token = refresh;
   if (!old) {
      await sessionRepository.save(session);
   } else {
      session.id = old.id;
      await sessionRepository.save(session);
   }
   return session;
};
/**
 * Class for creating jwt pair, getting payload from tokens
 */
export default class JwtService {
   /**
    * Generate new jwt pair, save refresh in database, return pair
    * @param user - incoming user instanse for which will be generated jwt pair
    */
   public static async createPair(user: User): Promise<IJwtPair> {
      const access = await generateAccess(user.id); //generate acces token
      const refresh = await generateRefresh(user.id); //generate refresh token
      const expiresIn = (await expireIn()) + jwtConfig.accessLife; //get expireIn for access token

      await createSession(refresh, user);

      return {
         access_token: access,
         refresh_token: refresh,
         expiresIn: expiresIn,
      };
   }
   /**
    * Decode payload from input token, return IPayload
    * @param token - incoming token for decoding
    */
   public static async payload(token: string): Promise<IPayload> {
      try {
         const payLoad = await jwt.verify(token, jwtConfig.secret);
         return payLoad as IPayload;
      } catch (error) {
         const err = new Unauthorized(error.message);
         throw err;
      }
   }
}
