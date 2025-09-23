import express from "express";
import validationMiddleware from "../middlewares/middleware";
import { CreateUserDto } from "../dto/create-user.dto";
import { deleteUser, getUser, getUsers, registerUser, updateUser } from "../controllers/userController";


const userRoutes = express.Router();

userRoutes.post("/", validationMiddleware(CreateUserDto), registerUser);
userRoutes.get("/", getUsers);
userRoutes.get("/:id", getUser);
userRoutes.delete("/:id", deleteUser);
userRoutes.put("/:id", updateUser);


export default userRoutes;