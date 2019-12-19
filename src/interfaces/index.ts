import { Context } from "koa";
import { User, Thread } from "../models";
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
  params: {
    id?: string;
  };
  state: T;
}
export interface IAuthState {
  session: string;
  user: User;
}
export interface IPostState {
  session: string;
  user: User;
  thread: Thread;
}
export interface IPage {
  id: string;
  accessToken: string;
}
export enum IPageType {
  Facebook = "facebook"
}
