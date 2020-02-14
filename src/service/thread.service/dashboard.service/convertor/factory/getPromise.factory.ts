import { SocialType } from "types/architecture/SocialTypes";
import { target as findFacebookPage } from "service/thread.service/page.thread/facebook.page/crud";

import { getterPromiseType } from "./factory.types";

class GetSocialPagePromiseFactory {
   private static promise: { [type: string]: getterPromiseType } = {
      [SocialType.Facebook]: findFacebookPage,
   };
   public static selectPromise(type: string): getterPromiseType {
      const promise = GetSocialPagePromiseFactory.promise[type];
      return promise;
   }
}
export { GetSocialPagePromiseFactory };
