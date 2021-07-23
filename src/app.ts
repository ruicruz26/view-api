import express from "express";
import cors from "cors";
import UserRouter from "./routes/users";
import MoviesRouter from "./routes/movies";
import CastRouter from "./routes/cast";
import RolesRouter from "./routes/roles";
import GenresRouter from "./routes/genres";
import MediaRouter from "./routes/media";
import StreamRouter from "./routes/streams";
import AuthRouter from "./routes/auth";
import AuthMiddleware from "./core/auth/auth.middleware";
import StreamingRouter from "./routes/streaming";

class App {
    public express: express.Application;
    
    public constructor() {

        this.express = express();

        this.setupMiddlewares();

        this.routes();
    }

    private setupMiddlewares(): void {
        this.express.use(express.json());
        this.express.use('/media/images', express.static('media'));
        this.express.use('/stream/streams', express.static('streams'));
    }

    private routes(): void {
        this.express.use(cors());
        this.express.use(AuthRouter);
        this.express.use(StreamingRouter);
        this.express.use(AuthMiddleware.verifyToken);
        this.express.use(UserRouter);
        this.express.use(MoviesRouter);
        this.express.use(CastRouter);
        this.express.use(RolesRouter);
        this.express.use(GenresRouter);
        this.express.use(MediaRouter);
        this.express.use(StreamRouter);
    }
}

export default new App().express;