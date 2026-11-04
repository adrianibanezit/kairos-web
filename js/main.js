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
   HERO — SLIDESHOW CON CARGA DIFERIDA
   La 1.ª foto va en el HTML (LCP). Las demás se piden
   una a una, solo cuando toca, para no competir con ella.
   ========================================= */

(() => {
    const slides = document.querySelectorAll('.hero-slide');

    if (slides.length < 2) return;

    let currentSlide = 0;
    const slideDuration = 5200;

    const loadSlide = (slide) => {
        const img = slide && slide.querySelector('img[data-hero-src]');
        if (!img) return;

        if (img.dataset.heroSrcset) img.srcset = img.dataset.heroSrcset;
        img.src = img.dataset.heroSrc;
        img.removeAttribute('data-hero-src');
        img.removeAttribute('data-hero-srcset');
    };

    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === 0);
    });

    // Precarga la 2.ª foto cuando la página ya ha terminado de cargar
    const preloadSecond = () => loadSlide(slides[1]);
    if (document.readyState === 'complete') {
        preloadSecond();
    } else {
        window.addEventListener('load', preloadSecond, { once: true });
    }

    setInterval(() => {
        if (document.hidden) return; // pestaña en segundo plano: no animar

        const nextSlide = (currentSlide + 1) % slides.length;
        loadSlide(slides[nextSlide]); // por si aún no se había cargado

        slides[currentSlide].classList.remove('active');
        currentSlide = nextSlide;
        slides[currentSlide].classList.add('active');

        loadSlide(slides[(currentSlide + 1) % slides.length]); // prepara la siguiente
    }, slideDuration);
})();

/* =========================================
   FORMULARIO CONTACTO CON VERCEL SERVERLESS
   ========================================= */

const contactForm = document.querySelector('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = String(formData.get('name') || '').trim();
        const email = String(formData.get('email') || '').trim();
        const message = String(formData.get('message') || '').trim();

        // Validar datos en cliente
        if (!name || !email || !message) {
            alert('Por favor, rellena todos los campos.');
            return;
        }

        // Validar formato email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, introduce un email válido.');
            return;
        }

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, message })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'No se pudo enviar el mensaje.');
            }

            // Éxito
            contactForm.reset();
            alert('¡Gracias! Tu mensaje ha sido enviado correctamente. Nos pondremos en contacto pronto.');
        } catch (error) {
            console.error('Error:', error);
            alert(error.message || 'Ha ocurrido un error al enviar el mensaje. Por favor, intenta de nuevo.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}
