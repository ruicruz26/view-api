import { Router } from "express";
import StreamController from "../controllers/streams.controller";

const router = Router();

router.get("/api/streaming/:streamlocation", StreamController.streaming);

export default router;