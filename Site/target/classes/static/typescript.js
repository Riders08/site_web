import { Users, getUsers } from "./users.js";
let users = [];
let connected = false;
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
// Index.html
document.addEventListener("DOMContentLoaded", () => {
    // BARRE
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

    document.querySelector(".element_CV").addEventListener("click", (e) => {
        console.log("Redirection vers le cv prêt");
        window.location.replace("http://localhost:8888/CV");
    })

    const theme_switch = document.querySelector("#theme");
    theme_switch.addEventListener("change", (e) => {
        if(theme_switch.checked){
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
        }
    })
    
    
    document.querySelector(".admin").addEventListener("click", (e) => {
        Swal.fire({
            html: `
                <input type="text" id="login" class="input-sweet" placeholder="Email ou Identifiant">
                <input type="text" id="password" class="input-sweet" placeholder="Mot de Passe">
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
        }).then((result) =>{
            console.log("seconde partie");
            console.log(result);
            for(const user of users){
                if(user.username === result.value.login && user.password === result.value.password){
                    connected=true; 
                    Swal.fire({
                        title: "Connexion Réussie",
                        text: "Tu es maintenant connecter sous le nom " + user.username,
                        icon: "success",
                        timer: 3500,
                        showConfirmButton: false,
                        position: "top-end"
                    });
                    break;
                }
            }
            if(!connected){
                Swal.fire({
                    title: "Connexion Echoué",
                    text: "Nous n'avons aucun utilisateurs du nom de " + result.value.username,
                    icon: "error",
                    timer: 1500,
                    showConfirmButton: false,
                    position: "top-end"
                })
            }
        })
    })
})