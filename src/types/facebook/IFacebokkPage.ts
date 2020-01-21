import { IFacebookPicture } from "./IFacebookPicture";
/**
 * Response from facebook api
 */
export interface IFacebookPage {
   id: string;
   access_token: string;
   name: string;
   picture: IFacebookPicture;
   category: string;
}
