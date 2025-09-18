
let bubbleInterval;
let cursorTrail;

function startSite() {
  document.querySelector('.overlay').style.display = 'none';
  const audio = document.getElementById('bgAudio');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeValue = document.querySelector('.volume-value');

  audio.volume = volumeSlider.value / 100;
  volumeValue.textContent = volumeSlider.value + '%';

  volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100;
    volumeValue.textContent = volumeSlider.value + '%';
  });

  audio.play();
  startBubbles();
  animateStats();
  initCursorTrail();
  initThemeToggle();
}

function startBubbles() {
  const background = document.querySelector('.background');
  
  function createBubble(startY = null) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    const size = Math.random() * 8 + 3;
    const x = Math.random() * window.innerWidth;
    const duration = Math.random() * 20 + 15;
    const opacity = Math.random() * 0.5 + 0.2;
    const colors = ['79, 140, 254', '123, 104, 238', '255, 107, 107'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    bubble.style.left = x + 'px';
    bubble.style.bottom = startY !== null ? startY + 'px' : '-20px';
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    bubble.style.background = `radial-gradient(circle, rgba(${color}, ${opacity}), rgba(${color}, ${opacity * 0.3}))`;
    bubble.style.boxShadow = `0 0 ${size * 3}px rgba(${color}, ${opacity * 0.7})`;
    bubble.style.animationDuration = duration + 's';
    
    background.appendChild(bubble);
    
    setTimeout(() => {
      if (bubble.parentNode) {
        bubble.remove();
      }
    }, duration * 1000);
  }
  
  for (let i = 0; i < 20; i++) {
    setTimeout(() => {
      createBubble(Math.random() * window.innerHeight);
    }, i * 150);
  }
  
  bubbleInterval = setInterval(createBubble, 500);
}

function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    const increment = target / 50;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      stat.textContent = Math.floor(current);
    }, 30);
  });
}

function initCursorTrail() {
  cursorTrail = document.querySelector('.cursor-trail');
  
  document.addEventListener('mousemove', (e) => {
    cursorTrail.style.left = e.clientX - 10 + 'px';
    cursorTrail.style.top = e.clientY - 10 + 'px';
    cursorTrail.style.opacity = '0.6';
  });
  
  document.addEventListener('mouseleave', () => {
    cursorTrail.style.opacity = '0';
  });
  
  document.addEventListener('mouseenter', () => {
    cursorTrail.style.opacity = '0.6';
  });
}

function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.querySelector('.theme-icon');
  
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    if (document.body.classList.contains('dark-theme')) {
      themeIcon.textContent = '☀️';
      themeToggle.style.transform = 'rotate(180deg)';
    } else {
      themeIcon.textContent = '🌙';
      themeToggle.style.transform = 'rotate(0deg)';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const socialLinks = document.querySelectorAll('.social-link');
  
  socialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateY(-5px) scale(1.1)';
    });
    
    link.addEventListener('mouseleave', () => {
      link.style.transform = 'translateY(0) scale(1)';
    });
  });
  
  const panel = document.querySelector('.panel');
  panel.addEventListener('mouseenter', () => {
    panel.style.transform = 'translate(-50%, -50%) scale(1.02)';
  });
  
  panel.addEventListener('mouseleave', () => {
    panel.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

window.addEventListener('beforeunload', () => {
  if (bubbleInterval) {
    clearInterval(bubbleInterval);
  }
});
