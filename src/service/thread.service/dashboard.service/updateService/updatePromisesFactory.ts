import { BadRequest } from "http-errors";
import { SocialType } from "../../../../types/architecture/SocialTypes";
import { updatePromises } from "./updaters.type";

import { GetterPromiseFactory } from "./getterPromise.factory";
import { DisconnectPromiseFactory } from "../disconnectService";

export class UpdatedPromisesFactory {
   private static promises: { [type: string]: updatePromises } = {
      [SocialType.Facebook]: {
         getterPromise: GetterPromiseFactory.getterSelector(SocialType.Facebook),
         deleterPromise: DisconnectPromiseFactory.selectDisconnectPromise(SocialType.Facebook),
      },
      default: {
         getterPromise: () => {
            const error = new BadRequest(
               `invalid input type of social, only the following types are currently available: ${Object.values(SocialType)}`,
            );
            throw error;
         },
         deleterPromise: () => {
            const error = new BadRequest(
               `invalid input type of social, only the following types are currently available: ${Object.values(SocialType)}`,
            );
            throw error;
         },
      },
   };
   public static selectUpdatePromises(type: string) {
      const promises = UpdatedPromisesFactory.promises[type] || UpdatedPromisesFactory.promises.default;
      return promises;
   }
}
