import './styles/main.scss';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

AOS.init();

document.addEventListener('DOMContentLoaded', function () {
  var backToTopButton = document.querySelector('.back-to-top');

  if (backToTopButton) {
    backToTopButton.addEventListener('click', function (event) {
      event.preventDefault();

      // Scroll suau fins a dalt
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    });
  }
});