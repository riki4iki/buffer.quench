import { SocialType } from "types/architecture/SocialTypes";
import { factoryBadRequest } from "./badRequest.error";

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
      default: {
         connectionPromise: factoryBadRequest,
         socialPromise: factoryBadRequest,
         validatePagePromise: factoryBadRequest,
      },
   };
   public static selectPromises(type: string): connectionPromisesType {
      const promises = ConnectionPromisesFactory.promises[type] || ConnectionPromisesFactory.promises.default;
      return promises;
   }
}
export { ConnectionPromisesFactory };
