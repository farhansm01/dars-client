import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

declare global {
  var _mongoClient: MongoClient | undefined;
}

const client =
  globalThis._mongoClient ||
  new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalThis._mongoClient = client;
}

export const db = client.db("dars");
export { client };
