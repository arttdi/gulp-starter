var navToggle = document.querySelector('.page-header__toggle');
var navMain = document.querySelector('.main-nav');

navToggle.classList.remove('page-header__toggle--nojs');
navMain.classList.remove('main-nav--nojs');

navToggle.addEventListener('click', function() {
  if (navToggle.classList.contains('page-header__toggle--opened')) {
    navToggle.classList.remove('page-header__toggle--opened');
    navToggle.classList.add('page-header__toggle--closed');

    navMain.classList.remove('main-nav--closed');
  } else {
    navToggle.classList.add('page-header__toggle--opened');
    navToggle.classList.remove('page-header__toggle--closed');

    navMain.classList.add('main-nav--closed');
  }
});
