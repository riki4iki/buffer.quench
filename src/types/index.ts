export * from "./facebook";
export * from "./body";
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
export interface ISocial {
   id: string;
   accessToken: string;
   create?: () => Promise<void>;
   del?: () => Promise<void>;
}

export interface ISocialPage {
   id: string;
   accessToken: string;
   post: (token) => Promise<boolean>;
}
export enum SocialType {
   Facebook = "facebook",
   Instagram = "instagram",
   Twitter = "twitter",
}

export interface ICronnable {
   id: string;
   expireDate: Date;
   cb: () => Promise<void>;
}
