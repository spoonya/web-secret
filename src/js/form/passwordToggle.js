import { CLASSES, DATA_ATTR } from '../constants';

export default function initPasswordToggle() {
  const passwordToggles = document.querySelectorAll(DATA_ATTR.passwordToggle);

  if (!passwordToggles.length) return;

  passwordToggles.forEach((toggle) => {
    const input = toggle.closest(DATA_ATTR.formControl).querySelector('input');

    toggle.addEventListener('click', () => {
      input.type = input.type === 'password' ? 'text' : 'password';
      toggle.classList.toggle(CLASSES.active);
    });
  });
}
