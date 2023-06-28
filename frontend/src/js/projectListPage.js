import { fetchData } from './fetchModule';
import { navbarChange } from './navbarModule';

const filterButton = `<small class="d-block border-bottom pb-3">
                         <a href="#">Active projects</a> <!-- All projects, Old projects -->
                     </small>`;         

export function init() {
    document.querySelector('.project-list-page').style.display = 'none'; // hide panel first
    fetchData('/Project/GetProjectList', null, renderProjectList); // then render project list in background
    document.querySelector('#createProjectBtn').addEventListener('click', (event) => { 
        createProject(); 
    }); // bind create button project
}

export function createProject() {
    // => input project name

    const goToProjectPage = () => {
        navbarChange('project');
        // assign new project data to state
        // render project page properly
    };
    fetchData('/Project/CreateProject', { ProjectName: 'Test' }, goToProjectPage);
}

function renderProjectList(projectList) {
    // Show empty container if there is no project data
    if ((projectList?.length ?? 0)  == 0) { 
        document.querySelector('.project-list-container').style.display = 'none';
        return;
    }

    // Insert filter button at top
    let container = document.querySelector(".project-list-container");
    container.replaceChildren();
    container.insertAdjacentHTML('beforeend', `<small class="d-block border-bottom pb-3">
                                                    <a href="#">Active projects</a> <!-- Old projects, All projects -->
                                                </small>`);

    // Then, insert 'projectItem' to '.project-list-container'
    projectList.forEach(project => {
        let actionText = project.status ? 'edit' : 'view';
        let color = project.status ? '#007bff' : '#6c757d';
        let createdAtDate = new Date(project.createdAt);
        let formattedDate = `${createdAtDate.getDate()} ${createdAtDate.toLocaleString('default', { month: 'long' })} ${createdAtDate.getFullYear()}`;
        let projectStatus = project.status ? `created: ${formattedDate}` : 'read-only';

        let projectItem = `<div class="d-flex text-body-secondary pt-3">
                                <svg class="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="${color}"/><text x="50%" y="50%" fill="${color}" dy=".3em">32x32</text></svg>
                                <div class="pb-3 mb-0 small lh-sm border-bottom w-100">
                                <div class="d-flex justify-content-between">
                                    <strong class="text-gray-dark">${project.name}</strong>
                                    <a href="#">${actionText}</a>
                                </div>
                                <span class="d-block">${projectStatus}</span>
                                </div>
                            </div>`;
        container.insertAdjacentHTML('beforeend', projectItem);
    });

    // Attach event listener to projectItem
    bindEvents();
}

function bindEvents() {
    // toggle button
    // => re-renderproject list
    // => switch text

    // edit/view button
    // => open project page with current project id

    //delete button
}
