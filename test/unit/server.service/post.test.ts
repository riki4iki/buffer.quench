/* eslint-disable @typescript-eslint/camelcase */
import { nextMinutes, invalid_uuid, thread as createThread } from "../../config";
import { create, del, post, posts, update } from "../../../src/service/thread.service/post.service/crud";
import { getConnection } from "typeorm";
import { BadRequest } from "http-errors";

let thread;
beforeAll(async done => {
   thread = await createThread({ email: "post_unit_test@test.com", password: "123321" }, { name: "post_test_thread" });
   return done();
});
afterAll(async done => {
   await getConnection().close();
   return done();
});

describe("unit test post crud", () => {
   const context = "some_text_for_post";
   const expireDate: Date = nextMinutes(2);
   let postId: string;
   describe("post creating test", () => {
      test("create post", async () => {
         const post = await create(thread, { context, expireDate });
         expect(post).toMatchObject({
            id: expect.any(String),
            context,
            expireDate,
         });
         expect(post).not.toHaveProperty("thread", "user");
         postId = post.id;
      });
      test("create post with same date, should return 400, date must be unique", async () => {
         try {
            await create(thread, { context, expireDate });
         } catch (err) {
            expect(err).toEqual(new BadRequest("target time already used for current thread"));
         }
      });
      test("create post with empty contect, should return validation array", async () => {
         try {
            await create(thread, { expireDate, context: "" });
         } catch (err) {
            expect(err).toMatchObject({
               validationArray: [{ property: "context", constraints: { isNotEmpty: "context should not be empty" } }],
            });
         }
      });
      test("create post with past time, should return validation array", async () => {
         try {
            await create(thread, { context, expireDate: nextMinutes(-1) });
         } catch (err) {
            expect(err).toMatchObject({
               validationArray: [{ property: "expireDate", constraints: { isFuture: "impossible set date in past time" } }],
            });
         }
      });
   });
   describe("test post getting", () => {
      test("get post by id", async () => {
         const target = await post(thread, postId);
         expect(target).toMatchObject({ context, expireDate });
      });
      test("get post by invalid id, should throw bad request", async () => {
         try {
            await post(thread, invalid_uuid);
         } catch (err) {
            expect(err).toEqual(new BadRequest("post not found"));
         }
      });
      test("get post by malfored uuid, should throw err from typerom", async () => {
         expect(post(thread, "_")).rejects.toThrow();
      });
      test("get all post by thread, should return array, that contain created post", async () => {
         const all = await posts(thread);
         expect(all).toEqual(expect.arrayContaining([{ context, expireDate, id: postId }]));
      });
   });
   describe("test post update", () => {
      const nextDate = nextMinutes(5);
      test("update post, should return created post", async () => {
         const updated = await update(thread, postId, { context: "some_next_context", expireDate: nextDate });
         expect(updated).toMatchObject({ id: postId });
         expect(updated).not.toMatchObject({ context, expireDate });
      });
      test("update post with invalid identifier, should throw bad request", async () => {
         try {
            await update(thread, invalid_uuid, { expireDate, context });
         } catch (err) {
            expect(err).toEqual(new BadRequest("post not found"));
         }
      });
      test("try create new post and update to used date, should return bad request", async () => {
         try {
            const created = await create(thread, { context, expireDate: nextMinutes(100) });
            await update(thread, created.id, { context, expireDate: nextDate });
         } catch (err) {
            expect(err).toEqual(new BadRequest("target time already used for current thread"));
         }
      });
      test("try update date to past time, should return validation array", async () => {
         try {
            await update(thread, postId, { context, expireDate: nextMinutes(-100) });
         } catch (err) {
            expect(err).toMatchObject({
               validationArray: [{ property: "expireDate", constraints: { isFuture: "impossible set date in past time" } }],
            });
         }
      });
      test("update context to empty string, should return validation array", async () => {
         try {
            const date = nextMinutes(111);
            await update(thread, postId, { expireDate: date, context: "" });
         } catch (err) {
            expect(err).toMatchObject({
               validationArray: [{ property: "context", constraints: { isNotEmpty: "context should not be empty" } }],
            });
         }
      });
   });
   describe("test deleting", () => {
      test("delete post, should return post object w/o id", async () => {
         const removed = await del(thread, postId);
         expect(removed).toMatchObject({ id: undefined });
         expect(removed).toHaveProperty("expireDate");
         expect(removed).toHaveProperty("context");
      });
      test("delete post with invalid identifier, should return bad request", async () => {
         try {
            await del(thread, postId);
         } catch (err) {
            expect(err).toEqual(new BadRequest("post not found"));
         }
      });
      test("delete post with invalid uuid, should throw error", async () => {
         const removePromise = del(thread, postId);
         expect(removePromise).rejects.toThrow();
      });
   });
});
