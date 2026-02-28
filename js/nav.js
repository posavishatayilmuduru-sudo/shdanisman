/* AKO DİJİTAL — Nav JS — Tüm sayfalar için */
document.addEventListener('DOMContentLoaded', function() {
    var openBtn = document.querySelector('.nav-open-btn');
    var closeBtn = document.querySelector('.nav-close-btn');
    var nav = document.querySelector('.main-nav');
    var overlay = document.querySelector('.mobile-nav-overlay');

    function openNav() {
        if (nav) nav.classList.add('active');
        if (closeBtn) closeBtn.classList.add('mobile-show');
        if (overlay) overlay.classList.add('active');
    }
    function closeNav() {
        if (nav) nav.classList.remove('active');
        if (closeBtn) closeBtn.classList.remove('mobile-show');
        if (overlay) overlay.classList.remove('active');
        document.querySelectorAll('.dropdown.mob-open').forEach(function(d) {
            d.classList.remove('mob-open');
        });
    }

    if (openBtn) openBtn.addEventListener('click', openNav);
    if (closeBtn) closeBtn.addEventListener('click', closeNav);
    if (overlay) overlay.addEventListener('click', closeNav);

    // Dropdown accordion — mob-open class
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
});
