import { Request, Response } from "express";
import MediaRepository from "../repositories/media.repository";
import { unlink , existsSync } from "fs";

class MediaController {

    public async selectAllByMovie(req: Request, res: Response): Promise<Response> {
        
        const id = Number.parseInt(req.params.id, 10);
        const media = await MediaRepository.selectAllByMovie(id);

        return res.json(media);
    }

    public async createOrUpdate(req: Request, res: Response): Promise<Response> {
        try{
            const response = await MediaRepository.createOrUpdate(
                {"id_media": 0,
                "movies_id": req.body.movies_id,
                "file_location": req.file?.filename!
            });
            
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

            MediaRepository.selectMediaById(id)
            .then(res => {
                if(existsSync(`media/profilePictures/${res.file_location}`)) {
                    unlink(`media/${res.file_location}`, err => {
                        if(err) {
                            throw err;
                        } else {
                            //console.log("Successfully deleted this file.")
                        }
                    })
                }
            })

            const response = await MediaRepository.delete(id);

            if(response.sqlMessage !== undefined) {
                return res.status(400).json(response.sqlMessage);
            }

            return res.json({"response": response});
        } catch (err) {
            return res.status(404).json(err);
        }
    }

}

export default new MediaController();