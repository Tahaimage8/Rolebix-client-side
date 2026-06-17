import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing");
}

const client = new MongoClient(uri);
const db = client.db("role");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },

  database: mongodbAdapter(db, {
    client,
  }),

  user: {
    additionalFields: {
      plan: {
        type: "string",
        required: false,
        defaultValue: "seeker_free",
      },
    },
  },

  plugins: [
    admin({
      defaultRole: "seeker",
    }),
  ],
});
