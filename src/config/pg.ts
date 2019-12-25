import { createConnection, ConnectionOptions } from "typeorm";
import { parse } from "pg-connection-string";
import { config } from "dotenv";
config();

const dbString = parse(process.env.DATABASE_URL);

const isDev = process.env.NODE_ENV == "development";

const options: ConnectionOptions = {
  type: "postgres",
  host: dbString.host,
  username: dbString.user,
  password: dbString.password,
  database: dbString.database,
  synchronize: true,
  logging: false,
  entities: [...(isDev ? ["src/models/**/*.ts"] : ["dist/models/**/*.js"])],
  extra: { ssl: !isDev }
};

const connect = async () => createConnection(options);
export { connect };
