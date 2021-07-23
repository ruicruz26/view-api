export default class Stream {
    id_stream: number;
    movies_id: number;
    file_location: string;
    stream_type: string;

    constructor(row: any = null) {
        if(row) {
            this.id_stream = row.id_stream;
            this.movies_id = row.movies_id;
            this.file_location = row.file_location;
            this.stream_type = row.stream_type;
        }
    }
}