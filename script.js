const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const year = document.querySelector('#year');

year.textContent = new Date().getFullYear();

navToggle?.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const setText = (selector, value) => {
  const element = document.querySelector(selector);
  if (element && value) element.textContent = value;
};

const clearAndAppend = (selector, items, renderItem) => {
  const container = document.querySelector(selector);
  if (!container || !Array.isArray(items)) return;
  container.innerHTML = '';
  items.forEach((item, index) => {
    container.appendChild(renderItem(item, index));
  });
};

const createElement = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};

function renderContent(data) {
  if (!data) return;

  setText('[data-site-name]', data.site?.name);

  setText('[data-hero-eyebrow]', data.hero?.eyebrow);
  setText('[data-hero-title]', data.hero?.title);
  setText('[data-hero-description]', data.hero?.description);
  clearAndAppend('[data-hero-chips]', data.hero?.chips, (chip) => createElement('span', '', chip));

  if (data.chatDemo?.enabled === false) {
    document.querySelector('[data-chat-section]')?.remove();
  } else {
    setText('[data-chat-eyebrow]', data.chatDemo?.eyebrow);
    setText('[data-chat-title]', data.chatDemo?.title);
    setText('[data-chat-description]', data.chatDemo?.description);
    setText('[data-chat-placeholder]', data.chatDemo?.placeholder);
    const chatInput = document.querySelector('[data-chat-input]');
    const chatButton = document.querySelector('[data-chat-button]');
    if (chatInput && data.chatDemo?.inputPlaceholder) chatInput.placeholder = data.chatDemo.inputPlaceholder;
    if (chatButton && data.chatDemo?.buttonLabel) chatButton.textContent = data.chatDemo.buttonLabel;
  }

  setText('[data-about-eyebrow]', data.about?.eyebrow);
  setText('[data-about-title]', data.about?.title);
  setText('[data-about-description]', data.about?.description);

  setText('[data-portfolio-eyebrow]', data.portfolio?.eyebrow);
  setText('[data-portfolio-title]', data.portfolio?.title);
  setText('[data-portfolio-description]', data.portfolio?.description);
  clearAndAppend('[data-projects]', data.portfolio?.projects, (project) => {
    const article = createElement('article', 'project-card');
    article.appendChild(createElement('div', 'project-kicker', project.category));
    article.appendChild(createElement('h3', '', project.title));
    article.appendChild(createElement('p', '', project.description));
    return article;
  });

  setText('[data-skills-eyebrow]', data.skills?.eyebrow);
  setText('[data-skills-title]', data.skills?.title);
  clearAndAppend('[data-skills-list]', data.skills?.items, (skill) => {
    const card = createElement('div');
    card.appendChild(createElement('h3', '', skill));
    return card;
  });

  setText('[data-experience-eyebrow]', data.experience?.eyebrow);
  setText('[data-experience-title]', data.experience?.title);
  setText('[data-experience-description]', data.experience?.description);

  setText('[data-quote]', data.quote?.text ? `“${data.quote.text}”` : '');

  setText('[data-contact-eyebrow]', data.contact?.eyebrow);
  setText('[data-contact-title]', data.contact?.title);
  setText('[data-contact-description]', data.contact?.description);
  clearAndAppend('[data-contact-links]', data.contact?.links, (link) => {
    const anchor = createElement('a', '', link.label);
    anchor.href = link.url;
    if (link.type === 'external') {
      anchor.target = '_blank';
      anchor.rel = 'noopener';
    }
    return anchor;
  });
}

fetch('content.json')
  .then((response) => {
    if (!response.ok) throw new Error('No se pudo cargar content.json');
    return response.json();
  })
  .then(renderContent)
  .catch((error) => {
    console.warn('La web está usando el contenido de respaldo del HTML:', error);
  });
