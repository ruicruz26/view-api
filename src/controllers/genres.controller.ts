import { Request, Response } from "express";
import GenreRepository from "../repositories/genres.repository";

class GenreController {

    public async selectAll(req: Request, res: Response): Promise<Response> {
        const genres = await GenreRepository.selectAll();
        return res.json(genres);
    }

    public async selectById(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number.parseInt(req.params.id, 10);
            const genre = await GenreRepository.selectById(id);

            return res.json(genre);
        } catch (err) {
            return res.status(404).json(err);
        }
    }

    public async createOrUpdate(req: Request, res: Response): Promise<Response> {
        try {
            const response = await GenreRepository.createOrUpdate(req.body);
            
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
            const response = await GenreRepository.delete(id);

            if(response.sqlMessage !== undefined) {
                return res.status(400).json(response.sqlMessage);
            }

            return res.json({"response": response});
        } catch (err) {
            return res.status(404).json(err);
        }
    }

}

export default new GenreController();