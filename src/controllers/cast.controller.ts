import { Request, Response } from "express";
import CastRepository from "../repositories/cast.repository";

class CastController {

    public async selectAll(req: Request, res: Response): Promise<Response> {
        const cast = await CastRepository.selectAll();
        return res.json(cast);
    }

    public async selectById(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number.parseInt(req.params.id, 10);
            const cast = await CastRepository.selectById(id);

            return res.json(cast);
        } catch (err) {
            return res.status(404).json(err);
        }
    }

    public async createOrUpdate(req: Request, res: Response): Promise<Response> {
        try {
            const response = await CastRepository.createOrUpdate(req.body);
            
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
            const response = await CastRepository.delete(id);

            if(response.sqlMessage !== undefined) {
                return res.status(400).json(response.sqlMessage);
            }

            return res.json({"response": response});
        } catch (err) {
            return res.status(404).json(err);
        }
    }

}

export default new CastController();