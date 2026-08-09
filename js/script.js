// ============================================
// DKV Portfolio Script
// ============================================

// Navbar scroll effect
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Skill bars animation on scroll
const skillBars = document.querySelectorAll('.skill-bar-fill');

function animateSkillBars() {
    skillBars.forEach(bar => {
        const target = bar.getAttribute('data-width');
        const rect = bar.getBoundingClientRect();
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            bar.style.setProperty('--target', target);
            bar.classList.add('animate');
            bar.style.width = target;
        }
    });
}

// Scroll reveal animation
const revealElements = document.querySelectorAll('.timeline-card, .skill-card, .social-card');

function checkReveal() {
    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
            el.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', () => {
    animateSkillBars();
    checkReveal();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initial animations on load
document.addEventListener('DOMContentLoaded', () => {
    animateSkillBars();
    checkReveal();
});

// Add reveal class to elements for scroll animation
revealElements.forEach(el => {
    el.classList.add('reveal');
});

// Typing animation for hero title
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const originalHTML = heroTitle.innerHTML;
    let typed = false;
    
    const typeText = () => {
        if (typed) return;
        typed = true;
        // Text is already visible, just add a subtle animation
        heroTitle.style.animation = 'fadeInUp 0.8s ease';
    };
    
    setTimeout(typeText, 500);
}
