import request from "supertest";
import { getConnection } from "typeorm";

import { app } from "../../src/app";
import { IJwtPair, IFacebookPage, IPostBody, IUknownPageBody } from "../../src/types";
import { user as connectAndCreateUser, facebook_test_user as facebookUser, endpoints, nextMinutes } from "../config";

const account = { email: "dashboard_tester@gmail.com", password: "123321" };
let jwt: IJwtPair;
beforeAll(async () => {
   await connectAndCreateUser(account);
});
afterAll(async () => {
   await getConnection().close();
});

describe("test dashboard endpoint(hard logic realize), before need add social, get pages from dat social", () => {
   let socialId: string;
   let socialPages: IFacebookPage[];
   describe("add social to account, get social pages", () => {
      test("login into service, should return jwt pair", async done => {
         request(app.callback())
            .post(endpoints.auth.local.sign_in)
            .send(account)
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               expect(res.body).toHaveProperty("jwt");
               jwt = res.body.jwt;
               return done();
            });
      });
      test("add social to account, should return 201, after need to get social ID ", async done => {
         request(app.callback())
            .post(endpoints.user.social.facebook.access)
            .set(jwt)
            .send({ token: facebookUser.access_token })
            .expect(201)
            .end((err, res) => {
               if (err) return done(err);
               expect(res.body).toHaveProperty("id");
               socialId = res.body.id;
               return done();
            });
      });
      test("get pages from connected social, should return facebook api response", async done => {
         request(app.callback())
            .get(endpoints.user.social.facebook.id.page.access(socialId))
            .set(jwt)
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               const apiPages = res.body;
               apiPages.forEach(page => {
                  expect(page).toMatchObject({
                     id: expect.any(String),
                     name: expect.any(String),
                     category: expect.any(String),
                     picture: {
                        data: {
                           height: expect.any(Number),
                           is_silhouette: expect.any(Boolean),
                           url: expect.any(String),
                        },
                     },
                  });
               });
               socialPages = apiPages;
               return done();
            });
      });
   });
   describe("test post create by dashboard", () => {
      test("create new post, should return 201 and post body", async done => {
         const post: IPostBody = {
            context: `dashboard test at ${new Date()}`,
            expireDate: nextMinutes(1),
         };
         const pages: IUknownPageBody[] = socialPages.map(item => {
            return { type: "facebook", socialId, page: item.id };
         });
         request(app.callback())
            .post(endpoints.user.dashboard.access)
            .set(jwt)
            .send({ post, pages })
            .expect(201)
            .end((err, res) => {
               if (err) return done(err);
               console.log(res.body);
               return done();
            });
      });
      test("create new post with empty post object in body, should return 400", async done => {
         const pages: IUknownPageBody[] = socialPages.map(item => {
            return { type: "facebook", socialId, page: item.id };
         });
         request(app.callback())
            .post(endpoints.user.dashboard.access)
            .set(jwt)
            .send({ pages })
            .expect(400)
            .end((err, res) => {
               if (err) return done(err);
               console.log(res.body);
               return done();
            });
      });
   });
});
