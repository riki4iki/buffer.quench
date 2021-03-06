/* eslint-disable @typescript-eslint/camelcase */
import { all, get, create, del, update } from "../../../src/service/user.service/crud";
import { invalid_uuid, connect } from "../../config";
import { User } from "../../../src/models";
import { BadRequest } from "http-errors";
import { getConnection } from "typeorm";

beforeAll(async done => {
   await connect();
   return done();
});
afterAll(async done => {
   await getConnection().close();
   return done();
});

describe("user crud unit test", () => {
   describe("testing basic create/read/update/delete work", () => {
      let userId: string;
      const firstBody = {
         email: "someEmail@gmail.com",
         password: "123321",
      };
      const nextBody = {
         email: "nextEmail@gmail.com",
         password: "88005553535",
      };
      test("get all user from database(useless method now but already written), should return empty array", async () => {
         const users = await all();
         expect(users).toEqual([]);
      });

      test("basic CRUD creating new user", async () => {
         const user = await create(firstBody);
         expect(user).toBeInstanceOf(User);
         expect(user.email).toBe(firstBody.email);
         expect(typeof user.id).toBe("string");
         expect(typeof user.password).toBe("string");
         userId = user.id;
      });
      test("basic CRUD updating created user", async () => {
         const updated = await update(userId, nextBody);
         expect(updated.email).not.toBe(firstBody.email);
         expect(updated.email).toBe(nextBody.email);
         expect(updated).toBeInstanceOf(User);
         expect(typeof updated.id).toBe("string");
         expect(typeof updated.password).toBe("string");
      });

      test("basic CRUD getting user with", async () => {
         const user = await get(userId);
         expect(user).toBeInstanceOf(User);
         expect(user).not.toBe(null);
      });
      test("User CRUD deleting user", async () => {
         const removed = await del(userId);
         expect(removed).toBeInstanceOf(Object);
         expect(typeof removed.id).toBe("undefined");
      });
   });

   describe("testing user creating", () => {
      const body = {
         email: "test@test.com",
         password: "123321",
      };
      test("create. must return User instance", async () => {
         const user = await create(body);
         expect(user).toBeInstanceOf(User);
         expect(user).not.toBe(null);
      });
      test("next user with same email, must throw error with badRequest('email already exist')", async () => {
         expect(create(body)).rejects.toEqual(new BadRequest("email already exist"));
      });
      test("create user with invalid(empty strings) properties", async () => {
         const body = { email: "", password: "" };
         expect(create(body)).rejects.toThrow();
      });
      test("create user with invalid email(tot email pattern)", async () => {
         const body = {
            email: "fadadgfafsdfsdf",
            password: "123231",
         };
         expect(create(body)).rejects.toThrow();
      });
      test("crete user with invalid password(less then 6 symbols", async () => {
         const bode = {
            email: "test@test.com",
            password: "1",
         };
         expect(create(bode)).rejects.toThrow();
      });
   });

   describe("testing user updating", () => {
      const first = {
         email: "first@gmail.com",
         password: "123321",
      };
      const second = {
         email: "second@gmail.com",
         password: "nextPsswaewe",
      };

      test("update user with exist email, should throw error with bad request", async () => {
         await create(first);
         const secondUser = await create(second);
         expect(update(secondUser.id, first)).rejects.toEqual(new BadRequest("email already exist"));
      });
   });
   describe("testing update errors", () => {
      let id: string;
      test("create user for test update in future", async () => {
         const body = {
            email: "someUser@gmail.com",
            password: "123321",
         };
         const user = await create(body);
         expect(user).toBeInstanceOf(User);
         id = user.id;
      });

      test("update with invalid properties(pass less then 6 symbols)", async () => {
         const body = {
            email: "someUser@gmail.com",
            password: "1",
         };
         const updated = update(id, body);
         expect(updated).rejects.toThrow();
      });
      test("update with invalid properties(empty strings)", async () => {
         const body = { email: "", password: "" };
         const updated = update(id, body);
         expect(updated).rejects.toThrow();
      });
      test("update with invalid properties(not email pattern)", async () => {
         const body = {
            email: "aeeeeeeeeeeeeeee",
            password: "123321",
         };
         const updated = update(id, body);
         expect(updated).rejects.toThrow();
      });

      test("update with invalid identifier(not uuid)", async () => {
         const body = {
            email: "nextEmail@gmail.com",
            password: "longlongpassword",
         };
         const updated = update(invalid_uuid, body);
         expect(updated).rejects.toEqual(new BadRequest("user doesn't exist"));
      });
   });
   describe("testing user getting/removing", () => {
      const first = {
         email: "some_user@gmail.com",
         password: "some_password",
      };
      let id: string;
      test("create user and getting id", async () => {
         const user = await create(first);
         expect(user).toBeInstanceOf(User);
         id = user.id;
      });
      test("getting user", async () => {
         const user = await get(id);
         expect(user).not.toBe(null);
         expect(user).toBeInstanceOf(User);
      });
      test("getting user with invalid uuid", async () => {
         const user = get("123");
         expect(user).rejects.toThrow();
      });
      test("getting user with invaid idetifier", async () => {
         const user = get(invalid_uuid);
         expect(user).rejects.toEqual(new BadRequest("User doesn't exist with input session"));
      });
      test("delete user with invalid id", async () => {
         const removed = del(invalid_uuid);
         expect(removed).rejects.toEqual(new BadRequest("user doesn't exist"));
      });
      test("delete user with valid id", async () => {
         const removed = await del(id);
         expect(removed).toBeInstanceOf(Object);
         expect(typeof removed.id).toBe("undefined");
         expect(typeof removed.email).toBe("string");
         expect(typeof removed.password).toBe("string");
         expect(removed.email).toBe(first.email);
      });
   });
});
