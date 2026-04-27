const slider = document.querySelector('.slider');
const overlay = document.querySelector('.overlay');

if (slider && overlay) {
  slider.addEventListener('input', () => {
    overlay.style.width = slider.value + '%';
  });
}
