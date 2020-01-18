import jwt from "../../../src/lib/jwt";
import { dbConnection } from "../../../src/config";
import { invalid_uuid } from "../../config/const";
import { create } from "../../../src/service/user.service/crud";
import { User } from "../../../src/models";
import { IJwtPair } from "../../../src/types";

import { getConnection, QueryFailedError } from "typeorm";
import { Unauthorized } from "http-errors";
const user = {
   email: "test_jwt_user@gmail.com",
   password: "12312123",
};
let created: User;
let pair: IJwtPair;

beforeAll(async () => {
   await dbConnection();
   created = await create(user);
});
afterAll(async () => {
   await getConnection().close();
});

describe("unit test jwt", () => {
   test("create jwt pair, should return object contains access_tokem refresh_token, expiresIn", async () => {
      pair = await jwt.createPair(created);
      expect(pair).toMatchObject({ access_token: expect.any(String), refresh_token: expect.any(String), expiresIn: expect.any(Number) });
   });
   test("create new pair with rewriting session in database and find user relations", async () => {
      pair = await jwt.createPair(created);
      expect(pair).toMatchObject({ access_token: expect.any(String), refresh_token: expect.any(String), expiresIn: expect.any(Number) });
   });
   test("get payload from generated access_token", async () => {
      const payload = await jwt.payload(pair.access_token);
      expect(payload).toMatchObject({
         id: created.id,
         iss: process.env.JWT_ISSUER,
         sub: process.env.JWT_SUBJECT,
         alg: "HS256",
      });
   });
   describe("catch payload errors...", () => {
      test("test payload with empty string", async () => {
         try {
            await jwt.payload("");
         } catch (err) {
            expect(err).toEqual(new Unauthorized("jwt must be provided"));
         }
      });
      test("test payload with malfored token", async () => {
         try {
            const token = pair.access_token;
            await jwt.payload(token.replace(token[0], "_"));
         } catch (err) {
            expect(err).toEqual(new Unauthorized("invalid token"));
            expect(err).not.toEqual(new Unauthorized());
         }
      });
      test("test payload with malfored signature", async () => {
         const token = pair.access_token;
         const result = jwt.payload(token.replace(token[token.length - 1], "_"));

         expect(result).rejects.toThrow(); //idk err.message cause it's random string every time(invalid algoritm, signature, unexpected token)
      });
   });
   describe("test generate pair errors", () => {
      test("try getting pair with empty user identifier(invalid uuid)", async () => {
         try {
            const userInstance = created;
            userInstance.id = "";
            const p = await jwt.createPair(userInstance);
         } catch (err) {
            expect(err).toEqual(new Error('invalid input syntax for type uuid: ""'));
         }
      });
      test("try create session with invalid user uuid", async () => {
         const userInstance = created;
         userInstance.id = invalid_uuid;
         const result = jwt.createPair(userInstance);
         expect(result).rejects.toThrow();
      });
   });
});
