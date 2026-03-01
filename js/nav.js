document.addEventListener('DOMContentLoaded', function() {
    var openBtn = document.querySelector('.nav-open-btn');
    var closeBtn = document.querySelector('.nav-close-btn');
    var nav = document.querySelector('.main-nav');

    // Overlay yoksa oluştur (style.css .mobile-nav-overlay bekliyor)
    var overlay = document.querySelector('.mobile-nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'mobile-nav-overlay';
        document.body.appendChild(overlay);
    }

    function openNav() {
        nav.classList.add('active');
        if (closeBtn) closeBtn.classList.add('mobile-show');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        nav.classList.remove('active');
        if (closeBtn) closeBtn.classList.remove('mobile-show');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        document.querySelectorAll('.dropdown.mob-open').forEach(function(d) {
            d.classList.remove('mob-open');
        });
    }

    if (openBtn) openBtn.addEventListener('click', openNav);
    if (closeBtn) closeBtn.addEventListener('click', closeNav);
    if (overlay) overlay.addEventListener('click', closeNav);

    // Mobil dropdown toggle
    document.querySelectorAll('.main-nav .dropdown > a').forEach(function(link) {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                var parent = this.parentElement;
                var wasOpen = parent.classList.contains('mob-open');
                document.querySelectorAll('.dropdown.mob-open').forEach(function(d) {
                    d.classList.remove('mob-open');
                });
                if (!wasOpen) {
                    parent.classList.add('mob-open');
                }
            }
        });
    });

    // Resize'da kapat
    window.addEventListener('resize', function() {
        if (window.innerWidth > 992) {
            closeNav();
        }
    });
});
