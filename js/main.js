/* =========================================
   CURSOR PERSONALIZADO
   ========================================= */

const cursor = document.querySelector('.cursor');

if (cursor) {

    window.addEventListener('mousemove', (e) => {

        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

    });

    document.querySelectorAll('a, button, .item').forEach((element) => {

        element.addEventListener('mouseenter', () => {
            cursor.classList.add('big');
        });

        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('big');
        });

    });

}


/* =========================================
   ANIMACIONES AL HACER SCROLL
   ========================================= */

const io = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }

        });

    },
    {
        threshold: 0.12
    }
);


document.querySelectorAll('.reveal').forEach((element) => {
    io.observe(element);
});


/* =========================================
   FILTROS DEL PORTFOLIO
   ========================================= */

document.querySelectorAll('.filters button').forEach((button) => {

    button.onclick = () => {

        document.querySelectorAll('.filters button').forEach((element) => {
            element.classList.remove('active');
        });

        button.classList.add('active');

        const filter = button.dataset.filter;

        document.querySelectorAll('.item').forEach((item) => {

            if (
                filter === 'all' ||
                item.dataset.cat === filter
            ) {

                item.style.display = 'block';

            } else {

                item.style.display = 'none';

            }

        });

    };

});


/* =========================================
   MENÚ MÓVIL
   ========================================= */

const ham = document.querySelector('.hamb');
const mobileMenu = document.querySelector('.mobile-menu');

if (ham && mobileMenu) {

    ham.onclick = () => {
        mobileMenu.classList.toggle('open');
    };

    mobileMenu.querySelectorAll('a').forEach((link) => {

        link.onclick = () => {
            mobileMenu.classList.remove('open');
        };

    });

}


/* =========================================
   HERO — SLIDESHOW
   ========================================= */

(() => {

    const slides = document.querySelectorAll('.hero-slide');

    if (slides.length < 2) {
        return;
    }

    let currentSlide = 0;

    // Tiempo entre fotografías
    const slideDuration = 5200;

    // Aseguramos que solamente la primera esté activa
    slides.forEach((slide, index) => {

        if (index === 0) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }

    });


    setInterval(() => {

        // Ocultamos la fotografía actual
        slides[currentSlide].classList.remove('active');

        // Calculamos la siguiente
        currentSlide = (currentSlide + 1) % slides.length;

        // Mostramos la siguiente
        slides[currentSlide].classList.add('active');

    }, slideDuration);

})();