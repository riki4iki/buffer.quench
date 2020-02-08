import { User, Thread, Post, FacebookUser } from "../../models";
export interface IAuthState {
   session: string;
   user: User;
}
export interface IThreadState extends IAuthState {
   thread: Thread;
}
export interface IPostState extends IThreadState {
   post: Post;
}
export interface IParamIdState {
   id?: string;
}
export interface IFaceBookState extends IAuthState {
   social: FacebookUser;
}
export interface ISocialState<T> extends IAuthState {
   social: T;
}
