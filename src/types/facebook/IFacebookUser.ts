import { IFacebookPicture } from "./IFacebookPicture";
/**
 * Response from facebook api for user
 */
export interface IFacebookUser {
   id: string;
   name: string;
   email: string;
   picture: IFacebookPicture;
}
