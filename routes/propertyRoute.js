import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createProperty , listProperty,searchProperties, deleteProperty,updateProperty,userProperty} from "../controllers/propertyController.js";
import multer from "multer";

const router= express.Router();
const upload = multer({ dest: 'uploads/' }); // Specify the temporary upload directory

router.post("/create",authMiddleware,upload.array('images', 10),createProperty);
router.get("/list",authMiddleware,listProperty)
router.get("/myListing",authMiddleware,userProperty)
router.get("/search/:id",authMiddleware, searchProperties)
router.delete("/:id",authMiddleware,deleteProperty)
router.put("/:id",authMiddleware,upload.array('images', 10),updateProperty)
export default router;