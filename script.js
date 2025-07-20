/* Add to your CSS */
@keyframes float {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(-5px, -10px); }
    50% { transform: translate(5px, 5px); }
    75% { transform: translate(-8px, 8px); }
}

.particle {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: -1;
}

.animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
}

.animate-on-scroll.visible {
    opacity: 1;
    transform: translateY(0);
}

.form-feedback {
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 15px;
    text-align: center;
}

.form-feedback.success {
    background-color: #d1fae5;
    color: #065f46;
}

.form-feedback.error {
    background-color: #fee2e2;
    color: #b91c1c;
}

nav.scrolled {
    background: rgba(15, 23, 42, 0.95) !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
