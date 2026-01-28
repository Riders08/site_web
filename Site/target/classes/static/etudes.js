import { etudes } from "./typescript.js";

document.addEventListener("DOMContentLoaded", () => {

    Object.keys(etudes).forEach(element =>{
        document.querySelector(`.divers_sco ${element}`).addEventListener("click", (e) =>{
            if(e.ctrlKey){
                window.open(etudes[element]);
            }else{
                window.location.href = etudes[element];
            }
        })
    });
})

const swiper = new Swiper('.swiper',{
    direction: 'horizontal',
    loop: false,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    on : {
        init: function () {
            const hash = window.location.hash;

            switch(hash){
                case "#primaire" :
                    swiper.slideTo(1);
                    break;
                case "#college":
                    swiper.slideTo(2);
                    break;
                case "#lycee":
                    swiper.slideTo(3);
                    break;
                case "#universite":
                    swiper.slideTo(4);
                    break;
                default:
                    swiper.slideTo(0);
            }
            gsap.from(".niveau", {
                y:-100,
                opacity:0,
                duration:1,
            })
        },
        slideChange: function () {
            gsap.from(".niveau", {
                y:-100,
                opacity:0,
                duration:1,
            });
        }
    }
});



