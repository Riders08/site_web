import { Users, getUsers, login } from "./users.js";
import { Keyword, addFile, addKeywords, deleteFile, getKeywords } from "./keywords.js";
let users = [];
let keywords = [];
let keys = [];

let filename = [];

let Connected = false;
let UserConnected = "";

const extension = ["pdf","txt","odt","png","jpg","jpeg"];

// Recupération des données de la base réalisé dès le début du lancement
export let filenamePromise = (async () => {
    try{
        const data = await getUsers(); 
        users = data.map( user => new Users(user.id, user.username, user.password)); // recup users
        //console.log("The first user => ", users[0]);
        //console.log("| ID => ", users[0].id);
        //console.log("| USERNAME => ", users[0].username);
        //console.log("| PASSWORD => ", users[0].password);
        //console.log("Utilisateurs récupérés => ",users);
        const data_keywords = await getKeywords();
        keywords = data_keywords.map( keyword => new Keyword(keyword.filename, keyword.keys)); // recup des mots-clés
        //console.log(keywords);
        keywords.forEach((key,index) => {
            if(key){
                if(key.keys === "Aucun Mot-clés" || !key.keys){
                    filename.push(key.filename);
                }else{
                    const json = key.keys;
                    const obj = JSON.parse(json);
                    obj.Keys.forEach(k =>{
                        keys.push(k);
                    })
                    filename.push(key.filename);
                }
            }
        }) // recup des noms des fichiers
        /*console.log(filename);
        console.log(keys);*/
        return filename;
    }catch(e){
        console.log("Un problème a été rencontrée dès le début de l'ouverture du site");
        console.error(e);
        return [];
    }
})();


document.addEventListener("DOMContentLoaded", () => {
    // BARRE (Index.html) 
    const menus = document.querySelectorAll(".menu");
    menus.forEach(menu =>{
        const toggles = menu.querySelector("a"); //toggle_cpt_sco_pro
        const divers = menu.querySelector("ul"); //divers_cpt_sco_pro
        if(toggles && divers){
            toggles.addEventListener("mouseenter", (e) => {
                e.preventDefault();
                document.querySelectorAll(".menu ul").forEach(Element =>
                    Element.classList.remove("show")
                );
                divers.classList.add("show")
            });
            menu.addEventListener("mouseleave", (e) =>{
                e.preventDefault();
                divers.classList.remove("show");
            });
        }
    });
    // Redirection vers le fichier CV directe via l'index
    document.querySelector(".element_CV").addEventListener("click", (e) => {
        console.log("Redirection vers le cv prêt");
        window.location.href = "http://localhost:8888/CV";
    })

    //THEME (theme.html)
    const darkMode = localStorage.getItem("darkMode") === "true";
    const theme_switch = document.querySelector("#theme");
    theme_switch.checked = darkMode;
    applyTheme(darkMode);

    theme_switch.addEventListener("change", (e) => {
        e.preventDefault();
        const isDark = theme_switch.checked;
        localStorage.setItem("darkMode",isDark);
        applyTheme(isDark);
    })

    //Etat de connection dynamique 
    function updateAdminButton(Connected, UserConnected) {
        const admin_co = document.querySelector(".admin");
        if (!admin_co){
            return;
        } 
        admin_co.innerHTML = "";
        const i = document.createElement("i");
        if (Connected) {
            i.classList.add("fa-solid", "fa-lock-open");
            admin_co.append(i, " " + UserConnected);
        } else {
            i.classList.add("fa-solid", "fa-lock");
            admin_co.append(i, " Admin");
        }
    }
    // Par défaut
    updateAdminButton(Connected,UserConnected);
    
    //Connection via les admin (index.html)
    document.querySelector(".admin").addEventListener("click", (e) => {
        Swal.fire({
            html: `
                <form id="loginform">
                    <input type="text" id="login" class="input-sweet" placeholder="Email ou Identifiant" autocomplete="current-password">
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
                console.log(login);
                console.log(password);
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
                    Connected = true;
                    UserConnected = username;
                    updateAdminButton(Connected,UserConnected);
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
    })

 // PARTI COMPETENCES 
    //Redirection vers fichier compétences (compétences.html)
    const files = {
        element_cv: "http://localhost:8888/CV",
        element_bac: "http://localhost:8888/BAC",
        element_pix: "http://localhost:8888/PIX",
        element_lig: "http://localhost:8888/linguaskill",
        element_lic: "http://localhost:8888/attestation-licence"
    }

    Object.keys(files).forEach(element =>{
        const ele = document.querySelector(`.${element}`);
        ele.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = files[element];
        })
    })
    
    
    /*const Pec_elements = [
        "valeurs",
        "motivations",
        "centres_intérêts",
        "traits"
    ]*/

    // Arbre de compétences (compétences.html)
    document.querySelectorAll(".center").forEach(element =>{
        element.addEventListener("click", (e) => {
            e.preventDefault();
            const parentTree = element.closest(".tree");
            document.querySelectorAll(".tree").forEach(tree => {
                if(tree !== parentTree){
                    tree.classList.remove("active");
                }
            })
            parentTree.classList.toggle("active");
        })
    })
    // Feuille de compétences(compétences.html)(Détails)
    const list_node = {
        "Avoir de l'intérêt pour son travail":"Avoir de l'intérêt pour son travail, c'est important pour moi, que ce travail soit professionnel ou non. À mes yeux, il est nécessaire d'y retrouver un intérêt.",
        "Responsable": "Je suis pour le moins responsable, je suis prêt à assumer les conséquences de mes actes et j'en ai conscience avant chacune d'entre elles.",
        "Respect des règles":"J'ai toujours eu pour valeur de respecter les règles, bien sûr je cherche avant tout à les comprendre et lorsque je ne comprends pas une règle je ne cherche pas à la transgresser, mais en revanche il peut m'arriver d'essayer de la contourner.",
        "Respect envers autrui":"Pour moi c'est la base, et c'est sans aucun doute l'une des premières valeurs que mes parents ont cherché à me transmettre : ne pas se moquer, ne pas prendre de haut, être respectueux, c'est le minimum. Et bien sûr je le suis d'autant plus lorsque cela va dans les deux sens.",
        "Sens du service":"J'apprécie rendre service. Très souvent, que ce soit dans la vie de tous les jours ou dans le domaine informatique, on m'a toujours donné des conseils et aidé. J'estime que tous comme eux, si je peux aider alors pourquoi ne pas le faire ?",
        "Créatif":"J’aime explorer différentes approches lorsqu’un problème se présente, cette capacité à imaginer d’autres solutions m’aide souvent à simplifier des tâches ou à proposer des alternatives.",

        "Se sentir utile":"Se sentir utile est pour moi la principale source de motivation, si j'ai la sensation d'être inutile à quoi bon être là ? Peut-on dire que je travaille ?",
        "Faire un travail qui a du sens":"Si le travail que je fais a du sens, cela me donne envie de m'y donner à 100%.",
        "Stabilité financière":"Au-delà du travail, et du plan psychologique, bien sûr, une chose qui me motivera toujours, c'est également la partie finance afin d'essayer de garder une certaine stabilité.",
        "Apprentissage continu":"J'aimerais beaucoup continuer à apprendre de plus en plus de choses, s'il y a bien une chose que j'aurais retenue depuis que j'ai commencé mes études en informatique, c'est que plus on découvre de nouvelles choses, plus ça rend certaines tâches plus simples et ouvre encore plus de possibilités innovantes.",
        "Toujours plus me découvrir":"Travailler pour moi, surtout dans le domaine informatique, c'est surtout me retrouver encore et encore dans des cas non rencontrés, plus je me retrouve dans ces cas, plus j'ai la sensation de découvrir certaines facettes me concernant. Petit à petit, je me suis rendu compte que ça me motivait de plus en plus. Avant ma Seconde Année Universitaire, par exemple, j'ignorais que je pouvais être aussi têtu sur des détails ou encore être aussi impliqué dans un travail de groupe donné.",
        "Améliorer l'estime de soi":"Depuis toujours, je n'ai jamais vraiment eu une grande estime envers moi, et je n'ai jamais compris comment on pouvait en avoir envers soi-même, travailler sur un projet afin que l'objectif de ce dernier puisse voir le jour doit être gratifiant surtout si le resultat peu impacter à grande échelle. J'aimerai connaitre ce sentiment, et donc ça me motive beaucoup.",
        
        "Mangas":"Que ce soit les mangas, ou les animés, j'aprécie aussi bien l'un que l'autre et c'est sans aucun doute mon passe-temps favori avec l'informatique.",
        "Informatique":"J'aime beaucoup les langages de programmation côté front-end tels que JavaScript, HTML, CSS, mais j'aime aussi bien d'autres langages comme le Java ou le C. En revanche, je n'ai jamais eu d'affection pour le Python malgré le fait que ce soit le premier langage que j'ai vu.",
        "Musique":"Pour moi, la musique, c'est primaire. Si je n'écoute pas de musique au moins une fois par jour, alors j'en déduis que j'ai passé une mauvaise journée. A noter que je suis pour le moins eclectique dans ce domaine.",
        "Jeux Statégiques":"Les échecs, c'est l'un des premiers jeux auxquels on peut penser dans ce domaine et effectivement j'apprécie ce jeu mais ce n'est pas vraiment le seul, ce que j'aime le plus dans ces jeux, c'est tout particulièrement le côté statège et possibilité multiple possible qui m'intéresse.",
        "Montage":"Pendant mes heures perdues, j'aime bien faire aussi du montage, principalement sur des vidéos ou des musiques. En revanche, bien que j'aime cela, je ne suis pas très doué, je n'ai qu'un niveau basique.",
        "Sport Collectif":"J'aime aussi beaucoup les sports en équipe, mais contrairement au reste, c'est un passe-temps que je ne peux pas vraiment réaliser.",
        
        "Autonome":"Je suis pour le moins autonome, en temps normal quand on donne une tâche j'ai mes habitudes et j'aime beaucoup me retrouver dans ma bulle pour la réaliser. Souvent dans des travaux de groupe on m'a critiqué sur ma façon de faire, tels que le temps que j'y mis ou encore le fait de toujours vouloir des V1 et V2 pour tous.",
        "Ouverture d'esprit":"Bien que j'aie mes habitudes, je suis toujours ouvert à l'écoute, j'estime que tout mérite d'être au moins écouté.",
        "Négociateur":"Je suis assez bon négociateur, étant toujours pour le moins prudent et en retrait avec ma capacité d'adaptabilité et d'écoute, on m'a souvent fait cette remarque. Honnêtement, je considère ce trait de personnalité dans l'ensemble étant comme une qualité, mais étrangement quand on me le disait en face, j'ignorais comment je devais le prendre.",
        "Sens du travail d'équipe":"Bien que j'aime travailler en autonomie, j'apprécie d'autant plus le travail d'équipe. Très souvent, lorsque j'eus la chance de profiter d'un groupe, j'en ressortais avec beaucoup plus de connaissance et méthode. Bien que malheureusement, dans l'ensemble de ma scolarité, je n'ai pas eu la chance d'avoir à chaque fois une bonne équipe. Je me souviens encore d'un projet étalé sur un an en seconde année informatique où je me suis retrouvé en binôme avec un ami alors que l'on était censé être 3(et où bien sûr notre trinôme affirme avancer pour ensuite nous dire que rien ne fonctionne 5 heures avant le rendu... Un vrai plaisir).",
        "Maitrîse de soi":"Plus jeune, je ne savais pas du tout me contenir face à certaines situations, tandis que de nos jours, j'arrive à garder toute maîtrise de mes émotions et à paraître tout le temps calme et détendu.",
        "Faculté d'écoute":"On m'a souvent dit que je savais écouter. Honnêtement, je n'ai jamais été d'accord avec eux car souvent je préfère demander à mon interlocuteur de répéter ce qu'il dit pour m'assurer d'avoir bien entendu. Par contre, il est vrai que quand on me dit quelque chose, j'ai tendance à ne pas l'oublier de si tôt. En revanche, je n'apprécie pas quand ce n'est pas réciproque."
    }

    document.querySelectorAll(".node").forEach(element => {
        element.addEventListener("click", (e) => {
            e.preventDefault();
            const data = element.textContent;
            console.log(data);
            Object.keys(list_node).forEach(node => {
                if(node === data){
                    Swal.fire({
                        icon: "info",
                        text: list_node[node],
                        width: 800,
                        position: "bottom-start",
                        showConfirmButton: true,
                        customClass: {
                            htmlContainer: 'swal-text',
                            title: 'swal-title',
                            confirmButton: 'swal-confirm',
                            popup: 'swal-popup'
                        }
                    })
                    console.log(list_node[node]);
                }
            })
        })
    })
})

// PARTI DOCUMENTS

// Barre de recherche de document
const ghost_input = document.getElementById("barre_de_recherche_fantome");
const input = document.getElementById("barre_de_recherche");
const suggestion_box = document.getElementById("suggestion_file");

input.addEventListener("input", (e) =>{
    e.preventDefault();
    const input_value = input.value.toLowerCase();
    if(input_value){
        const all_suggestion = all_words().sort((first, second) => first.length - second.length);
        const suggestion = all_suggestion.find(element => element.toLowerCase().startsWith(input_value) && element.toLowerCase() != input_value);
        if(suggestion && input_value){
            ghost_input.value = suggestion;
        }else{
            ghost_input.value = "";
        }
    }else{
        ghost_input.value = "";
    }
});

/*Pour la suite il faut que : 
- Je modifie ce que le input fantome pour que les majuscules et le minuscule ne rentre pas en corélation
- Faire en sorte que les propositions du slider soit que des fichiers 
- Peaufiner la présentation du slider */

input.addEventListener("keydown", (e) =>{
    if(e.key === "Tab" && ghost_input.value != ""){
        e.preventDefault();
        input.value = ghost_input.value;
        ghost_input.value = "";
    }
});

input.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    suggestion_box.innerHTML = "";
    if(!value){
        suggestion_box.style.display = "none";
        return;
    }
    const all_suggestion = all_words()
                            .filter(word => word.toLowerCase().startsWith(value))
                            .sort((a,b) => a.length - b.length)
                            .slice(0,5);
    if(all_suggestion.length > 0){
        all_suggestion.forEach(suggestion =>{
            const div = document.createElement("div");
            div.className = "suggestion_item";
            div.textContent = suggestion;
            div.addEventListener("click", (e) =>{
                input.value = suggestion;
                suggestion_box.style.display = "none";
                console.log("pret pour la redirection");
            });
            suggestion_box.appendChild(div);
        });
        suggestion_box.style.display = "block";
    } else{
        suggestion_box.style.display = "none";
    }
});

document.addEventListener("click", (e) =>{
    if(!e.target.closest(".barre_recherche") && !e.target.closest(".suggestion.file") && !e.target.closest(".suggestion_box")){
        suggestion_box.style.display = "none";
    }
});

document.querySelector(".search").addEventListener("click", (e) => {
    e.preventDefault();
    keys.forEach((keyword,index) =>{
        if(input.value === keyword){
            const filenames = findFilename(keyword);
            filenames.forEach(element =>{
                console.log(element);
            })
        }
    })
})

//Fonction qui retrouve le ou les fichiers qui contienne le mot clé donnée
function findFilename(keyword){
    const filenames = [];
    keywords.forEach(key => {
        if(key.keys && key.keys != "Aucun Mot-clés"){
            const obj = JSON.parse(key.keys);
            obj.Keys.forEach(element =>{
                if(element === keyword){
                    filenames.push(key.filename);
                }
            })
        }
    })
    return filenames;
}

// Fonction qui check les keywords d'un fichier avec un mot clé placé en argument
function checkKeyword(filename, keyword){
    for(let element of keywords){
        if(element.keys && element.keys != "Aucun Mot-clés"){
            if(element.filename === filename){
                const obj = JSON.parse(element.keys);
                for(let key of obj.Keys){
                    if(key === keyword){
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

function verif_file(file){
    for(let element of filename){
        if(element === file){
            return true;
        }
    }
    return false;
}

//Constante nécessaire pour les fonctionnalités d'ajout de fichier, mot-clé, et de suppression
// Pour suppression
const file_to_delete = document.getElementById("file_to_delete");
// Pour importation de mot-clé
const input_file = document.getElementById("file_to_keyword");
const input_keywords = document.getElementById("ajout_key");
// Pour importation
const hiddenFileInput = document.createElement("input");
const mot_clé = document.getElementById("create_file_keys");
const keywordsText = mot_clé.value.trim();

// Ajouts mots-clés sur fichier 
document.querySelector(".add_key").addEventListener("click", (e) =>{
    e.preventDefault();
    if(input_file.value === ""){
        Swal.fire({
            icon: "error",
            text: "Aucun fichier n'a été donnée",
            showConfirmButton: false,
            position: "top-end",
            timer: 2500
        });
        return;
    }
    if(input_keywords.value === ""){
        Swal.fire({
            icon: "error",
            text: "Aucun mot-clé n'a été donnée",
            showConfirmButton: false,
            position: "top-end",
            timer: 2500
        });
        return;
    }
    if(verif_file(input_file.value + ".pdf") === false && verif_file(input_file.value + ".odt") === false){
        Swal.fire({
            icon: "error",
            text: "Le fichier n'existe pas dans la base de donnée",
            showConfirmButton: false,
            position: "top-end",
            timer: 2500
        });
        return;
    }
    let extension = ".";
    filename.forEach(element => {
        if(element.split(".")[0] === input_file.value){
            extension += element.split(".")[1];
        }
    })
    if(checkKeyword(input_file.value + extension, input_keywords.value)){
        Swal.fire({
            icon: "error",
            text: "Ce mot-clé existe déjà pour ce fichier.",
            showConfirmButton: false,
            position: "top-end",
            timer: 2500
        })
    } else{
        addKeywords(input_file.value + extension, input_keywords.value);
        input_file.value = "";
        input_keywords.value = "";
        Swal.fire({
            icon: "success",
            text: "L'ajout du mot-clé a bien été pris en compte.",
            showConfirmButton: true
        });
        return;
    }
})

// Aide pour selectionner un fichier pour rajout mot-clé ou delete de fichier
document.querySelectorAll(".files_view").forEach(element =>{
    element.addEventListener("click", (e) =>{
        e.preventDefault();
        Swal.fire({
            title: "Liste des fichiers",
            html: `
                <div class="list_file_info"></div>
            `,
            showConfirmButton: false,
            didOpen: async () => {
                const div = document.querySelector(".list_file_info");
                if(div){
                    const filenames = getFilenamesWithoutExtension(filename);
                    filenames.forEach(file => {
                        const a = document.createElement("a");
                        const li = document.createElement("li");
                        li.textContent = file;
                        li.classList.add("file_element_exist");
                        a.appendChild(li); 
                        div.appendChild(a);
                    });
                    div.addEventListener("click", (e) =>{
                        if(e.target.classList.contains("file_element_exist")){
                            e.preventDefault();
                            if(element.classList.contains("file_view_delete")){
                                file_to_delete.value = e.target.textContent;
                            }else if(element.classList.contains("file_view_keywords")){
                                input_file.value = e.target.textContent;
                            }else{
                                console.error("Il y a une erreur de selection de fichier associer à l'input en question");
                            }
                            Swal.close();
                        }
                    })
                } 
            }
        }); 
    });
})

// Redirection warning connexion pour ajout ou suppression de fichier
document.querySelectorAll(".warning_connection").forEach(element =>{
    element.addEventListener("click", (e) =>{
        e.preventDefault();
        Swal.fire({
            icon: "info",
            title: "Comment se connecter ?",
            confirmButton: true,
            text: "Pour vous connecter il suffit de cliquer sur le bouton 'Admin' situé en haut de la page",
        })
    })
}) 
// Ajout de fichier dans la base de données

hiddenFileInput.type = "file";
hiddenFileInput.accept = ".pdf,.odt,.txt,.png,.jpg,.jpeg";
hiddenFileInput.style.display = "none";
document.body.appendChild(hiddenFileInput);

document.querySelector(".upload").addEventListener("click", (e) =>{
    if(Connected === true){
        e.preventDefault();
        hiddenFileInput.click();
    }else{
        Swal.fire({
            icon: "error",
            text: "Vous n'êtes pas connecté, vous n'avez donc pas les droits !",
            showConfirmButton: true,
            confirmButtonText: "OK"
        });
    }
})


hiddenFileInput.addEventListener("change", (e) => {
    const file = hiddenFileInput.files[0];
    if(!file){
        Swal.fire({
            icon: "error",
            showConfirmButton: false,
            position: "top-end",
            text: "Aucun fichier n'a été selectionnée"
        })
        return;
    }
    if(checkExtensionFile(file) === false){
        Swal.fire({
            icon: "warning",
            showConfirmButton: false,
            position: "top-end",
            text: "Le fichier selectionné n'a pas une extension valide"
        });
        return;
    }
    if(checkFileAlreadyExists(file)){
        Swal.fire({
            icon: "warning",
            showConfirmButton: false,
            position: "top-end",
            text: "Le fichier selectionné existe déjà dans la base de donnée"
        });
        return;
    }
    let keywords = [];
    if(keywordsText){
        keywords = keywordsText.split(",").map(keys => keys.trim());
        addFile(file, file.name, keywords);
        Swal.fire({
            icon: "success",
            text: "Importation réussi avec succès",
            position: "top-end",
            showConfirmButton: false
        });
        return;
    }else{
        Swal.fire({
            icon: "info",
            showConfirmButton:false,
            html: `
                <a>Attention aucun mot-clé n'a été écrit, souhaitez-vous tout de même faire l'importation ?<a/>
                <div class="yes_no_box">
                    <a class="yes_import"><i class="fa-solid fa-circle-check button-fire-import"></i></a>
                    <a class="no_import"><i class="fa-solid fa-circle-xmark button-fire-import"></i></a>
                </div>
            `,
            didOpen: async () =>{
                document.querySelector(".yes_import").addEventListener("click", (e) =>{
                    Swal.close();
                    addFile(file, file.name, keywords);
                    Swal.fire({
                        icon: "success",
                        text: "Importation réussi avec succès",
                        position: "top-end",
                        showConfirmButton: false
                    });
                    return;
                })
                document.querySelector(".no_import").addEventListener("click", (e) => {
                    Swal.close();
                })
            }
        });
        return;
    }
})

// Suppression de fichier dans la base de données 
document.querySelector(".delete_file").addEventListener("click", (e) =>{
    if(Connected === false){
        Swal.fire({
            icon: "error",
            text: "Vous n'êtes pas connecté, vous n'avez donc pas les droits !",
            showConfirmButton: true,
            confirmButtonText: "OK"
        });
        return;
    }else{
        if(file_to_delete){
            const delete_file = getFileWithExtension(file_to_delete.value);
            console.log(delete_file);
            if(checkFile(delete_file)){
                Swal.fire({
                    icon: "warning",
                    showConfirmButton:false,
                    html: `
                        <a>Attention une fois supprimé vous ne pourrez plus visionner ce fichier, souhaitez-vous tout de même le supprimer ?<a/>
                        <div class="yes_no_box">
                            <a class="yes_delete"><i class="fa-solid fa-circle-check button-fire-import"></i></a>
                            <a class="no_delete"><i class="fa-solid fa-circle-xmark button-fire-import"></i></a>
                        </div>
                    `,
                    didOpen: async () =>{
                        document.querySelector(".yes_delete").addEventListener("click", (e) =>{
                            Swal.close();
                            file_to_delete.value = "";
                            deleteFile(delete_file);
                            Swal.fire({
                                icon: "success",
                                text: "Suppression effectué avec succès",
                                position: "top-end",
                                showConfirmButton: false
                            });
                            return;
                        })
                        document.querySelector(".no_delete").addEventListener("click", (e) => {
                            file_to_delete.value ="";
                            Swal.close();
                        })
                    }
                });
                return;
            }else{
                Swal.fire({
                    icon: "error",
                    showConfirmButton: false,
                    position: "top-end",
                    text: "Le fichier n'est pas compris dans la base de donnée"
                });
                return;
            }
        }else{
            Swal.fire({
                icon: "error",
                showConfirmButton: true,
                confirmButtonText: "OK",
                text: "Vous n'avez choisi aucun fichier à supprimer."
            });
            return;
        }
    }
})

document.querySelector(".fa-question").addEventListener("click", (e) =>{
    Swal.fire({
        icon: "question",
        showConfirmButton: false,
        position: "bottom-start",
        html:
            `
            <div class="help_keywords">
                <p><strong> Exemple de mot-clé:</strong></p>
                <ul class="help_keywords_point">
                    <li>Le terme "mot" est un mot-clé <i class="fa-solid fa-check"></i></li>
                    <li>Le terme "mot clé" n'est pas un mot-clé <i class="fa-solid fa-xmark"></i></li>
                    <li>Le terme "mot-clé" est un mot-clé <i class="fa-solid fa-check"></i></li>
                </ul>
            </div>
            `
    })
})

// Fonction qui vérifie si le fichier que l'on ajoute à une extension valide 
function checkExtensionFile(file){
    const extension_file = file.name.split(".").pop();
    for(const element of extension){
        if(extension_file === element){
            return true;
        }
    }
    return false;
}

// Fonction qui vérifie si le fichier que l'on ajoute n'est pas déjà présente dans la base de donnée
function checkFileAlreadyExists(file){
    const name = file.name;
    for(const element of filename){
        if(name === element){
            return true;
        }
    }
    return false;
}

// Fonction qui vérifie si le fichier est bien présente dans la base de donnée
function checkFile(file){
    for(let element of filename){
        if(element === file){
            return true;
        }
    }
    return false;
}

// THEME CHANGEMENT

// Application qui gère les deux cas de thème séparément
function applyTheme(isDark){
    if(isDark){
        document.documentElement.style.setProperty('--ecriture','#262626');
        document.documentElement.style.setProperty('--background','#f1f1f1');
        document.documentElement.style.setProperty('--menu-ul','black');
        document.documentElement.style.setProperty('--menu-ul-back','#666');
        document.documentElement.style.setProperty('--divers','rgba(255, 255, 255, 0.7)');
        document.documentElement.style.setProperty('--divers-li','#000');
        document.documentElement.style.setProperty('--divers-li-back','#5555');
        document.documentElement.style.setProperty('--Presentation-background','#3f3f3f');
        document.documentElement.style.setProperty('--name-text-presentation','white');
        document.documentElement.style.setProperty('--hyperlien','yellow');
        document.documentElement.style.setProperty('--swal-title','white');
        document.documentElement.style.setProperty('--swal-background','black');
        document.documentElement.style.setProperty('--swal-confirm','#bd0f0f');
        document.documentElement.style.setProperty('--hyperlien-file', '#920404');
        document.documentElement.style.setProperty('--hover', '#920404');
    }else{
        document.documentElement.style.setProperty('--ecriture','#f1f1f1');
        document.documentElement.style.setProperty('--background','#262626');
        document.documentElement.style.setProperty('--menu-ul','white');
        document.documentElement.style.setProperty('--menu-ul-back','#333');
        document.documentElement.style.setProperty('--divers','rgba(0,0,0,0.3)');
        document.documentElement.style.setProperty('--divers-li','#fff');
        document.documentElement.style.setProperty('--divers-li-back','#4444');
        document.documentElement.style.setProperty('--Presentation-background','#c0c0c0');
        document.documentElement.style.setProperty('--name-text-presentation','black');
        document.documentElement.style.setProperty('--hyperlien','#551A8B');
        document.documentElement.style.setProperty('--swal-title','black');
        document.documentElement.style.setProperty('--swal-background','white');
        document.documentElement.style.setProperty('--swal-confirm','#7066e0');
        document.documentElement.style.setProperty('--hyperlien-file', '#0010a0')
        document.documentElement.style.setProperty('--hover', '#0039d4');
    }
}

// Fonction qui retourne l'ensemble des noms de tous les fichiers existant sans leurs extensions
function getFilenamesWithoutExtension(filename){
    const filenameWithoutExtension = [];
    filename.forEach(file => {
        const extension = file.split(".").pop();
        const name = file.replace("." + extension, "");
        filenameWithoutExtension.push(name);
    })
    return filenameWithoutExtension;
}

// Fonction qui retrouve l'extension du fichier donné
function getFileWithExtension(file){
    for(let element of filename){
        const extension = element.split(".").pop();
        const name = element.replace("." + extension, "");
        if(name === file){
            return element;
        }
    }
}

// Fonction qui renvoie tous les mots qui peuvent servir a trouver un fichier (tous mot important en plus des mots clés en gros)
function all_words(){
    let result = [];
    filename.forEach(file => {
        result.push(file);
    });
    keys.forEach(element =>{
        result.push(element);
    });
    return result;
}