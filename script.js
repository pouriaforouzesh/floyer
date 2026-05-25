/* --- Bilingual & Storage Logic --- */
function changeLanguage(lang) {
    // Set html lang attribute which triggers CSS language selector rules
    document.documentElement.setAttribute('lang', lang);
    
    // Update active states on switcher buttons
    const btnFr = document.getElementById('lang-fr-btn');
    const btnEn = document.getElementById('lang-en-btn');
    
    if (lang === 'fr') {
        btnFr.classList.add('active');
        btnEn.classList.remove('active');
    } else {
        btnEn.classList.add('active');
        btnFr.classList.remove('active');
    }
    
    // Store user language preference
    localStorage.setItem('preferredLang', lang);
}

// Initial Page Load
document.addEventListener('DOMContentLoaded', () => {
    // 1. Set language
    const savedLang = localStorage.getItem('preferredLang') || 'fr';
    changeLanguage(savedLang);
    
    // 2. Set theme
    const savedTheme = localStorage.getItem('preferredTheme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // 3. Trigger initial calculator calculations
    calculateSavings();
    
    // 4. Initialize background audio autoplay attempts
    initAutoplay();
});


/* --- Light/Dark Theme Switcher --- */
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('preferredTheme', newTheme);
}


/* --- Background Music Control --- */
function toggleMusic() {
    const music = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle');
    if (!music || !musicBtn) return;
    
    if (music.paused) {
        music.volume = 0.15; // Set soft, ambient volume level
        music.play().then(() => {
            musicBtn.classList.add('playing');
        }).catch(err => {
            console.log("Audio play blocked by browser policy:", err);
        });
    } else {
        music.pause();
        musicBtn.classList.remove('playing');
    }
}

// Gracefully handle browser autoplay blocks by playing on first user tap/click
function initAutoplay() {
    const startPlay = () => {
        const music = document.getElementById('bg-music');
        const musicBtn = document.getElementById('music-toggle');
        if (music && musicBtn && music.paused) {
            music.volume = 0.15;
            music.play().then(() => {
                musicBtn.classList.add('playing');
            }).catch(err => {
                console.log("Interaction autoplay blocked:", err);
            });
        }
        // Remove event listeners so it doesn't trigger repeatedly
        document.removeEventListener('click', startPlay);
        document.removeEventListener('touchstart', startPlay);
    };
    
    document.addEventListener('click', startPlay);
    document.addEventListener('touchstart', startPlay);
}


/* --- Mobile Navbar Menu Drawer --- */
const mobileToggle = document.querySelector('.mobile-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('open');
    });
}

function toggleMobileMenu() {
    if (mobileNav) {
        mobileNav.classList.remove('open');
    }
}

// Close mobile menu on clicking outside
document.addEventListener('click', (e) => {
    if (mobileNav && mobileToggle && !mobileNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileNav.classList.remove('open');
    }
});


/* --- Services Category Filtering --- */
const filterButtons = document.querySelectorAll('.filter-btn');
const serviceCards = document.querySelectorAll('.service-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Toggle Active Class for buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        serviceCards.forEach(card => {
            if (filterValue === 'all') {
                card.classList.remove('hide');
            } else {
                const category = card.getAttribute('data-category');
                if (category === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            }
        });
    });
});


/* --- Pre-select Service in Contact Form --- */
function selectService(serviceName) {
    const serviceSelect = document.getElementById('form-service');
    if (serviceSelect) {
        // Find matching option or select general
        let found = false;
        for (let i = 0; i < serviceSelect.options.length; i++) {
            if (serviceSelect.options[i].value === serviceName) {
                serviceSelect.selectedIndex = i;
                found = true;
                break;
            }
        }
        if (!found) {
            // Fallback for custom or similar match
            serviceSelect.value = serviceName;
        }
    }
    
    // Smooth scroll to form section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}


/* --- Send WhatsApp Message Dynamic Form --- */
function sendWhatsAppMessage(event) {
    event.preventDefault(); // Stop page reload
    
    const currentLang = document.documentElement.getAttribute('lang') || 'fr';
    const name = document.getElementById('form-name').value.trim();
    const service = document.getElementById('form-service').value;
    const message = document.getElementById('form-message').value.trim();
    
    if (!name || !service || !message) {
        alert(currentLang === 'fr' ? 'Veuillez remplir tous les champs.' : 'Please fill out all fields.');
        return;
    }
    
    // Construct text message based on selected language
    let text = '';
    if (currentLang === 'fr') {
        text = `Bonjour Pouria, je m'appelle *${name}*.\n\nJe vous contacte pour le service : *${service}*.\n\n*Détails de ma demande :*\n${message}`;
    } else {
        text = `Hello Pouria, my name is *${name}*.\n\nI am contacting you regarding the service: *${service}*.\n\n*Details of my request :*\n${message}`;
    }
    
    // Format WhatsApp Link
    const phone = '33660681400'; // 06 60 68 14 00 (French format)
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedText}`;
    
    // Open in a new tab
    window.open(whatsappUrl, '_blank');
}


/* --- Interactive CESU Savings Calculator --- */
function calculateSavings() {
    const hoursInput = document.getElementById('calc-hours');
    const hoursDisplay = document.getElementById('hours-display');
    const serviceRadio = document.querySelector('input[name="calc-service"]:checked');
    
    const rateStandardEl = document.getElementById('rate-standard');
    const rateNetEl = document.getElementById('rate-net');
    const costNetEl = document.getElementById('cost-net');
    const savingsAmountEl = document.getElementById('savings-amount');
    const savingsAmountEnEl = document.getElementById('savings-amount-en');
    
    if (!hoursInput || !serviceRadio) return;
    
    const hours = parseInt(hoursInput.value);
    const serviceType = serviceRadio.value;
    
    // Determine rates
    let standardRate = 24;
    if (serviceType === 'tech') {
        standardRate = 30; // IT support / CATIA lessons
    }
    
    const netRate = standardRate / 2; // 50% tax credit
    const netCost = hours * netRate;
    const savings = hours * (standardRate - netRate);
    
    // Update DOM elements
    if (hoursDisplay) {
        hoursDisplay.textContent = `${hours}h`;
    }
    if (rateStandardEl) {
        rateStandardEl.textContent = `${standardRate}€/h`;
    }
    if (rateNetEl) {
        rateNetEl.textContent = `${netRate}€/h`;
    }
    if (costNetEl) {
        costNetEl.textContent = `${netCost}€`;
    }
    if (savingsAmountEl) {
        savingsAmountEl.textContent = savings;
    }
    if (savingsAmountEnEl) {
        savingsAmountEnEl.textContent = savings;
    }
}


/* --- Toggle Collapsible Pricing Grid Details --- */
function togglePricingGrid() {
    const pricingGrid = document.getElementById('pricing-grid-details');
    if (pricingGrid) {
        pricingGrid.classList.toggle('open');
    }
}
