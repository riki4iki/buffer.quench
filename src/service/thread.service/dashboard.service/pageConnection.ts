import { User, Thread } from "../../../models";
import { IUknownPageBody, ISocialPage, ISocial } from "../../../types";

import { SocialSelector } from "./social.factory";
import { FilterSelector } from "./pageFilter.factory";
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
         const { type, socialId, page } = item;
         const socialGetterPromise = SocialSelector.selectSocialByType(type);
         const social = await socialGetterPromise(user, socialId);
         return { type, social, page };
      }),
   );
   return socials;
}
export async function selectFilters(body: { type: string; social: ISocial; page: string }[]) {
   const filters = Promise.all(
      body.map(async item => {
         const { type, social, page } = item;
         const filterPromise = FilterSelector.selectFilter(type);
         const filter = await filterPromise(social, page);
         return filter;
      }),
   );
   return filters;
}
