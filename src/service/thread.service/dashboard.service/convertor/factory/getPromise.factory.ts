import { SocialType } from "types/architecture/SocialTypes";
import { target as findFacebookPage } from "service/thread.service/page.thread/facebook.page/crud";
import { factoryBadRequest } from "./badRequest.error";

import { getterPromiseType } from "./factory.types";

class GetSocialPagePromiseFactory {
   private static promise: { [type: string]: getterPromiseType } = {
      [SocialType.Facebook]: findFacebookPage,
      default: factoryBadRequest,
   };
   public static selectPromise(type: string): getterPromiseType {
      const promise = GetSocialPagePromiseFactory.promise[type] || GetSocialPagePromiseFactory.promise.default;
      return promise;
   }
}
export { GetSocialPagePromiseFactory };
