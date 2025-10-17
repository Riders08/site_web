import { filenamePromise } from "./typescript.js";

const icon = [
    {icon: "fa-file-word", type: "odt"},
    {icon: "fa-file-lines", type: "txt"},
    {icon: "fa-file-pdf", type: "pdf"},
    {icon: "fa-file-image", type: ["jpg","jpeg","png"]}
]


const container = document.querySelector(".carroussel");

document.addEventListener("DOMContentLoaded", async () => {
    if(container){
        const filename = await filenamePromise;
        filename.forEach(file => {
            const extension = file.split(".").pop(); 
            const name = file.replace("." + extension, "");
            icon.forEach(element => {
                const a = document.createElement("a");
                const i = document.createElement("i");
                const p = document.createElement("p");
                if(Array.isArray(element.type)){
                    if(element.type.includes(extension)){
                        //cas image
                        i.classList.add("fa-solid", element.icon, "carroussel-element");
                        p.textContent = name;
                        p.classList.add("element-title-carroussel");
                        a.classList.add("carroussel-pack-element");
                        a.appendChild(i);  
                        a.addEventListener("click", (e) =>{
                            e.preventDefault();
                            window.location.href = window.location.href + "/" + encodeURIComponent(file);
                        })
                        container.appendChild(a);   
                        a.appendChild(p);
                    }
                }else{
                    if(extension === element.type){
                        //cas hors image
                        i.classList.add("fa-solid", element.icon, "carroussel-element");
                        p.textContent = name;
                        p.classList.add("element-title-carroussel");
                        a.classList.add("carroussel-pack-element");
                        a.appendChild(i);  
                        a.addEventListener("click", (e) =>{
                            e.preventDefault();
                            // ATTENTION POUR LES FICHIERS ODT et TXT ILS NE LES OUVRENT PAS MAIS TELECHARGE UN FICHIER BIZARRE
                            window.location.href = window.location.href + "/" + encodeURIComponent(file);
                        })
                        container.appendChild(a);
                        a.appendChild(p);
                    }
                }
            })
        })   
    }
});
