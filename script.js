/* ================================
   MOBILE MENU FUNCTIONALITY
   ================================ */

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const starfield = document.getElementById('starfield');

function isMobileNav() {
    return window.innerWidth <= 768;
}

function closeMobileMenu() {
    navLinks.classList.remove('nav-open');
}

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        if (isMobileNav()) {
            navLinks.classList.toggle('nav-open');
        }
    });
}

/* ================================
   DYNAMIC STARFIELD
   ================================ */

function createStarfield() {
    if (!starfield || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const starCount = window.innerWidth < 768 ? 55 : 95;
    starfield.innerHTML = '';

    for (let i = 0; i < starCount; i += 1) {
        const star = document.createElement('span');
        const size = Math.random() * 3 + 1;
        const duration = Math.random() * 6 + 4;
        const delay = Math.random() * 8;
        const drift = Math.random() * 80 - 40;

        star.className = 'star';
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.setProperty('--twinkle-duration', `${duration}s`);
        star.style.setProperty('--twinkle-delay', `${delay}s`);
        star.style.setProperty('--star-drift', `${drift}px`);
        starfield.appendChild(star);
    }
}

createStarfield();
window.addEventListener('resize', createStarfield);

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (isMobileNav()) {
            closeMobileMenu();
        }
    });
});

/* ================================
   NAVBAR SCROLL EFFECT
   ================================ */

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

/* ================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

/* ================================
   INTERSECTION OBSERVER - SCROLL ANIMATIONS
   ================================ */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe skill categories, project cards, and timeline items
document.querySelectorAll('.skill-category, .project-card, .timeline-item, .stat').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

/* ================================
   ACTIVE NAV LINK ON SCROLL
   ================================ */

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.style.color = '';
        if (item.getAttribute('href').slice(1) === current) {
            item.style.color = 'var(--primary)';
        }
    });
});

/* ================================
   STATS COUNTER ANIMATION
   ================================ */

function animateCounters() {
    const stats = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                
                // Extract number from text (handle cases like "50+", "35%", "1")
                const numMatch = finalValue.match(/\d+/);
                if (numMatch) {
                    const num = parseInt(numMatch[0]);
                    let current = 0;
                    const increment = num / 50;
                    
                    const interval = setInterval(() => {
                        current += increment;
                        if (current >= num) {
                            target.textContent = finalValue;
                            clearInterval(interval);
                        } else {
                            target.textContent = Math.floor(current) + (finalValue.includes('+') ? '+' : finalValue.includes('%') ? '%' : '');
                        }
                    }, 30);
                }
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => counterObserver.observe(stat));
}

// Call the counter animation when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', animateCounters);
} else {
    animateCounters();
}

/* ================================
   KEYBOARD NAVIGATION
   ================================ */

// Allow keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobileNav()) {
        closeMobileMenu();
    }
});

window.addEventListener('resize', () => {
    if (!isMobileNav()) {
        closeMobileMenu();
    }
});

/* ================================
   REDUCE MOTION RESPECT
   ================================ */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    document.documentElement.style.scrollBehavior = 'auto';
    const style = document.createElement('style');
    style.textContent = `
        * {
            animation: none !important;
            transition: none !important;
        }
    `;
    document.head.appendChild(style);
}

/* ================================
   PERFORMANCE OPTIMIZATION
   ================================ */

// Lazy load images if needed (for future implementation)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/* ================================
   UTILITY FUNCTIONS
   ================================ */

// Debounce function for scroll events
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

/* ================================
   DARK MODE TOGGLE (Optional Enhancement)
   ================================ */

// Uncomment to enable dark/light mode toggle
/*
const darkModeToggle = document.getElementById('dark-mode-toggle');

if (darkModeToggle) {
    // Check for saved theme preference or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);

    darkModeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme');
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}
*/

/* ================================
   CONTACT FORM SUBMISSION
   ================================ */

const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const submitButton = this.querySelector('button[type="submit"]');

        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }

        try {
            const formData = new FormData(this);
            formData.set('_subject', 'New portfolio contact message');
            formData.set('_captcha', 'false');
            formData.set('_template', 'table');

            const response = await fetch(this.action, {
                method: this.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('The message service did not accept the request.');
            }

            alert('Thank you for reaching out! Your message has been sent.');
            this.reset();
        } catch (error) {
            console.error('Contact form submission failed:', error);
            const mailtoLink = `mailto:jagadhesh2618@gmail.com?subject=${encodeURIComponent('Portfolio Inquiry from ' + name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
            window.location.href = mailtoLink;
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        }
    });
}

/* ================================
   EMAIL ACTIONS
   ================================ */

function openEmailComposer(email, subject = 'Portfolio Inquiry', body = '') {
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
        const tempLink = document.createElement('a');
        tempLink.href = mailtoLink;
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
    } catch (error) {
        console.error('Failed to trigger mailto link:', error);
    }

    try {
        window.location.href = mailtoLink;
    } catch (error) {
        console.error('Failed to open email composer:', error);
    }

    setTimeout(() => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email).catch(() => {
                console.warn('Could not copy email address to clipboard.');
            });
        }
    }, 500);
}

document.querySelectorAll('.email-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const email = this.dataset.email || 'jagadhesh2618@gmail.com';
        const subject = this.dataset.subject || 'Portfolio Inquiry';
        const body = this.dataset.body || '';
        openEmailComposer(email, subject, body);
        alert('I could not open your email app automatically. Please use the contact email from the page manually.');
    });
});

/* ================================
   COPY TO CLIPBOARD (For contact info)
   ================================ */

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }).catch(() => {
        console.error('Failed to copy to clipboard');
    });
}

// Usage: Add data-clipboard attribute to elements
document.querySelectorAll('[data-clipboard]').forEach(element => {
    element.style.cursor = 'pointer';
    element.addEventListener('click', function () {
        copyToClipboard(this.getAttribute('data-clipboard'));
    });
});

/* ================================
   PERFORMANCE MONITORING (Optional)
   ================================ */

// Uncomment to monitor performance
/*
window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('Page load time: ' + pageLoadTime + 'ms');
});
*/

/* ================================
   ERROR HANDLING
   ================================ */

window.addEventListener('error', (event) => {
    console.error('JavaScript Error:', event.error);
    // You can send error logs to a server here
});

/* ================================
   LOG ON LOAD
   ================================ */

console.log('%cWelcome to Jagadhesan\'s Portfolio!', 'color: #00d9ff; font-size: 20px; font-weight: bold;');
console.log('Made with care using HTML, CSS, and JavaScript');
