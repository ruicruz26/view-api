import jwt, { verify } from "jsonwebtoken";
import { Request, Response, NextFunction} from "express";

export default class AuthMiddleware {

    public static createToken(data: any) :string {
        let token = jwt.sign({data: data}, "shhhhh", {expiresIn: "1 day"});

        return token;
    }

    public static verifyToken(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {            
            return res.status(403).json({
                code: 403,
                message: "No credentials sent!"
            });
        }

        try {
            const token = req.headers.authorization.split("Bearer ")[1];

            res.locals.decodedToken = verify(token, "shhhhh");

            return next();            

        } catch (err) {
            return res.status(403).json({
                code: 403,
                message: "Invalid token"
            });
        }
    }
}