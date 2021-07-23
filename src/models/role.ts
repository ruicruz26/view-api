export default class Role {
    id_roles: number;
    name: string;

    constructor(row: any = null) {
        if(row) {
            this.id_roles = row.id_roles;
            this.name = row.name;
        }
    }
}