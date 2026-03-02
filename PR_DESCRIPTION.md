Título: feat(auth+cart): identidad con cookies firmadas, merge de carritos y link de órdenes

Descripción:
Implementa identidad de usuario con cookies firmadas y flujo completo de autenticación,
adapta la lógica de carritos para soportar usuarios (merge de carritos de invitado al iniciar
sesión / registrarse) y asocia órdenes pasadas al nuevo usuario.

Cambios principales:
- Añadido `utils/passwordUtils.js` (bcrypt hashing) y `utils/cookieUtils.js` (set/clear/get cookie firmadas).
- Middleware `authContext.js` y `cartContext.js` para inyectar `req.user`, `req.cart` y limpiar cookies forjadas.
- Repositorios: `repositories/userRepository.js`, modificaciones en `repositories/cartRepository.js`, `repositories/orderRepository.js` para soportar `userId`.
- Servicios: `services/authService.js` (signup/login), `services/userService.js`, `services/cartService.js` (hydrate, mergeCarts, getOrCreateCart), `services/orderService.js` (linkPastOrdersToUser).
- Adaptadores Clean Arch: `adapters/repositories/cartRepositoryAdapter.js` y `productRepositoryAdapter.js` expuestos y usados por usecases.
- Controladores: `controllers/authController.js`, `controllers/cartController.js`, `controllers/orderController.js` actualizados para orquestar merge y persistencia de sesión.
- Vistas: `views/signup.ejs`, `views/login.ejs`, `views/checkout.ejs` (prefill/readonly email si user logueado), y `views/partials/header.ejs` actualizado.
- CSS: nuevos componentes `public/css/3_components/*` y registro en `public/css/index.css`.
- Config: `.env`, `.env.example` añadidos; `app.js` usa `cookieParser(process.env.COOKIE_SECRET)`.

Archivos clave modificados (no exhaustiva):
- app.js
- package.json
- .env, .env.example
- utils/passwordUtils.js
- utils/cookieUtils.js
- middlewares/authContext.js
- middlewares/cartContext.js
- repositories/cartRepository.js
- repositories/orderRepository.js
- repositories/userRepository.js
- adapters/repositories/cartRepositoryAdapter.js
- services/authService.js
- services/cartService.js
- services/orderService.js
- controllers/authController.js
- controllers/cartController.js
- controllers/orderController.js
- views/signup.ejs
- views/login.ejs
- views/checkout.ejs
- views/partials/header.ejs
- public/css/index.css
- public/css/3_components/*

Notas de verificación local:
1. `npm install`
2. `npm run dev` (usa `--env-file=.env` para cargar `COOKIE_SECRET`)
3. Abrir `/signup` y `/login`, completar signup como invitado creando items, luego login y verificar que el carrito se mergea y que `data/data.json` contiene hashes de contraseña y órdenes vinculadas.

Comando sugerido para crear PR (requiere GitHub CLI `gh` configurado):

gh pr create --repo gmaitat/FullStock-Express --head fullstack-codeable-opt --base main --title "feat(auth+cart): identidad con cookies firmadas, merge de carritos" --body-file PR_DESCRIPTION.md

Si prefieres, yo puedo crear el PR si me das acceso a un token `GITHUB_TOKEN` o si `gh` está disponible en esta máquina.
