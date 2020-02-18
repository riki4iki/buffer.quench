import { ConnectionOptions, Connection, createConnection } from "typeorm";
import { parse } from "pg-connection-string";
import { config } from "dotenv";

config();

const parsed = parse(process.env.DATABASE_URL);

const options: ConnectionOptions = {
   type: "postgres",
   host: parsed.host,
   username: parsed.user,
   password: parsed.password,
   database: "test",
   synchronize: true,
   dropSchema: true,
   logging: false,
   entities: ["src/models/**/*.ts"],
};

const connect = async (): Promise<Connection> => {
   return createConnection(options);
};
export { connect };
