import { all, get, create, del, update } from "./crud";
import { User } from "../../models";

test("test run users crud", async () => {
   const testUser = new User();
   testUser.email = "ae@gmail.com";
   testUser.password = "12123321313";

   const users = await all();
   expect(users).toBe([]);
});
