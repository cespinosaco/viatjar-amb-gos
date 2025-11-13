import './styles/main.scss';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

AOS.init();

// Toggle consells extres
const tipsToggle = document.querySelector('.tips__toggle');
const tipsExtra = document.getElementById('tips-extra');

if (tipsToggle && tipsExtra) {
  tipsToggle.addEventListener('click', () => {
    const isExpanded = tipsToggle.getAttribute('aria-expanded') === 'true';
    tipsToggle.setAttribute('aria-expanded', String(!isExpanded));
    tipsExtra.hidden = isExpanded;
    tipsToggle.textContent = isExpanded ? 'Mostra més consells' : 'Amaga els consells';
  });
}