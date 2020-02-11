import { BadRequest } from "http-errors";
import { Thread } from "../../.././../models";
import { SocialType } from "../../../../types/architecture/SocialTypes";
import { ISocialPage } from "../../../../types";
import { disconnect } from "../../page.thread/facebook.page/crud";

export class DisconnectPromiseFactory {
   private static promise: { [type: string]: (thread: Thread, id: string) => Promise<ISocialPage> } = {
      [SocialType.Facebook]: disconnect,
      default: () => {
         const err = new BadRequest(`invalid input type of social, only the following types are currently available: ${Object.values(SocialType)}`);
         throw err;
      },
   };
   public static selectDisconnectPromise(type: string): (thread: Thread, id: string) => Promise<ISocialPage> {
      const promise = DisconnectPromiseFactory.promise[type] || DisconnectPromiseFactory.promise.default;
      return promise;
   }
}
