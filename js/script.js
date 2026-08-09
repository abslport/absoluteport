/* ============================================
   CONFIG & DATA
============================================ */
const SKILLS_DATA = [
  { name: 'HTML5', icon: '🌐', level: 95, color: '#e34f26' },
  { name: 'CSS3', icon: '🎨', level: 90, color: '#1572b6' },
  { name: 'JavaScript', icon: '⚡', level: 92, color: '#f7df1e' },
  { name: 'React', icon: '⚛️', level: 88, color: '#61dafb' },
  { name: 'Vue.js', icon: '💚', level: 75, color: '#42b883' },
  { name: 'Node.js', icon: '🚀', level: 80, color: '#339933' },
  { name: 'TypeScript', icon: '🔷', level: 78, color: '#3178c6' },
  { name: 'Python', icon: '🐍', level: 70, color: '#3776ab' },
  { name: 'Git', icon: '🔀', level: 90, color: '#f05032' },
  { name: 'Docker', icon: '🐳', level: 72, color: '#2496ed' },
  { name: 'UI/UX', icon: '🎯', level: 85, color: '#ff6b6b' },
  { name: 'MongoDB', icon: '🍃', level: 68, color: '#47a248' },
];

const PROJECTS_DATA = [
  {
    title: 'NeuraTech Dashboard',
    category: 'Web App',
    desc: 'Dashboard analitik real-time dengan visualisasi data yang memukau menggunakan React & D3.js.',
    tags: ['React', 'D3.js', 'Node.js'],
    gradient: 'linear-gradient(135deg, #6366f1, #a855f7)',
  },
  {
    title: 'EcoMarketplace',
    category: 'E-Commerce',
    desc: 'Platform marketplace ramah lingkungan dengan fitur gamification dan pembayaran digital.',
    tags: ['Next.js', 'MongoDB', 'Stripe'],
    gradient: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
  },
  {
    title: 'FitTrack Pro',
    category: 'Mobile App',
    desc: 'Aplikasi fitness tracking dengan AI-based workout recommendations dan komunitas sosial.',
    tags: ['React Native', 'Firebase', 'AI'],
    gradient: 'linear-gradient(135deg, #ec4899, #f97316)',
  },
  {
    title: 'DevCollab',
    category: 'SaaS',
    desc: 'Platform kolaborasi developer dengan real-time code review dan integrasi CI/CD.',
    tags: ['Vue.js', 'WebSocket', 'Docker'],
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
  },
  {
    title: 'TravelBloom',
    category: 'Website',
    desc: 'Platform discovery destinasi wisata dengan immersive 3D experience dan itinerary planner.',
    tags: ['Three.js', 'React', 'GraphQL'],
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  },
  {
    title: 'ChatVerse AI',
    category: 'AI Application',
    desc: 'AI chatbot assistant dengan natural language processing dan multi-language support.',
    tags: ['OpenAI', 'Python', 'FastAPI'],
    gradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)',
  },
];

/* ============================================
   PRELOADER
============================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 800);
});

/* ============================================
   CUSTOM CURSOR
============================================ */
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (window.matchMedia('(pointer: fine)').matches) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effects on interactive elements
  const hoverTargets = 'a, button, .btn, .social-icon, .skill-card, .project-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursorRing.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursorRing.classList.remove('hovering');
    }
  });
}

/* ============================================
   NAVBAR SCROLL
============================================ */
const navbar = document.getElementById('navbar');
const backTop = document.getElementById('backTop');

function handleScroll() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  if (window.scrollY > 500) {
    backTop.classList.add('visible');
  } else {
    backTop.classList.remove('visible');
  }
}

window.addEventListener('scroll', handleScroll);
handleScroll();

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================
   MOBILE MENU
============================================ */
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

/* ============================================
   TYPEWRITER EFFECT
============================================ */
const typewriterEl = document.getElementById('typewriter');
const roles = [
  'Full-Stack Developer',
  'Frontend Engineer',
  'UI/UX Enthusiast',
  'Creative Problem Solver',
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentRole = roles[roleIndex];
  const currentText = currentRole.substring(0, charIndex);

  typewriterEl.textContent = currentText;

  if (!isDeleting && charIndex < currentRole.length) {
    charIndex++;
    setTimeout(typeEffect, 70);
  } else if (!isDeleting && charIndex === currentRole.length) {
    setTimeout(() => {
      isDeleting = true;
      typeEffect();
    }, 2000);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeEffect, 35);
  } else {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeEffect, 300);
  }
}

typeEffect();

/* ============================================
   RENDER SKILLS
============================================ */
const skillsGrid = document.querySelector('.skills-grid');

SKILLS_DATA.forEach((skill, index) => {
  const card = document.createElement('div');
  card.className = 'skill-card reveal';
  card.style.transitionDelay = `${(index % 4) * 0.1}s`;

  card.innerHTML = `
    <div class="skill-icon" style="background: ${skill.color}">
      ${skill.icon}
    </div>
    <h4 class="skill-name">${skill.name}</h4>
    <div class="skill-level">
      <div class="skill-level-fill" style="--level: ${skill.level}%"></div>
    </div>
  `;

  skillsGrid.appendChild(card);
});

/* ============================================
   RENDER PROJECTS
============================================ */
const projectsGrid = document.querySelector('.projects-grid');

PROJECTS_DATA.forEach((project, index) => {
  const card = document.createElement('div');
  card.className = 'project-card reveal';
  card.style.transitionDelay = `${(index % 3) * 0.1}s`;

  card.innerHTML = `
    <div class="project-thumb">
      <div class="project-thumb-bg" style="background: ${project.gradient}"></div>
      <div class="project-overlay"></div>
    </div>
    <div class="project-info">
      <p class="project-category">${project.category}</p>
      <h3 class="project-title">${project.title}</h3>
      <p class="project-desc">${project.desc}</p>
      <div class="project-tags">
        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
      </div>
    </div>
  `;

  projectsGrid.appendChild(card);
});

/* ============================================
   REVEAL ON SCROLL
============================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Animate skill level fill
      const skillFill = entry.target.querySelector('.skill-level-fill');
      if (skillFill) {
        setTimeout(() => {
          skillFill.classList.add('animated');
        }, 200);
      }

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

/* ============================================
   PARALLAX EFFECT ON HERO ORBS
============================================ */
const orbs = document.querySelectorAll('.orb');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  orbs.forEach((orb, index) => {
    const speed = (index + 1) * 0.1;
    orb.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

/* ============================================
   ACTIVE NAV LINK HIGHLIGHT
============================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const activeId = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${activeId}`
          ? 'var(--text-primary)'
          : '';
      });
    }
  });
}, { threshold: 0.3 });

sections.forEach(section => navObserver.observe(section));

/* ============================================
   FOOTER YEAR
============================================ */
document.getElementById('year').textContent = new Date().getFullYear();
