import express from "express"
import { approveProduct, banUser, viewSellers } from "../controllers/admin.js";
import verifyToken from "../helper/verifyToken.js";
const router = express.Router()

router.put('/banSeller',verifyToken,banUser.validator,banUser.controller);
router.get('/sellers',viewSellers.validator,viewSellers.controller);
router.put('/approveProduct',verifyToken,approveProduct.validator,approveProduct.controller);



export default router