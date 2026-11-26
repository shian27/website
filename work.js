// ==========================================================================
// VIOLET GRACE — Client Work interactions
// Built mobile-first: nothing heavy loads until it's needed.
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

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

  /* =====================================================================
     CONTENT LIBRARY DATA
     type:    social | video | design
     subject: promotional | film | educational
     media:   'video' (local mp4, hover-preview) | 'youtube' (thumb + iframe) | 'image'
     ===================================================================== */
  

  const items = [



    // JAMES VIDEOS
    { title: 'TYPS Campaign Reel',        client: 'Client Reel',  type: 'social', subject: 'promotional',     media: 'video', src: 'https://d2xzwkti23clo4.cloudfront.net/videos/TYPS1.mp4' },
    { title: 'Film demo reel',     client: 'Independent Film', type: 'social', subject: 'film',       media: 'video', src: 'https://d2xzwkti23clo4.cloudfront.net/videos/Director_Reel_2026.mp4' },
    { title: 'October Release Promo',     client: 'Independent Artists', type: 'social', subject: 'promotional',       media: 'video', src: 'https://d2xzwkti23clo4.cloudfront.net/videos/October_V2.mp4' },
    { title: 'Native Nature Educational Post',       client: 'NN',           type: 'social', subject: 'promotional', media: 'video', src: 'https://d2xzwkti23clo4.cloudfront.net/videos/NN_Canada1.mp4' },
    { title: 'HAGO Educational Social',     client: 'Help A Girl Out', type: 'social', subject: 'educational',       media: 'video', src: 'https://d2xzwkti23clo4.cloudfront.net/videos/PAD_V.mp4' },
    { title: 'Nasty Beast Dance Promo',     client: 'Independent Artists', type: 'social', subject: 'film',       media: 'video', src: 'https://d2xzwkti23clo4.cloudfront.net/videos/Nasty-Beast-Dance.mp4' },
    



    // YouTube EMBEDS
    { title: 'TYPS Highlight Reel', client: 'Toronto Youth Poetry Slam', type: 'video', subject: 'promotional',       media: 'youtube', src: 'https://youtu.be/twhl9PNfvm0' },
    { title: 'Her Health Her Power',     client: 'Help A Girl Out', type: 'video', subject: 'educational',     media: 'youtube', src: 'https://youtu.be/3kimG4Iu_Jc' },
    { title: 'Ottawa Conference Video',  client: 'Right to Play x CanWaCH', type: 'video', subject: 'educational', media: 'youtube', src: 'https://youtu.be/hzuE_k_lenQ' },
    { title: 'Prince Rupert Story',        client: 'Violet Grace', type: 'video', subject: 'film',       media: 'youtube', src: 'https://youtu.be/OFFbDRUHy1k' },



    // PHOTOS
    { title: 'Instagram Post — Coldplay', client: 'EcoSpark',     type: 'social', subject: 'educational',
      media: 'image', thumb: 'https://d2xzwkti23clo4.cloudfront.net/videos/es4.png', src: 'https://d2xzwkti23clo4.cloudfront.net/videos/es4.png' },
    { title: 'Original Illustration, Large Format', client: 'True Dating Stories - TV Series', type: 'design', subject: 'film',
      media: 'image', thumb: 'https://d2xzwkti23clo4.cloudfront.net/videos/tds1.png', src: 'https://d2xzwkti23clo4.cloudfront.net/videos/tds1.png' },
    { title: 'Contest Annoucement',       client: 'EcoSpark',     type: 'social', subject: 'educational',
      media: 'image', thumb: 'https://d2xzwkti23clo4.cloudfront.net/videos/es3.png', src: 'https://d2xzwkti23clo4.cloudfront.net/videos/es3.png' },
    { title: 'EcoWisdom Photo & Video',   client: 'EcoWisdom',     type: 'social', subject: 'educational',
      media: 'image', thumb: 'https://d2xzwkti23clo4.cloudfront.net/videos/ew1.png', src: 'https://d2xzwkti23clo4.cloudfront.net/videos/ew1.png' },
    { title: 'Original Logo Design',      client: 'Killer Coworker - TV Movie', type: 'design', subject: 'film',
      media: 'image', thumb: 'https://d2xzwkti23clo4.cloudfront.net/videos/kc1.png', src: 'https://d2xzwkti23clo4.cloudfront.net/videos/kc3.png' },
    { title: 'Instagram Promo Reminder',      client: 'We Are Native Nature', type: 'design', subject: 'promotional',
      media: 'image', thumb: 'https://d2xzwkti23clo4.cloudfront.net/videos/nn1.png', src: 'https://d2xzwkti23clo4.cloudfront.net/videos/nn1.png' },
  ];



  const TYPE_LABEL = { social: 'Social Media Content', video: 'Videography / Editing', design: 'Graphic Design' };
  const SUBJECT_LABEL = { promotional: 'Promotional', film: 'Film', educational: 'Educational Videos' };

  /* ---------- YouTube URL helpers ---------- */
  function getYouTubeId(url) {
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split(/[?&]/)[0];
    if (url.includes('v=')) return url.split('v=')[1].split('&')[0];
    if (url.includes('embed/')) return url.split('embed/')[1].split(/[?&]/)[0];
    return '';
  }
  function getYouTubeEmbedUrl(url) {
    const id = getYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1&rel=0` : url;
  }

  /* ---------- Render cards (built once; filtered via CSS display) ---------- */
  const carousel = document.getElementById('carousel');
  const frag = document.createDocumentFragment();

  items.forEach((item, i) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.tabIndex = 0;
    card.dataset.type = item.type;
    card.dataset.subject = item.subject;
    card.dataset.search = (item.title + ' ' + item.client).toLowerCase();
    card.dataset.index = i;

    let mediaHTML = '';
    if (item.media === 'image') {
      mediaHTML = `<img src="${item.thumb}" alt="${item.title}" loading="lazy" decoding="async">`;
    } else if (item.media === 'youtube') {
      const id = getYouTubeId(item.src);
      // sddefault is higher resolution than hqdefault; not every video has it, so we fall back on error
      mediaHTML = `
        <img class="yt-thumb" src="https://img.youtube.com/vi/${id}/sddefault.jpg" alt="${item.title}" loading="lazy" decoding="async">
        <div class="card-play" aria-hidden="true"></div>`;
    } else if (item.media === 'video') {
      mediaHTML = `
        <video class="card-video-preview" muted loop playsinline preload="metadata">
          <source src="${item.src}#t=0.5" type="video/mp4">
        </video>
        <div class="card-play" aria-hidden="true"></div>`;
    }

    card.innerHTML = `
      <div class="card-media">${mediaHTML}</div>
      <div class="card-body">
        <span class="card-title">${item.title}</span>
        <span class="card-client">${item.client}</span>
        <div class="card-tags">
          <span class="card-tag">${TYPE_LABEL[item.type]}</span>
          <span class="card-tag">${SUBJECT_LABEL[item.subject]}</span>
        </div>
      </div>`;

    // Hover/focus preview playback for local video cards
    if (item.media === 'video') {
      const previewVideo = card.querySelector('.card-video-preview');
      const play = () => previewVideo.play().catch(() => {});
      const pause = () => { previewVideo.pause(); previewVideo.currentTime = 0.5; };
      card.addEventListener('mouseenter', play);
      card.addEventListener('mouseleave', pause);
      card.addEventListener('focus', play);
      card.addEventListener('blur', pause);
      // Surface real load failures (wrong filename/path) in the console instead of failing silently
      previewVideo.addEventListener('error', () => {
        console.warn(`[client-work] Local video failed to load: ${item.src} — check the filename and case on the server.`);
      });
    }

    // Fall back to a lower-res YouTube thumbnail if sddefault doesn't exist for this video
    if (item.media === 'youtube') {
      const img = card.querySelector('.yt-thumb');
      const id = getYouTubeId(item.src);
      img.addEventListener('error', () => { img.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`; }, { once: true });
    }

    frag.appendChild(card);
  });
  carousel.appendChild(frag);

  /* ---------- Filters + search ---------- */
  let activeType = 'all';
  let activeSubject = 'all';
  let searchTerm = '';

  const cards = Array.from(carousel.querySelectorAll('.card'));
  const countEl = document.getElementById('libraryCount');
  const emptyEl = document.getElementById('libraryEmpty');

  function applyFilters() {
    let visible = 0;
    // Default view (both filters "All", no search) = swipeable carousel of every item.
    // Any filter or search = a normal grid of the matches.
    const carouselMode = activeType === 'all' && activeSubject === 'all' && !searchTerm;
    const wasGrid = !carousel.classList.contains('is-carousel');
    carousel.classList.toggle('is-carousel', carouselMode);
    carousel.parentElement.classList.toggle('no-carousel', !carouselMode);
    cards.forEach(card => {
      const matchesType = activeType === 'all' || card.dataset.type === activeType;
      const matchesSubject = activeSubject === 'all' || card.dataset.subject === activeSubject;
      const matchesSearch = !searchTerm || card.dataset.search.includes(searchTerm);
      const show = matchesType && matchesSubject && matchesSearch;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    countEl.textContent = carouselMode ? `Swipe to browse all ${cards.length}` : `Showing ${visible} of ${cards.length}`;
    emptyEl.hidden = visible !== 0;
    if (carouselMode && wasGrid) carousel.scrollLeft = 0;   // returning to the carousel starts at the first card
  }

  function wireChips(containerId, setter) {
    const container = document.getElementById(containerId);
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip');
      if (!btn) return;
      container.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
      btn.classList.add('is-active');
      setter(btn.dataset.filterType || btn.dataset.filterSubject);
      applyFilters();
    });
  }
  wireChips('typeChips', (v) => activeType = v);
  wireChips('subjectChips', (v) => activeSubject = v);

  // Arrow buttons (desktop): scroll one "page" left or right
  function slide(dir) { carousel.scrollBy({ left: dir * (carousel.clientWidth + 16), behavior: 'smooth' }); }
  document.getElementById('carouselPrev').addEventListener('click', () => slide(-1));
  document.getElementById('carouselNext').addEventListener('click', () => slide(1));

  document.getElementById('librarySearch').addEventListener('input', (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    applyFilters();
  });

  /* =====================================================================
     LIGHTBOX — media is only fetched when a card is opened
     ===================================================================== */
  const lightbox = document.getElementById('lightbox');
  const lightboxVideo = document.getElementById('lightboxVideo');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxIframe = document.getElementById('lightboxIframe');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxMeta = document.getElementById('lightboxMeta');

  // Surface real load failures for the lightbox video too (same diagnostic as the card preview)
  lightboxVideo.addEventListener('error', () => {
    console.warn(`[client-work] Lightbox video failed to load: ${lightboxVideo.src} — check the filename and case on the server.`);
  });

  function resetLightboxMedia() {
    lightboxVideo.hidden = true;
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
    lightboxImage.hidden = true;
    lightboxImage.removeAttribute('src');
    lightboxIframe.hidden = true;
    lightboxIframe.removeAttribute('src');
  }

  function openItem(item) {
    lightboxTitle.textContent = item.title;
    lightboxMeta.textContent = `${item.client} · ${TYPE_LABEL[item.type] || item.type}`;

    resetLightboxMedia();

    if (item.media === 'youtube') {
      lightboxIframe.hidden = false;
      lightboxIframe.title = item.title;
      lightboxIframe.src = getYouTubeEmbedUrl(item.src);
    } else if (item.media === 'video') {
      lightboxVideo.hidden = false;
      lightboxVideo.src = item.src;
      lightboxVideo.currentTime = 0;
      lightboxVideo.play().catch(() => {});
    } else {
      lightboxImage.hidden = false;
      lightboxImage.src = item.src;
    }

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    resetLightboxMedia();
    lightboxVideo.load();
    document.body.style.overflow = '';
  }

  carousel.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    openItem(items[Number(card.dataset.index)]);
  });
  carousel.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.card');
    if (!card) return;
    e.preventDefault();
    openItem(items[Number(card.dataset.index)]);
  });

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxBackdrop').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });

  applyFilters();
});
