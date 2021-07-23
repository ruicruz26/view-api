import pool from "../core/database/mysql.database";
import { FieldPacket } from "mysql2";
import Media from "../models/media";

export default class MediaRepository {

    public static async selectAllByMovie(movieId: number): Promise<Media[]> {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM media WHERE movies_id = ${movieId}`,
                (err: any, rows: any[], fields: FieldPacket[]) => {
                    if(rows !== undefined) {
                        const media: Media[] = [];
                        rows.forEach(row => media.push(new Media(row)));
                        resolve(media);
                    }
                });
        });
    }

    public static async selectMediaById(mediaId: number): Promise<Media> {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM media WHERE id_media = '${mediaId}'`,
                (err: any, rows: any, fields: FieldPacket[]) => {
                    resolve(new Media(rows[0]));
                });
        });
    }

    public static async createOrUpdate(media: Media): Promise<any> {
        return new Promise((resolve, reject) => {
            
            pool.query(
                `INSERT INTO media (movies_id, file_location) 
                 VALUES (${media.movies_id}, '${media.file_location}')`,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        reject(err);
                        return;
                    }
                    
                    if(result.affectedRows > 0) {
                        resolve(result.insertId);
                    }

                    reject(new Error(`Media not found. Error was: ${err}`));
                });
        });
    }

    public static async delete(mediaId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM media WHERE id_media = ${mediaId}`,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        reject(err);
                        return;
                    }
                    
                    if(result.affectedRows > 0) {
                        resolve(mediaId);
                    }
                
                    reject(new Error(`Movie/Media not found. Error was: ${err}`));
                });
        });
    }
}