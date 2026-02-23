import * as orderRepository from "../repositories/orderRepository.js";
import * as cartService from "./cartService.js";
import { AppError } from "../utils/errorUtils.js";

export async function processCheckout(cartId, shippingInfo) {
  const cart = await cartService.getCart(cartId);
  if (!cart || !cart.items || cart.items.length === 0) {
    throw new AppError("El carrito está vacío", 400);
  }

  // snapshot items
  const itemsSnapshot = cart.items.map((item) => ({
    productId: item.productId,
    name: item.product?.name || "",
    price: item.product?.price || 0,
    imgSrc: item.product?.imgSrc || "",
    quantity: item.quantity,
  }));

  const order = {
    items: itemsSnapshot,
    shippingInfo,
    total: cart.total,
  };

  const newOrder = await orderRepository.create(order);

  // clear cart
  await cartService.clearCart(cartId);

  return newOrder;
}

export async function getOrderById(id) {
  return await orderRepository.findById(id);
}
