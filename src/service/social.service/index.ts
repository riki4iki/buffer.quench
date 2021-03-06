import { Repository, getManager } from "typeorm";

import { IContext, IAuthState } from "types";
import { Social } from "models";

import facebookSocialService from "./facebook.social";
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
      const toResponse = Promise.all(socials.map(async social => await social.toResponse()));

      ctx.status = 200;
      ctx.body = await toResponse;
   }
}

export { facebookSocialService, SocialService };
