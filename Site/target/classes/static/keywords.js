export class Keyword {
    constructor(filename, keyswords){
        this.filename = filename;
        this.keyswords = keyswords;
    }
}

export async function getKeywords() {
    const reponse = await fetch("http://localhost:8888/keywords");
    if(reponse.ok()){
        console.log("Récupération de getKeywords fait est dispo !!!");
        return reponse.json();
    }    
    console.log("Erreur de la récupération des mots-clés");
}
