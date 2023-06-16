import '../scss/signin-page.scss'; // Import our custom CSS
//import * as bootstrap from 'bootstrap'; // Import all of Bootstrap's JS
//import { Tooltip, Toast, Popover } from 'bootstrap'; // or, specify which plugins you need:

let isSignup = false;

document.getElementById('signinForm').addEventListener('submit', (event) => {
    // Prevent the form from submitting normally
    event.preventDefault();
    
    // Get the form fields
    const email = document.getElementById('floatingInput').value;
    const password = document.getElementById('floatingPassword').value;
    const url = isSignup ? 'http://localhost:7070/Auth/Signup' : 'http://localhost:7070/Auth/Login';
    
    // Send the data to the server
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`${response.statusText} (status code ${response.status})`);
        }
        return response.json();
    })
    .then(data => {
        alert('Login success');
        // Save the token and redirect the user
        //sessionStorage.setItem('usertoken', data.token);
        //window.location.href = '/dashboard.html';
    })
    .catch(error => {
        // This will catch any fetch errors, and also any errors that throw manually.
        alert(`Login failed: ${error.message}`);
    });
});

document.getElementById('createAccount').addEventListener('click', (event) => {
    event.preventDefault();

    isSignup = true;

    document.getElementById('signinTextHeader').innerText = "Create Account";
    document.getElementById('signinBtn').innerText = "Sign Up";
    document.getElementById('signinBtn').classList.replace('btn-primary', 'btn-danger');
    document.getElementById('signinTextFooter').style.display = 'none';
});
