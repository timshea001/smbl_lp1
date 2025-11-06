/**
 * SMBL Foundation Collection Landing Pages
 * Shared JavaScript functionality
 */

// Analytics & Tracking
const Analytics = {
  // Initialize tracking pixels
  init() {
    this.initGoogleAnalytics();
    this.initMetaPixel();
  },

  // Google Analytics 4
  initGoogleAnalytics() {
    // Add your GA4 measurement ID here
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){dataLayer.push(arguments);}
    // gtag('js', new Date());
    // gtag('config', 'G-XXXXXXXXXX');
  },

  // Meta Pixel
  initMetaPixel() {
    // Add your Meta Pixel ID here
    // !function(f,b,e,v,n,t,s)
    // {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    // n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    // if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    // n.queue=[];t=b.createElement(e);t.async=!0;
    // t.src=v;s=b.getElementsByTagName(e)[0];
    // s.parentNode.insertBefore(t,s)}(window, document,'script',
    // 'https://connect.facebook.net/en_US/fbevents.js');
    // fbq('init', 'YOUR_PIXEL_ID');
    // fbq('track', 'PageView');
  },

  // Track page view
  trackPageView() {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view');
    }
    if (typeof fbq !== 'undefined') {
      fbq('track', 'PageView');
    }
  },

  // Track product view
  trackProductView(productData) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'view_item', {
        items: [productData]
      });
    }
    if (typeof fbq !== 'undefined') {
      fbq('track', 'ViewContent', {
        content_name: productData.name,
        content_ids: [productData.id],
        content_type: 'product',
        value: productData.price,
        currency: 'USD'
      });
    }
  },

  // Track add to cart
  trackAddToCart(productData) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'add_to_cart', {
        items: [productData]
      });
    }
    if (typeof fbq !== 'undefined') {
      fbq('track', 'AddToCart', {
        content_name: productData.name,
        content_ids: [productData.id],
        content_type: 'product',
        value: productData.price,
        currency: 'USD'
      });
    }
  },

  // Track begin checkout
  trackBeginCheckout(cartData) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'begin_checkout', {
        items: cartData.items,
        value: cartData.value,
        currency: 'USD'
      });
    }
    if (typeof fbq !== 'undefined') {
      fbq('track', 'InitiateCheckout', {
        content_ids: cartData.items.map(item => item.id),
        contents: cartData.items,
        value: cartData.value,
        currency: 'USD'
      });
    }
  }
};

// Lazy Loading for Images
const LazyLoad = {
  init() {
    const images = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    } else {
      // Fallback for browsers without IntersectionObserver
      images.forEach(img => {
        img.src = img.dataset.src;
        img.classList.add('loaded');
      });
    }
  }
};

// Size Selector Component
const SizeSelector = {
  init() {
    const sizeButtons = document.querySelectorAll('.size-option');

    sizeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        // Remove active class from siblings
        const parent = button.parentElement;
        parent.querySelectorAll('.size-option').forEach(btn => {
          btn.classList.remove('active');
        });

        // Add active class to clicked button
        button.classList.add('active');

        // Update hidden input value
        const sizeInput = parent.querySelector('input[name="size"]');
        if (sizeInput) {
          sizeInput.value = button.dataset.size;
        }

        // Enable add to cart button
        this.validateSelection();
      });
    });
  },

  validateSelection() {
    const addToCartBtn = document.querySelector('.btn-add-to-cart');
    const sizeSelected = document.querySelector('.size-option.active');
    const colorSelected = document.querySelector('.color-option.active');

    if (addToCartBtn && sizeSelected && colorSelected) {
      addToCartBtn.disabled = false;
      addToCartBtn.classList.remove('disabled');
    }
  }
};

// Color Selector Component
const ColorSelector = {
  init() {
    const colorButtons = document.querySelectorAll('.color-option');

    colorButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        // Remove active class from siblings
        const parent = button.parentElement;
        parent.querySelectorAll('.color-option').forEach(btn => {
          btn.classList.remove('active');
        });

        // Add active class to clicked button
        button.classList.add('active');

        // Update hidden input value
        const colorInput = parent.querySelector('input[name="color"]');
        if (colorInput) {
          colorInput.value = button.dataset.color;
        }

        // Update product image if data attribute exists
        if (button.dataset.image) {
          const productImage = document.querySelector('.product-hero-image');
          if (productImage) {
            productImage.src = button.dataset.image;
          }
        }

        // Enable add to cart button
        SizeSelector.validateSelection();
      });
    });
  }
};

// Quantity Selector Component
const QuantitySelector = {
  init() {
    const minusButtons = document.querySelectorAll('.qty-minus');
    const plusButtons = document.querySelectorAll('.qty-plus');

    minusButtons.forEach(button => {
      button.addEventListener('click', () => {
        const input = button.parentElement.querySelector('.qty-input');
        const currentValue = parseInt(input.value);
        const minValue = parseInt(input.min) || 1;

        if (currentValue > minValue) {
          input.value = currentValue - 1;
        }
      });
    });

    plusButtons.forEach(button => {
      button.addEventListener('click', () => {
        const input = button.parentElement.querySelector('.qty-input');
        const currentValue = parseInt(input.value);
        const maxValue = parseInt(input.max) || 10;

        if (currentValue < maxValue) {
          input.value = currentValue + 1;
        }
      });
    });
  }
};

// Add to Cart Handler
const AddToCart = {
  init() {
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');

    addToCartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();

        const productData = this.getProductData(button);

        if (this.validate(productData)) {
          this.add(productData);
        }
      });
    });
  },

  getProductData(button) {
    const form = button.closest('form') || button.closest('.product-card');

    return {
      id: form?.dataset.productId || '',
      name: form?.dataset.productName || '',
      price: parseFloat(form?.dataset.productPrice || '0'),
      size: form?.querySelector('input[name="size"]')?.value || '',
      color: form?.querySelector('input[name="color"]')?.value || '',
      quantity: parseInt(form?.querySelector('.qty-input')?.value || '1')
    };
  },

  validate(productData) {
    if (!productData.size) {
      alert('Please select a size');
      return false;
    }

    if (!productData.color) {
      alert('Please select a color');
      return false;
    }

    return true;
  },

  add(productData) {
    // Track analytics
    Analytics.trackAddToCart(productData);

    // In production, this would integrate with Shopify or your cart system
    console.log('Adding to cart:', productData);

    // Show success message
    this.showSuccessMessage();

    // Redirect to cart or show cart modal
    // window.location.href = '/cart';
  },

  showSuccessMessage() {
    // Create and show a temporary success message
    const message = document.createElement('div');
    message.className = 'cart-success-message';
    message.textContent = 'Added to cart!';
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--color-success);
      color: white;
      padding: 16px 24px;
      border-radius: 4px;
      z-index: 9999;
      animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(message);

    setTimeout(() => {
      message.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => message.remove(), 300);
    }, 2000);
  }
};

// Countdown Timer
const CountdownTimer = {
  init(endDate) {
    const timerElements = document.querySelectorAll('.countdown-timer');

    if (timerElements.length === 0) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = endDate - now;

      if (distance < 0) {
        timerElements.forEach(el => {
          el.innerHTML = '<span class="expired">Sale Ended</span>';
        });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      timerElements.forEach(el => {
        el.innerHTML = `
          <span class="time-unit"><span class="time-value">${days}</span><span class="time-label">d</span></span>
          <span class="time-separator">:</span>
          <span class="time-unit"><span class="time-value">${hours}</span><span class="time-label">h</span></span>
          <span class="time-separator">:</span>
          <span class="time-unit"><span class="time-value">${minutes}</span><span class="time-label">m</span></span>
          <span class="time-separator">:</span>
          <span class="time-unit"><span class="time-value">${seconds}</span><span class="time-label">s</span></span>
        `;
      });
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }
};

// Bundle Builder (Lander C)
const BundleBuilder = {
  selectedItems: [],
  minItems: 3,
  discount: 0.25,

  init() {
    const bundleCheckboxes = document.querySelectorAll('.bundle-item-checkbox');

    bundleCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.updateSelection();
      });
    });

    this.updateSelection();
  },

  updateSelection() {
    const checkboxes = document.querySelectorAll('.bundle-item-checkbox:checked');
    this.selectedItems = Array.from(checkboxes).map(cb => ({
      id: cb.dataset.productId,
      name: cb.dataset.productName,
      price: parseFloat(cb.dataset.productPrice)
    }));

    this.updateSummary();
  },

  updateSummary() {
    const itemCount = this.selectedItems.length;
    const originalTotal = this.selectedItems.reduce((sum, item) => sum + item.price, 0);
    const discount = itemCount >= this.minItems ? originalTotal * this.discount : 0;
    const bundlePrice = originalTotal - discount;

    // Update UI elements
    const itemCountEl = document.querySelector('.bundle-item-count');
    const originalTotalEl = document.querySelector('.bundle-original-total');
    const savingsEl = document.querySelector('.bundle-savings');
    const bundlePriceEl = document.querySelector('.bundle-price');
    const addBundleBtn = document.querySelector('.btn-add-bundle');

    if (itemCountEl) itemCountEl.textContent = itemCount;
    if (originalTotalEl) originalTotalEl.textContent = `$${originalTotal.toFixed(2)}`;
    if (savingsEl) savingsEl.textContent = `-$${discount.toFixed(2)}`;
    if (bundlePriceEl) bundlePriceEl.textContent = `$${bundlePrice.toFixed(2)}`;

    // Enable/disable add to cart button
    if (addBundleBtn) {
      if (itemCount >= this.minItems) {
        addBundleBtn.disabled = false;
        addBundleBtn.classList.remove('disabled');
      } else {
        addBundleBtn.disabled = true;
        addBundleBtn.classList.add('disabled');
      }
    }
  }
};

// Smooth Scroll
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }
};

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  Analytics.init();
  LazyLoad.init();
  SizeSelector.init();
  ColorSelector.init();
  QuantitySelector.init();
  AddToCart.init();
  SmoothScroll.init();

  // Initialize countdown timer (set to Black Friday end date)
  // Example: November 29, 2024, 23:59:59
  const saleEndDate = new Date('2024-11-29T23:59:59').getTime();
  CountdownTimer.init(saleEndDate);

  // Initialize bundle builder if on Lander C
  if (document.querySelector('.bundle-builder')) {
    BundleBuilder.init();
  }

  // Track page view
  Analytics.trackPageView();
});
