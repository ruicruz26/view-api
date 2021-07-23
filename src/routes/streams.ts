import { Router } from "express";
import StreamController from "../controllers/streams.controller";
import Multer from "../core/helper/Upload";

const router = Router();

let cpMulter = Multer("./streams");

let cpUpload = cpMulter.single("file");

router.get("/api/streams/:id", StreamController.selectAllByMovie);
router.get("/api/streamMovie/:id", StreamController.streamMovie);
router.post("/api/streams", cpUpload ,StreamController.createOrUpdate);
router.delete("/api/streams/:id", StreamController.delete);

export default router;