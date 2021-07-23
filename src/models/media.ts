export default class Media {
    id_media: number;
    movies_id: number;
    file_location: string;

    constructor(row: any = null) {
        if(row) {
            this.id_media = row.id_media;
            this.movies_id = row.movies_id;
            this.file_location = row.file_location;
        }
    }
}