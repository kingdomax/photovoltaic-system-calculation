import '../scss/landing-page.scss';
import * as bootstrap from 'bootstrap';
import * as navbar from './navbarModule.js';
import * as profilePage from './profilePage.js';
import * as projectListPage from './projectListPage.js';

let state = { currentPage: 'profile', }; // central state
export function getState() { JSON.parse(JSON.stringify(state)); }
export function pageChange(page) { 
    state.currentPage = page;
    reRender();
}
function reRender() {
    document.querySelector('.profile-page').style.display = 'none';
    document.querySelector('.project-list-page').style.display = 'none';
    document.querySelector('.project-page').style.display = 'none';

    switch (state.currentPage){
        case 'profile':     document.querySelector('.profile-page').style.display = 'block';
                            break;
        case 'projectList': document.querySelector('.project-list-page').style.display = 'block';
                            break;
        case 'project':     document.querySelector('.project-page').style.display = 'block';
                            break;
    }
}

export function initLandingPage() {
    if (!sessionStorage.getItem('usertoken')) { window.location.href = '/index.html'; }    
    navbar.init();
    profilePage.init();
    projectListPage.init();
    // projectPage.init();
}