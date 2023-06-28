import { fetchData } from "./fetchModule";
import { pageChange } from "./landingPage";
import { createProject } from "./projectListPage";
import { getUsername } from "./helpers/userHelpers";

export function init(){
    initBodyPartUI();
    initFooterPartEvent();
}

export function navbarChange(tabName) {
    const navLink = document.getElementById(tabName);
    const navLinks = document.querySelectorAll('.nav-pills .nav-link');
    highlightLink(navLink, navLinks);
    pageChange(tabName);
}

function initBodyPartUI() {
    // nav links
    const navLinks = document.querySelectorAll('.nav-pills .nav-link');
    navLinks.forEach((navLink) => {
        navLink.addEventListener('click', (e) => {
            highlightLink(e.currentTarget, navLinks);
            pageChange(e.currentTarget.id); // re-render main section of landing page
        });
    });
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

function initFooterPartEvent() {
    const logoutFunc = () => {
        sessionStorage.removeItem('usertoken');
        window.location.href = '/index.html';
    };
    
    // display username
    document.getElementById('navUserEmail').innerText = getUsername();

    // bind create project button
    document.getElementById('navCreateProject').addEventListener('click', (event) => {
        createProject();
    });

    // bind delete account button event
    document.getElementById('confirmDeleteAccount').addEventListener('click', (event) => {
        fetchData('/Auth/DeleteAccount', null, logoutFunc);
    });

    // bind logout button event
    document.getElementById('signoutBtn').addEventListener('click', (event) => {
        logoutFunc();
    });
}