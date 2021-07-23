import { Request, Response } from "express";
import RoleRepository from "../repositories/roles.repository";

class RolesController {

    public async selectAll(req: Request, res: Response): Promise<Response> {
        const roles = await RoleRepository.selectAll();
        return res.json(roles);
    }

    public async selectById(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number.parseInt(req.params.id, 10);
            const role = await RoleRepository.selectById(id);

            return res.json(role);
        } catch (err) {
            return res.status(404).json(err);
        }
    }

    public async createOrUpdate(req: Request, res: Response): Promise<Response> {
        try {
            const response = await RoleRepository.createOrUpdate(req.body);
            
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
            const response = await RoleRepository.delete(id);

            if(response.sqlMessage !== undefined) {
                return res.status(400).json(response.sqlMessage);
            }

            return res.json({"response": response});
        } catch (err) {
            return res.status(404).json(err);
        }
    }

}

export default new RolesController();