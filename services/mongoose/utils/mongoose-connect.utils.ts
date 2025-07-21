import { Mongoose, connect } from "mongoose";

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not defined in environment`);
  return value;
}

export function openConnection(): Promise<Mongoose> {
  const uri = getEnv("MONGO_URI");
  const username = getEnv("MONGO_INITDB_ROOT_USERNAME");
  const password = getEnv("MONGO_INITDB_ROOT_PASSWORD");
  const dbName = getEnv("MONGO_DB_NAME");

  return connect(uri, {
    auth: { username, password },
    authSource: "admin",
    dbName,
  });
}
