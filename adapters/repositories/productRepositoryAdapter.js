import * as productRepo from "../../repositories/productRepository.js";

const productRepositoryAdapter = {
  async findAll() {
    return productRepo.findAll();
  },
  async findById(id) {
    return productRepo.findById(id);
  },
};

export default productRepositoryAdapter;
