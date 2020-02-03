/* eslint-disable @typescript-eslint/camelcase */
import request from "supertest";
import { app } from "../../src/app";
import { getConnection } from "typeorm";
import { user as createAndConnect, endpoints, invalid_uuid } from "../config";
import { IJwtPair } from "../../src/types";
let jwt: IJwtPair;
const account = {
   email: "thread_tester@gmail.com",
   password: "123321",
};

beforeAll(async done => {
   await createAndConnect(account);
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

describe("integration tests thread routes", () => {
   let thread_id: string;
   const thread_name = "thread_to_test";
   describe("thread create tests, return instance thread or error", () => {
      test("create thread by post method, should return thread with 201", async done => {
         request(app.callback())
            .post(endpoints.user.thread.access)
            .send({ name: thread_name })
            .set(jwt)
            .expect(201)
            .end((err, res) => {
               if (err) return done(err);
               expect(res.body).toMatchObject({
                  id: expect.any(String),
                  name: thread_name,
               });
               expect(res.body).not.toMatchObject({
                  user: expect.any(Object),
               });
               thread_id = res.body.id;
               return done();
            });
      });
      test("create thread with unvalidated name, shoudl return 400 status", async done => {
         request(app.callback())
            .post(endpoints.user.thread.access)
            .send({ name: "_" })
            .set(jwt)
            .expect(400, [{ property: "name", constraints: { minLength: "Thread name is too short, min size is 6 symbols" } }])
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("create thread with same name, should return 400 cause of name must be unique value", async done => {
         request(app.callback())
            .post(endpoints.user.thread.access)
            .send({ name: thread_name })
            .set(jwt)
            .expect(400, `thread with name '${thread_name}' already exist`)
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
   });
   describe("test thread getting(target get, get all threads)", () => {
      test("getting all thread by current user, should return thread array(with 1 thread created before)", async done => {
         request(app.callback())
            .get(endpoints.user.thread.access)
            .set(jwt)
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               expect(res.body).toEqual(expect.arrayContaining([{ id: thread_id, name: thread_name }]));
               return done();
            });
      });
      test("get target thread by id, should return thread instance created before", async done => {
         request(app.callback())
            .get(endpoints.user.thread.id(thread_id).access)
            .set(jwt)
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               expect(res.body).toMatchObject({
                  id: thread_id,
                  name: thread_name,
               });
               return done();
            });
      });
      test("get target thread by invalid identifier, should return 400 bad request", async done => {
         request(app.callback())
            .get(endpoints.user.thread.id(invalid_uuid).access)
            .set(jwt)
            .expect(400, "thread not found")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("get thread by malfored uuid, should retund bad requser", async done => {
         request(app.callback())
            .get(endpoints.user.thread.id(")").access)
            .set(jwt)
            .expect(400, "uuid validation error at thread")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
   });
   describe("test thread updating, shoult return theads object or error statuses", () => {
      const next_name = " next_thread_name";
      test("update thread by new name, should return 200 + thread instance", async done => {
         request(app.callback())
            .put(endpoints.user.thread.id(thread_id).access)
            .set(jwt)
            .send({ name: next_name })
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               expect(res.body).toMatchObject({
                  id: thread_id,
                  name: next_name,
               });
               return done();
            });
      });
      const name = "unique_name";
      test("create new thread for next update tests", async done => {
         request(app.callback())
            .post(endpoints.user.thread.access)
            .set(jwt)
            .send({ name })
            .expect(201)
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("update thread to used name, should return 400, before need create new thread", async done => {
         request(app.callback())
            .put(endpoints.user.thread.id(thread_id).access)
            .set(jwt)
            .send({ name })
            .expect(400, `thread with name: '${name}' already exist`)
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("update thread with invalid name(less then 6 symbols), should return 400 Bad Requesr", async done => {
         request(app.callback())
            .put(endpoints.user.thread.id(thread_id).access)
            .set(jwt)
            .send({ name: "_" })
            .expect(400, [{ property: "name", constraints: { minLength: "Thread name is too short, min size is 6 symbols" } }])
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("update thread with invalid identifier, should return 400 bad requesr", async done => {
         request(app.callback())
            .put(endpoints.user.thread.id(invalid_uuid).access)
            .set(jwt)
            .send("namename")
            .expect(400, "uuid validation error at thread")
            .end(err => {
               if (err) return done();
               return done();
            });
      });
   });
   describe("test thread deleting", () => {
      test("delete thread by id, should return 204 status code", async done => {
         request(app.callback())
            .del(endpoints.user.thread.id(thread_id).access)
            .set(jwt)
            .expect(204)
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("delete thread by invalud id, should return 400 bad request (not found)", async done => {
         request(app.callback())
            .del(endpoints.user.thread.id(invalid_uuid).access)
            .set(jwt)
            .expect(400, "thread not found")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
   });
});
