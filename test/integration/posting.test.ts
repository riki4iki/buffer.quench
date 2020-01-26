import request from "supertest";
import { getConnection } from "typeorm";

import { app } from "../../src/app";
import { thread as createThread, endpoints } from "../config";
import { IJwtPair } from "../../src/types";

let thread;
let jwt: IJwtPair;
beforeAll(async done => {
   const account = { email: "post/cron/legend_integration_tester@gmail.com", password: "123231" };
   thread = await createThread(account, { name: "post/cron/legend_thread" });
   request(app.callback())
      .post(endpoints.auth.local.sign_in)
      .send(account)
      .expect(200)
      .end((err, res) => {
         if (err) return done(err);
         jwt = res.body.jwt;
         return done();
      });
});
afterAll(async () => {
   await getConnection().close();
});

describe("integration test for post/legend routes", () => {});
