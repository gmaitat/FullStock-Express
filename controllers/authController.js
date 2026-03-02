import * as authService from "../services/authService.js";
import { setCookie, clearCookie } from "../utils/cookieUtils.js";
import * as cartService from "../services/cartService.js";
import * as orderService from "../services/orderService.js";

export async function renderSignup(req, res) {
  // Redirect logged users away from signup page
  if (req.user) return res.redirect("/");
  res.render("signup", { namePage: "Crear cuenta", error: null, values: {} });
}

export async function handleSignup(req, res) {
  const { email, password, confirmPassword } = req.body;
  try {
    const user = await authService.signup({ email, password, confirmPassword });

    // If guest had a cart, merge into user cart
    const guestCartId = req.cartId || null;
    if (guestCartId) {
      await cartService.mergeCarts(guestCartId, user.id);
      clearCookie(res, "cartId");
    }

    // Link past orders by email to this new user
    await orderService.linkPastOrdersToUser(email, user.id);

    return res.redirect("/login");
  } catch (err) {
    const message = err && err.message ? err.message : "Error inesperado";
    return res.render("signup", { error: message, values: { email } });
  }
}

export async function renderLogin(req, res) {
  if (req.user) return res.redirect("/");
  res.render("login", { namePage: "Iniciar sesión", error: null, values: {} });
}

export async function handleLogin(req, res) {
  const { email, password } = req.body;
  try {
    const user = await authService.login(email, password);
    // set cookie and redirect
    setCookie(res, "userId", String(user.id));
    // merge guest cart into user cart if exists
    const guestCartId = req.cartId || null;
    if (guestCartId) {
      await cartService.mergeCarts(guestCartId, user.id);
      clearCookie(res, "cartId");
    }
    return res.redirect("/");
  } catch (err) {
    const message = err && err.message ? err.message : "Error inesperado";
    return res.render("login", { error: message, values: { email } });
  }
}

export async function handleLogout(_req, res) {
  clearCookie(res, "userId");
  return res.redirect("/");
}
