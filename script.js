let bubbleInterval;
let cursorTrail;
let audioContext;
let isAudioPlaying = false;

const playlist = [
  'music1.mp3',
  'music2.mp3',
  'music3.mp3'
];
let currentTrackIndex = 0;

function startSite() {
  document.querySelector('.overlay').style.display = 'none';

  initAudio();
  initCustomMusicPlayer();
  initCursorTrail();
  initThemeToggle();
  startAnimations();
  initInteractions();

  setTimeout(() => {
    startBubbles();
    animateStats();
  }, 500);
}

function initAudio() {
  const audio = document.getElementById('bgAudio');
  const volumeSlider = document.getElementById('volumeSlider');
  const volumeValue = document.querySelector('.volume-value');
  const audioToggle = document.getElementById('audioToggle');

  audio.addEventListener('error', () => {
    audioToggle.innerHTML = '<i class="fas fa-volume-off"></i>';
    audioToggle.disabled = true;
    volumeSlider.disabled = true;
  });

  audio.volume = volumeSlider.value / 100;
  volumeValue.textContent = volumeSlider.value + '%';

  volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value / 100;
    volumeValue.textContent = volumeSlider.value + '%';
    volumeSlider.style.background = `linear-gradient(to right, var(--primary) 0%, var(--primary) ${volumeSlider.value}%, rgba(255,255,255,0.1) ${volumeSlider.value}%, rgba(255,255,255,0.1) 100%)`;
  });

  audioToggle.addEventListener('click', () => {
    if (isAudioPlaying) {
      audio.pause();
      audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
      isAudioPlaying = false;
    } else {
      audio.play().catch(() => {});
      audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
      isAudioPlaying = true;
    }
  });

  audio.play().then(() => {
    isAudioPlaying = true;
  }).catch(() => {
    audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
  });
}

function initCustomMusicPlayer() {
  const audio = document.getElementById('customAudio');
  const seekSlider = document.getElementById('seekSlider');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');
  const volumeSlider = document.getElementById('customVolume');
  const volumeDisplay = document.getElementById('volumeDisplay');
  const skipBtn = document.getElementById('skipBtn');
  const replayBtn = document.getElementById('replayBtn');

  // Initialize with first song
  audio.src = playlist[currentTrackIndex];

  audio.addEventListener('loadedmetadata', () => {
    seekSlider.max = audio.duration;
    durationEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    seekSlider.value = audio.currentTime;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  seekSlider.addEventListener('input', () => {
    audio.currentTime = seekSlider.value;
  });

  volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
    volumeDisplay.textContent = Math.round(volumeSlider.value * 100) + '%';
  });

  skipBtn.addEventListener('click', () => {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    audio.src = playlist[currentTrackIndex];
    audio.play();
  });

  replayBtn.addEventListener('click', () => {
    audio.currentTime = 0;
    audio.play();
  });

  function formatTime(time) {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }
}

function startBubbles() {
  const background = document.querySelector('.background');
  if (!background) return;

  const colors = ['99, 102, 241', '139, 92, 246', '6, 182, 212', '16, 185, 129'];

  function createBubble() {
    const bubble = document.createElement('div');
    const size = Math.random() * 6 + 2;
    const x = Math.random() * window.innerWidth;
    const duration = Math.random() * 15 + 10;
    const opacity = Math.random() * 0.3 + 0.1;
    const color = colors[Math.floor(Math.random() * colors.length)];

    bubble.style.cssText = `
      position: absolute;
      left: ${x}px;
      bottom: -20px;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, rgba(${color}, ${opacity}), rgba(${color}, ${opacity * 0.3}));
      border-radius: 50%;
      pointer-events: none;
      animation: floatUp ${duration}s linear forwards;
      box-shadow: 0 0 ${size * 2}px rgba(${color}, ${opacity * 0.5});
    `;

    background.appendChild(bubble);
    setTimeout(() => bubble.remove(), duration * 1000);
  }

  for (let i = 0; i < 15; i++) {
    setTimeout(createBubble, i * 200);
  }

  bubbleInterval = setInterval(createBubble, 800);
}

function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stat = entry.target;
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = Math.ceil(target / 60);
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          stat.textContent = current.toLocaleString();
        }, 30);

        observer.unobserve(stat);
      }
    });
  });

  statNumbers.forEach(stat => observer.observe(stat));
}

function initCursorTrail() {
  cursorTrail = document.querySelector('.cursor-trail');
  if (!cursorTrail) return;

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateTrail() {
    const dx = mouseX - trailX;
    const dy = mouseY - trailY;

    trailX += dx * 0.1;
    trailY += dy * 0.1;

    cursorTrail.style.left = trailX - 10 + 'px';
    cursorTrail.style.top = trailY - 10 + 'px';

    requestAnimationFrame(updateTrail);
  }

  updateTrail();

  document.addEventListener('mouseleave', () => cursorTrail.style.opacity = '0');
  document.addEventListener('mouseenter', () => cursorTrail.style.opacity = '0.6');
}

function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  const themeText = themeToggle.querySelector('span');

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');

    themeToggle.style.transform = 'scale(0.9)';
    setTimeout(() => themeToggle.style.transform = 'scale(1)', 150);

    if (document.body.classList.contains('dark-theme')) {
      themeIcon.className = 'fas fa-moon';
      themeText.textContent = 'Dark';
    } else {
      themeIcon.className = 'fas fa-sun';
      themeText.textContent = 'Light';
    }
  });
}

function startAnimations() {
  const panel = document.querySelector('.panel');
  if (!panel) return;

  panel.style.opacity = '0';
  panel.style.transform = 'scale(0.9) translateY(20px)';

  setTimeout(() => {
    panel.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    panel.style.opacity = '1';
    panel.style.transform = 'scale(1) translateY(0)';
  }, 100);

  const cards = document.querySelectorAll('.stat-card, .knowledge-item');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';

    setTimeout(() => {
      card.style.transition = 'all 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 600 + (index * 100));
  });
}

function initInteractions() {
  const knowledgeItems = document.querySelectorAll('.knowledge-item');
  knowledgeItems.forEach(knowledge => {
    knowledge.addEventListener('mouseenter', () => {
      knowledge.style.transform = 'translateY(-4px) scale(1.02)';

      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        inset: 0;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%);
        border-radius: inherit;
        pointer-events: none;
        animation: ripple 0.6s ease-out forwards;
      `;
      knowledge.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });

    knowledge.addEventListener('mouseleave', () => {
      knowledge.style.transform = 'translateY(0) scale(1)';
    });
  });

  const panel = document.querySelector('.panel');
  panel?.addEventListener('mouseenter', () => {
    panel.style.transform = 'scale(1.01)';
    panel.style.boxShadow = 'var(--shadow-xl), 0 0 40px rgba(99, 102, 241, 0.2)';
  });

  panel?.addEventListener('mouseleave', () => {
    panel.style.transform = 'scale(1)';
    panel.style.boxShadow = 'var(--shadow-xl), var(--shadow-glow)';
  });

  const specialtyTags = document.querySelectorAll('.specialty-tag');
  specialtyTags.forEach(tag => {
    tag.addEventListener('click', () => {
      tag.style.transform = 'scale(1.1)';
      setTimeout(() => tag.style.transform = 'scale(1)', 150);
    });
  });
}

const style = document.createElement('style');
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
`;
document.head.appendChild(style);

window.addEventListener('beforeunload', () => {
  if (bubbleInterval) clearInterval(bubbleInterval);
});

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => document.body.style.opacity = '1', 100);
});
