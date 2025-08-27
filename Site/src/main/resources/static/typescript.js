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