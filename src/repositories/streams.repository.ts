import pool from "../core/database/mysql.database";
import { FieldPacket } from "mysql2";
import Stream from "../models/stream";

export default class StreamRepository {

    public static async selectAllByMovie(movieId: number): Promise<Stream[]> {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM streams WHERE movies_id = ${movieId}`,
                (err: any, rows: any[], fields: FieldPacket[]) => {
                    const stream: Stream[] = [];
                    rows.forEach(row => stream.push(new Stream(row)));
                    resolve(stream);
                });
        });
    }

    public static async selectStreamById(streamId: number): Promise<Stream> {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM streams WHERE id_stream = '${streamId}'`,
                (err: any, rows: any, fields: FieldPacket[]) => {
                    resolve(new Stream(rows[0]));
                });
        });
    }

    public static async createOrUpdate(stream: Stream): Promise<any> {
        return new Promise((resolve, reject) => {~
            pool.query(
                `INSERT INTO streams (movies_id, file_location, stream_type) 
                 VALUES (${stream.movies_id}, '${stream.file_location}', '${stream.stream_type}')`,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err);
                        return;
                    }

                    if(result.affectedRows > 0) {
                        resolve(result.insertId);
                    }

                    reject(new Error(`Stream not found. Error was: ${err}`));
                });
        });
    }

    public static async delete(streamId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM streams WHERE id_stream = ${streamId}`,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err);
                        return;
                    }
                    
                    if(result.affectedRows > 0) {
                        resolve(streamId);
                    }
                
                    reject(new Error(`Stream not found. Error was: ${err}`));
                });
        });
    }

    public static async streamMovie(streamId: number):Promise<Stream> {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM streams WHERE id_stream = ${streamId}`,
                (err: any, rows: any[], fields: FieldPacket[]) => {
                    if(rows.length > 0) {
                        const stream = new Stream(rows[0]);
                        resolve(stream);
                    }
                
                    reject(new Error(`Stream not found. Error was: ${err}`));
                });
        });
    }
}