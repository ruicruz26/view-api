import { Request, Response } from "express";
import StreamRepository from "../repositories/streams.repository";
import { statSync , createReadStream , unlink , existsSync } from "fs"

class StreamController {

    public async selectAllByMovie(req: Request, res: Response): Promise<Response> {
        
        const id = Number.parseInt(req.params.id, 10);
        const stream = await StreamRepository.selectAllByMovie(id);

        return res.json(stream);
    }

    public async createOrUpdate(req: Request, res: Response): Promise<Response> {
        try {
            const response = await StreamRepository.createOrUpdate({
                "id_stream": 0,
                "movies_id": req.body.movies_id,
                "file_location": req.file?.filename!,
                "stream_type": req.body.stream_type
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

            StreamRepository.selectStreamById(id)
            .then(res => {
                if(existsSync(`media/profilePictures/${res.file_location}`)) {
                    unlink(`streams/${res.file_location}`, err => {
                        if(err) {
                            throw err;
                        } else {
                            //console.log("Successfully deleted this file.")
                        }
                    })
                }
            })
            
            const response = await StreamRepository.delete(id);

            if(response.sqlMessage !== undefined) {
                return res.status(400).json(response.sqlMessage);
            }

            return res.json({"response": response});
        } catch (err) {
            return res.status(404).json(err);
        }
    }

    public async streamMovie(req: Request, res: Response):Promise<Response> {
        try {
            const id = Number.parseInt(req.params.id, 10);
            
            const stream = await StreamRepository.streamMovie(id);

            return res.json({"response": stream});
        } catch (err) {
            return res.status(404).json(err);
        }
    }

    public async streaming(req: Request, res: Response) {
        try {
            const range = req.headers.range;
         
            if (!range) {
                return res.status(400).send('Requires Range header');
            }

            const videoSize = statSync(`./streams/${req.params.streamlocation}`).size;
            
            const chunkSize = 10 ** 6;
            const start = Number(range.replace(/\D/g, ''));
            const end = Math.min(start + chunkSize, videoSize - 1);
        
            const contentLength = end - start + 1;
            const headers = {
            'Content-Range': `bytes ${start}-${end}/${videoSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLength,
            'Content-Type': 'video/mp4',
            };

            res.writeHead(206, headers);
            
            const videoStream = createReadStream(`./streams/${req.params.streamlocation}`, { start, end });
  
            videoStream.pipe(res);
        } catch (err) {
            return res.status(404).json(err);
        }
    }

}

export default new StreamController();