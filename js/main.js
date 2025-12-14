/**
 * HealthTrack AI - Main JavaScript
 * Мобільне меню, валідація форм, інтерактивність
 */

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initHeaderScroll();
    initForms();
    initFormValidation();
    initDateInputs();
    initMoodSelector();
    initSmoothScroll();
    initActiveNav();
});

/**
 * Мобільне меню (бургер)
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const body = document.body;
    
    if (!menuToggle || !nav) return;
    
    // Створюємо overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        overlay.classList.toggle('active');
        body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });
    
    overlay.addEventListener('click', closeMenu);
    nav.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => e.key === 'Escape' && nav.classList.contains('active') && closeMenu());
    
    function closeMenu() {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    }
}

/**
 * Header scroll effect
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.pageYOffset > 50));
}

/**
 * Активне посилання
 */
function initActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) link.classList.add('active');
    });
}

/**
 * Форми
 */
function initForms() {
    const confirmPassword = document.querySelector('#confirm-password');
    const password = document.querySelector('#password');
    
    if (password && confirmPassword) {
        confirmPassword.addEventListener('input', function() {
            const match = this.value === password.value;
            this.setCustomValidity(match ? '' : 'Паролі не співпадають');
            this.classList.toggle('is-invalid', !match);
            this.classList.toggle('is-valid', match && this.value);
        });
        password.addEventListener('input', function() {
            if (confirmPassword.value) {
                const match = confirmPassword.value === this.value;
                confirmPassword.setCustomValidity(match ? '' : 'Паролі не співпадають');
                confirmPassword.classList.toggle('is-invalid', !match);
                confirmPassword.classList.toggle('is-valid', match);
            }
        });
    }

    document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        if (this.checkValidity()) {
            showToast('Дякуємо за повідомлення!', 'success');
            this.reset();
            this.querySelectorAll('.form-control').forEach(i => i.classList.remove('is-valid', 'is-invalid'));
        }
    });

    document.querySelector('.data-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        if (this.checkValidity()) {
            showToast('Дані збережено!', 'success');
            setTimeout(() => window.location.href = 'dashboard.html', 1500);
        }
    });

    document.querySelectorAll('.profile-form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (this.checkValidity()) showToast('Зміни збережено!', 'success');
        });
    });
    
    document.querySelector('.danger-zone .btn-danger')?.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Видалити акаунт? Ця дія незворотна!')) {
            showToast('Акаунт видалено', 'danger');
            setTimeout(() => window.location.href = 'index.html', 1500);
        }
    });
}

/**
 * Валідація в реальному часі
 */
function initFormValidation() {
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('blur', function() { if (this.value.trim()) validateField(this); });
        input.addEventListener('input', function() { if (this.classList.contains('is-invalid')) validateField(this); });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let valid = true;
    
    if (field.required && !value) valid = false;
    else if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) valid = false;
    else if (field.minLength > 0 && value.length < field.minLength) valid = false;
    else if (field.type === 'number' && value) {
        const n = parseFloat(value);
        if ((field.min && n < +field.min) || (field.max && n > +field.max)) valid = false;
    }
    else if (!field.validity.valid) valid = false;
    
    field.classList.toggle('is-invalid', !valid);
    field.classList.toggle('is-valid', valid && value);
    return valid;
}

/**
 * Toast
 */
function showToast(message, type = 'info') {
    document.querySelectorAll('.toast').forEach(el => el.remove());
    
    const colors = {
        success: { bg: '#E8F5F0', border: '#16C79A' },
        danger: { bg: '#FFE5E5', border: '#FF6B6B' },
        warning: { bg: '#FFF8E5', border: '#FFD93D' },
        info: { bg: '#E5F0FF', border: '#4A90D9' }
    };
    const c = colors[type] || colors.info;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span><button onclick="this.parentElement.remove()">&times;</button>`;
    Object.assign(toast.style, {
        position: 'fixed', top: '100px', right: '20px', padding: '16px 20px',
        borderRadius: '10px', backgroundColor: c.bg, borderLeft: '4px solid ' + c.border,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center',
        gap: '12px', zIndex: '9999', animation: 'slideIn .3s ease', maxWidth: '90vw'
    });
    toast.querySelector('button').style.cssText = 'background:none;border:none;font-size:20px;cursor:pointer;opacity:.7;padding:0';
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'slideOut .3s ease'; setTimeout(() => toast.remove(), 300); }, 4000);
}

// Toast animations
const toastStyle = document.createElement('style');
toastStyle.textContent = '@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}';
document.head.appendChild(toastStyle);

/**
 * Дата/час
 */
function initDateInputs() {
    const dateInput = document.getElementById('date');
    if (dateInput && !dateInput.value) dateInput.value = new Date().toISOString().split('T')[0];
    const timeInput = document.getElementById('time');
    if (timeInput && !timeInput.value) {
        const now = new Date();
        timeInput.value = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
    }
}

/**
 * Mood selector
 */
function initMoodSelector() {
    document.querySelectorAll('.mood-option').forEach(opt => {
        opt.addEventListener('click', function() {
            const radio = this.previousElementSibling;
            if (radio?.type === 'radio') radio.checked = true;
        });
    });
}

/**
 * Smooth scroll
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
        });
    });
}
