/**
 * Arthentix - Error Handler & Safe DOM Utilities
 * Global error catching and defensive DOM operations
 */

// ============================================
// GLOBAL ERROR HANDLER
// ============================================

window.onerror = function(message, source, lineno, colno, error) {
    console.error('Arthentix Error:', {
        message,
        source,
        line: lineno,
        column: colno,
        error
    });
    // Prevent error from bubbling in production
    return true;
};

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    event.preventDefault();
});

// ============================================
// SAFE DOM UTILITIES
// ============================================

const SafeDOM = {
    /**
     * Safely query a single element
     * @param {string} selector - CSS selector
     * @param {Element} context - Optional context element
     * @returns {Element|null}
     */
    query(selector, context = document) {
        try {
            return context.querySelector(selector);
        } catch (e) {
            console.warn(`SafeDOM.query: Invalid selector "${selector}"`, e);
            return null;
        }
    },

    /**
     * Safely query multiple elements
     * @param {string} selector - CSS selector
     * @param {Element} context - Optional context element
     * @returns {NodeList}
     */
    queryAll(selector, context = document) {
        try {
            return context.querySelectorAll(selector);
        } catch (e) {
            console.warn(`SafeDOM.queryAll: Invalid selector "${selector}"`, e);
            return [];
        }
    },

    /**
     * Safely get element by ID
     * @param {string} id - Element ID
     * @returns {Element|null}
     */
    byId(id) {
        return document.getElementById(id);
    },

    /**
     * Safely add event listener with automatic cleanup
     * @param {Element|string} target - Element or selector
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     * @param {Object} options - Event options
     * @returns {Function} Cleanup function
     */
    on(target, event, handler, options = {}) {
        const element = typeof target === 'string' ? this.query(target) : target;

        if (!element) {
            console.warn(`SafeDOM.on: Element not found for "${target}"`);
            return () => {};
        }

        element.addEventListener(event, handler, options);

        // Return cleanup function
        return () => element.removeEventListener(event, handler, options);
    },

    /**
     * Safely add class to element
     * @param {Element|string} target - Element or selector
     * @param {...string} classes - Classes to add
     */
    addClass(target, ...classes) {
        const element = typeof target === 'string' ? this.query(target) : target;
        if (element) {
            element.classList.add(...classes);
        }
    },

    /**
     * Safely remove class from element
     * @param {Element|string} target - Element or selector
     * @param {...string} classes - Classes to remove
     */
    removeClass(target, ...classes) {
        const element = typeof target === 'string' ? this.query(target) : target;
        if (element) {
            element.classList.remove(...classes);
        }
    },

    /**
     * Safely toggle class on element
     * @param {Element|string} target - Element or selector
     * @param {string} className - Class to toggle
     * @param {boolean} force - Optional force state
     */
    toggleClass(target, className, force) {
        const element = typeof target === 'string' ? this.query(target) : target;
        if (element) {
            element.classList.toggle(className, force);
        }
    },

    /**
     * Safely set attribute
     * @param {Element|string} target - Element or selector
     * @param {string} name - Attribute name
     * @param {string} value - Attribute value
     */
    setAttr(target, name, value) {
        const element = typeof target === 'string' ? this.query(target) : target;
        if (element) {
            element.setAttribute(name, value);
        }
    },

    /**
     * Safely get attribute
     * @param {Element|string} target - Element or selector
     * @param {string} name - Attribute name
     * @returns {string|null}
     */
    getAttr(target, name) {
        const element = typeof target === 'string' ? this.query(target) : target;
        return element ? element.getAttribute(name) : null;
    },

    /**
     * Safely set text content
     * @param {Element|string} target - Element or selector
     * @param {string} text - Text content
     */
    setText(target, text) {
        const element = typeof target === 'string' ? this.query(target) : target;
        if (element) {
            element.textContent = text;
        }
    },

    /**
     * Safely set HTML content
     * @param {Element|string} target - Element or selector
     * @param {string} html - HTML content
     */
    setHTML(target, html) {
        const element = typeof target === 'string' ? this.query(target) : target;
        if (element) {
            element.innerHTML = html;
        }
    },

    /**
     * Safely set style property
     * @param {Element|string} target - Element or selector
     * @param {string} property - CSS property
     * @param {string} value - CSS value
     */
    setStyle(target, property, value) {
        const element = typeof target === 'string' ? this.query(target) : target;
        if (element) {
            element.style[property] = value;
        }
    },

    /**
     * Execute callback only when element exists
     * @param {string} selector - CSS selector
     * @param {Function} callback - Callback to execute
     */
    whenExists(selector, callback) {
        const element = this.query(selector);
        if (element) {
            callback(element);
        }
    },

    /**
     * Execute callback for each matching element
     * @param {string} selector - CSS selector
     * @param {Function} callback - Callback to execute
     */
    forEach(selector, callback) {
        const elements = this.queryAll(selector);
        elements.forEach(callback);
    }
};

// ============================================
// SAFE UTILITY CHECK
// ============================================

/**
 * Check if ArthentixUtils is available and execute callback
 * @param {Function} callback - Function to call with ArthentixUtils
 */
function withArthentixUtils(callback) {
    if (typeof ArthentixUtils !== 'undefined') {
        callback(ArthentixUtils);
    } else {
        console.warn('ArthentixUtils not available');
    }
}

/**
 * Safely show toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type (success, error, info)
 */
function safeToast(message, type = 'success') {
    withArthentixUtils((utils) => {
        utils.showToast(message, type);
    });
}

// ============================================
// DEBOUNCE & THROTTLE UTILITIES
// ============================================

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function}
 */
function debounce(func, wait = 250) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum time between calls in ms
 * @returns {Function}
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// FEATURE DETECTION
// ============================================

const Features = {
    // Check for touch support
    touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,

    // Check for reduced motion preference
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,

    // Check for dark mode preference
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,

    // Check for localStorage support
    localStorage: (() => {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    })(),

    // Check for IntersectionObserver support
    intersectionObserver: 'IntersectionObserver' in window,

    // Check for smooth scroll support
    smoothScroll: 'scrollBehavior' in document.documentElement.style
};

// ============================================
// EXPORT UTILITIES
// ============================================

window.SafeDOM = SafeDOM;
window.withArthentixUtils = withArthentixUtils;
window.safeToast = safeToast;
window.debounce = debounce;
window.throttle = throttle;
window.Features = Features;
