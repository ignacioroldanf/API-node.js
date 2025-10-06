import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { addProductToOrden, getOrden, removeProductFromOrden, updateOrden } from "../controllers/ordenController";



const router = express.Router();

router.use(authMiddleware);


router.get('/:userId/orden', getOrden);
router.post('/:userId/orden', addProductToOrden);
router.put('/:userId/orden', updateOrden);
router.delete('/:userId/orden', removeProductFromOrden);

export default router;