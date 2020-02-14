import { SocialType } from "types/architecture/SocialTypes";
import { get as findFacebookSocial } from "service/social.service/facebook.social/crud";

import { socialPromiseType } from "./factory.types";

class SocialPromiseFactory {
   private static promise: { [type: string]: socialPromiseType } = {
      [SocialType.Facebook]: findFacebookSocial,
   };
   public static selectPromise(type: string): socialPromiseType {
      const promise = SocialPromiseFactory.promise[type];
      return promise;
   }
}

export { SocialPromiseFactory };
