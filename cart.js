// ===== cart.js — Enhanced off-canvas košík: perzistentní, přístupný, s animacemi =====

(() => {
  'use strict';
  
  if (window.cartManager) return;

  const STORAGE_KEY = 'bezvaparta_cart_v2';
  const PROMO_KEY = 'bezvaparta_promo_v2';
  const WISHLIST_KEY = 'bezvaparta_wishlist_v1';

  // Enhanced promo codes with validation and expiry
  const PROMO_CODES = {
    'BEZVA10': {
      type: 'percentage',
      value: 0.10,
      maxDiscount: 2000,
      minOrder: 5000,
      description: '10% sleva (max. 2000 Kč)',
      validUntil: new Date('2024-12-31')
    },
    'FREESHIP': {
      type: 'fixed',
      value: 300,
      description: 'Doprava zdarma',
      validUntil: new Date('2024-12-31')
    },
    'NOVINKY20': {
      type: 'percentage',
      value: 0.20,
      maxDiscount: 1500,
      minOrder: 3000,
      description: '20% sleva pro nové zákazníky',
      validUntil: new Date('2024-06-30')
    }
  };

  class CartManager {
    constructor() {
      this.sidebar = document.querySelector('[data-cart-sidebar]') || this.createSidebar();
      this.backdrop = this.sidebar.querySelector('[data-cart-close], .cart-backdrop');
      this.container = this.sidebar.querySelector('.cart-container');
      this.content = this.sidebar.querySelector('[data-cart-content]');
      this.totalEl = this.sidebar.querySelector('[data-cart-total]');
      this.countBadge = document.querySelector('[data-cart-count]');
      this.btnToggle = document.querySelector('[data-cart-toggle]');
      this.btnClear = this.sidebar.querySelector('[data-cart-clear]');
      this.btnCheckout = this.sidebar.querySelector('[data-cart-checkout]');
      this.btnClose = this.sidebar.querySelector('.cart-close');
      this.footer = this.sidebar.querySelector('[data-cart-footer]');

      // Enhanced elements
      this.subtotalEl = this.sidebar.querySelector('[data-cart-subtotal]');
      this.discountEl = this.sidebar.querySelector('[data-cart-discount]');
      this.promoSection = this.sidebar.querySelector('.promo-section');
      this.promoInput = this.sidebar.querySelector('[data-promo-input]');
      this.promoApply = this.sidebar.querySelector('[data-promo-apply]');
      this.promoRemove = this.sidebar.querySelector('[data-promo-remove]');

      // State management
      this.items = this.loadCart();
      this.promo = this.loadPromo();
      this.wishlist = this.loadWishlist();
      this.isOpen = false;
      this.isAnimating = false;
      this.lastFocused = null;
      
      // Touch/swipe handling
      this.touchStartX = 0;
      this.touchCurrentX = 0;
      this.isDragging = false;

      // Initialize
      this.init();
    }

    init() {
      this.bindEvents();
      this.render();
      this.updateBadge();
      this.dispatchCartUpdate();
      
      // Auto-save on page unload
      window.addEventListener('beforeunload', () => {
        this.saveCart();
        this.savePromo();
      });

      console.log('🛒 CartManager initialized with', this.items.length, 'items');
    }

    createSidebar() {
      const sidebar = document.createElement('div');
      sidebar.className = 'cart-sidebar';
      sidebar.setAttribute('data-cart-sidebar', '');
      sidebar.setAttribute('aria-hidden', 'true');
      
      sidebar.innerHTML = `
        <div class="cart-backdrop" data-cart-close></div>
        <div class="cart-container" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <header class="cart-header">
            <h2 id="cart-title">Košík</h2>
            <button class="cart-close" data-cart-close aria-label="Zavřít košík" type="button">×</button>
          </header>
          
          <div class="cart-content" data-cart-content>
            <!-- Content will be rendered here -->
          </div>
          
          <div class="promo-section" style="display: none;">
            <div class="promo-input-group">
              <input type="text" 
                     class="promo-input" 
                     data-promo-input 
                     placeholder="Zadejte promo kód" 
                     aria-label="Promo kód">
              <button type="button" 
                      class="btn btn-secondary btn-sm" 
                      data-promo-apply>
                Použít
              </button>
            </div>
            <div class="promo-active" style="display: none;" data-promo-active>
              <span class="promo-code" data-promo-code></span>
              <span class="promo-description" data-promo-description></span>
              <button type="button" 
                      class="promo-remove" 
                      data-promo-remove 
                      aria-label="Odebrat promo kód">×</button>
            </div>
          </div>
          
          <footer class="cart-footer" data-cart-footer>
            <div class="cart-summary">
              <div class="summary-row">
                <span>Mezisoučet:</span>
                <span data-cart-subtotal>0 Kč</span>
              </div>
              <div class="summary-row discount-row" style="display: none;" data-discount-row>
                <span>Sleva:</span>
                <span data-cart-discount>0 Kč</span>
              </div>
              <div class="summary-row total-row">
                <strong>Celkem:</strong>
                <strong data-cart-total>0 Kč</strong>
              </div>
            </div>
            <div class="cart-actions">
              <button type="button" class="btn btn-secondary" data-cart-clear>
                <span>Vyprázdnit</span>
              </button>
              <button type="button" class="btn btn-primary" data-cart-checkout>
                <span>Objednat</span>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </button>
            </div>
          </footer>
        </div>
      `;
      
      document.body.appendChild(sidebar);
      return sidebar;
    }

    bindEvents() {
      // Main toggle
      this.btnToggle?.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });

      // Close handlers
      const closeElements = [this.backdrop, this.btnClose];
      closeElements.forEach(el => {
        el?.addEventListener('click', (e) => {
          e.preventDefault();
          this.close();
        });
      });

      // Clear cart
      this.btnClear?.addEventListener('click', (e) => {
        e.preventDefault();
        this.clearCart();
      });

      // Checkout
      this.btnCheckout?.addEventListener('click', (e) => {
        e.preventDefault();
        this.checkout();
      });

      // Promo code handlers
      this.promoApply?.addEventListener('click', () => this.applyPromo());
      this.promoRemove?.addEventListener('click', () => this.removePromo());
      
      this.promoInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.applyPromo();
        }
      });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (!this.isOpen) return;
        
        switch (e.key) {
          case 'Escape':
            e.preventDefault();
            this.close();
            break;
          case 'Tab':
            this.handleTabNavigation(e);
            break;
        }
      });

      // Touch/swipe events for mobile
      this.attachTouchEvents();

      // Listen for product additions from other components
      document.addEventListener('cart:add', (e) => {
        this.add(e.detail);
      });

      document.addEventListener('cart:remove', (e) => {
        this.remove(e.detail.key);
      });
    }

    attachTouchEvents() {
      if (!this.container) return;

      this.container.addEventListener('touchstart', (e) => {
        this.touchStartX = e.touches[0].clientX;
        this.isDragging = false;
      }, { passive: true });

      this.container.addEventListener('touchmove', (e) => {
        this.touchCurrentX = e.touches[0].clientX;
        const deltaX = this.touchCurrentX - this.touchStartX;
        
        if (Math.abs(deltaX) > 10) {
          this.isDragging = true;
        }
        
        // Only allow swiping to the right (closing)
        if (deltaX > 0 && this.isDragging) {
          const progress = Math.min(deltaX / this.container.offsetWidth, 1);
          this.container.style.transform = `translateX(${deltaX}px)`;
          this.container.style.opacity = String(1 - progress * 0.5);
        }
      }, { passive: true });

      this.container.addEventListener('touchend', (e) => {
        if (!this.isDragging) return;
        
        const deltaX = this.touchCurrentX - this.touchStartX;
        const threshold = this.container.offsetWidth * 0.3;
        
        if (deltaX > threshold) {
          // Close cart
          this.close();
        } else {
          // Reset position
          this.container.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
          this.container.style.transform = 'translateX(0)';
          this.container.style.opacity = '1';
          
          setTimeout(() => {
            this.container.style.transition = '';
          }, 300);
        }
        
        this.isDragging = false;
      }, { passive: true });
    }

    // Public API methods
    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      if (this.isOpen || this.isAnimating) return;
      
      this.isAnimating = true;
      this.lastFocused = document.activeElement;
      
      this.sidebar.classList.add('active');
      this.sidebar.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      // Focus management
      requestAnimationFrame(() => {
        this.container?.focus();
        this.isOpen = true;
        this.isAnimating = false;
      });

      // Update promo section visibility
      this.updatePromoSection();
      
      this.announceToScreenReader(`Košík otevřen. ${this.getItemCount()} položek v košíku.`);
    }

    close() {
      if (!this.isOpen || this.isAnimating) return;
      
      this.isAnimating = true;
      
      this.sidebar.classList.remove('active');
      this.sidebar.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      
      // Reset any transform from touch
      this.container.style.transform = '';
      this.container.style.opacity = '';
      
      setTimeout(() => {
        this.isOpen = false;
        this.isAnimating = false;
        this.lastFocused?.focus?.();
      }, 300);
    }

    add(item) {
      const { id, name, price = 0, qty = 1, image = '', meta = {}, options = {} } = item;
      
      if (!id || !name) {
        console.warn('Invalid item data:', item);
        return false;
      }

      // Create unique key based on item and options
      const key = this.generateItemKey(id, meta, options);
      const existingItem = this.items.find(i => i.key === key);
      
      if (existingItem) {
        existingItem.qty += Number(qty);
        existingItem.updatedAt = new Date().toISOString();
      } else {
        this.items.push({
          key,
          id: String(id),
          name: String(name),
          price: Number(price) || 0,
          qty: Number(qty) || 1,
          image: String(image || ''),
          meta: { ...meta },
          options: { ...options },
          addedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      this.saveCart();
      this.render();
      this.updateBadge();
      this.dispatchCartUpdate();
      
      // Show success message
      this.showToast(`${name} přidán do košíku`, 'success');
      
      // Animate cart badge
      this.animateCartBadge();
      
      return true;
    }

    remove(key) {
      const itemIndex = this.items.findIndex(i => i.key === key);
      if (itemIndex === -1) return false;
      
      const removedItem = this.items[itemIndex];
      this.items.splice(itemIndex, 1);
      
      this.saveCart();
      this.render();
      this.updateBadge();
      this.dispatchCartUpdate();
      
      this.showToast(`${removedItem.name} odstraněn z košíku`, 'info');
      this.announceToScreenReader(`Položka ${removedItem.name} odstraněna z košíku`);
      
      return true;
    }

    updateQuantity(key, newQty) {
      const item = this.items.find(i => i.key === key);
      if (!item) return false;
      
      const qty = Math.max(1, Math.min(99, Number(newQty) || 1));
      const oldQty = item.qty;
      
      item.qty = qty;
      item.updatedAt = new Date().toISOString();
      
      this.saveCart();
      this.updateTotals();
      this.updateBadge();
      this.dispatchCartUpdate();
      
      if (qty !== oldQty) {
        this.announceToScreenReader(`Množství změněno na ${qty}`);
      }
      
      return true;
    }

    clearCart() {
      if (this.items.length === 0) {
        this.showToast('Košík je již prázdný', 'info');
        return;
      }

      if (!confirm('Opravdu chcete vyprázdnit košík?')) {
        return;
      }

      const itemCount = this.items.length;
      this.items = [];
      this.removePromo();
      
      this.saveCart();
      this.render();
      this.updateBadge();
      this.dispatchCartUpdate();
      
      this.showToast(`Košík vyprázdněn (${itemCount} položek odstraněno)`, 'info');
      this.announceToScreenReader('Košík byl vyprázdněn');
    }

    // Promo code management
    applyPromo() {
      const code = (this.promoInput?.value || '').trim().toUpperCase();
      
      if (!code) {
        this.showToast('Zadejte promo kód', 'error');
        return;
      }

      const promoData = PROMO_CODES[code];
      if (!promoData) {
        this.showToast('Neplatný promo kód', 'error');
        this.promoInput && (this.promoInput.value = '');
        return;
      }

      // Check expiry
      if (promoData.validUntil && new Date() > promoData.validUntil) {
        this.showToast('Promo kód již vypršel', 'error');
        this.promoInput && (this.promoInput.value = '');
        return;
      }

      // Check minimum order
      const subtotal = this.calculateSubtotal();
      if (promoData.minOrder && subtotal < promoData.minOrder) {
        this.showToast(`Minimální objednávka pro tento kód je ${this.formatPrice(promoData.minOrder)}`, 'error');
        return;
      }

      this.promo = { code, ...promoData };
      this.savePromo();
      this.updateTotals();
      this.updatePromoSection();
      
      this.showToast(`Promo kód ${code} aplikován!`, 'success');
      this.announceToScreenReader(`Promo kód aplikován. ${promoData.description}`);
    }

    removePromo() {
      if (!this.promo) return;
      
      const oldCode = this.promo.code;
      this.promo = null;
      this.savePromo();
      this.updateTotals();
      this.updatePromoSection();
      
      this.showToast(`Promo kód ${oldCode} odebrán`, 'info');
      this.announceToScreenReader('Promo kód odebrán');
    }

    // Checkout process
    checkout() {
      if (this.items.length === 0) {
        this.showToast('Košík je prázdný', 'error');
        return;
      }

      // Create checkout data
      const checkoutData = {
        items: this.items.map(item => ({ ...item })),
        promo: this.promo ? { ...this.promo } : null,
        totals: this.calculateTotals(),
        timestamp: new Date().toISOString()
      };

      // Dispatch checkout event for external handlers
      const checkoutEvent = new CustomEvent('cart:checkout', {
        detail: checkoutData,
        bubbles: true
      });
      
      document.dispatchEvent(checkoutEvent);
      
      // Default behavior - could be overridden by event listeners
      if (!checkoutEvent.defaultPrevented) {
        this.showToast('Pokračujeme k objednávce...', 'success');
        console.log('Checkout data:', checkoutData);
        
        // Example: redirect to checkout page
        // window.location.href = '/checkout';
        
        // Or open checkout modal
        // window.checkoutModal?.open?.(checkoutData);
      }
    }

    // Rendering methods
    render() {
      if (!this.content) return;
      
      if (this.items.length === 0) {
        this.renderEmptyState();
      } else {
        this.renderItems();
      }
      
      this.updateTotals();
      this.updatePromoSection();
    }

    renderEmptyState() {
      this.content.innerHTML = `
        <div class="cart-empty">
          <div class="empty-icon">🛒</div>
          <h3>Váš košík je prázdný</h3>
          <p>Přidejte si atrakce z našeho katalogu a začněte plánovat skvělou akci!</p>
          <button type="button" class="btn btn-primary" data-cart-close>
            Procházet katalog
          </button>
        </div>
      `;
      
      // Hide footer when empty
      if (this.footer) {
        this.footer.style.display = 'none';
      }
      
      // Bind close button
      this.content.querySelector('[data-cart-close]')?.addEventListener('click', () => {
        this.close();
      });
    }

    renderItems() {
      this.content.innerHTML = this.items.map(item => this.renderItem(item)).join('');
      this.bindItemEvents();
      
      // Show footer
      if (this.footer) {
        this.footer.style.display = '';
      }
    }

    renderItem(item) {
      const metaParts = this.formatItemMeta(item.meta);
      const optionsParts = this.formatItemOptions(item.options);
      const totalPrice = item.price * item.qty;
      
      return `
        <div class="cart-item" data-key="${this.escapeHtml(item.key)}" role="article">
          <div class="cart-item-image">
            <img src="${this.escapeHtml(item.image || '/assets/placeholder.jpg')}" 
                 alt="${this.escapeHtml(item.name)}" 
                 loading="lazy" 
                 width="80" 
                 height="80">
          </div>
          
          <div class="cart-item-details">
            <h3 class="cart-item-name">${this.escapeHtml(item.name)}</h3>
            ${metaParts ? `<div class="cart-item-meta">${metaParts}</div>` : ''}
            ${optionsParts ? `<div class="cart-item-options">${optionsParts}</div>` : ''}
            <div class="cart-item-price">${this.formatPrice(item.price)}</div>
          </div>
          
          <div class="cart-item-controls">
            <div class="quantity-controls">
              <button type="button" 
                      class="qty-btn qty-decrease" 
                      data-action="decrease" 
                      aria-label="Snížit množství"
                      ${item.qty <= 1 ? 'disabled' : ''}>−</button>
              <input type="number" 
                     class="qty-input" 
                     value="${item.qty}" 
                     min="1" 
                     max="99" 
                     aria-label="Množství">
              <button type="button" 
                      class="qty-btn qty-increase" 
                      data-action="increase" 
                      aria-label="Zvýšit množství"
                      ${item.qty >= 99 ? 'disabled' : ''}>+</button>
            </div>
            
            <div class="cart-item-total">
              ${this.formatPrice(totalPrice)}
            </div>
            
            <button type="button" 
                    class="cart-item-remove" 
                    data-action="remove" 
                    aria-label="Odebrat ${this.escapeHtml(item.name)}">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>
      `;
    }

    bindItemEvents() {
      this.content.querySelectorAll('.cart-item').forEach(itemEl => {
        const key = itemEl.dataset.key;
        if (!key) return;

        // Quantity controls
        itemEl.querySelector('.qty-decrease')?.addEventListener('click', () => {
          const item = this.items.find(i => i.key === key);
          if (item && item.qty > 1) {
            this.updateQuantity(key, item.qty - 1);
            this.updateItemDisplay(itemEl, item);
          }
        });

        itemEl.querySelector('.qty-increase')?.addEventListener('click', () => {
          const item = this.items.find(i => i.key === key);
          if (item && item.qty < 99) {
            this.updateQuantity(key, item.qty + 1);
            this.updateItemDisplay(itemEl, item);
          }
        });

        // Direct quantity input
        const qtyInput = itemEl.querySelector('.qty-input');
        qtyInput?.addEventListener('change', (e) => {
          const newQty = parseInt(e.target.value) || 1;
          this.updateQuantity(key, newQty);
          const item = this.items.find(i => i.key === key);
          if (item) {
            this.updateItemDisplay(itemEl, item);
          }
        });

        // Remove item
        itemEl.querySelector('.cart-item-remove')?.addEventListener('click', () => {
          if (confirm('Opravdu chcete odebrat tuto položku z košíku?')) {
            this.remove(key);
          }
        });
      });
    }

    updateItemDisplay(itemEl, item) {
      const qtyInput = itemEl.querySelector('.qty-input');
      const totalEl = itemEl.querySelector('.cart-item-total');
      const decreaseBtn = itemEl.querySelector('.qty-decrease');
      const increaseBtn = itemEl.querySelector('.qty-increase');

      if (qtyInput) qtyInput.value = item.qty;
      if (totalEl) totalEl.textContent = this.formatPrice(item.price * item.qty);
      if (decreaseBtn) decreaseBtn.disabled = item.qty <= 1;
      if (increaseBtn) increaseBtn.disabled = item.qty >= 99;
    }

    // Calculation methods
    calculateSubtotal() {
      return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    calculateDiscount(subtotal) {
      if (!this.promo) return 0;

      let discount = 0;
      const { type, value, maxDiscount } = this.promo;

      if (type === 'percentage') {
        discount = subtotal * value;
        if (maxDiscount) {
          discount = Math.min(discount, maxDiscount);
        }
      } else if (type === 'fixed') {
        discount = value;
      }

      return Math.min(discount, subtotal);
    }

    calculateTotals() {
      const subtotal = this.calculateSubtotal();
      const discount = this.calculateDiscount(subtotal);
      const total = Math.max(0, subtotal - discount);

      return {
        subtotal,
        discount,
        total,
        itemCount: this.getItemCount()
      };
    }

    updateTotals() {
      const totals = this.calculateTotals();

      if (this.subtotalEl) {
        this.subtotalEl.textContent = this.formatPrice(totals.subtotal);
      }

      if (this.discountEl) {
        this.discountEl.textContent = this.formatPrice(totals.discount);
      }

      if (this.totalEl) {
        this.totalEl.textContent = this.formatPrice(totals.total);
      }

      // Show/hide discount row
      const discountRow = this.sidebar.querySelector('[data-discount-row]');
      if (discountRow) {
        discountRow.style.display = totals.discount > 0 ? '' : 'none';
      }

      // Update checkout button state
      if (this.btnCheckout) {
        this.btnCheckout.disabled = this.items.length === 0;
      }
    }

    updatePromoSection() {
      if (!this.promoSection) return;

      const activePromo = this.sidebar.querySelector('[data-promo-active]');
      const codeEl = this.sidebar.querySelector('[data-promo-code]');
      const descriptionEl = this.sidebar.querySelector('[data-promo-description]');

      if (this.items.length === 0) {
        this.promoSection.style.display = 'none';
        return;
      }

      this.promoSection.style.display = '';

      if (this.promo) {
        // Show active promo
        if (activePromo) activePromo.style.display = '';
        if (this.promoInput) this.promoInput.style.display = 'none';
        if (this.promoApply) this.promoApply.style.display = 'none';

        if (codeEl) codeEl.textContent = this.promo.code;
        if (descriptionEl) descriptionEl.textContent = this.promo.description || '';
      } else {
        // Show input form
        if (activePromo) activePromo.style.display = 'none';
        if (this.promoInput) this.promoInput.style.display = '';
        if (this.promoApply) this.promoApply.style.display = '';
      }
    }

    updateBadge() {
      const count = this.getItemCount();
      
      if (this.countBadge) {
        this.countBadge.textContent = String(count);
        this.countBadge.style.display = count > 0 ? '' : 'none';
      }
    }

    // Utility methods
    generateItemKey(id, meta = {}, options = {}) {
      const keyData = {
        id: String(id),
        meta: JSON.stringify(meta || {}),
        options: JSON.stringify(options || {})
      };
      return btoa(JSON.stringify(keyData)).replace(/[+/=]/g, '');
    }

    formatItemMeta(meta) {
      if (!meta || typeof meta !== 'object') return '';
      
      const parts = [];
      if (meta.date) parts.push(`📅 ${meta.date}`);
      if (meta.time) parts.push(`🕐 ${meta.time}`);
      if (meta.duration) parts.push(`⏱️ ${meta.duration}`);
      if (meta.participants) parts.push(`👥 ${meta.participants} osob`);
      
      return parts.join(' • ');
    }

    formatItemOptions(options) {
      if (!options || typeof options !== 'object') return '';
      
      const parts = [];
      if (Array.isArray(options.services)) {
        options.services.forEach(service => {
          parts.push(`+ ${service.name} (${this.formatPrice(service.price)})`);
        });
      }
      
      return parts.join('<br>');
    }

    getItemCount() {
      return this.items.reduce((sum, item) => sum + item.qty, 0);
    }

    formatPrice(price) {
      const num = Number(price) || 0;
      return `${num.toLocaleString('cs-CZ')} Kč`;
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Storage methods
    loadCart() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.warn('Failed to load cart from storage:', error);
        return [];
      }
    }

    saveCart() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
      } catch (error) {
        console.warn('Failed to save cart to storage:', error);
      }
    }

    loadPromo() {
      try {
        const stored = localStorage.getItem(PROMO_KEY);
        return stored ? JSON.parse(stored) : null;
      } catch (error) {
        console.warn('Failed to load promo from storage:', error);
        return null;
      }
    }

    savePromo() {
      try {
        if (this.promo) {
          localStorage.setItem(PROMO_KEY, JSON.stringify(this.promo));
        } else {
          localStorage.removeItem(PROMO_KEY);
        }
      } catch (error) {
        console.warn('Failed to save promo to storage:', error);
      }
    }

    loadWishlist() {
      try {
        const stored = localStorage.getItem(WISHLIST_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.warn('Failed to load wishlist from storage:', error);
        return [];
      }
    }

    saveWishlist() {
      try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(this.wishlist));
      } catch (error) {
        console.warn('Failed to save wishlist to storage:', error);
      }
    }

    // Animation and feedback methods
    animateCartBadge() {
      if (!this.countBadge) return;
      
      this.countBadge.classList.remove('pulse');
      requestAnimationFrame(() => {
        this.countBadge.classList.add('pulse');
        setTimeout(() => {
          this.countBadge.classList.remove('pulse');
        }, 600);
      });
    }

    showToast(message, type = 'info') {
      if (window.toasts?.show) {
        window.toasts.show({
          title: type === 'error' ? 'Chyba' : 
                 type === 'success' ? 'Hotovo' : 
                 type === 'warning' ? 'Pozor' : 'Info',
          message,
          type,
          timeout: type === 'error' ? 5000 : 3000
        });
      } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
      }
    }

    announceToScreenReader(message) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    }

    // Focus management
    handleTabNavigation(event) {
      if (!this.isOpen) return;
      
      const focusableElements = this.container.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      
      const focusableArray = Array.from(focusableElements);
      const firstFocusable = focusableArray[0];
      const lastFocusable = focusableArray[focusableArray.length - 1];
      
      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable?.focus();
        }
      }
    }

    // Event dispatching
    dispatchCartUpdate() {
      const detail = {
        items: [...this.items],
        itemCount: this.getItemCount(),
        totals: this.calculateTotals(),
        promo: this.promo ? { ...this.promo } : null
      };

      const event = new CustomEvent('cart:updated', {
        detail,
        bubbles: true
      });

      document.dispatchEvent(event);
    }

    // Wishlist functionality
    addToWishlist(productId) {
      if (!this.wishlist.includes(productId)) {
        this.wishlist.push(productId);
        this.saveWishlist();
        this.showToast('Přidáno do oblíbených', 'success');
        
        // Dispatch wishlist event
        document.dispatchEvent(new CustomEvent('wishlist:added', {
          detail: { productId },
          bubbles: true
        }));
      }
    }

    removeFromWishlist(productId) {
      const index = this.wishlist.indexOf(productId);
      if (index > -1) {
        this.wishlist.splice(index, 1);
        this.saveWishlist();
        this.showToast('Odstraněno z oblíbených', 'info');
        
        // Dispatch wishlist event
        document.dispatchEvent(new CustomEvent('wishlist:removed', {
          detail: { productId },
          bubbles: true
        }));
      }
    }

    isInWishlist(productId) {
      return this.wishlist.includes(productId);
    }

    // Analytics and tracking
    trackEvent(eventName, data = {}) {
      // Google Analytics 4 / Google Tag Manager
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
          event_category: 'ecommerce',
          event_label: data.label || '',
          value: data.value || 0,
          ...data
        });
      }

      // Facebook Pixel
      if (typeof fbq !== 'undefined') {
        fbq('track', eventName, data);
      }

      // Custom analytics
      console.log('Cart Event:', eventName, data);
    }

    // Advanced features
    getRecommendations() {
      // Based on items in cart, return recommended products
      const currentCategories = [...new Set(this.items.map(item => item.meta?.category).filter(Boolean))];
      
      // This would integrate with your product manager
      if (window.productManager) {
        return currentCategories.flatMap(category => 
          window.productManager.filter({ 
            category, 
            limit: 2,
            availableOnly: true 
          })
        ).slice(0, 4);
      }
      
      return [];
    }

    getCartSummary() {
      return {
        items: this.items.map(item => ({
          id: item.id,
          name: item.name,
          qty: item.qty,
          price: item.price,
          total: item.price * item.qty
        })),
        totals: this.calculateTotals(),
        promo: this.promo,
        isEmpty: this.items.length === 0,
        createdAt: new Date().toISOString()
      };
    }

    // Export/Import functionality
    exportCart() {
      const cartData = {
        items: this.items,
        promo: this.promo,
        wishlist: this.wishlist,
        exportDate: new Date().toISOString(),
        version: '2.0'
      };

      const blob = new Blob([JSON.stringify(cartData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `bezva-parta-kosik-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
      this.showToast('Košík exportován', 'success');
    }

    importCart(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const cartData = JSON.parse(e.target.result);
          
          if (cartData.version && cartData.items) {
            if (confirm('Importovat košík? Současný obsah bude nahrazen.')) {
              this.items = cartData.items || [];
              this.promo = cartData.promo || null;
              this.wishlist = cartData.wishlist || [];
              
              this.saveCart();
              this.savePromo();
              this.saveWishlist();
              
              this.render();
              this.updateBadge();
              this.dispatchCartUpdate();
              
              this.showToast('Košík importován', 'success');
            }
          } else {
            this.showToast('Neplatný formát souboru', 'error');
          }
        } catch (error) {
          console.error('Import error:', error);
          this.showToast('Chyba při importu', 'error');
        }
      };
      reader.readAsText(file);
    }

    // Public API for external access
    getPublicAPI() {
      return {
        // State
        isOpen: () => this.isOpen,
        getItems: () => [...this.items],
        getItemCount: () => this.getItemCount(),
        getTotals: () => this.calculateTotals(),
        getPromo: () => this.promo ? { ...this.promo } : null,
        
        // Actions
        open: () => this.open(),
        close: () => this.close(),
        toggle: () => this.toggle(),
        add: (item) => this.add(item),
        remove: (key) => this.remove(key),
        updateQuantity: (key, qty) => this.updateQuantity(key, qty),
        clear: () => this.clearCart(),
        
        // Promo
        applyPromo: (code) => {
          if (this.promoInput) this.promoInput.value = code;
          this.applyPromo();
        },
        removePromo: () => this.removePromo(),
        
        // Wishlist
        addToWishlist: (productId) => this.addToWishlist(productId),
        removeFromWishlist: (productId) => this.removeFromWishlist(productId),
        isInWishlist: (productId) => this.isInWishlist(productId),
        
        // Utilities
        getSummary: () => this.getCartSummary(),
        export: () => this.exportCart(),
        import: (file) => this.importCart(file)
      };
    }
  }

  // Auto-initialize when DOM is ready
  function initCart() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        window.cartManager = new CartManager();
        window.cart = window.cartManager.getPublicAPI();
      });
    } else {
      window.cartManager = new CartManager();
      window.cart = window.cartManager.getPublicAPI();
    }
  }

  // Initialize
  initCart();

  // Expose utilities for debugging
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.CartUtils = {
      PROMO_CODES,
      formatPrice: (price) => `${Number(price).toLocaleString('cs-CZ')} Kč`,
      generateKey: (id, meta, options) => {
        const keyData = { id: String(id), meta: JSON.stringify(meta || {}), options: JSON.stringify(options || {}) };
        return btoa(JSON.stringify(keyData)).replace(/[+/=]/g, '');
      }
    };
  }

})();