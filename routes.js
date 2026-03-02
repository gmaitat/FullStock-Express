import { Router } from "express";
import * as productController from "./controllers/productController.js";
import * as orderController from "./controllers/orderController.js";
import * as cartController from "./controllers/cartController.js";
import * as authController from "./controllers/authController.js";

const router = Router();

// Productos & Categorías
router.get("/category/:slug", productController.renderCategory);
router.get("/product/:id", productController.renderProduct);

// Checkout & Orders
router.get("/checkout", orderController.renderCheckout);
router.post("/checkout/place-order", orderController.placeOrder);
router.get("/order-confirmation", orderController.renderOrderConfirmation);

// Cart
router.get("/cart", cartController.renderCart);
router.post("/cart/add-item", cartController.addItem);
router.post("/cart/update-item", cartController.updateItem);
router.post("/cart/delete-item", cartController.deleteItem);

// Auth
router.get("/signup", authController.renderSignup);
router.post("/signup", authController.handleSignup);
router.get("/login", authController.renderLogin);
router.post("/login", authController.handleLogin);
router.post("/logout", authController.handleLogout);

export default router;
