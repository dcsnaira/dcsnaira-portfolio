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
form.addEventListener('submit', (e) => {
  e.preventDefault();
  form.style.display = 'none';
  thanksCard.style.display = 'block';
});
