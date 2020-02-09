/* eslint-disable @typescript-eslint/camelcase */
import request from "supertest";
import { getConnection } from "typeorm";

import { app } from "../../src/app";
import { thread as createThread, endpoints, nextSecond, facebook_test_user, invalid_uuid } from "../config";
import { IJwtPair, IPostBody } from "../../src/types";

const SECONDS = 7;

jest.setTimeout(SECONDS * 2 * 1000);
let thread;
let jwt: IJwtPair;

beforeAll(async done => {
   const account = { email: "post/cron/legend_integration_tester@gmail.com", password: "123231" };
   thread = await createThread(account, { name: "post/cron/legend_thread", dashboarded: false });
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

describe("integration test for post/legend routes", () => {
   const postBody: IPostBody = {
      context: `i_am_from_posting_tests that executed at ${new Date()}`,
      expireDate: nextSecond(SECONDS),
   };
   test("try to create post before page connecting, should return 405 cause it's o sense for posting", async done => {
      request(app.callback())
         .post(endpoints.user.thread.id(thread.id).post.access)
         .set(jwt)
         .expect(405, "No reason to post current thread because no pages connected")
         .end(err => {
            if (err) return done(err);
            return done();
         });
   });
   describe("need connect pages to thread before test post router", () => {
      let socialId: string;
      let pagesId: string[];
      test("add social facebook by access_token from SDK to current user", async done => {
         request(app.callback())
            .post(endpoints.user.social.facebook.access)
            .set(jwt)
            .send({ token: facebook_test_user.access_token })
            .expect(201)
            .end((err, res) => {
               if (err) return done(err);
               const facebookUser = res.body;
               expect(facebookUser).toMatchObject({
                  id: expect.any(String),
                  name: facebook_test_user.name,
                  email: facebook_test_user.email,
                  fbId: facebook_test_user.id,
               });
               expect(facebookUser).not.toHaveProperty("accessToken");
               socialId = facebookUser.id;
               return done();
            });
      });
      test("get facebook pages from api, social/:socialId/page route", async done => {
         request(app.callback())
            .get(endpoints.user.social.facebook.id.page.access(socialId))
            .set(jwt)
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               const iFacebookPages = res.body;
               pagesId = iFacebookPages.map(page => {
                  expect(page).toMatchObject({
                     id: expect.any(String),
                     name: expect.any(String),
                     category: expect.any(String),
                     picture: { data: { height: expect.any(Number), width: expect.any(Number), url: expect.any(String) } },
                  });
                  expect(page).not.toHaveProperty("accessToken");
                  return page.id;
               });
               return done();
            });
      });
      test("add obtained pages to thread, should return 201 with facebook pages instnces", async done => {
         request(app.callback())
            .post(endpoints.user.thread.id(thread.id).page.facebook.access)
            .set(jwt)
            .send({ socialId, pages: pagesId })
            .expect(201)
            .end((err, res) => {
               if (err) return done(err);
               const connectedPages = res.body;
               connectedPages.forEach(page => {
                  expect(page).toMatchObject({
                     id: expect.any(String),
                     fbId: expect.any(String),
                     name: expect.any(String),
                     category: expect.any(String),
                     picture: {
                        data: {
                           width: expect.any(Number),
                           height: expect.any(Number),
                           url: expect.any(String),
                        },
                     },
                  });
               });

               return done();
            });
      });
   });
   describe("test post creation", () => {
      test("create post in current thread, should created post and job by node_shcedule", async done => {
         request(app.callback())
            .post(endpoints.user.thread.id(thread.id).post.access)
            .set(jwt)
            .send(postBody)
            .expect(201)
            .end((err, res) => {
               if (err) return done(err);
               const createdPost = res.body;
               expect(createdPost).toMatchObject({
                  context: postBody.context,
                  id: expect.any(String),
               });
               expect(new Date(createdPost.expireDate)).toEqual(postBody.expireDate);
               expect(createdPost).toHaveProperty("id");
               return done();
            });
      });
      test("create post with same expire Date, should return bad request", async done => {
         request(app.callback())
            .post(endpoints.user.thread.id(thread.id).post.access)
            .set(jwt)
            .send(postBody)
            .expect(400, "target time already used for current thread")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("create post with past time, should return bad request with validation array", async done => {
         request(app.callback())
            .post(endpoints.user.thread.id(thread.id).post.access)
            .set(jwt)
            .send({ context: "12312313131", expireDate: nextSecond(-10) })
            .expect(400, [{ property: "expireDate", constraints: { isFuture: "impossible set date in past time" } }])
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("crete post with empty context, should return 400 bad requset validation array", async done => {
         request(app.callback())
            .post(endpoints.user.thread.id(thread.id).post.access)
            .set(jwt)
            .send({ context: undefined, expireDate: nextSecond(100) })
            .expect(400, [{ property: "context", constraints: { isNotEmpty: "context should not be empty" } }])
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
   });
   let postId: string; // for updating and deleting
   const nextPost: IPostBody = {
      context: "new_context_to_update",
      expireDate: nextSecond(1000),
   };
   describe("test post updating", () => {
      const postAdditional: IPostBody = {
         context: "i am not empty",
         expireDate: nextSecond(100),
      };
      test("create additional post", async done => {
         request(app.callback())
            .post(endpoints.user.thread.id(thread.id).post.access)
            .set(jwt)
            .send(postAdditional)
            .expect(201)
            .end((err, res) => {
               if (err) return done(err);
               const additional = res.body;
               expect(additional).toMatchObject({
                  id: expect.any(String),
                  context: postAdditional.context,
               });
               expect(new Date(additional.expireDate)).toEqual(postAdditional.expireDate);
               postId = additional.id;

               return done();
            });
      });

      test("update new post to new date and context, should return 200", async done => {
         request(app.callback())
            .put(endpoints.user.thread.id(thread.id).post.id(postId))
            .set(jwt)
            .send(nextPost)
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               const updatedPost = res.body;
               expect(updatedPost).toMatchObject({
                  id: postId,
                  context: nextPost.context,
               });
               expect(new Date(updatedPost.expireDate)).toEqual(nextPost.expireDate);

               return done();
            });
      });
      test("update post to exist to budy time by post created in creation test, should return bad requser", async done => {
         request(app.callback())
            .put(endpoints.user.thread.id(thread.id).post.id(postId))
            .set(jwt)
            .send(postBody)
            .expect(400, "target time already used for current thread")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("update post to past time, should return bad request", async done => {
         request(app.callback())
            .put(endpoints.user.thread.id(thread.id).post.id(postId))
            .set(jwt)
            .send({
               context: "12312",
               expireDate: nextSecond(-100),
            })
            .expect(400, [{ property: "expireDate", constraints: { isFuture: "impossible set date in past time" } }])
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("update post to empty context, should return 400 bad request", async done => {
         request(app.callback())
            .put(endpoints.user.thread.id(thread.id).post.id(postId))
            .set(jwt)
            .send({
               context: "",
               expireDate: nextSecond(100),
            })
            .expect(400, [{ property: "context", constraints: { isNotEmpty: "context should not be empty" } }])
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
   });
   describe("test post getting", () => {
      test("get all posts by router thread/:threadId/post, should return array with created before instances of post", async done => {
         request(app.callback())
            .get(endpoints.user.thread.id(thread.id).post.access)
            .set(jwt)
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               const posts = res.body.map(post => {
                  const date = new Date(post.expireDate);
                  return {
                     id: post.id,
                     expireDate: date,
                     context: post.context,
                  };
               });
               expect(posts).toEqual(expect.arrayContaining([{ id: postId, context: nextPost.context, expireDate: nextPost.expireDate }]));
               return done();
            });
      });
      test("get target post by id, should return 200 and created post instance", async done => {
         request(app.callback())
            .get(endpoints.user.thread.id(thread.id).post.id(postId))
            .set(jwt)
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               const post = res.body;

               expect(post).toMatchObject({ id: postId, context: nextPost.context });
               expect(new Date(post.expireDate)).toEqual(nextPost.expireDate);

               return done();
            });
      });
      test("get targte post by invalid id, should return 400 bad request", async done => {
         request(app.callback())
            .get(endpoints.user.thread.id(thread.id).post.id(invalid_uuid))
            .set(jwt)
            .expect(400, "post not found")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("get target post by malfored uuid, should return bad request", async done => {
         request(app.callback())
            .get(endpoints.user.thread.id(thread.id).post.id(")"))
            .set(jwt)
            .expect(400, "uuid validation error at post")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
   });
   describe("test deleting posts", () => {
      test("delete post created before, should return 204", async done => {
         request(app.callback())
            .del(endpoints.user.thread.id(thread.id).post.id(postId))
            .set(jwt)
            .expect(204)
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("delete post by invalid id, should return 400 bad request", async done => {
         request(app.callback())
            .del(endpoints.user.thread.id(thread.id).post.id(invalid_uuid))
            .set(jwt)
            .expect(400, "post not found")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("delete post by malfored uuid, should return 400 nad request", async done => {
         request(app.callback())
            .del(endpoints.user.thread.id(thread.id).post.id("()()()()"))
            .set(jwt)
            .expect(400, "uuid validation error at post")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
   });
   describe("test legend getting. Legend can be created only by server after cron execution, thereby user can only check legends, not create/update/delete", () => {
      let legendId: string;
      test("wait for execution post by cron ,use timers", done => {
         setTimeout(() => {
            request(app.callback())
               .get(endpoints.user.thread.id(thread.id).legend.access)
               .set(jwt)
               .expect(200)
               .end((err, res) => {
                  if (err) return done(err);
                  const legends = res.body.map(legend => {
                     const { expireDate, ...body } = legend;
                     const date = new Date(expireDate);
                     return { ...body, expireDate: date };
                  });
                  expect(legends).toEqual(
                     expect.arrayContaining([
                        { id: expect.any(String), context: postBody.context, expireDate: postBody.expireDate, status: expect.any(Boolean) },
                     ]),
                  );
                  const [legend] = legends;
                  legendId = legend.id;

                  return done();
               });
         }, (SECONDS + 2) * 1000);
      });
      test("get target legend by Id, should return legend instnce with 200 ststus", async done => {
         request(app.callback())
            .get(endpoints.user.thread.id(thread.id).legend.id(legendId))
            .set(jwt)
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               const legend = res.body;

               expect(legend).toMatchObject({
                  id: legendId,
                  context: postBody.context,
                  status: expect.any(Boolean),
               });
               expect(new Date(legend.expireDate)).toEqual(postBody.expireDate);

               return done();
            });
      });
      test("get target legend by invalid id, shoudl return 400 bad request", async done => {
         request(app.callback())
            .get(endpoints.user.thread.id(thread.id).legend.id(invalid_uuid))
            .set(jwt)
            .expect(400, "legend not found")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("get target legend with malfored uuid, should return 400 bad requser", async done => {
         request(app.callback())
            .get(endpoints.user.thread.id(thread.id).legend.id(";;;;"))
            .set(jwt)
            .expect(400, "uuid validation error at legend")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
   });
});
