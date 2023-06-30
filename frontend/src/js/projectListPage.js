import { fetchData } from './fetchModule';
import { getState, updateState } from './landingPage';
import { navbarChange } from './navbarModule';

export function init() {
    document.querySelector('.project-list-page').style.display = 'none'; // hide panel first
    
    fetchData('/Project/GetProjectList', null, renderProjectList); // then render project list in background
    
    document.querySelector('#createProjectForm').addEventListener('submit', (event) => { // bind create button project
        event.preventDefault();
        createProject();
    });
    document.getElementById('confirmDeleteProject').addEventListener('click', (event) => { // bind delete button project (in modal)
        fetchData('/Project/DeleteProject', { ProjectId: getState().targetDeleteProject }, renderProjectList);
        updateState({ targetDeleteProject: -1, currentProject: null });
    });
}

export function renderProjectList(projectList) {
    // Show empty container if there is no project data
    if ((projectList?.length ?? 0)  == 0) { 
        document.querySelector('.project-list-container').style.display = 'none';
        return;
    }

    // Insert filter button at top
    let container = document.querySelector(".project-list-container");
    container.replaceChildren();
    container.insertAdjacentHTML('beforeend', `<small class="d-block border-bottom pb-3">
                                                    <a id="toggleProject" href="javascript:void(0)">Active projects</a> <!-- Old projects, All projects -->
                                                </small>`);

    // Then, insert 'projectItem' to '.project-list-container'
    projectList.forEach(project => {
        let actionText = project.status ? 'edit' : 'view';
        let color = project.status ? '#198754' : '#6c757d';
        let createdAtDate = new Date(project.createdAt);
        let formattedDate = `${createdAtDate.getDate()} ${createdAtDate.toLocaleString('default', { month: 'long' })} ${createdAtDate.getFullYear()}`;
        let projectStatus = project.status ? `created: ${formattedDate}` : 'read-only';

        let projectItem = `<div class="project-item d-flex text-body-secondary pt-3" data-id="${project.id}" data-active="${project.status}">
                                <svg class="bd-placeholder-img flex-shrink-0 me-2 rounded" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 32x32" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="${color}"/><text x="50%" y="50%" fill="${color}" dy=".3em">32x32</text></svg>
                                <div class="pb-3 mb-0 small lh-sm border-bottom w-100">
                                <div class="d-flex justify-content-between">
                                    <strong class="project-name text-gray-dark mr-auto">${project.name}</strong>
                                    <a class="edit-view-link" href="javascript:void(0)">${actionText}</a>
                                    <div class="vr mx-2 opacity-50"></div>
                                    <a class="delete-link" href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#deleteProjectModal">delete</a>
                                </div>
                                <span class="d-block">${projectStatus}</span>
                                </div>
                            </div>`;
        container.insertAdjacentHTML('beforeend', projectItem);
    });

    // Attach event to projectItem
    // Toggle button
    document.querySelector('#toggleProject').addEventListener('click', handleToggleProject);

    // Edit/View button
    document.querySelectorAll('.project-list-container .edit-view-link').forEach(button => {
        button.addEventListener('click', handleEditViewButton);
    });

    // Delete button
    document.querySelectorAll('.project-list-container .delete-link').forEach(button => {
        button.addEventListener('click', handleDeleteButton);
    });
}
  
function handleToggleProject() {
    const toggleProjectButton = document.querySelector('#toggleProject');
    const toggleText = toggleProjectButton.textContent.trim();
    const projectItems = document.querySelectorAll('.project-list-container > div');

    if (toggleText === 'Active projects') { // Show only active projects
        projectItems.forEach(item => {
            const isActive = item.getAttribute('data-active') === 'true';
            item.style.setProperty('display', isActive ? 'flex' : 'none', 'important');
        });
        toggleProjectButton.textContent = 'Inactive projects';
    } else if (toggleText === 'Inactive projects') { // Show only old projects
        projectItems.forEach(item => {
            const isActive = item.getAttribute('data-active') === 'true';
            item.style.setProperty('display', isActive ? 'none' : 'flex', 'important');
        });
        toggleProjectButton.textContent = 'All projects';
    } else { // Show all projects
        projectItems.forEach(item => {
            item.style.setProperty('display', 'flex', 'important');
        });
        toggleProjectButton.textContent = 'Active projects';
    }
}

function handleEditViewButton(event) {
    const projectItem = event.target.closest('.project-item');

    const id = parseInt(projectItem.dataset.id, 10);
    const status = projectItem.dataset.active === 'true';
    const name = projectItem.querySelector('.project-name').textContent;

    updateState({ currentProject: { id, name, status } });
    navbarChange('project');
}
  
function handleDeleteButton(event) {
    const projectItem = event.target.closest('.project-item');
    const projectId = parseInt(projectItem.dataset.id, 10);
    updateState({ targetDeleteProject: projectId });
}

export function createProject() {
    const goToProjectPage = (project) => {
        updateState({ currentProject: { id: project.id, name: project.name, status: project.status } });
        navbarChange('project');
    };
    fetchData('/Project/CreateProject', { Name: document.getElementById('createProjectName').value }, goToProjectPage);
}