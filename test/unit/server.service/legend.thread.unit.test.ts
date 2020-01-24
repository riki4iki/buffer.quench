import { all, create, del, get } from "../../../src/service/thread.service/legend.service/crud";
import { getConnection } from "typeorm";
import { invalid_uuid, post as postCreate, nextSecond, nextMinutes } from "../../config";
import { BadRequest } from "http-errors";
let post;
const SECONDS = 2;
beforeAll(async done => {
   post = await postCreate(
      { email: "legend_unit_tester@test.com", password: "123312" },
      { name: "legend_thread_test" },
      { context: "legend", expireDate: nextSecond(SECONDS) },
   );
   return done();
});
afterAll(async done => {
   await getConnection().close();
   return done();
});

//legend can be created only with past input date
describe("legend unit test", () => {
   const result = true;
   let id: string;
   describe("create legend describe unit test", () => {
      test("create legent with future time, should return validatino array", async () => {
         try {
            await create(post, result);
         } catch (err) {
            expect(err).toEqual(
               expect.arrayContaining([
                  {
                     property: "expireDate",
                     constraints: { isPast: "impossible set date in past time" },
                     value: post.expireDate,
                     children: [],
                     target: {
                        context: post.context,
                        expireDate: post.expireDate,
                        status: result,
                        thread: post.thread,
                     },
                  },
               ]),
            );
         }
      });
      test("create legend, should return legend object", async done => {
         setTimeout(async () => {
            const legend = await create(post, result);
            expect(legend).toMatchObject({
               id: expect.any(String),
               context: post.context,
               expireDate: post.expireDate,
            });
            expect(legend).not.toHaveProperty("thread", "user");
            id = legend.id;
            return done();
         }, SECONDS * 1000);
      });
   });
   describe("test legend getting", () => {
      test("get target legend, should return object", async () => {
         const legend = await get(post.thread, id);
         console.log(legend);
         expect(legend).toMatchObject({
            id,
            expireDate: post.expireDate,
            context: post.context,
            status: result,
         });
         expect(legend).not.toHaveProperty("thread", "user");
      });
      test("get legend with invalid id", async () => {
         try {
            await get(post.thread, invalid_uuid);
         } catch (err) {
            expect(err).toEqual(new BadRequest("legend not found"));
         }
      });
      test("get legend with malfored uuid", async () => {
         const getPromise = get(post.thread, ")");
         expect(getPromise).rejects.toThrow();
      });
      test("get all legend", async () => {
         const legends = await all(post.thread);
         expect(legends).toEqual(expect.arrayContaining([{ id, context: post.context, expireDate: post.expireDate, status: result }]));
      });
   });
   describe("test deleting legend", () => {
      test("delete legend, should return object with undefined identifier", async () => {
         const removed = await del(post.thread, id);
         expect(removed).toMatchObject({ id: undefined, context: post.context, expireDate: post.expireDate, status: result });
      });
      test("try delete legend with invalid id", async () => {
         try {
            await del(post.thread, invalid_uuid);
         } catch (err) {
            expect(err).toEqual(new BadRequest("legend not found"));
         }
      });
      test("try delete with malfored id", async () => {
         const delPromise = del(post.thread, "(");
         expect(delPromise).rejects.toThrow();
      });
   });
});
