import assert from "assert";

export default class AddItemToCart {
  constructor({ cartRepository, productRepository }) {
    assert(cartRepository, "cartRepository is required");
    assert(productRepository, "productRepository is required");
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
  }

  async execute(cartId, productId) {
    let cart = null;
    if (cartId) cart = await this.cartRepository.find(cartId);
    if (!cart) {
      cart = await this.cartRepository.create();
    }

    const products = await this.productRepository.findAll();
    const product = products.find((p) => p.id === Number(productId));
    if (!product) throw new Error("Producto no encontrado");

    const item = cart.items.find((it) => it.productId === Number(productId));
    if (item) item.quantity += 1;
    else cart.items.push({ productId: Number(productId), quantity: 1 });

    await this.cartRepository.update(cart);
    return cart;
  }
}
