const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

// const uri = env.process.MONGODB_URI;
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGO_DB_URI is missing");
}


const client = new MongoClient(uri);
const db = client.db("role");

export const auth = betterAuth({
      emailAndPassword: { 
    enabled: true, 
      autoSignIn: false,
  }, 
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
});