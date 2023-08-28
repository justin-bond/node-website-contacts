import { MongoClient, ServerApiVersion } from "mongodb";
import * as Sentry from "@sentry/node";

const uri = process.env.DB_URI || "";

const client = new MongoClient(`${uri}`, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db_connect = (onSuccess?: (dbClient: unknown) => void, onError?: any) => {
  const dbName = process.env.DB_NAME || "";
  const dbCollection = process.env.DB_COLLECTION || "";

  return client
    .connect()
    .then((dbClient: MongoClient) => {
      const db = dbClient.db(dbName).collection(dbCollection);

      if (onSuccess) onSuccess(db);

      return db;
    })
    .catch((err) => {
      Sentry.captureException(err);
      if (onError) onError(err);
      return err;
    });
};

// db_connect((success, err) => { })
// or
// db_connect().then().catch()

module.exports = {
  db_connect,
};
