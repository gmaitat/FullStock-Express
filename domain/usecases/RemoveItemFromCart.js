export default class RemoveItemFromCart {
  constructor({ cartRepository }) {
    this.cartRepository = cartRepository;
  }

  async execute(cartId, productId) {
    if (!cartId) return null;
    const cart = await this.cartRepository.find(cartId);
    if (!cart) return null;
    cart.items = cart.items.filter((it) => it.productId !== Number(productId));
    await this.cartRepository.update(cart);
    return cart;
  }
}
