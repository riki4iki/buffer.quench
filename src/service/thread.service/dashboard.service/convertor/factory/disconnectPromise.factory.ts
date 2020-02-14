import { SocialType } from "types/architecture/SocialTypes";
import { disconnect as disconnectFacebookPage } from "service/thread.service/page.thread/facebook.page/crud";
import { factoryBadRequest } from "./badRequest.error";

import { disconnecterPromiseType } from "./factory.types";

class DisconnectSocialPagePromiseFactory {
   private static promise: { [type: string]: disconnecterPromiseType } = {
      [SocialType.Facebook]: disconnectFacebookPage,
      default: factoryBadRequest,
   };
   public static selectPromise(type: string): disconnecterPromiseType {
      const promise = DisconnectSocialPagePromiseFactory.promise[type] || DisconnectSocialPagePromiseFactory.promise.default;
      return promise;
   }
}

export { DisconnectSocialPagePromiseFactory };
