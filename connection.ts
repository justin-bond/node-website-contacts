import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.DB_URI || "";

const client = new MongoClient(`${uri}`, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db_connect = (onSuccess?: (dbClient: unknown) => void, onError?: any) => {
  return client
    .connect()
    .then((dbClient: MongoClient) => {
      const db = dbClient.db("website").collection("contacts");

      if (onSuccess) onSuccess(db);

      return db;
    })
    .catch((err) => {
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
