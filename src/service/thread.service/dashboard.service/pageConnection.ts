import { User, Thread } from "../../../models";
import { IUknownPageBody, ISocialPage } from "../../../types";

import { SocialSelector } from "./social.factory";
import { ConnectionSelector, connectionPromise } from "./pageConnection.factory";

export async function connectPages(user: User, thread: Thread, body: IUknownPageBody[]): Promise<ISocialPage[]> {
   const connectPages = Promise.all(
      body.map(async item => {
         const socialPromise = SocialSelector.selectSocialByType(item.type);
         const social = await socialPromise(user, item.socialId);
         const connectionPromise = ConnectionSelector.selectConnector(item.type);
         const connectedPage = await connectionPromise(thread, social, item.page);
         return connectedPage;
      }),
   );
   return connectPages;
}

export async function selectSocials(user: User, body: IUknownPageBody[]) {
   const socials = Promise.all(
      body.map(async item => {
         const socialGetterPromise = SocialSelector.selectSocialByType(item.type);
         const social = await socialGetterPromise(user, item.socialId);
         return social;
      }),
   );
   return socials;
}
