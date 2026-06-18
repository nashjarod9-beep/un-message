/* ============================================================
   PARTICLE / BOKEH SYSTEM
   Soft luminous particles drifting across the background
   ============================================================ */
(function () {
    'use strict';

    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let particles = [];
    let animationId;

    // --- Configuration ---
    const CONFIG = {
        count: 45,
        minRadius: 1.5,
        maxRadius: 4.5,
        minSpeed: 0.08,
        maxSpeed: 0.35,
        colors: [
            'hsla(265, 45%, 55%, 0.35)',  // violet
            'hsla(220, 55%, 50%, 0.3)',   // blue
            'hsla(42, 60%, 60%, 0.25)',   // gold
            'hsla(0, 0%, 90%, 0.2)',      // off-white
            'hsla(265, 35%, 70%, 0.2)',   // light violet
        ],
    };

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function createParticle() {
        return {
            x: random(0, width),
            y: random(0, height),
            radius: random(CONFIG.minRadius, CONFIG.maxRadius),
            color: CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)],
            vx: random(-CONFIG.maxSpeed, CONFIG.maxSpeed),
            vy: random(-CONFIG.maxSpeed, -CONFIG.minSpeed),  // drift upward
            opacity: random(0.3, 0.9),
            opacityDir: random(0.001, 0.004) * (Math.random() > 0.5 ? 1 : -1),
            pulse: random(0, Math.PI * 2),
            pulseSpeed: random(0.005, 0.02),
        };
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < CONFIG.count; i++) {
            particles.push(createParticle());
        }
    }

    function updateParticle(p) {
        p.x += p.vx;
        p.y += p.vy;

        // Pulse opacity
        p.pulse += p.pulseSpeed;
        p.opacity += p.opacityDir;
        if (p.opacity >= 0.9 || p.opacity <= 0.15) {
            p.opacityDir *= -1;
        }

        // Wrap around screen
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
    }

    function drawParticle(p) {
        const r = p.radius + Math.sin(p.pulse) * 0.6;
        const alpha = Math.max(0.05, Math.min(1, p.opacity));

        // Outer glow
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
        gradient.addColorStop(0, p.color.replace(/[\d.]+\)$/, (alpha * 0.5) + ')'));
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, alpha + ')');
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (const p of particles) {
            updateParticle(p);
            drawParticle(p);
        }
        animationId = requestAnimationFrame(animate);
    }

    // Init
    resize();
    initParticles();
    animate();

    // Responsive resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resize();
            // Re-spread particles on resize
            for (const p of particles) {
                if (p.x > width) p.x = random(0, width);
                if (p.y > height) p.y = random(0, height);
            }
        }, 150);
    });

    // Pause when tab is hidden for performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animationId = requestAnimationFrame(animate);
        }
    });
})();


/* ============================================================
   FADE-UP REVEAL ON LOAD
   ============================================================ */
(function () {
    'use strict';

    // Small delay to ensure CSS transitions are ready
    window.addEventListener('DOMContentLoaded', () => {
        // Trigger fade-up animations after a brief moment
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const elements = document.querySelectorAll('.fade-up');
                elements.forEach(el => {
                    el.classList.add('visible');
                });
            });
        });
    });
})();
