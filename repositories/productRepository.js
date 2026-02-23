import { getDb } from "../db.js";

export async function findAll() {
  const db = await getDb();
  return db.products || [];
}

export async function findById(id) {
  const products = await findAll();
  return products.find((p) => p.id === Number(id));
}
