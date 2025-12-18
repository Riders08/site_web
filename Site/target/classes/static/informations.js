import {Users,getUsers, createUser} from "./users.js";

let ListUsers = [];

document.addEventListener("DOMContentLoaded", async () => {
    
    const users = await getUsers();
    ListUsers = users.map(user => new Users(user.id,user.username,user.password));
    console.log(ListUsers);
    ListUsers.forEach(user => {
        console.log(user.username);
        console.log(user.password);
        console.log(user.id);
        
    });

    const email = document.getElementById("email/phone");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const passwordVerif = document.getElementById("password_check");

    document.querySelector(".sign_up_button").addEventListener("click", (e) =>{
        e.preventDefault();
        const newUser = new Users(username.value, password.value);
        if(checkUsername(newUser)){
            createUser(email,username,password,passwordVerif);
            console.log("bon normalement lol");
        }else{
            Swal.fire({
                icon: "error",
                position: "top-end",
                text: "Le nom d",
                showConfirmButton: false,
                timer: 2500
            })
        }
    })
});

function checkUsername(newUser){
    for(let u of ListUsers){
        if (newUser.username === u.username){
            console.log("Le nom d'utilisateur existe déjà");
            return false;
        }
    }
    return true;
}

// EN FAITE il faut entierement revoir la table users de base pour bien distinguer la différence entre l'email/telephone et le nom d'utilisateur