import { Context } from "koa";
import { User, Thread } from "models";

export interface IAuthContext extends Context {
   params: {
      id?: string;
   };
   state: {
      session: string;
      user: User;
   };
}
export interface IPostContext extends IAuthContext {
   params: {
      id?: string;
   };
   state: {
      session: string;
      user: User;
      thread: Thread;
   };
}
export interface IContext<T> extends Context {
   state: T;
}
export interface IParamContext<T, V> extends IContext<T> {
   params: V;
}
