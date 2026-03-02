import * as cartService from "../services/cartService.js";
import { AppError } from "../utils/errorUtils.js";

const COOKIE_NAME = "cartId";

function cookieOptions() {
  return {
    httpOnly: true,
    // secure: true, // enable in production with HTTPS
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    signed: true,
  };
}

export async function addItem(req, res) {
  const productId = Number(req.body.productId);
  const currentCartId = req.cartId || null;
  const userId = req.user ? req.user.id : null;

  try {
    const cart = await cartService.addItemToCart(currentCartId, productId, userId);

    // If cart was created for guest (no user), set cookie
    if (!userId && (!currentCartId || Number(currentCartId) !== Number(cart.id))) {
      res.cookie(COOKIE_NAME, cart.id, cookieOptions());
    }

    // If user is logged, ensure no guest cart cookie remains
    if (userId) {
      res.clearCookie(COOKIE_NAME, cookieOptions());
    }

    res.redirect(`/product/${productId}`);
  } catch (err) {
    throw new AppError(err.message || "Error al agregar item", 500);
  }
}

export async function renderCart(req, res) {
  const cart = req.cart || { items: [], total: 0 };
  res.render("cart", { cartItems: cart.items, total: cart.total });
}

export async function updateItem(req, res) {
  const { productId, quantity } = req.body;
  const cartId = req.cartId;
  if (!cartId) throw new AppError("Carrito no encontrado", 400);
  await cartService.updateItemQuantity(
    cartId,
    Number(productId),
    Number(quantity),
  );
  res.redirect("/cart");
}

export async function deleteItem(req, res) {
  const { productId } = req.body;
  const cartId = req.cartId;
  if (!cartId) return res.redirect("/cart");
  await cartService.removeItemFromCart(cartId, Number(productId));
  res.redirect("/cart");
}
