export default class UpdateItemQuantity {
  constructor({ cartRepository }) {
    this.cartRepository = cartRepository;
  }

  async execute(cartId, productId, quantity) {
    if (!cartId) throw new Error("cartId requerido");
    const cart = await this.cartRepository.find(cartId);
    if (!cart) throw new Error("Carrito no encontrado");
    const item = cart.items.find((it) => it.productId === Number(productId));
    if (item) item.quantity = Number(quantity);
    await this.cartRepository.update(cart);
    return cart;
  }
}
