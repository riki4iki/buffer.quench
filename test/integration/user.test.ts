import request from "supertest";
import { connect } from "../config";
import { getConnection } from "typeorm";
import { app } from "../../src/app";
import { IJwtPair } from "../../src/types";

const endpoints = {
   user: "/api/v1/user",
   sign_up: "/api/v1/auth/localAuth/sign-up",
   login: "/api/v1/auth/localAuth/sign-in",
};
const account = {
   email: "test_user@test.com",
   password: "123321",
};
const jwt: IJwtPair = {
   access_token: "",
   refresh_token: "",
   expiresIn: 0,
};

describe("test /user endpoints", () => {
   beforeAll(async () => {
      await connect();
   });
   afterAll(async () => {
      await getConnection().close();
   });
   test("create new account for future tests", async done => {
      request(app.callback())
         .post(endpoints.sign_up)
         .send(account)
         .expect(201, "success")
         .end(err => {
            if (err) return done(err);
            return done();
         });
   });

   test("login... getting tokens", async done => {
      request(app.callback())
         .post(endpoints.login)
         .send(account)
         .expect(200)
         .end((err, res) => {
            if (err) return done(err);
            expect(res.body).toHaveProperty("jwt");
            expect(typeof res.body.jwt.access_token).toBe("string");
            expect(typeof res.body.jwt.refresh_token).toBe("string");
            expect(typeof res.body.jwt.expiresIn).toBe("number");
            jwt.access_token = res.body.jwt.access_token;
            jwt.refresh_token = res.body.jwt.refresh_token;
            jwt.expiresIn = res.body.jwt.expiresIn;
            return done();
         });
   });

   test("get user /user route", async done => {
      request(app.callback())
         .get(endpoints.user)
         .set({ access_token: jwt.access_token, refresh_token: jwt.refresh_token })
         .expect(200)
         .end((err, res) => {
            if (err) return done(err);
            expect(res.body).toHaveProperty("id");
            expect(res.body).toHaveProperty("email");
            expect(res.body).toHaveProperty("social");
            expect(res.body.email).toEqual(account.email);
            expect(res.body.social).toBeInstanceOf(Array);
            return done();
         });
   });
   describe("update user with put method in /useer", () => {
      test("simple update should return 200", async done => {
         request(app.callback())
            .put(endpoints.user)
            .send({
               email: "nextEmail@gmail.com",
               password: "333222",
            })
            .set({ access_token: jwt.access_token, refresh_token: jwt.refresh_token })
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               expect(res.body).toHaveProperty("id");
               expect(res.body).toHaveProperty("email");
               expect(res.body.email).toEqual("nextEmail@gmail.com");
               return done();
            });
      });
      test("update with invalid email, should return Bad request", async done => {
         request(app.callback())
            .put(endpoints.user)
            .send({
               email: "invalid email",
               password: "123321",
            })
            .set({ access_token: jwt.access_token, refresh_token: jwt.refresh_token })
            .expect(400)
            .end((err, res) => {
               if (err) return done(err);
               expect(res.body).toBeInstanceOf(Array);
               expect(res.body[0]).toHaveProperty("property", "email");
               expect(res.body[0]).toHaveProperty("constraints", { isEmail: "email must be an email" });
               return done();
            });
      });
      test("update with invalid password, should return bad request", async done => {
         request(app.callback())
            .put(endpoints.user)
            .send({ email: "aqwsde@gmail.com", password: "()" })
            .set({ access_token: jwt.access_token, refresh_token: jwt.refresh_token })
            .expect(400)
            .end((err, res) => {
               if (err) return done(err);
               expect(res.body).toBeInstanceOf(Array);
               expect(res.body[0]).toHaveProperty("property", "password");
               expect(res.body[0]).toHaveProperty("constraints", { length: "password must be longer than or equal to 5 characters" });
               return done();
            });
      });
      test("update with empty email and password", async done => {
         request(app.callback())
            .put(endpoints.user)
            .send({ email: "", password: "" })
            .set({ access_token: jwt.access_token, refresh_token: jwt.refresh_token })
            .expect(400)
            .end((err, res) => {
               if (err) return done(err);
               expect(res.body).toBeInstanceOf(Array);
               expect(res.body).toEqual(
                  expect.arrayContaining([
                     {
                        property: "email",
                        constraints: {
                           isEmail: "email must be an email",
                        },
                     },
                     {
                        property: "password",
                        constraints: {
                           length: "password must be longer than or equal to 5 characters",
                        },
                     },
                  ]),
               );
               return done();
            });
      });
      test("delete user", async done => {
         request(app.callback())
            .del(endpoints.user)
            .set({ access_token: jwt.access_token, refresh_token: jwt.refresh_token })
            .expect(204)
            .end((err, res) => {
               if (err) return done(err);
               expect(res.body).toEqual({});
               return done();
            });
      });
      test("try get user after deleting, should return 400 bad request", async done => {
         request(app.callback())
            .get(endpoints.user)
            .set({ access_token: jwt.access_token })
            .expect(400, "User doesn't exist with input session")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
   });
});
