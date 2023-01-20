const addPreload = (elem) => {
    elem.classList.add('preload')
};

const removePreload = (elem) => {
    elem.classList.remove('preload')
};

const startSLider = () => {    
    const sliderItems = document.querySelectorAll('.slider__item');
    const sliderList = document.querySelector('.slider__list');
    const btnPrevSlide = document.querySelector('.slider__arrow-left');
    const btnNextSlide = document.querySelector('.slider__arrow-right');

    let activeSlide = 1;
    let positiom = 0;

    const checkSlider = () => {
        if (activeSlide + 2 === sliderItems.length &&
            document.documentElement.offsetWidth > 560 ||
            activeSlide === sliderItems.length) {
            btnNextSlide.style.display = 'none';
        } else {
            btnNextSlide.style.display = '';
        }

        if (activeSlide === 1) {
            btnPrevSlide.style.display = 'none';
        } else {
            btnPrevSlide.style.display = '';
        }
    };

    checkSlider();

    const nextSlide = () => {
        sliderItems[activeSlide]?.classList.remove('slider__item-active');
        position = -sliderItems[0].clientWidth * activeSlide;

        sliderList.style.transform = `translateX(${position}px)`;
        activeSlide +=1;
        sliderItems[activeSlide]?.classList.add('slider__item-active');
        checkSlider();
    };

    const PrevSlide = () => {
        sliderItems[activeSlide]?.classList.remove('slider__item-active');
        position = -sliderItems[0].clientWidth * (activeSlide - 2);

        sliderList.style.transform = `translateX(${position}px)`;
        activeSlide -=1;
        sliderItems[activeSlide]?.classList.add('slider__item-active');
        checkSlider();
    };

    btnPrevSlide.addEventListener('click', PrevSlide);
    btnNextSlide.addEventListener('click', nextSlide);

    window.addEventListener('resize', () => {
        if (activeSlide +2 > sliderItems.length &&
            document.documentElement.offsetWidth > 560) {
                activeSlide = sliderItems.length - 2;
                sliderItems[activeSlide]?.classList.add('slider__item-active');
            }

        position = -sliderItems[0].clientWidth * (activeSlide - 1);
        sliderList.style.transform = `translateX(${position}px)`;
    })
    
};

const initSlider = () => {
    const slider = document.querySelector('.slider');
    const sliderContainer = document.querySelector('.slider__container');

    sliderContainer.style.display = 'none';
    addPreload(slider)
    window.addEventListener('load', () => {
        sliderContainer.style.display = '';
        startSLider(slider);

        removePreload(slider);
    });

};

window.addEventListener('DOMContentLoaded', initSlider);

