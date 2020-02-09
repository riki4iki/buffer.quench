import request from "supertest";
import { getConnection } from "typeorm";

import { app } from "../../src/app";
import { IJwtPair, IFacebookPage, IPostBody, IUknownPageBody } from "../../src/types";
import { SocialType } from "../../src/types/architecture/SocialTypes";
import { user as connectAndCreateUser, facebook_test_user as facebookUser, endpoints, nextMinutes, invalid_uuid } from "../config";

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
               const response = res.body;
               expect(response).toMatchObject({
                  id: expect.any(String),
               });
               /* expect(response).toMatchObject({
                  thread: {
                     //name: expect.any(String),
                     id: expect.any(String),
                  },
                  post: {
                     context: post.context,
                     id: expect.any(String),
                  },
                  pages: expect.any(Array),
               });
               expect(new Date(response.post.expireDate)).toEqual(post.expireDate);
               response.pages.forEach(page => {
                  expect(socialPages).toEqual(
                     expect.arrayContaining([{ id: page.fbId, category: page.category, name: page.name, picture: page.picture }]),
                  );
               });*/
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
            .expect(400, [{ property: "post", constraints: { isNotEmpty: "post should not be empty" } }])
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("create new post with malfored post object, should return bad request", async done => {
         const pages: IUknownPageBody[] = socialPages.map(item => {
            return { type: "facebook", socialId, page: item.id };
         });

         request(app.callback())
            .post(endpoints.user.dashboard.access)
            .set(jwt)
            .send({ pages, post: { expireDate: "228" } })
            .expect(400, [
               { property: "context", constraints: { isNotEmpty: "context should not be empty" } },
               { property: "expireDate", constraints: { isFuture: "impossible set date in past time" } },
            ])
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("create new post with empty array object, should return bad request", async done => {
         const post: IPostBody = {
            context: `dashboard test at ${new Date()}`,
            expireDate: nextMinutes(1),
         };
         request(app.callback())
            .post(endpoints.user.dashboard.access)
            .set(jwt)
            .send({ post })
            .expect(400, [
               {
                  property: "pages",
                  constraints: {
                     arrayNotEmpty: "pages should not be empty",
                     isArray: "pages must be an array",
                     isNotEmpty: "pages should not be empty",
                  },
               },
            ])
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("create new post with empty array pages, should return 400 validation bad request", async done => {
         const post: IPostBody = {
            context: `dashboard test at ${new Date()}`,
            expireDate: nextMinutes(1),
         };
         const pages = [];
         request(app.callback())
            .post(endpoints.user.dashboard.access)
            .set(jwt)
            .send({ post, pages })
            .expect(400, [
               {
                  property: "pages",
                  constraints: {
                     arrayNotEmpty: "pages should not be empty",
                  },
               },
            ])
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("create new post with invalid facebook_id in page object, should return 400 ", async done => {
         const post: IPostBody = {
            context: `dashboard test at ${new Date()}`,
            expireDate: nextMinutes(1),
         };
         const page = "fadagwegfadasdsadasfdgsd"; //pageid in facebook
         const pages = [{ type: "facebook", socialId, page }];
         request(app.callback())
            .post(endpoints.user.dashboard.access)
            .set(jwt)
            .send({ post, pages })
            .expect(400, `input facebook page: ${page} is not account for social: ${socialId}`)
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("create new post with invalid object in pages(doesn't match in pattern {type:string,socialId:string,page:string}, should return 400", async done => {
         const post: IPostBody = {
            context: `dashboard test at ${new Date()}`,
            expireDate: nextMinutes(1),
         };
         const pages = [{ tupe: "AAAAAAAAAAAAAAAA", social: "))", page: 228 }];
         request(app.callback())
            .post(endpoints.user.dashboard.access)
            .set(jwt)
            .send({ post, pages })
            .expect(400, [
               { property: "socialId", constraints: { isUuid: "socialId must be an UUID", isNotEmpty: "socialId should not be empty" } },
               {
                  property: "type",
                  constraints: {
                     isNotEmpty: "type should not be empty",
                     isSocialType: "invalid input type of social, only the following types are currently available: facebook,instagram,twitter",
                  },
               },
            ])
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("create new post with invalid type in pages object, should return 400", async done => {
         const post: IPostBody = {
            context: `dashboard test at ${new Date()}`,
            expireDate: nextMinutes(1),
         };
         const pages = [{ type: 1, socialId, page: 1 }];
         request(app.callback())
            .post(endpoints.user.dashboard.access)
            .set(jwt)
            .send({ post, pages })
            .expect(400, [
               {
                  property: "type",
                  constraints: {
                     isSocialType: `invalid input type of social, only the following types are currently available: ${Object.values(SocialType)}`,
                  },
               },
            ])
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("create new post with pages array where first object is valid type, second object is invalid type, should return 400", async done => {
         const post: IPostBody = {
            context: `dashboard test at ${new Date()}`,
            expireDate: nextMinutes(1),
         };
         const pages = [
            { type: "facebook", socialId, page: 1 },
            { type: 1, socialId, page: 1 },
         ];
         request(app.callback())
            .post(endpoints.user.dashboard.access)
            .set(jwt)
            .send({ post, pages })
            .expect(400, [
               {
                  property: "type",
                  constraints: {
                     isSocialType: `invalid input type of social, only the following types are currently available: ${Object.values(SocialType)}`,
                  },
               },
            ])
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("create new post with invalid socialId on pages array objct, should return 400", async done => {
         const post: IPostBody = {
            context: `dashboard test at ${new Date()}`,
            expireDate: nextMinutes(1),
         };
         const pages = [
            { type: "facebook", socialId: invalid_uuid, page: "13" },
            { type: "facebook", socialId, page: 0 },
         ];
         request(app.callback())
            .post(endpoints.user.dashboard.access)
            .set(jwt)
            .send({ post, pages })
            .expect(400, "social not found")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("create new post again with same arguments, should return 201(cause of unique thread name create by current time)", async done => {
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
               const response = res.body;
               expect(response).toMatchObject({
                  id: expect.any(String),
               });
               /*expect(response).toMatchObject({
                  thread: {
                     name: expect.any(String),
                     id: expect.any(String),
                  },
                  post: {
                     context: post.context,
                     id: expect.any(String),
                  },
                  pages: expect.any(Array),
               });
               expect(new Date(response.post.expireDate)).toEqual(post.expireDate);
               response.pages.forEach(page => {
                  expect(socialPages).toEqual(
                     expect.arrayContaining([{ id: page.fbId, category: page.category, name: page.name, picture: page.picture }]),
                  );
               });*/
               return done();
            });
      });
   });
   describe("test dashboard getting", () => {
      test("get all threads in dashboard, should return 200 and array of dashboard objects", async done => {
         request(app.callback())
            .get(endpoints.user.dashboard.access)
            .set(jwt)
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               console.log(res.body);
               return done();
            });
      });
   });
});
