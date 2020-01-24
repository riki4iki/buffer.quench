import { thread as connectAndCreateThread } from "../../config";
import { getConnection } from "typeorm";

let thread;
beforeAll(async () => {
   thread = await connectAndCreateThread({ email: "facebook_pages_unit_tester@gmail.com", password: "123312" }, { name: "facebook_pages_thread" });
});
afterAll(async () => {
   await getConnection().close();
});

describe("facebook pages to thread unit test", () => {
   test("one test", async () => {
      expect(1).toEqual(1);
   });
});
