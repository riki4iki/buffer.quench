export * from "./facebook";
export * from "./body";
export * from "./koa";
export * from "./err";

export * from "./architecture";

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

export interface ICronnable {
   id: string;
   expireDate: Date;
   cb: () => Promise<void>;
}
