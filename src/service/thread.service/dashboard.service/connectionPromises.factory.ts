import { ConnectionPromises, failedTypePromises } from "./connectionPromises.type";
import { SocialType } from "../../../types/architecture/SocialTypes";

import { get as facebookSocialById } from "../../social.service/facebook.social/crud";
import { validatePageBySocial as facebookValidation, connectResponsedPage as facebookConnection } from "../page.thread/facebook.page/crud";

export class ConnectionPromisesFactory {
   private static promises: { [type: string]: ConnectionPromises } = {
      [SocialType.Facebook]: { socialPromise: facebookSocialById, validatePagePromise: facebookValidation, connectionPromise: facebookConnection },
      default: failedTypePromises,
   };

   static selectPromises(type: string): ConnectionPromises {
      const promises = ConnectionPromisesFactory.promises[type];
      return promises;
   }
}
