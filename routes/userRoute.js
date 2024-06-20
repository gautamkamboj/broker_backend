import express from "express";
import {userLogin, userRegister} from "../controllers/userLogin.js"
const router = express.Router();

router.post('/register', userRegister);

// Login route
router.post('/login', userLogin);

export default router;