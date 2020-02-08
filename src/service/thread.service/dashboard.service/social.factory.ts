import { SocialType } from "../../../types/architecture/SocialTypes";

import { get as facebookSocialById } from "../../social.service/facebook.social/crud";
import { FacebookUser, User } from "../../../models";

import { BadRequest } from "http-errors";

type socialGetterType = (user: User, id: string) => Promise<FacebookUser>;

export class SocialSelector {
   private static socials: { [type: string]: socialGetterType } = {
      [SocialType.Facebook]: facebookSocialById,
      default: (user: User, id: string) => {
         const err = new BadRequest(`invalid input type of social, only the following types are currently available: ${Object.values(SocialType)}`);
         throw err;
      },
   };
   static selectSocialByType(type: string): socialGetterType {
      const socialFactory = SocialSelector.socials[type] || SocialSelector.socials.default;
      return socialFactory;
   }
}
