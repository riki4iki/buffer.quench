import { SocialType } from "types/architecture/SocialTypes";

import { GetSocialPagePromiseFactory } from "./getPromise.factory";
import { DisconnectSocialPagePromiseFactory } from "./disconnectPromise.factory";

import { updatePromisesType } from "./factory.types";

class UpdatePromisesFactory {
   private static promises: { [type: string]: updatePromisesType } = {
      [SocialType.Facebook]: {
         getterPromise: GetSocialPagePromiseFactory.selectPromise(SocialType.Facebook),
         disconnecterPromise: DisconnectSocialPagePromiseFactory.selectPromise(SocialType.Facebook),
      },
   };
   public static selectPromises(type: string): updatePromisesType {
      const promises = UpdatePromisesFactory.promises[type];
      return promises;
   }
}
export { UpdatePromisesFactory };
