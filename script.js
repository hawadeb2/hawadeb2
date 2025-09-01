const ANIMATION_CONFIG = {
  panelDelay: 100,
  cardBaseDelay: 600,
  cardStagger: 100,
  rippleDuration: 600,
  tagClickDuration: 150,
  countDuration: 2000,
};

function startSite() {
  const overlay = document.querySelector('.overlay');
  const bgAudio = document.querySelector('#bgAudio');
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 500);
  }
  if (bgAudio) {
    bgAudio.play().catch(() => {});
  }
}

function animateElements() {
  const panel = document.querySelector('.panel') || document.querySelector('.portfolio-grid');
  if (panel) {
    panel.style.opacity = '0';
    panel.style.transform = 'scale(0.9) translateY(20px)';
    setTimeout(() => {
      panel.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      panel.style.opacity = '1';
      panel.style.transform = 'scale(1) translateY(0)';
    }, ANIMATION_CONFIG.panelDelay);
  }

  const cards = document.querySelectorAll('.stat-card, .knowledge-item');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(() => {
      card.style.transition = 'all 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, ANIMATION_CONFIG.cardBaseDelay + index * ANIMATION_CONFIG.cardStagger);
  });

  const statNumbers = document.querySelectorAll('.stat-number');
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'), 10);
    let current = 0;
    const increment = target / (ANIMATION_CONFIG.countDuration / 16);
    const updateCount = () => {
      current += increment;
      stat.textContent = Math.min(Math.ceil(current), target);
      if (current < target) requestAnimationFrame(updateCount);
    };
    setTimeout(updateCount, ANIMATION_CONFIG.cardBaseDelay);
  });
}

function initInteractions() {
  const knowledgeItems = document.querySelectorAll('.knowledge-item');
  knowledgeItems.forEach(knowledge => {
    knowledge.addEventListener('mouseenter', () => {
      knowledge.style.transform = 'translateY(-4px) scale(1.02)';
      const existingRipple = knowledge.querySelector('.ripple');
      if (existingRipple) existingRipple.remove();
      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      ripple.style.cssText = `
        position: absolute;
        inset: 0;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
        border-radius: inherit;
        pointer-events: none;
        animation: ripple ${ANIMATION_CONFIG.rippleDuration}ms ease-out forwards;
      `;
      knowledge.appendChild(ripple);
      setTimeout(() => ripple.remove(), ANIMATION_CONFIG.rippleDuration);
    });
    knowledge.addEventListener('mouseleave', () => {
      knowledge.style.transform = 'translateY(0) scale(1)';
    });
  });

  const panel = document.querySelector('.panel') || document.querySelector('.portfolio-grid');
  if (panel) {
    panel.addEventListener('mouseenter', () => {
      panel.style.transform = 'scale(1.01)';
      panel.style.boxShadow = 'var(--shadow-xl, 0 10px 15px -3px rgba(0, 0, 0, 0.1)), 0 0 40px rgba(99, 102, 241, 0.2)';
    });
    panel.addEventListener('mouseleave', () => {
      panel.style.transform = 'scale(1)';
      panel.style.boxShadow = 'var(--shadow-xl, 0 10px 15px -3px rgba(0, 0, 0, 0.1)), var(--shadow-glow, 0 0 20px rgba(0, 0, 0, 0.05))';
    });
  }

  const specialtyTags = document.querySelectorAll('.specialty-tag');
  specialtyTags.forEach(tag => {
    tag.addEventListener('click', () => {
      tag.style.transform = 'scale(1.1)';
      setTimeout(() => tag.style.transform = 'scale(1)', ANIMATION_CONFIG.tagClickDuration);
    });
  });

  const audioToggle = document.querySelector('#audioToggle');
  const bgAudio = document.querySelector('#bgAudio');
  const volumeSlider = document.querySelector('#volumeSlider');
  const volumeValue = document.querySelector('.volume-value');
  if (audioToggle && bgAudio) {
    audioToggle.addEventListener('click', () => {
      bgAudio.muted = !bgAudio.muted;
      audioToggle.querySelector('i').className = bgAudio.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    });
  }
  if (volumeSlider && bgAudio && volumeValue) {
    volumeSlider.addEventListener('input', () => {
      bgAudio.volume = volumeSlider.value / 100;
      volumeValue.textContent = `${volumeSlider.value}%`;
    });
  }

  const themeToggle = document.querySelector('#themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      themeToggle.querySelector('i').className = isLight ? 'fas fa-moon' : 'fas fa-sun';
      themeToggle.querySelector('span').textContent = isLight ? 'Dark' : 'Light';
    });
  }
}

function injectStyles() {
  if (!document.querySelector('style[data-animation-styles]')) {
    const style = document.createElement('style');
    style.setAttribute('data-animation-styles', '');
    style.textContent = `
      @keyframes floatUp {
        0% { transform: translateY(0) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
      }
      @keyframes ripple {
        0% { transform: scale(0); opacity: 1; }
        100% { transform: scale(1); opacity: 0; }
      }
      .stat-card, .knowledge-item, .portfolio-grid {
        will-change: transform, opacity;
      }
      .overlay { transition: opacity 0.5s ease; }
      .light-theme {
        --background: #ffffff;
        --text: #333333;
        --card-bg: #f0f0f0;
      }
    `;
    document.head.appendChild(style);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  injectStyles();
  animateElements();
  initInteractions();
  setTimeout(() => document.body.style.opacity = '1', ANIMATION_CONFIG.panelDelay);
});
