import { SocialType } from "../../../types/architecture/SocialTypes";
import { connectStringPage as facebookConnectPage } from "../page.thread/facebook.page/crud";

import { BadRequest } from "http-errors";

import { FacebookUser, Thread } from "../../../models";
import { ISocialPage } from "../../../types/architecture";

export type connectionPromise = (thread: Thread, social: FacebookUser, page: string) => Promise<ISocialPage>;

export class ConnectionSelector {
   private static pages: { [type: string]: connectionPromise } = {
      [SocialType.Facebook]: facebookConnectPage,
      default: (thread: Thread, social: FacebookUser, page: string) => {
         const err = new BadRequest(`invalid input type of social, only the following types are currently available: ${Object.values(SocialType)}`);
         throw err;
      },
   };
   static selectConnector(type: string): connectionPromise {
      const factory = ConnectionSelector.pages[type] || ConnectionSelector.pages.default;
      return factory;
   }
}
