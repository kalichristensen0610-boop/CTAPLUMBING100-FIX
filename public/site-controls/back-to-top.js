(() => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'site-back-to-top';
  button.textContent = '↑ Back to top';
  button.hidden = true;
  document.body.append(button);

  const updateVisibility = () => {
    button.hidden = window.scrollY < 450;
  };

  button.addEventListener('click', () => {
    const heading = document.querySelector('main h1');
    if (heading instanceof HTMLElement) {
      if (!heading.hasAttribute('tabindex')) heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' });
  });

  window.addEventListener('scroll', updateVisibility, { passive: true });
  updateVisibility();
})();
