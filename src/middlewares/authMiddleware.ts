import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/types"

const  SECRET_KEY = process.env.JWT_SECRET!;
const jwtAccessExpiresIn = process.env.JWT_EXPIRES_IN!;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken;

    try {
        jwt.verify(token, SECRET_KEY);
        next();
    } catch (err){
        return res.status(401).json({ message: err})
    }
};

const validateRefeshToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.refeshToken;

    if(!token) return res.status(401).json({message: 'Token requerido' });

    try {
        const decoded = jwt.verify(token, jwtRefreshSecret) as JwtPayload;

        const accessToken = jwt.sign({ _id: decoded}, SECRET_KEY, {
            expiresIn: jwtAccessExpiresIn,
        });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 60 * 1000 // 1 minuto
        })
    } catch (err) {
        return res.status(401).json({ message: err });
    }
}