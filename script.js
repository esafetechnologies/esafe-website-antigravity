/**
 * ESafe Solutions - Global Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initNavbar();
    initScrollReveal();
    initHeroCanvas();
    initStatsCounter();
    initActiveNavAndTop();
    initFormValidation();
    initHeroParallax();
    initInteractiveEffects();
    initThemeToggle();
});

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HERO CURSOR PARALLAX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function initHeroParallax() {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Store mouse position for the canvas engine to use
    window._heroMouse = { x: -9999, y: -9999, active: false };

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        window._heroMouse.x = e.clientX - rect.left;
        window._heroMouse.y = e.clientY - rect.top;
        window._heroMouse.active = true;
    });

    hero.addEventListener('mouseleave', () => {
        window._heroMouse.active = false;
    });
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   STATS COUNTER ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function initStatsCounter() {
    const statsStrip = document.querySelector('.stats-strip');
    const numbers = document.querySelectorAll('.stat-number-large');
    let hasRun = false;

    if (!statsStrip || numbers.length === 0) return;

    const easeOutQuad = t => t * (2 - t);

    const animateCountUp = (el, target, duration) => {
        let start = 0;
        const startTime = performance.now();

        const suffixHTML = el.querySelector('.stat-suffix')?.outerHTML || '';

        const updateCounter = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easedProgress = easeOutQuad(progress);

            const currentValue = Math.floor(easedProgress * target);
            el.innerHTML = currentValue + suffixHTML;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.innerHTML = target + suffixHTML;
            }
        };
        requestAnimationFrame(updateCounter);
    };

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasRun) {
            hasRun = true;
            numbers.forEach(num => {
                if (num.dataset.static === "true") return;
                const target = parseInt(num.dataset.target, 10);
                if (!isNaN(target)) {
                    animateCountUp(num, target, 2000);
                }
            });
            observer.disconnect();
        }
    }, { threshold: 0.5 });

    observer.observe(statsStrip);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ACTIVE NAV & BACK TO TOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function initActiveNavAndTop() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links .nav-link, .nav-links .dropdown-item, .mobile-nav-links a');
    const backToTop = document.getElementById('backToTop');

    // 1. Highlight based on current URL path
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        
        // Exact page match
        if (href === currentPath || (currentPath === 'index.html' && href === './')) {
            link.classList.add('active');
            // If inside a dropdown, highlight the dropdown toggle too
            const dropdown = link.closest('.dropdown');
            if (dropdown) {
                const toggle = dropdown.querySelector('.dropdown-toggle');
                if (toggle) toggle.classList.add('active');
            }
        } else {
            // Remove active just in case
            link.classList.remove('active');
        }
    });

    // 2. Scroll Spy (only applied to the current page's anchored sections)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Target both desktop and mobile anchor links
                const targetLinks = document.querySelectorAll(`.nav-links a[href="#${id}"], .nav-links a[href="index.html#${id}"], .mobile-nav-links a[href="#${id}"], .mobile-nav-links a[href="index.html#${id}"]`);
                if (targetLinks.length > 0) {
                    // Remove active from *other* anchor links first
                    document.querySelectorAll('.nav-links a[href^="#"], .nav-links a[href^="index.html#"], .mobile-nav-links a[href^="#"], .mobile-nav-links a[href^="index.html#"]').forEach(l => l.classList.remove('active'));
                    // Add active to the currently intersecting one
                    targetLinks.forEach(l => l.classList.add('active'));
                }
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(sec => observer.observe(sec));

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            if (backToTop) backToTop.classList.add('visible');
        } else {
            if (backToTop) backToTop.classList.remove('visible');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FORM VALIDATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function initFormValidation() {
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;

        const fname = document.getElementById('fname');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        [fname, email, message].forEach(field => {
            field.classList.remove('error');
            // Re-trigger animation by reflow if empty
            if (field.value.trim() === '') {
                void field.offsetWidth;
                field.classList.add('error');
                isValid = false;
            }
        });

        if (isValid) {
            successMsg.style.display = 'block';
            form.reset();
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 6000);
        }
    });
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   THEME TOGGLE ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    if (!themeBtn) return;

    const sunIcon = themeBtn.querySelector('.sun-icon');
    const moonIcon = themeBtn.querySelector('.moon-icon');

    const updateIcons = (isLight) => {
        if (isLight) {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    };

    // Check localStorage
    const savedTheme = localStorage.getItem('esafe_theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        updateIcons(true);
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('esafe_theme', isLight ? 'light' : 'dark');
        updateIcons(isLight);
    });
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HERO CANVAS ENGINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    const maxDistance = 120;
    const numParticles = 80;
    const mouseRadius = 150; // cursor interaction radius
    const mouseForce = 0.8;  // repulsion strength

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = document.querySelector('.hero').offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // baseline drift speed
            this.baseVx = (Math.random() - 0.5) * 1.5;
            this.baseVy = (Math.random() - 0.5) * 1.5;
            this.vx = this.baseVx;
            this.vy = this.baseVy;
            this.radius = Math.random() * 2 + 1;
            this.baseAlpha = Math.random() * 0.5 + 0.2;
            this.alpha = this.baseAlpha;
        }
        update() {
            // Smoothly return to baseline velocity
            this.vx += (this.baseVx - this.vx) * 0.05;
            this.vy += (this.baseVy - this.vy) * 0.05;

            // Cursor interaction: repel particles near the mouse
            const mouse = window._heroMouse;
            if (mouse && mouse.active) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouseRadius && dist > 0) {
                    const force = (1 - dist / mouseRadius) * mouseForce * 2;
                    this.vx += (dx / dist) * force;
                    this.vy += (dy / dist) * force;
                    // Brighten particles near cursor
                    this.alpha = Math.min(1, this.baseAlpha + (1 - dist / mouseRadius) * 0.5);
                } else {
                    this.alpha += (this.baseAlpha - this.alpha) * 0.05;
                }
            } else {
                this.alpha += (this.baseAlpha - this.alpha) * 0.05;
            }

            // Clamp maximum velocity during repulsion burst
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > 4) {
                this.vx = (this.vx / speed) * 4;
                this.vy = (this.vy / speed) * 4;
            }

            this.x += this.vx;
            this.y += this.vy;

            // Bounce off walls and invert baseline to keep them moving
            if (this.x < 0 || this.x > width) {
                this.vx *= -1;
                this.baseVx *= -1;
            }
            if (this.y < 0 || this.y > height) {
                this.vy *= -1;
                this.baseVy *= -1;
            }

            this.x = Math.max(0, Math.min(width, this.x));
            this.y = Math.max(0, Math.min(height, this.y));
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 184, 169, ${this.alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        const mouse = window._heroMouse;

        // Draw subtle glow at cursor position
        if (mouse && mouse.active) {
            const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouseRadius);
            gradient.addColorStop(0, 'rgba(0, 184, 169, 0.12)');
            gradient.addColorStop(1, 'rgba(0, 184, 169, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, mouseRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    let opacity = 1 - (distance / maxDistance);

                    // Brighten lines near the cursor
                    if (mouse && mouse.active) {
                        const midX = (particles[i].x + particles[j].x) / 2;
                        const midY = (particles[i].y + particles[j].y) / 2;
                        const dmx = midX - mouse.x;
                        const dmy = midY - mouse.y;
                        const mouseDist = Math.sqrt(dmx * dmx + dmy * dmy);
                        if (mouseDist < mouseRadius) {
                            opacity = Math.min(1, opacity + (1 - mouseDist / mouseRadius) * 0.4);
                        }
                    }

                    ctx.strokeStyle = `rgba(0, 184, 169, ${opacity * 0.5})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();

    // Scroll Fade Logic
    const scrollIndicator = document.querySelector('.scroll-indicator');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < 400) {
            const canvasOpacity = 1 - (scrollY / 400);
            canvas.style.opacity = scrollY > 200 ? canvasOpacity : 1;
            if (scrollIndicator) {
                const indOpacity = 1 - (scrollY / 100);
                scrollIndicator.style.opacity = scrollY > 100 ? 0 : (indOpacity > 1 ? 1 : indOpacity);
            }
        } else {
            canvas.style.opacity = 0;
            if (scrollIndicator) scrollIndicator.style.opacity = 0;
        }
    });
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   CUSTOM CURSOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function initCustomCursor() {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (isTouch) {
        if (cursorDot) cursorDot.style.display = 'none';
        if (cursorRing) cursorRing.style.display = 'none';
        return;
    }

    // Enable custom cursor styles
    document.body.classList.add('has-custom-cursor');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    // Follow mouse
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursorDot.style.setProperty('--x', `${mouseX}px`);
        cursorDot.style.setProperty('--y', `${mouseY}px`);
    });

    // Smooth lagging ring (LERP)
    const render = () => {
        ringX += (mouseX - ringX) * 0.08;
        ringY += (mouseY - ringY) * 0.08;

        cursorRing.style.setProperty('--x', `${ringX}px`);
        cursorRing.style.setProperty('--y', `${ringY}px`);
        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    // Dynamic hover bindings (re-runnable)
    window.bindCursorHoverControls = () => {
        const interactiveElements = document.querySelectorAll('a, button, .service-card, .cursor-interactive');

        interactiveElements.forEach(el => {
            // Remove existing listener to avoid duplicates if re-binding
            el.removeEventListener('mouseenter', window._cursorEnterHandler);
            el.removeEventListener('mouseleave', window._cursorLeaveHandler);

            window._cursorEnterHandler = () => document.body.classList.add('cursor-hover');
            window._cursorLeaveHandler = () => document.body.classList.remove('cursor-hover');

            el.addEventListener('mouseenter', window._cursorEnterHandler);
            el.addEventListener('mouseleave', window._cursorLeaveHandler);
        });
    };

    // Initial bind (with timeout to catch late renders if any)
    setTimeout(window.bindCursorHoverControls, 300);

    // Click states
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-clicking'));
    document.addEventListener('mouseup', () => document.body.classList.remove('cursor-clicking'));
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HEADER & NAVBAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function initNavbar() {
    const header = document.querySelector('header');

    // Scroll state
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Nav
    const hamburger = document.querySelector('.hamburger');
    const overlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (hamburger && overlay) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            overlay.classList.toggle('active');

            // Toggle body scroll
            if (overlay.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scroll for nav links
    const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-links a, .logo');
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#') && targetId !== '#') {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // 80px navbar offset
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            } else if (targetId === '#') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SCROLL REVEAL (Intersection Observer)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => observer.observe(el));
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ADVANCED INTERACTIVE EFFECTS (LERP PHYSICS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function initInteractiveEffects() {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    // Smooth Linear Interpolation helper
    const lerp = (start, end, factor) => start + (end - start) * factor;

    // 1. Magnetic Buttons with True Physics
    const magnets = document.querySelectorAll('.btn');
    magnets.forEach(btn => {
        let bounds = btn.getBoundingClientRect();
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        let isHovering = false;

        btn.addEventListener('mouseenter', () => {
            bounds = btn.getBoundingClientRect();
            isHovering = true;
            btn.classList.add('js-magnetic');
        });

        btn.addEventListener('mousemove', (e) => {
            mouseX = e.clientX - bounds.left - bounds.width / 2;
            mouseY = e.clientY - bounds.top - bounds.height / 2;
        });

        btn.addEventListener('mouseleave', () => {
            isHovering = false;
            mouseX = 0;
            mouseY = 0;
            btn.classList.remove('js-magnetic');
        });

        const animateMagnetic = () => {
            // Very smooth easing
            const ease = isHovering ? 0.12 : 0.08;
            currentX = lerp(currentX, mouseX, ease);
            currentY = lerp(currentY, mouseY, ease);

            // Apply standard CSS translate with JS physics offset
            const isMoving = Math.abs(currentX) > 0.01 || Math.abs(currentY) > 0.01;
            if (isHovering || isMoving) {
                const hoverLift = isHovering ? -3 : lerp(-3, 0, 0.1);
                btn.style.transform = `translate(${currentX * 0.4}px, translateY(${hoverLift}px) + ${currentY * 0.4}px)`;
                btn.style.transform = `translate3d(${currentX * 0.4}px, ${(isHovering ? -3 : 0) + currentY * 0.4}px, 0)`;
            } else {
                btn.style.transform = '';
            }
            requestAnimationFrame(animateMagnetic);
        };
        requestAnimationFrame(animateMagnetic);
    });

    // 2. 3D Tilt Cards with Smooth LERP & Spotlight
    const tiltCards = document.querySelectorAll('.service-card, .about-card, .why-pill');
    tiltCards.forEach(card => {
        let bounds = card.getBoundingClientRect();
        let targetRotateX = 0, targetRotateY = 0;
        let currentRotateX = 0, currentRotateY = 0;
        let isHovering = false;

        card.addEventListener('mouseenter', () => {
            bounds = card.getBoundingClientRect();
            isHovering = true;
        });

        card.addEventListener('mousemove', (e) => {
            const x = e.clientX - bounds.left;
            const y = e.clientY - bounds.top;

            // Set variables for CSS spotlight
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            const centerX = bounds.width / 2;
            const centerY = bounds.height / 2;

            // Premium, dense tilt limits (6 degrees max)
            targetRotateX = ((y - centerY) / centerY) * -6;
            targetRotateY = ((x - centerX) / centerX) * 6;
        });

        card.addEventListener('mouseleave', () => {
            isHovering = false;
            targetRotateX = 0;
            targetRotateY = 0;
        });

        const animateTilt = () => {
            const ease = 0.08; // Buttery smooth return
            currentRotateX = lerp(currentRotateX, targetRotateX, ease);
            currentRotateY = lerp(currentRotateY, targetRotateY, ease);

            const isMoving = Math.abs(currentRotateX) > 0.01 || Math.abs(currentRotateY) > 0.01;

            if (isHovering || isMoving) {
                const targetScale = isHovering ? 1.02 : 1;
                // JS handles rotation; we override standard transform
                card.style.transform = `perspective(1200px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale3d(${targetScale}, ${targetScale}, ${targetScale})`;
                card.style.transition = 'box-shadow 0.4s var(--ease-smooth), background-color 0.4s var(--ease-smooth)';
            } else {
                card.style.transform = '';
                card.style.transition = '';
            }

            requestAnimationFrame(animateTilt);
        };
        requestAnimationFrame(animateTilt);
    });
}
