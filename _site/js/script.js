document.addEventListener('DOMContentLoaded', function () {

    // === SLIDER ===
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    const dotsContainer = document.querySelector('.slider-dots');
    let currentSlide = 0;
    let autoSlideInterval;

    if (slides.length > 0 && dotsContainer) {
        // Dots oluştur
        slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        function goToSlide(index) {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            currentSlide = index;
            slides[currentSlide].classList.add('active');
            dots[currentSlide].classList.add('active');
            resetAutoSlide();
        }

        nextBtn?.addEventListener('click', () => goToSlide((currentSlide + 1) % slides.length));
        prevBtn?.addEventListener('click', () => goToSlide((currentSlide - 1 + slides.length) % slides.length));

        function startAutoSlide() {
            autoSlideInterval = setInterval(() => goToSlide((currentSlide + 1) % slides.length), 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        goToSlide(0);
        startAutoSlide();
    }

    // === SSS (Akordeon) ===
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                // Tüm açık olanları kapat
                faqItems.forEach(i => {
                    i.classList.remove('active');
                    const a = i.querySelector('.faq-answer');
                    if (a) a.style.maxHeight = '0';
                });
                // Tıklanan öğeyi aç (kapalıysa)
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

    // === SSS Daha Fazla Göster ===
    const loadMoreBtn = document.getElementById('loadMoreFaq');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function () {
            const hiddenFaqs = document.querySelectorAll('.faq-item.hidden');
            hiddenFaqs.forEach(faq => {
                faq.classList.remove('hidden');
                faq.style.display = 'block';
                faq.style.opacity = '0';
                requestAnimationFrame(() => faq.style.opacity = '1');
            });
            this.style.display = 'none';
        });
    }

    // === SAYMA ANİMASYONU ===
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = +counter.getAttribute('data-target');
                    const speed = 200;
                    const inc = target / speed;
                    let count = 0;

                    const updateCount = () => {
                        count += inc;
                        if (count < target) {
                            counter.innerText = Math.ceil(count);
                            requestAnimationFrame(updateCount);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    // === AÇILIR MENÜ ÇAKIŞMA GİDERİCİ (Desktop) ===
    const mainHeader = document.querySelector('.main-header');
    const desktopDropdowns = document.querySelectorAll('.main-nav .dropdown');
    desktopDropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', () => mainHeader?.classList.add('menu-open'));
        dropdown.addEventListener('mouseleave', () => mainHeader?.classList.remove('menu-open'));
    });

    // === MOBİL MENÜ ===
    const nav = document.querySelector('.main-nav');
    const openBtn = document.querySelector('.nav-open-btn');
    const closeBtn = document.querySelector('.nav-close-btn');
    const mobileDropdowns = document.querySelectorAll('.dropdown > a');
    
    openBtn?.addEventListener('click', () => {
        nav?.classList.add('menu-open');
        if (openBtn) openBtn.style.display = 'none';
        if (closeBtn) closeBtn.style.display = 'block';
    });
    
    closeBtn?.addEventListener('click', () => {
        nav?.classList.remove('menu-open');
        if (closeBtn) closeBtn.style.display = 'none';
        if (openBtn) openBtn.style.display = 'block';
    });
    
    // MOBİL DROPDOWN
    mobileDropdowns.forEach(link => {
        link.addEventListener('click', (e) => {
            if (window.innerWidth <= 991) {
                e.preventDefault();
                e.stopPropagation();
                link.parentElement?.classList.toggle('active');
            }
        });
    });

    // Dropdown dışında tıklayınca menüleri kapat
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 991) {
            // Dropdown menü içindeyse durdur
            if (e.target.closest('.dropdown ul')) {
                e.stopPropagation();
                return;
            }
            // Dropdown dışında tıklanırsa kapat
            if (!e.target.closest('.dropdown')) {
                document.querySelectorAll('.dropdown.active').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        }
    });
});