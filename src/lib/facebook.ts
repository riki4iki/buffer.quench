import request from "request-promise";

export default class FacebookService {
  public static async getUser(token) {
    const options = {
      method: "GET",
      uri: `https://graph.facebook.com/v4.0/me`,
      qs: {
        access_token: token,
        fields: "id,name,picture.type(large),email"
      }
    };
    return request(options).then(data => JSON.parse(data));
  }
  public static async generateLongLiveUserAccessToken(token) {
    const options = {
      method: "GET",
      uri: `https://graph.facebook.com/v4.0/oauth/access_token`,
      qs: {
        grant_type: "fb_exchange_token",
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        fb_exchange_token: token
      }
    };
    return request(options).then(data => JSON.parse(data));
  }
}
