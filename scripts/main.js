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
});
=======
/**
 * NebulaHost - JavaScript Principal
 * Funcionalidades: FAQ acordeón, toggle de precios, scroll suave, header sticky, animación de partículas, etc.
 */

// ============================================
// Configuración de la Animación de Partículas
// ============================================
const particleConfig = {
    particleCount: 80,
    colors: ['#2563eb', '#10b981', '#3b82f6', '#06b6d4', '#8b5cf6'],
    minSize: 2,
    maxSize: 6,
    connectionDistance: 150,
    connectionOpacity: 0.3,
    connectionColor: 'rgba(37, 99, 235, 0.2)',
    speed: 0.5,
    mouseInfluence: 50
};

// ============================================
// Clase ParticleNetwork (Animación de Red de Partículas)
// ============================================
class ParticleNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.width = 0;
        this.height = 0;
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createParticles();
    }
    
    resize() {
        this.width = this.canvas.width = this.canvas.parentElement.clientWidth;
        this.height = this.canvas.height = this.canvas.parentElement.clientHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < particleConfig.particleCount; i++) {
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
        
        // Resize
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
    }
    
    drawParticle(particle) {
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = particle.color;
        this.ctx.fill();
        
        // Glow effect
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        this.ctx.strokeStyle = particle.color;
        this.ctx.strokeWidth = 0.5;
        this.ctx.globalAlpha = 0.3;
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
            this.ctx.lineWidth = 0.5;
            this.ctx.globalAlpha = particleConfig.connectionOpacity * (1 - distance / particleConfig.connectionDistance);
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
        }
    }
    
    update() {
        this.particles.forEach(particle => {
            // Movimiento base con efecto de onda
            particle.x += particle.vx + Math.sin(Date.now() * 0.001 + particle.baseX * 0.01) * 0.2;
            particle.y += particle.vy + Math.cos(Date.now() * 0.001 + particle.baseY * 0.01) * 0.2;
            
            // Efecto de mouse
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < particleConfig.mouseInfluence) {
                const force = particleConfig.mouseInfluence / distance;
                particle.x -= dx / force;
                particle.y -= dy / force;
            }
            
            // Rebotar en los bordes
            if (particle.x < 0 || particle.x > this.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.height) particle.vy *= -1;
            
            // Volver a la posición base lentamente
            particle.x = particle.x * 0.98 + particle.baseX * 0.02;
            particle.y = particle.y * 0.98 + particle.baseY * 0.02;
        });
    }
    
    draw() {
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Dibujar conexiones
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                this.drawConnection(this.particles[i], this.particles[j]);
            }
        }
        
        // Dibujar partículas
        this.particles.forEach(particle => this.drawParticle(particle));
    }
    
    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
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
        // Esperar a que el canvas tenga tamaño
        setTimeout(() => {
            new ParticleNetwork(canvas);
        }, 100);
    }
}============================================
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
});

// ============================================
// Header Sticky
// ============================================
function initHeader() {
    const header = document.querySelector('.header');
    
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
    const header = document.querySelector('.header');
    
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
            // Actualizar estado de los botones
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Actualizar precios
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
            
            // Cerrar todas las respuestas
            faqItems.forEach(i => {
                i.querySelector('.faq-answer')?.classList.remove('active');
                i.querySelector('.faq-toggle i')?.classList.remove('fa-minus');
                i.querySelector('.faq-toggle i')?.classList.add('fa-plus');
            });
            
            // Abrir/Cerrar la respuesta actual
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
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll', 'animated');
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
// Animación de contador (opcional para estadísticas)
// ============================================
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// ============================================
// Inicializar animaciones al hacer scroll
// ============================================
window.addEventListener('scroll', () => {
    // Puedes añadir más animaciones aquí si es necesario
});

// ============================================
// Función para mostrar notificaciones (opcional)
// ============================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// Validación de formulario (si se añade en el futuro)
// ============================================
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ef4444';
        } else {
            input.style.borderColor = '';
        }
    });
    
    return isValid;
}

// ============================================
// Event Listeners para botones de contacto
// ============================================
document.addEventListener('click', (e) => {
    // Ejemplo: Trackear clics en botones de "Contratar"
    if (e.target.closest('.btn') && e.target.closest('.pricing-card')) {
        const planName = e.target.closest('.pricing-card').querySelector('h3')?.textContent || 'Plan';
        console.log(`Clic en Contratar: ${planName}`);
        // Aquí podrías enviar un evento a Google Analytics
    }
});

// ============================================
// Consola de bienvenida (opcional)
// ============================================
console.log('%c🚀 NebulaHost', 'color: #2563eb; font-size: 20px; font-weight: bold;');
console.log('%cHosting de Alto Rendimiento', 'color: #10b981; font-size: 14px;');
