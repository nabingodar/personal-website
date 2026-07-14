// ==========================================================================
// NABIN GODAR — site scripts
// ==========================================================================

/* Mobile nav toggle */
(function initNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* Scroll reveal */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  items.forEach((el) => observer.observe(el));
})();

/* Format a date like "14 Jul 2026" */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* Build one passport-stamp blog card */
function blogCardHTML(post) {
  return `
    <a class="blog-card reveal" href="${post.url}">
      <img src="${post.coverImage}" alt="${post.title}" loading="lazy" />
      <div class="blog-card-body">
        <div class="stamp">
          <span class="stamp-loc">${post.location}</span>
          <span class="stamp-date">${formatDate(post.date)}</span>
        </div>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
      </div>
    </a>
  `;
}

/* Render homepage preview (latest 3) and/or full blog index */
async function renderBlogPosts() {
  const previewGrid = document.getElementById('blogPreview');
  const fullGrid = document.getElementById('blogGrid');
  if (!previewGrid && !fullGrid) return;

  try {
    // posts.json lives at the site root; adjust path if we're inside /blog/
    const base = window.location.pathname.includes('/blog/') ? '../' : '';
    const res = await fetch(`${base}posts.json`);
    const posts = await res.json();
    const sorted = posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (previewGrid) {
      previewGrid.innerHTML = sorted.slice(0, 3).map(blogCardHTML).join('');
    }
    if (fullGrid) {
      fullGrid.innerHTML = sorted.map(blogCardHTML).join('');
    }

    // Newly injected cards need to be observed for reveal + fixed image path
    document.querySelectorAll('.blog-card.reveal').forEach((el) => {
      if (window.location.pathname.includes('/blog/')) {
        const img = el.querySelector('img');
        if (img && !img.getAttribute('src').startsWith('../')) {
          img.setAttribute('src', '../' + img.getAttribute('src'));
        }
      }
      el.classList.add('is-visible');
    });
  } catch (err) {
    console.error('Could not load posts.json', err);
  }
}

document.addEventListener('DOMContentLoaded', renderBlogPosts);
