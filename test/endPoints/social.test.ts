import { facebook_test_user } from "../config/facebook";
import { dbConnection } from "../../src/config";
import { app } from "../../src/app";
import { getConnection } from "typeorm";
import request from "supertest";

const endpoints = {
   social: "/api/v1/user/social", //get
   facebook: "/api/v1/user/social/facebook", //get, post,del
   facebook_page: "/api/v1/user/social/facebook/page", //get
};
const jwt = {
   access_token: "",
   refresh_token: "",
   expiresIn: 0,
};
beforeAll(async () => {
   await dbConnection();
});
afterAll(async () => {
   await getConnection().close();
});

describe("test social routers....", () => {
   describe("create account for future tests", () => {
      const account = {
         email: "social_test@gmail.com",
         password: "123321",
      };
      test("sign-up - create account for socials tests", async done => {
         request(app.callback())
            .post("/api/v1/auth/localAuth/sign-up")
            .send(account)
            .expect(201, "success")
            .end((err, res) => {
               if (err) return done(err);
               return done();
            });
      });
      test("sign-in - login into account, getting jwt", async done => {
         request(app.callback())
            .post("/api/v1/auth/localAuth/sign-in")
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
   });
   describe("test facebook soical routers", () => {
      test("get facebook socials with new accoutn, should return empty arry", async done => {
         request(app.callback())
            .get(endpoints.facebook)
            .expect(200)
            .set({ access_token: jwt.access_token })
            .end((err, res) => {
               if (err) return done(err);
               expect(typeof res.body).toBe(Array);
               expect(res.body).toEqual([]);
               return done;
            });
      });
      test("add facebook social to account, should return facebook user object with facebook_id, naem,picture", async done => {
         request(app.callback())
            .post(endpoints.facebook)
            .set({ access_token: jwt.access_token })
            .send({ token: facebook_test_user.access_token })
            .expect(201)
            .end((err, res) => {
               if (err) return done(err);
               expect(res.b);
            });
      });
   });
   describe("test connected social routers", () => {});
});
