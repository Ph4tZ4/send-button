// Page fade-in on initial load (random duration/delay + blur)
window.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('appRoot');
  if (!root) return;

  const items = root.querySelectorAll('*');
  items.forEach((element) => element.classList.add('fade-seq-init'));

  requestAnimationFrame(() => {
    root.classList.remove('js-init');
    items.forEach((element) => {
      const durationMs = Math.floor(1000 + Math.random() * 500); // 1000–1500ms
      const delayMs = Math.floor(Math.random() * 150); // slight desync
      element.style.setProperty('--fade-dur', String(durationMs) + 'ms');
      element.style.setProperty('--fade-delay', String(delayMs) + 'ms');
      element.classList.add('fade-seq');

      const onEnd = () => {
        element.classList.remove('fade-seq', 'fade-seq-init');
        element.style.removeProperty('--fade-dur');
        element.style.removeProperty('--fade-delay');
        element.removeEventListener('animationend', onEnd);
      };
      element.addEventListener('animationend', onEnd);
    });
  });
});

// Toast helper
function createToast({ message, variant = 'noob', lifetimeMs = 3500 }) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${variant}`;
  toast.style.setProperty('--toast-lifetime', `${lifetimeMs}ms`);

  const icon = document.createElement('div');
  icon.className = 'toast__icon';
  icon.innerHTML = variant === 'pro'
    ? '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"/></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a1 1 0 100 2 1 1 0 000-2zm1 4a1 1 0 10-2 0v5a1 1 0 102 0V9z"/></svg>';

  const label = document.createElement('div');
  label.className = 'toast__label';
  label.textContent = message;

  const time = document.createElement('div');
  time.className = 'toast__time';
  const now = new Date();
  time.textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

  const progress = document.createElement('div');
  progress.className = 'toast__progress';
  const bar = document.createElement('span');
  progress.appendChild(bar);

  toast.appendChild(icon);
  toast.appendChild(label);
  toast.appendChild(time);
  toast.appendChild(progress);
  container.appendChild(toast);

  const remove = () => {
    toast.style.animation = 'toastOut 250ms ease forwards';
    setTimeout(() => toast.remove(), 240);
  };
  setTimeout(remove, lifetimeMs);
}

// Button wiring
const noobBtn = document.getElementById('noobBtn');
const proBtn = document.getElementById('proBtn');
const rocket = proBtn.querySelector('.rocket');

let cooldown = false;

if (noobBtn) {
  noobBtn.addEventListener('click', () => {
    createToast({ message: 'Noob: Message sent.', variant: 'noob', lifetimeMs: 2800 });
  });
}

if (proBtn) {
  proBtn.addEventListener('click', () => {
    if (cooldown) return;

    cooldown = true;
    rocket.classList.add('shoot');

    // Disable button during cooldown
    proBtn.disabled = true;
    proBtn.classList.add('opacity-50', 'cursor-not-allowed');
    createToast({ message: 'Pro: Dispatched with style.', variant: 'pro', lifetimeMs: 3500 });

    // Reset rocket after animation
    setTimeout(() => {
      rocket.classList.remove('shoot');
      proBtn.disabled = false;
      proBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      cooldown = false;
    }, 5000); // 5 seconds cooldown
  });
}


