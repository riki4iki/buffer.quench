export * from "./facebook";
export * from "./body";
export * from "./validator";
export * from "./koa";
export * from "./error";

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

export interface ISocialPage {
   id: string;
   accessToken: string;
   post: (token) => Promise<boolean>;
}
export enum PageType {
   FacebookPage = "facebook",
   InstagramPage = "instagram",
   TwitterPage = "twitter"
}
export interface ICronnable {
   id: string;
   expireDate: Date;
   cb: () => Promise<void>;
}
