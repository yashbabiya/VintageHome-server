import express from "express"
import { addToCart, editUser, getCart, login, logout, signup, updateCart } from "../controllers/user.js";
import verifyToken from "../helper/verifyToken.js";
const router = express.Router()

router.post('/login',login.validator,login.controller);
router.post('/signup',signup.validator,signup.controller);
router.delete('/logout',logout.controller);
router.put('/edit',verifyToken,editUser.validator,editUser.controller)
router.get('/cart',verifyToken,getCart.controller)
router.post('/addToCart',verifyToken,addToCart.validator,addToCart.controller)
router.put('/updateCart',verifyToken,updateCart.validator,updateCart.controller)



export default router