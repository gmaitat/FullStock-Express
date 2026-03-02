import { getCookie, clearCookie } from "../utils/cookieUtils.js";
import * as cartService from "../services/cartService.js";

function countItems(cart) {
  if (!cart || !cart.items) return 0;
  return cart.items.reduce((acc, it) => acc + (it.quantity || 0), 0);
}

export async function cartContext(req, res, next) {
  // If user is logged, prefer user's cart
  if (req.user) {
    const userCart = await cartService.getCartByUserId(req.user.id);
    if (userCart) {
      req.cart = userCart;
      req.cartId = userCart.id;
      res.locals.cartItemsCount = countItems(userCart);
      // remove any guest cart cookie
      clearCookie(res, "cartId");
      return next();
    }
    // no user cart; fallthrough to check cookie (guest)
  }

  const raw = getCookie(req, "cartId");

  // If cookie not set
  if (raw === undefined) {
    req.cart = null;
    req.cartId = null;
    res.locals.cartItemsCount = 0;
    return next();
  }

  // If signature invalid
  if (raw === false) {
    clearCookie(res, "cartId");
    req.cart = null;
    req.cartId = null;
    res.locals.cartItemsCount = 0;
    return next();
  }

  const id = Number(raw);
  if (!Number.isFinite(id)) {
    clearCookie(res, "cartId");
    req.cart = null;
    req.cartId = null;
    res.locals.cartItemsCount = 0;
    return next();
  }

  const cart = await cartService.getCart(id);
  if (!cart) {
    req.cart = null;
    req.cartId = null;
    res.locals.cartItemsCount = 0;
    return next();
  }

  req.cart = cart;
  req.cartId = cart.id;
  res.locals.cartItemsCount = countItems(cart);
  return next();
}
