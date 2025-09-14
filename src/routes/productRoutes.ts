import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/productController";
import express from "express";

import validationMiddleware from "../middlewares/middleware";
import { CreateProductDto } from "../dto/create-product.dto";

const productRouter = express.Router();

productRouter.post("/", validationMiddleware(CreateProductDto) ,createProduct);
productRouter.get("/", getProducts);
productRouter.get("/:id", getProduct);
productRouter.delete("/:id", deleteProduct);
productRouter.put("/:id", updateProduct);

export default productRouter;
