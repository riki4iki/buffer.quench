import request from "supertest";
import { app } from "../../src/app";
import { dbConnection } from "../../src/config";
import { facebook_test_user, endpoints } from "../config";

import { getConnection } from "typeorm";
beforeAll(async () => {
   await dbConnection();
});

afterAll(async () => {
   await getConnection().close();
});

describe("test facebook authentication", () => {
   test("try facebook auth w/0 connection social before,should return 401", async done => {
      request(app.callback())
         .post(endpoints.auth.facebook.sign_in)
         .send({ token: facebook_test_user.access_token })
         .expect(401, "No accounts in system with that facebook user")
         .end((err, res) => {
            if (err) return done(err);
            return done();
         });
   });
   const account = { email: "facebook_auth_test_user@test.com", password: "12321312" };
   let userId: string;
   let socialId: string;
   describe("before start testing need to create account by local auth and connect facebook social into created acc", () => {
      const jwt = { access_token: "" };
      test("local sign-in", async done => {
         request(app.callback())
            .post(endpoints.auth.local.sign_up)
            .send(account)
            .expect(201)
            .end((err, res) => {
               if (err) return done(err);
               return done();
            });
      });
      test("local sign-in", async done => {
         request(app.callback())
            .post(endpoints.auth.local.sign_in)
            .send(account)
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               expect(res.body.jwt).toHaveProperty("access_token");
               jwt.access_token = res.body.jwt.access_token;
               userId = res.body.id;
               return done();
            });
      });
      test("connect soical", async done => {
         request(app.callback())
            .post(endpoints.user.social.facebook.access)
            .send({ token: facebook_test_user.access_token })
            .set({ access_token: jwt.access_token })
            .expect(201)
            .end((err, res) => {
               if (err) return done(err);
               socialId = res.body.id;
               return done();
            });
      });
   });
   describe("auth by facebook", () => {
      test("auth by facebook token, should return jwt pair", async done => {
         request(app.callback())
            .post(endpoints.auth.facebook.sign_in)
            .send({ token: facebook_test_user.access_token })
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);

               expect(res.body).toMatchObject({
                  id: userId,
                  email: account.email,
                  social: [{ socialId: socialId }],
               });
               expect(res.body.jwt).toHaveProperty("access_token");
               expect(res.body.jwt).toHaveProperty("refresh_token");
               expect(res.body.jwt).toHaveProperty("expiresIn");
               return done();
            });
      });
      test("auth by invalid facebook access_token", async done => {
         request(app.callback())
            .post(endpoints.auth.facebook.sign_in)
            .send("invalid_access_token")
            .expect(400)
            .end((err, res) => {
               if (err) return done(err);
               return done();
            });
      });
      describe("create additional account and connect social", () => {});
   });
});
