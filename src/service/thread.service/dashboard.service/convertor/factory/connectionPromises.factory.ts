import { SocialType } from "types/architecture/SocialTypes";

import { SocialPromiseFactory } from "./socialPromise.factory";
import { ValidatePromiseFactory } from "./validatePromise.factory";
import { ConnectSocialPagePromiseFactory } from "./connectPromise.factory";

import { connectionPromisesType } from "./factory.types";

class ConnectionPromisesFactory {
   private static promises: { [type: string]: connectionPromisesType } = {
      [SocialType.Facebook]: {
         socialPromise: SocialPromiseFactory.selectPromise(SocialType.Facebook),
         validatePagePromise: ValidatePromiseFactory.selectPromise(SocialType.Facebook),
         connectionPromise: ConnectSocialPagePromiseFactory.selectPromise(SocialType.Facebook),
      },
   };
   public static selectPromises(type: string): connectionPromisesType {
      const promises = ConnectionPromisesFactory.promises[type];
      return promises;
   }
}
export { ConnectionPromisesFactory };
