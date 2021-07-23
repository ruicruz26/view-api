export default class UserFavorite {
    users_id: number;
    movies_id: number;

    constructor(row: any) {
        this.users_id = row.users_id;
        this.movies_id = row.movies_id;
    }
}