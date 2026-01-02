import { AddCommentaire, Commentaire, deleteCommentaire } from "./commentaire.js";
import { Connected, UserConnected, Default,updateAdminButton } from "./typescript.js";
import {Users,getUsers, createUser, deleteUser} from "./users.js";

let ListUsers = [];

document.addEventListener("DOMContentLoaded", async () => {
    const users = await getUsers(); 
    ListUsers = users.map( user => new Users(user.id, user.mail_phone, user.username, user.password)); 

    const mail = document.getElementById("email/phone");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const passwordVerif = document.getElementById("password_check");
    const codeVerif = document.getElementById("code");

    const username_to_delete = document.getElementById("username_delete");
    const password_to_delete = document.getElementById("password_delete");
    const passwordVerif_to_delete = document.getElementById("password_check_delete");

    const commentaire = document.getElementById("message");
    const button_delete_commentaire = document.querySelectorAll(".commentaire_option_delete");

    document.querySelector(".sign_up_button").addEventListener("click", async (e) =>{
        e.preventDefault();
        if(Connected.value){
            mail.value = "";
            username.value = "";
            password.value = "";
            passwordVerif.value = "";
            codeVerif.value = "";           
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
                    if(await verifyCode(mail.value.trim(),codeVerif.value)){
                        if(checkPassword(password, passwordVerif)){
                            createUser(mail.value.trim(),username.value.trim(),password.value,passwordVerif.value);
                            ListUsers[ListUsers.length] = newUser;
                            mail.value = "";
                            username.value = ""
                            password.value = "";
                            passwordVerif.value= "";
                            codeVerif.value = "";
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
                            codeVerif.value = "";
                            Swal.fire({
                                icon: "error",
                                position: "top-end",
                                text: "Une erreur a été rencontrée pour votre mot de passe",
                                showConfirmButton: false,
                                timer: 2500
                            });  
                        }
                    }else{
                        Swal.fire({
                            icon: "error",
                            position: "top-end",
                            text: "Le code de vérification n'est pas correcte",
                            showConfirmButton: false,
                            timer: 2500
                        });  
                    }
                }else{
                    mail.value = "";
                    password.value = "";
                    passwordVerif.value= "";
                    codeVerif.value="";
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
                                    Connected.value = true;
                                    UserConnected.value = username;
                                    localStorage.setItem("Connected", "true");
                                    localStorage.setItem("UserConnected", username);
                                    updateAdminButton(Connected.value,UserConnected.value);
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

    document.querySelector(".delete_button").addEventListener("click",async (e) =>{
        e.preventDefault();
        if(!Connected.value){
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
                    await deleteUser(username_to_delete.value,password_to_delete.value, passwordVerif_to_delete.value)
                    username_to_delete.value = ""
                    password_to_delete.value = "";
                    passwordVerif_to_delete.value= "";
                    Connected.value = false;
                    UserConnected.value = Default.value;
                    localStorage.setItem("Connected", "false");
                    localStorage.setItem("UserConnected", Default.value);
                    updateAdminButton(Connected.value,UserConnected.value);
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
    document.querySelector(".fa-barcode").addEventListener("click", (e) =>{
        Swal.fire({
            icon: "info",
            position: "bottom-start",
            html: "Pour obtenir un code de vérification, il suffit de cliquer sur 'Obtenir code' afin de vérifier que l'email ou numéro de téléphone donné est valide.",
            showConfirmButton: false,
            timer: 5000
        })
    });
    document.querySelector(".get_code").addEventListener("click", async (e) =>{
        if(!mail.value){
            username.value = "";
            password.value = "";
            passwordVerif.value= "";
            Swal.fire({
                icon: "info",
                position: "bottom-start",
                html: "Veuillez rentrer une adresse mail ou un numéro de téléphone.",
                showConfirmButton: false,
                timer: 2500
            });
        }else{
            if(checkEmail_Phone(mail.value)){
                const new_id = ListUsers.length;
                const newUser = new Users(new_id,mail.value.trim(),username.value.trim(), password.value);
                if(checkEmail_Phone_correct(newUser) && checkEmail_Correct(newUser)){
                    await AddMailVerification(mail.value.trim());
                    Swal.fire({
                        icon: "success",
                        position: "top-end",
                        text: "Le code a été envoyé avec succès",
                        showConfirmButton: false,
                        timer: 2500
                    });  
                }else if(checkEmail_Phone_correct(newUser) && !checkEmail_Correct(newUser)){
                    Swal.fire({
                        icon: "info",
                        title: "Fonctionnalité Non disponible",
                        text: "Navré mais pour le moment la création de compte via un numéro de téléphone n'est pas possible en raison de condition financier.",
                        position: "center",
                        showConfirmButton: true
                    }); 
                }else{
                    mail.value = "";
                    password.value = "";
                    passwordVerif.value= "";
                    codeVerif.value="";
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
                                    Connected.value = true;
                                    UserConnected.value = username;
                                    localStorage.setItem("Connected", "true");
                                    localStorage.setItem("UserConnected", username);
                                    updateAdminButton(Connected.value,UserConnected.value);
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
    document.querySelector(".button_message").addEventListener("click", async (e) =>{
        const commentaire_to_push = commentaire.value;
        if(Connected.value){
            console.log(UserConnected.value);
            if(commentaire_to_push === null || commentaire_to_push === ""){
                Swal.fire({
                    icon : "info",
                    text: "Veuillez écrire quelque chose si vous souhaitez laisser un commentaire",
                    position: "top-end",
                    timer: 2500,
                    showConfirmButton: false
                })
            }else{
                AddCommentaire(UserConnected.value, commentaire_to_push);
                Swal.fire({
                    icon : "success",
                    text: "Votre commentaire a bien été pris en compte.",
                    position: "top-end",
                    timer: 2500,
                    showConfirmButton: false
                });
            }
        }else{
            Swal.fire({
                icon : "error",
                text: "Il faut être connecter pour pouvoir laisser un commentaire",
                position: "top-end",
                timer: 2500,
                showConfirmButton: false
            })
        }
    });

    button_delete_commentaire.forEach(commentaire =>{
        commentaire.addEventListener("click", async (e)  =>{
            e.preventDefault();
            e.stopPropagation();
            const commentaireSelected = e.currentTarget.closest(".element-commentaire");
            const commentData = {
                id: commentaireSelected.dataset.id,
                user: commentaireSelected.dataset.user,
                commentaire: commentaireSelected.dataset.commentaire
            };

            Swal.fire({
                icon: "info",
                position: "center",
                showConfirmButton: false,
                customClass:{
                    popup: "swal-popup"
                },
                html: `
                <a class="demande_delete">Souhaitez vous supprimez ce commentaire ?</a>
                <div class="yes_no_box">
                <a class="yes_delete_commentaire"><i class="fa-solid fa-circle-check button-fire-delete"></i></a>
                <a class="no_delete_commentaire"><i class="fa-solid fa-circle-xmark button-fire-delete"></i></a>
                </div>
                `,
                didOpen: async () =>{
                    document.querySelector(".no_delete_commentaire").addEventListener("click", async (e) =>{
                        Swal.close();
                    })
                    document.querySelector(".yes_delete_commentaire").addEventListener("click", async (e) =>{
                        if(Connected.value === false){
                            Swal.close();
                            Swal.fire({
                                icon: "error",
                                text: "Vous devez connectez pour pouvoir supprimer un commentaire",
                                position: "top-end",
                                showConfirmButton: false,
                                timer: 2500
                            })
                        }else{
                            if(!Autoriwed(commentData, UserConnected.value)){
                                Swal.close();
                                Swal.fire({
                                    icon: "error",
                                    text: "Vous n'avez pas les droits pour supprimer ce commentaire",
                                    position: "top-end",
                                    showConfirmButton: false,
                                    timer: 2500
                                });
                            }else{
                                const data = await getUsers(); 
                                const users = data.map( us => new Users(us.id, us.mail_phone,us.username, us.password));
                                let user;
                                for(let u of users){
                                    if(u.username === UserConnected.value){
                                        user = new Users(u.id, u.mail_phone, UserConnected.value, u.password);
                                    }

                                }
                                const commentaire = new Commentaire(commentData.id, commentData.user, commentData.commentaire);
                                deleteCommentaire(user,commentaire);
                                Swal.close();
                                Swal.fire({
                                    icon: "success",
                                    text: "Le commentaire a bien été supprimé",
                                    position: "top-end",
                                    showConfirmButton: false,
                                    timer: 2500
                                });
                            }
                        }
                    })
                }
            });
        });
    });
});


function Autoriwed(commentaire, userConnected){
    if(commentaire.user === userConnected || userConnected === "Admin"){
        return true;
    }else{
        return false;
    }
}

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

function checkEmail_Correct(newUser){
   return newUser.mail_phone.includes("@") 
}

function checkEmail_Phone_correct(newUser){
    const value = newUser.mail_phone;
    if(value.includes("@")){
        return true;
    }else if ( /^[0-9]+$/.test(value)){
        return true;
    }else{
        return false;
    }
}

async function AddMailVerification(mailPhone){
    const reponse = await fetch("http://localhost:8888/mail-code-verification",{
        method: "POST",
        headers: { "Content-type": "application/json"},
        body: JSON.stringify({
            mail_phone: mailPhone
        })
    });
    const result = await reponse.text();
    if(!reponse.ok){
        Swal.fire({
            icon: "error",
            text: result
        });
        return false;
    }
    return true;
}

async function verifyCode(mailPhone, code){
    if(!code){
        Swal.fire({
            icon: "error",
            text: "Veuillez entrer le code de vérification"
        });
        return;
    }
    const reponse = await fetch("http://localhost:8888/verify-code", {
        method: "POST",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({
            mail_phone: mailPhone,
            code: code.trim()
        })
    });
    
    const result = await reponse.text();
    if(!reponse.ok){
        Swal.fire({
            icon: "error",
            text: result
        });
        return false;
    }
    return true;
}

// Pourquoi pas plus tard mettre en place pour les commentaires un systeme de signalement et de modification.
