export default class CastWithRole {
    id_cast: number;
    name: string;
    roles_id: number;
    role_name: string;

    constructor(row: any = null) {
        if(row) {
            this.id_cast = row.id_cast;
            this.name = row.name;
            this.roles_id = row.roles_id;
            this.role_name = row.role_name;
        }
    }
}