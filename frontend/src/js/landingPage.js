import '../scss/landing-page.scss';
import * as bootstrap from 'bootstrap';
import * as navbar from './navbarModule.js';
import * as profilePage from './profilePage.js';
import * as projectListPage from './projectListPage.js';

let state = { currentPage: 'profile', };
export function getState() { JSON.parse(JSON.stringify(state)); }
export function pageChange(page) { 
    state.currentPage = page;
    reRender();
}
function reRender() {
    document.getElementsByClassName("profile-page")[0].style.display = "none";
    document.getElementsByClassName("project-list-page")[0].style.display = "none";
    //document.getElementsByClassName("project-page")[0].style.display = "none";

    switch (state.currentPage){
        case "profile":     document.getElementsByClassName("profile-page")[0].style.display = "block";
                            break;
        case "projectList": document.getElementsByClassName("project-list-page")[0].style.display = "block";
                            break;
        //case "project": ;
    }
}

if (!sessionStorage.getItem('usertoken')) { window.location.href = '/index.html'; }
navbar.init();
profilePage.init();
projectListPage.init();
// projectPage.init();