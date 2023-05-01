const updateButton = document.getElementById('updateButton');
const deleteButton = document.getElementById('deleteButton');
const messageDiv = document.getElementById('message');

deleteButton.addEventListener('click', () => {
    fetch('/quotes', {
        method: 'delete',
        headers: { 'content-Type': 'application/json' },
        body: JSON.stringify({ 
            name: 'Darth Vader' 
        }),
    })
    .then(res => {
        if (res.ok) return res.json();
    })
    .then(data => {
        if(data === 'No quote to delete') {
            messageDiv.textContent = 'No quote to delete'
        } else {
            window.location.reload(true);
        }
    })
    .catch(error => console.error(error));
})

updateButton.addEventListener('click', () => {
    //Set PUT Request here
    fetch('/quotes', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Dark Knight',
            quote: 'I find your lack of faith disturbing'
        })

    })

    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));

})

// update.addEventListener('click', _ => {
//     fetch('/quotes', {
//       method: 'put',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         name: 'Darth Vader',
//         quote: 'I find your lack of faith disturbing.',
//       }),
//     })
//   })