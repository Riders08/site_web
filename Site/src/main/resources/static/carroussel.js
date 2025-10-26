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
        const length_carroussel = 12;
        const random = filename.sort(() => 0.5 - Math.random());
        const select_File = random.slice(0,length_carroussel);
        select_File.forEach(file => {
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
                            window.location.href = window.location.href + "/" + encodeURIComponent(file);
                        })
                        
                        container.appendChild(a);
                        a.appendChild(p);
                    }
                }
            })
        });
        let position = 0;
        setInterval(() =>{
            if(container){
                const width = container.scrollWidth;
                position -= width/length_carroussel;
                const list = Array.from(container.querySelectorAll(".carroussel-pack-element"));
                list.forEach(element =>{
                    const p = element.querySelector(".element-title-carroussel");
                    const i = element.querySelector(".carroussel-element");
                    i.style.transition = "transform 0.3s ease";
                    i.style.transform =  `translateX(${position}px)`;
                    p.style.transition = "transform 0.3s ease";
                    p.style.transform =  `translateX(${position}px)`;
                    const getPositionCarroussel = container.getBoundingClientRect();
                    const getPositionElement = i.getBoundingClientRect();
                    /*if(getPositionCarroussel.x > (getPositionElement.x + 100)){
                        p.textContent = "";
                    }*/
                })
            }
        },3000);
    }
});
