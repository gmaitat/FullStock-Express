import * as cartRepo from "../../repositories/cartRepository.js";

const cartRepositoryAdapter = {
  async find(id) {
    return cartRepo.find(id);
  },
  async create() {
    return cartRepo.create();
  },
  async update(cart) {
    return cartRepo.update(cart);
  },
};

export default cartRepositoryAdapter;
