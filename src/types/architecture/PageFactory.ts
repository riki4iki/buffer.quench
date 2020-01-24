import { Thread, FacebookPage } from "../../models/";

import { getManager, Repository } from "typeorm";
import { ISocialPage } from "./ISocialPage";
import { SocialType } from "./SocialTypes";
//import oters types

export class PageGetterFactory {
   public static async createGetter(type: string): Promise<(Thread: Thread, string: string) => Promise<ISocialPage>> {
      if (type === SocialType.Facebook) {
         return async (thread: Thread, id: string) => {
            const facebookPageRepository: Repository<FacebookPage> = getManager().getRepository(FacebookPage);
            const facebookPage = await facebookPageRepository.findOne({ thread, id });
            if (!facebookPage) {
               const err = new Error("facebook page not found");
               throw err;
            }
            return facebookPage;
         };
      } else {
         //trhow error cause of input SocialType
         const err = new Error("Incorrect social page type in factory");
         throw err;
      }
   }
}
