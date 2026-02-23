export default class GetCart {
  constructor({ cartRepository, productRepository }) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
  }

  async execute(cartId) {
    if (!cartId) return null;
    const cart = await this.cartRepository.find(cartId);
    if (!cart) return null;

    const products = await this.productRepository.findAll();

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
}
