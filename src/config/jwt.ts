import dotenv from "dotenv";
dotenv.config();
export interface IJwt {
   secret: string;
   accessLife: number;
   refreshLife: number;
   issuer: string;
   subject: string;
   jti: string;
   alg: string;
}
const generateJTI = (range: string): string => {
   let jti = "";
   let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   for (let i = 0; i < parseInt(range); i++) {
      jti += possible.charAt(Math.floor(Math.random() * possible.length));
   }
   return jti;
};
const isDev = process.env.NODE_ENV === "development";
const ONE_DAY_SECCONDS: number = 84600;
const config: IJwt = {
   secret: process.env.JWT_TOKEN_SECRET,
   accessLife: isDev ? ONE_DAY_SECCONDS : ONE_DAY_SECCONDS / 4,
   refreshLife: isDev ? ONE_DAY_SECCONDS * 2 : ONE_DAY_SECCONDS * 60,
   issuer: process.env.JWT_ISSUER,
   subject: process.env.JWT_SUBJECT,
   jti: generateJTI(process.env.JWT_JTI_RANGE),
   alg: "HS256",
};
export { config };
