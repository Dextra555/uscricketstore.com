import { sliderOpt } from 'src/app/shared/data';

export const introSlider = {
    ...sliderOpt,
    dots: false,
    nav: false,
    loop: false,
    responsive: {
        992: {

        }
    }
}

export const iconboxSlider = {
    ...sliderOpt,
    dots: false,
    nav: true,
    margin: 20,
    autoHeight: true,
    navContainer: '#customNav',
    autoplay: true,
    autoplayTimeout: 3000,
    responsive: {
        0: {
            items: 2
        },
        576: {
            items: 3
        },
        768: {
            items: 4
        },
        992: {
            items: 5
        }
    }
}

export const testimonialSlider = {
    ...sliderOpt,
    nav: false,
    dots: true,
    responsive: {
        992: {
            nav: true
        }
    }
}

export const instagramSlider = {
    ...sliderOpt,
    nav: false,
    dots: false,
    margin: 20,
    loop: false,
    responsive: {
        0: {
            items: 2
        },
        576: {
            items: 2
        },
        768: {
            items: 3
        },
        992: {
            items: 4
        },
        1200: {
            items: 5
        }
    }
}

export const newSlider = {
    ...sliderOpt,
    nav: true,
    dots: false,
    margin: 20,
    loop: false,
    responsive: {
        0: {
            items: 2,
            nav: false
        },
        576: {
            items: 2
        },
        768: {
            items: 3
        },
        992: {
            items: 4
        }
    }
}

export const homeProductsSlider = {
    ...sliderOpt,
    nav: true,
    dots: false,
    autoplay:true,
    margin: 20,
    loop: true,
    responsive: {
        0: {
            items: 1
        },
        576: {
            items: 2
        },
        768: {
            items: 3
        },
        992: {
            items: 3
        }
    }
}

export const featuredSlider = {
    ...sliderOpt,
    nav: false,
    dots: false,
    margin: 20,
    loop: false,
    responsive: {
        0: {
            items: 2
        },
        576: {
            items: 2
        },
        768: {
            items: 3
        },
        992: {
            items: 4
        },
        1200: {
            items: 5,
            nav: true
        }
    }
}
