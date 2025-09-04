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
            focusConfirm: false,
            preConfirm: () => {
                const login = Swal.getPopup().querySelector('#login').value
                const password = Swal.getPopup().querySelector('#password').value
                if(!login || ! password){
                    Swal.fire({
                        icon: "error",
                        title: "Oops",
                        text: "L'identifiant ou le mot de passe est incorrect"
                    })
                }
                return {login: login, password: password}
            }
        }).then((result) =>{
            if(result.isConfirmed){
                Swal.fire(`
                    Identifiant: ${result.value.login}
                    Mot de Passe: ${result.value.password}
                    `)
            }
        })
    })
})