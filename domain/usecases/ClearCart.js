export default class ClearCart {
  constructor({ cartRepository }) {
    this.cartRepository = cartRepository;
  }

  async execute(cartId) {
    if (!cartId) return;
    const cart = await this.cartRepository.find(cartId);
    if (!cart) return;
    cart.items = [];
    await this.cartRepository.update(cart);
  }
}
