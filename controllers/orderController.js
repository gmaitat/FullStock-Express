import * as cartService from "../services/cartService.js";
import * as orderService from "../services/orderService.js";
import { AppError } from "../utils/errorUtils.js";

export async function renderCheckout(req, res) {
  const cart = req.cart || { items: [], total: 0 };
  res.render("checkout", {
    cartItems: cart.items,
    total: cart.total,
  });
}

export async function placeOrder(req, res) {
  const shippingInfo = req.body;
  const userId = req.user ? req.user.id : null;
  const newOrder = await orderService.processCheckout(req.cartId, shippingInfo, userId);
  res.redirect(`/order-confirmation?orderId=${newOrder.id}`);
}

export async function renderOrderConfirmation(req, res) {
  const orderId = Number(req.query.orderId);
  if (!orderId) throw new AppError("orderId inválido", 400);

  const order = await orderService.getOrderById(orderId);
  if (!order) throw new AppError("Orden no encontrada", 404);

  res.render("order-confirmation", { orderId: order.id });
}
