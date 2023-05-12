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
  searchField.classList.toggle('active');
}

function hideSearchField() {
  const searchField = document.getElementById('searchField');
  searchField.classList.remove('active');
}



// const searchBar = document.getElementById('search-tag');
// const tags = document.getElementById('tags');


// searchBar.addEventListener('keyup', (event) => {


//   const search = event.target.value.toLowerCase();
//   const tagsList = tags.querySelectorAll('.tag');
//   tagsList.forEach((tag) => {
//     const tagText = tag.querySelector('.tag-text').textContent.toLowerCase();
//     if (tagText.includes(search)) {
//       tag.style.display = 'block';
//       } else {  
//         tag.style.display = 'none';
//              }
//      });
//    });
       
// Select the elements
var searchInput = document.getElementById('searchInput');
var searchIcon = document.getElementById('search-tag');

// Add click event listener to the search icon
searchIcon.addEventListener('click', (e) => {
  e.preventDefault();
  // Toggle the display of the search input
  if (searchInput.style.display === 'none') {
    searchInput.style.display = 'inline-block';
     searchInput.style.transition = 'all 2s ease-out;'
    searchInput.style.marginRight = '10px';
    searchInput.style.marginLeft = '-100px';
    searchInput.style.marginBottom = '-900px'
    searchInput.style.width = '200px';
    searchInput.style.border = '1px solid #ccc';
    searchInput.style.borderRadius = '0px 0px 5px 5px';
    searchInput.style.padding = '10px';
    searchInput.style.fontSize = '16px';
    searchInput.style.background = 'white';
    searchInput.style.color = 'black';
    searchInput.style.boxShadow = '0 0 5px #ccc';
    searchInput.focus();
 //   searchInput.classList.toggle('active');

   // searchInput.style.marginLeft = '-170px';
  } else {
    searchInput.style.display = 'none';
  }

  // Focus on the search input

});
