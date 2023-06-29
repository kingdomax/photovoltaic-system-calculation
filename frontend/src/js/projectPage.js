import { getState } from "./landingPage";
import { fetchData } from "./fetchModule";

export function init() {
    document.querySelector('.project-page').style.display = 'none';
}

export function renderProjectPage() {
    const project = getState().currentProject;
    if (!project) {
        document.querySelector('.project-page > .album').style.display = 'none';
        document.querySelector('.project-page > .text-center').style.display = 'none';
        return;
    }
    renderHeader(project);
    fetchData('/Product/GetProducts', { ProjectId: project.id }, renderProductItemsAndMap);
    //fetchData('/Photovoltaic/GetReportData', { ProjectId: project.id }, renderReport);
}

function renderHeader(project) {
    // Display whole header section
    let header = document.querySelector('.project-page > .text-center');
    header.style.display = 'block';

    // Set project name
    header.querySelector('.fw-light').textContent = project.name;

    // Bind add product modal

    // Prepare attaching event listener '.btn-secondary'
    header.querySelector('.btn-secondary').addEventListener('click', (event) => {
        event.preventDefault();
        // your action here
        console.log('Button secondary clicked!');
    });

    // Bind delete product modal
    '#confirmDeleteAccount'
}

function renderProductItemsAndMap(products) {
    document.querySelector('.project-page > .album').style.display = 'flex';
    
    // Clear the container before appending new product items
    const container = document.querySelector('.product-container > .row');
    container.innerHTML = "";

    // Insert all products
    products.forEach(product => {
        const productItem = `
            <div class="col" data-id="${product.id}">
                <div class="card shadow-sm">
                    <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
                        <rect width="100%" height="100%" fill="#55595c"/>
                        <text x="20%" y="50%" fill="#eceeef" dy=".3em">${product.name}</text>
                    </svg>
                    <div class="card-body">
                        <p class="card-text">Pmax : ${product.powerpeak} kW</p>
                        <p class="card-text">Area : ${product.area} m²</p>
                        <p class="card-text">Orientation : ${product.orientation}</p>
                        <p class="card-text">Inclination : ${product.inclination}°</p>
                        <p class="card-text">Location : ${product.latitude}, ${product.longitude}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                                <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#deleteProductModal">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', productItem);
    });

    renderMap(products);
}

function renderMap(products) {
    console.log('renderMap(products)');
}

function renderReport(reportData) {
    console.log('renderReport(reportData)');
}