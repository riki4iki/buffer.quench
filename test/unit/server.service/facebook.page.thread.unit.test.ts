import { user as connectAndCreateUser, facebook_test_user, invalid_uuid } from "../../config";
import { getConnection } from "typeorm";
import { all, connectArrayPages, disconnect, target } from "../../../src/service/thread.service/page.thread/facebook.page/crud"; //for unit trsts
import { all as getAbstractPages } from "../../../src/service/thread.service/page.thread/crud";
import { IFacebookPage } from "../../../src/types/facebook";
import { create as createThread } from "../../../src/service/thread.service/crud"; // for thread creation
import { add as connectSocial } from "../../../src/service/social.service/facebook.social/crud"; // for social connection to user
import { User, Thread, FacebookUser, FacebookPage } from "../../../src/models";
import { insertPagesfromApi } from "../../../src/service/social.service/facebook.social/page"; // getting facebook pages ids

import { BadRequest } from "http-errors";

let user: User;
let thread: Thread; // connection target
let social: FacebookUser; //importand to identify connected facebook pages that they owned by this social
let pages: IFacebookPage[];

beforeAll(async () => {
   user = await connectAndCreateUser({ email: "facebook_pages_tester@test.com", password: "123321" });
   social = await connectSocial(user, facebook_test_user.access_token);
   thread = await createThread(user, { name: "facebook_pages_test_thread" });
   pages = await insertPagesfromApi(social);
});
afterAll(async () => {
   await getConnection().close();
});

describe("facebook pages to thread unit test", () => {
   let pagesId: string[];
   describe("test connection facebook pages to thread", () => {
      test("add facebook pages to thread, should return responsable FacebookPages", async () => {
         const connectedPages = await connectArrayPages(
            thread,
            social,
            pages.map(page => page.id),
         );
         connectedPages.forEach((page, index) => {
            const { id, ...body } = page;
            const associate = pages[index];
            expect(body).not.toMatchObject({ accessToken: expect.any(String) });
            expect(body).toMatchObject({
               fbId: associate.id,
               name: associate.name,
               category: associate.category,
               picture: associate.picture,
            });
         });
         pagesId = connectedPages.map(page => page.id);
      });
      test("after connection to thread, should create raw in Page table", async done => {
         const abstarcts = await getAbstractPages(thread);
         expect(abstarcts.length).toEqual(pages.length);
         abstarcts.forEach((abstarct, index) => {
            expect(abstarct).toMatchObject({
               type: "facebook",
            });
         });
         const abstarctReffs = abstarcts.map(abstract => abstract.pageId);
         console.log(abstarctReffs);
         console.log(pagesId);
         expect(abstarctReffs).toEqual(expect.arrayContaining(pagesId));
         return done();
      });
      test("connect same pages to threadm should return pages from database", async () => {
         const connectedPages = await connectArrayPages(
            thread,
            social,
            pages.map(page => page.id),
         );
         connectedPages.forEach((page, index) => {
            const { id, ...body } = page;
            const associate = pages[index];
            expect(body).not.toMatchObject({ accessToken: expect.any(String) });
            expect(body).toMatchObject({
               fbId: associate.id,
               name: associate.name,
               category: associate.category,
               picture: associate.picture,
            });
         });
      });
      test("try connect incorrect page, should return bad request", async () => {
         const id = ["incorrect identifier_1", "incorrect identifier_2"];
         try {
            await connectArrayPages(thread, social, id);
         } catch (err) {
            expect(err).toEqual(new BadRequest(`input pages: [${id}] are not accounts for user: ${social.id}`));
         }
      });
   });
   describe("test connected facebook pages getting", () => {
      test("get all connected pages, should return FacebookPages[]", async () => {
         const connected = await all(thread);
         connected.forEach((page, index) => {
            const { id, ...body } = page;
            const associate = pages[index];
            expect(body).not.toMatchObject({ accessToken: expect.any(String) });
            expect(body).toMatchObject({
               fbId: associate.id,
               name: associate.name,
               category: associate.category,
               picture: associate.picture,
            });
         });
      });
      test("get target page, should return responsable facebook_page", async () => {
         const index = Math.floor(Math.random() * pagesId.length);
         const id = pagesId[index];
         const associate = pages[index];
         const targetConnected = await target(thread, id);
         expect(targetConnected).toMatchObject({
            id,
            name: associate.name,
            category: associate.category,
            picture: associate.picture,
         });
         expect(targetConnected).not.toMatchObject({ accessToken: expect.any(String) });
      });
      test("try get page with malfored uuid, should return typeorm error", async () => {
         const id = "___";
         const getPromise = target(thread, id);
         expect(getPromise).rejects.toThrow();
      });
      test("try get page with invalid id, should throw bad requser", async () => {
         try {
            await target(thread, invalid_uuid);
         } catch (err) {
            expect(err).toEqual(new BadRequest("facebook page not found"));
         }
      });
   });
   describe("deleting testing facebook pages", () => {
      let deletedId: string;
      test("disconnect page from thread, should return object w/o id property", async () => {
         const index = Math.floor(Math.random() * pagesId.length);
         const id = pagesId[index];
         const associate = pages[index];
         const removed = await disconnect(thread, id);
         expect(removed).toMatchObject({
            id: undefined,
            fbId: associate.id,
         });
         deletedId = id;
      });
      test("after disconnect facebook page, abstarct page must be deleted", async () => {
         const abstarcts = getAbstractPages(thread);
         expect(abstarcts).not.toEqual(expect.arrayContaining([{ pageId: deletedId, type: "facebook" }]));
      });
      test("disconnect facebook page by malfored uuid, should throw err", async () => {
         const malfored = "_";
         const deletePromise = disconnect(thread, malfored);
         expect(deletePromise).rejects.toThrow();
      });
      test("disconnect page by invalid id, should throw bad request", async () => {
         try {
            await disconnect(thread, invalid_uuid);
         } catch (err) {
            expect(err).toEqual(new BadRequest("facebook page not found"));
         }
      });
   });
});
