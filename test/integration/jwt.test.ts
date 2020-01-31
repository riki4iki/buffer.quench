import { getConnection } from "typeorm";
import request from "supertest";

import { connect, endpoints } from "../config";
import { app } from "../../src/app";

let jwt = {
   access_token: "",
   refresh_token: "",
   expiresIn: 0,
};
beforeAll(async () => {
   await connect();
});
afterAll(async () => {
   await getConnection(process.env.CONNECTION).close();
});

describe("test jwt endpoints/middlewares", () => {
   describe("test jsonwebtoken access to user", () => {
      test("create new account for future tests", async done => {
         request(app.callback())
            .post("/api/v1/auth/localAuth/sign-up")
            .send({ email: "jwt_test@gmail.com", password: "123321" })
            .expect(201, "success")
            .end((err, res) => {
               if (err) return done(err);
               return done();
            });
      });

      test("login... getting tokens", async done => {
         request(app.callback())
            .post("/api/v1/auth/localAuth/sign-in")
            .send({ email: "jwt_test@gmail.com", password: "123321" })
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
      test("get user using jwt", async done => {
         request(app.callback())
            .get("/api/v1/user")
            .set({ access_token: jwt.access_token, refresh_token: jwt.refresh_token })
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               return done();
            });
      });

      test("get user with empty access_token string, should return 401", async done => {
         request(app.callback())
            .get("/api/v1/user/")
            .set({ access_token: "" })
            .expect(401, "jwt must be provided")
            .end((err, res) => {
               if (err) return done(err);
               return done();
            });
      });
      test("get user with malfored token, should return 401", async done => {
         request(app.callback())
            .get("/api/v1/user/")
            .set({ access_token: jwt.access_token.replace(jwt.access_token[0], "123") })
            .expect(401, "invalid token")
            .end((err, res) => {
               if (err) return done(err);
               return done();
            });
      });
      test("get user with malfored signature, should return 401", async done => {
         request(app.callback())
            .get("/api/v1/user/")
            .set({ access_token: jwt.access_token.replace(jwt.access_token[jwt.access_token.length - 1], "123") })
            .expect(401)
            .end((err, res) => {
               if (err) return done(err);
               return done();
            });
      });
   });
   describe("test refresh endpoint", () => {
      test("getting new refresh, should return new jwt pair", async done => {
         setTimeout(() => {
            // create delay cause without return same token with same date cause of little delay
            request(app.callback())
               .post("/api/v1/auth/refresh")
               .set({ refresh_token: jwt.refresh_token })
               .expect(200)
               .end((err, res) => {
                  if (err) return done(err);
                  expect(res.body).toHaveProperty("access_token");
                  expect(res.body).toHaveProperty("refresh_token");
                  expect(res.body).toHaveProperty("expiresIn");
                  expect(res.body.refresh_token).not.toEqual(jwt.refresh_token);
                  return done();
               });
         }, 1000);
      });

      test("refresh with empty token, should return 401", async done => {
         request(app.callback())
            .post("/api/v1/auth/refresh")
            .set({ refresh_token: "" })
            .expect(401, "jwt must be provided")
            .end((err, res) => {
               if (err) return done(err);
               return done();
            });
      });
      test("try to getting new jwt pair usign old refresh token, should return 401 and delete session on server", async done => {
         request(app.callback())
            .post("/api/v1/auth/refresh")
            .set({ refresh_token: jwt.refresh_token })
            .expect(401, "wrong input token")
            .end((err, res) => {
               if (err) return done(err);
               return done();
            });
      });
      test("try to getting new jwt pair after deleting jwt pair on server, should return 401", async done => {
         request(app.callback())
            .post("/api/v1/auth/refresh")
            .set({ refresh_token: jwt.refresh_token })
            .expect(401, "No session with input refresh token")
            .end((err, res) => {
               if (err) return done(err);
               return done();
            });
      });
      test("get new valid refresh token for next tests, shoul return jwt pair by sig_in", async done => {
         request(app.callback())
            .post(endpoints.auth.local.sign_in)
            .send({
               email: "jwt_test@gmail.com",
               password: "123321",
            })
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               const jwtResponse = res.body.jwt;
               expect(jwtResponse).toMatchObject({
                  access_token: expect.any(String),
                  refresh_token: expect.any(String),
                  expiresIn: expect.any(Number),
               });
               jwt = jwtResponse;
               return done();
            });
      });
      test("delete user by access_token, should return 204", async done => {
         request(app.callback())
            .del(endpoints.user.access)
            .set(jwt)
            .expect(204)
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
      test("try to getting new refresh token by access to deleted user(session shouldn't exist in database), should return 401", async done => {
         request(app.callback())
            .post(endpoints.auth.refresh)
            .set(jwt)
            .expect(401, "No session with input refresh token")
            .end(err => {
               if (err) return done(err);
               return done();
            });
      });
   });
});
