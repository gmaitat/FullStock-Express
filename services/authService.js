import { AppError } from "../utils/errorUtils.js";
import * as userService from "./userService.js";
import { hashPassword, comparePassword } from "../utils/passwordUtils.js";

export async function signup({ email, password, confirmPassword }) {
  if (!email) throw new AppError("El email es requerido", 400);
  if (!password) throw new AppError("La contraseña es requerida", 400);
  if (password !== confirmPassword)
    throw new AppError("Las contraseñas no coinciden", 400);

  const existing = await userService.getUserByEmail(email);
  if (existing) throw new AppError("El correo ya está registrado", 400);

  const hashed = await hashPassword(password);

  const user = await userService.createUser({ email, password: hashed });
  return user;
}

export async function login(email, password) {
  if (!email || !password) throw new AppError("Credenciales inválidas", 401);

  const user = await userService.getUserByEmail(email);
  if (!user) throw new AppError("Credenciales inválidas", 401);

  const ok = await comparePassword(password, user.password);
  if (!ok) throw new AppError("Credenciales inválidas", 401);

  return user;
}
