import * as cartRepository from "../repositories/cartRepository.js";
import * as productRepository from "../repositories/productRepository.js";

async function hydrateCart(cart) {
  const products = await productRepository.findAll();
  const items = (cart.items || []).map((item) => {
    const product = products.find((p) => p.id === Number(item.productId)) || null;
    const subtotal = product ? (product.price * item.quantity) / 100 : 0;
    return { ...item, product, subtotal };
  });
  const total = items.reduce((acc, it) => acc + it.subtotal, 0);
  return { id: cart.id, items, total, userId: cart.userId || null };
}

export async function getCart(cartId) {
  if (!cartId) return null;
  const cart = await cartRepository.find(cartId);
  if (!cart) return null;
  return await hydrateCart(cart);
}

export async function getCartByUserId(userId) {
  if (!userId) return null;
  const cart = await cartRepository.findByUserId(userId);
  if (!cart) return null;
  return await hydrateCart(cart);
}

export async function getOrCreateCart(cartId = null, userId = null) {
  // Try by cartId
  if (cartId) {
    const existing = await cartRepository.find(cartId);
    if (existing) return existing;
  }

  // Try by userId
  if (userId) {
    const userCart = await cartRepository.findByUserId(userId);
    if (userCart) return userCart;
  }

  // Create new cart (linked to user if provided)
  return await cartRepository.create(userId || null);
}

export async function addItemToCart(cartId, productId, userId = null) {
  let cart = null;
  if (cartId) cart = await cartRepository.find(cartId);
  if (!cart && userId) cart = await cartRepository.findByUserId(userId);
  if (!cart) {
    cart = await cartRepository.create(userId || null);
  }

  const product = (await productRepository.findAll()).find((p) => p.id === Number(productId));
  if (!product) throw new Error("Producto no encontrado");

  const item = cart.items.find((it) => it.productId === Number(productId));
  if (item) item.quantity += 1;
  else cart.items.push({ productId: Number(productId), quantity: 1 });

  // If cart is linked to a user but cookie existed for guest, keep server-side ownership (no cookie needed)
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

export async function mergeCarts(guestCartId, userId) {
  if (!guestCartId || !userId) return null;
  const guest = await cartRepository.find(guestCartId);
  if (!guest) return null;
  const userCart = (await cartRepository.findByUserId(userId)) || (await cartRepository.create(userId));

  // Consolidate items: sum quantities for same productId
  for (const item of guest.items) {
    const existing = userCart.items.find((it) => it.productId === Number(item.productId));
    if (existing) existing.quantity += Number(item.quantity);
    else userCart.items.push({ productId: Number(item.productId), quantity: Number(item.quantity) });
  }

  await cartRepository.update(userCart);
  // remove guest cart
  await cartRepository.remove(guestCartId);
  return userCart;
}
