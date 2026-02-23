import AddItemToCart from "../domain/usecases/AddItemToCart.js";
import GetCart from "../domain/usecases/GetCart.js";
import UpdateItemQuantity from "../domain/usecases/UpdateItemQuantity.js";
import RemoveItemFromCart from "../domain/usecases/RemoveItemFromCart.js";
import ClearCart from "../domain/usecases/ClearCart.js";
import cartRepositoryAdapter from "../adapters/repositories/cartRepositoryAdapter.js";
import productRepositoryAdapter from "../adapters/repositories/productRepositoryAdapter.js";

export async function getCart(cartId) {
  if (!cartId) return null;
  const usecase = new GetCart({
    cartRepository: cartRepositoryAdapter,
    productRepository: productRepositoryAdapter,
  });
  return usecase.execute(cartId);
}

export async function addItemToCart(cartId, productId) {
  const usecase = new AddItemToCart({
    cartRepository: cartRepositoryAdapter,
    productRepository: productRepositoryAdapter,
  });
  return usecase.execute(cartId, productId);
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
