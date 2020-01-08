import { getManager, Repository } from "typeorm";
import { FacebookPage as FacebookPageModel, FacebookUser as FacebookUserModel } from "../../../models";
import { fbService as api } from "../../../lib";

export async function insertPagesfromApi(facebookUser: FacebookUserModel): Promise<Array<FacebookPageModel>> {
   const facebookPageRepository: Repository<FacebookPageModel> = getManager().getRepository(FacebookPageModel);
   const apiFacebookPage = await api.longLiveAccounts(facebookUser.accessToken, facebookUser.fbId);
   const insertPages = Promise.all(
      apiFacebookPage.map(async page => {
         const dbPage = await facebookPageRepository.findOne({ fbId: page.id });
         if (dbPage) {
            //update?
            return await dbPage.toResponse();
         } else {
            const newPage = new FacebookPageModel();
            newPage.accessToken = page.access_token;
            newPage.fbId = page.id;
            newPage.fbUser = facebookUser;

            const saved = await facebookPageRepository.save(newPage);
            return await saved.toResponse();
         }
      }),
   );
   return await insertPages;
}
