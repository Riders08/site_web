import { filenamePromise } from "./typescript.js";

const icon = [
    {icon: "fa-file-word", type: "odt"},
    {icon: "fa-file-lines", type: "txt"},
    {icon: "fa-file-pdf", type: "pdf"},
    {icon: "fa-file-image", type: ["jpg","jpeg","png"]}
]


function addElementToCarroussel(file) {
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
                    if(e.ctrlKey){
                        window.open(window.location.href + "/" + encodeURIComponent(file));
                    }else{
                        window.location.href = window.location.href + "/" + encodeURIComponent(file);
                    }
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
                    if(e.ctrlKey){
                        window.open(window.location.href + "/" + encodeURIComponent(file));
                    }else{
                        window.location.href = window.location.href + "/" + encodeURIComponent(file);
                    }
                })
                container.appendChild(a);
                a.appendChild(p);
            }
        }
    })
}   

const container = document.querySelector(".carroussel");
document.addEventListener("DOMContentLoaded", async () => {
    const filename = await filenamePromise;
    const length_carroussel = 10;
    let randomFiles = filename.sort(() => 0.5 - Math.random());
    if(container){
        const select_File = randomFiles.slice(0,length_carroussel);
        select_File.forEach(file => {
            addElementToCarroussel(file);
        });
        let index = length_carroussel;
        setInterval(() =>{
            if(index >= filename.length){
                index = 0;
                randomFiles = filename.sort(() => 0.5 - Math.random());
            }
            const file = randomFiles[index];
            addElementToCarroussel(file);
            index++;
            const firstElementCarroussel = document.querySelector(".carroussel-pack-element");
            if(firstElementCarroussel){
                console.log("L'element suivant a été supprimé => ", firstElementCarroussel.textContent);
                firstElementCarroussel.remove();
            }else{
                console.log("Le premier document du carroussel n'est pas reconnu");
            }
            container.scrollTo({
                left: container.scrollWidth,
                behavior: "smooth",
            });
        },3000);
    }
});
