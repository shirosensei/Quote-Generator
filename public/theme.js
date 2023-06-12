const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', (event) => {
  event.preventDefault();
  
  if (localStorage.getItem('theme') === 'dark') {
    localStorage.removeItem('theme');
  } else {
    localStorage.setItem('theme', 'dark');
  }
  
  updateTheme();
});

function updateTheme() {
  try {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
      themeToggle.classList.add('dark');
      themeToggle.querySelector('span').textContent = 'wb_sunny';
    } else {
      document.documentElement.classList.remove('dark');
      themeToggle.classList.remove('dark');
      themeToggle.querySelector('span').textContent = 'dark_mode';
    }
  } catch (err) {
    console.log(err);
  }
}

updateTheme();

function toggleSearchField() {
  const searchField = document.getElementById('searchField');
  const searchIcon = document.getElementById('search-icon');
    searchIcon.style.display = 'none';
    searchField.classList.toggle('active');
  searchField.focus();
}

function hideSearchField() {
  const searchIcon = document.getElementById('search-icon');
  const searchField = document.getElementById('searchField');
  searchField.classList.remove('active');
  searchIcon.style.display = 'block';
}




let mobileNav = document.querySelector('.mobile-nav');
let nav = document.getElementById('nav-links');
let links = nav.querySelectorAll('.links');

mobileNav.addEventListener('click', () => {
  nav.classList.toggle('hide');
  mobileNav.classList.toggle('lines-rotate');
});

for(let i = 0; i < links.length; i++) {
  links[i].addEventListener('click', () => {
    nav.classList.toggle('hide');
    mobileNav.classList.toggle('line-rotate');

    });
}
