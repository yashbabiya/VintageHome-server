import express from "express"
import { changeOrderStatus, createProduct, deleteProductById, getAllProduct, getMyOrders, getProductById, placeOrder, searchProduct, updateProduct } from "../controllers/product.js";
import verifySeller from "../helper/verifySeller.js";
import verifyToken from "../helper/verifyToken.js";
const router = express.Router()

router.get('/getAll',getAllProduct.controller);
router.get('/search',searchProduct.controller);
router.post('/create',verifyToken,createProduct.validator,createProduct.controller)
router.delete('/delete',verifyToken,deleteProductById.validator,deleteProductById.controller)
router.put('/edit',verifyToken,updateProduct.validator,updateProduct.controller)
router.get('/getById',getProductById.validator,getProductById.controller)
router.post('/placeOrder',verifyToken,placeOrder.validator,placeOrder.controller)
router.post('/changeOrderStatus',verifySeller,changeOrderStatus.validator,changeOrderStatus.controller)
router.get('/getMyOrders',verifyToken,getMyOrders.validator,getMyOrders.controller)


export default router