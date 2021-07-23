import pool from "../core/database/mysql.database";
import { FieldPacket } from "mysql2";
import Cast from "../models/cast";
import CastWithRole from "../models/castWithRole";

export default class CastRepository {

    public static async selectAll(): Promise<CastWithRole[]> {
        return new Promise((resolve, reject) => {
            pool.query(
                "SELECT mc.id_cast, mc.name, mc.roles_id, r.name AS role_name FROM movie_cast mc LEFT JOIN roles r ON mc.roles_id = r.id_roles",
                (err: any, rows: any[], fields: FieldPacket[]) => {
                    const cast: CastWithRole[] = [];
                    rows.forEach(row => cast.push(new CastWithRole(row)));
                    resolve(cast);
                });
        });
    }

    public static async selectById(id: number): Promise<Cast> {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM movie_cast WHERE id_cast = ${id} LIMIT 1`,               
                (err: any, rows: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err.sqlMessage);
                        return;
                    }
                    
                    if (rows.length > 0) {
                        resolve(new Cast(rows[0]));
                    }
                    reject(new Error("Cast not found."));
                }
            );
        });
    }

    public static async createOrUpdate(cast: Cast): Promise<any>  {
        return new Promise((resolve, reject) => {
            
            let query: string;

            if(!cast.id_cast) {
                query = `INSERT INTO movie_cast (name, roles_id) 
                         VALUES ('${cast.name}', '${cast.roles_id}')`;
            } else {
                query = `UPDATE movie_cast
                             SET  name = '${cast.name}', roles_id = '${cast.roles_id}'
                             WHERE id_cast = ${cast.id_cast}`;
            }

            pool.query(
                query,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err);
                        return;
                    }

                    if(result.affectedRows > 0) {
                        resolve(result.insertId);
                    }
                    reject(new Error(`Cast not found. Error was: ${err}`));
                }
            );
        });
    }

    public static async delete(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM movie_cast WHERE id_cast = ${id}`,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err);
                        return;
                    }

                    if (result.affectedRows > 0) {
                        resolve(id);
                    }
                    reject(new Error(`Cast not found. Error was: ${err}`));
                }
            );
        });
    }
}