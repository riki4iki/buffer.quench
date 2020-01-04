import { Context } from "koa";
import { Repository, getManager } from "typeorm";
import { User, Refresh } from "../../models";
import { jwtService } from "../../lib";
import { Unauthorized } from "http-errors";

/**
 * Class Controller works with jwt tokens for authentication
 */
export default class tokenService {
   /**
    * EndPoint - take from headres refresh token, check with database sessions, create new jsonwebtoken pair
    * @param ctx Context - basic koa context contain rsponse and request instanse
    */
   public static async refresh(ctx: Context) {
      const input = ctx.headers["refresh_token"]; //refresh token stored in headers
      try {
         const inputPayload = await jwtService //get object from jwt
            .payload(input);

         const refreshRepository: Repository<Refresh> = getManager().getRepository(
            // get reresh tokens repository
            Refresh
         );
         const db = await refreshRepository.findOne({
            // find session in db
            where: { user: inputPayload.id }
         });
         if (!db) {
            //There is no token in database, so user didn't log-in in system
            const err = new Unauthorized("No session with input refresh token");
            throw err;
         } else {
            const dbPayload = await jwtService // get object from db token
               .payload(db.token);

            if (!(JSON.stringify(inputPayload) === JSON.stringify(dbPayload))) {
               //objects can be equled by JSON.stringify
               const err = new Unauthorized("wrong input token");
               await refreshRepository.remove(db);
               throw err;
            } else {
               const userRepository: Repository<User> = getManager().getRepository(User);
               const user: User = await userRepository.findOne(inputPayload.id);
               if (!user) {
                  const err = new Unauthorized("no user with that refresh token");
                  throw err;
               } else {
                  const newPair = await jwtService.createPair(user);
                  ctx.status = 200;
                  ctx.body = newPair;
               }
            }
         }
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
}
