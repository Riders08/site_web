import { projets, languages, isLanguage ,redirectionLanguage } from "./typescript.js";


document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".state_project").forEach(element =>{
        element.addEventListener("click", (e) =>{
            e.preventDefault();
        Swal.fire({
            position: "bottom-end",
            icon: "info",
            title: "Etat du projet",
            text: "Plus la barre est remplie, plus le projet est terminé, si elle est pleine alors ce projet est considéré comme achevé",
            showConfirmButton: false,
            timer: 3500,
            customClass: {
                title: 'swal-title',
                htmlContainer: 'swal-text',
                confirmButton: 'swal-confirm',
                popup: 'swal-popup'
            }
        })
    })
}) 

    const languages = document.querySelectorAll(".language_project");
    
    languages.forEach(language =>{
        language.addEventListener("click", (e) =>{
            e.preventDefault();
            const data = language.textContent.split(":")[1].trim();
            if(isLanguage(data)){
                redirectionLanguage(data);
            }
        })
    })
})