import { Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { JwtPayload } from "../types/types";

dotenv.config();

const jwtAccessSecret = process.env.JWT_SECRET!;
const jwtAccessExpiresIn = process.env.JWT_EXPIRES_IN!;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;
const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN!;

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const findUser = await User.findOne({ email });

    if (!findUser) return res.status(404).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, findUser.password);

    if (!isMatch) return res.status(401).json({ message: "Credenciales inválidas" });

    const payload = { userId: findUser._id.toString(), email: findUser.email };

    const accessToken = jwt.sign(payload, jwtAccessSecret, {
        expiresIn: jwtAccessExpiresIn,
    });

    const refreshToken = jwt.sign(payload, jwtRefreshSecret, {
        expiresIn: jwtRefreshExpiresIn,
    });


    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 1000, // 1 minuto
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return res.json({
        message: "Login exitoso",
        accessToken,
        refreshToken,
    });
};

export const logout = async (req: Request, res: Response) => {
    return res.json({ message: "Logout exitoso" });
};

export const refreshToken = (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: "Refresh token requerido" });

  try {
    const decoded = jwt.verify(token, jwtRefreshSecret) as JwtPayload;

    // genera un nuevo accessToken
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      jwtAccessSecret,
      { expiresIn: jwtAccessExpiresIn }
    );

    //lo guarda en cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 1000, // 1 minuto
    });

    return res.json({ message: "Nuevo access token generado" });
  } catch (err) {
    return res.status(401).json({ message: "Refresh token inválido o expirado" });
  }
};
