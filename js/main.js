/* =========================================
   CURSOR PERSONALIZADO
   ========================================= */

const cursor = document.querySelector('.cursor');
if (cursor && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }, { passive: true });

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
   LAZY LOADING OPTIMIZADO
   ========================================= */

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img);
    });
}

/* =========================================
   ANIMACIONES AL HACER SCROLL
   ========================================= */

const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((element) => {
    io.observe(element);
});

/* =========================================
   FILTROS DEL PORTFOLIO
   ========================================= */

document.querySelectorAll('.filters button').forEach((button) => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.filters button').forEach((element) => {
            element.classList.remove('active');
            element.setAttribute('aria-pressed', 'false');
        });

        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');

        const filter = button.dataset.filter;

        document.querySelectorAll('.item').forEach((item) => {
            item.style.display = (filter === 'all' || item.dataset.cat === filter) ? 'block' : 'none';
        });
    });
});

/* =========================================
   MENÚ MÓVIL
   ========================================= */

const ham = document.querySelector('.hamb');
const mobileMenu = document.querySelector('.mobile-menu');

if (ham && mobileMenu) {
    ham.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('open');
        ham.setAttribute('aria-expanded', String(isOpen));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            ham.setAttribute('aria-expanded', 'false');
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !ham.contains(e.target)) {
            mobileMenu.classList.remove('open');
            ham.setAttribute('aria-expanded', 'false');
        }
    });
}

/* =========================================
   HERO — SLIDESHOW CON OPTIMIZACIÓN
   ========================================= */

(() => {
    const slides = document.querySelectorAll('.hero-slide');

    if (slides.length < 2) return;

    let currentSlide = 0;
    const slideDuration = 5200;

    slides.forEach((slide, index) => {
        if (index === 0) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });

    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, slideDuration);
})();

/* =========================================
   FORMULARIO CONTACTO
   ========================================= */

const contactForm = document.querySelector('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name')?.toString().trim() || 'Cliente';
        const email = formData.get('email')?.toString().trim() || '';
        const message = formData.get('message')?.toString().trim() || '';

        const mailtoLink = `mailto:kairos.visuals@gmail.com?subject=${encodeURIComponent('Nuevo mensaje desde la web - ' + name)}&body=${encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`)}`;

        window.location.href = mailtoLink;

        contactForm.reset();
        alert('Gracias. Tu mensaje se abrirá en tu cliente de correo para enviarlo.');
    });
}
