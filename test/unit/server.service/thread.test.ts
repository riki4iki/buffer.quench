import { getConnection } from "typeorm";
import { all, create, del, get, update } from "../../../src/service/thread.service/crud";
import { invalid_uuid, user as createUser } from "../../config";
import { BadRequest } from "http-errors";
let user;
beforeAll(async () => {
   user = await createUser({ email: "thread_unit_test@gmail.test", password: "123321" });
});
afterAll(async () => {
   await getConnection().close();
});

describe("unit test thread cruds", () => {
   const name: string = "test_thread";
   let threadId: string;
   describe("test thread creating", () => {
      test("create thread, should retur nthread object", async () => {
         const thread = await create(user, { name });

         expect(thread).toMatchObject({
            id: expect.any(String),
            name: name,
         });
         threadId = thread.id;
      });
      test("create thread with same name, should throw badrequest cause name must be unique value", async () => {
         try {
            const thread = await create(user, { name });
         } catch (err) {
            expect(err).toEqual(new BadRequest(`thread with name '${name}' already exist`));
         }
      });
      test("create thread with string less then 6, should throw bad request", async () => {
         try {
            await create(user, { name: "____" });
         } catch (err) {
            expect(err).toMatchObject({
               message: "Bad Request",
               validationArray: [{ property: "name", constraints: { minLength: "Thread name is too short, min size is 6 symbols" } }],
            });
         }
      });
      test("create thread with string more then 30, should throw bad request", async () => {
         try {
            await create(user, { name: [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join("") });
         } catch (err) {
            expect(err).toMatchObject({
               message: "Bad Request",
               validationArray: [{ property: "name", constraints: { minLength: "Thread name is too long, max size is 30 symbols" } }],
            });
         }
      });
   });
   describe("test thread getting", () => {
      test("getting thread by Id", async () => {
         const thread = await get(user, threadId);
         expect(thread).toMatchObject({ name, id: threadId });
         expect(thread).not.toHaveProperty("user");
      });
      test("getting by invalid id", async () => {
         try {
            const thread = await get(user, invalid_uuid);
         } catch (err) {
            expect(err).toEqual(new BadRequest("thread not found"));
         }
      });
      test("getting thread by malfored uuid", async () => {
         const thread = get(user, "__UUID__");
         expect(thread).rejects.toThrow();
      });
      test("getting all threads by current user, should return array with created object", async () => {
         const threads = await all(user);
         expect(threads).toEqual(expect.arrayContaining([{ id: threadId, name }]));
      });
   });
   describe("test updating thread", () => {
      test("update thread, should return 200", async () => {
         const next_name: string = "next_thread_name";
         const thread = await update(user, threadId, { name: next_name });
         expect(thread).toMatchObject({ id: threadId, name: next_name });
      });
      test("update thread with existing name, should return 400", async () => {
         const crossName: string = "cross_name";
         const created = await create(user, { name: crossName });
         try {
            await update(user, threadId, { name: crossName });
         } catch (err) {
            expect(err).toEqual(new BadRequest(`thread with name: '${crossName}' already exist`));
         }
      });
      test("update with invalid id, shoudl return 400", async () => {
         try {
            await update(user, invalid_uuid, { name: "no_difference" });
         } catch (err) {
            expect(err).toEqual(new BadRequest("thread not found"));
         }
      });
      test("update with invalid name(less then 6), should return bad request", async () => {
         try {
            await update(user, threadId, { name: "____" });
         } catch (err) {
            expect(err).toMatchObject({
               message: "Bad Request",
               validationArray: [{ property: "name", constraints: { minLength: "Thread name is too short, min size is 6 symbols" } }],
            });
         }
      });
      test("update with invalid name(more then 30), shold return bad request", async () => {
         try {
            await update(user, threadId, { name: [...Array(30)].map(i => (~~(Math.random() * 36)).toString(36)).join("") });
         } catch (err) {
            expect(err).toMatchObject({
               message: "Bad Request",
               validationArray: [{ property: "name", constraints: { minLength: "Thread name is too long, max size is 30 symbols" } }],
            });
         }
      });
   });
   describe("test deleting", () => {
      test("delete thread", async () => {
         const removed = await del(user, threadId);
         expect(removed).toMatchObject({
            id: undefined,
         });
      });
      test("delete unexisting thread, should throw bad request", async () => {
         try {
            await del(user, threadId);
         } catch (err) {
            expect(err).toEqual(new BadRequest("thread not found"));
         }
      });
   });
});
