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
// Audio - Using MP3 Files
// ============================================
const bookOpenSound = new Audio('ES_Short-Riser-Dramatic-Epidemic-Sound.mp3');
const revealSound = new Audio('ES_Game-Jingle-Chime-Positive-02-Epidemic-Sound (mp3cut.net).mp3');

// Preload audio
bookOpenSound.preload = 'auto';
revealSound.preload = 'auto';

function playMagicSound() {
    if (isMuted) return;

    // Reset and play the book opening sound
    bookOpenSound.currentTime = 0;
    bookOpenSound.play().catch(err => console.log('Audio play failed:', err));
}

function playRevealSound() {
    if (isMuted) return;

    // Reset and play the reveal/answer sound
    revealSound.currentTime = 0;
    revealSound.play().catch(err => console.log('Audio play failed:', err));
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

    // Mute/unmute the audio elements
    bookOpenSound.muted = isMuted;
    revealSound.muted = isMuted;
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
