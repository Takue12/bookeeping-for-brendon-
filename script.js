// Optimized animated particles background
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 2;
        
        Object.assign(particle.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${Math.random() * 4 + 4}s`
        });
        
        fragment.appendChild(particle);
    }
    
    particlesContainer.appendChild(fragment);
}

// Enhanced smooth scrolling with offset calculation
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    const navHeight = nav.offsetHeight;
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + 
                                      window.pageYOffset - 
                                      navHeight - 20;
                
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                
                // Update URL without reloading
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
}

// Optimized Intersection Observer with requestAnimationFrame
function setupScrollAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .contact-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Form handling with actual submission to backend
function setupFormHandling() {
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        
        try {
            // Show loading state
            button.innerHTML = 'Sending...';
            button.disabled = true;
            
            // Send to backend API
            const response = await fetch('/submit-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(formData))
            });
            
            if (!response.ok) throw new Error('Failed to submit form');
            
            // Success state
            button.innerHTML = '<span>Message Sent!</span><svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
            button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        } catch (error) {
            button.innerHTML = '<span>Error!</span>';
            button.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            console.error('Form submission error:', error);
        } finally {
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = 'linear-gradient(135deg, #3B82F6, #8B5CF6)';
                button.disabled = false;
                form.reset();
            }, 3000);
        }
    });
}

// Optimized navbar scroll with debouncing
function setupNavbarScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    let lastScrollY = window.scrollY;
    
    const updateNavbar = () => {
        const currentScrollY = window.scrollY;
        if (Math.abs(currentScrollY - lastScrollY) < 10) return;
        
        nav.style.background = currentScrollY > 50 ? 
            'rgba(15, 23, 42, 0.95)' : 
            'rgba(15, 23, 42, 0.8)';
            
        lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', () => requestAnimationFrame(updateNavbar));
}

// Parallax effect with performance optimization
function setupParallax() {
    let lastScroll = 0;
    const heroSection = document.querySelector('section');
    if (!heroSection) return;
    
    const updateParallax = () => {
        const currentScroll = window.pageYOffset;
        if (Math.abs(currentScroll - lastScroll) > 5) {
            heroSection.style.transform = `translateY(${currentScroll * 0.5}px)`;
            lastScroll = currentScroll;
        }
    };
    
    window.addEventListener('scroll', () => requestAnimationFrame(updateParallax));
}

// Mobile menu with improved accessibility
function setupMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    if (!mobileMenuButton) return;
    
    let mobileMenu = document.querySelector('.mobile-menu');
    
    // Create menu if doesn't exist
    if (!mobileMenu) {
        mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-lg md:hidden';
        mobileMenu.setAttribute('aria-hidden', 'true');
        mobileMenu.style.display = 'none';
        
        mobileMenu.innerHTML = `
            <div class="flex flex-col items-center justify-center h-full space-y-8">
                <a href="#services" class="text-2xl text-white hover:text-blue-400 transition-colors">Services</a>
                <a href="#about" class="text-2xl text-white hover:text-blue-400 transition-colors">About</a>
                <a href="#contact" class="text-2xl text-white hover:text-blue-400 transition-colors">Contact</a>
                <button class="close-menu text-white text-3xl focus:outline-none" aria-label="Close menu">&times;</button>
            </div>
        `;
        
        document.body.appendChild(mobileMenu);
        
        // Close menu handlers
        mobileMenu.querySelector('.close-menu').addEventListener('click', () => {
            mobileMenu.style.display = 'none';
            mobileMenu.setAttribute('aria-hidden', 'true');
            mobileMenuButton.focus();
        });
        
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.style.display = 'none';
                mobileMenu.setAttribute('aria-hidden', 'true');
            });
        });
    }
    
    // Toggle menu visibility
    mobileMenuButton.addEventListener('click', () => {
        const isVisible = mobileMenu.style.display === 'block';
        mobileMenu.style.display = isVisible ? 'none' : 'block';
        mobileMenu.setAttribute('aria-hidden', isVisible ? 'true' : 'false');
        
        if (!isVisible) {
            mobileMenu.querySelector('a').focus();
        }
    });
}

// Enhanced chatbot with typing indicators and error handling
async function sendMessage() {
    const input = document.getElementById('user-input');
    const chatLog = document.getElementById('chat-log');
    const userMessage = input.value.trim();
    
    if (!userMessage) return;
    
    // Add user message
    chatLog.innerHTML += `<div class="chat-message user-message"><strong>You:</strong> ${escapeHTML(userMessage)}</div>`;
    input.value = '';
    
    // Show typing indicator
    const typingIndicator = document.getElementById('typing');
    typingIndicator.style.display = 'flex';
    chatLog.scrollTop = chatLog.scrollHeight;
    
    try {
        // Send to CTHIA backend
        const response = await fetch('http://localhost:3001/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userMessage })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Add AI response with typing simulation
        simulateTypingEffect(chatLog, data.reply);
    } catch (error) {
        console.error('Chat error:', error);
        chatLog.innerHTML += `<div class="chat-message bot-message"><strong>CTHIA:</strong> I'm having trouble connecting. Please try again later.</div>`;
        chatLog.scrollTop = chatLog.scrollHeight;
    } finally {
        typingIndicator.style.display = 'none';
    }
}

// Simulate typing effect for AI responses
function simulateTypingEffect(container, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot-message';
    messageDiv.innerHTML = `<strong>CTHIA:</strong> <span class="typing-cursor">|</span>`;
    container.appendChild(messageDiv);
    
    let index = 0;
    const cursor = messageDiv.querySelector('.typing-cursor');
    
    const typeNextCharacter = () => {
        if (index < text.length) {
            // Replace cursor with next character
            const char = text.charAt(index);
            cursor.insertAdjacentHTML('beforebegin', escapeHTML(char));
            
            // Move cursor to end
            cursor.parentNode.insertBefore(cursor, cursor.nextSibling);
            
            index++;
            setTimeout(typeNextCharacter, index % 3 === 0 ? 30 : 20); // Vary typing speed
        } else {
            // Remove cursor when done
            cursor.remove();
            container.scrollTop = container.scrollHeight;
        }
    };
    
    typeNextCharacter();
}

// Utility function to escape HTML
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, 
        match => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[match]));
}

// DOMContentLoaded initialization with performance enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Run critical functions first
    setupNavbarScroll();
    setupMobileMenu();
    setupSmoothScrolling();
    
    // Defer non-critical functions
    requestIdleCallback(() => {
        createParticles();
        setupScrollAnimations();
        setupFormHandling();
        setupParallax();
        
        // Animate service cards with staggered delay
        document.querySelectorAll('.service-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    });
    
    // Chatbot event listeners
    document.getElementById('send-btn')?.addEventListener('click', sendMessage);
    document.getElementById('user-input')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Focus input on chat open
    document.getElementById('chat-toggle')?.addEventListener('click', () => {
        setTimeout(() => document.getElementById('user-input')?.focus(), 100);
    });
});
