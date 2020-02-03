/* eslint-disable @typescript-eslint/camelcase */
import { add, all, del, get } from "../../../src/service/social.service/facebook.social/crud";
import { insertPagesfromApi } from "../../../src/service/social.service/facebook.social/page";
import { invalid_uuid } from "../../config/const";
import { facebook_test_user } from "../../config/facebook";
import { create } from "../../../src/service/user.service/crud";
import { dbConnection } from "../../../src/config";
import { BadRequest } from "http-errors";

import { getConnection } from "typeorm";
let user;
beforeAll(async done => {
   await dbConnection();
   user = await create({ email: "facebook_social_unit_test_user@gmail.com", password: "123321" });
   return done();
});
afterAll(async done => {
   await getConnection().close();
   return done();
});

describe("unit test facebook soicial crud", () => {
   let socialId: string;
   describe("test connect", () => {
      test("connect social to user", async () => {
         const connected = await add(user, facebook_test_user.access_token);
         expect(connected).toMatchObject({
            user: user,
            id: expect.any(String),
            accessToken: expect.any(String),
         });
         socialId = connected.id;
         const toSocial = await connected.toResponse();
         expect(toSocial).toMatchObject({
            name: facebook_test_user.name,
            email: facebook_test_user.email,
            fbId: facebook_test_user.id,
         });
      });
      test("connect social with invalid token", async () => {
         expect(add(user, "invalid token")).rejects.toThrow();
      });
      test("update social into user", async () => {
         const connected = await add(user, facebook_test_user.access_token);
         const api = await connected.toResponse();
         expect(api).toMatchObject({
            name: facebook_test_user.name,
            email: facebook_test_user.email,
            fbId: facebook_test_user.id,
            id: expect.any(String),
         });
         expect(api).not.toHaveProperty("accessToken");
         expect(api).not.toHaveProperty("user");
      });
   });
   describe("test facebook soical getting", () => {
      test("all social by user", async () => {
         const socials = await all(user);
         socials.forEach(social => {
            expect(social).toMatchObject({
               id: expect.any(String),
               fbId: expect.any(String),
            });
            expect(social).not.toHaveProperty("accessToken");
            expect(social).not.toHaveProperty("user");
         });
      });

      test("get by id", async () => {
         const social = await (await get(user, socialId)).toResponse();
         expect(social).toMatchObject({
            id: socialId,
            fbId: facebook_test_user.id,
            name: facebook_test_user.name,
            email: facebook_test_user.email,
         });
         expect(social).not.toHaveProperty("accessToken");
         expect(social).not.toHaveProperty("user");
      });
      test("get by invalid ", async () => {
         const social = get(user, invalid_uuid);
         expect(social).rejects.toEqual(new BadRequest("social not found"));
      });

      test("get by malfored uuid", async () => {
         const social = get(user, ")");
         expect(social).rejects.toThrow();
      });
   });
   describe("test pages getting from api", () => {
      test("get pages by user", async () => {
         const facebookUser = await get(user, socialId);

         const pages = await insertPagesfromApi(facebookUser);
         pages.forEach(async page => {
            expect(page).toMatchObject({
               id: expect.any(String),
               name: expect.any(String),
               category: expect.any(String),
            });
            expect(page).not.toHaveProperty("accessToken");
            expect(page).not.toHaveProperty("fbUser");
         });
      });
      test("try get pages with invalid access token", async () => {
         const facebookUser = await get(user, socialId);
         facebookUser.accessToken = "_";

         expect(insertPagesfromApi(facebookUser)).rejects.toThrow();
      });
   });
   describe("test delting", () => {
      test("delete by malfored uuid", async () => {
         const social = del(user, "_");
         expect(social).rejects.toThrow();
      });
      test("delete by invalid id, should return bad request", async () => {
         try {
            await del(user, invalid_uuid);
         } catch (err) {
            expect(err).toEqual(new BadRequest("social not found"));
         }
      });
      test("disconnect social", async () => {
         const deleted = await del(user, socialId);
         expect(deleted.id).toBeUndefined();
      });
   });
});
