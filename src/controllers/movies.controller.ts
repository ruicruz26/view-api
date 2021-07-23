import { Request, Response } from "express";
import MoviesRepository from "../repositories/movies.repository";

class MoviesController {

    public async selectAll(req: Request, res: Response): Promise<Response> {
        const movies = await MoviesRepository.selectAll();
        return res.json(movies);
    }

    public async selectById(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number.parseInt(req.params.id, 10);
            const movie = await MoviesRepository.selectById(id);

            return res.json(movie);
        } catch (err) {
            return res.status(404).json(err);
        }
    }

    public async createOrUpdate(req: Request, res: Response): Promise<Response> {
        try {
            const response = await MoviesRepository.createOrUpdate(req.body);
            
            if(response.sqlMessage !== undefined) {
                return res.status(400).json(response.sqlMessage);
            }

            return res.json({"response": response});
        } catch (err) {
            return res.status(404).json(err);
        }
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number.parseInt(req.params.id, 10);
            const response = await MoviesRepository.delete(id);

            if(response.sqlMessage !== undefined) {
                return res.status(400).json(response.sqlMessage);
            }

            return res.json({"response": response});
        } catch (err) {
            return res.status(404).json(err);
        }
    }

    public async selectAllCastMovie(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number.parseInt(req.params.id, 10);
            const castMovie = await MoviesRepository.selectAllCastMovie(id);

            return res.json(castMovie);
        } catch(err) {
            return res.status(404).json(err);
        }
    }

    public async selectAllNonCastMovie(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number.parseInt(req.params.id, 10);
            const castMovie = await MoviesRepository.selectAllNonCastMovie(id);

            return res.json(castMovie);
        } catch(err) {
            return res.status(404).json(err);
        }
    }

    public async createCastMovie(req: Request, res: Response): Promise<Response> {
        try {
            const response = await MoviesRepository.insertCastMovie(req.body);

            if(response.sqlMessage !== undefined) {
                return res.status(400).json(response.sqlMessage);
            }

            return res.json({"response": response});
        } catch(err) {
            return res.status(404).json(err);
        }
    }

    public async deleteCastMovie(req: Request, res: Response): Promise<Response> {
        try {
            const movieId = Number.parseInt(req.params.movieId, 10);
            const castId = Number.parseInt(req.params.castId, 10);
            const response = await MoviesRepository.deleteCastMovie(movieId,castId);

            if(response.sqlMessage !== undefined) {
                return res.status(400).json(response.sqlMessage);
            }

            return res.json({"response": response});
        } catch(err) {
            return res.status(404).json(err);
        }
    }

    public async selectAllGenreMovie(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number.parseInt(req.params.id, 10);
            const genreMovie = await MoviesRepository.selectAllGenreMovie(id);

            return res.json(genreMovie);
        } catch(err) {
            return res.status(404).json(err);
        }
    }

    public async selectAllNonGenreMovie(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number.parseInt(req.params.id, 10);
            const genreMovie = await MoviesRepository.selectAllNonGenreMovie(id);

            return res.json(genreMovie);
        } catch(err) {
            return res.status(404).json(err);
        }
    }

    public async createGenreMovie(req: Request, res: Response): Promise<Response> {
        try {
            const response = await MoviesRepository.insertGenreMovie(req.body);

            if(response.sqlMessage !== undefined) {
                return res.status(400).json(response.sqlMessage);
            }

            return res.json({"response": response});
        } catch(err) {
            return res.status(404).json(err);
        }
    }

    public async deleteGenreMovie(req: Request, res: Response): Promise<Response> {
        try {
            const movieId = Number.parseInt(req.params.movieId, 10);
            const genreId = Number.parseInt(req.params.genreId, 10);
            const response = await MoviesRepository.deleteGenreMovie(movieId,genreId);

            if(response.sqlMessage !== undefined) {
                return res.status(400).json(response.sqlMessage);
            }

            return res.json({"response": response});
        } catch(err) {
            return res.status(404).json(err);
        }
    }

    public async allUserSeen(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number.parseInt(req.params.id, 10);
            
            const movies = await MoviesRepository.allUserSeen(id);

            return res.json(movies);
        } catch (err) {
            return res.status(404).json(err);
        }
    }

    public async createUserSeen(req: Request, res: Response): Promise<Response> {
        try {
            const response = await MoviesRepository.createUserSeen(req.body.users_id,req.body.movies_id);
            
            if(response.sqlMessage !== undefined) {
                return res.status(400).json(response.sqlMessage);
            }

            return res.json({"response": response});
        } catch (err) {
            return res.status(404).json(err);
        }
    }

    public async deleteUserSeen(req: Request, res: Response): Promise<Response> {
        try {
            const userId = Number.parseInt(req.params.userId, 10);
            const movieId = Number.parseInt(req.params.movieId, 10);

            const response = await MoviesRepository.deleteUserSeen(userId,movieId);

            if(response.sqlMessage !== undefined) {
                return res.status(400).json(response.sqlMessage);
            }

            return res.json({"response": response});
        } catch (err) {
            return res.status(404).json(err);
        }
    }

    public async allUserFavorites(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number.parseInt(req.params.id, 10);
            const movies = await MoviesRepository.allUserFavorites(id);

            return res.json(movies);
        } catch (err) {
            return res.status(404).json(err);
        }
    }

    public async createUserFavorites(req: Request, res: Response): Promise<Response> {
        try {
            const response = await MoviesRepository.createUserFavorites(req.body.users_id,req.body.movies_id);
            
            if(response.sqlMessage !== undefined) {
                return res.status(400).json(response.sqlMessage);
            }

            return res.json({"response": response});
        } catch (err) {
            return res.status(404).json(err);
        }
    }

    public async deleteUserFavorites(req: Request, res: Response): Promise<Response> {
        try {
            const userId = Number.parseInt(req.params.userId, 10);
            const movieId = Number.parseInt(req.params.movieId, 10);
            const response = await MoviesRepository.deleteUserFavorites(userId,movieId);

            if(response.sqlMessage !== undefined) {
                return res.status(400).json(response.sqlMessage);
            }

            return res.json({"response": response});
        } catch (err) {
            return res.status(404).json(err);
        }
    }
}

export default new MoviesController();