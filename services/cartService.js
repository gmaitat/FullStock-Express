import * as cartRepository from "../repositories/cartRepository.js";
import * as productRepository from "../repositories/productRepository.js";

export async function getCart(cartId) {
  if (!cartId) return null;
  const cart = await cartRepository.find(cartId);
  if (!cart) return null;

  const products = await productRepository.findAll();

  const cartItemsDetailed = cart.items.map((item) => {
    const product = products.find((p) => p.id === item.productId) || null;
    const subtotal = product ? (product.price * item.quantity) / 100 : 0;
    return {
      ...item,
      product,
      subtotal,
    };
  });

  const total = cartItemsDetailed.reduce((acc, it) => acc + it.subtotal, 0);

  return {
    id: cart.id,
    items: cartItemsDetailed,
    total,
  };
}

export async function addItemToCart(cartId, productId) {
  let cart = null;
  if (cartId) cart = await cartRepository.find(cartId);
  if (!cart) {
    cart = await cartRepository.create();
  }

  const product = (await productRepository.findAll()).find(
    (p) => p.id === Number(productId),
  );
  if (!product) throw new Error("Producto no encontrado");

  const item = cart.items.find((it) => it.productId === Number(productId));
  if (item) item.quantity += 1;
  else cart.items.push({ productId: Number(productId), quantity: 1 });

  await cartRepository.update(cart);
  return cart;
}

export async function updateItemQuantity(cartId, productId, quantity) {
  if (!cartId) throw new Error("cartId requerido");
  const cart = await cartRepository.find(cartId);
  if (!cart) throw new Error("Carrito no encontrado");
  const item = cart.items.find((it) => it.productId === Number(productId));
  if (item) item.quantity = Number(quantity);
  await cartRepository.update(cart);
  return cart;
}

export async function removeItemFromCart(cartId, productId) {
  if (!cartId) return null;
  const cart = await cartRepository.find(cartId);
  if (!cart) return null;
  cart.items = cart.items.filter((it) => it.productId !== Number(productId));
  await cartRepository.update(cart);
  return cart;
}

export async function clearCart(cartId) {
  if (!cartId) return;
  const cart = await cartRepository.find(cartId);
  if (!cart) return;
  cart.items = [];
  await cartRepository.update(cart);
}
