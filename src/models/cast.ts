export default class Cast {
    id_cast: number;
    name: string;
    roles_id: number;

    constructor(row: any = null) {
        if(row) {
            this.id_cast = row.id_cast;
            this.name = row.name;
            this.roles_id = row.roles_id;
        }
    }
}