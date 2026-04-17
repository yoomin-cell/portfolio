/* ===========================================
   PM 포트폴리오 JavaScript
   - 파티클 캔버스 애니메이션
   - 타이핑 효과
   - 네비게이션 스크롤 효과
   - 프로젝트 필터
   - 스크롤 등장 애니메이션
   =========================================== */

/* ✏️ 타이핑 애니메이션에서 순서대로 표시될 역할/키워드를 수정하세요 */
const TYPING_WORDS = [
  'Project Manager',
  '프로덕트 매니저',
  '팀 리더',
  '문제 해결사',
  '로드맵 설계자',
];

/* =====================
   타이핑 효과
   ===================== */
(function initTyping() {
  const el = document.getElementById('typingText');
  if (!el) return;

  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const SPEED_TYPE = 80;
  const SPEED_DELETE = 45;
  const PAUSE_AFTER_WORD = 1600;

  function tick() {
    const word = TYPING_WORDS[wordIdx];
    if (isDeleting) {
      charIdx--;
      el.textContent = word.slice(0, charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % TYPING_WORDS.length;
        setTimeout(tick, 400);
      } else {
        setTimeout(tick, SPEED_DELETE);
      }
    } else {
      charIdx++;
      el.textContent = word.slice(0, charIdx);
      if (charIdx === word.length) {
        isDeleting = true;
        setTimeout(tick, PAUSE_AFTER_WORD);
      } else {
        setTimeout(tick, SPEED_TYPE);
      }
    }
  }

  setTimeout(tick, 1200);
})();

/* =====================
   파티클 캔버스
   ===================== */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, mouse = { x: -9999, y: -9999 };
  const PARTICLE_COUNT = 70;
  const MAX_DIST = 140;
  const MOUSE_RADIUS = 180;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomBetween(a, b) { return Math.random() * (b - a) + a; }

  function createParticle() {
    return {
      x: randomBetween(0, W),
      y: randomBetween(0, H),
      vx: randomBetween(-0.25, 0.25),
      vy: randomBetween(-0.25, 0.25),
      r: randomBetween(1.5, 3),
      alpha: randomBetween(0.3, 0.8),
    };
  }

  function initParticleArray() {
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      // 마우스 반응
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS) {
        const force = (1 - dist / MOUSE_RADIUS) * 0.6;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      p.x += p.vx;
      p.y += p.vy;
      // 속도 감쇠
      p.vx *= 0.99;
      p.vy *= 0.99;
      // 경계 처리
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // 점 그리기
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124, 95, 245, ${p.alpha * 0.7})`;
      ctx.fill();
    });

    // 연결선 그리기
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const opacity = (1 - d / MAX_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(79, 195, 247, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); initParticleArray(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  resize();
  initParticleArray();
  draw();
})();

/* =====================
   네비게이션 스크롤 효과
   ===================== */
(function initNav() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    // 링크 클릭 시 모바일 메뉴 닫기
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }
})();

/* =====================
   프로젝트 카드 필터
   ===================== */
(function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          // 다시 나타날 때 애니메이션
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = '';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* =====================
   스크롤 등장 애니메이션 (Intersection Observer)
   ===================== */
(function initReveal() {
  // 등장 효과를 줄 요소들을 지정
  const targetSelectors = [
    '.about-text',
    '.about-card',
    '.skill-category',
    '.project-card',
    '.contact-card',
    '.section-title',
    '.contact-sub',
  ];
  const targets = document.querySelectorAll(targetSelectors.join(', '));

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();
