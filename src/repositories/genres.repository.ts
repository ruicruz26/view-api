import pool from "../core/database/mysql.database";
import { FieldPacket } from "mysql2";
import Genre from "../models/genre";

export default class GenreRepository {

    public static async selectAll(): Promise<Genre[]> {
        return new Promise((resolve, reject) => {
            pool.query(
                "SELECT * FROM genre",
                (err: any, rows: any[], fields: FieldPacket[]) => {
                    const genres: Genre[] = [];
                    rows.forEach(row => genres.push(new Genre(row)));
                    resolve(genres);
                });
        });
    }

    public static async selectById(id: number): Promise<Genre> {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM genre WHERE id_genre = ${id} LIMIT 1`,               
                (err: any, rows: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err.sqlMessage);
                        return;
                    }
                    
                    if (rows.length > 0) {
                        resolve(new Genre(rows[0]));
                    }
                    reject(new Error("Genre not found."));
                }
            );
        });
    }

    public static async createOrUpdate(genre: Genre): Promise<any>  {
        return new Promise((resolve, reject) => {
            
            let query: string;

            if(!genre.id_genre) {
                query = `INSERT INTO genre (name) VALUES ('${genre.name}')`;
            } else {
                query = `UPDATE genre
                             SET  name = '${genre.name}'
                             WHERE id_genre = ${genre.id_genre}`;
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
                    reject(new Error(`Genre not found. Error was: ${err}`));
                }
            );
        });
    }

    public static async delete(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM genre WHERE id_genre = ${id}`,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err);
                        return;
                    }
                    
                    if (result.affectedRows > 0) {
                        resolve(id);
                    }
                    reject(new Error(`Genre not found. Error was: ${err}`));
                }
            );
        });
    }
}