import { Users, getUsers, login } from "./users.js";
import { Keyword, getKeywords } from "./keywords.js";
export let users = [];

export let keywords = [];
export let keys = [];

export let Connected = false;
export let UserConnected = "";

export let filename = [];
const extension = ["pdf","txt","odt","png","jpg","jpeg"];

export let projets = {
    "Mosaïc" : "https://github.com/Riders08/Mosaic",
    "PDL" : "https://github.com/Riders08/PDL_l1f",
    "Puissance 4": "https://github.com/Riders08/project_puissance_4"
}; 

export let languages = {
    "C" : "https://fr.wikipedia.org/wiki/C_(langage)"
};


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

    // Redirection vers les projets directement via l'index
    const Projects = document.querySelectorAll(".projet");

    if(Projects){
        Projects.forEach(projet =>{
            projet.addEventListener("click", (e) =>{
                e.preventDefault();    
                Object.keys(projets).forEach(p =>{
                    if(projet.textContent === p || projet.textContent.toLowerCase() === p 
                        || projet.textContent === p.toLowerCase() || projet.textContent.toLowerCase() === p.toLowerCase()){
                            window.location.href = projets[p];
                    }
                })
            })
        })
    }

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
    const savedConnected = localStorage.getItem("Connected");
    const savedUser = localStorage.getItem("UserConnected");
    if(savedConnected){
        Connected = true;
        UserConnected = savedUser;
    }
    updateAdminButton(Connected,UserConnected);
    
    //Connection via les admin (index.html)
    document.querySelector(".admin").addEventListener("click", (e) => {
        if(Connected){
            console.log("vous êtes déjà connecter");
            // Penser a faire la déconnection 
        }else{
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
                        localStorage.setItem("Connected", "true");
                        localStorage.setItem("UserConnected", username);
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
        }
    })


});


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
        document.documentElement.style.setProperty('--swal-text','white');
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
        document.documentElement.style.setProperty('--swal-text','black');
        document.documentElement.style.setProperty('--swal-background','white');
        document.documentElement.style.setProperty('--swal-confirm','#7066e0');
        document.documentElement.style.setProperty('--hyperlien-file', '#0010a0')
        document.documentElement.style.setProperty('--hover', '#0039d4');
    }
}

// Fonction qui retourne l'ensemble des noms de tous les fichiers existant sans leurs extensions
export function getFilenamesWithoutExtension(filename){
    const filenameWithoutExtension = [];
    filename.forEach(file => {
        const extension = file.split(".").pop();
        const name = file.replace("." + extension, "");
        filenameWithoutExtension.push(name);
    })
    return filenameWithoutExtension;
}

// Fonction qui retrouve l'extension du fichier donné
export function getFileWithExtension(file){
    for(let element of filename){
        const extension = element.split(".").pop();
        const name = element.replace("." + extension, "");
        if(name === file){
            return element;
        }
    }
}

// Fonction qui renvoie tous les mots qui peuvent servir a trouver un fichier (tous mot important en plus des mots clés en gros)
export function all_words(){
    let result = [];
    filename.forEach(file => {
        result.push(file);
    });
    keys.forEach(element =>{
        result.push(element);
    });
    return result;
}

//Function qui evite que les majuscules fantomes se supperposent pas sur le input_value
export function modif_sugg(value_user, value_sugg){
    let result = value_sugg;
    for(let i = 0; i< value_user.length;i++){
        result = value_user + value_sugg.slice(i + 1);
    }
    return result;
}

//Function qui trouve tous les fichiers possible a partir des mots clés
export function all_file(value){
    let list_word = [];
    filename.forEach(file =>{
        if(file === value){
            list_word.push(file);
        }
    })
    const all_suggestion = all_words().sort((first, second) => first.length - second.length);
    const suggestion = all_suggestion.find(element => element.toLowerCase().startsWith(value.toLowerCase()) && element.toLowerCase() != value.toLowerCase());  
    if (suggestion) {
    keys.forEach(k => {
        if(suggestion.toLowerCase() === k.toLowerCase()){
            findFilename(k).forEach(f => {
                if (!list_word.includes(f)){
                    list_word.push(f);
                }
            });
        }
    });
}
    return list_word;
}

// Fonction qui vérifie si le fichier que l'on ajoute à une extension valide 
export function checkExtensionFile(file){
    const extension_file = file.name.split(".").pop();
    for(const element of extension){
        if(extension_file === element){
            return true;
        }
    }
    return false;
}

// Fonction qui vérifie si le fichier que l'on ajoute n'est pas déjà présente dans la base de donnée
export function checkFileAlreadyExists(file){
    const name = file.name;
    for(const element of filename){
        if(name === element){
            return true;
        }
    }
    return false;
}

// Fonction qui vérifie si le fichier est bien présente dans la base de donnée
export function checkFile(file){
    for(let element of filename){
        if(element === file){
            return true;
        }
    }
    return false;
}

//Fonction qui retrouve le ou les fichiers qui contienne le mot clé donnée
export function findFilename(keyword){
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
export function checkKeyword(filename, keyword){
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

export function verif_file(file){
    for(let element of filename){
        if(element === file){
            return true;
        }
    }
    return false;
}

export function isLanguage(language){
    for(let element of Object.keys(languages)){
        if(element === language){
            return true;
        }
    }
    return false;
}

export function redirectionLanguage(language){
    Object.keys(languages).forEach(element => {
        if(language === element){
            window.location.href = languages[language];
        }
    })
}