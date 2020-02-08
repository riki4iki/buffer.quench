import { IFacebookPicture } from "./IFacebookPicture";
import { ISocialPageResponse } from "../architecture";
/**
 * Response from facebook api
 */
export interface IFacebookPage extends ISocialPageResponse {
   id: string;
   access_token: string;
   name: string;
   picture: IFacebookPicture;
   category: string;
}
