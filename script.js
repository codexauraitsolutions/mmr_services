// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    toggle.innerHTML = open ? '&times;' : '&#9776;';
  });

  // Close the menu after tapping a link or when resizing back to desktop
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.innerHTML = '&#9776;';
    });
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.innerHTML = '&#9776;';
    }
  });
});

// Header: fade out while scrolling down, fade back in when scrolling up
document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.site-header');
  var nav = document.querySelector('.nav');
  if (!header) return;

  var lastY = window.scrollY;
  var SHOW_ABOVE = 120;   // always visible near the top of the page
  var THRESHOLD = 6;      // ignore tiny scroll jitters

  function update() {
    var y = window.scrollY;
    var menuOpen = nav && nav.classList.contains('open');
    if (y <= SHOW_ABOVE || menuOpen) {
      header.classList.remove('header-hidden');
    } else if (y - lastY > THRESHOLD) {
      header.classList.add('header-hidden');      // scrolling down
    } else if (lastY - y > THRESHOLD) {
      header.classList.remove('header-hidden');   // scrolling up
    }
    if (Math.abs(y - lastY) > THRESHOLD) lastY = y;
  }

  window.addEventListener('scroll', update, { passive: true });

  // Bring the header back when keyboard focus moves into it
  header.addEventListener('focusin', function () { header.classList.remove('header-hidden'); });
});
