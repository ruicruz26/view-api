export default class GenreMovie {
    movies_id: number;
    genre_id: number;
    genre_name: string;

    constructor(row: any) {
        if(row) {
            this.movies_id = row.movies_id;
            this.genre_id = row.genre_id;
            this.genre_name = row.genre_name;
        }
    }
}