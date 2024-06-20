import express from "express";
import { sendMessage,getMessages } from "../controllers/messageController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router= express.Router();
// Send a message
router.post('/send', authMiddleware, sendMessage);

// Get messages for the logged-in user
router.get('/get', authMiddleware, getMessages);

export default router