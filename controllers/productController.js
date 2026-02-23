import * as categoryService from "../services/categoryService.js";
import * as productService from "../services/productService.js";
import { AppError } from "../utils/errorUtils.js";
import { parsePriceToCents } from "../utils/utils.js";

export async function renderCategory(req, res) {
  const { slug } = req.params;

  const category = await categoryService.getCategoryBySlug(slug);
  if (!category) throw new AppError("Categoría no encontrada", 404);

  const minPrice = parsePriceToCents(req.query.minPrice);
  const maxPrice = parsePriceToCents(req.query.maxPrice);

  const products = await productService.getProductsByCategory(category.id, {
    minPrice,
    maxPrice,
  });

  res.render("category", {
    namePage: category.name,
    category,
    products,
    minPrice: minPrice !== null ? minPrice / 100 : "",
    maxPrice: maxPrice !== null ? maxPrice / 100 : "",
  });
}

export async function renderProduct(req, res) {
  const { id } = req.params;
  const product = await productService.getProductById(id);
  if (!product) throw new AppError("Producto no encontrado", 404);

  res.render("product", {
    namePage: "Producto",
    product,
  });
}
