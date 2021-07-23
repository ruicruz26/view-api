import { Router } from "express";
import UsersController from "../controllers/users.controller";
import Multer from "../core/helper/Upload";

const router = Router();

let cpMulter = Multer("./media/profilePictures");

let cpUpload = cpMulter.single("file");

router.get("/api/users", UsersController.selectAll);
router.get("/api/users/:id", UsersController.selectById);
router.post("/api/users", UsersController.createOrUpdate);
router.post("/api/usersPhoto", cpUpload, UsersController.postUserPhoto);
router.delete("/api/users/:id", UsersController.delete);

export default router;
