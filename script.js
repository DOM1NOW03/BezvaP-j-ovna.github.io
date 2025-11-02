// ===== script.js — Inicializace UI, katalog, navigace, hero, toasty =====
(() => {
  const STATE = {
    products: [],
    currentSlide: 0,
    autoplay: null,
    menuOpen: false,
    searchOpen: false,
    isScrolling: false,
  };

  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    initNav();
    initSearch();
    initHero();
    initCTA();
    initScrollAnimations();
    await loadProducts();
    initCatalog();
    initContactForm();
    initToasts();
    wireGlobalQuickView();
    initIntersectionObserver();
    console.log('✅ script.js inicializován');
  }

  // ===== Navigace =====
  function initNav() {
    const toggle = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-mobile-menu]');
    const links = document.querySelectorAll('.nav-link');

    toggle?.addEventListener('click', toggleMobileMenu);
    
    // Scroll listener s throttling pro lepší performance
    let ticking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(updateNavOnScroll);
          ticking = true;
        }
      },
      { passive: true }
    );

    // Zavření menu při kliknutí na odkaz
    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href?.startsWith('#')) {
          e.preventDefault();
          const targetId = href.substring(1);
          const target = document.getElementById(targetId);
          if (target) {
            smoothScrollToElement(target);
          }
        }
        if (STATE.menuOpen) {
          closeMobileMenu();
        }
      });
    });

    // Zavření menu při ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && STATE.menuOpen) {
        closeMobileMenu();
      }
    });

    function toggleMobileMenu() {
      STATE.menuOpen = !STATE.menuOpen;
      menu?.classList.toggle('active', STATE.menuOpen);
      menu?.setAttribute('aria-hidden', String(!STATE.menuOpen));
      toggle?.setAttribute('aria-expanded', String(STATE.menuOpen));
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = STATE.menuOpen ? 'hidden' : '';
    }

    function closeMobileMenu() {
      if (!STATE.menuOpen) return;
      STATE.menuOpen = false;
      menu?.classList.remove('active');
      menu?.setAttribute('aria-hidden', 'true');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    function updateNavOnScroll() {
      const nav = document.querySelector('.main-navigation');
      const scrolled = window.scrollY > 50;
      
      if (nav) {
        nav.classList.toggle('is-scrolled', scrolled);
        // Dynamicky upravujeme pozadí pro lepší kontrast
        const opacity = Math.min(0.98, 0.85 + (window.scrollY / 1000));
        nav.style.background = scrolled
          ? `rgba(26,26,26,${opacity})`
          : 'rgba(26, 26, 26, 0.95)';
      }
      
      ticking = false;
    }
  }

  // ===== Search functionality =====
  function initSearch() {
    const searchBtn = document.querySelector('[data-search-toggle]');
    const searchOverlay = document.querySelector('[data-search-overlay]');
    const searchClose = document.querySelector('[data-search-close]');
    const searchInput = document.querySelector('.search-input');

    if (!searchBtn || !searchOverlay) return;

    searchBtn.addEventListener('click', openSearch);
    searchClose?.addEventListener('click', closeSearch);
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) closeSearch();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && STATE.searchOpen) {
        closeSearch();
      }
    });

    searchInput?.addEventListener('input', debounce(performSearch, 300));

    function openSearch() {
      STATE.searchOpen = true;
      searchOverlay?.classList.add('active');
      searchOverlay?.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // Focus input po animaci
      setTimeout(() => searchInput?.focus(), 300);
    }

    function closeSearch() {
      STATE.searchOpen = false;
      searchOverlay?.classList.remove('active');
      searchOverlay?.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      searchInput && (searchInput.value = '');
    }

    function performSearch(query) {
      // Jednoduché vyhledávání - filtruje produkty a scrolluje na katalog
      const catalogSearch = document.querySelector('[data-search]');
      if (catalogSearch) {
        catalogSearch.value = query;
        catalogSearch.dispatchEvent(new Event('input'));
        // Scroll to catalog
        const catalog = document.getElementById('catalog');
        if (catalog) {
          smoothScrollToElement(catalog);
          closeSearch();
        }
      }
    }
  }

  // ===== Hero slider =====
  function initHero() {
    const root = document.querySelector('.image-slider');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prev = document.querySelector('[data-slider-prev]');
    const next = document.querySelector('[data-slider-next]');
    
    if (!root || !slides.length) return;

    // Preload images
    slides.forEach((slide, index) => {
      const img = slide.querySelector('img');
      if (img && index > 0) {
        img.loading = 'lazy';
      }
      img?.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    });

    const go = (targetIndex) => {
      const count = slides.length;
      const nextIndex = (targetIndex + count) % count;
      
      // Remove active classes
      slides[STATE.currentSlide]?.classList.remove('active');
      dots[STATE.currentSlide]?.classList.remove('active');
      dots[STATE.currentSlide]?.setAttribute('aria-selected', 'false');
      
      // Add active classes
      STATE.currentSlide = nextIndex;
      slides[STATE.currentSlide]?.classList.add('active');
      dots[STATE.currentSlide]?.classList.add('active');
      dots[STATE.currentSlide]?.setAttribute('aria-selected', 'true');

      // Announce to screen readers
      const img = slides[STATE.currentSlide]?.querySelector('img');
      if (img) {
        announceToScreenReader(`Obrázek ${nextIndex + 1} z ${count}: ${img.alt}`);
      }
    };

    // Event listeners
    prev?.addEventListener('click', () => go(STATE.currentSlide - 1));
    next?.addEventListener('click', () => go(STATE.currentSlide + 1));
    
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => go(i));
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          go(i);
        }
      });
    });

    // Keyboard navigation
    root.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          go(STATE.currentSlide - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          go(STATE.currentSlide + 1);
          break;
      }
    });

    // Enhanced swipe with better gesture detection
    let startX = 0;
    let startY = 0;
    let isDragging = false;

    root.addEventListener('pointerdown', (e) => {
      startX = e.clientX;
      startY = e.clientY;
      isDragging = true;
      root.setPointerCapture?.(e.pointerId);
    });

    root.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const deltaY = Math.abs(e.clientY - startY);
      // Prevent vertical scroll interference
      if (deltaY > 50) {
        isDragging = false;
        root.releasePointerCapture?.(e.pointerId);
      }
    });

    root.addEventListener('pointerup', (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - startX;
      const deltaY = Math.abs(e.clientY - startY);
      
      // Only swipe if horizontal movement is dominant
      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
        go(STATE.currentSlide + (deltaX < 0 ? 1 : -1));
      }
      
      isDragging = false;
      root.releasePointerCapture?.(e.pointerId);
    });

    // Autoplay with improved pause/resume logic
    function startAutoplay() {
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      
      STATE.autoplay = setInterval(() => {
        if (!isDragging && !document.hidden) {
          go(STATE.currentSlide + 1);
        }
      }, 5000);
    }

    function stopAutoplay() {
      clearInterval(STATE.autoplay);
      STATE.autoplay = null;
    }

    // Autoplay controls
    startAutoplay();
    
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);
    root.addEventListener('focusin', stopAutoplay);
    root.addEventListener('focusout', startAutoplay);
    
    // Pause on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    });
  }

  // ===== Smooth scroll enhancement =====
  function smoothScrollToElement(element, offset = 70) {
    const targetPosition = element.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.min(800, Math.abs(distance) * 0.5); // Dynamic duration
    let start = null;

    STATE.isScrolling = true;

    function animation(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = ease(timeElapsed, startPosition, distance, duration);
      
      window.scrollTo(0, run);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        STATE.isScrolling = false;
      }
    }

    // Easing function for smooth animation
    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  }

  // ===== CTA scroll =====
  function initCTA() {
    document.querySelectorAll('[data-scroll-to]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-scroll-to');
        const el = document.getElementById(id);
        if (el) {
          smoothScrollToElement(el);
          // Add ripple effect
          addRippleEffect(btn, e);
        }
      });
    });
  }

  // ===== Scroll animations =====
  function initScrollAnimations() {
    // Parallax effect for hero particles (subtle)
    const particles = document.querySelector('.hero-particles');
    if (particles && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.addEventListener('scroll', () => {
        if (!STATE.isScrolling) {
          const scrolled = window.pageYOffset;
          const rate = scrolled * -0.2;
          particles.style.transform = `translateY(${rate}px)`;
        }
      }, { passive: true });
    }
  }

  // ===== Intersection Observer for animations =====
  function initIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          // Staggered animation for children
          const children = entry.target.querySelectorAll('.service-card, .catalog-card, .review-card');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.style.animationDelay = `${index * 0.1}s`;
              child.classList.add('animate-fade-in-up');
            }, index * 50);
          });
        }
      });
    }, observerOptions);

    // Observe sections for animation
    document.querySelectorAll('.section').forEach(section => {
      observer.observe(section);
    });
  }

  // ===== Contact form validation =====
  function initContactForm() {
    const form = document.querySelector('[data-contact-form]');
    const submitBtn = document.querySelector('[data-submit-btn]');
    
    if (!form) return;

    form.addEventListener('submit', handleFormSubmit);

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearFieldError(input));
    });

    async function handleFormSubmit(e) {
      e.preventDefault();
      
      if (!validateForm(form)) return;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      try {
        setSubmitState(true);
        
        // Simulate form submission (replace with actual endpoint)
        await simulateFormSubmission(data);
        
        window.toasts?.show?.({
          title: 'Děkujeme!',
          message: 'Vaše poptávka byla odeslána. Ozveme se vám do 2 hodin.',
          type: 'success',
          timeout: 5000
        });
        
        form.reset();
        
      } catch (error) {
        console.error('Form submission error:', error);
        window.toasts?.show?.({
          title: 'Chyba',
          message: 'Nepodařilo se odeslat poptávku. Zkuste to prosím znovu.',
          type: 'error',
          timeout: 5000
        });
      } finally {
        setSubmitState(false);
      }
    }

    function validateForm(form) {
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required]');
      
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });
      
      return isValid;
    }

    function validateField(field) {
      const value = field.value.trim();
      const type = field.type;
      const name = field.name;
      let error = '';

      // Required field check
      if (field.required && !value) {
        error = 'Toto pole je povinné';
      }
      // Email validation
      else if (type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Zadejte platnou e-mailovou adresu';
      }
      // Phone validation
      else if (type === 'tel' && value && !/^(\+420\s?)?[0-9\s]{9,}$/.test(value)) {
        error = 'Zadejte platné telefonní číslo';
      }
      // Checkbox validation
      else if (field.type === 'checkbox' && field.required && !field.checked) {
        error = 'Musíte souhlasit se zpracováním osobních údajů';
      }

      showFieldError(field, error);
      return !error;
    }

    function showFieldError(field, message) {
      const errorElement = document.getElementById(`${field.name}-error`);
      if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.toggle('show', !!message);
      }
      field.classList.toggle('error', !!message);
    }

    function clearFieldError(field) {
      showFieldError(field, '');
    }

    function setSubmitState(loading) {
      const textElement = submitBtn?.querySelector('[data-btn-text]');
      const loaderElement = submitBtn?.querySelector('[data-btn-loader]');
      
      if (submitBtn) {
        submitBtn.disabled = loading;
        textElement && (textElement.style.display = loading ? 'none' : '');
        loaderElement && (loaderElement.style.display = loading ? '' : 'none');
      }
    }

    async function simulateFormSubmission(data) {
      // Simulate API call
      return new Promise((resolve) => {
        setTimeout(resolve, 1500);
      });
    }
  }

  // ===== Načtení produktů =====
  async function loadProducts() {
    try {
      if (Array.isArray(window.BEZVA_PRODUCTS)) {
        STATE.products = window.BEZVA_PRODUCTS;
        return;
      }
      
      const res = await fetch('products.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('products.json not found');
      
      const data = await res.json();
      
      if (Array.isArray(data)) {
        STATE.products = data;
      } else if (Array.isArray(data.categories)) {
        STATE.products = data.categories.flatMap((c) =>
          (c.products || []).map((p) => ({ ...p, category: c.id || c.name || p.category }))
        );
      } else {
        STATE.products = [];
      }
    } catch (e) {
      console.warn('Products fallback (enhanced)', e);
      STATE.products = getFallbackProducts();
    }
  }

  function getFallbackProducts() {
    return [
      {
        id: 1,
        name: 'BAGR SE SKLUZAVKOU',
        price: 8900,
        image: 'Image/Bagr.png',
        images: ['Image/Bagr.png'],
        description: 'Skákací hrad se skluzavkou. Do dojezdové části lze nasypat plastové míčky.',
        dimensions: '8 × 3 × 4,5 m',
        capacity: '8–12 dětí',
        age: '3–12 let',
        category: 'skakaci-hrady',
        available: true,
        features: ['Skluzavka', 'Prostor na míčky', 'Bezpečnostní sítě'],
        specifications: {
          'Rozměry': '8 × 3 × 4,5 m',
          'Kapacita': '8–12 dětí',
          'Věk': '3–12 let',
          'Hmotnost': '850 kg'
        }
      },
      {
        id: 8,
        name: 'PIRÁTSKÁ LOĎ SE SKLUZAVKOU',
        price: 10900,
        image: 'obrazky/piratska-lod.jpg',
        images: ['obrazky/piratska-lod.jpg'],
        description: 'Nafukovací skluzavka pro malé piráty. Včetně pirátských doplňků.',
        dimensions: '7 × 4 × 5 m',
        capacity: '8–12 dětí',
        age: '3–12 let',
        category: 'skluzavky',
        available: true,
        features: ['Pirátský design', 'Vysoká skluzavka', 'Interaktivní prvky'],
        specifications: {
          'Rozměry': '7 × 4 × 5 m',
          'Kapacita': '8–12 dětí',
          'Věk': '3–12 let',
          'Hmotnost': '920 kg'
        }
      },
      {
        id: 3,
        name: 'MONSTER TRUCK',
        price: 7900,
        image: 'Image/Moster-truck.png',
        images: ['Image/Moster-truck.png'],
        description: 'Skákací hrad v podobě Monster Trucku. Ideální pro malé automobilové nadšence.',
        dimensions: '6 × 4 × 4,8 m',
        capacity: '6–10 dětí',
        age: '3–12 let',
        category: 'skakaci-hrady',
        available: true,
        features: ['Auto design', 'Skákací plocha', 'LED osvětlení'],
        specifications: {
          'Rozměry': '6 × 4 × 4,8 m',
          'Kapacita': '6–10 dětí',
          'Věk': '3–12 let',
          'Hmotnost': '720 kg'
        }
      },
    ];
  }

  // ===== Katalog: filtry, render, interakce =====
  function initCatalog() {
    const grid = document.querySelector('[data-catalog-grid]');
    const loading = document.querySelector('[data-catalog-loading]');
    const nores = document.querySelector('[data-no-results]');
    const selCat = document.querySelector('[data-filter="category"]');
    const search = document.querySelector('[data-search]');
    const sortSel = document.querySelector('[data-sort]');

    if (!grid) return;

    // Populate categories
    if (selCat) {
      const cats = [...new Set(STATE.products.map((p) => p.category).filter(Boolean))];
      selCat.innerHTML =
        '<option value="">Všechny kategorie</option>' +
        cats.map((c) => `<option value="${escapeAttr(c)}">${escapeHtml(labelize(c))}</option>`).join('');
    }

    const render = async () => {
      // Show loading
      if (loading) {
        loading.setAttribute('aria-hidden', 'false');
        loading.style.display = 'flex';
      }

      // Small delay for smooth UX
      await new Promise(resolve => setTimeout(resolve, 100));

      let items = STATE.products.slice();
      const query = (search?.value || '').toLowerCase().trim();
      const category = selCat?.value || '';
      const sort = sortSel?.value || 'name';

      // Apply filters
      if (category) {
        items = items.filter((p) => (p.category || '').toLowerCase() === category.toLowerCase());
      }
      
      if (query) {
        items = items.filter((p) => 
          p.name?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          (p.features || []).some(f => f.toLowerCase().includes(query))
        );
      }

      // Apply sorting
      switch (sort) {
        case 'price-low':
          items.sort((a, b) => (num(a.price) ?? 1e12) - (num(b.price) ?? 1e12));
          break;
        case 'price-high':
          items.sort((a, b) => (num(b.price) ?? 0) - (num(a.price) ?? 0));
          break;
        default:
          items.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'cs'));
      }

      // Render results
      grid.innerHTML = items.map(cardHTML).join('');
      attachCardEvents();
      
      // Show/hide no results
      if (nores) {
        nores.setAttribute('aria-hidden', String(items.length > 0));
        nores.style.display = items.length ? 'none' : 'block';
      }
      
      // Hide loading
      if (loading) {
        loading.setAttribute('aria-hidden', 'true');
        loading.style.display = 'none';
      }

      // Announce to screen readers
      announceToScreenReader(`Zobrazeno ${items.length} produktů`);
    };

    // Event listeners
    search?.addEventListener('input', debounce(render, 150));
    selCat?.addEventListener('change', render);
    sortSel?.addEventListener('change', render);

    // Initial render
    render();
  }

  function cardHTML(p) {
    const meta = [p.dimensions, p.capacity, p.age].filter(Boolean).join(' • ');
    const price = p.price ? `${formatCZK(p.price)}` : escapeHtml(p.priceNote || 'Cena na dotaz');
    const availability = p.available ? 'Dostupné' : 'Nedostupné';
    const availabilityClass = p.available ? 'available' : 'unavailable';
    
    return `
      <article class="catalog-card" data-id="${escapeAttr(p.id)}" role="article">
        <div class="card-image">
          <img src="${escapeAttr(p.image)}" 
               alt="${escapeAttr(p.name)}" 
               loading="lazy" 
               decoding="async" 
               width="600" 
               height="400"
               onerror="this.src='assets/placeholder.jpg'">
          <div class="card-availability ${availabilityClass}" aria-label="Dostupnost: ${availability}">
            ${availability}
          </div>
        </div>
        <div class="card-content">
          <h3 class="card-title">${escapeHtml(p.name)}</h3>
          ${meta ? `<div class="card-meta">${escapeHtml(meta)}</div>` : ''}
          <div class="card-price" aria-label="Cena: ${price} za den">${price}</div>
          <div class="card-actions">
            <button class="view-details" data-quick aria-label="Zobrazit detail ${escapeHtml(p.name)}">
              Rychlý náhled
            </button>
            <button class="btn btn-primary" data-add ${!p.available ? 'disabled' : ''} 
                    aria-label="Přidat ${escapeHtml(p.name)} do košíku">
              <span>Do košíku</span>
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 4V2A1 1 0 0 0 5 2V4H1A1 1 0 0 0 1 6H2.08L4.15 17.25A3 3 0 0 0 7.12 20H16.88A3 3 0 0 0 19.85 17.25L21.92 6H23A1 1 0 0 0 23 4H19V2A1 1 0 0 0 17 2V4H7Z"/>
              </svg>
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function attachCardEvents() {
    // Quick view buttons
    document.querySelectorAll('[data-quick]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = idFromCard(e.currentTarget);
        if (id == null) return;
        
        addRippleEffect(btn, e);
        window.productModal?.open?.(id);
      });
    });

    // Add to cart buttons
    document.querySelectorAll('[data-add]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        if (btn.disabled) return;
        
        const id = idFromCard(e.currentTarget);
        if (id == null) return;
        
        const item = STATE.products.find((p) => String(p.id) === String(id));
        if (!item || !item.available) return;

        addRippleEffect(btn, e);
        
        window.cartManager?.add?.({
          id: item.id,
          name: item.name,
          price: Number(item.price) || 0,
          qty: 1,
          image: item.image,
          meta: {
            dimensions: item.dimensions,
            capacity: item.capacity,
            age: item.age
          },
        });
        
        // Update cart count animation
        const cartCount = document.querySelector('[data-cart-count]');
        if (cartCount) {
          cartCount.classList.add('pulse');
          setTimeout(() => cartCount.classList.remove('pulse'), 500);
        }
        
        window.toasts?.show?.({ 
          title: 'Přidáno do košíku', 
          message: item.name, 
          type: 'success' 
        });
      });
    });
  }

  function idFromCard(node) {
    const card = node.closest('[data-id]');
    if (!card) return null;
    const raw = card.getAttribute('data-id');
    const n = Number(raw);
    return Number.isFinite(n) ? n : raw;
  }

  // ===== Enhanced Toast System =====
  function initToasts() {
    if (window.toasts?.show) return;
    window.toasts = new ToastCenter('toastRegion');
  }

  class ToastCenter {
    constructor(id) {
      this.root = document.getElementById(id);
      if (!this.root) {
        this.root = document.createElement('div');
        this.root.id = id;
        this.root.className = 'toast-region';
        this.root.setAttribute('aria-live', 'polite');
        this.root.setAttribute('aria-atomic', 'true');
        document.body.appendChild(this.root);
      }
      this.toasts = new Set();
    }

    show({ title = 'Info', message = '', type = 'info', timeout = 3000 } = {}) {
      const el = document.createElement('div');
      el.className = `toast toast-${type}`;
      el.setAttribute('role', 'alert');
      el.setAttribute('aria-live', 'assertive');
      
      const iconMap = {
        success: '✓',
        error: '⚠',
        warning: '⚠',
        info: 'ℹ'
      };

      const colorMap = {
        success: '#10B981',
        error: '#EF4444', 
        warning: '#F59E0B',
        info: '#3B82F6'
      };

      el.innerHTML = `
        <div class="toast-content">
          <div class="toast-icon" style="color: ${colorMap[type] || colorMap.info}">${iconMap[type] || iconMap.info}</div>
          <div class="toast-message">
            <div class="toast-title">${this.escapeHtml(title)}</div>
            ${message ? `<div class="toast-description">${this.escapeHtml(message)}</div>` : ''}
          </div>
          <button class="toast-close" aria-label="Zavřít oznámení" type="button">×</button>
        </div>
      `;

      const closeBtn = el.querySelector('.toast-close');
      closeBtn?.addEventListener('click', () => dismiss());

      this.root.appendChild(el);
      this.toasts.add(el);

      // Animate in
      const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const duration = prefersReduced ? 1 : 300;
      
      if (prefersReduced) {
        el.classList.add('show');
      } else {
        requestAnimationFrame(() => {
          el.classList.add('show');
        });
      }

      // Auto dismiss
      let dismissTimeout = setTimeout(dismiss, timeout);
      
      // Pause on hover
      el.addEventListener('pointerenter', () => clearTimeout(dismissTimeout));
      el.addEventListener('pointerleave', () => {
        dismissTimeout = setTimeout(dismiss, Math.max(1000, timeout / 3));
      });

      function dismiss() {
        if (!el.parentNode) return;
        
        clearTimeout(dismissTimeout);
        el.classList.remove('show');
        
        setTimeout(() => {
          if (el.parentNode) {
            el.remove();
            this.toasts.delete(el);
          }
        }, prefersReduced ? 0 : 300);
      }

      return { dismiss };
    }

    escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }

    clear() {
      this.toasts.forEach(toast => {
        toast.remove();
      });
      this.toasts.clear();
    }
  }

  // ===== Quick view z PLP přes .view-details =====
  function wireGlobalQuickView() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest?.('[data-quick]');
      if (!btn) return;
      const id = idFromCard(btn);
      if (id == null) return;
      window.productModal?.open?.(id);
    });
  }

  // ===== Utility functions =====
  function addRippleEffect(button, event) {
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple-animation 0.6s ease-out;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
    `;
    
    // Add ripple keyframes if not exists
    if (!document.getElementById('ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple-animation {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        .ripple { z-index: 1; }
        button { position: relative; overflow: hidden; }
      `;
      document.head.appendChild(style);
    }
    
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  }

  function debounce(fn, ms) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), ms);
    };
  }

  function escapeHtml(s = '') {
    return String(s).replace(/[&<>"']/g, (m) => ({ 
      '&': '&amp;', 
      '<': '&lt;', 
      '>': '&gt;', 
      '"': '&quot;', 
      "'": '&#39;' 
    }[m]));
  }

  function escapeAttr(s = '') {
    return escapeHtml(s).replace(/"/g, '&quot;');
  }

  function formatCZK(n) {
    const num = Number(n);
    if (!Number.isFinite(num)) return '—';
    return `${num.toLocaleString('cs-CZ')} Kč`;
  }

  function num(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function labelize(slug = '') {
    return String(slug)
      .replace(/[-_]/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim()
      .replace(/^\w/, (m) => m.toUpperCase());
  }

  // ===== Performance monitoring =====
  function initPerformanceMonitoring() {
    if (typeof PerformanceObserver === 'undefined') return;

    // Monitor long tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            console.warn(`Long task detected: ${entry.duration}ms`);
          }
        });
      });
      longTaskObserver.observe({ type: 'longtask', buffered: true });
    } catch (e) {
      // Long task API not supported
    }

    // Monitor largest contentful paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log(`LCP: ${lastEntry.startTime}ms`);
        lcpObserver.disconnect();
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      // LCP API not supported
    }
  }

  // Initialize performance monitoring in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    initPerformanceMonitoring();
  }

  // ===== Error handling =====
  window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    window.toasts?.show?.({
      title: 'Došlo k chybě',
      message: 'Obnovte prosím stránku',
      type: 'error',
      timeout: 5000
    });
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
  });

  // Export utilities globally
  window.BezvaUtils = {
    debounce,
    escapeHtml,
    escapeAttr,
    formatCZK,
    labelize,
    addRippleEffect,
    announceToScreenReader,
    smoothScrollToElement
  };

})();