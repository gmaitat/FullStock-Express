import { getDb, saveDb, getNextId } from "../db.js";

export async function findByEmail(email) {
  const db = await getDb();
  const users = db.users || [];
  return users.find((u) => u.email === String(email)) || null;
}

export async function create(userData) {
  const db = await getDb();
  db.users = db.users || [];
  const id = await getNextId("users");
  const newUser = { id, ...userData };
  db.users.push(newUser);
  await saveDb(db);
  return newUser;
}
