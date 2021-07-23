export default class User {
    id_users: number;
    name: string;
    username: string;
    password: string;
    email: string;
    phone: string;
    user_role: string;
    profile_picture: string;

    constructor(row: any = null) {
        if (row) {
            this.id_users = row.id_users;
            this.name = row.name;
            this.username = row.username;
            this.password = row.password;
            this.email = row.email;
            this.phone = row.phone;
            this.user_role = row.user_role;
            this.profile_picture = row.profile_picture;
        }
    }
}