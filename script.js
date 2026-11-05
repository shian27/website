// ==========================================================================
// VIOLET GRACE — Portfolio interactions
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* ---------- Hero sound toggle ---------- */
  const heroVideo = document.getElementById('heroVideo');
  const soundToggle = document.getElementById('soundToggle');
  const soundLabel = soundToggle.querySelector('.sound-label');

  soundToggle.addEventListener('click', () => {
    heroVideo.muted = !heroVideo.muted;
    const on = !heroVideo.muted;
    soundToggle.setAttribute('aria-pressed', String(on));
    soundLabel.textContent = on ? 'Sound on' : 'Sound off';
  });

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
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', () => setMenu(false));

  // Tapping a page link (#reel, #credits...) closes the menu.
  mobileMenu.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) setMenu(false);
  });

  // If the window grows to desktop width while the menu is open, close it.
  window.matchMedia('(min-width: 861px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
  });

  /* ---------- Filmstrip: hover-preview + lightbox ---------- */
  const frames = document.querySelectorAll('.frame');
  const lightbox = document.getElementById('lightbox');
  const lightboxVideo = document.getElementById('lightboxVideo');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxMeta = document.getElementById('lightboxMeta');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  frames.forEach(frame => {
    const previewVideo = frame.querySelector('.frame-video');

    // Hover / focus preview playback
    const play = () => previewVideo.play().catch(() => {});
    const pause = () => { previewVideo.pause(); previewVideo.currentTime = 0.5; };

    frame.addEventListener('mouseenter', play);
    frame.addEventListener('mouseleave', pause);
    frame.addEventListener('focus', play);
    frame.addEventListener('blur', pause);

    // Open full video in lightbox
    const openLightbox = () => {
      lightboxVideo.src = frame.dataset.video;
      lightboxTitle.textContent = frame.dataset.title;
      lightboxMeta.textContent = frame.dataset.meta;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lightboxVideo.currentTime = 0;
      lightboxVideo.play().catch(() => {});
    };

    frame.addEventListener('click', openLightbox);
    frame.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox();
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxBackdrop.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });

  /* ---------- Header contrast on scroll (optional subtlety) ---------- */
  const header = document.querySelector('.site-header');
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.style.transform = (y > lastY && y > 200) ? 'translateY(-110%)' : 'translateY(0)';
    header.style.transition = 'transform .4s ease';
    lastY = y;
  }, { passive: true });

  /* ---------- Mailing list form -> Google Sheet ----------
     Sends the form to a Google Apps Script "web app" that appends a row to your
     sheet. After you deploy the Apps Script (see setup steps), paste its URL
     (it ends in /exec) between the quotes below. */
  const MAILING_LIST_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwYR9q18QWUKy4008XC1fQvLVqQlja2PcGoc2QV5sLl9mwfxpyDY-_PcJ3QesIKmGs-7A/exec';

  const mailForm = document.getElementById('mailForm');
  if (mailForm) {
    const mailStatus = document.getElementById('mailStatus');
    const mailSubmit = document.getElementById('mailSubmit');
    const submitLabel = mailSubmit.textContent;

    const setStatus = (msg, kind) => {
      mailStatus.textContent = msg;
      mailStatus.classList.toggle('is-success', kind === 'success');
      mailStatus.classList.toggle('is-error', kind === 'error');
    };

    mailForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Spam trap: bots fill the hidden field, people never see it.
      // Pretend it worked so bots don't retry, but send nothing.
      if (mailForm.elements.company.value) {
        mailForm.reset();
        setStatus("You're on the list. Thank you!", 'success');
        return;
      }

      const data = new FormData(mailForm);
      const email = String(data.get('email') || '').trim();
      if (!email) {
        setStatus('Please enter your email address.', 'error');
        return;
      }

      if (MAILING_LIST_ENDPOINT.includes('PASTE_YOUR')) {
        console.warn('[mailing list] MAILING_LIST_ENDPOINT in script.js is not set yet.');
        setStatus("Sign-up isn't connected yet. Please try again soon.", 'error');
        return;
      }

      mailSubmit.disabled = true;
      mailSubmit.textContent = 'Joining…';
      setStatus('', null);

      try {
        // no-cors: Google's script URL doesn't send CORS headers, so the browser
        // can't read the reply. The request still goes through and writes the row.
        await fetch(MAILING_LIST_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          body: new URLSearchParams(data)
        });
        mailForm.reset();
        setStatus("You're on the list. Thank you!", 'success');
      } catch (err) {
        console.warn('[mailing list] Submit failed:', err);
        setStatus('Something went wrong. Please check your connection and try again.', 'error');
      } finally {
        mailSubmit.disabled = false;
        mailSubmit.textContent = submitLabel;
      }
    });
  }

});
