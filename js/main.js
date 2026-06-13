// ==========================================
// 1. GLOWING DUST / BOKEH ENGINE (CANVAS)
// ==========================================
const canvas = document.getElementById('flower-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrameId;

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

class GlowingDust {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * -window.innerHeight * 0.5; 
        this.size = Math.random() * 3.5 + 1.5; 
        
        this.baseSpeedY = Math.random() * 0.4 + 0.15; 
        this.speedY = this.baseSpeedY + (Math.random() * 1.5 + 1.0); 
        this.angle = Math.random() * Math.PI * 2; 
        
        this.baseOpacity = Math.random() * 0.5 + 0.3; 

        const themes = [
            { fill: '#d4af37', glow: '#b5952f' }, 
            { fill: '#c28c94', glow: '#9c666e' }, 
            { fill: '#8b1c31', glow: '#5e1020' }  
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
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        ctx.fillStyle = this.theme.fill; 
        ctx.shadowBlur = this.size * 3; 
        ctx.shadowColor = this.theme.glow; 
        
        ctx.fill();
        ctx.restore();
    }
}

function startMagicDust() {
    canvas.classList.remove('opacity-0');
    canvas.classList.add('opacity-100');
    for (let i = 0; i < 60; i++) { 
        particles.push(new GlowingDust());
    }
    animateDust();
}

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
// 3. INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    document.body.style.overflowY = 'hidden';
    initializeCountdown();
    setupRSVPValidation();
    setupFormClearLogic(); 
});

function initializeCountdown() {
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

// ==========================================
// 4. RSVP FORM VALIDATION & GOOGLE SHEETS SUBMISSION
// ==========================================

const scriptURL = 'https://script.google.com/macros/s/AKfycbwMJ9GR0wUVTq2eWudGRYt4tTDkgtgUGqUDhr1Ye46WPEO_khkQLAnF4m2R_-xO0ElI/exec';

function setupRSVPValidation() {
    const form = document.getElementById('rsvp-form');
    
    if (form) {
        const attendanceRadios = form.querySelectorAll('input[name="Attendance"]');
        const guestDropdown = document.getElementById('GuestCount');

        attendanceRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'FALSE') {
                    guestDropdown.value = ""; 
                    guestDropdown.disabled = true;
                    guestDropdown.classList.add('opacity-50', 'cursor-not-allowed');
                } else {
                    guestDropdown.disabled = false;
                    guestDropdown.classList.remove('opacity-50', 'cursor-not-allowed');
                }
            });
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const errorBox = document.getElementById('form-error');
            const errorMessage = document.getElementById('error-message');
            const loadingOverlay = document.getElementById('loading-overlay');
            const successBox = document.getElementById('form-success');
            const duplicateBox = document.getElementById('form-duplicate');
            const submitBtn = document.getElementById('submit-btn');
            const clearBtn = document.getElementById('clear-btn'); 
            const successTitle = document.getElementById('success-title');
            const successText = document.getElementById('success-text');

            errorBox.classList.add('hidden');
            successBox.classList.add('hidden');
            duplicateBox.classList.add('hidden');
            
            // --- SECURITY: Honeypot Check ---
            const honeypot = document.getElementById('bot-check').value;
            if (honeypot !== "") {
                // Fake success for spam bots to trap them
                loadingOverlay.classList.remove('hidden');
                loadingOverlay.classList.add('flex');
                setTimeout(() => {
                    loadingOverlay.classList.add('hidden');
                    loadingOverlay.classList.remove('flex');
                    successBox.classList.remove('hidden');
                    form.reset();
                }, 1000);
                return; 
            }
            
            const name = form['Name'].value.trim();
            const email = form['Email'].value.trim();
            const attendance = form.querySelector('input[name="Attendance"]:checked');
            const guests = guestDropdown.value;

            let errors = [];

            if (!name) errors.push("• Please enter your full name.");
            if (!email) {
                errors.push("• Please enter your email address.");
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errors.push("• Please enter a valid email address format.");
            }
            if (!attendance) {
                errors.push("• Please let us know if you will be attending.");
            } else if (attendance.value === 'TRUE' && !guests) {
                errors.push("• Please select the number of guests.");
            }

            if (errors.length > 0) {
                errorMessage.innerHTML = errors.join('<br>');
                errorBox.classList.remove('hidden');
                errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            loadingOverlay.classList.remove('hidden');
            loadingOverlay.classList.add('flex');
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
            clearBtn.classList.add('hidden'); 

            // Standard fetch (No CORS mode) so we can read the JSON response
            fetch(scriptURL, { method: 'POST', body: new FormData(form) })
                .then(response => response.json())
                .then(data => {
                    loadingOverlay.classList.add('hidden');
                    loadingOverlay.classList.remove('flex');
                    
                    if (data.result === 'duplicate') {
                        // Display the elegant duplicate warning box
                        duplicateBox.classList.remove('hidden');
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                        duplicateBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        
                    } else {
                        // Success Logic
                        successBox.classList.remove('hidden');
                        if (attendance && attendance.value === 'FALSE') {
                            successTitle.textContent = "You will be missed!";
                            successText.textContent = "Thank you for letting us know. We appreciate you keeping us updated.";
                        } else {
                            successTitle.textContent = "We can't wait to celebrate!";
                            successText.textContent = "Your RSVP has been securely received. Thank you!";
                        }

                        form.reset();
                        submitBtn.disabled = false;
                        submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                        guestDropdown.disabled = false;
                        guestDropdown.classList.remove('opacity-50', 'cursor-not-allowed');
                        
                        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        
                        setTimeout(() => {
                            successBox.classList.add('hidden');
                        }, 8000);
                    }
                })
                .catch(error => {
                    // Fallback for strict browser CORS blocks or network errors
                    loadingOverlay.classList.add('hidden');
                    loadingOverlay.classList.remove('flex');
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                    clearBtn.classList.remove('hidden'); 
                    
                    errorMessage.innerHTML = "There was a network issue submitting your RSVP. Please try again.";
                    errorBox.classList.remove('hidden');
                    console.error('Error!', error.message);
                });
        });
    }
}

// ==========================================
// 5. DYNAMIC CLEAR FORM LOGIC
// ==========================================
function setupFormClearLogic() {
    const form = document.getElementById('rsvp-form');
    const clearBtn = document.getElementById('clear-btn');
    const guestDropdown = document.getElementById('GuestCount');
    if (!form || !clearBtn) return;

    const checkFields = () => {
        const name = form['Name'].value;
        const email = form['Email'].value;
        const attendance = form.querySelector('input[name="Attendance"]:checked');
        const guests = form['GuestCount'].value;
        const message = form['Message'].value;

        if (name || email || attendance || guests || message) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
    };

    form.addEventListener('input', checkFields);
    form.addEventListener('change', checkFields);

    clearBtn.addEventListener('click', () => {
        form.reset();
        document.getElementById('form-error').classList.add('hidden'); 
        document.getElementById('form-duplicate').classList.add('hidden');
        clearBtn.classList.add('hidden'); 
        
        guestDropdown.disabled = false;
        guestDropdown.classList.remove('opacity-50', 'cursor-not-allowed');
    });
}