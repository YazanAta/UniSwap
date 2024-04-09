// Home Slider
export let HomeSlider: any = {
    loop: true,
    autoplay: true,
    nav: true,
    dots: false,
    navSpeed: 300,
    mouseDrag: true,
    touchDrag: true,
    smartSpeed: 600, // duration of change of 1 slide
    navContainerClass: 'owl-nav',
    navClass: [ 'owl-prev', 'owl-next' ],
    navText: [ '<i class="ti-angle-left"></i>', '<i class="ti-angle-right"></i>' ],
    responsive: {
        0: {
            items: 1
        },
        400: {
            items: 1
        },
        740: {
            items: 1
        },
        940: {
            items: 1
        }
    },
};