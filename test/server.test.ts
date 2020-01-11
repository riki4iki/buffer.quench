import request from "supertest";
import app from "../src/app";

afterEach(done => {
   app.emit("close");
   done();
});

test("Hello world works", async () => {
   const response = await request(app.callback()).get("/api/v1/user");
   expect(response.status).toBe(401);
   expect(response.body.data);
});
