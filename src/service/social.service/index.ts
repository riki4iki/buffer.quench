import facebookSocialService from "./facebook.social";
import { IContext, IAuthState } from "../../types";
import { Social } from "../../models";
import { Repository, getManager } from "typeorm";
/**
 * Controler. work with route user/social - get all socials for current user
 */
class SocialService {
   /**
    * EndPoint. Return all socials id's and type for current user. Route important cause api works with several social network,
    * and need know type of social
    * @param ctx Context - koa context with authenticated user with user instatnce
    */
   public static async socialsEndPoint(ctx: IContext<IAuthState>) {
      const socialRepository: Repository<Social> = getManager().getRepository(Social);
      const socials = await socialRepository.find({ user: ctx.state.user });

      ctx.status = 200;
      ctx.body = socials;
   }
}

export { facebookSocialService, SocialService };
