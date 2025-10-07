export class Keyword {
    constructor(filename, keys){
        this.filename = filename;
        this.keys = keys;
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

export async function addKeywords(filename, keys) {
    let keywords;
    if(keys === Array.isArray(keys)){
        keywords = keys;
    }else{
        keywords = [keys];
    }
    try {
        const reponse = await fetch( "http://localhost:8888/addkeywords", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                filename: filename,
                keywords: keywords
            })
        });
        if(!reponse.ok){
            const error_message = await reponse.text();
            console.error("Erreur lors de l'ajout des mots-clés");
            return {success: false, message: error_message};
        }
        console.log("Ajout des mot-clés fais avec succès !");
        const result = await reponse.text();
        return { success: true, message: result};
    } catch (error) {
        console.error("Erreur réseau : ",error);
        return false;
    }
}