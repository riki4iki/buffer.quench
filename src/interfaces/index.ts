import { Context } from "koa";
import { User, Thread, FacebookPage, Post } from "../models";
import { BadRequest } from "http-errors";
export interface IPayload {
  id: string;
  jti: string;
  iss: string;
  sub: string;
  alg: string;
}
export interface IJwtPair {
  access_token: string;
  refresh_token: string;
  expiresIn: number;
}

export interface IFacebookPage {
  id: string;
  access_token: string;
  name: string;
  tasks: Array<string>;
  cover: {
    cover_id: string;
    offset_x: number;
    offset_y: number;
    source: string;
    id: string;
  };
  category: string;
}

export interface IFacebookUser {
  id: string;
  name: string;
  email: string;
  picture: {
    data: {
      height: number;
      width: number;
      url: string;
      is_silhouette: boolean;
    };
  };
}
export interface ILongLiveUserToken {
  access_token: string;
  token_type: string;
}
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

export interface ISocialPage {
  id: string;
  accessToken: string;
  post: (token) => Promise<void>;
}
export enum PageType {
  FacebookPage = "facebook",
  InstagramPage = "instagram",
  twitterPage = "twitter"
}
export interface ICronnable {
  id: string;
  expireDate: Date;
}
export class NoContent extends Error {
  status = 204;
}
export interface IValidationError {
  property: string;
  constraints: Object;
}
export class ValidationRequest extends BadRequest {
  result: Array<IValidationError>;
}
