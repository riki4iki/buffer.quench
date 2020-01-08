import { Context } from "koa";
import { userByEmail } from "./systemUser";
import { jwtService as jwt } from "../../lib";
import { IContext, IAuthState } from "../../types";

/**
 * Class controller for local authentication to system
 */
export default class LocalAuthService {
   /**
    * EndPoints - important for realize local authentication, required login and password for user identification
    * return jsonwebtoken pair (access_token, refresh_token, expiresIn)
    * @param ctx Context - Basic koa context for realize response to clien
    */
   public static async sign_in(ctx: Context) {
      //input from ctx.request.body:
      // - email
      // - password
      const email: string = ctx.request.body.email;
      const password: string = ctx.request.body.password;

      try {
         //find user by email
         const systemUser = await userByEmail(email);
         if (await systemUser.checkPassword(password)) {
            //check password for user
            //if password is valid create jwt pair ad return
            const pair = await jwt.createPair(systemUser);
            ctx.status = 200;
            ctx.body = { jwt: pair, ...(await systemUser.withSocials()) };
         }
      } catch (err) {
         ctx.app.emit("error", err, ctx);
      }
   }
   /**
    * EndPoint - create new user in system. Work with userService middleware where user created.
    * return jsonwebtoken pair (access_token, refresh_token, expiresIn)
    * @param ctx Context - Koa Context with state IAuthState that important for getting user from ctx.state created into before middleware
    */
   public static async sign_up(ctx: IContext<IAuthState>) {
      const created = ctx.state.user;
      if (!created) {
         ctx.status = 401;
      } else {
         ctx.status = 201;
         ctx.body = "success";
      }
   }
}
