import { SocialType } from "types/architecture/SocialTypes";
import { connectResponsedPage as connectFacebookPage } from "service/thread.service/page.thread/facebook.page/crud";

import { connectorPromiseType } from "./factory.types";

class ConnectSocialPagePromiseFactory {
   private static promise: { [type: string]: connectorPromiseType } = {
      [SocialType.Facebook]: connectFacebookPage,
   };

   public static selectPromise(type: string): connectorPromiseType {
      const promise = ConnectSocialPagePromiseFactory.promise[type];
      return promise;
   }
}

export { ConnectSocialPagePromiseFactory };
