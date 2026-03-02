import AddItemToCart from "../domain/usecases/AddItemToCart.js";
import GetCart from "../domain/usecases/GetCart.js";
import UpdateItemQuantity from "../domain/usecases/UpdateItemQuantity.js";
import RemoveItemFromCart from "../domain/usecases/RemoveItemFromCart.js";
import ClearCart from "../domain/usecases/ClearCart.js";
import cartRepositoryAdapter from "../adapters/repositories/cartRepositoryAdapter.js";
import productRepositoryAdapter from "../adapters/repositories/productRepositoryAdapter.js";

async function hydrateCart(cart) {
  const products = await productRepositoryAdapter.findAll();
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
  const cart = await cartRepositoryAdapter.find(cartId);
  if (!cart) return null;
  return await hydrateCart(cart);
}

export async function getCartByUserId(userId) {
  if (!userId) return null;
  const cart = await cartRepositoryAdapter.findByUserId(userId);
  if (!cart) return null;
  return await hydrateCart(cart);
}

export async function getOrCreateCart(cartId = null, userId = null) {
  // Try by cartId
  if (cartId) {
    const existing = await cartRepositoryAdapter.find(cartId);
    if (existing) return existing;
  }

  // Try by userId
  if (userId) {
    const userCart = await cartRepositoryAdapter.findByUserId(userId);
    if (userCart) return userCart;
  }

  // Create new cart (linked to user if provided)
  return await cartRepositoryAdapter.create(userId || null);
}

export async function addItemToCart(cartId, productId, userId = null) {
  let cart = null;
  if (cartId) cart = await cartRepositoryAdapter.find(cartId);
  if (!cart && userId) cart = await cartRepositoryAdapter.findByUserId(userId);
  if (!cart) {
    cart = await cartRepositoryAdapter.create(userId || null);
  }

  const products = await productRepositoryAdapter.findAll();
  const product = products.find((p) => p.id === Number(productId));
  if (!product) throw new Error("Producto no encontrado");

  const item = cart.items.find((it) => it.productId === Number(productId));
  if (item) item.quantity += 1;
  else cart.items.push({ productId: Number(productId), quantity: 1 });

  await cartRepositoryAdapter.update(cart);
  return cart;
}

export async function updateItemQuantity(cartId, productId, quantity) {
  const usecase = new UpdateItemQuantity({
    cartRepository: cartRepositoryAdapter,
  });
  return usecase.execute(cartId, productId, quantity);
}

export async function removeItemFromCart(cartId, productId) {
  const usecase = new RemoveItemFromCart({
    cartRepository: cartRepositoryAdapter,
  });
  return usecase.execute(cartId, productId);
}

export async function clearCart(cartId) {
  const usecase = new ClearCart({ cartRepository: cartRepositoryAdapter });
  return usecase.execute(cartId);
}

export async function mergeCarts(guestCartId, userId) {
  if (!guestCartId || !userId) return null;
  const guest = await cartRepositoryAdapter.find(guestCartId);
  if (!guest) return null;
  const userCart = (await cartRepositoryAdapter.findByUserId(userId)) || (await cartRepositoryAdapter.create(userId));

  // Consolidate items: sum quantities for same productId
  for (const item of guest.items) {
    const existing = userCart.items.find((it) => it.productId === Number(item.productId));
    if (existing) existing.quantity += Number(item.quantity);
    else userCart.items.push({ productId: Number(item.productId), quantity: Number(item.quantity) });
  }

  await cartRepositoryAdapter.update(userCart);
  // remove guest cart
  await cartRepositoryAdapter.remove(guestCartId);
  return userCart;
}
