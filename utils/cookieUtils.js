const DEFAULT_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days

const defaultOptions = {
  httpOnly: true,
  sameSite: "lax",
  signed: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: DEFAULT_MAX_AGE,
};

export function setCookie(res, name, value, options = {}) {
  const opts = { ...defaultOptions, ...options };
  res.cookie(name, value, opts);
}

export function clearCookie(res, name, options = {}) {
  res.clearCookie(name, { ...defaultOptions, ...options });
}

export function getCookie(req, name, options = {}) {
  const opts = { ...defaultOptions, ...options };
  if (opts.signed) {
    // Note: cookie-parser returns `false` if signature verification fails
    return req.signedCookies ? req.signedCookies[name] : undefined;
  }
  return req.cookies ? req.cookies[name] : undefined;
}
