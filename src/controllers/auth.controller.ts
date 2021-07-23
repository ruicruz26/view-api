import { Request, Response } from "express";
import UsersRepository from "../repositories/users.repository";
import AuthMiddleware from "../core/auth/auth.middleware";
import { compare } from "bcryptjs";
import InitilizeApp from "../core/helper/Initialize";
import sendEmail from "../core/mail/mailer";
import { hash } from "bcryptjs";

//To setup first Master Account
InitilizeApp();

class AuthController {

    public async login(req: Request, res: Response): Promise<Response> {
        try {
            const user = await UsersRepository.selectByUsername(req.params.username);

            await compare(req.params.password,user.password)
            .then(comparison => {
                if(!comparison) {
                    throw new Error("Wrong Password");
                }
            })
            
            const token = AuthMiddleware.createToken(user);

            return res.json({
                "user": user,
                "token": token
            });
        } catch(err) {
            return res.status(404).json(err);
        }
    }

    public async register(req: Request, res: Response): Promise<Response> {
        try {
            const response = await UsersRepository.registerNewUser(req.body);

            const user = await UsersRepository.selectById(response);

            const token = AuthMiddleware.createToken(user);

            if(response.sqlMessage !== undefined) {
                return res.status(400).json(response.sqlMessage);
            }

            return res.json({
                "user": user,
                "token": token
            });
        } catch(err) {
            return res.status(404).json(err);
        }
    }

    public async newPassword(req: Request, res: Response): Promise<Response> {
        try {

            const user = await UsersRepository.selectByUsername(req.body.username);

            if(user.id_users === undefined) {
                return res.status(400).json({response: "This user doesn't exist."});
            }

            sendEmail("Password Reset",`If you wish to reset your password click the following link: ${process.env.FRONT_END_URL}/resetPassword/${user.id_users}`)
            
            return res.status(200).json({response: "Email Sent!"});
        } catch(err) {
            return res.status(404).json(err);
        }
    }

    public async resetPassword(req: Request, res: Response): Promise<Response> {
        try {
            let user = await UsersRepository.selectById(req.body.id_users);

            if(user !== undefined) {
                user.password = req.body.password;

                await hash(user.password,8)
                    .then(hashed => user.password = hashed);

                const response = await UsersRepository.createOrUpdate(user);

                if(response.sqlMessage !== undefined) {
                    return res.status(400).json(response.sqlMessage);
                }

                return res.json({response: response});
            }

            
            return res.status(400).json({response: "User not found"});

        } catch (err) {
            return res.status(404).json(err);
        }
    }
}

export default new AuthController();