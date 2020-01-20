import { dbConnection } from "../../src/config";
import { Connection } from "typeorm";
import { create as userCreate } from "../../src/service/user.service/crud";
import { create as threadCreate } from "../../src/service/thread.service/crud";

export const connectAndCreateUser = async (name: string) => {
   const connection = await dbConnection();
   const user = await userCreate({ email: `${name}_test_user@test.com`, password: "123321" });
   return await user.removePassword();
};
export const connectCreateUserThread = async (name: string) => {
   const connection = await dbConnection();
   const user = await userCreate({ email: `${name}_test_user@test.com`, password: "123321" });
   const thread = await threadCreate(user, { name: "test_thread" });
   return thread;
};
