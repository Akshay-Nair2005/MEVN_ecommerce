// server/api/users/store.post.js

import User from "../../models/User";
import db from "../../index"; // ⬅ IMPORTANT: Use your existing DB connection

export default defineEventHandler(async (event) => {
  await db(); // ⬅ connect to MongoDB using your existing function

  const body = await readBody(event);
  const { uid, email, name } = body;

  let user = await User.findOne({ uid });

  if (!user) {
    user = await User.create({ uid, email, name });
  }

  return {
    success: true,
    stored: true,
    user,
  };
});
