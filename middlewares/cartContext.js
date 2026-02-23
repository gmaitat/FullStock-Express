export function cartContext(req, res, next) {
  const cartIdCookie = req.signedCookies ? req.signedCookies.cartId : null;
  req.cartId = cartIdCookie ? Number(cartIdCookie) : null;
  next();
}
