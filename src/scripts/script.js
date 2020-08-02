$(document).ready(function() {

  // svg
  svg4everybody();

  // menu
  $(document).on('click', function() {
    $('.menu__link_submenu.is-active').removeClass('is-active');
  });
  
  $(document).on('click', '.menu__link_submenu:not(.is-active)', function(e) {
    var wWidth = $(window).width();

    if (wWidth >= 1020) {
      e.preventDefault();
      e.stopPropagation();
      $(this).addClass('is-active');
    }    
  });

  $(document).on('click', '.menu__sublist', function(e) {
    e.stopPropagation();
  });

  $(document).on('click', '.header__menu-btn', function(e) {
    e.preventDefault();
    $('.header__menu').addClass('is-active');
  });

  $(document).on('click', '.menu__close', function(e) {
    e.preventDefault();
    $('.menu').removeClass('is-active');
  });

  // popup
  $('[data-fancybox]').fancybox({
    autoFocus: false,
    touch : false
  });

  $(document).on('change', '#popup', function(e) {
    var target = e.target;
    var set1 = $('#opt1').prop('checked');
    var set2 = set1 && $('#opt2').prop('checked');
    var set3 = $('#opt3').prop('checked');

    if (target.name.indexOf('opt') !== -1) {
      $('#submit-btn').prop('disabled', set1);
      $('#opt2').prop('disabled', set2);
      $('#name-input').prop('disabled', set3);
    }
  });
});
