import pool from "../core/database/mysql.database";
import { FieldPacket } from "mysql2";
import User from "../models/user";
import { hash } from "bcryptjs";

export default class UsersRepository {

    public static async registerNewUser(user: User): Promise<any> {

        await hash(user.password,8)
            .then(hashed => user.password = hashed);

        user.user_role === undefined ? user.user_role = "Client" : "";

        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO users (name, username, password, email, phone, user_role, profile_picture) 
                    VALUES ('${user.name}', '${user.username}', '${user.password}', '${user.email}', '${user.phone}', '${user.user_role}', '${user.profile_picture}')`,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        reject(new Error(err));
                        return;
                    }

                    if (result.affectedRows > 0) {
                        resolve(result.insertId);
                    }
                    reject(new Error(`User not found. Error was: ${err}`));
                }
            );
        });
    }

    public static async selectAll(): Promise<User[]> {
        return new Promise((resolve, reject) => {    
        /* 
        import knexQuery from "../core/database/mysql.database";

        knexQuery('users1')
        .catch(function(error) {
            resolve(error.sqlMessage)
        }) */

        pool.query(
            "SELECT * FROM users",
            [],
            (err: any, rows: any[], fields: FieldPacket[]) => {
                const users: User[] = [];
                rows.forEach(row => users.push(new User(row)));
                resolve(users);
            }
        );
    })
    }    

    public static async selectByUsername(username: string): Promise<User> {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM users WHERE username='${username}'`,
                (err: any, rows:any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err.sqlMessage);
                        return;
                    }

                    if (rows.length > 0) {
                        resolve(new User(rows[0]));
                    }

                    reject(new Error("User not found."));
                }
            )
        })
    }

    public static async selectById(id: number): Promise<User> {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM users WHERE id_users = ${id} LIMIT 1`,               
                (err: any, rows: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err.sqlMessage);
                        return;
                    }
                    
                    if (rows.length > 0) {
                        resolve(new User(rows[0]));
                    }
                    reject(new Error("User not found."));
                }
            );
        });
    }

    public static async createOrUpdate(user: User): Promise<any>  {
        
        if(!user.id_users) {
            await hash(user.password,8)
                .then(hashed => user.password = hashed);
        }

        return new Promise((resolve, reject) => {
            
            let query: string;

            if(user.id_users === undefined) {                
                query = `INSERT INTO users (name, username, password, email, phone, user_role, profile_picture) 
                             VALUES ('${user.name}', '${user.username}', '${user.password}', '${user.email}', '${user.phone}', '${user.user_role}', '${user.profile_picture}')`;
            } else {
                query = `UPDATE users
                             SET  name = '${user.name}', username = '${user.username}', password = '${user.password}', email = '${user.email}' ,phone = '${user.phone}', user_role = '${user.user_role}', profile_picture = '${user.profile_picture}'
                             WHERE id_users = ${user.id_users}`;
            }

            pool.query(
                query,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err);
                        return;
                    }
                    
                    if (result.affectedRows > 0) {
                        resolve(result.insertId);
                    }
                    reject(new Error(`User not found. Error was: ${err}`));
                }
            );
        });
    }

    public static async delete(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM users WHERE id_users = ${id}`,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err);
                        return;
                    }

                    if (result.affectedRows > 0) {
                        resolve(id);
                    }
                    reject(new Error(`User not found. Error was: ${err}`));
                }
            );
        });
    }

    public static async postUserPhoto(id: number, file_location: string): Promise<any> {
        return new Promise((resolve, reject) => {
            pool.query(
                `UPDATE users u SET u.profile_picture = '${file_location}' WHERE id_users = '${id}'`,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err);
                        return;
                    }

                    if (result.affectedRows > 0) {
                        resolve(id);
                    }
                    reject(new Error(`User not found. Error was: ${err}`));
                }
            );
        }); 
    }
}