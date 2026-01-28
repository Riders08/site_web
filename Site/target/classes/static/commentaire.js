import {Users,getUsers} from "./users.js";

export class Commentaire{
    constructor(id, user, commentaire){
        this.id = id;
        this.user = user;
        this.commentaire = commentaire;
    }
}

const all_commentaires_container = document.querySelector(".All_commentaires");
document.addEventListener("DOMContentLoaded", async () => {
    const data = await getCommentaires(); 
    const commentaires = data.map( comment => new Commentaire(comment.id, comment.user, comment.commentaire));
    if(all_commentaires_container){
        const title = document.createElement("h1");
        title.classList.add("title-list-commentaire");
        title.textContent = "Commentaires";
        const div = document.createElement("div");
        div.classList.add("div-commentaires");
        div.appendChild(title);
        commentaires.forEach(commentaire => {
            const i_delete = document.createElement("i");
            i_delete.classList.add("fa-solid", "fa-ellipsis-vertical", "commentaire_option_delete");
            const comment = commentaire.commentaire;
            const username = commentaire.user;
            const a = document.createElement("a");
            a.classList.add("element-commentaire");
            a.dataset.id = commentaire.id;
            a.dataset.user = commentaire.user;
            a.dataset.commentaire = commentaire.commentaire;
            const a_content = document.createElement("a");
            a_content.classList.add("element-commentaire_without_delete");
            const p = document.createElement("p");
            p.classList.add("commentaire-element-part")
            p.textContent = comment;
            const i = document.createElement("i");
            const i_logo = document.createElement("i");
            i_logo.classList.add("fa-solid", "fa-circle-user", "commentaire-element");
            i.textContent = " "+username;
            a_content.appendChild(i_logo)
            a_content.appendChild(i);
            a_content.appendChild(p);
            a.appendChild(a_content);
            a.appendChild(i_delete);
            div.appendChild(a);
        });
        all_commentaires_container.appendChild(div);
    }
})

export async function getCommentaire(user, commentaire){
    const data = await getCommentaires(); 
    const commentaires = data.map( comment => new Commentaire(comment.id, comment.user, comment.commentaire));
    if(commentaires){
        for(let comment of commentaires){
            if(comment.user === user && comment.commentaire === commentaire){
                return comment;
            }
        }
    }
    return null;
}

export async function getCommentaires(){
    const reponse = await fetch("http://localhost:8888/commentaires");
    if(reponse.ok){
        return await reponse.json();
    }
    throw new Error("Il y a eu un problème pour la récupération des données des commentaires");
}



export async function AddCommentaire(user, commentaire){
    if(!user || !commentaire){
        return {success: false, message: "Error argument"};
    }
    const data = await getUsers(); 
    const users = data.map( us => new Users(us.id, us.mail_phone,us.username, us.password));
    const commentaires = data.map( comment => new Commentaire(comment.id, comment.user,comment.commentaire));
    if(commentaires){
        for(let c of commentaires){
            if(c.user === user && c.commentaire === commentaire){
                Swal.fire({
                    icon: "success",
                    title: "Félicitations",
                    text: "Bravo, vous avez réussi l'exploit de faire littéralement le même commentaire que vous avez fait en ammont.",
                    position: "center",
                    showConfirmButton: true
                });
                return {success: false, message: "Commentaire déjà existant."};
            }
        }
    }
    if(users){
        for(let u of users){
            if(u.username === user){
                const user = u;
                 try {
                    const reponse = await fetch("http://localhost:8888/add_comment", {
                        method: "POST",
                        headers: { "Content-type": "application/json"},
                        body: JSON.stringify({user, commentaire})
                    });
                    if(reponse.ok){
                        const text = await reponse.text();
                        return { success: true, message: text};
                    }
                } catch (error) {
                    console.error("Erreur : ",error);
                }
            }
        }
        return {success: false, message: "L'utilisateur connecté n'est pas reconnu"};
    }
    return {success: false, message: "Erreur lors de la récupération des utilisateurs."};
}

export async function deleteCommentaire(user, commentaire) { 
    if(!user || !commentaire){
        return {success: false, message: "Error argument"};
    }
    console.log(user);
    console.log(commentaire);
    try {
        const reponse = await fetch("http://localhost:8888/delete_comment", {
            method: "DELETE",
            headers: { "Content-type": "application/json"},
            body: JSON.stringify({user, commentaire})
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