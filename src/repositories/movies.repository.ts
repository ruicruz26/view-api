import pool from "../core/database/mysql.database";
import { FieldPacket } from "mysql2";
import Movie from "../models/movie";
import CastMovie from "../models/castMovie";
import NonCastMovie from "../models/NonCastMovie";
import GenreMovie from "../models/genreMovie";
import Genre from "../models/genre";
import sendEmail from "../core/mail/mailer";
import { sendSgMail, sendSgMailWithTemplate } from "../core/mail/sendgrid";

export default class MoviesRepository {

    public static async selectAll(): Promise<Movie[]> {
        return new Promise((resolve, reject) => {
            pool.query(
                "SELECT * FROM movies",
                (err: any, rows: any[], fields: FieldPacket[]) => {
                    const movies: Movie[] = [];
                    rows.forEach(row => movies.push(new Movie(row)));
                    resolve(movies);
                }
            );
        });
    }

    public static async selectById(id: number): Promise<Movie> {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT * FROM movies WHERE id_movies = ${id} LIMIT 1`,               
                (err: any, rows: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err.sqlMessage);
                        return;
                    }

                    if (rows.length > 0) {
                        resolve(new Movie(rows[0]));
                    }
                    reject(new Error("Movie not found."));
                }
            );
        });
    }

    public static async createOrUpdate(movie: Movie): Promise<any>  {
        return new Promise((resolve, reject) => {
            
            let query: string;

            if(!movie.id_movies) {
                query = `INSERT INTO movies (name, description, classification, release_date, duration) 
                             VALUES ('${movie.name}', '${movie.description}', '${movie.classification}', '${movie.release_date}', '${movie.duration}')`;
            } else {
                query = `UPDATE movies
                             SET  name = '${movie.name}', description = '${movie.description}', classification = '${movie.classification}', release_date = '${movie.release_date}' ,duration = '${movie.duration}'
                             WHERE id_movies = ${movie.id_movies}`;
            }

            pool.query(
                query,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err);
                        return;
                    }
                    
                    if (result.affectedRows > 0) {
                        if(!movie.id_movies) {
                            sendSgMailWithTemplate(movie,"d-2d6bb160ba08466ea750e3634f4bb28c");
                            //sendSgMail('Sending with SendGrid is Fun','and easy to do anywhere, even with Node.js','<strong>and easy to do anywhere, even with Node.js</strong>');
                            //sendEmail("New Movie Added!", `New movie, ${movie.name}, was added just now, go check it ou on view!`);
                        }
                        resolve(result.insertId);
                    }
                    reject(new Error(`Movie not found. Error was: ${err}`));
                }
            );
        });
    }

    public static async delete(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM movies WHERE id_movies = ${id}`,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err);
                        return;
                    }

                    if(result.affectedRows > 0) {
                        resolve(id);
                    }
                    reject(new Error(`Movie not found. Error was: ${err}`));
                }
            );
        });
    }

    public static async selectAllCastMovie(movieId: number): Promise<CastMovie[]> {
        return new Promise((resolve, response) => {
            pool.query(
                `SELECT * FROM cast_per_movie cpm LEFT JOIN movie_cast mc ON cpm.cast_id = mc.id_cast WHERE cpm.movies_id = ${movieId}`,
                (err: any, rows: any[], fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err.sqlMessage);
                        return;
                    }
                    if(rows !== undefined) {
                        const castMovie: CastMovie[] = [];
                        rows.forEach(row => castMovie.push(new CastMovie(row)));
                        resolve(castMovie);
                    }
                }
            );
        })
    }

    public static async selectAllNonCastMovie(movieId: number): Promise<NonCastMovie[]> {
        return new Promise((resolve, response) => {
            pool.query(
                `SELECT * FROM movie_cast mc LEFT JOIN cast_per_movie cpm ON mc.id_cast = cpm.cast_id AND cpm.movies_id = ${movieId} WHERE cpm.movies_id IS NULL`,
                (err: any, rows: any[], fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err.sqlMessage);
                        return;
                    }
                    if(rows !== undefined) {
                        const castMovie: NonCastMovie[] = [];
                        rows.forEach(row => castMovie.push(new NonCastMovie(row)));
                        resolve(castMovie);
                    }
                }
            );
        })
    }

    public static async insertCastMovie(castMovie: CastMovie): Promise<any> {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO cast_per_movie (movies_id, cast_id) 
                 VALUES (${castMovie.movies_id}, ${castMovie.cast_id})`,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err);
                        return;
                    }

                    if(result.affectedRows > 0) {
                        resolve(result.insertId);
                    }
                    reject(new Error(`Movie/Cast not found. Error was: ${err}`));
                }
            );
        });
    }

    public static async deleteCastMovie(movieId: number, castId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM cast_per_movie WHERE movies_id = ${movieId} AND cast_id = ${castId}`,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err);
                        return;
                    }
                    
                    if(result.affectedRows > 0) {
                        resolve(0);
                    }
                    reject(new Error(`Movie/Cast not found. Error was: ${err}`));
                }
            );
        });
    }

    public static async selectAllGenreMovie(movieId: number): Promise<GenreMovie[]> {
        return new Promise((resolve, response) => {
            pool.query(
                `SELECT mg.movies_id, mg.genre_id, g.name AS genre_name FROM movie_genres mg LEFT JOIN genre g ON mg.genre_id = g.id_genre WHERE movies_id = ${movieId}`,
                (err: any, rows: any[], fields: FieldPacket[]) => {
                    const movieGenre: GenreMovie[] = [];
                    rows.forEach(row => movieGenre.push(new GenreMovie(row)));
                    resolve(movieGenre);
                }
            );
        })
    }

    public static async selectAllNonGenreMovie(movieId: number): Promise<Genre[]> {
        return new Promise((resolve, response) => {
            pool.query(
                `SELECT * FROM genre g LEFT JOIN movie_genres mg ON g.id_genre = mg.genre_id AND mg.movies_id = ${movieId} WHERE mg.movies_id IS NULL`,
                (err: any, rows: any[], fields: FieldPacket[]) => {
                    const movieGenre: Genre[] = [];
                    rows.forEach(row => movieGenre.push(new Genre(row)));
                    resolve(movieGenre);
                }
            );
        })
    }

    public static async insertGenreMovie(genreMovie: GenreMovie): Promise<any> {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO movie_genres (movies_id, genre_id) 
                 VALUES (${genreMovie.movies_id}, ${genreMovie.genre_id})`,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err);
                        return;
                    }

                    if(result.affectedRows > 0) {
                        resolve(result.insertId);
                    }
                    reject(new Error(`Movie/Genre not found. Error was: ${err}`));
                }
            );
        });
    }

    public static async deleteGenreMovie(movieId: number, genreId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM movie_genres WHERE movies_id = ${movieId} AND genre_id = ${genreId}`,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err);
                        return;
                    }

                    if(result.affectedRows > 0) {
                        resolve(0);
                    }
                    reject(new Error(`Movie/Genre not found. Error was: ${err}`));
                }
            );
        });
    }

    public static async allUserSeen(id: number): Promise<Movie[]> {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT m.* FROM seen s LEFT JOIN movies m ON s.movies_id = m.id_movies WHERE s.users_id = ${id}`,
                (err: any, rows: any[], fields: FieldPacket[]) => {
                    const movies: Movie[] = [];
                    rows.forEach(row => movies.push(new Movie(row)));

                    resolve(movies);
                }
            );
        });
    }

    public static async createUserSeen(userId: number , movieId: number): Promise<any>  {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO seen (users_id, movies_id) VALUES ('${userId}', '${movieId}')`,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err);
                        return;
                    }
                    
                    if (result.affectedRows > 0) {
                        resolve(result.insertId);
                    }
                    reject(new Error(`Movie not found. Error was: ${err}`));
                }
            );
        });
    }

    public static async deleteUserSeen(userId: number , movieId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM seen WHERE users_id = ${userId} AND movies_id = ${movieId}`,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err);
                        return;
                    }

                    if(result.affectedRows > 0) {
                        resolve(userId);
                    }
                    reject(new Error(`Movie not found. Error was: ${err}`));
                }
            );
        });
    }

    public static async allUserFavorites(id: number): Promise<Movie[]> {
        return new Promise((resolve, reject) => {
            pool.query(
                `SELECT m.* FROM favorites f LEFT JOIN movies m ON f.movies_id = m.id_movies WHERE f.users_id = ${id}`,
                (err: any, rows: any[], fields: FieldPacket[]) => {
                    const movies: Movie[] = [];
                    rows.forEach(row => movies.push(new Movie(row)));
                    resolve(movies);
                }
            );
        });
    }

    public static async createUserFavorites(userId: number , movieId: number): Promise<any>  {
        return new Promise((resolve, reject) => {
            pool.query(
                `INSERT INTO favorites (users_id, movies_id) VALUES ('${userId}', '${movieId}')`,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err);
                        return;
                    }
                    
                    if (result.affectedRows > 0) {
                        resolve(result.insertId);
                    }
                    reject(new Error(`Movie not found. Error was: ${err}`));
                }
            );
        });
    }

    public static async deleteUserFavorites(userId: number , movieId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            pool.query(
                `DELETE FROM favorites WHERE users_id = ${userId} AND movies_id = ${movieId}`,
                (err: any, result: any, fields: FieldPacket[]) => {
                    if(err != null) {
                        resolve(err);
                        return;
                    }

                    if(result.affectedRows > 0) {
                        resolve(userId);
                    }
                    reject(new Error(`Movie not found. Error was: ${err}`));
                }
            );
        });
    }
}