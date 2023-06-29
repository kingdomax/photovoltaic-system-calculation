import '../scss/landing-page.scss';
import * as bootstrap from 'bootstrap';
import { fetchData } from './fetchModule';
import * as navbar from './navbarModule';
import * as projectPage from './projectPage';
import * as profilePage from './profilePage';
import * as projectListPage from './projectListPage';

export function initLandingPage() {
    if (!sessionStorage.getItem('usertoken')) { window.location.href = '/index.html'; }    
    navbar.init();
    profilePage.init();
    projectListPage.init();
    projectPage.init();
}

let state = { currentPage: 'profile', currentProject: null, targetDeleteProject: -1 }; // central state of page
export function getState() { return JSON.parse(JSON.stringify(state)); }
export function updateState(newState, enableReRender = true) { 
    state = { ...state, ...newState };
    if (enableReRender) {
        sideEffect();
        reRender();
    }
}
function sideEffect() {
    switch (state.currentPage){
        case 'projectList':     fetchData('/Project/GetProjectList', null, projectListPage.renderProjectList);
                                break;
        case 'project':         projectPage.renderProjectPage();
                                break;
    }
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
