import { jwtConfig } from "../../../src/config";
import { config } from "dotenv";
config();

describe("test jwt config", () => {
   test("test object", async () => {
      expect(jwtConfig).toMatchObject({
         issuer: process.env.JWT_ISSUER,
         subject: process.env.JWT_SUBJECT,
         alg: "HS256",
      });
      expect(jwtConfig.jti).toHaveLength(parseInt(process.env.JWT_JTI_RANGE));
   });
});
