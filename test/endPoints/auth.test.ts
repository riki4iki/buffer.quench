import request from "supertest";
import { app } from "../../src/app";
import { dbConnection } from "../../src/config";
import { getConnection, createConnection } from "typeorm";

const endpoints = {
   sign_up: "/api/v1/auth/localAuth/sign-up",
   sign_in: "/api/v1/auth/localAuth/sign-in",
};
beforeAll(async () => {
   await dbConnection();
});

describe("test auth endpoints", () => {
   test("local sign-up", async done => {
      const user = {
         email: "sometestuser@gmail.com",
         password: "123321",
      };
      request(app.callback())
         .post(endpoints.sign_up)
         .send(user)
         .set("Accept", "application/json")
         .expect(201, "success")
         .end((err, res) => {
            if (err) return done(err);
            return done();
         });
   });

   test("local sign-in", async done => {
      const user = {
         email: "sometestuser@gmail.com",
         password: "123321",
      };
      request(app.callback())
         .post(endpoints.sign_in)
         .send(user)
         .set("Accept", "application/json")
         .expect(200)
         .end((err, res) => {
            if (err) return done(err);
            expect(res.body).toHaveProperty("jwt");
            expect(typeof res.body.id).toBe("string");
            expect(res.body.social).toBeInstanceOf(Array);
            expect(res.body.email).toEqual(user.email);
            return done();
         });
   });
   test("local sign-up with exist email, should return 400 email already exist", async done => {
      const user = {
         email: "sometestuser@gmail.com",
         password: "123321",
      };
      request(app.callback())
         .post(endpoints.sign_up)
         .send(user)
         .set("Accept", "application/json")
         .expect(400, "email already exist")
         .end((err, res) => {
            if (err) return done(err);
            return done();
         });
   });
});
describe("test sign-up errors", () => {
   test("sign-up with invalid props(invalid email pattern)", async done => {
      request(app.callback())
         .post(endpoints.sign_up)
         .send({ email: "aeee", password: "123321" })
         .expect(400)
         .end((err, res) => {
            if (err) return done(err);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body[0]).toHaveProperty("property", "email");
            expect(res.body[0]).toHaveProperty("constraints", { isEmail: "email must be an email" });
            return done();
         });
   });
   test("sign-up with invalid props(password less then 6 symbols)", async done => {
      request(app.callback())
         .post(endpoints.sign_up)
         .send({
            email: "google@gmail.com",
            password: ")))",
         })
         .expect(400)
         .end((err, res) => {
            if (err) return done(err);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body[0]).toHaveProperty("property", "password");
            expect(res.body[0]).toHaveProperty("constraints", { length: "password must be longer than or equal to 5 characters" });
            return done();
         });
   });
   test("sign-up with invalid props(empty values)", async done => {
      request(app.callback())
         .post(endpoints.sign_up)
         .send({ email: "", password: "" })
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
});

describe("test sign-in errors", () => {
   const login_password = {
      email: "testtesttest@gmail.com",
      password: "123321",
   };
   test("create user for testing", done => {
      request(app.callback())
         .post(endpoints.sign_up)
         .send(login_password)
         .expect(201, "success")
         .end((err, res) => {
            if (err) return done(err);
            return done();
         });
   });

   test("sign-in with invalid password", async done => {
      request(app.callback())
         .post(endpoints.sign_in)
         .send({ email: login_password.email, password: "incorrect password" })
         .expect(401, "invalid password")
         .end((err, res) => {
            if (err) return done(err);
            return done();
         });
   });
   test("sign-n with invalid email", async done => {
      request(app.callback())
         .post(endpoints.sign_in)
         .send({ email: "invalid_email@gmail.com", password: "no_matter" })
         .expect(401, "invalid email, user does not exist")
         .end((err, res) => {
            if (err) return done(err);
            return done();
         });
   });
});
