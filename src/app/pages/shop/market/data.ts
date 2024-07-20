import { sliderOpt } from 'src/app/shared/data';
import { environment } from '../../../../environments/environment';

interface Category {
    image: string;
    name: string;
    query: string;
}

export const cats: Category[] = [
    {
        image: environment.ASSET_PATH+"assets/images/market/cats/1.jpg",
        name: "Desktop Computers",
        query: "computers"
    },
    {
        image: environment.ASSET_PATH+"assets/images/market/cats/2.jpg",
        name: "Monitors",
        query: "monitors"
    },
    {
        image: environment.ASSET_PATH+"assets/images/market/cats/3.jpg",
        name: "Laptops",
        query: "laptops"
    },
    {
        image: environment.ASSET_PATH+"assets/images/market/cats/4.jpg",
        name: "iPads & Tablets",
        query: "tablets"
    },
    {
        image: environment.ASSET_PATH+"assets/images/market/cats/5.jpg",
        name: "Hard Drives & Storage",
        query: "storage"
    },
    {
        image: environment.ASSET_PATH+"assets/images/market/cats/6.jpg",
        name: "Printers & Supplies",
        query: "printers"
    },
    {
        image: environment.ASSET_PATH+"assets/images/market/cats/7.jpg",
        name: "Computer Accessories",
        query: "accessories"
    },
]

export const brands = [
    environment.ASSET_PATH+"assets/images/brands/2.png",
    environment.ASSET_PATH+"assets/images/brands/3.png",
    environment.ASSET_PATH+"assets/images/brands/4.png",
    environment.ASSET_PATH+"assets/images/brands/5.png",
    environment.ASSET_PATH+"assets/images/brands/6.png",
    environment.ASSET_PATH+"assets/images/brands/1.png",
    environment.ASSET_PATH+"assets/images/brands/2.png"
]

export const bannerSlider = {
    ...sliderOpt,
    nav: false,
    responsive: {
        992: {
            nav: true
        }
    }
}

export const brandSlider = {
    ...sliderOpt,
    nav: false,
    dots: true,
    margin: 30,
    loop: false,
    responsive: {
        0: {
            items: 2
        },
        420: {
            items: 3
        },
        600: {
            items: 4
        },
        900: {
            items: 5
        },
        1024: {
            items: 6,
            nav: true,
            dots: false
        }
    }
};
