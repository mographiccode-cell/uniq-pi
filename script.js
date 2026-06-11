/* ==========================================================================
   UNIQ PIECE — Landing Page Scripts
   ========================================================================== */

(function() {
  'use strict';

  // ============================================================
  // 1. Header scroll effect
  // ============================================================
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ============================================================
  // 2. Mobile navigation toggle
  // ============================================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navList = document.querySelector('.nav-list');
  if (mobileToggle && navList) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navList.classList.toggle('open');
    });

    // Close mobile menu when a link is clicked
    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navList.classList.remove('open');
      });
    });
  }

  // ============================================================
  // 3. Smooth scroll for anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ============================================================
  // 4. Reveal on scroll (Intersection Observer)
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ============================================================
  // 5. Gallery Lightbox
  // ============================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ============================================================
  // 6. Video play/pause on click
  // ============================================================
  document.querySelectorAll('.video-card').forEach(card => {
    const video = card.querySelector('video');
    const playBtn = card.querySelector('.video-play-btn');
    if (!video) return;

    // Click on card toggles play
    card.addEventListener('click', (e) => {
      if (e.target.closest('.video-play-btn')) {
        e.stopPropagation();
      }
      toggleVideo(card, video);
    });
  });

  function toggleVideo(card, video) {
    // Pause all other videos
    document.querySelectorAll('.video-card video').forEach(v => {
      if (v !== video && !v.paused) {
        v.pause();
        v.parentElement.classList.remove('playing');
      }
    });

    if (video.paused) {
      video.play().then(() => {
        card.classList.add('playing');
      }).catch(err => {
        console.warn('Video play failed:', err);
      });
    } else {
      video.pause();
      card.classList.remove('playing');
    }
  }

  // ============================================================
  // 7. FAQ accordion
  // ============================================================
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close all other items
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) other.classList.remove('active');
      });
      // Toggle current
      item.classList.toggle('active', !isActive);
    });
  });

  // ============================================================
  // 8. Theme toggle (Dark / Light)
  // ============================================================
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('uniq_pi_theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('uniq_pi_theme', next);
    });
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeToggle) themeToggle.innerHTML = '🌙';
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeToggle) themeToggle.innerHTML = '☀️';
    }
  }

  // ============================================================
  // 9. Animated stats counter
  // ============================================================
  const statNumbers = document.querySelectorAll('.stat-num[data-target]');
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statObserver.observe(stat));
  }

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const value = Math.floor(start + (target - start) * eased);
      el.textContent = value.toLocaleString('ar-EG');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('ar-EG');
    }
    requestAnimationFrame(step);
  }

  // ============================================================
  // 10. Parallax effect on hero decor
  // ============================================================
  const decorElements = document.querySelectorAll('.hero-decor');
  if (decorElements.length > 0 && window.matchMedia('(min-width: 768px)').matches) {
    let ticking = false;
    const updateParallax = () => {
      const scrolled = window.scrollY;
      decorElements.forEach((el, i) => {
        const speed = 0.1 + (i * 0.05);
        const direction = i % 2 === 0 ? 1 : -1;
        el.style.transform = `translateY(${scrolled * speed * direction}px)`;
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // ============================================================
  // 11. Set video volume low by default
  // ============================================================
  document.querySelectorAll('video').forEach(v => {
    v.volume = 0.5;
  });

  // ============================================================
  // 12. Gallery Filter (Bento Grid)
  // ============================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const bentoItems = document.querySelectorAll('.bento-item');

  if (filterButtons.length > 0 && bentoItems.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter items
        bentoItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // ============================================================
  // 13. Bento item click — open lightbox with details
  // ============================================================
  document.querySelectorAll('.bento-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.getAttribute('data-caption');
      const desc = item.getAttribute('data-desc');
      if (img && lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = caption || '';
        // Add caption to lightbox if available
        let captionEl = lightbox.querySelector('.lightbox-caption');
        if (!captionEl) {
          captionEl = document.createElement('div');
          captionEl.className = 'lightbox-caption';
          lightbox.appendChild(captionEl);
        }
        captionEl.innerHTML = `<h3>${caption || ''}</h3>${desc ? `<p>${desc}</p>` : ''}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // ============================================================
  // 14. Projects Gallery Modal
  // ============================================================
  const projectModal = document.getElementById('project-modal');
  const projectModalTitle = document.getElementById('project-modal-title');
  const projectModalGrid = document.getElementById('project-modal-grid');
  const projectLightbox = document.getElementById('project-modal-lightbox');
  const projectLightboxImg = document.getElementById('project-modal-lightbox-img');
  const projectLightboxClose = document.querySelector('.project-modal-lightbox-close');
  const projectLightboxPrev = document.querySelector('.project-modal-lightbox-prev');
  const projectLightboxNext = document.querySelector('.project-modal-lightbox-next');
  let currentProjectImages = [];
  let currentImageIndex = 0;

  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h3').textContent;
      const imagesRaw = card.getAttribute('data-images');
      if (!imagesRaw || !projectModal || !projectModalGrid) return;

      try {
        currentProjectImages = JSON.parse(imagesRaw);
      } catch (e) { return; }

      projectModalTitle.textContent = title;
      projectModalGrid.innerHTML = '';

      currentProjectImages.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = title + ' - صورة ' + (i + 1);
        img.loading = 'lazy';
        img.addEventListener('click', () => openProjectLightbox(i));
        projectModalGrid.appendChild(img);
      });

      projectModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function openProjectLightbox(index) {
    if (!projectLightbox || !projectLightboxImg || currentProjectImages.length === 0) return;
    currentImageIndex = index;
    projectLightboxImg.src = currentProjectImages[currentImageIndex];
    projectLightboxImg.alt = projectModalTitle.textContent + ' - صورة ' + (currentImageIndex + 1);
    projectLightbox.classList.add('active');
  }

  function closeProjectLightbox() {
    if (projectLightbox) projectLightbox.classList.remove('active');
  }

  function closeProjectModal() {
    if (projectModal) {
      projectModal.classList.remove('active');
      document.body.style.overflow = '';
      closeProjectLightbox();
    }
  }

  if (projectLightboxClose) {
    projectLightboxClose.addEventListener('click', (e) => { e.stopPropagation(); closeProjectLightbox(); });
  }

  if (projectLightboxPrev) {
    projectLightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
      projectLightboxImg.src = currentProjectImages[currentImageIndex];
    });
  }

  if (projectLightboxNext) {
    projectLightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentImageIndex = (currentImageIndex + 1) % currentProjectImages.length;
      projectLightboxImg.src = currentProjectImages[currentImageIndex];
    });
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal || e.target.classList.contains('project-modal-inner')) {
        closeProjectModal();
      }
    });
  }

  if (projectLightbox) {
    projectLightbox.addEventListener('click', (e) => {
      if (e.target === projectLightbox) closeProjectLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectLightbox && projectLightbox.classList.contains('active')) {
        closeProjectLightbox();
      } else if (projectModal && projectModal.classList.contains('active')) {
        closeProjectModal();
      }
    }
    if (e.key === 'ArrowLeft' && projectLightbox && projectLightbox.classList.contains('active')) {
      currentImageIndex = (currentImageIndex + 1) % currentProjectImages.length;
      projectLightboxImg.src = currentProjectImages[currentImageIndex];
    }
    if (e.key === 'ArrowRight' && projectLightbox && projectLightbox.classList.contains('active')) {
      currentImageIndex = (currentImageIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
      projectLightboxImg.src = currentProjectImages[currentImageIndex];
    }
  });

  // ============================================================
  // 15. Log analytics-ready event
  // ============================================================
  console.log('%c🎨 Uniq Piece', 'color: #D4A24C; font-size: 18px; font-weight: 900;');
  console.log('%cأعمال يدوية من القلب', 'color: #E8DCC4; font-size: 12px;');

  // ============================================================
  // 15. Gallery Progress Bar — animate when in view
  // ============================================================
  const progressFill = document.querySelector('.gallery-progress-fill');
  if (progressFill && 'IntersectionObserver' in window) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseFloat(entry.target.getAttribute('data-progress')) || 0;
          // Slight delay so it's noticeable
          setTimeout(() => {
            entry.target.style.width = target + '%';
          }, 200);
          progressObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    progressObserver.observe(progressFill);
  }

  // ============================================================
  // 16. Instagram Feed cells — staggered entrance
  // ============================================================
  const igCells = document.querySelectorAll('.ig-cell');
  if (igCells.length > 0 && 'IntersectionObserver' in window) {
    const igObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const cells = entry.target.querySelectorAll('.ig-cell');
          cells.forEach((cell, i) => {
            cell.style.opacity = '0';
            cell.style.transform = 'scale(0.85)';
            cell.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            setTimeout(() => {
              cell.style.opacity = '1';
              cell.style.transform = 'scale(1)';
            }, i * 50);
          });
          igObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    const igGrid = document.querySelector('.ig-feed-grid');
    if (igGrid) igObserver.observe(igGrid);
  }

  // ============================================================
  // 17. Add subtle parallax to Instagram feed on scroll
  // ============================================================
  const igFeed = document.querySelector('.ig-feed');
  if (igFeed && window.matchMedia('(min-width: 768px)').matches) {
    let ticking = false;
    const updateIgParallax = () => {
      const rect = igFeed.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Only apply when in view
      if (rect.top < windowHeight && rect.bottom > 0) {
        const center = rect.top + rect.height / 2;
        const offset = (center - windowHeight / 2) * 0.05;
        const glowBefore = igFeed.querySelector('::before');
        // Skip the actual ::before, just translate the feed slightly
      }
      ticking = false;
    };
    // (Disabled — handled via reveal on scroll)
  }

})();
