import { SocialType } from "../../../types/architecture/SocialTypes";

import { get as facebookSocialById } from "../../social.service/facebook.social/crud";
import { FacebookUser, User } from "../../../models";

type socialGetterType = (user: User, id: string) => Promise<FacebookUser>;

export class SocialSelector {
   private static socials: { [type: string]: socialGetterType } = {
      [SocialType.Facebook]: facebookSocialById,
   };
   static selectSocialByType(type: string): socialGetterType {
      const socialFactory = SocialSelector.socials[type];
      return socialFactory;
   }
}
