// Hamburger menu toggle
var hamburger = document.querySelector('.hamburger');
var navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', function() {
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked (mobile)
navLinks.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function() {
    navLinks.classList.remove('open');
  });
});

// Highlight the current page link in navbar
var currentPage = window.location.pathname.split('/').pop() || 'home.html';
document.querySelectorAll('.nav-links a').forEach(function(link) {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});
