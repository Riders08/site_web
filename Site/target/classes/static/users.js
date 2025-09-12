export class Users{
    constructor(id, username, password){
        this.id = id;
        this.username = username;
        this.password = password;
    }
}

export async function getUsers(){
    const reponse = await fetch("http://localhost:8888/users");
    if(reponse.ok){
        console.log("Récupération de getUsers fait est dispo !!!");
        return reponse.json();
    }
    throw new Error("Il y a eu un problème pour la récupération des données d'utilisateurs");
}

