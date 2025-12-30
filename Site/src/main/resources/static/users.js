export class Users{
    constructor(id, mail_phone, username, password){
        this.id = id;
        this.mail_phone = mail_phone;
        this.username = username;
        this.password = password;
    }
}

export async function getUser(username, password){
    const data = await getUsers(); 
    const users = data.map( user => new Users(user.id, user.mail_phone,user.username, user.password));
    if(users){
        for(let user of users){
            if(user.username === username && user.password === password){
                return user;
            }
        }
    }
    return null;
}

export async function getUsers(){
    const reponse = await fetch("http://localhost:8888/users");
    if(reponse.ok){
        return await reponse.json();
    }
    throw new Error("Il y a eu un problème pour la récupération des données d'utilisateurs");
}

export async function createUser(mail_phone, username, password, passwordVerif){
    if(!mail_phone || !username || !password || !passwordVerif){
        return {success: false, message: "Error argument"};
    }
    const data = await getUsers(); 
    const users = data.map( user => new Users(user.id, user.mail_phone,user.username, user.password));
    if(users){
        for(let user of users){
            if(user.mail_phone === mail_phone){
                return {success: false, message: "Email ou numéro de téléphone déjà affilié"};
            }
            if(user.username === username){
                return {success: false, message: "Ce surnom existe déjà"};
            }
        }
    }
    if(password !== passwordVerif){
        return {success: false, message: "Les deux mots de passe écrit ne sont pas similaire."};
    }
    if(password.length < 5 || passwordVerif.length < 5){
        return {success: false, message: "Le mot de passe est trop court et donc pas assez sécurisé."};
    }
    try {
        const reponse = await fetch("http://localhost:8888/addUsers", {
            method: "POST",
            headers: { "Content-type": "application/json"},
            body: JSON.stringify({username, mail_phone, password})
        });
        if(reponse.ok){
            const text = await reponse.text();
            return { success: true, message: text};
        }
    } catch (error) {
        console.error("Erreur : ",error);
    }
}

export async function deleteUser(username, password, passwordVerif) {
    if(!username || !password || !passwordVerif){
        return {success: false, message: "Error argument"};
    }
    if (password !== passwordVerif) {
        return { success: false, message: "Les mots de passe ne correspondent pas" };
    }
    try {
        const reponse = await fetch("http://localhost:8888/deleteUsers", {
            method: "DELETE",
            headers: { "Content-type": "application/json"},
            body: JSON.stringify({username, password})
        });
        if(reponse.ok){
            const text = await reponse.text();
            return { success: true, message: text};
        }
    } catch (error) {
        console.error("Erreur : ",error);
        return { success: false, message: "Erreur réseau" };
    }
}

export async function login(username, password){
    try {
        const reponse = await fetch("http://localhost:8888/login",{
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({username,password})
        });
        if(reponse.ok){
            const text = await reponse.text();
            return { success: true, message: text};
        }else{
            const error = await reponse.text();
            return { success: false, message: error};
        }
    } catch (error) {
        console.error('Erreur réseau : ',error);
        return { success: false, message: "Erreur réseau"};
    }
}
