import { getDb, saveDb, getNextId } from "../db.js";

export async function find(id) {
  const db = await getDb();
  const carts = db.carts || [];
  return carts.find((c) => c.id === Number(id)) || null;
}

export async function create() {
  const db = await getDb();
  db.carts = db.carts || [];
  const id = await getNextId("carts");
  const newCart = { id, items: [] };
  db.carts.push(newCart);
  await saveDb(db);
  return newCart;
}

export async function update(cart) {
  const db = await getDb();
  db.carts = db.carts || [];
  const idx = db.carts.findIndex((c) => c.id === Number(cart.id));
  if (idx >= 0) db.carts[idx] = cart;
  else db.carts.push(cart);
  await saveDb(db);
  return cart;
}
