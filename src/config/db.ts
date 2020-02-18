import { createConnection, ConnectionOptions, Connection } from "typeorm";
import { parse } from "pg-connection-string";
import { config } from "dotenv";

config();

console.log(process.env.DATABASE_URL);

const dbString = parse(process.env.DATABASE_URL);
const isDev = () => {
   return process.env.NODE_ENV == "development";
};
const ssl = process.env.DATABASE_SSL === "true";

const options: ConnectionOptions = {
   type: "postgres",
   host: dbString.host,
   username: dbString.user,
   password: dbString.password,
   database: dbString.database,
   synchronize: true,
   logging: false,
   entities: [...(isDev() ? ["src/models/**/*.ts"] : ["dist/models/**/*.js"])],
   extra: { ssl },
};

const connect = async (): Promise<Connection> => {
   console.log(process.env.NODE_ENV);
   console.log(options);
   return await createConnection(options);
};
export { connect };
