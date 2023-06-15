import '../scss/signin-page.scss'; // Import our custom CSS
//import * as bootstrap from 'bootstrap'; // Import all of Bootstrap's JS
//import { Tooltip, Toast, Popover } from 'bootstrap'; // or, specify which plugins you need:

document.getElementById('loginForm').addEventListener('submit', function(event) {
    // Prevent the form from submitting normally
    event.preventDefault();
    
    // Get the form fields
    const email = document.getElementById('floatingInput').value;
    const password = document.getElementById('floatingPassword').value;
    
    // Send the data to the server
    fetch('http://localhost:7070/Auth/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response (see below)
        if (data.token) {
            alert('Login success');
            
            // Save the token and redirect the user
            //localStorage.setItem('token', data.token);
            //window.location.href = '/dashboard.html';
        } else {
            // Show an error message
            alert('Login failed');
        }
    });
});