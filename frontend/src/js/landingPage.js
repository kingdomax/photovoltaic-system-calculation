import '../scss/landing-page.scss';
//import * as bootstrap from 'bootstrap';
import { fetchData } from './fetchModule';
import * as navbar from './navbarModule';
import * as projectPage from './projectPage';
import * as profilePage from './profilePage';
import * as projectListPage from './projectListPage';

// Central state (assign to window for debug purpose)
window.state = { 
    currentPage: 'profile',
    currentProject: null, // same as Project.cs
    targetDeleteProject: -1,
    currentProduct: { // same as Product.cs
        id: -1,
    }
};
export function getState() { return JSON.parse(JSON.stringify(window.state)); }
export function updateState(newState, enableReRender = false) { 
    window.state = { ...window.state, ...newState };
    if (enableReRender) {
        reRender();
        sideEffect();
    }
}
function reRender() {
    switch (window.state.currentPage){
        case 'projectList':     fetchData('/Project/GetProjectList', null, projectListPage.renderProjectList);
                                break;
        case 'project':         projectPage.renderProjectPage();
                                break;
    }
}
function sideEffect() {
    document.querySelector('.profile-page').style.display = 'none';
    document.querySelector('.project-list-page').style.display = 'none';
    document.querySelector('.project-page').style.display = 'none';

    switch (window.state.currentPage){
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
    projectPage.init();
}