export class Keyword {
    constructor(filename, keyswords){
        this.filename = filename;
        this.keyswords = keyswords;
    }
}

export async function getKeywords() {
    try{
        const reponse = await fetch("http://localhost:8888/keywords");
        if(reponse.ok){
            console.log("Récupération de getKeywords fait est dispo !!!");
            return await reponse.json();
        }    
        console.log("Erreur de la récupération des mots-clés");
        throw new Error("Erreur lors de la récupération des keywords");
    }catch(error){
        console.error("Erreur Réseaux :", error);
        return [];
    }
}

export async function addKeywords(filename, keyswords) {
    try {
        const reponse = await fetch( "http://localhost:8888/addkeywords", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                filename: filename,
                keys: keyswords
            })
        });
        if(!reponse.ok()){
            console.error("Erreur lors de l'ajout des mots-clés");
            return false;
        }
        console.log("Ajout des mot-clés fais avec succès !");
        const result = await reponse.json();
        return true;
    } catch (error) {
        console.error("Erreur réseau : ",error);
        return false;
    }
}