import { SocialType } from "types/architecture/SocialTypes";
import { connectResponsedPage as connectFacebookPage } from "service/thread.service/page.thread/facebook.page/crud";
import { factoryBadRequest } from "./badRequest.error";

import { connectorPromiseType } from "./factory.types";

class ConnectSocialPagePromiseFactory {
   private static promise: { [type: string]: connectorPromiseType } = {
      [SocialType.Facebook]: connectFacebookPage,
      default: factoryBadRequest(),
   };

   public static selectPromise(type: string): connectorPromiseType {
      const promise = ConnectSocialPagePromiseFactory.promise[type] || ConnectSocialPagePromiseFactory.promise.default;
      return promise;
   }
}

export { ConnectSocialPagePromiseFactory };
