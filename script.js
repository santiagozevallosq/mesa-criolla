// Peru country code + business number, digits only.
const WHATSAPP_NUMBER = '51934086161';

const bookingDialog = document.querySelector('#booking-dialog');
const bookingForm = document.querySelector('#booking-form');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
const dishChoices = [...bookingForm.querySelectorAll('input[name="dishes"]')];
const otherDishField = document.querySelector('#other-dish-field');
const otherDishInput = document.querySelector('#other-dish');
const menuToggleLabel = menuToggle.querySelector('.sr-only');
const preferredDate = document.querySelector('#preferred-date');
const dishHint = document.querySelector('#dish-hint');

const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
preferredDate.min = today.toISOString().slice(0, 10);

document.querySelector('#year').textContent = new Date().getFullYear();

document.querySelectorAll('.js-open-booking').forEach((button) => {
  button.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggleLabel.textContent = 'Abrir menú';
    bookingDialog.showModal();
  });
});

document.querySelector('.dialog-close').addEventListener('click', () => bookingDialog.close());
bookingDialog.addEventListener('click', (event) => {
  if (event.target === bookingDialog) bookingDialog.close();
});

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggleLabel.textContent = open ? 'Cerrar menú' : 'Abrir menú';
  mainNav.classList.toggle('is-open', open);
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggleLabel.textContent = 'Abrir menú';
  });
});

dishChoices.forEach((choice) => {
  choice.addEventListener('change', () => {
    const selectedDishes = dishChoices.filter((item) => item.checked);
    if (selectedDishes.length > 3) {
      choice.checked = false;
      dishHint.textContent = 'Puedes seleccionar hasta tres platos.';
      return;
    }

    dishHint.textContent = 'Elige hasta tres opciones. La disponibilidad se confirma por WhatsApp.';
    const wantsOtherDish = dishChoices.some((item) => item.checked && item.value === 'Otro plato');
    otherDishField.hidden = !wantsOtherDish;
    otherDishInput.required = wantsOtherDish;
    if (!wantsOtherDish) otherDishInput.value = '';
  });
});

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;

  const formData = new FormData(bookingForm);
  const dishes = formData.getAll('dishes').filter((dish) => dish !== 'Otro plato');
  if (formData.get('other-dish')) dishes.push(`Otro: ${formData.get('other-dish')}`);
  const dishText = dishes.length ? dishes.join(', ') : 'Quiero conversar sobre el menú';
  const rawDate = formData.get('preferred-date');
  const dateText = rawDate
    ? new Date(`${rawDate}T00:00:00`).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Por coordinar';
  const message = [
    '¡Hola, Mesa Criolla! Quisiera consultar por el servicio piloto de cocina en casa.',
    `Distrito: ${formData.get('district')}`,
    `Personas: ${formData.get('diners')}`,
    `Platos de interés: ${dishText}`,
    `Fecha tentativa: ${dateText}`,
    '¿Podrían confirmarme cobertura, disponibilidad y precio?',
  ].join('\n');

  window.location.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
});
