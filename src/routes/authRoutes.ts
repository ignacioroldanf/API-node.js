import {login, logout, refreshToken} from "../controllers/authController"
import express from "express";

const router = express.Router();


router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);



export default router;



