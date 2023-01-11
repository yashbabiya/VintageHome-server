import express from "express"
import { login, signup } from "../controllers/user.js"
const router = express.Router()

router.post('/login',login.validator,login.controller);
router.post('/signup',signup.validator,signup.controller);



export default router