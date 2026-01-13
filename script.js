// ============================================
// DOM Elements
// ============================================
const stageCover = document.getElementById('stageCover');
const stageInstruction = document.getElementById('stageInstruction');
const stageAnswer = document.getElementById('stageAnswer');
const book = document.getElementById('book');
const revealBtn = document.getElementById('revealBtn');
const askAgainBtn = document.getElementById('askAgainBtn');
const startOverBtn = document.getElementById('startOverBtn');
const answerText = document.getElementById('answerText');
const answerNumber = document.getElementById('answerNumber');
const soundToggle = document.getElementById('soundToggle');
const particlesContainer = document.getElementById('particles');

// ============================================
// State
// ============================================
let isMuted = false;
let usedAnswers = [];

// ============================================
// Audio (Optional ambient sounds)
// ============================================
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playMagicSound() {
    if (isMuted) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

function playRevealSound() {
    if (isMuted) return;

    // Create a more mystical sound
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator1.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator2.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5

    oscillator1.frequency.exponentialRampToValueAtTime(783.99, audioContext.currentTime + 0.5); // G5
    oscillator2.frequency.exponentialRampToValueAtTime(1046.50, audioContext.currentTime + 0.5); // C6

    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);

    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.8);
    oscillator2.stop(audioContext.currentTime + 0.8);
}

// ============================================
// Particles
// ============================================
function createParticles() {
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 8 + 's';
        particle.style.animationDuration = (6 + Math.random() * 4) + 's';

        // Random sizes
        const size = 2 + Math.random() * 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Random colors (gold variations)
        const hue = 45 + Math.random() * 15;
        const lightness = 50 + Math.random() * 20;
        particle.style.background = `hsl(${hue}, 80%, ${lightness}%)`;

        particlesContainer.appendChild(particle);
    }
}

// ============================================
// Stage Transitions
// ============================================
function goToStage(stage) {
    // Remove active class from all stages
    stageCover.classList.remove('active');
    stageInstruction.classList.remove('active');
    stageAnswer.classList.remove('active');

    // Add active class to target stage
    setTimeout(() => {
        stage.classList.add('active');
    }, 300);
}

// ============================================
// Answer Selection
// ============================================
function getRandomAnswer() {
    // If all answers have been used, reset
    if (usedAnswers.length >= answers.length) {
        usedAnswers = [];
    }

    // Get available answers
    const availableIndices = answers
        .map((_, index) => index)
        .filter(index => !usedAnswers.includes(index));

    // Pick random from available
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    usedAnswers.push(randomIndex);

    return {
        text: answers[randomIndex],
        number: randomIndex + 1
    };
}

function displayAnswer() {
    const answer = getRandomAnswer();
    answerText.textContent = `"${answer.text}"`;
    answerNumber.textContent = `#${answer.number}`;

    // Add fade-in animation
    answerText.style.animation = 'none';
    answerText.offsetHeight; // Trigger reflow
    answerText.style.animation = 'fade-in 0.8s ease';
}

// ============================================
// Event Listeners
// ============================================

// Book click - Open book animation
book.addEventListener('click', () => {
    playMagicSound();
    book.classList.add('opening');

    // Wait for animation then go to instruction stage
    setTimeout(() => {
        goToStage(stageInstruction);
    }, 1200);
});

// Reveal button - Show answer
revealBtn.addEventListener('click', () => {
    playRevealSound();
    displayAnswer();
    goToStage(stageAnswer);
});

// Ask again - Get new answer
askAgainBtn.addEventListener('click', () => {
    playRevealSound();

    // Add a brief fade out/in effect
    const answerCard = document.querySelector('.answer-card');
    answerCard.style.animation = 'none';
    answerCard.offsetHeight; // Trigger reflow
    answerCard.style.animation = 'card-reveal 0.6s ease';

    displayAnswer();
});

// Start over - Go back to cover
startOverBtn.addEventListener('click', () => {
    playMagicSound();

    // Reset book animation
    book.classList.remove('opening');

    goToStage(stageCover);
});

// Sound toggle
soundToggle.addEventListener('click', () => {
    isMuted = !isMuted;
    soundToggle.classList.toggle('muted', isMuted);

    // Resume audio context if it was suspended (browser autoplay policy)
    if (!isMuted && audioContext.state === 'suspended') {
        audioContext.resume();
    }
});

// ============================================
// Touch feedback for mobile
// ============================================
function addTouchFeedback(element) {
    element.addEventListener('touchstart', () => {
        element.style.transform = 'scale(0.98)';
    });

    element.addEventListener('touchend', () => {
        element.style.transform = '';
    });
}

addTouchFeedback(book);
addTouchFeedback(revealBtn);
addTouchFeedback(askAgainBtn);
addTouchFeedback(startOverBtn);

// ============================================
// Keyboard accessibility
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        // Check which stage is active and trigger appropriate action
        if (stageCover.classList.contains('active')) {
            book.click();
        } else if (stageInstruction.classList.contains('active')) {
            revealBtn.click();
        } else if (stageAnswer.classList.contains('active')) {
            askAgainBtn.click();
        }
    }

    // Escape to go back to start
    if (e.key === 'Escape') {
        startOverBtn.click();
    }
});

// ============================================
// Initialize
// ============================================
function init() {
    createParticles();

    // Initialize audio context on first user interaction
    document.addEventListener('click', () => {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }, { once: true });

    // Add subtle parallax effect on mouse move
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) / 50;
        const y = (e.clientY - window.innerHeight / 2) / 50;

        if (stageCover.classList.contains('active')) {
            book.style.transform = `rotateY(${-5 + x}deg) rotateX(${y}deg)`;
        }
    });

    // Reset book transform on mouse leave
    document.addEventListener('mouseleave', () => {
        book.style.transform = '';
    });
}

// Start the app
init();
