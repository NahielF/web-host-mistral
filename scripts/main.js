/**
 * NebulaHost - JavaScript Principal
 * Funcionalidades: FAQ acordeón, toggle de precios, scroll suave, header sticky, animación de partículas, etc.
 */

// ============================================
// Configuración de la Animación de Partículas
// ============================================
const particleConfig = {
    particleCount: 60,          // Reducido para mejor rendimiento
    colors: ['#2563eb', '#10b981', '#3b82f6', '#06b6d4', '#8b5cf6'],
    minSize: 1.5,
    maxSize: 4,
    connectionDistance: 120,    // Reducido para menos conexiones
    connectionOpacity: 0.2,
    connectionColor: 'rgba(37, 99, 235, 0.15)',
    speed: 0.3,
    mouseInfluence: 40,
    density: 0.5               // Para ajustar densidad en móviles
};

// ============================================
// Clase ParticleNetwork (Animación de Red de Partículas)
// ============================================
class ParticleNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.touch = { x: null, y: null };
        this.width = 0;
        this.height = 0;
        this.animationId = null;
        this.lastTime = 0;
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.startAnimation();
    }
    
    resize() {
        if (!this.canvas.parentElement) return;
        this.width = this.canvas.parentElement.clientWidth;
        this.height = this.canvas.parentElement.clientHeight;
        
        // Usar devicePixelRatio para alta resolución
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.ctx.scale(dpr, dpr);
    }
    
    createParticles() {
        this.particles = [];
        const count = Math.floor(particleConfig.particleCount * particleConfig.density);
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * (particleConfig.maxSize - particleConfig.minSize) + particleConfig.minSize,
                color: particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)],
                vx: (Math.random() - 0.5) * particleConfig.speed,
                vy: (Math.random() - 0.5) * particleConfig.speed,
                baseX: Math.random() * this.width,
                baseY: Math.random() * this.height
            });
        }
    }
    
    bindEvents() {
        // Mouse move
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        // Mouse leave
        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        
        // Touch support
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.touch.x = touch.clientX - rect.left;
            this.touch.y = touch.clientY - rect.top;
        });
        
        this.canvas.addEventListener('touchend', () => {
            this.touch.x = null;
            this.touch.y = null;
        });
        
        // Resize con debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resize();
                this.createParticles();
            }, 250);
        });
        
        // Visibilidad de la página
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAnimation();
            } else {
                this.startAnimation();
            }
        });
    }
    
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
        
        // Glow effect
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
        this.ctx.strokeStyle = particle.color;
        this.ctx.strokeWidth = 0.3;
        this.ctx.globalAlpha = 0.2;
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }
    
    drawConnection(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < particleConfig.connectionDistance) {
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = particleConfig.connectionColor;
            this.ctx.lineWidth = 0.3;
            this.ctx.globalAlpha = particleConfig.connectionOpacity * (1 - distance / particleConfig.connectionDistance);
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        }
    }
    
    update(timeElapsed) {
        const mouse = this.mouse.x !== null ? this.mouse : this.touch;
        
        this.particles.forEach(particle => {
            // Movimiento base con efecto de onda suave
            particle.x += particle.vx + Math.sin(timeElapsed * 0.0005 + particle.baseX * 0.01) * 0.15;
            particle.y += particle.vy + Math.cos(timeElapsed * 0.0005 + particle.baseY * 0.01) * 0.15;
            
            // Efecto de mouse/touch
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < particleConfig.mouseInfluence) {
                    const force = (particleConfig.mouseInfluence - distance) / particleConfig.mouseInfluence;
                    particle.x -= dx * force * 0.1;
                    particle.y -= dy * force * 0.1;
                }
            }
            
            // Rebotar en los bordes con amortiguación
            if (particle.x < 0) {
                particle.x = 0;
                particle.vx *= -0.7;
            } else if (particle.x > this.width) {
                particle.x = this.width;
                particle.vx *= -0.7;
            }
            
            if (particle.y < 0) {
                particle.y = 0;
                particle.vy *= -0.7;
            } else if (particle.y > this.height) {
                particle.y = this.height;
                particle.vy *= -0.7;
            }
            
            // Volver a la posición base lentamente (efecto de gravedad)
            particle.x = particle.x * 0.99 + particle.baseX * 0.01;
            particle.y = particle.y * 0.99 + particle.baseY * 0.01;
        });
    }
    
    draw() {
        // Limpiar canvas con color de fondo
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Dibujar conexiones (optimizado: solo calcular una vez por frame)
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                this.drawConnection(this.particles[i], this.particles[j]);
            }
        }
        
        // Dibujar partículas
        this.particles.forEach(particle => this.drawParticle(particle));
    }
    
    startAnimation() {
        if (this.animationId) return;
        this.lastTime = performance.now();
        const animate = (currentTime) => {
            const timeElapsed = currentTime - this.lastTime;
            this.lastTime = currentTime;
            
            this.update(timeElapsed);
            this.draw();
            this.animationId = requestAnimationFrame(animate);
        };
        this.animationId = requestAnimationFrame(animate);
    }
    
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    destroy() {
        this.stopAnimation();
        this.canvas.removeEventListener('mousemove', this.handleMouseMove);
        this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
        this.canvas.removeEventListener('touchmove', this.handleTouchMove);
        this.canvas.removeEventListener('touchend', this.handleTouchEnd);
        window.removeEventListener('resize', this.handleResize);
    }
}

// ============================================
// DOM Content Loaded
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initMobileMenu();
    initPricingToggle();
    initFAQ();
    initBackToTop();
    initScrollAnimations();
    initSmoothScroll();
    initParticleNetwork();
});

// ============================================
// Inicializar Animación de Partículas
// ============================================
function initParticleNetwork() {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        // Asegurar que el contenedor tenga tamaño
        const container = canvas.parentElement;
        if (container) {
            container.style.position = 'absolute';
            container.style.top = '0';
            container.style.left = '0';
            container.style.width = '100%';
            container.style.height = '100%';
        }
        
        // Inicializar con un pequeño delay para evitar problemas de carga
        requestAnimationFrame(() => {
            window.particleNetwork = new ParticleNetwork(canvas);
        });
    }
}

// ============================================
// Header Sticky
// ============================================
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ============================================
// Mobile Menu
// ============================================
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    
    if (!mobileMenuBtn || !navList) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        navList.classList.toggle('active');
        mobileMenuBtn.innerHTML = navList.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', () => {
            navList.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!navList.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navList.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

// ============================================
// Pricing Toggle (Mensual/Anual)
// ============================================
function initPricingToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const priceAmounts = document.querySelectorAll('.price-amount');
    
    if (!toggleBtns.length || !priceAmounts.length) return;
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const period = btn.dataset.period;
            priceAmounts.forEach(amount => {
                amount.textContent = amount.dataset[period];
            });
        });
    });
}

// ============================================
// FAQ Acordeón
// ============================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        if (!question || !answer || !toggle) return;
        
        question.addEventListener('click', () => {
            const isActive = answer.classList.contains('active');
            
            faqItems.forEach(i => {
                i.querySelector('.faq-answer')?.classList.remove('active');
                i.querySelector('.faq-toggle i')?.classList.remove('fa-minus');
                i.querySelector('.faq-toggle i')?.classList.add('fa-plus');
            });
            
            if (!isActive) {
                answer.classList.add('active');
                toggle.querySelector('i').classList.remove('fa-plus');
                toggle.querySelector('i').classList.add('fa-minus');
            }
        });
    });
}

// ============================================
// Back to Top Button
// ============================================
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// Scroll Animations
// ============================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.service-card, .pricing-card, .feature-card, .testimonial-card, .section-header'
    );
    
    if (!animatedElements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// ============================================
// Smooth Scroll para enlaces internos
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// Consola de bienvenida
// ============================================
console.log('%c🚀 NebulaHost', 'color: #2563eb; font-size: 20px; font-weight: bold; font-family: "Space Mono", monospace;');
console.log('%cHosting de Alto Rendimiento', 'color: #10b981; font-size: 14px; font-family: "Space Mono", monospace;');
