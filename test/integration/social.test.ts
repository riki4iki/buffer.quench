import { facebook_test_user } from "../config/facebook";
import { invalid_uuid } from "../config/const";
import { dbConnection } from "../../src/config";
import { app } from "../../src/app";
import { getConnection } from "typeorm";
import request from "supertest";

const endpoints = {
   social: "/api/v1/user/social", //get
   facebook: "/api/v1/user/social/facebook", //get, post,del
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
      let social_id: string;
      test("get facebook socials with new account, should return empty array", async done => {
         request(app.callback())
            .get(endpoints.facebook)
            .expect(200)
            .set({ access_token: jwt.access_token })
            .end((err, res) => {
               if (err) return done(err);
               expect(res.body).toBeInstanceOf(Array);
               expect(res.body).toEqual([]);
               return done();
            });
      });
      test("try add facebook user by invalid token, should return 400 bad request", async done => {
         request(app.callback())
            .post(endpoints.facebook)
            .send({ token: "invalid token" })
            .set({ access_token: jwt.access_token })
            .expect(400)
            .end((err, res) => {
               if (err) return done(err);
               return done();
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
               expect(res.body).toHaveProperty("name");
               expect(res.body).toHaveProperty("id");
               expect(res.body).toHaveProperty("fbId");
               expect(res.body).toHaveProperty("email");
               expect(res.body).toHaveProperty("picture");
               expect(res.body).not.toHaveProperty("user");
               expect(res.body).not.toHaveProperty("accessToken");
               expect(res.body.name).toEqual(facebook_test_user.name);
               expect(res.body.fbId).toEqual(facebook_test_user.id);
               expect(res.body.email).toEqual(facebook_test_user.email);
               social_id = res.body.id;
               return done();
            });
      });
      test("add facebook soical again, should update social in database and return 201", async done => {
         request(app.callback())
            .post(endpoints.facebook)
            .set({ access_token: jwt.access_token })
            .send({ token: facebook_test_user.access_token })
            .expect(201)
            .end((err, res) => {
               if (err) return done(err);
               expect(res.body).toMatchObject({
                  email: facebook_test_user.email,
                  fbId: facebook_test_user.id,
                  name: facebook_test_user.name,
               });
               return done();
            });
      });
      test("check connected socials after post method, array shouldn't be empty", async done => {
         request(app.callback())
            .get(endpoints.social)
            .send({ access_token: jwt.access_token })
            .set({ access_token: jwt.access_token })
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               expect(res.body).toBeInstanceOf(Array);
               expect(res.body.length).toEqual(1);
               const [social] = res.body;
               expect(social).not.toBeNull();
               expect(social.type).toEqual("facebook");
               expect(social.socialId).toEqual(social_id);
               return done();
            });
      });
      test("check connected facebook_social, array shouldn't be empty, should contain social id, and facebook id", async done => {
         request(app.callback())
            .get(endpoints.facebook)
            .set({ access_token: jwt.access_token })
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               expect(res.body).toBeInstanceOf(Array);
               expect(res.body.length).toEqual(1);
               const [social] = res.body;
               expect(social.id).toEqual(social_id);
               expect(social.fbId).toEqual(facebook_test_user.id);
               return done();
            });
      });
      test("test target get point connected facebook social, should return facebook user object", async done => {
         request(app.callback())
            .get(`${endpoints.facebook}/${social_id}`)
            .set({ access_token: jwt.access_token })
            .expect(200)
            .end((err, res) => {
               if (err) return done(err);
               expect(res.body).toHaveProperty("id");
               expect(res.body).toHaveProperty("fbId");
               expect(res.body).toHaveProperty("email");
               expect(res.body).toHaveProperty("picture");
               expect(res.body.id).toEqual(social_id);
               expect(res.body.name).toEqual(facebook_test_user.name);
               expect(res.body.fbId).toEqual(facebook_test_user.id);
               expect(res.body.email).toEqual(facebook_test_user.email);
               return done();
            });
      });
      test("test target facebook soical with invalid uuid", async done => {
         request(app.callback())
            .get(`${endpoints.facebook}/${invalid_uuid}`)
            .set({ access_token: jwt.access_token })
            .expect(400, "social not found")
            .end((err, res) => {
               if (err) return done(err);
               return done();
            });
      });
      describe("pages geting test", () => {
         test("test facebook pages getting, should return array with facebook_accounts information", async done => {
            request(app.callback())
               .get(`${endpoints.facebook}/${social_id}/page`)
               .set({ access_token: jwt.access_token })
               .expect(200)
               .end((err, res) => {
                  if (err) return done(err);
                  const pages = res.body;
                  expect(pages).toBeInstanceOf(Array);
                  pages.forEach(page => {
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
                     expect(page).not.toHaveProperty("accessToken");
                     expect(page).not.toHaveProperty("fbUser");
                  });
                  return done();
               });
         });
         test("test get added facebook pages to db, should return array with facebook_accounts information from database", async done => {
            request(app.callback())
               .get(`${endpoints.facebook}/${social_id}/page`)
               .set({ access_token: jwt.access_token })
               .expect(200)
               .end((err, res) => {
                  if (err) return done(err);
                  const pages = res.body;
                  expect(pages).toBeInstanceOf(Array);
                  pages.forEach(page => {
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
                     expect(page).not.toHaveProperty("accessToken");
                     expect(page).not.toHaveProperty("fbUser");
                  });
                  return done();
               });
         });
         test("try getting pages from facebook social with invalid uuid", async done => {
            request(app.callback())
               .get(`${endpoints.facebook}/${invalid_uuid}/page`)
               .set({ access_token: jwt.access_token })
               .expect(400, "social not found")
               .end((err, res) => {
                  if (err) return done(err);
                  return done();
               });
         });
      });

      test("test social disconnecting from current user, should return 204", async done => {
         request(app.callback())
            .del(`${endpoints.facebook}/${social_id}`)
            .set({ access_token: jwt.access_token })
            .expect(204)
            .end((err, res) => {
               if (err) return done(err);
               return done();
            });
      });
      test("test social getting after delete, should return 400, bad request", async done => {
         request(app.callback())
            .get(`${endpoints.facebook}/${social_id}`)
            .set({ access_token: jwt.access_token })
            .expect(400, "social not found")
            .end((err, res) => {
               if (err) return done(err);
               return done();
            });
      });
      test("test social getting with malfored uuid, should return 400", async done => {
         request(app.callback())
            .get(`${endpoints.facebook}/'malfored uuid`)
            .set({ access_token: jwt.access_token })
            .expect(400, "uuid validation error")
            .end((err, res) => {
               if (err) return done(err);
               return done();
            });
      });
      test("test social deleting with invalid uuid", async done => {
         request(app.callback())
            .del(`${endpoints.facebook}/${invalid_uuid}`)
            .set({ access_token: jwt.access_token })
            .expect(400)
            .end((err, res) => {
               if (err) return done(err);
               return done();
            });
      });
   });
});
