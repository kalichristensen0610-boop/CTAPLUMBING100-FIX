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
    const response = await fetch('/api/request-service', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...selections, ...contact, id: requestId }),
      signal: AbortSignal.timeout(12000)
    });
    if (!response.ok || (await response.json()).accepted !== true) throw new Error();
    form.reset();
    form.hidden = true;
    success.hidden = false;
    success.focus();
  } catch {
    error.textContent = 'We couldn’t confirm your request. Please try again or call (208) 447-9290.';
    error.hidden = false;
  } finally {
    back.disabled = next.disabled = false;
    next.textContent = 'Submit Request';
  }
});
form.hidden = false;
