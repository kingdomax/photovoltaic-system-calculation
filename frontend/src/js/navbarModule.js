import { fetchData } from "./fetchModule";
import { updateState } from "./landingPage";
import { getUsername } from "./helpers/userHelpers";

export function init(){
    initBodyPartUI();
    initFooterPartEvent();
}

export function navbarChange(tabName) {
    const navLink = document.getElementById(tabName);
    const navLinks = document.querySelectorAll('.nav-pills .nav-link');
    highlightLink(navLink, navLinks);
    updateState({ currentPage: tabName });
}

function highlightLink(navLink, navLinks) {
    // Remove 'active' and add 'text-white' classes for all <a> tags
    navLinks.forEach((link) => {
        link.classList.remove('active');
        link.classList.add('text-white');
    });

    // Add 'active' and remove 'text-white' classes for the clicked <a> tag
    navLink.classList.add('active');
    navLink.classList.remove('text-white');
}

function initBodyPartUI() {
    // nav links
    const navLinks = document.querySelectorAll('.nav-pills .nav-link');
    navLinks.forEach((navLink) => {
        navLink.addEventListener('click', (e) => {
            highlightLink(e.currentTarget, navLinks);
            updateState({ currentPage: e.currentTarget.id }); // re-render main section of landing page
        });
    });
}

function initFooterPartEvent() {
    const logoutFunc = () => {
        sessionStorage.removeItem('usertoken');
        window.location.href = '/index.html';
    };
    
    // display username
    document.getElementById('navUserEmail').innerText = getUsername();

    // bind delete account button event
    document.getElementById('confirmDeleteAccount').addEventListener('click', (event) => {
        fetchData('/Auth/DeleteAccount', null, logoutFunc);
    });

    // bind logout button event
    document.getElementById('signoutBtn').addEventListener('click', (event) => {
        logoutFunc();
    });
}