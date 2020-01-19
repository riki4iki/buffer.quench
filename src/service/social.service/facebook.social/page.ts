import { getManager, Repository } from "typeorm";
import { FacebookPage as FacebookPageModel, FacebookUser as FacebookUserModel } from "../../../models";
import { BadRequest } from "http-errors";
import { fbService as api } from "../../../lib";

/**
 * Promise. Get from facebook api accounts/pages wth long lived access token -> save their in database ->
 * return saved pages
 * @param facebookUser FacebookUserModel - social from facebook for whom the pages will be getted
 */
export async function insertPagesfromApi(facebookUser: FacebookUserModel): Promise<Array<FacebookPageModel>> {
   const facebookPageRepository: Repository<FacebookPageModel> = getManager().getRepository(FacebookPageModel);
   try {
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
   } catch (err) {
      const error = new BadRequest("waiting for handler in facebook api file");
      throw error;
   }
}
