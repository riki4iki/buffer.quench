import http from "http";
import app from "./app";
import { createConnection, Connection } from "typeorm";

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

createConnection({
  type: "postgres",
  host: "localhost",
  username: process.env.pg_username,
  password: process.env.pg_password,
  database: process.env.pg_database_dev,
  synchronize: true,
  logging: false,
  entities: ["./src/models/**/*.ts"]
})
  .then(() => {
    server.listen(port);
  })
  .catch(err => {
    console.log(err);
  });
