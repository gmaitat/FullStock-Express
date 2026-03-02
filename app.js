import express from "express";
import expressLayouts from "express-ejs-layouts";
import fs from "node:fs/promises";
import path from "node:path";
import router from "./routes.js";
// globalData removed; cart and auth contexts handle page/cart data
import cookieParser from "cookie-parser";
import { authContext } from "./middlewares/authContext.js";
import { cartContext } from "./middlewares/cartContext.js";
import { parsePriceToCents, validationsPrices } from "./utils/utils.js";
import { AppError } from "./utils/errorUtils.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

// Puerto de escucha de peticiones
const PORT = 3000;

// Iniciar Servidor
const app = express();

// Parsear los datos de un formulario
app.use(express.urlencoded({ extended: false }));

// Cookies (firmadas) - secret loaded from environment
app.use(cookieParser(process.env.COOKIE_SECRET));

// Path de mi data.json (usado por algunas rutas existentes)
const DATA_PATH = path.join("data", "data.json"); // "./data/data.json"

// Auth context: parse userId from signed cookie and set req.user / res.locals.user
app.use(authContext);

// Cart context middleware: parse cartId / cart object from signed cookie into req.cartId and req.cart
app.use(cartContext);

// Ensure a default page title for layouts when no middleware sets it
app.use((req, res, next) => {
  res.locals.namePage = res.locals.namePage || "Full Stock";
  next();
});

// Middleware para archivos estaticos
app.use(express.static("public"));

// Para trabajar con plantillas ejs
app.set("view engine", "ejs");
app.set("views", "./views");

// Middleware para usar ejs-layouts
app.use(expressLayouts);
app.set("layout", "layout");

// Usar router con controladores refactorizados
app.use(router);

// (globalData middleware handles namePage and cart counts)

// Path de mi data.json (declarado arriba en el middleware contador)

// Cart add handled by router -> controllers/cartController.addItem

// Rutas
app.get("/", (_req, res) => {
  res.render("index");
});

// Las rutas de producto y categoría están registradas en `routes.js` (controladores)

// El manejo de añadir al carrito usa la ruta /cart/add-item definida anteriormente

// Cart routes are handled by router (controllers/cartController)

// Checkout and order-confirmation handled by router (orderController)

app.get("/about", (_req, res) => {
  res.render("about");
});

app.get("/terms", (_req, res) => {
  res.render("terms");
});

app.get("/privacy", (_req, res) => {
  res.render("privacy");
});

// Handler para manejar rutas desconocidas
app.use(notFoundHandler);

// Handler para manejar errores
app.use(errorHandler);

// Escuchamos peticiones del cliente.
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
