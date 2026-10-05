const METRIKA_COUNTER_ID = 113010174;

function startYandexMetrika() {
  if (window.ym) return;

  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    k = e.createElement(t);
    a = e.getElementsByTagName(t)[0];
    k.async = 1;
    k.src = r;
    a.parentNode.insertBefore(k, a);
  }(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym'));

  window.ym(METRIKA_COUNTER_ID, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true
  });
}

function showCookieNotice() {
  const notice = document.createElement('aside');
  notice.className = 'cookie-notice';
  notice.setAttribute('aria-label', 'Настройки аналитических cookie');
  notice.innerHTML = `
    <p>Мы используем Яндекс Метрику, чтобы понимать, какие страницы и кнопки полезны посетителям. Подробнее — в <a href="privacy.html">Политике конфиденциальности</a>.</p>
    <div class="cookie-notice__actions">
      <button class="button button--small" type="button" data-cookie-accept>Разрешить</button>
      <button class="button button--secondary button--small" type="button" data-cookie-decline>Не сейчас</button>
    </div>`;

  document.body.appendChild(notice);

  notice.querySelector('[data-cookie-accept]').addEventListener('click', () => {
    localStorage.setItem('banger_analytics_consent', 'accepted');
    notice.remove();
    startYandexMetrika();
  });

  notice.querySelector('[data-cookie-decline]').addEventListener('click', () => {
    localStorage.setItem('banger_analytics_consent', 'declined');
    notice.remove();
  });
}

const analyticsConsent = localStorage.getItem('banger_analytics_consent');
if (analyticsConsent === 'accepted') {
  startYandexMetrika();
} else if (analyticsConsent !== 'declined') {
  showCookieNotice();
}

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.site-nav');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.textContent = isOpen ? '×' : '☰';
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menu.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.textContent = '☰';
    }
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

document.querySelectorAll('[data-year]').forEach((item) => {
  item.textContent = new Date().getFullYear();
});

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href]');
  if (!link || typeof window.ym !== 'function') return;

  const href = link.getAttribute('href') || '';
  let goal = '';

  if (href.startsWith('tel:')) {
    goal = 'contact_phone';
  } else if (href.includes('t.me/')) {
    goal = 'contact_telegram';
  } else if (href.includes('max.ru/')) {
    goal = 'contact_max';
  }

  if (goal) window.ym(METRIKA_COUNTER_ID, 'reachGoal', goal);
});
