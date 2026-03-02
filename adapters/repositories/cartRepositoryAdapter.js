import * as cartRepo from "../../repositories/cartRepository.js";

const cartRepositoryAdapter = {
  async find(id) {
    return cartRepo.find(id);
  },
  async create(userId = null) {
    return cartRepo.create(userId);
  },
  async update(cart) {
    return cartRepo.update(cart);
  },
  async findByUserId(userId) {
    return cartRepo.findByUserId(userId);
  },
  async remove(id) {
    return cartRepo.remove(id);
  },
};

export default cartRepositoryAdapter;
