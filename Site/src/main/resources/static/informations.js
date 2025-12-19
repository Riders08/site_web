import {Users,getUsers, createUser} from "./users.js";

let ListUsers = [];

document.addEventListener("DOMContentLoaded", async () => {
    const users = await getUsers(); 
    ListUsers = users.map( user => new Users(user.id, user.mail_phone, user.username, user.password)); 
    console.log(ListUsers);
    ListUsers.forEach(user => {
        console.log(user.id);
        console.log(user.mail_phone);
        console.log(user.username);
        console.log(user.password);
    });

    const mail = document.getElementById("email/phone");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const passwordVerif = document.getElementById("password_check");

    document.querySelector(".sign_up_button").addEventListener("click", (e) =>{
        e.preventDefault();
        const new_id = ListUsers.length;
        const newUser = new Users(new_id,mail.value.trim(),username.value.trim(), password.value);
        if(checkEmail_Phone(newUser.mail_phone.trim())){
            if(checkEmail_Phone_correct(newUser)){
                if(checkPassword(password, passwordVerif)){
                    createUser(mail.value.trim(),username.value.trim(),password.value,passwordVerif.value);
                }else{
                    Swal.fire({
                        icon: "error",
                        position: "top-end",
                        text: "Une erreur a été rencontrée pour votre mot de passe, il doit contenir au moins 5 caractères.",
                        showConfirmButton: false,
                        timer: 2500
                    });  
                }
            }else{
                Swal.fire({
                    icon: "error",
                    position: "top-end",
                    text: "L'email ou numéro de téléphone donnée n'existe pas",
                    showConfirmButton: false,
                    timer: 2500
                });  
            }
        }else{
            Swal.fire({
                icon: "error",
                position: "top-end",
                text: "Un compte existe déjà avec ce mail ou numéro de téléphone",
                // penser a créer un pop-up pour la connection 
                showConfirmButton: false,
                timer: 2500
            })
        }
    })
});

function checkSamePassword(password, passwordVerif){
    return password.value === passwordVerif.value;
}

function checkPassword(password, passwordVerif){
    if(checkSamePassword(password,passwordVerif)){
        if(password.value.length < 5 || passwordVerif.value.length < 5){
            return false;
        }else{
            return true;
        }
    }
    return false;
}

function checkEmail_Phone(mail_phone){
    for(let u of ListUsers){
        if (mail_phone === u.mail_phone){
            return false;
        }
    }
    return true;
}

function checkEmail_Phone_correct(newUser){
    const value = newUser.mail_phone;
    return value.includes("@") || /^[0-9]+$/.test(value);
}
