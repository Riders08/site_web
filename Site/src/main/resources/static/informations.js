import { Connected, UserConnected, updateAdminButton } from "./typescript.js";
import {Users,getUsers, createUser, deleteUser} from "./users.js";

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

    const username_to_delete = document.getElementById("username_delete");
    const password_to_delete = document.getElementById("password_delete");
    const passwordVerif_to_delete = document.getElementById("password_check_delete");

    document.querySelector(".sign_up_button").addEventListener("click", (e) =>{
        e.preventDefault();
        if(Connected){
            Swal.fire({
                icon: "error",
                position: "top-end",
                text: "Vous êtes déjà connectez.",
                showConfirmButton: false,
                timer: 2500
            })
        }else{
            const new_id = ListUsers.length;
            const newUser = new Users(new_id,mail.value.trim(),username.value.trim(), password.value);
            if(checkEmail_Phone(newUser.mail_phone.trim())){
                if(checkEmail_Phone_correct(newUser)){
                    if(checkPassword(password, passwordVerif)){
                        createUser(mail.value.trim(),username.value.trim(),password.value,passwordVerif.value);
                        ListUsers[ListUsers.length] = newUser;
                        ListUsers.forEach(user => {
                            console.log(user.id);
                            console.log(user.mail_phone);
                            console.log(user.username);
                            console.log(user.password);
                        });
                        mail.value = "";
                        username.value = ""
                        password.value = "";
                        passwordVerif.value= "";
                        Swal.fire({
                            icon: "success",
                            position: "top-end",
                            text: "Votre compte a bien été créé.",
                            showConfirmButton: false,
                            timer: 2500
                        });  
                    }else{
                        password.value = "";
                        passwordVerif.value= "";
                        Swal.fire({
                            icon: "error",
                            position: "top-end",
                            text: "Une erreur a été rencontrée pour votre mot de passe",
                            showConfirmButton: false,
                            timer: 2500
                        });  
                    }
                }else{
                    mail.value = "";
                    password.value = "";
                    passwordVerif.value= "";
                    Swal.fire({
                        icon: "error",
                        position: "top-end",
                        text: "L'email ou numéro de téléphone donnée n'existe pas",
                        showConfirmButton: false,
                        timer: 2500
                    });  
                }
            }else{
                mail.value = "";
                password.value = "";
                passwordVerif.value= "";
                Swal.fire({
                    icon: "error",
                    position: "center",
                    text: "Un compte existe déjà avec ce mail ou numéro de téléphone",
                    footer: 'Vous connectez <div class="redirection_connection">ici</div>',
                    customClass: {
                        footer: "custom-footer",
                        text: "swal-text",
                        confirmButton: "swal-confirm",
                        popup: "swal-popup"
                    },
                    showConfirmButton: true,
                    didOpen: () => {
                       document.querySelector(".redirection_connection").addEventListener("click", (e) =>{
                        Swal.fire({
                            html: `
                            <form id="loginform">
                            <input type="text" id="login" class="input-sweet" placeholder="Identifiant" autocomplete="current-password">
                                <input type="password" id="password" class="input-sweet" placeholder="Mot de Passe" autocomplete="current-password">
                            </form>
                            `,
                            title: "Connexion",
                            confirmButtonText: "Se connecter",
                            customClass: {
                                title: 'swal-title',
                                confirmButton: 'swal-confirm',
                                popup: 'swal-popup'
                            },
                            focusConfirm: false,
                            preConfirm: () => {
                                const login = Swal.getPopup().querySelector('#login').value
                                const password = Swal.getPopup().querySelector('#password').value
                                console.log(login);
                                console.log(password);
                                if (!login || !password) {
                                    Swal.showValidationMessage("L'identifiant et le mot de passe sont obligatoires");
                                    return false;
                                }
                                if(password.length < 5){
                                    Swal.showValidationMessage("Attention le mot de passe doit faire au moins 5 caractères");
                                    return false;
                                } 
                                return {login: login, password: password}
                            }
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                const { login: username, password } = result.value;
                                const res = await login(username, password);
                                if (res.success) {
                                    Connected = true;
                                    UserConnected = username;
                                    localStorage.setItem("Connected", "true");
                                    localStorage.setItem("UserConnected", username);
                                    updateAdminButton(Connected,UserConnected);
                                    Swal.fire({
                                        icon: "success",
                                        title: "Connexion réussie",
                                        text: res.message,
                                        position: "top-end",
                                        timer: 2500,
                                        showConfirmButton: false
                                    });
                                } else {
                                    Swal.fire({
                                        icon: "error",
                                        title: "Échec de connexion",
                                        text: res.message,
                                        position: "top-end",
                                        timer: 2500,
                                        showConfirmButton: false
                                    });
                                }
                            }
                        });
                    });
                    }
                })
            }
        }
    });

    document.querySelector(".delete_button").addEventListener("click", (e) =>{
        e.preventDefault();
        if(!Connected){
            Swal.fire({
                icon: "error",
                position: "top-end",
                text: "Vous devez être connectez.",
                showConfirmButton: false,
                timer: 2500
            })
        }else{
            if(checkPassword(password_to_delete, passwordVerif_to_delete)){
                const user_to_delete = getUsers(username_to_delete.value, password_to_delete.value);
                if(user_to_delete === null){
                    Swal.fire({
                        icon: "error",
                        position: "top-end",
                        text: "Une erreur a été rencontrée lors de la récupération de l'utilisateur.",
                        showConfirmButton: false,
                        timer: 2500
                    });  
                }else{
                    deleteUser(username_to_delete.value,password_to_delete.value, passwordVerif_to_delete.value)
                    username_to_delete.value = ""
                    password_to_delete.value = "";
                    passwordVerif_to_delete.value= "";
                    /*Connected = false;
                    UserConnected = Default;
                    localStorage.setItem("Connected", "false");
                    localStorage.setItem("UserConnected", Default);
                    updateAdminButton(Connected,UserConnected);*/
                    Swal.fire({
                        icon: "success",
                        position: "top-end",
                        text: "Votre compte a bien été supprimé.",
                        showConfirmButton: false,
                        timer: 2500
                    });  
                }
            }else{
                password.value = "";
                passwordVerif.value= "";
                Swal.fire({
                icon: "error",
                    position: "top-end",
                    text: "Une erreur a été rencontrée pour votre mot de passe",
                    showConfirmButton: false,
                    timer: 2500
                });  
            }
        }
    })

    document.querySelector(".mail_phone_icon").addEventListener("click", (e) =>{
        Swal.fire({
            icon: "info",
            position: "bottom-start",
            html: 'Si vous rentrez un numéro de téléphone merci de ne pas mettre les espaces.<br> Exemple: 0600000000, test@gmail.com',
            showConfirmButton: false,
            timer: 2500
        })
    });
    document.querySelector(".username_precision").addEventListener("click", (e) =>{
        Swal.fire({
            icon: "info",
            position: "bottom-start",
            html: 'Le nom que vous choisissez sera celui affiché sur le site et dont vous aurez besoin pour vous connecter',
            showConfirmButton: false,
            timer: 2500
        })
    });
    document.querySelector(".password_verif_precision").addEventListener("click", (e) =>{
        Swal.fire({
            icon: "info",
            position: "bottom-start",
            html: 'Vous devez retaper le mot de passe choisi ci-dessus.',
            showConfirmButton: false,
            timer: 2500
        })
    });
    document.querySelector(".password_precision").addEventListener("click", (e) =>{
        Swal.fire({
            icon: "info",
            position: "bottom-start",
            html: "Votre mot de passe doit: <br><ul><li>Contenir au moins 5 caractères</li><li>Contenir au moins un caractère spécial</li></ul>",
            showConfirmButton: false,
            timer: 2500
        })
    });
});



function checkSamePassword(password, passwordVerif){
    return password.value === passwordVerif.value;
}

function checkPassword(password, passwordVerif){
    if(checkSamePassword(password,passwordVerif)){
        if(checkCharSpecial(password.value)){
            if(password.value.length < 5 || passwordVerif.value.length < 5 ){
                return false;
            }else{
                return true;
            }
        }
    }
    return false;
}

function checkCharSpecial(password){
    for(let char of password){
        if (!(/[a-zA-Z0-9]/.test(char))){
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

// OBJECTIF pour le a propos
    // Il manque le mail + code de vérification
   //  Optionel : Créer la fonctionnalité qui delete definitivement un compte
  //  Créer l'idée de formulaire qui permet au utilisateur de faire un commentaire

// A finir avant la fin de l'année idéalement
