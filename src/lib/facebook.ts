import request from "request-promise";

const version = process.env.FACEBOOK_API_VERSION;

export default class FacebookService {
  public static async getUser(token: string) {
    const options = {
      method: "GET",
      uri: `https://graph.facebook.com/${version}/me`,
      qs: {
        access_token: token,
        fields: "id,name,email"
      }
    };
    return request(options).then(data => JSON.parse(data));
  }
  public static async longLiveUserAccessToken(token: string) {
    const options = {
      method: "GET",
      uri: `https://graph.facebook.com/${version}/oauth/access_token`,
      qs: {
        grant_type: "fb_exchange_token",
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        fb_exchange_token: token
      }
    };
    return request(options).then(data => JSON.parse(data));
  }
  public static async longLiveAccounts(longUserToken: string, userId: string) {
    const options = {
      method: "GET",
      uri: `https://graph.facebook.com/${version}/${userId}/accounts`,
      qs: {
        access_token: longUserToken,
        fields: "id,name,access_token, tasks, cover, category"
      }
    };
    return request(options).then(data => JSON.parse(data).data);
  }
  public static async accounts(token: string) {
    const options = {
      method: "GET",
      uri: `https://graph.facebook.com/${version}/me/accounts`,
      qs: {
        access_token: token,
        fields: "id,name,access_token, tasks, cover, category"
      }
    };
    return request(options).then(data => JSON.parse(data).data);
  }
}
