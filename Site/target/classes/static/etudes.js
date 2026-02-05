const swiper = new Swiper('.swiper',{
    direction: 'horizontal',
    loop: false,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    mousewheel: {
        forceToAxis: true,
        sensitivity: 0.05,
        thresholdDelta: 150,
        thresholdTime: 1000,
        releaseOnEdges: false
    },
    keyboard: {
        enabled: true,
    },
    on : {
        init: function () {
            const timeline_top = gsap.timeline();
            const timeline_bottom = gsap.timeline();
            timeline_top.from(".niveau", {
                y:-100,
                opacity:0,
                duration:1,
            }).from(".subtitle", {
                y:-100,
                opacity:0,
                duration:1,

            }, "-=0.5");
            timeline_bottom.from(".direction", {
                y:100,
                opacity:0,
                duration:1,
            }).from(".paragraphe", {
                y:100,
                opacity:0,
                duration:1,

            }, "-=0.5");
        },
        slideChange: function () {
            const timeline_top = gsap.timeline();
            const timeline_bottom = gsap.timeline();
            timeline_top.from(".niveau", {
                y:-100,
                opacity:0,
                duration:1,
            }).from(".subtitle", {
                y:-100,
                opacity:0,
                duration:1,
            }, "-=0.5");
            timeline_bottom.from(".direction", {
                y:100,
                opacity:0,
                duration:1,
            }).from(".paragraphe", {
                y:100,
                opacity:0,
                duration:1,
            }, "-=0.5");
        }
    }
});

document.querySelectorAll(".fa-arrow-right").addEventListener("click", (e) => {
    swiper.slideNext();
});

document.querySelectorAll(".fa-arrow-left").addEventListener("click", (e) => {
    swiper.slidePrevious();
});

