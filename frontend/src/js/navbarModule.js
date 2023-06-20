import { fetchData } from "./fetchModule";
import { pageChange } from "./landingPage";
import { getUsername } from "./helpers/userHelpers";

export function init(){
    initBodyPart();
    initFooterPart();
}

function initBodyPart() {
    // nav links
    const navLinks = document.querySelectorAll('.nav-pills .nav-link');
    navLinks.forEach((navLink) => {
        navLink.addEventListener('click', (e) => {
            // Remove 'active' and add 'text-white' classes for all <a> tags
            navLinks.forEach((link) => {
                link.classList.remove('active');
                link.classList.add('text-white');
            });

            // Add 'active' and remove 'text-white' classes for the clicked <a> tag
            navLink.classList.add('active');
            navLink.classList.remove('text-white');

            // re-render main section of landing page
            pageChange(e.currentTarget.id);
        });
    });
}

function initFooterPart() {
    const logoutFunc = () => {
        sessionStorage.removeItem('usertoken');
        window.location.href = '/index.html';
    };
    
    // profile picture
    document.getElementById('navUserEmail').innerText = getUsername();

    // delete account button
    document.getElementById('confirmDeleteAccount').addEventListener('click', (event) => {
        fetchData('http://localhost:7070/Auth/DeleteAccount', null, logoutFunc, (error) => { alert(`Failed: ${error.message}`); });
    });

    // logout button
    document.getElementById('signoutBtn').addEventListener('click', (event) => {
        logoutFunc();
    });
}