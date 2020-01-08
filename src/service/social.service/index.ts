import facebookSocialService from "./facebook.social";
import { IContext, IAuthState } from "../../types";
import { Social } from "../../models";
import { Repository, getManager } from "typeorm";
class SocialService {
   public static async socialsEndPoint(ctx: IContext<IAuthState>) {
      if (ctx.state.user.social) {
         ctx.status = 200;
         ctx.body = ctx.state.user.social;
      } else {
         const socialRepository: Repository<Social> = getManager().getRepository(Social);
         const socials = await socialRepository.find({ user: ctx.state.user });

         ctx.status = 200;
         ctx.body = socials;
      }
   }
}

export { facebookSocialService, SocialService };
