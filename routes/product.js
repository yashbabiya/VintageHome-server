import express from "express"
import { createProduct, deleteProductById, getAllProduct, getProductById, searchProduct, updateProduct } from "../controllers/product.js";
import verifyToken from "../helper/verifyToken.js";
const router = express.Router()

router.get('/getAll',getAllProduct.controller);
router.get('/search',searchProduct.controller);
router.post('/create',verifyToken,createProduct.validator,createProduct.controller)
router.delete('/delete',verifyToken,deleteProductById.validator,deleteProductById.controller)
router.put('/edit',verifyToken,updateProduct.validator,updateProduct.controller)
router.get('/getById',getProductById.validator,getProductById.controller)


export default router