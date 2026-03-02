import * as userService from "../services/userService.js";
import { clearCookie, getCookie } from "../utils/cookieUtils.js";

export async function authContext(req, res, next) {
  // default for templates
  res.locals.user = null;

  const raw = getCookie(req, "userId");
  // If signature invalid, cookie-parser returns false
  if (raw === undefined) return next();
  if (raw === false) {
    clearCookie(res, "userId");
    return next();
  }

  const id = Number(raw);
  if (!Number.isFinite(id)) {
    clearCookie(res, "userId");
    return next();
  }

  // We need to find user by id; repository doesn't have findById, so search DB via users list
  try {
    const maybeUser = await findUserById(id);
    if (!maybeUser) {
      clearCookie(res, "userId");
      return next();
    }
    req.user = maybeUser;
    res.locals.user = maybeUser;
    return next();
  } catch (err) {
    clearCookie(res, "userId");
    return next();
  }
}

import { getDb } from "../db.js";

async function findUserById(id) {
  const db = await getDb();
  const users = db.users || [];
  return users.find((u) => u.id === Number(id)) || null;
}
