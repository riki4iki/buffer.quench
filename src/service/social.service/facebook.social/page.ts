import { omit } from "lodash";

import { FacebookUser as FacebookUserModel } from "models";
import { IFacebookPage } from "types";
import { fbService as api } from "lib";

/**
 * Promise. Get from facebook api accounts/pages wth long lived access token -> save their in database ->
 * return saved pages
 * @param facebookUser FacebookUserModel - social from facebook for whom the pages will be getted
 */
export async function insertPagesfromApi(facebookUser: FacebookUserModel): Promise<Array<IFacebookPage>> {
   const apiFacebookPages = await api.accounts(facebookUser.accessToken);

   const responsableFacebookPages = apiFacebookPages.map(page => omit(page, "access_token") as IFacebookPage);

   return responsableFacebookPages;
}
