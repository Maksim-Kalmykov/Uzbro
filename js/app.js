function openGalleryModal(src, alt) {
    const modal = document.getElementById('galleryModal');
    const img = document.getElementById('galleryModalImg');
    if (modal && img) {
        img.src = src;
        img.alt = alt || 'Фото работы мастера';
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeGalleryModal();
    }
});

if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
        particles: {
            number: { value: 40, density: { enable: true, value_area: 800 } },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.15, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: false },
            move: { enable: true, speed: 1.5, direction: 'none', random: true }
        },
        interactivity: {
            events: { onhover: { enable: true, mode: 'bubble' } },
            modes: { bubble: { distance: 100, size: 5, opacity: 0.3 } }
        }
    });
}

(() => {
    const heroBg = document.getElementById('heroBg');
    if (!heroBg) return;

    function getHeroImage() {
        const width = window.innerWidth;
        let size = '960';
        if (width <= 360) size = '360';
        else if (width <= 640) size = '640';
        else if (width <= 960) size = '960';
        else size = '960';

        const supportsAvif = document.createElement('canvas')
            .toDataURL('image/avif')
            .indexOf('image/avif') !== -1;

        const supportsWebp = document.createElement('canvas')
            .toDataURL('image/webp')
            .indexOf('image/webp') !== -1;

        let format = 'jpg';
        if (supportsAvif) format = 'avif';
        else if (supportsWebp) format = 'webp';

        return `images/bg-hero/bg-hero-${size}px.${format}`;
    }

    function setHeroBg() {
        const img = getHeroImage();
        heroBg.style.backgroundImage = `url('${img}')`;
    }

    setHeroBg();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setHeroBg, 200);
    });
})();

(() => {
    const parallaxBg = document.getElementById('parallaxBg');
    if (!parallaxBg) return;

    function getParallaxImage() {
        const width = window.innerWidth;
        let size = '1280';
        if (width <= 360) size = '360';
        else if (width <= 640) size = '640';
        else if (width <= 960) size = '960';
        else size = '1280';

        const supportsAvif = document.createElement('canvas')
            .toDataURL('image/avif')
            .indexOf('image/avif') !== -1;

        const supportsWebp = document.createElement('canvas')
            .toDataURL('image/webp')
            .indexOf('image/webp') !== -1;

        let format = 'jpg';
        if (supportsAvif) format = 'avif';
        else if (supportsWebp) format = 'webp';

        return `images/bg-works/bg-works-${size}px.${format}`;
    }

    function setParallaxBg() {
        const img = getParallaxImage();
        parallaxBg.style.backgroundImage = `url('${img}')`;
    }

    setParallaxBg();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setParallaxBg, 200);
    });
})();

(() => {
    const banner = document.getElementById('pwaTopBanner');
    const installBtn = document.getElementById('pwaInstallBtn');
    const closeBtn = document.getElementById('pwaCloseBanner');

    let deferredPrompt = null;
    let bannerTimeout = null;
    let bannerVisible = false;

    function isAppInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true;
    }

    function hideBanner() {
        if (!banner || !bannerVisible) return;
        banner.classList.remove('show');
        bannerVisible = false;
        if (bannerTimeout) {
            clearTimeout(bannerTimeout);
            bannerTimeout = null;
        }
        setTimeout(() => {
            if (!bannerVisible) {
                banner.classList.add('hide');
            }
        }, 300);
    }

    function showBanner() {
        if (!banner) return;
        if (isAppInstalled()) {
            banner.classList.add('hide');
            return;
        }
        if (!deferredPrompt) {
            return;
        }
        banner.classList.remove('hide');
        bannerVisible = true;
        setTimeout(() => {
            if (bannerVisible) {
                banner.classList.add('show');
            }
        }, 50);
        if (bannerTimeout) clearTimeout(bannerTimeout);
        bannerTimeout = setTimeout(() => {
            hideBanner();
        }, 10000);
    }

    if (installBtn) {
        installBtn.addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    deferredPrompt = null;
                    if (choiceResult.outcome === 'accepted') {
                        hideBanner();
                    }
                });
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            hideBanner();
        });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (!isAppInstalled()) {
            showBanner();
        }
    });

    if (window.matchMedia) {
        const displayModeQuery = window.matchMedia('(display-mode: standalone)');
        displayModeQuery.addEventListener('change', (e) => {
            if (e.matches) {
                hideBanner();
            } else {
                deferredPrompt = null;
                if (banner) banner.classList.add('hide');
                bannerVisible = false;
            }
        });
    }

    if (isAppInstalled()) {
        if (banner) banner.classList.add('hide');
    }
})();

(() => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', vh + 'px');

    let ticking = false;
    let lastVh = vh;

    function updateVh() {
        const newVh = window.innerHeight * 0.01;
        if (Math.abs(newVh - lastVh) > 0.05) {
            lastVh = newVh;
            document.documentElement.style.setProperty('--vh', newVh + 'px');
        }
        ticking = false;
    }

    window.addEventListener('resize', () => {
        if (!ticking) {
            requestAnimationFrame(updateVh);
            ticking = true;
        }
    }, { passive: true });

    updateVh();

    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                window.scrollTo(0, 1);
                setTimeout(() => { window.scrollTo(0, 0); }, 50);
            }, 100);
        });
    }
})();

(() => {
    const hero = document.getElementById('heroSection');
    if (!hero) return;

    let heroFixedHeight = null;
    let resizeTimer = null;

    function fixHeroHeight() {
        const viewportHeight = window.innerHeight;
        const headerHeight = document.querySelector('.page-header')?.offsetHeight || 0;
        const desiredHeight = Math.max(viewportHeight - headerHeight, 450);

        if (heroFixedHeight === null || Math.abs(hero.offsetHeight - desiredHeight) > 50) {
            heroFixedHeight = desiredHeight;
            hero.style.minHeight = heroFixedHeight + 'px';
            hero.style.height = heroFixedHeight + 'px';
        }
    }

    function onOrientationChange() {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            heroFixedHeight = null;
            fixHeroHeight();
        }, 100);
    }

    window.addEventListener('load', () => {
        fixHeroHeight();
        setTimeout(fixHeroHeight, 100);
    });

    if (window.matchMedia) {
        window.matchMedia('(orientation: portrait)').addEventListener('change', onOrientationChange);
        window.matchMedia('(orientation: landscape)').addEventListener('change', onOrientationChange);
    }
})();

(() => {
    const heroBg = document.querySelector('.hero__bg');
    const parallaxBg = document.querySelector('.section__bg');

    if (!heroBg && !parallaxBg) return;

    let ticking = false;

    function applyParallax() {
        const scrollY = window.scrollY;

        if (heroBg) {
            const heroSection = document.getElementById('heroSection');
            if (heroSection) {
                const rect = heroSection.getBoundingClientRect();
                const heroTop = rect.top + scrollY;
                const heroBottom = heroTop + rect.height;

                if (scrollY + window.innerHeight > heroTop && scrollY < heroBottom) {
                    const offset = (scrollY - heroTop) * 0.3;
                    heroBg.style.transform = 'translateY(' + offset + 'px)';
                } else if (scrollY < heroTop) {
                    heroBg.style.transform = 'translateY(0px)';
                }
            }
        }

        if (parallaxBg) {
            const parallaxSection = document.getElementById('parallax-combined');
            if (parallaxSection) {
                const rect = parallaxSection.getBoundingClientRect();
                const sectionTop = rect.top + scrollY;
                const sectionBottom = sectionTop + rect.height;

                if (scrollY + window.innerHeight > sectionTop && scrollY < sectionBottom) {
                    const offset = (scrollY - sectionTop) * 0.4;
                    parallaxBg.style.transform = 'translateY(' + offset + 'px)';
                } else if (scrollY < sectionTop) {
                    parallaxBg.style.transform = 'translateY(0px)';
                }
            }
        }

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(applyParallax);
            ticking = true;
        }
    }

    let resizeTimeout;

    function onResize() {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (heroBg) heroBg.style.transform = '';
            if (parallaxBg) parallaxBg.style.transform = '';
            applyParallax();
        }, 100);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    setTimeout(applyParallax, 100);
})();

document.addEventListener('contextmenu', (e) => {
    const isFooter = e.target.closest('.footer');
    const isContacts = e.target.closest('#info');
    if (!isFooter && !isContacts) {
        e.preventDefault();
        return false;
    }
});

const themeIcon = document.getElementById('theme-toggle-icon');
const mobileThemeIcon = document.getElementById('mobile-theme-icon');
const themeIconSpan = themeIcon ? themeIcon.querySelector('span') : null;
const mobileThemeSpan = mobileThemeIcon ? mobileThemeIcon.querySelector('span') : null;

let currentThemeIsLight = false;

function updateThemeIcons(isLight) {
    if (themeIconSpan) themeIconSpan.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
    if (mobileThemeSpan) mobileThemeSpan.className = isLight ? 'fas fa-moon' : 'fas fa-sun';
}

function addLightThemeStars() {
    if (document.querySelector('.theme__star')) return;
    for (let i = 0; i < 60; i++) {
        const star = document.createElement('div');
        star.className = 'theme__star';
        star.style.cssText = 'position:fixed; width:' + (Math.random() * 3 + 1) + 'px; height:' + (Math.random() * 3 + 1) + 'px; left:' + (Math.random() * 100) + '%; top:' + (Math.random() * 100) + '%; animation-delay:' + (Math.random() * 8) + 's; animation-duration:' + (Math.random() * 10 + 6) + 's; opacity:0';
        document.body.appendChild(star);
    }
}

function removeLightThemeStars() {
    const stars = document.querySelectorAll('.theme__star');
    stars.forEach((star) => { star.remove(); });
}

function hasFunctionalConsent() {
    const saved = localStorage.getItem('uzbro_cookie_consent');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            return data.consent === true && data.functional === true;
        } catch (e) {
            return false;
        }
    }
    return false;
}

function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    const hasFunctional = hasFunctionalConsent();

    if (savedTheme === 'light' && hasFunctional) {
        document.body.classList.add('light-theme');
        currentThemeIsLight = true;
        updateThemeIcons(true);
        addLightThemeStars();
    } else {
        document.body.classList.remove('light-theme');
        currentThemeIsLight = false;
        updateThemeIcons(false);
        removeLightThemeStars();
        if (savedTheme === 'light' && !hasFunctional) {
            localStorage.removeItem('theme');
        }
    }
}

if (hasFunctionalConsent()) {
    applySavedTheme();
} else {
    localStorage.removeItem('theme');
    document.body.classList.remove('light-theme');
    updateThemeIcons(false);
    removeLightThemeStars();
}

function handleThemeChange() {
    const hasFunctional = hasFunctionalConsent();
    const isLight = document.body.classList.contains('light-theme');

    if (isLight) {
        document.body.classList.remove('light-theme');
        currentThemeIsLight = false;
        updateThemeIcons(false);
        removeLightThemeStars();
        if (hasFunctional) {
            localStorage.setItem('theme', 'dark');
        }
    } else {
        document.body.classList.add('light-theme');
        currentThemeIsLight = true;
        updateThemeIcons(true);
        addLightThemeStars();
        if (hasFunctional) {
            localStorage.setItem('theme', 'light');
        }
    }
}

if (themeIcon) themeIcon.addEventListener('click', handleThemeChange);
if (mobileThemeIcon) mobileThemeIcon.addEventListener('click', handleThemeChange);

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

function closeMobileMenu() {
    mobileNav.classList.remove('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.innerHTML = '<span class="fas fa-bars"></span>';
}

if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = mobileNav.classList.contains('open');
        if (isOpen) {
            closeMobileMenu();
        } else {
            mobileNav.classList.add('open');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
            mobileMenuBtn.innerHTML = '<span class="fas fa-times"></span>';
        }
    });

    const mobileLinks = mobileNav.querySelectorAll('.nav-link');
    mobileLinks.forEach((link) => { link.addEventListener('click', closeMobileMenu); });

    document.addEventListener('click', (e) => {
        if (mobileNav.classList.contains('open') && !mobileNav.contains(e.target) && e.target !== mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

setTimeout(() => {
    const header = document.querySelector('.page-header');
    if (header) header.classList.add('page-header--visible');
}, 100);

const scrollBtn = document.getElementById('scrollToTopBtn');
const progressCircle = document.querySelector('.scroll-progress-ring__circle');
const CIRCUMFERENCE = 2 * Math.PI * 26;

if (progressCircle) {
    progressCircle.style.strokeDasharray = CIRCUMFERENCE;
    progressCircle.style.strokeDashoffset = CIRCUMFERENCE;
}

function updateProgressRing() {
    if (!progressCircle) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0;
    progressCircle.style.strokeDashoffset = CIRCUMFERENCE * (1 - scrollPercent);
}

let tickingScroll = false;

function onScrollHandler() {
    if (!tickingScroll) {
        requestAnimationFrame(() => {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('show');
            } else {
                scrollBtn.classList.remove('show');
            }
            updateProgressRing();
            tickingScroll = false;
        });
        tickingScroll = true;
    }
}

window.addEventListener('scroll', onScrollHandler, { passive: true });
window.addEventListener('resize', updateProgressRing, { passive: true });
onScrollHandler();

if (scrollBtn) {
    scrollBtn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

const typewriterText = "Стильная стрижка и ухоженная борода — твой пропуск в мир уверенности.";
let i = 0;
const typewriterElement = document.getElementById('typewriter-text');

function typeWriter() {
    if (i < typewriterText.length && typewriterElement) {
        typewriterElement.innerHTML = typewriterText.substring(0, i + 1) + '<span class="typewriter-cursor"></span>';
        i++;
        setTimeout(typeWriter, 40);
    } else if (typewriterElement) {
        typewriterElement.innerHTML = typewriterText;
    }
}
setTimeout(typeWriter, 500);

(() => {
    const cards = document.querySelectorAll('.service-card');
    if (!cards.length) return;

    cards.forEach((card) => {
        let cardRect = null;
        let rafId = null;

        function updateCardRect() { cardRect = card.getBoundingClientRect(); }

        card.addEventListener('mouseenter', updateCardRect);
        card.addEventListener('mouseleave', () => { card.style.transform = ''; if (rafId) cancelAnimationFrame(rafId); });

        card.addEventListener('mousemove', (e) => {
            if (!cardRect) return;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const x = e.clientX - cardRect.left;
                const y = e.clientY - cardRect.top;
                const centerX = cardRect.width / 2;
                const centerY = cardRect.height / 2;
                const rotateX = (y - centerY) / 25;
                const rotateY = (centerX - x) / 25;
                card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-5px)';
                rafId = null;
            });
        });

        window.addEventListener('resize', updateCardRect, { passive: true });
    });
})();

function animateCounter(id, target, duration) {
    let current = 0;
    const elem = document.getElementById(id);
    if (!elem) return;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) { elem.innerText = target;
            clearInterval(timer); } else { elem.innerText = Math.floor(current); }
    }, stepTime);
}

let countersStarted = false;
const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !countersStarted) {
        countersStarted = true;
        animateCounter('expCounter', 10, 1600);
        animateCounter('clientsCounter', 10872, 1900);
        animateCounter('servicesCounter', 6, 1300);
    }
}, { threshold: 0.4 });
const statSection = document.querySelector('.stats-grid');
if (statSection) counterObserver.observe(statSection);

const sliderWrapper = document.getElementById('featuresSlider');
const prevBtn = document.getElementById('sliderPrevBtn');
const nextBtn = document.getElementById('sliderNextBtn');

if (sliderWrapper && prevBtn && nextBtn) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartScrollLeft = 0;
    let isSwiping = false;
    let moveDirection = null;
    let startTime = 0;
    let lastTouchX = 0;
    let velocity = 0;
    let momentumId = null;

    let mouseStartX = 0;
    let mouseStartScrollLeft = 0;
    let isMouseDragging = false;

    function snapToNearestMobile() {
        const track = document.querySelector('.features-slider__track');
        if (!track) return;
        const cards = track.querySelectorAll('.feature-card');
        if (!cards.length) return;

        const containerRect = sliderWrapper.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;
        let minDistance = Infinity;
        let closestIndex = 0;

        cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(cardCenter - centerX);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        const firstCard = cards[0];
        const lastCard = cards[cards.length - 1];
        const firstCardRect = firstCard.getBoundingClientRect();
        const lastCardRect = lastCard.getBoundingClientRect();

        if (lastCardRect.right > containerRect.right + 20) {
            lastCard.scrollIntoView({ behavior: 'smooth', inline: 'end', block: 'nearest' });
            return;
        }
        if (firstCardRect.left < containerRect.left - 20) {
            firstCard.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
            return;
        }

        if (closestIndex === cards.length - 1) {
            lastCard.scrollIntoView({ behavior: 'smooth', inline: 'end', block: 'nearest' });
        } else if (closestIndex === 0) {
            firstCard.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        } else {
            cards[closestIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }

    function applyMomentumMobile(velocity) {
        if (Math.abs(velocity) < 0.5) return;
        const maxScroll = sliderWrapper.scrollWidth - sliderWrapper.clientWidth;
        const step = velocity * 2.5;
        let newScroll = sliderWrapper.scrollLeft + step;
        if (newScroll < 0) newScroll = 0;
        if (newScroll > maxScroll) newScroll = maxScroll;
        sliderWrapper.scrollLeft = newScroll;
        velocity *= 0.92;
        if (Math.abs(velocity) > 0.5 && newScroll > 0 && newScroll < maxScroll) {
            momentumId = requestAnimationFrame(() => { applyMomentumMobile(velocity); });
        } else {
            snapToNearestMobile();
        }
    }

    sliderWrapper.addEventListener('touchstart', (e) => {
        if (window.innerWidth > 768) return;
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartScrollLeft = sliderWrapper.scrollLeft;
        lastTouchX = touchStartX;
        startTime = Date.now();
        isSwiping = false;
        moveDirection = null;
        velocity = 0;
        if (momentumId) {
            cancelAnimationFrame(momentumId);
            momentumId = null;
        }
        sliderWrapper.classList.add('features-slider--dragging');
    }, { passive: true });

    sliderWrapper.addEventListener('touchmove', (e) => {
        if (window.innerWidth > 768) return;
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = Math.abs(touch.clientY - touchStartY);
        const absDeltaX = Math.abs(deltaX);

        if (moveDirection === null && (absDeltaX > 5 || deltaY > 5)) {
            if (absDeltaX > deltaY) {
                moveDirection = 'horizontal';
                isSwiping = true;
            } else {
                moveDirection = 'vertical';
                isSwiping = false;
            }
        }
        if (moveDirection === 'vertical') return;
        if (moveDirection === 'horizontal') {
            e.preventDefault();
            const maxScroll = sliderWrapper.scrollWidth - sliderWrapper.clientWidth;
            let newScroll = touchStartScrollLeft - deltaX;
            if (newScroll < 0) newScroll = 0;
            if (newScroll > maxScroll) newScroll = maxScroll;
            sliderWrapper.scrollLeft = newScroll;
            const timeDelta = Date.now() - startTime;
            if (timeDelta > 30) {
                const delta = lastTouchX - touch.clientX;
                velocity = delta / timeDelta * 12;
                lastTouchX = touch.clientX;
                startTime = Date.now();
            }
        }
    }, { passive: false });

    sliderWrapper.addEventListener('touchend', (e) => {
        if (window.innerWidth > 768) return;
        sliderWrapper.classList.remove('features-slider--dragging');
        if (moveDirection === 'horizontal' && isSwiping) {
            if (Math.abs(velocity) > 1.5) {
                if (momentumId) cancelAnimationFrame(momentumId);
                momentumId = requestAnimationFrame(() => { applyMomentumMobile(velocity); });
            } else {
                snapToNearestMobile();
            }
        }
        isSwiping = false;
        moveDirection = null;
        velocity = 0;
    }, { passive: true });

    sliderWrapper.addEventListener('mousedown', (e) => {
        isMouseDragging = true;
        sliderWrapper.classList.add('features-slider--dragging');
        mouseStartX = e.clientX;
        mouseStartScrollLeft = sliderWrapper.scrollLeft;
        sliderWrapper.style.cursor = 'grabbing';
        e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isMouseDragging) return;
        const deltaX = mouseStartX - e.clientX;
        const maxScroll = sliderWrapper.scrollWidth - sliderWrapper.clientWidth;
        let newScroll = mouseStartScrollLeft + deltaX;
        if (newScroll < 0) newScroll = 0;
        if (newScroll > maxScroll) newScroll = maxScroll;
        sliderWrapper.scrollLeft = newScroll;
    });

    window.addEventListener('mouseup', () => {
        if (isMouseDragging) {
            isMouseDragging = false;
            sliderWrapper.classList.remove('features-slider--dragging');
            sliderWrapper.style.cursor = 'grab';
        }
    });

    prevBtn.addEventListener('click', () => {
        const track = document.querySelector('.features-slider__track');
        if (!track) return;
        const cards = track.querySelectorAll('.feature-card');
        if (!cards.length) return;

        if (window.innerWidth > 768) {
            const firstCard = cards[0];
            const cardWidth = firstCard.offsetWidth;
            const gap = parseFloat(getComputedStyle(track).gap) || 0;
            const step = cardWidth + gap;
            const currentScroll = sliderWrapper.scrollLeft;
            sliderWrapper.scrollTo({ left: Math.max(0, currentScroll - step), behavior: 'smooth' });
            return;
        }

        let currentIndex = 0;
        const containerRect = sliderWrapper.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;
        let minDistance = Infinity;
        cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(cardCenter - centerX);
            if (distance < minDistance) {
                minDistance = distance;
                currentIndex = index;
            }
        });
        const prevIndex = Math.max(0, currentIndex - 1);
        if (prevIndex === 0) {
            cards[prevIndex].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        } else {
            cards[prevIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    });

    nextBtn.addEventListener('click', () => {
        const track = document.querySelector('.features-slider__track');
        if (!track) return;
        const cards = track.querySelectorAll('.feature-card');
        if (!cards.length) return;

        if (window.innerWidth > 768) {
            const firstCard = cards[0];
            const cardWidth = firstCard.offsetWidth;
            const gap = parseFloat(getComputedStyle(track).gap) || 0;
            const step = cardWidth + gap;
            const currentScroll = sliderWrapper.scrollLeft;
            const maxScroll = sliderWrapper.scrollWidth - sliderWrapper.clientWidth;
            sliderWrapper.scrollTo({ left: Math.min(maxScroll, currentScroll + step), behavior: 'smooth' });
            return;
        }

        let currentIndex = 0;
        const containerRect = sliderWrapper.getBoundingClientRect();
        const centerX = containerRect.left + containerRect.width / 2;
        let minDistance = Infinity;
        cards.forEach((card, index) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(cardCenter - centerX);
            if (distance < minDistance) {
                minDistance = distance;
                currentIndex = index;
            }
        });
        const nextIndex = Math.min(cards.length - 1, currentIndex + 1);
        if (nextIndex === cards.length - 1) {
            cards[nextIndex].scrollIntoView({ behavior: 'smooth', inline: 'end', block: 'nearest' });
        } else {
            cards[nextIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    });
}

const fadeElements = document.querySelectorAll('.fade-on-scroll');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
        else entry.target.classList.remove('visible');
    });
}, { threshold: 0.1 });
fadeElements.forEach((el) => { fadeObserver.observe(el); });

const serviceCards = document.querySelectorAll('.service-card[data-service]');
const bookingLink = document.getElementById('bookingLink');
const servicesSelection = document.getElementById('servicesSelection');
const selectionBadges = document.getElementById('selectionBadges');
const selectedCount = document.getElementById('selectedCount');
const selectedTotal = document.getElementById('selectedTotal');

const baseUrl = 'https://n2133024.yclients.com/company/1862679/personal/select-services?o=m5270073';
let selectedServices = [];

const servicePrices = {};

serviceCards.forEach((card) => {
    const serviceId = card.getAttribute('data-service');
    const price = parseInt(card.getAttribute('data-price')) || 0;
    servicePrices[serviceId] = price;
});

function updateBookingSummary() {
    const count = selectedServices.length;
    let total = 0;

    selectedServices.forEach((id) => {
        total += servicePrices[id] || 0;
    });

    bookingLink.href = count === 0 ? baseUrl : baseUrl + selectedServices.join('');

    if (count === 0) {
        servicesSelection.classList.remove('visible');
        bookingLink.setAttribute('aria-label', 'Записаться на услуги');
        return;
    }

    const totalStr = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    selectedCount.textContent = count;
    selectedTotal.textContent = totalStr + ' ₽';
    servicesSelection.classList.add('visible');
    bookingLink.setAttribute('aria-label', 'Записаться на ' + count + ' услуг на сумму ' + totalStr + ' рублей');

    selectionBadges.innerHTML = '';
    selectedServices.forEach(id => {
        const card = document.querySelector(`.service-card[data-service="${id}"]`);
        if (card) {
            const title = card.querySelector('.service-card__title')?.textContent || '';
            const badge = document.createElement('span');
            badge.className = 'services-selection__badge';
            badge.innerHTML = `${title} <span class="remove" data-service="${id}">×</span>`;
            badge.querySelector('.remove').addEventListener('click', (e) => {
                e.stopPropagation();
                const serviceId = e.target.dataset.service;
                const card = document.querySelector(`.service-card[data-service="${serviceId}"]`);
                if (card) toggleService(card, serviceId);
            });
            selectionBadges.appendChild(badge);
        }
    });
}

function toggleService(card, serviceId) {
    if (card.classList.contains('service-card--selected')) {
        card.classList.remove('service-card--selected');
        selectedServices = selectedServices.filter((id) => { return id !== serviceId; });
        card.setAttribute('aria-pressed', 'false');
        let label = card.getAttribute('aria-label') || '';
        card.setAttribute('aria-label', label.replace(' (выбрано)', ''));
    } else {
        card.classList.add('service-card--selected');
        selectedServices.push(serviceId);
        card.setAttribute('aria-pressed', 'true');
        let label = card.getAttribute('aria-label') || '';
        if (!label.includes('(выбрано)')) card.setAttribute('aria-label', label + ' (выбрано)');
    }
    updateBookingSummary();
}

serviceCards.forEach((card) => {
    if (!card.hasAttribute('aria-pressed')) card.setAttribute('aria-pressed', 'false');
    card.addEventListener('click', (e) => { e.stopPropagation();
        toggleService(card, card.getAttribute('data-service')); });
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault();
            toggleService(card, card.getAttribute('data-service')); }
    });
});

updateBookingSummary();

function removeHashFromUrl() {
    if (window.history && history.pushState) {
        history.pushState('', document.title, window.location.pathname + window.location.search);
    }
}

function smoothScrollToElement(targetElement) {
    if (!targetElement) return;
    const headerHeight = document.querySelector('.page-header')?.offsetHeight || 0;
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: Math.max(0, targetPosition - headerHeight - 1), behavior: 'smooth' });
    removeHashFromUrl();
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || href === '' || href === '#/') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            if (mobileNav && mobileNav.classList.contains('open')) closeMobileMenu();
            setTimeout(() => { smoothScrollToElement(target); }, 10);
        }
    });
});

if (window.location.hash) {
    setTimeout(() => {
        const target = document.querySelector(window.location.hash);
        if (target) smoothScrollToElement(target);
    }, 200);
}

(() => {
    const tickerElement = document.querySelector('.ticker');
    const tickerWrap = document.querySelector('.ticker-wrap');

    if (tickerElement && tickerWrap) {
        let isPaused = false;

        function updateAriaLabel() {
            tickerWrap.setAttribute('aria-label', isPaused ? 'Бегущая строка на паузе. Нажмите для воспроизведения' : 'Бегущая строка с преимуществами. Нажмите для паузы');
        }

        tickerWrap.addEventListener('click', () => {
            if (isPaused) {
                tickerElement.style.animationPlayState = 'running';
                isPaused = false;
            } else {
                tickerElement.style.animationPlayState = 'paused';
                isPaused = true;
            }
            updateAriaLabel();
        });
        updateAriaLabel();
    }
})();


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./js/sw.js').catch((error) => { console.log('SW registration failed: ', error); });
    });
}

// ============================================================
// COOKIE CONSENT - ИСПРАВЛЕННАЯ ВЕРСИЯ
// ============================================================
(() => {
    'use strict';

    const COOKIE_CONSENT_KEY = 'uzbro_cookie_consent';
    const COOKIE_EXPIRY_DAYS = 365;

    const banner = document.getElementById('cookieBanner');
    const settingsModal = document.getElementById('cookieSettings');
    const acceptBtn = document.getElementById('cookieAcceptBtn');
    const declineBtn = document.getElementById('cookieDeclineBtn');
    const settingsBtn = document.getElementById('cookieSettingsBtn');
    const settingsClose = document.getElementById('cookieSettingsClose');
    const settingsSave = document.getElementById('cookieSettingsSave');

    const analyticsCheckbox = document.getElementById('cookieAnalytics');
    const marketingCheckbox = document.getElementById('cookieMarketing');
    const functionalCheckbox = document.getElementById('cookieFunctional');

    const dataModal = document.getElementById('dataModal');
    const dataControlBtn = document.getElementById('dataControlBtn');
    const dataModalClose = document.getElementById('dataModalClose');
    const dataModalDelete = document.getElementById('dataModalDelete');
    const dataModalReset = document.getElementById('dataModalReset');

    const themeBadge = document.getElementById('themeBadge');
    const consentBadge = document.getElementById('consentBadge');
    const analyticsBadge = document.getElementById('analyticsBadge');
    const marketingBadge = document.getElementById('marketingBadge');
    const functionalBadge = document.getElementById('functionalBadge');

    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + '=' + value + '; expires=' + date.toUTCString() + '; path=/; SameSite=Lax';
    }

    function deleteCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    function getConsentSettings() {
        const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {}
        }
        return null;
    }

    function hasConsent() {
        const saved = getConsentSettings();
        return saved && saved.consent === true;
    }

    function hasFunctionalConsent() {
        const saved = getConsentSettings();
        return saved && saved.consent === true && saved.functional === true;
    }

    function saveConsent(settings) {
        const consentData = {
            consent: true,
            analytics: settings.analytics || false,
            marketing: settings.marketing || false,
            functional: settings.functional || false,
            timestamp: Date.now()
        };
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
        setCookie('cookie_consent', JSON.stringify(consentData), COOKIE_EXPIRY_DAYS);
        applyConsent(consentData);
        updateBadges();
        // Сохраняем тему, если есть согласие на функциональные
        if (consentData.functional) {
            const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
        } else {
            localStorage.removeItem('theme');
            // НЕ СБРАСЫВАЕМ ТЕМУ ВИЗУАЛЬНО
        }
        hideBanner();
    }

    function removeConsent() {
        localStorage.removeItem(COOKIE_CONSENT_KEY);
        deleteCookie('cookie_consent');
        deleteCookie('theme');
        localStorage.removeItem('theme');
        // НЕ СБРАСЫВАЕМ ТЕМУ ВИЗУАЛЬНО
        updateBadges();
        hideBanner();
    }

    function applyConsent(consentData) {
        if (!consentData || !consentData.consent) {
            localStorage.removeItem('theme');
            deleteCookie('theme');
            // НЕ СБРАСЫВАЕМ ТЕМУ ВИЗУАЛЬНО
            return;
        }

        if (consentData.functional) {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light') {
                document.body.classList.add('light-theme');
                updateThemeIcons(true);
                addLightThemeStars();
            } else {
                document.body.classList.remove('light-theme');
                updateThemeIcons(false);
                removeLightThemeStars();
            }
        } else {
            localStorage.removeItem('theme');
            deleteCookie('theme');
            // НЕ СБРАСЫВАЕМ ТЕМУ ВИЗУАЛЬНО
        }
    }

    function updateBadges() {
        const settings = getConsentSettings();

        if (themeBadge) {
            const isLight = document.body.classList.contains('light-theme');
            themeBadge.textContent = isLight ? 'светлая' : 'тёмная';
            themeBadge.className = 'badge active';
        }

        if (consentBadge) {
            const has = hasConsent();
            consentBadge.textContent = has ? 'принято' : 'не принято';
            consentBadge.className = 'badge ' + (has ? 'active' : 'inactive');
        }

        if (analyticsBadge) {
            const analytics = settings && settings.analytics;
            analyticsBadge.textContent = analytics ? 'активно' : 'не активно';
            analyticsBadge.className = 'badge ' + (analytics ? 'active' : 'inactive');
        }

        if (marketingBadge) {
            const marketing = settings && settings.marketing;
            marketingBadge.textContent = marketing ? 'активно' : 'не активно';
            marketingBadge.className = 'badge ' + (marketing ? 'active' : 'inactive');
        }

        if (functionalBadge) {
            const functional = settings && settings.functional;
            functionalBadge.textContent = functional ? 'активно' : 'не активно';
            functionalBadge.className = 'badge ' + (functional ? 'active' : 'inactive');
        }
    }

    function hideBanner() {
        if (!banner) return;
        banner.classList.remove('show');
        setTimeout(() => {
            banner.style.display = 'none';
        }, 500);
    }

    function showBanner() {
        if (!banner) return;
        banner.style.display = 'block';
        setTimeout(() => {
            banner.classList.add('show');
        }, 100);
    }

    function openSettings() {
        const saved = getConsentSettings();
        if (saved) {
            analyticsCheckbox.checked = saved.analytics !== undefined ? saved.analytics : true;
            marketingCheckbox.checked = saved.marketing !== undefined ? saved.marketing : true;
            functionalCheckbox.checked = saved.functional !== undefined ? saved.functional : true;
        } else {
            analyticsCheckbox.checked = true;
            marketingCheckbox.checked = true;
            functionalCheckbox.checked = true;
        }
        settingsModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeSettings() {
        settingsModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    function openDataModal() {
        updateBadges();
        dataModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDataModal() {
        dataModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    function acceptAll() {
        const settings = {
            analytics: true,
            marketing: true,
            functional: true
        };
        saveConsent(settings);
        closeSettings();
        updateBadges();
        // Сохраняем текущую тему
        const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        localStorage.setItem('theme', currentTheme);
        hideBanner();
    }

    function declineAll() {
        localStorage.removeItem(COOKIE_CONSENT_KEY);
        deleteCookie('cookie_consent');
        deleteCookie('theme');
        localStorage.removeItem('theme');
        // НЕ СБРАСЫВАЕМ ТЕМУ ВИЗУАЛЬНО
        updateBadges();
        hideBanner();
        closeSettings();
    }

    function saveSettings() {
        const settings = {
            analytics: analyticsCheckbox.checked,
            marketing: marketingCheckbox.checked,
            functional: functionalCheckbox.checked
        };
        saveConsent(settings);
        closeSettings();
        updateBadges();
        // Сохраняем тему только если есть согласие на функциональные
        if (settings.functional) {
            const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
        } else {
            localStorage.removeItem('theme');
            // НЕ СБРАСЫВАЕМ ТЕМУ ВИЗУАЛЬНО
        }
        hideBanner();
    }

    function resetCookieSettings() {
        localStorage.removeItem(COOKIE_CONSENT_KEY);
        deleteCookie('cookie_consent');
        deleteCookie('theme');
        localStorage.removeItem('theme');
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        updateThemeIcons(false);
        removeLightThemeStars();
        updateBadges();
        closeDataModal();
        showBanner();
    }

    function deleteAllData() {
        if (confirm('Вы уверены, что хотите удалить все сохранённые данные на этом сайте?\n\nБудут удалены:\n- Настройки темы оформления\n- Настройки cookie\n- Все сохранённые предпочтения\n\nСайт перезагрузится.')) {
            localStorage.clear();
            document.cookie.split(';').forEach((c) => {
                document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
            });
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            updateThemeIcons(false);
            removeLightThemeStars();
            updateBadges();
            closeDataModal();
            location.reload();
        }
    }

    // ========== INIT ==========
    if (hasConsent()) {
        const settings = getConsentSettings();
        applyConsent(settings);
        hideBanner();
        updateBadges();
        if (hasFunctionalConsent()) {
            applySavedTheme();
        }
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        localStorage.removeItem('theme');
        deleteCookie('theme');
        updateThemeIcons(false);
        removeLightThemeStars();
        updateBadges();
        showBanner();
    }

    // ========== EVENTS ==========
    if (acceptBtn) acceptBtn.addEventListener('click', acceptAll);
    if (declineBtn) declineBtn.addEventListener('click', declineAll);
    if (settingsBtn) settingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openSettings();
    });
    if (settingsClose) settingsClose.addEventListener('click', closeSettings);
    if (settingsModal) settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            closeSettings();
        }
    });
    if (settingsSave) settingsSave.addEventListener('click', saveSettings);

    if (dataControlBtn) dataControlBtn.addEventListener('click', openDataModal);
    if (dataModalClose) dataModalClose.addEventListener('click', closeDataModal);
    if (dataModal) dataModal.addEventListener('click', (e) => {
        if (e.target === dataModal) {
            closeDataModal();
        }
    });
    if (dataModalReset) dataModalReset.addEventListener('click', resetCookieSettings);
    if (dataModalDelete) dataModalDelete.addEventListener('click', deleteAllData);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (settingsModal.classList.contains('open')) {
                closeSettings();
            }
            if (dataModal.classList.contains('open')) {
                closeDataModal();
            }
        }
    });

    updateBadges();

})();