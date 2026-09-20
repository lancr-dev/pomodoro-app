const currentPage = window.location.pathname;

const modes = {
  focus: {
    name: 'FOCUS MODE',
    duration: 25,
  },
  'short-break': {
    name: 'SHORT BREAK',
    duration: 5,
  },
  'long-break': {
    name: 'LONG BREAK',
    duration: 15,
  },
  exercise: {
    name: 'EXERCISE',
    duration: 15,
  },
};

function initializeTimer() {
  const timerMode = document.getElementById('timer-mode');
  const timerDisplay = document.getElementById('timer-display');
  const timerProgress = document.getElementById('timer-progress');
  const alarmSound = document.getElementById('alarm-sound');

  const params = new URLSearchParams(window.location.search);
  const selectedMode = params.get('mode');
  const mode = modes[selectedMode];

  if (!mode) {
    window.location.href = 'selection.html';
    return;
  }

  const timerCircumference = 2 * Math.PI * 120;
  let remainingSeconds = mode.duration * 60;

  timerMode.textContent = mode.name;
  timerDisplay.textContent = formatTime(remainingSeconds);
  timerDisplay.dateTime = `PT${mode.duration}M`;

  timerProgress.style.strokeDasharray = timerCircumference;
  timerProgress.style.strokeDashoffset = 0;

  const timerInterval = setInterval(() => {
    remainingSeconds -= 1;

    timerDisplay.textContent = formatTime(remainingSeconds);

    const progress = remainingSeconds / (mode.duration * 60);
    const offset = timerCircumference * (1 - progress);

    timerProgress.style.strokeDashoffset = offset;

    if (remainingSeconds <= 0) {
      clearInterval(timerInterval);

      timerDisplay.textContent = '00:00';
      timerProgress.style.strokeDashoffset = timerCircumference;

      alarmSound.currentTime = 0;
      alarmSound.play().catch(() => {});

      setTimeout(() => {
        alarmSound.pause();
        alarmSound.currentTime = 0;

        window.location.href = 'finished.html';
      }, 5000);
    }
  }, 1000);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds,
  ).padStart(2, '0')}`;
}

if (currentPage.endsWith('/timer.html')) {
  initializeTimer();
}

const animatedItems = document.querySelectorAll('.animate-item');

const animationObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      } else {
        entry.target.classList.remove('show');
      }
    });
  },
  {
    threshold: 0.2,
  },
);

animatedItems.forEach((item) => {
  animationObserver.observe(item);
});
