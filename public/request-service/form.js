const form = document.querySelector('#request-form');
const steps = [...form.querySelectorAll('fieldset')];
const progress = form.querySelector('progress');
const progressText = document.querySelector('#form-progress');
const back = document.querySelector('#form-back');
const next = document.querySelector('#form-next');
const error = document.querySelector('#form-error');
const success = document.querySelector('#form-success');
const selections = {};
let step = 0;
let requestId;
const formStartedAt = Date.now();
let widget;
let turnstileToken = '';
const securityReady = fetch('/api/request-service')
  .then((response) => {
    if (!response.ok) throw new Error();
    return response.json();
  })
  .then(({ siteKey }) => {
    if (!siteKey) return;
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.onerror = reject;
      script.onload = () => window.turnstile.ready(() => {
        widget = window.turnstile.render('#request-security', {
          sitekey: siteKey,
          appearance: 'interaction-only',
          callback: (token) => { turnstileToken = token; },
          'expired-callback': () => { turnstileToken = ''; },
          'error-callback': () => { turnstileToken = ''; }
        });
        resolve();
      });
      document.head.append(script);
    });
  })
  .then(() => true, () => false);

function showStep(index) {
  step = index;
  steps.forEach((fieldset, number) => {
    fieldset.hidden = fieldset.disabled = number !== step;
  });
  progress.value = step + 1;
  progressText.textContent = `Step ${step + 1} of ${steps.length}`;
  back.hidden = step === 0;
  next.hidden = step !== steps.length - 1;
  error.hidden = true;
  steps[step].querySelector('legend').focus();
}

form.addEventListener('click', (event) => {
  const choice = event.target.closest('button[data-field]');
  if (!choice || !steps[step].contains(choice)) return;
  selections[choice.dataset.field] = choice.value;
  for (const option of steps[step].querySelectorAll('button[data-field]')) {
    option.setAttribute('aria-pressed', String(option === choice));
  }
  showStep(step + 1);
});

back.addEventListener('click', () => showStep(step - 1));

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (step !== steps.length - 1 || next.disabled) return;

  const contact = Object.fromEntries(new FormData(form));
  requestId ??= crypto.randomUUID();
  error.hidden = true;
  back.disabled = next.disabled = true;
  next.textContent = 'Submitting…';

  try {
    if (!await securityReady) throw new Error('The security check could not load. Refresh the page or call us.');
    if (widget !== undefined && !turnstileToken) throw new Error('Please complete the security check and try again.');
    const response = await fetch('/api/request-service', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...selections, ...contact, id: requestId, formStartedAt, turnstileToken }),
      signal: AbortSignal.timeout(25000)
    });
    const result = await response.json();
    if (!response.ok || result.accepted !== true) throw new Error(result.message);
    form.reset();
    form.hidden = true;
    success.hidden = false;
    success.focus();
  } catch (failure) {
    error.textContent = failure.message || 'We couldn’t confirm your request. Please try again or call (208) 447-9290.';
    error.hidden = false;
  } finally {
    if (turnstileToken && widget !== undefined) {
      turnstileToken = '';
      window.turnstile.reset(widget);
    }
    back.disabled = next.disabled = false;
    next.textContent = 'Submit Request';
  }
});
form.hidden = false;
