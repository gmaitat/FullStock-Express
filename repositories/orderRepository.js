import { getDb, saveDb, getNextId } from "../db.js";

export async function create(order) {
  const db = await getDb();
  db.orders = db.orders || [];
  const id = await getNextId("orders");
  const newOrder = {
    id,
    ...order,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  db.orders.push(newOrder);
  await saveDb(db);
  return newOrder;
}

export async function findById(id) {
  const db = await getDb();
  if (!db.orders) return null;
  const order = db.orders.find((o) => o.id === Number(id));
  return order || null;
}

export async function updateUserIdByEmail(email, userId) {
  const db = await getDb();
  db.orders = db.orders || [];
  let updated = 0;
  db.orders = db.orders.map((o) => {
    if (o.shippingInfo && o.shippingInfo.email === email && !o.userId) {
      updated += 1;
      return { ...o, userId: Number(userId) };
    }
    return o;
  });
  if (updated > 0) await saveDb(db);
  return updated;
}
