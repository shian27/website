// ==========================================================================
// VIOLET GRACE — Film page interactions
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById('scrollProgress');
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---------- Mobile menu ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  function setMenu(open) {
    mobileMenu.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  navToggle.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
  mobileMenuClose.addEventListener('click', () => setMenu(false));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Autoplay project videos as they scroll into view ----------
     Works identically on mobile and desktop (unlike a hover-only approach,
     which has no equivalent on touch devices). Plays once a video is
     roughly half visible, pauses once it's mostly scrolled away. */
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.project-video video').forEach(video => {
    videoObserver.observe(video);
  });

  /* ---------- Scroll-linked guide line fill ---------- */
  const projectList = document.getElementById('projectList');
  const timelineFill = document.getElementById('timelineFill');

  function updateTimeline() {
    const rect = projectList.getBoundingClientRect();
    const viewportMid = window.innerHeight * 0.5;
    const total = rect.height;
    const scrolled = Math.min(Math.max(viewportMid - rect.top, 0), total);
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    timelineFill.style.height = pct + '%';
  }
  window.addEventListener('scroll', updateTimeline, { passive: true });
  window.addEventListener('resize', updateTimeline);
  updateTimeline();

});
