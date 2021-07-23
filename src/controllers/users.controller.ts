import { Request, Response } from "express";
import { unlink , existsSync } from "fs";
import UsersRepository from "../repositories/users.repository";

class UsersController {

    public async selectAll(req: Request, res: Response): Promise<Response> {
        const users = await UsersRepository.selectAll();
        return res.json(users);
    }

    public async selectById(req: Request, res: Response): Promise<Response> {
        try {
            const id = Number.parseInt(req.params.id, 10);
            const user = await UsersRepository.selectById(id);

            return res.json(user);
        } catch (err) {
            return res.status(404).json(err);
        }
    }

    public async createOrUpdate(req: Request, res: Response): Promise<Response> {
        try {
            const response = await UsersRepository.createOrUpdate(req.body);

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
            const response = await UsersRepository.delete(id);

            if(response.sqlMessage !== undefined) {
                return res.status(400).json(response.sqlMessage);
            }

            return res.json({"response": response});
        } catch (err) {
            return res.status(404).json(err);
        }
    }

    public async postUserPhoto(req: Request, res: Response): Promise<Response> {
        try {

            UsersRepository.selectById(req.body.user_id)
            .then(res => {
                if(existsSync(`media/profilePictures/${res.profile_picture}`)) {
                    unlink(`media/profilePictures/${res.profile_picture}`, err => {
                        if(err) {
                            console.log(err);
                        } else {
                            //console.log("Successfully deleted this file.")
                        }
                    })
                }
            })
            const response = await UsersRepository.postUserPhoto(req.body.user_id,req.file?.filename!);

            if(response.sqlMessage !== undefined) {
                return res.status(400).json(response.sqlMessage);
            }

            let user = await UsersRepository.selectById(req.body.user_id);

            return res.json({"response": user});
        } catch (err) {
            return res.status(404).json(err);
        }
    }
}

export default new UsersController();