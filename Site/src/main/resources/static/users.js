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
        return await reponse.json();
    }
    throw new Error("Il y a eu un problème pour la récupération des données d'utilisateurs");
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