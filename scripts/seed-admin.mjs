import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}

const client = new MongoClient(uri);

const ADMIN_EMAIL = "admin@dars.com";
const ADMIN_PASSWORD = "admin321";
const ADMIN_NAME = "Dars Admin";

async function seed() {
  await client.connect();
  const db = client.db("dars");

  // Remove existing admin if exists
  const existing = await db.collection("user").findOne({ email: ADMIN_EMAIL });
  if (existing) {
    await db.collection("account").deleteMany({
      $or: [{ userId: existing._id }, { accountId: existing._id.toString() }],
    });
    await db.collection("session").deleteMany({ userId: existing._id });
    await db.collection("user").deleteOne({ _id: existing._id });
    console.log("Existing admin removed.");
  }

  const auth = betterAuth({
    database: mongodbAdapter(db, {
      client,
    }),
    emailAndPassword: {
      enabled: true,
    },
  });

  const res = await auth.api.signUpEmail({
    body: {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: ADMIN_NAME,
    },
  });

  console.log("✅ Admin successfully created via Better Auth!");
  console.log("Email:", ADMIN_EMAIL);
  console.log("Password:", ADMIN_PASSWORD);
  console.log("User ID:", res.user.id);
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => client.close());
