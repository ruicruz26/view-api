import { Router } from "express";
import GenreController from "../controllers/genres.controller";

const router = Router();

router.get("/api/genres", GenreController.selectAll);
router.get("/api/genres/:id", GenreController.selectById);
router.post("/api/genres", GenreController.createOrUpdate);
router.delete("/api/genres/:id", GenreController.delete);

export default router;