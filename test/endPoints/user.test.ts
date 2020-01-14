import request from "supertest";
import { dbConnection } from "../../src/config";
import { getConnection } from "typeorm";
import { app } from "../../src/app";
import { IJwtPair } from "../../src/types";
const endpoints = {
   user: "/api/v1/user",
   sign_up: "/api/v1/auth/localAuth/sign-up",
   login: "/api/v1/auth/localAuth/sign-in",
};

beforeAll(async () => {
   await dbConnection();
});
afterAll(async () => {
   await getConnection().close();
});

describe("test /user endpoints", () => {
   const account = {
      email: "test_user@test.com",
      password: "123321",
   };
   const jwt: IJwtPair = {
      access_token: "",
      refresh_token: "",
      expiresIn: 0,
   };

   test("create new account for future tests", async done => {
      request(app.callback())
         .post(endpoints.sign_up)
         .send(account)
         .expect(201, "success")
         .end((err, res) => {
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
            expect(res.body.jwt).toHaveProperty("jwt", { access_token: expect(expect.any(String)) });
            jwt.access_token = res.body.jwt.access_token;
            jwt.refresh_token = res.body.jwt.refresh_token;
            jwt.expiresIn = res.body.jwt.expiresIn;
         });
   });

   test("get user with /user", async done => {
      request(app.callback()).get(endpoints.user);
   });
});
