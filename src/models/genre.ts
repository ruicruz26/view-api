export default class Genre {
    id_genre: number;
    name: string;

    constructor(row: any = null) {
        if(row) {
            this.id_genre = row.id_genre;
            this.name = row.name;
        }
    }
}