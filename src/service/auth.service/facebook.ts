import { Context } from "koa";
import { fbService as fb, jwtService as jwt } from "lib";
import { facebookUser } from "./systemUser";
/**
 * Class Controller work with facebook authentication
 */
export default class FacebookAuthService {
   /**
    * EndPoint - login into service by facebook token, return jsonwebtoken pair if target facebook account connected with only one system user.
    * If target facebook account connected with two or more will returned 401 status.
    * @param ctx Context - basic koa context contain requests and response instanses
    */
   public static async signIn(ctx: Context) {
      try {
         //input token from body
         // eslint-disable-next-line @typescript-eslint/camelcase
         const user_access_token_2h = ctx.request.body.token;
         //getting facebook user by facebook api
         const apiFacebookUser = await fb.getUser(user_access_token_2h);
         //find system facebook user by facebook id
         const systemFacebookUser = await facebookUser(apiFacebookUser.id);
         //returned instanse always will have system user in object facebookUser.User
         const systemUser = systemFacebookUser.user;
         //create pair by system user
         const pair = await jwt.createPair(systemUser);
         ctx.status = 200;
         ctx.body = { jwt: pair, ...(await systemUser.withSocials()) };
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
}
