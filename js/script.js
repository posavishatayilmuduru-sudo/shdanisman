/* ================================================================
   SH Danışmanlık — /js/script.js
   Tek JS dosyası. Inline CSS class isimleriyle birebir uyumlu.
   
   CSS class mapping:
   - Nav panel açık:     .main-nav.mobile-open
   - Overlay açık:       .mobile-nav-overlay.active
   - Dropdown açık:      .dropdown.open
   - FAQ açık:           .faq-item.open
   - Slider aktif:       .slide.active  /  .dot.active
   ================================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* =====================================================
     SLIDER
     ===================================================== */
  var slides      = document.querySelectorAll('.slide');
  var dotsBox     = document.getElementById('sliderDots');
  var prevBtn     = document.querySelector('.slider-btn.prev');
  var nextBtn     = document.querySelector('.slider-btn.next');
  var sliderEl    = document.querySelector('.slider');
  var current     = 0;
  var total       = slides.length;
  var dots        = [];
  var autoTimer   = null;

  if (total > 0 && dotsBox) {
    // Dot'ları oluştur
    for (var i = 0; i < total; i++) {
      var d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Slayt ' + (i + 1));
      d.setAttribute('type', 'button');
      d.onclick = (function(idx) { return function() { goTo(idx); }; })(i);
      dotsBox.appendChild(d);
      dots.push(d);
    }

    function goTo(n) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (n + total) % total;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); resetAuto(); });

    function startAuto() { autoTimer = setInterval(function() { goTo(current + 1); }, 5000); }
    function resetAuto() { clearInterval(autoTimer); startAuto(); }

    startAuto();

    // Hover'da duraklat (sadece desktop)
    if (sliderEl) {
      sliderEl.addEventListener('mouseenter', function() { clearInterval(autoTimer); });
      sliderEl.addEventListener('mouseleave', function() { startAuto(); });
    }
  }


  /* =====================================================
     COUNTER ANİMASYONU
     ===================================================== */
  var counters = document.querySelectorAll('.counter');
  if (counters.length > 0 && 'IntersectionObserver' in window) {
    var counterObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var el     = entry.target;
        var target = parseInt(el.getAttribute('data-target'), 10);
        var start  = 0;
        var step   = Math.max(target / 60, 1);
        var timer  = setInterval(function() {
          start += step;
          if (start >= target) { start = target; clearInterval(timer); }
          el.textContent = Math.floor(start).toLocaleString('tr-TR');
        }, 16);
        counterObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(function(c) { counterObs.observe(c); });
  }


  /* =====================================================
     FAQ ACCORDION — class: .faq-item.open
     ===================================================== */
  var faqButtons = document.querySelectorAll('.faq-question');
  faqButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item    = this.parentElement;
      var wasOpen = item.classList.contains('open');
      // Hepsini kapat
      document.querySelectorAll('.faq-item.open').forEach(function(i) {
        i.classList.remove('open');
      });
      // Kapalıysa aç
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Daha fazla soru göster
  var loadMoreBtn = document.getElementById('loadMoreFaq');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
      document.querySelectorAll('.faq-item.hidden').forEach(function(item) {
        item.classList.remove('hidden');
      });
      loadMoreBtn.style.display = 'none';
    });
  }


  /* =====================================================
     MOBİL NAV — class: .main-nav.mobile-open
     CSS'te:
       transform: translateX(110%)  →  .mobile-open → translateX(0)
       .dropdown.open → max-height: 500px
     ===================================================== */
  var navOpenBtn  = document.getElementById('navOpenBtn');
  var navCloseBtn = document.getElementById('navCloseBtn');
  var mainNav     = document.getElementById('mainNav');
  var navOverlay  = document.getElementById('navOverlay');

  function openMobileNav() {
    if (!mainNav) return;
    mainNav.classList.add('mobile-open');
    if (navOverlay)  navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (navOpenBtn)  navOpenBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMobileNav() {
    if (!mainNav) return;
    mainNav.classList.remove('mobile-open');
    if (navOverlay)  navOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (navOpenBtn)  navOpenBtn.setAttribute('aria-expanded', 'false');
    // Açık dropdown'ları kapat
    document.querySelectorAll('.main-nav .dropdown.open').forEach(function(d) {
      d.classList.remove('open');
    });
  }

  if (navOpenBtn)  navOpenBtn.addEventListener('click', openMobileNav);
  if (navCloseBtn) navCloseBtn.addEventListener('click', closeMobileNav);
  if (navOverlay)  navOverlay.addEventListener('click', closeMobileNav);

  // Mobil dropdown — accordion (class: .dropdown.open)
  document.querySelectorAll('.main-nav .dropdown > a').forEach(function(link) {
    link.addEventListener('click', function(e) {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        e.stopPropagation();

        var parent  = this.parentElement;
        var wasOpen = parent.classList.contains('open');

        // Diğer açık dropdown'ları kapat
        document.querySelectorAll('.main-nav .dropdown.open').forEach(function(d) {
          d.classList.remove('open');
        });

        // Kapalıysa aç
        if (!wasOpen) parent.classList.add('open');
      }
    });
  });

  // Ekran genişleyince mobil nav'ı sıfırla
  window.addEventListener('resize', function() {
    if (window.innerWidth > 992) closeMobileNav();
  });

  // ESC ile kapat
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMobileNav();
  });


  /* =====================================================
     DROPDOWN HOVER FIX (Desktop)
     ===================================================== */
  var mainHeader = document.querySelector('.main-header');
  document.querySelectorAll('.main-nav .dropdown').forEach(function(dd) {
    dd.addEventListener('mouseenter', function() {
      if (window.innerWidth > 992 && mainHeader) mainHeader.classList.add('menu-open');
    });
    dd.addEventListener('mouseleave', function() {
      if (mainHeader) mainHeader.classList.remove('menu-open');
    });
  });


  /* =====================================================
     İLETİŞİM FORMU
     ===================================================== */
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Teşekkürler! Mesajınız alındı. En kısa sürede size ulaşacağız.');
      form.reset();
    });
  }

});
