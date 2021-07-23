import UsersRepository from "../../repositories/users.repository";

async function InitilizeApp() {
    
    await UsersRepository.selectAll()
    .then(res => {
        if(res.length === 0) {
            UsersRepository.registerNewUser({
                "id_users": 0,
                "name": "Master",
                "username": "master",
                "password": "master",
                "email": "",
                "phone": "",
                "user_role": "Master",
                "profile_picture": ""
            })
        }
    })
}

export default InitilizeApp;