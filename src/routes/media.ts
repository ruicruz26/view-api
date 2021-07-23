import { Router } from "express";
import MediaController from "../controllers/media.controller";
import Multer from "../core/helper/Upload";

const router = Router();

let cpMulter = Multer("./media");

let cpUpload = cpMulter.single("file");
  
router.get("/api/media/:id", MediaController.selectAllByMovie);
router.post("/api/media", cpUpload ,MediaController.createOrUpdate);
router.delete("/api/media/:id", MediaController.delete);

export default router;