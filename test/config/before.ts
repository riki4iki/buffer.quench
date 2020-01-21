import { dbConnection } from "../../src/config";
import { IUserBody, IPostBody, IThreadBody } from "../../src/types/body";
import { create as userCreate } from "../../src/service/user.service/crud";
import { create as threadCreate } from "../../src/service/thread.service/crud";
import { create as postCreate } from "../../src/service/thread.service/post.service/crud";

export const connect = async () => {
   return await dbConnection();
};
export const user = async (userBody: IUserBody) => {
   const connection = await connect();
   const user = await userCreate(userBody);
   return user;
};
export const thread = async (userBody: IUserBody, threadBody: IThreadBody) => {
   const created = await user(userBody);
   const thread = await threadCreate(created, threadBody);
   return thread;
};
export const post = async (userBody: IUserBody, threadBody: IThreadBody, postBody: IPostBody) => {
   const created = await thread(userBody, threadBody);
   const post = await postCreate(created, postBody);
   return post;
};
