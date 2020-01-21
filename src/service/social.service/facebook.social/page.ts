import { getManager, Repository } from "typeorm";
import { FacebookPage as FacebookPageModel, FacebookUser as FacebookUserModel } from "../../../models";
import { IFacebookPage } from "../../../types";
import { BadRequest } from "http-errors";
import { fbService as api } from "../../../lib";

/**
 * Promise. Get from facebook api accounts/pages wth long lived access token -> save their in database ->
 * return saved pages
 * @param facebookUser FacebookUserModel - social from facebook for whom the pages will be getted
 */
export async function insertPagesfromApi(facebookUser: FacebookUserModel): Promise<Array<IFacebookPage>> {
   const apiFacebookPage = await api.accounts(facebookUser.accessToken);

   return await apiFacebookPage;
}
