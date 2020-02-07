import { SocialType } from "../../../types/architecture/SocialTypes";
import { connectStringPage as facebookConnectPage } from "../page.thread/facebook.page/crud";

import { FacebookUser, Thread } from "../../../models";
import { ISocialPage } from "../../../types/architecture";

type connectionPromise = (thread: Thread, social: FacebookUser, page: string) => Promise<ISocialPage>;

export class ConnectionSelector {
   private static pages: { [type: string]: connectionPromise } = {
      [SocialType.Facebook]: facebookConnectPage,
   };
   static selectConnector(type: string): connectionPromise {
      const factory = ConnectionSelector.pages[type];
      return factory;
   }
}
