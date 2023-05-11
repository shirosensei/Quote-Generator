document.querySelector('.themetoggle').addEventListener('click', (event) => {
    event.preventDefault();
    
    if (localStorage.getItem('theme') === 'dark') {
      localStorage.removeItem('theme');
    }
    else {
      localStorage.setItem('theme', 'dark')
    }
    darkMode()
  });
  
  function darkMode() {
    try {
      if (localStorage.getItem('theme') === 'dark') {
        document.querySelector('html').classList.add('dark');
        document.querySelector('.themeDark span').textContent = 'dark_mode';
        document.getElementById('darkMode').style.display = 'none';
        document.getElementById('lightMode').style.display = 'block';
   
      }
      else {
        document.querySelector('html').classList.remove('dark');
        document.querySelector('.themeLight span').textContent = 'wb_sunny';
        document.getElementById('lightMode').style.display = 'none'
        document.getElementById('darkMode').style.display = 'block';
      }
    } catch (err) { }
  }
  
  darkMode();