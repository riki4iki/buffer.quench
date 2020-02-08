import { ConnectionPromises } from "./connectionPromises.type";
import { ConnectionPromisesFactory } from "./connectionPromises.factory";

import { ISocial, ISocialPage, ISocialPageResponse, IUknownPageBody } from "../../../types";
import { User, Thread } from "../../../models";

type convertedBodyWithSocial = { social: ISocial; page: string };
type socialWithResponsedPage = { social: ISocial; page: ISocialPageResponse };

export class ConnectionService {
   factory: ConnectionPromises;

   constructor(type: string) {
      this.factory = ConnectionPromisesFactory.selectPromises(type);
   }

   public async getSocials(user: User, body: IUknownPageBody[]): Promise<convertedBodyWithSocial[]> {
      const socials = Promise.all(
         body.map(async item => {
            const { socialId, page } = item;
            const socialGetterPromise = this.factory.socialPromise;
            const social = await socialGetterPromise(user, socialId);
            return { social, page };
         }),
      );
      return socials;
   }
   public async filtPagesBySocials(converted: convertedBodyWithSocial[]): Promise<socialWithResponsedPage[]> {
      const filters = Promise.all(
         converted.map(async item => {
            const { social, page } = item;
            const filterPromise = this.factory.filterPromise;
            const filter = await filterPromise(social, page);
            return { social, page: filter };
         }),
      );
      return filters;
   }
   public async connectPages(thread: Thread, toConnection: socialWithResponsedPage[]): Promise<ISocialPage[]> {
      const connected = Promise.all(
         toConnection.map(async item => {
            const connectionPromise = this.factory.connectionPromise;
            const connectedPage = await connectionPromise(thread, item.social, item.page);
            return connectedPage;
         }),
      );
      return connected;
   }
}
