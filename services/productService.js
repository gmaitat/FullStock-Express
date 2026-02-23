import * as productRepository from "../repositories/productRepository.js";

export async function getProductsByCategory(categoryId, filters = {}) {
  const products = await productRepository.findAll();

  const minPrice =
    typeof filters.minPrice === "number" ? filters.minPrice : -Infinity;
  const maxPrice =
    typeof filters.maxPrice === "number" ? filters.maxPrice : Infinity;

  return products.filter((product) => {
    const belongsToCategory = product.categoryId === categoryId;
    const meetsMinPrice = product.price >= minPrice;
    const meetsMaxPrice = product.price <= maxPrice;
    return belongsToCategory && meetsMinPrice && meetsMaxPrice;
  });
}

export async function getProductById(id) {
  return await productRepository.findById(id);
}
