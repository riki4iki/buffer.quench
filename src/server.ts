import http from "http";
import app from "./app";

import { dbConnection } from "./config";
import { parse } from "pg-connection-string";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const port = process.env.PORT || 3000;

const server = http.createServer(app.callback());

const url = parse(process.env.DATABASE_URL);

server.on("listening", () => {
  console.log(`http server start listen on port: ${port}, pid: ${process.pid}`);
});
server.on("error", err => {
  console.log("server event error, i need handler");
});
const isDev = process.env.NODE_ENV == "development";

dbConnection()
  .then(() => {
    server.listen(port);
  })
  .catch(err => {
    console.log(err);
  });
