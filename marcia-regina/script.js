// 1. Header Scroll Effect
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 2. Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const navItems = document.querySelectorAll('.nav-links a');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu when clicking a link
navItems.forEach(item => {
    item.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// 3. Intersection Observer (Fade-in & Slide-up)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Trigger counters if it's the stats section
            if(entry.target.querySelector('.counter') || entry.target.classList.contains('about-text')) {
                startCounters();
            }
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(element => {
    observer.observe(element);
});

// 4. Animated Counters
let countersStarted = false;
function startCounters() {
    if(countersStarted) return;
    countersStarted = true;
    
    const counters = document.querySelectorAll('.counter');
    const speed = 150; // Lower is faster

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            
            // Calculate increment based on target size to ensure they finish roughly together
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 15);
            } else {
                // Ensure final value is exact
                counter.innerText = target;
            }
        };
        updateCount();
    });
}

// 5. Testimonial Carousel Autoplay
const track = document.getElementById('track');
const cards = document.querySelectorAll('.testimonial-card');

if (track && cards.length > 0) {
    let currentIndex = 0;
    let cardWidth = cards[0].offsetWidth;
    let gap = 30; // Matches CSS margin-right or gap
    
    // For mobile (1 card) vs desktop (2 cards visible)
    function getVisibleCards() {
        return window.innerWidth >= 768 ? 2 : 1;
    }

    function updateCarousel() {
        cardWidth = cards[0].offsetWidth;
        const visible = getVisibleCards();
        const maxIndex = cards.length - visible;
        
        if (currentIndex > maxIndex) {
            currentIndex = 0;
        }

        const moveAmount = currentIndex * (cardWidth + (window.innerWidth >= 768 ? 30 : 0));
        track.style.transform = `translateX(-${moveAmount}px)`;
    }

    function nextSlide() {
        const visible = getVisibleCards();
        const maxIndex = cards.length - visible;
        
        if (currentIndex >= maxIndex) {
            currentIndex = 0;
        } else {
            currentIndex++;
        }
        updateCarousel();
    }

    let carouselInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    const carouselContainer = document.getElementById('carousel');
    
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(nextSlide, 5000);
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        updateCarousel();
    });
}
