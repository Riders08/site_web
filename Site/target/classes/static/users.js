export class Users{
    constructor(id, email_phone, username, password){
        this.id = id;
        this.email_phone = email_phone;
        this.username = username;
        this.password = password;
    }
}

export async function getUsers(){
    const reponse = await fetch("http://localhost:8888/users");
    if(reponse.ok){
        console.log("Récupération de getUsers fait est dispo !!!");
        return await reponse.json();
    }
    throw new Error("Il y a eu un problème pour la récupération des données d'utilisateurs");
}

export async function createUser(email_phone, username, password, passwordVerif){
    if(!email_phone || !username || !password || !passwordVerif){
        return {success: false, message: "Error argument"};
    }
    for(let user of getUsers()){
        if(user.email_phone === email_phone){
            return {success: false, message: "Email ou numéro de téléphone déjà affilié"};
        }
    }
    if(password !== passwordVerif){
        return {success: false, message: "Les deux mots de passe écrit ne sont pas similaire."};
    }
    try {
        const reponse = await fetch("http://localhost:8888/addUsers", {
            method: "POST",
            headers: { "Content-type": "application/json"},
            body: JSON.stringify({username, password})
        });
        if(reponse.ok){
            const text = await reponse.text();
            return { success: true, message: text};
        }
    } catch (error) {
        console.error("Erreur : ",error);
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