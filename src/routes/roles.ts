import { Router } from "express";
import RolesController from "../controllers/roles.controller";

const router = Router();

router.get("/api/roles", RolesController.selectAll);
router.get("/api/roles/:id", RolesController.selectById);
router.post("/api/roles", RolesController.createOrUpdate);
router.delete("/api/roles/:id", RolesController.delete);

export default router;