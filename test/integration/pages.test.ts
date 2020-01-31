import request from "supertest";
import { getConnection } from "typeorm";

import { app } from "../../src/app";
import { thread as connectWithThread, endpoints, facebook_test_user, invalid_uuid } from "../config";
import { IJwtPair, IFacebookPage } from "../../src/types";
import { Thread } from "../../src/models";

let thread: Thread;
let jwt: IJwtPair;
beforeAll(async done => {
   const account = { email: "pages_tester@gmail.com", password: "123321" };
   thread = await connectWithThread(account, { name: "test_thread_pages" });
   request(app.callback())
      .post(endpoints.auth.local.sign_in)
      .send(account)
      .expect(200)
      .end((err, res) => {
         if (err) return done(err);
         jwt = res.body.jwt;
         return done();
      });
});
afterAll(async () => {
   await getConnection().close();
});

describe("pages integration test by supertest", () => {
   let socialId: string;
   let pages: IFacebookPage[];
   let connectedPageIds: string[];
   let connected; //Facebook[]
   describe("need connect social to thread before", () => {
      test("connect test facebook user to thread by user/social/facebook - POST, body:[access_token], should return 201 with created instace social", async done => {
         request(app.callback())
            .post(endpoints.user.social.facebook.access)
            .send({ token: facebook_test_user.access_token })
            .set(jwt)
            .expect(201)
            .end((err, res) => {
               if (err) return done(err);
               socialId = res.body.id;
               return done();
            });
      });
      test("take social pages by connected social in route /social/facebook/socialId/page - GET, should return IFacebookPage[] with page information", async done => {
         request(app.callback())
            .get(endpoints.user.social.facebook.id.page.access(socialId))
            .expect(200)
            .set(jwt)
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
               pages = apiPages;
               return done();
            });
      });
   });
   describe("test facebook pages connection to thread", () => {
      test("connect obtained pages to thread, should return 201 with FacebookPage[] intances", async done => {
         const pageIds: string[] = pages.map(page => page.id);
         request(app.callback())
            .post(endpoints.user.thread.id(thread.id).page.facebook.access)
            .set(jwt)
            .send({ socialId, pages: pageIds })
            .expect(201)
            .end((err, res) => {
               if (err) return done(err);
               const facebookPages = res.body;
               facebookPages.map((page, index) => {
                  const iFacebookPage: IFacebookPage = pages[index];
                  expect(page).toMatchObject({
                     id: expect.any(String),
                     fbId: iFacebookPage.id,
                     name: iFacebookPage.name,
                     category: iFacebookPage.category,
                     picture: iFacebookPage.picture,
                  });
                  expect(page).not.toMatchObject({ accessToken: expect.any(String) });
                  return iFacebookPage.id;
               });
               connected = facebookPages;
               return done();
            });
      });
      test("connet same pages, should return same pages but from database", async done => {
         const pageIds: string[] = pages.map(page => page.id);
         request(app.callback())
            .post(endpoints.user.thread.id(thread.id).page.facebook.access)
            .set(jwt)
            .send({ socialId, pages: pageIds })
            .expect(201)
            .end((err, res) => {
               if (err) return done(err);
               expect(res.body).toEqual(connected);
               return done();
            });
      });
      test("connect pages with invalid facebook id's, should return 400 bad request", async done => {
         const incorrectIds = ["123", "321", "000"];
         request(app.callback())
            .post(endpoints.user.thread.id(thread.id).page.facebook.access)
            .set(jwt)
            .send({ socialId, pages: incorrectIds })
            .expect(400, `input pages: [${incorrectIds}] are not accounts for user: ${socialId}`)
            .end((err, res) => {
               if (err) return done(err);
               return done();
            });
      });
      test("connect pages with array of same values(correct id), should return one page", async done => {
         const facebook_page_id_index = Math.floor(Math.random() * pages.length);
         const facebook_page = pages[facebook_page_id_index];
         const countArray = Math.floor(Math.random() * 5 + 1);
         const ArrayWithSameValues = Array(countArray).fill(facebook_page.id);
         request(app.callback())
            .post(endpoints.user.thread.id(thread.id).page.facebook.access)
            .set(jwt)
            .send({ socialId, pages: ArrayWithSameValues })
            .expect(201)
            .end((err, res) => {
               if (err) return done(err);
               const array = res.body;
               expect(array.length).toEqual(1);
               const [page] = array;
               expect(page).toMatchObject({
                  fbId: facebook_page.id,
                  category: facebook_page.category,
                  name: facebook_page.name,
                  picture: facebook_page.picture,
               });
               return done();
            });
      });
      test("connect pages with malfores array as string, should return 400", async done => {
         request(app.callback())
            .post(endpoints.user.thread.id(thread.id).page.facebook.access)
            .set(jwt)
            .send({ socialId, pages: "['id', '3123'" })
            .expect(400)
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("connect pages with input pages as string(correct array pattern), should return 201", async done => {
         const pageIds: string[] = pages.map(page => page.id);

         const withCommas = pageIds.map(page => `'${page}'`);
         const arrayString = "[ " + withCommas.toString() + " ]";
         request(app.callback())
            .post(endpoints.user.thread.id(thread.id).page.facebook.access)
            .set(jwt)
            .send({ socialId, pages: arrayString })
            .expect(201)
            .end((err, res) => {
               if (err) return done(err);
               const facebookPages = res.body;
               expect(facebookPages).toBeInstanceOf(Array);
               expect(facebookPages.length).toEqual(pageIds.length);
               return done();
            });
      });
      test("connect pages with invalid pages string(isn't array patter) shoul return bad request", async done => {
         const pageIds: string[] = pages.map(page => page.id);
         const arrayString = "[" + pageIds.toString() + "]";
         request(app.callback())
            .post(endpoints.user.thread.id(thread.id).page.facebook.access)
            .set(jwt)
            .send({ socialId, pages: arrayString })
            .expect(400, `input pages: ${arrayString} are not accounts for user: ${socialId}`)
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("connect pages with invalid socialId, shoudld retur bad request (social not found)", async done => {
         const pageIds: string[] = pages.map(page => page.id);
         request(app.callback())
            .post(endpoints.user.thread.id(thread.id).page.facebook.access)
            .set(jwt)
            .send({ socialId: invalid_uuid, pages: pageIds })
            .expect(400, "social not found")
            .end((err, res) => {
               if (err) return done(err);
               return done();
            });
      });
      test("connect pages with malfored socialId, should return bad request ( uuid validation error at socialId)", async done => {
         const pageIds: string[] = pages.map(page => page.id);
         request(app.callback())
            .post(endpoints.user.thread.id(thread.id).page.facebook.access)
            .set(jwt)
            .send({ socialId: "_", pages: pageIds })
            .expect(400, "uuid validation error at socialId")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("after page connection in route /thread/page should to appear dat pages with type and identifier", async done => {
         request(app.callback())
            .get(endpoints.user.thread.id(thread.id).page.access)
            .set(jwt)
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               const abstractPages = res.body;
               abstractPages.forEach((abstract, index) => {
                  const facebookPage = connected[index];

                  expect(abstractPages).toEqual(expect.arrayContaining([{ type: "facebook", pageId: facebookPage.id }]));

                  expect(abstract).not.toHaveProperty("id");
               });
               return done();
            });
      });
   });
   describe("test connected pages getting", () => {
      test("get all pages by thread/page/facebook", async done => {
         request(app.callback())
            .get(endpoints.user.thread.id(thread.id).page.facebook.access)
            .set(jwt)
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               const facebookPages = res.body;
               expect(facebookPages).toEqual(expect.arrayContaining(connected));
               return done();
            });
      });
      test("get target facebook page by id, should return 200 and facebookPage instance", async done => {
         const index = Math.floor(Math.random() * connected.length);

         const facebook_page_id = connected[index].id;
         request(app.callback())
            .get(endpoints.user.thread.id(thread.id).page.facebook.id(facebook_page_id))
            .set(jwt)
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               expect(connected).toEqual(expect.arrayContaining([res.body]));
               return done();
            });
      });
      test("get target facebook page by invalid identifier, should return 400 page not found", async done => {
         request(app.callback())
            .get(endpoints.user.thread.id(thread.id).page.facebook.id(invalid_uuid))
            .set(jwt)
            .expect(400, "facebook page not found")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("get target facebook page by malfored uuid, should return bad request uuid validation", async done => {
         request(app.callback())
            .get(endpoints.user.thread.id(thread.id).page.facebook.id("_"))
            .set(jwt)
            .expect(400, "uuid validation error at facebook")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("get connected pages by invalid thread id in url, should return 400", async done => {
         request(app.callback())
            .get(endpoints.user.thread.id(invalid_uuid).page.facebook.access)
            .set(jwt)
            .expect(400, "thread not found")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
   });
   describe("test pages deleting", () => {
      let deletedId: string;
      test("delete connected page from thread, should return 204 status code", async done => {
         const index = Math.floor(Math.random() * connected.length);
         const pageId = connected[index].id;
         request(app.callback())
            .del(endpoints.user.thread.id(thread.id).page.facebook.id(pageId))
            .set(jwt)
            .expect(204)
            .end(err => {
               if (err) return done(err);
               deletedId = pageId;
               return done();
            });
      });
      test("after disconnect page from thread, should be deleted abstract page from route /thread/page", async done => {
         request(app.callback())
            .get(endpoints.user.thread.id(thread.id).page.access)
            .set(jwt)
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               const abstractPages = res.body;
               expect(abstractPages).not.toEqual(expect.arrayContaining([{ type: "facebook", pageId: deletedId }]));
               return done();
            });
      });
      test("delete facebook page by invalid id, should return 400 bad request", async done => {
         request(app.callback())
            .del(endpoints.user.thread.id(thread.id).page.facebook.id(invalid_uuid))
            .set(jwt)
            .expect(400, "facebook page not found")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("delete facebook page by malfored uuid, should return bad request uuid validation error", async done => {
         request(app.callback())
            .del(endpoints.user.thread.id(thread.id).page.facebook.id(")"))
            .set(jwt)
            .expect(400, "uuid validation error at facebook")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
   });
});
