import { BadRequest } from "http-errors";

import { SocialType } from "../../../../types/architecture/SocialTypes";
import { target } from "../../page.thread/facebook.page/crud";
import { Thread } from "../../../../models";
import { ISocialPage } from "../../../../types";

export class GetterPromiseFactory {
   private static promise: { [type: string]: (thread: Thread, id: string) => Promise<ISocialPage> } = {
      [SocialType.Facebook]: target,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      default: (thread: Thread, id: string) => {
         const error = new BadRequest(`invalid input type of social, only the following types are currently available: ${Object.values(SocialType)}`);
         throw error;
      },
   };
   public static getterSelector(type: string): (thread: Thread, id: string) => Promise<ISocialPage> {
      const promise = GetterPromiseFactory.promise[type] || GetterPromiseFactory.promise.default;
      return promise;
   }
}
