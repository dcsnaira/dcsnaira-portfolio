document.getElementById('year').textContent = new Date().getFullYear();

const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => observer.observe(el));

const form = document.getElementById('contact-form');
const thanksCard = document.getElementById('thanks-card');
const submitButton = form.querySelector('.send-btn');
const formStatus = document.getElementById('form-status');
const defaultButtonText = submitButton.textContent;
let isSubmitting = false;

const setFieldValidity = (field) => {
  const value = field.value.trim();
  field.value = value;
  field.setCustomValidity(value ? '' : 'Please fill out this field.');
};

form.addEventListener('input', (event) => {
  if (event.target.matches('input, textarea')) {
    event.target.setCustomValidity('');
    formStatus.textContent = '';
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (isSubmitting) return;

  const nameField = form.elements.name;
  const emailField = form.elements.email;
  const messageField = form.elements.message;

  [nameField, emailField, messageField].forEach(setFieldValidity);

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  if (form.action.includes('YOUR_FORM_ID')) {
    formStatus.textContent = 'This contact form still needs its Formspree form ID before it can send messages.';
    return;
  }

  isSubmitting = true;
  submitButton.disabled = true;
  submitButton.textContent = 'sending…';
  formStatus.textContent = '';

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      const serviceMessage = result?.errors
        ?.map((error) => error.message)
        .filter(Boolean)
        .join(' ');

      throw new Error(serviceMessage || 'Your message could not be sent. Please try again.');
    }

    form.reset();
    form.style.display = 'none';
    thanksCard.style.display = 'block';
    thanksCard.focus();
  } catch (error) {
    formStatus.textContent = error.message || 'Your message could not be sent. Please try again.';
  } finally {
    isSubmitting = false;
    submitButton.disabled = false;
    submitButton.textContent = defaultButtonText;
  }
});
