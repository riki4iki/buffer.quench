import { fbService } from "../../../src/lib";
import * as facebookTypes from "../../../src/types/facebook";
import { facebook_test_user } from "../../config/facebook";

let pages: Array<facebookTypes.IFacebookPage>;

describe("facebook api unit test", () => {
   test("get facebook user", async () => {
      const user = await fbService.getUser(facebook_test_user.access_token);
      expect(user).toMatchSnapshot({
         name: facebook_test_user.name,
         email: facebook_test_user.email,
         id: facebook_test_user.id,
      });
   });
   test("generate long lived access token for user", async () => {
      const token = await fbService.longLiveUserAccessToken(facebook_test_user.access_token);
      expect(token).toMatchObject({
         access_token: expect.any(String),
         token_type: expect.any(String),
      });
   });
   test("getting accounts with long lived access tokens", async () => {
      pages = await fbService.longLiveAccounts(facebook_test_user.access_token, facebook_test_user.id);
      pages.forEach(page => {
         expect(page).toMatchObject({
            id: expect.any(String),
            access_token: expect.any(String),
            name: expect.any(String),
            category: expect.any(String),
            picture: {
               data: {
                  height: expect.any(Number),
                  width: expect.any(Number),
                  url: expect.any(String),
                  is_silhouette: expect.any(Boolean),
               },
            },
         });
      });
   });
   test("getting account with short tokens", async () => {
      const pages = await fbService.accounts(facebook_test_user.access_token);
      pages.forEach(page => {
         expect(page).toMatchObject({
            id: expect.any(String),
            access_token: expect.any(String),
            name: expect.any(String),
            category: expect.any(String),
            picture: {
               data: {
                  height: expect.any(Number),
                  width: expect.any(Number),
                  url: expect.any(String),
                  is_silhouette: expect.any(Boolean),
               },
            },
         });
      });
   });
   test("get page from api by page_access_token", async () => {
      pages.forEach(async page => {
         const api = await fbService.accountByToken(page.access_token);
         expect(api).toMatchObject({
            id: page.id,
            name: page.name,
            category: page.category,
            picture: {
               data: {
                  height: page.picture.data.height,
                  width: page.picture.data.width,
                  url: page.picture.data.url,
                  is_silhouette: page.picture.data.is_silhouette,
               },
            },
         });
      });
   });
   test("post message to all pages", async done => {
      pages.map(async page => {
         const result = await fbService.post(page.id, page.access_token, `I posted by facebook.api.test.ts at ${new Date()}`);
         expect(result).toHaveProperty("id");
         return done();
      });
   });
   test("post with invalid token", async done => {
      try {
         const [page] = pages;
         await fbService.post(page.id, "invalid token", "impossible to post");
      } catch (err) {
         expect(err).toThrow();
      }
      return done();
   });
});
