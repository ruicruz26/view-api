export default class NonCastMovie {
    id_cast: number;
    name: string;

    constructor(row: any) {
        if(row) {
            this.id_cast = row.id_cast;
            this.name = row.name;
        }
    }
}