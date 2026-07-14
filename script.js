// ==========================================================================
// NABIN GODAR — Enhanced Site Scripts
// ==========================================================================

/* =========================================================================
   HEADER SCROLL EFFECT
   ========================================================================= */
(function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
})();

/* =========================================================================
   MOBILE NAVIGATION TOGGLE
   ========================================================================= */
(function initNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  // Toggle menu on button click
  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is clicked
  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.site-header')) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

/* =========================================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================================= */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .timeline-card, .blog-card, .about-image, .about-content');
  if (!reveals.length) return;

  if (!('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.style.opacity = '1');
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
})();

/* =========================================================================
   SMOOTH SCROLL BEHAVIOR FOR ANCHOR LINKS
   ========================================================================= */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* =========================================================================
   UTILITY: Format Date
   ========================================================================= */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/* =========================================================================
   BUILD BLOG CARD HTML
   ========================================================================= */
function blogCardHTML(post) {
  return `
    <a class="blog-card" href="${post.url}">
      <div class="blog-card-image">
        <img src="${post.coverImage}" alt="${post.title}" loading="lazy" />
      </div>
      <div class="blog-card-content">
        <span class="blog-date">${formatDate(post.date)}</span>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <div class="blog-card-footer">
          <span class="blog-location">${post.location}</span>
          <span class="blog-arrow">→</span>
        </div>
      </div>
    </a>
  `;
}

/* =========================================================================
   RENDER BLOG POSTS FROM posts.json
   ========================================================================= */
async function renderBlogPosts() {
  const previewGrid = document.getElementById('blogPreview');
  const fullGrid = document.getElementById('blogGrid');
  if (!previewGrid && !fullGrid) return;

  try {
    // Detect if we're in /blog/ subdirectory
    const base = window.location.pathname.includes('/blog/') ? '../' : '';
    const res = await fetch(`${base}posts.json`);
    
    if (!res.ok) {
      console.warn('Could not load posts.json');
      return;
    }

    const posts = await res.json();
    const sorted = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Render preview (first 3 posts) on homepage
    if (previewGrid) {
      previewGrid.innerHTML = sorted.slice(0, 3).map(blogCardHTML).join('');
    }

    // Render full list on blog page
    if (fullGrid) {
      fullGrid.innerHTML = sorted.map(blogCardHTML).join('');
    }

    // Trigger scroll reveal for newly added cards
    document.querySelectorAll('.blog-card').forEach((card) => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    });

  } catch (err) {
    console.error('Error loading blog posts:', err);
  }
}

/* =========================================================================
   PARALLAX SCROLL EFFECT (Optional - Premium feature)
   ========================================================================= */
(function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (!parallaxElements.length) return;

  window.addEventListener('scroll', () => {
    parallaxElements.forEach((el) => {
      const scrollPos = window.scrollY;
      const elementPos = el.getBoundingClientRect().top + scrollPos;
      const distance = scrollPos - elementPos;
      const offset = distance * 0.5;
      el.style.transform = `translateY(${offset}px)`;
    });
  }, { passive: true });
})();

/* =========================================================================
   ACTIVE NAVIGATION LINK HIGHLIGHTING
   ========================================================================= */
(function initActiveNav() {
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
})();

/* =========================================================================
   ACCESSIBILITY: FOCUS VISIBLE MANAGEMENT
   ========================================================================= */
(function initAccessibility() {
  // Add focus-visible class for keyboard navigation
  document.addEventListener('keydown', () => {
    document.body.classList.add('keyboard-nav');
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
})();

/* =========================================================================
   PERFORMANCE: LAZY LOADING FOR IMAGES
   ========================================================================= */
(function initLazyLoad() {
  if (!('IntersectionObserver' in window)) return;

  const images = document.querySelectorAll('img[loading="lazy"]');
  if (!images.length) return;

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.removeAttribute('loading');
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
})();

/* =========================================================================
   INITIALIZE ON DOM READY
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
  renderBlogPosts();
  
  // Add animation delay stagger for timeline cards
  const timelineCards = document.querySelectorAll('.timeline-card');
  timelineCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  // Add animation delay stagger for blog cards
  const blogCards = document.querySelectorAll('.blog-card');
  blogCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
});

/* =========================================================================
   DETECT REDUCED MOTION PREFERENCE
   ========================================================================= */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.scrollBehavior = 'auto';
  document.querySelectorAll('*').forEach((el) => {
    el.style.animation = 'none !important';
    el.style.transition = 'none !important';
  });
}
