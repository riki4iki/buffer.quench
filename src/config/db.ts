import { createConnection, ConnectionOptions, Connection } from "typeorm";
import { parse } from "pg-connection-string";
import { config } from "dotenv";
config();

const dbString = parse(process.env.DATABASE_URL);
const isDev = () => {
   return process.env.NODE_ENV == "development";
};

const options: ConnectionOptions = {
   type: "postgres",
   host: dbString.host,
   username: dbString.user,
   password: dbString.password,
   database: dbString.database,
   synchronize: true,
   logging: false,
   entities: [...(isDev() ? ["src/models/**/*.ts"] : ["dist/models/**/*.js"])],
   extra: { ssl: !isDev() },
};
const testOptions: ConnectionOptions = {
   type: "postgres",
   host: dbString.host,
   username: dbString.user,
   password: dbString.password,
   database: "database_test",
   synchronize: true,
   dropSchema: true,
   logging: false,
   entities: ["src/models/**/*.ts"],
};

const connect = async (): Promise<Connection> => {
   const opt = process.env.NODE_ENV == "test" ? testOptions : options;
   console.log(opt);
   return await createConnection(opt);
};
export { connect };
