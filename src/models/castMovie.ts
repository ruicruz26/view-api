export default class CastMovie {
    movies_id: number;
    cast_id: number;
    name: string;

    constructor(row: any) {
        if(row) {
            this.movies_id = row.movies_id;
            this.cast_id = row.cast_id;
            this.name = row.name;
        }
    }
}