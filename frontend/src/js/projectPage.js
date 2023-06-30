import { Modal } from 'bootstrap';
import { fetchData } from "./fetchModule";
import { pscProducts } from "./configs/pscProduct";
import { getState, updateState } from "./landingPage";
import { replaceEventListener } from "./helpers/domHelpers";

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
    // render report only when project is read-only mode
    // if (!project.status) { fetchData('/Photovoltaic/GetReportData', { ProjectId: project.id }, renderReport); }
}

function renderHeader(project) {
    // Display whole header section
    let header = document.querySelector('.project-page > .text-center');
    header.style.display = 'block';

    // Set project name
    header.querySelector('.fw-light').textContent = `${project.name}${!project.status ? " (read-only)" : ""}`;

    // Bind add product modal button
    header.querySelector('#addProduct').style.display = project.status ? 'inline-block' : 'none';
    replaceEventListener(document.querySelector('#addProductForm'), 'submit', handleAddProductForm);
    document.querySelectorAll('input[name="pscProduct"]').forEach((radioButton) => {
        replaceEventListener(radioButton, 'change', handleRadioChange);
    });

    // Attaching event listener to gen report button
    header.querySelector('#generateReport').textContent = project.status ? 'Generate report' : 'View report';
    header.querySelector('#generateReport').addEventListener('click', (event) => {
        console.log('Generate Report Click!');
    });

    // Attaching event listener to delete product modal
    replaceEventListener(document.querySelector('#confirmDeleteProduct'), 'click', handleConfirmDeleteModal);
}

function renderProductItemsAndMap(products) {
    document.querySelector('.project-page > .album').style.display = 'flex';
    
    // Clear the container before appending new product items
    const container = document.querySelector('.product-container > .row');
    container.innerHTML = "";

    // Insert all products
    const editable = getState().currentProject.status ? "" : "disabled";
    products.forEach(product => {
        const productItem = `
            <div class="product-item col" data-id="${product.id}">
                <div class="card shadow-sm">
                    <svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
                        <rect width="100%" height="100%" fill="#55595c"/>
                        <text class="prod-item-name" x="20%" y="50%" fill="#eceeef" dy=".3em">${product.name}</text>
                    </svg>
                    <div class="card-body">
                        <p class="prod-item-pp card-text">Pmax : ${product.powerpeak} kW</p>
                        <p class="prod-item-area card-text">Area : ${product.area} m²</p>
                        <p class="prod-item-orientation card-text">Orientation : ${product.orientation}°</p>
                        <p class="prod-item-inclination card-text">Inclination : ${product.inclination}°</p>
                        <p class="prod-item-location card-text">Location : ${product.latitude}, ${product.longitude}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button type="button" class="${editable} edit-product btn btn-sm btn-outline-secondary">Edit</button>
                                <button type="button" class="${editable} delete-product btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#deleteProductModal">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', productItem);
    });

    // Attach event to poduct items
    // Edit button
    document.querySelectorAll('.product-item .edit-product').forEach(button => {
        button.addEventListener('click', handleEditButton);
    });

    // Delete button
    document.querySelectorAll('.product-item .delete-product').forEach(button => {
        button.addEventListener('click', handleDeleteButton);
    });

    renderMap(products);
}

function handleEditButton(event) {
    const productItem = event.target.closest('.product-item');

    const productId = parseInt(productItem.dataset.id, 10);
    const productName = productItem.querySelector('.prod-item-name').textContent;
    const productPmax = parseFloat(productItem.querySelector('.prod-item-pp').textContent.split(': ')[1].trim().replace(' kW', ''));
    const productArea = parseFloat(productItem.querySelector('.prod-item-area').textContent.split(': ')[1].trim().replace(' m²', ''));
    const productOrientation = parseFloat(productItem.querySelector('.prod-item-orientation').textContent.split(': ')[1].trim().replace('°', ''));
    const productInclination = parseFloat(productItem.querySelector('.prod-item-inclination').textContent.split(': ')[1].trim().replace('°', ''));
    const productLocation = productItem.querySelector('.prod-item-location').textContent.split(': ')[1].trim().split(',').map(coord => parseFloat(coord));
}

function handleDeleteButton(event) {
    const productItem = event.target.closest('.product-item');
    updateState({ currentProduct: { id: parseInt(productItem.dataset.id, 10) } });
}

function handleRadioChange(event) {
    event.preventDefault();
    let productConfig = pscProducts[event.target.id];

    document.querySelector('.prod-p-max').innerText = `Pmax: ${productConfig.powerPeak} kW`;
    document.querySelector('.prod-area').innerText = `Area: ${productConfig.area} m²`;
    document.querySelector('.prod-efficiency').innerText = `Efficiency: ${productConfig.efficiency}`;
}

function handleAddProductForm(event) {
    event.preventDefault();

    // Get data from form and config
    let selectedProduct = document.querySelector('input[name="pscProduct"]:checked');
    let productName = selectedProduct.labels[0].textContent;
    let productConfig = pscProducts[selectedProduct.id];
    let newProduct = {
        Name: productName,
        Brand: productConfig.brand,
        Latitude: parseFloat(document.querySelector('#lat-number').value),
        Longitude: parseFloat(document.querySelector('#lng-number').value),
        Area: productConfig.area,
        Inclination: parseFloat(document.querySelector('#inclination').value),
        Orientation: parseInt(document.querySelector('#orientation').value),
        Powerpeak: productConfig.powerPeak,
        Efficiency: productConfig.efficiency,
        ProjectId: getState().currentProject.id
    };

    // Dismiss the modal
    let modal = Modal.getInstance(document.querySelector('#createProductModal'));
    modal.hide();

    // Clear the form
    document.querySelector('#orientation').value = "";
    document.querySelector('#inclination').value = "";
    document.querySelector('#lat-number').value = "";
    document.querySelector('#lng-number').value = "";

    // Call API
    fetchData('/Product/AddProduct', newProduct, renderProductItemsAndMap);
}

function handleConfirmDeleteModal(event) {
    const deleteProductRequest = {
        ProductId: getState().currentProduct.id,
        ProjectId: getState().currentProject.id
    };
    fetchData('/Product/DeleteProduct', deleteProductRequest, renderProductItemsAndMap);
    updateState({ currentProduct: { id: -1 } });
}

function renderMap(products) {
    console.log('re-render pins on map');
}

function renderReport(reportData) {
    console.log('renderReport(reportData)');
}