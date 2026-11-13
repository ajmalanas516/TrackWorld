document.addEventListener('DOMContentLoaded', function () {
  // --- Header scroll effect ---
  const header = document.querySelector('header');
  function handleScroll() {
    if (header) {
      header.classList.toggle('solid', window.scrollY > 40);
    }
  }
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  // --- Mobile menu toggle ---
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
      menuBtn.textContent = isOpen ? '✕ Close' : 'Menu';
    });

    // Close when clicking outside
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !menuBtn.contains(e.target) && nav.classList.contains('open')) {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = 'Menu';
      }
    });
  }

  // --- Active Nav Link ---
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(function (a) {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // --- Scroll Reveal Animations ---
  const revealElements = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach(function (el) { io.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add('in'); });
  }

  // --- Munnar Places Filtering & Live Search ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const placeCards = document.querySelectorAll('.place-card');
  const searchInput = document.getElementById('place-search');
  const noResultsMsg = document.getElementById('no-results');

  function filterPlaces() {
    const activeCategory = document.querySelector('.filter-btn.active')?.getAttribute('data-cat') || 'all';
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    let visibleCount = 0;

    placeCards.forEach(function (card) {
      const cardCategory = card.getAttribute('data-cat') || '';
      const cardTitle = (card.querySelector('h3')?.textContent || '').toLowerCase();
      const cardDesc = (card.querySelector('p')?.textContent || '').toLowerCase();
      const cardTags = (card.getAttribute('data-tags') || '').toLowerCase();

      const matchesCat = (activeCategory === 'all' || cardCategory === activeCategory);
      const matchesSearch = !query || cardTitle.includes(query) || cardDesc.includes(query) || cardTags.includes(query);

      if (matchesCat && matchesSearch) {
        card.style.display = 'flex';
        card.classList.add('in');
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noResultsMsg) {
      noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  if (filterBtns.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        filterPlaces();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterPlaces);
  }

  // --- Munnar Place Detail Modal ---
  const modalOverlay = document.getElementById('place-modal');
  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalCat = document.getElementById('modal-cat');
  const modalAlt = document.getElementById('modal-alt');
  const modalDist = document.getElementById('modal-dist');
  const modalTime = document.getElementById('modal-time');
  const modalDesc = document.getElementById('modal-desc');
  const modalTips = document.getElementById('modal-tips');
  const modalBookBtn = document.getElementById('modal-book-btn');

  function openPlaceModal(card) {
    if (!modalOverlay) return;
    const title = card.getAttribute('data-title') || card.querySelector('h3')?.textContent;
    const cat = card.getAttribute('data-cat-label') || card.querySelector('.cat-pill')?.textContent;
    const alt = card.getAttribute('data-alt') || '';
    const dist = card.getAttribute('data-dist') || '';
    const time = card.getAttribute('data-time') || 'Sunrise - Sunset';
    const desc = card.getAttribute('data-full-desc') || card.querySelector('p')?.textContent;
    const tips = card.getAttribute('data-tips') || 'Carry comfortable walking shoes, drinking water, and a light fleece jacket.';
    const imgUrl = card.getAttribute('data-img') || card.querySelector('.place-img-wrap')?.style.getPropertyValue('--img');

    if (modalTitle) modalTitle.textContent = title;
    if (modalCat) modalCat.textContent = cat;
    if (modalAlt) modalAlt.textContent = alt;
    if (modalDist) modalDist.textContent = dist;
    if (modalTime) modalTime.textContent = time;
    if (modalDesc) modalDesc.textContent = desc;
    if (modalTips) modalTips.innerHTML = '<b>💡 TrackWorld Explorer Tip:</b> ' + tips;
    if (modalImg) {
      const cleanImg = imgUrl.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
      modalImg.style.backgroundImage = `url('${cleanImg}')`;
    }
    if (modalBookBtn) {
      modalBookBtn.href = `contact.html?place=${encodeURIComponent(title)}`;
    }

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closePlaceModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-modal-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      const card = trigger.closest('.place-card');
      if (card) openPlaceModal(card);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closePlaceModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closePlaceModal();
    });
  }

  // --- FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function () {
        const isActive = item.classList.contains('active');
        faqItems.forEach(function (f) { f.classList.remove('active'); });
        if (!isActive) item.classList.add('active');
      });
    }
  });

  // --- Gallery Lightbox ---
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  if (lightbox) {
    document.querySelectorAll('.gallery-card').forEach(function (card) {
      card.addEventListener('click', function (e) {
        e.preventDefault();
        const rawImg = card.style.getPropertyValue('--img');
        const cleanImg = rawImg.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
        const caption = card.getAttribute('data-caption') || card.querySelector('h3')?.textContent || 'Munnar, Kerala';
        if (lightboxImg) lightboxImg.src = cleanImg;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', function () {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // --- Global Keyboard Controls (Escape key for modals) ---
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (modalOverlay && modalOverlay.classList.contains('open')) closePlaceModal();
      if (lightbox && lightbox.classList.contains('open')) {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  // --- Contact Form handling with URL parameter prefill ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const placeParam = urlParams.get('place');
    const tourParam = urlParams.get('tour');
    const selectEl = contactForm.querySelector('select');

    if (placeParam && selectEl) {
      const opt = document.createElement('option');
      opt.value = 'Munnar - ' + placeParam;
      opt.textContent = 'Custom Tour: ' + placeParam;
      opt.selected = true;
      selectEl.prepend(opt);
    } else if (tourParam && selectEl) {
      for (let i = 0; i < selectEl.options.length; i++) {
        if (selectEl.options[i].text.toLowerCase().includes(tourParam.toLowerCase())) {
          selectEl.selectedIndex = i;
          break;
        }
      }
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = contactForm.name ? contactForm.name.value : 'Adventurer';
      const msgEl = document.getElementById('form-msg');
      if (msgEl) {
        msgEl.innerHTML = `🌿 <strong>Thank you, ${name}!</strong> Our local Munnar expedition lead will contact you within 4 hours with your custom itinerary.`;
        msgEl.style.color = 'var(--leaf)';
      }
      contactForm.reset();
    });
  }
});
