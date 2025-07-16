// Animated particles background
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 2-6px
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random position
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random animation delay and duration
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        
        particlesContainer.appendChild(particle);
    }
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe service cards and other animated elements
    const serviceCards = document.querySelectorAll('.service-card');
    const contactCard = document.querySelector('.contact-card');
    
    serviceCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });

    if (contactCard) {
        contactCard.style.opacity = '0';
        contactCard.style.transform = 'translateY(30px)';
        contactCard.style.transition = 'all 0.6s ease';
        observer.observe(contactCard);
    }
}

// Form handling
function setupFormHandling() {
    const form = document.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Show success message (in a real app, you'd send this to a server)
            const button = form.querySelector('button[type="submit"]');
            const originalText = button.innerHTML;
            
            button.innerHTML = `
                <span>Message Sent!</span>
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
            `;
            
            button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            // Reset after 3 seconds
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = 'linear-gradient(135deg, #3B82F6, #8B5CF6)';
                form.reset();
            }, 3000);
        });
    }
}

// Navbar background on scroll
function setupNavbarScroll() {
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(15, 23, 42, 0.95)';
        } else {
            nav.style.background = 'rgba(15, 23, 42, 0.8)';
        }
    });
}

// Parallax effect for hero section
function setupParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('section');
        
        if (heroSection) {
            heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Mobile menu toggle
function setupMobileMenu() {
    const mobileMenuButton = document.querySelector('.md\\:hidden button');
    
    if (mobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            // Create mobile menu if it doesn't exist
            let mobileMenu = document.querySelector('.mobile-menu');
            
            if (!mobileMenu) {
                mobileMenu = document.createElement('div');
                mobileMenu.className = 'mobile-menu fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-lg md:hidden';
                mobileMenu.style.display = 'none';
                
                mobileMenu.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full space-y-8">
                        <a href="#services" class="text-2xl text-white hover:text-blue-400 transition-colors">Services</a>
                        <a href="#about" class="text-2xl text-white hover:text-blue-400 transition-colors">About</a>
                        <a href="#contact" class="text-2xl text-white hover:text-blue-400 transition-colors">Contact</a>
                        <button class="close-menu text-white text-3xl">&times;</button>
                    </div>
                `;
                
                document.body.appendChild(mobileMenu);
                
                // Close menu functionality
                mobileMenu.querySelector('.close-menu').addEventListener('click', () => {
                    mobileMenu.style.display = 'none';
                });
                
                // Close menu when clicking on links
                mobileMenu.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        mobileMenu.style.display = 'none';
                    });
                });
            }
            
            mobileMenu.style.display = mobileMenu.style.display === 'none' ? 'block' : 'none';
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    setupSmoothScrolling();
    setupScrollAnimations();
    setupFormHandling();
    setupNavbarScroll();
    setupParallax();
    setupMobileMenu();
    
    // Add loading animation delay to stagger service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});
// AI ChatBot Functionality
document.getElementById('send-btn')?.addEventListener('click', sendMessage);
document.getElementById('user-input')?.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
  const input = document.getElementById('user-input');
  const chatLog = document.getElementById('chat-log');
  const userMessage = input.value.trim();

  if (!userMessage) return;

  chatLog.innerHTML += `<div class="chat-message user-message"><strong>You:</strong> ${userMessage}</div>`;
  input.value = '';
  document.getElementById('typing').style.display = 'flex';

  try {
    const response = await fetch('http://localhost:3001/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userMessage })
    });

    const data = await response.json();
    chatLog.innerHTML += `<div class="chat-message bot-message"><strong>NexaBot:</strong> ${data.reply}</div>`;
  } catch (error) {
    chatLog.innerHTML += `<div class="chat-message bot-message"><strong>NexaBot:</strong> Sorry, I couldn't connect to the AI.</div>`;
  }

  document.getElementById('typing').style.display = 'none';
  chatLog.scrollTop = chatLog.scrollHeight;
}



// Performance optimization: throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    setupNavbarScroll();
    setupParallax();
}, 16)); // ~60fps
