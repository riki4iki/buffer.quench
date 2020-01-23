import request, { Options } from "request-promise";
import { IFacebookPage, IFacebookUser, ILongLivedUserToken } from "../types/facebook";
const version = process.env.FACEBOOK_API_VERSION;

/**
 * Service for communication with FACEBOOK Graphql API. Work with verion that written in .env file in root directory
 */
export default class FacebookService {
   public static async getUser(token: string): Promise<IFacebookUser> {
      const options: Options = {
         method: "GET",
         uri: `https://graph.facebook.com/${version}/me`,
         qs: {
            access_token: token,
            fields: "id,name,email,picture",
         },
      };
      return request(options).then(data => JSON.parse(data));
   }

   public static async longLiveUserAccessToken(token: string): Promise<ILongLivedUserToken> {
      const options: Options = {
         method: "GET",
         uri: `https://graph.facebook.com/${version}/oauth/access_token`,
         qs: {
            grant_type: "fb_exchange_token",
            client_id: process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            fb_exchange_token: token,
         },
      };
      return request(options).then(data => JSON.parse(data));
   }
   public static async longLiveAccounts(longUserToken: string, userId: string): Promise<Array<IFacebookPage>> {
      const options: Options = {
         method: "GET",
         uri: `https://graph.facebook.com/${version}/${userId}/accounts`,
         qs: {
            access_token: longUserToken,
            fields: "id,access_token",
         },
      };
      return request(options).then(data => JSON.parse(data).data);
   }
   /**
    * Call facebook api and return facebook accounts(pages)
    * @param token String - Usee access token (no difference long or short)
    */
   public static async accounts(token: string): Promise<Array<IFacebookPage>> {
      const options: Options = {
         method: "GET",
         uri: `https://graph.facebook.com/${version}/me/accounts`,
         qs: {
            access_token: token,
            fields: "id,category,picture,name",
         },
      };
      return request(options).then(data => JSON.parse(data).data);
   }
   public static async post(id: string, token: string, message: string) {
      const options: Options = {
         method: "POST",
         uri: `https://graph.facebook.com/${version}/${id}/feed`,
         qs: {
            message: message,
            access_token: token,
         },
      };
      return request(options)
         .then(data => JSON.parse(data))
         .catch(err => {
            const { message, statusCode } = err;
            return { err: { message, statusCode } };
         });
   }

   public static async accountByToken(token: string): Promise<IFacebookPage> {
      const options: Options = {
         method: "GET",
         uri: `https://graph.facebook.com/${version}/me`,
         qs: {
            access_token: token,
            fields: "id,category,picture,name",
         },
      };
      return request(options).then(data => JSON.parse(data));
   }
}
