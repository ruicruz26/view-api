import { Router } from "express";
import MoviesController from "../controllers/movies.controller";

const router = Router();

router.get("/api/movies", MoviesController.selectAll);
router.get("/api/movies/:id", MoviesController.selectById);
router.post("/api/movies", MoviesController.createOrUpdate);
router.delete("/api/movies/:id", MoviesController.delete);

router.get("/api/movies/:id/cast", MoviesController.selectAllCastMovie);
router.get("/api/movies/:id/noncast", MoviesController.selectAllNonCastMovie);
router.post("/api/movies/cast", MoviesController.createCastMovie);
router.delete("/api/movies/:movieId/cast/:castId", MoviesController.deleteCastMovie);

router.get("/api/movies/:id/genre", MoviesController.selectAllGenreMovie);
router.get("/api/movies/:id/nongenre", MoviesController.selectAllNonGenreMovie);
router.post("/api/movies/genre", MoviesController.createGenreMovie);
router.delete("/api/movies/:movieId/genre/:genreId", MoviesController.deleteGenreMovie);

router.get("/api/users/:id/seen", MoviesController.allUserSeen);
router.post("/api/users/seen", MoviesController.createUserSeen);
router.delete("/api/users/:userId/seen/:movieId", MoviesController.deleteUserSeen);

router.get("/api/users/:id/favorites", MoviesController.allUserFavorites);
router.post("/api/users/favorites", MoviesController.createUserFavorites);
router.delete("/api/users/:userId/favorites/:movieId", MoviesController.deleteUserFavorites);

export default router;