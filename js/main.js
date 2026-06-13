// ==========================================
// 1. FALLING PETALS ENGINE (CANVAS)
// ==========================================
const canvas = document.getElementById('flower-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrameId;

// Resize canvas to fit screen & fix blurriness on high-resolution displays
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// The Falling Petal Object (Previously Glowing Dust)
class GlowingDust {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * -window.innerHeight * 0.5; 
        this.size = Math.random() * 3.5 + 1.5; 
        
        this.baseSpeedY = Math.random() * 0.4 + 0.15; 
        this.speedY = this.baseSpeedY + (Math.random() * 1.5 + 1.0); 
        this.angle = Math.random() * Math.PI * 2; 
        
        this.baseOpacity = Math.random() * 0.5 + 0.3; 

        // Theme-matching colors for the petals
        const themes = [
            { fill: '#d4af37', glow: '#b5952f' }, // Rich Gold
            { fill: '#c28c94', glow: '#9c666e' }, // Dusty Pink
            { fill: '#8b1c31', glow: '#5e1020' }  // Burgundy
        ];
        this.theme = themes[Math.floor(Math.random() * themes.length)];
    }

    update() {
        if (this.speedY > this.baseSpeedY) {
            this.speedY -= 0.01; 
        }
        
        this.y += this.speedY;
        this.x += Math.sin(this.angle) * 0.3; 
        this.angle += 0.02;

        if (this.y > window.innerHeight + 20) {
            this.y = -20;
            this.x = Math.random() * window.innerWidth;
            this.speedY = this.baseSpeedY; 
        }
    }

    draw() {
        ctx.save();
        
        let currentOpacity = this.baseOpacity + Math.sin(this.angle * 2) * 0.2;
        if (currentOpacity < 0.15) currentOpacity = 0.15;
        if (currentOpacity > 0.9) currentOpacity = 0.9;
        
        ctx.globalAlpha = currentOpacity;
        
        // Translate to the particle's X/Y coordinate so we can rotate it
        ctx.translate(this.x, this.y);
        // Slowly rotate the petal as it falls based on its angle
        ctx.rotate(this.angle * 0.5); 
        
        ctx.beginPath();
        
        // UPDATED: Draw an organic petal shape using quadratic curves instead of a circle
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(this.size * 1.5, -this.size, this.size * 1.5, 0);
        ctx.quadraticCurveTo(this.size * 1.5, this.size * 1.5, 0, this.size * 2);
        ctx.quadraticCurveTo(-this.size * 1.5, this.size * 1.5, -this.size * 1.5, 0);
        ctx.quadraticCurveTo(-this.size * 1.5, -this.size, 0, -this.size);
        
        ctx.fillStyle = this.theme.fill; 
        ctx.shadowBlur = this.size * 3; 
        ctx.shadowColor = this.theme.glow; 
        
        ctx.fill();
        ctx.restore();
    }
}

// Function to start the falling petals
function startMagicDust() {
    canvas.classList.remove('opacity-0');
    canvas.classList.add('opacity-100');
    
    // Create 60 particles
    for (let i = 0; i < 60; i++) { 
        particles.push(new GlowingDust());
    }
    animateDust();
}

// Function to keep the petals moving frame-by-frame
function animateDust() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    animationFrameId = requestAnimationFrame(animateDust);
}


// ==========================================
// 2. ENVELOPE OPEN ANIMATION SEQUENCE
// ==========================================
function openEnvelope() {
    const flap = document.getElementById('envelope-flap');
    const seal = document.getElementById('wax-seal');
    const curtain = document.getElementById('curtain');
    const mainContent = document.getElementById('main-content');
    const tapText = document.getElementById('tap-text');
    const letter = document.getElementById('invitation-letter');
    const flapShadow = document.getElementById('flap-shadow'); 
    
    seal.style.opacity = '0';
    tapText.style.opacity = '0';
    if(flapShadow) flapShadow.style.opacity = '0';
    
    flap.classList.add('flap-open');

    setTimeout(() => {
        flap.style.zIndex = '10';
        startMagicDust();
    }, 1000); 
    
    if (letter) {
        letter.style.transform = 'translateY(-60px)';
    }
    
    setTimeout(() => {
        curtain.style.opacity = '0';
        curtain.style.pointerEvents = 'none';
        
        mainContent.classList.remove('opacity-0');
        mainContent.classList.add('opacity-100');
        document.body.style.overflowY = 'auto';
        
        setTimeout(() => {
            curtain.style.display = 'none';
        }, 1500); 
        
    }, 5000); 
}


// ==========================================
// 3. INITIALIZATION & COUNTDOWN
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    document.body.style.overflowY = 'hidden';
    initializeCountdown();
});

function initializeCountdown() {
    // Target Date: August 23, 2026 at 17:30 (5:30 PM)
    const targetDate = new Date("August 23, 2026 17:30:00").getTime();

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            clearInterval(interval);
            document.getElementById("days").innerText = "00";
            document.getElementById("hours").innerText = "00";
            document.getElementById("minutes").innerText = "00";
            document.getElementById("seconds").innerText = "00";
            return;
        }

        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = String(d).padStart(2, '0');
        document.getElementById("hours").innerText = String(h).padStart(2, '0');
        document.getElementById("minutes").innerText = String(m).padStart(2, '0');
        document.getElementById("seconds").innerText = String(s).padStart(2, '0');
    }, 1000);
}