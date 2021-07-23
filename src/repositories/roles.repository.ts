import pool from "../core/database/mysql.database";
import { FieldPacket } from "mysql2";
import Role from "../models/role";

export default class RoleRepository {

    public static async selectAll(): Promise<Role[]> {
        return new Promise((resolve, reject) => {
            pool.query(
                "SELECT * FROM roles",
                (err: any, rows: any[], fields: FieldPacket[]) => {
                    const roles: Role[] = [];
                    rows.forEach(row => roles.push(new Role(row)));
                    resolve(roles);
                });
        });
    }

    public static async selectById(id: number): Promise<Role> {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM roles WHERE id_roles = ${id} LIMIT 1`,               
                (err: any, rows: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err.sqlMessage);
                        return;
                    }

                    if (rows.length > 0) {
                        resolve(new Role(rows[0]));
                    }
                    reject(new Error("Role not found."));
                }
            );
        });
    }

    public static async createOrUpdate(role: Role): Promise<any>  {
        return new Promise((resolve, reject) => {
            
            let query: string;

            if(!role.id_roles) {
                query = `INSERT INTO roles (name) 
                             VALUES ('${role.name}')`;
            } else {
                query = `UPDATE roles
                             SET  name = '${role.name}'
                             WHERE id_roles = ${role.id_roles}`;
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
                    reject(new Error(`Role not found. Error was: ${err}`));
                }
            );
        });
    }

    public static async delete(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM roles WHERE id_roles = ${id}`,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err);
                        return;
                    }

                    if (result.affectedRows > 0) {
                        resolve(id);
                    }
                    reject(new Error(`Role not found. Error was: ${err}`));
                }
            );
        });
    }
}