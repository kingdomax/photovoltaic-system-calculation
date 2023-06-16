//import * as bootstrap from 'bootstrap'; // Import all of Bootstrap's JS
//import { Tooltip, Toast, Popover } from 'bootstrap'; // or, specify which plugins you need:
import '../scss/signin-page.scss';
import { fetchData } from './fetchModule.js';

let isSignup = false;
initSigninForm();
initSignupForm();

function initSigninForm() {
    document.getElementById('signinForm').addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Get the form fields
        const email = document.getElementById('floatingInput').value;
        const password = document.getElementById('floatingPassword').value;
        const url = isSignup ? 'http://localhost:7070/Auth/Signup' : 'http://localhost:7070/Auth/Login';
    
        // Save the token and redirect the user
        const onSuccess = (data) => {
            sessionStorage.setItem('usertoken', data.token);
            window.location.href = '/dashboard.html';
        };
    
        const onError = (error) => {
            alert(`Login failed: ${error.message}`);
        };
    
        fetchData(url, { email, password }, onSuccess, onError);
    });
}

function initSignupForm() {
    document.getElementById('createAccount').addEventListener('click', (event) => {
        isSignup = true;
        document.getElementById('signinTextHeader').innerText = "Create Account";
        document.getElementById('signinBtn').innerText = "Sign Up";
        document.getElementById('signinBtn').classList.replace('btn-primary', 'btn-danger');
        document.getElementById('signinTextFooter').style.display = 'none';
    });
}
