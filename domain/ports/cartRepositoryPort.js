// Port interface for CartRepository (documentation only)
// Implementing adapters should provide these methods:
// - find(id)
// - create()
// - update(cart)

export default class CartRepositoryPort {
  async find(id) {
    throw new Error("Not implemented");
  }

  async create() {
    throw new Error("Not implemented");
  }

  async update(cart) {
    throw new Error("Not implemented");
  }
}
