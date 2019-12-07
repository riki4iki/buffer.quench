import http from "http";
import app from "./app";
import { dbConnection } from "./config";

import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const port = process.env.PORT || 3000;

const server = http.createServer(app.callback());

server.on("listening", () => {
  console.log(`http server start listen on port: ${port}, pid: ${process.pid}`);
});
server.on("error", err => {
  console.log("server event error, i need handler");
});

dbConnection()
  .then(() => {
    server.listen(port);
  })
  .catch(err => {
    console.log(err);
  });
