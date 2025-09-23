import { Users, getUsers, login } from "./users.js";
let users = [];
//Tests d'entrées pour assurer la récupération des users
(async() => {
    try{
        const data = await getUsers();
        users = data.map( user => new Users(user.id, user.username, user.password));
        console.log("The first user => ", users[0]);
        console.log("| ID => ", users[0].id);
        console.log("| USERNAME => ", users[0].username);
        console.log("| PASSWORD => ", users[0].password);
        console.log("Utilisateurs récupérés => ",users);
    }catch(e){
        console.log("Un problème a été rencontrée dès le début de l'ouverture du site");
        console.error(e);
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
    
    //Connection via les admin (index.html)
    document.querySelector(".admin").addEventListener("click", (e) => {
        Swal.fire({
            html: `
                <input type="text" id="login" class="input-sweet" placeholder="Email ou Identifiant">
                <input type="password" id="password" class="input-sweet" placeholder="Mot de Passe">
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
        document.documentElement.style.setProperty('--hyperlien-file', '#920404')
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
    }
}