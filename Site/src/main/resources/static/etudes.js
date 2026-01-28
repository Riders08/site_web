 const swiper = new Swiper('.swiper',{
    direction: 'horizontal',
    loop: false,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    }
 });

gsap.from(".niveau", {
    y:-100,
    opacity:0,
    duration:1,
 });