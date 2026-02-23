import { getDb } from "../db.js";

const pageTitleByPath = {
  "/": "Inicio",
  "/cart": "Carrito",
  "/checkout": "Checkout",
  "/order-confirmation": "Confirmación de compra",
  "/about": "Quienes somos",
  "/terms": "Términos y Condiciones",
  "/privacy": "Política de Privacidad",
};

export async function globalData(req, res, next) {
  const path = req.path;
  res.locals.namePage = pageTitleByPath[path] || "Full Stock";

  const db = await getDb();
  const cartId = req.cartId || null;
  let count = 0;
  if (cartId) {
    const cart = (db.carts || []).find((c) => c.id === Number(cartId));
    count = cart ? cart.items.reduce((t, i) => t + i.quantity, 0) : 0;
  }
  res.locals.countCartProducts = count;
  // Backwards compatibility for templates
  res.locals.cartItemsCount = count;

  next();
}
