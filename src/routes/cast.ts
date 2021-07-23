import { Router } from "express";
import CastController from "../controllers/cast.controller";

const router = Router();

router.get("/api/cast", CastController.selectAll);
router.get("/api/cast/:id", CastController.selectById);
router.post("/api/cast", CastController.createOrUpdate);
router.delete("/api/cast/:id", CastController.delete);

export default router;