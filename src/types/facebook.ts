import { IAuthState } from "./koa";
import { FacebookUser } from "../models";

export interface IFaceBookState extends IAuthState {
   social: FacebookUser;
}

export interface IFacebookPost {
   id: string;
}
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
/**
 * Response from facebook api for picture/icon
 */
export interface IFacebookPicture {
   data: {
      height: number;
      width: number;
      url: string;
      is_silhouette: boolean;
   };
}

/**
 * Response from facebook api for user
 */
export interface IFacebookUser {
   id: string;
   name: string;
   email: string;
   picture: IFacebookPicture;
}
/**
 * Long live access token for 60 days
 */
export interface ILongLiveUserToken {
   access_token: string;
   token_type: string;
}

export interface IFacebookAnswerMessage {
   message: string;
   type: string;
   code: number;
   fbtrace_id: string;
}
