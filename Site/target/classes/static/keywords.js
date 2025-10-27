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

export async function deleteFile(filename){
    const response = await fetch(`http://localhost:8888/documents/${encodeURIComponent(filename)}`, {
        method: "DELETE",
    });
    if(response.ok){
        console.log("Suppression fait avec succès !!!");
        return ;
    } else if (response.status === 404) {
        console.error("Fichier non trouvé :", filename);
        throw new Error("Fichier non trouvé");
    } else {
        console.error("Erreur lors de la suppression du fichier :", filename);
        throw new Error("Erreur lors de la tentative de suppression de fichier");
    }
}

export async function addFile(file, filename, keywords = []) {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("filename", filename);

        formData.append("keywords", JSON.stringify(keywords));

        const response = await fetch("http://localhost:8888/addDocumentsFile", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error("Erreur lors de l'ajout du fichier:", errorMessage);
            return { success: false, message: errorMessage };
        }

        const message = await response.text();
        console.log("Fichier ajouté avec succès !");
        return { success: true, message };
    } catch (error) {
        console.error("Erreur réseau:", error);
        return { success: false, message: "Erreur réseau" };
    }
}
