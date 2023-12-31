import { Modal } from 'bootstrap';
import * as mapModule from './mapModule';
import { fetchData } from "./fetchModule";
import * as chartModule from './chartModule';
import { pscProducts } from "./configs/pscProduct";
import { getState, updateState } from "./landingPage";
import { replaceEventListener } from "./helpers/domHelpers";

export function init() {
    document.querySelector('.project-page').style.display = 'none';
}

export function renderProjectPage() {
    const project = getState().currentProject;
    if (!project) {
        document.querySelector('.project-page > .text-center').style.display = 'none'; // header
        document.querySelector('.project-page > .album').style.display = 'none'; // body
        document.querySelector('.project-page > .report-container').style.display = 'none'; // report
        return;
    }

    renderHeader(project);
    fetchData('/Product/GetProducts', { ProjectId: project.id }, renderProductItemsAndMap);
    if (!project.status) { 
        fetchData('/Photovoltaic/GetElectricityReport', { ProjectId: project.id }, renderReport);
    } else {
        document.querySelector('.project-page > .report-container').style.display = 'none';
    }
}

function renderHeader(project) {
    // Display whole header section
    let header = document.querySelector('.project-page > .text-center');
    header.style.display = 'block';

    // Set project name
    header.querySelector('.fw-light').textContent = `${project.name}${!project.status ? " (read-only)" : ""}`;

    // Attaching event listener to add product modal
    document.getElementById('createProductModal').addEventListener('hidden.bs.modal', function (event) {
        emptyAddEditForm();
    });

    // Attaching event listener to add product button
    header.querySelector('#addProduct').style.display = project.status ? 'inline-block' : 'none';
    replaceEventListener(header.querySelector('#addProduct'), 'click', handleAddProductButton);

    // Attaching event listener to add product form
    replaceEventListener(document.querySelector('#addEditProductForm'), 'submit', handleAddEditProductForm);
    document.querySelectorAll('input[name="pscProduct"]').forEach((radioButton) => {
        replaceEventListener(radioButton, 'change', handleRadioChange);
    });

    // Attaching event listener to gen report button
    new Modal(document.getElementById('genReportModal'), {});
    header.querySelector('#generateReport').textContent = project.status ? 'Generate report' : 'View report';
    replaceEventListener(document.querySelector('#generateReport'), 'click', handleGenerateReportButton);

    // Attaching event listener to gen report modal
    replaceEventListener(document.querySelector('#confirmGenReport'), 'click', handleGenerateReportModal);

    // Attaching event listener to delete product modal
    replaceEventListener(document.querySelector('#confirmDeleteProduct'), 'click', handleConfirmDeleteModal);
}

function renderProductItemsAndMap(products) {
    // Display whole container (product list + map)
    document.querySelector('.project-page > .album').style.display = 'flex';
    
    // Check the length of products and add 'disabled' class if necessary
    let genReportModalButton = document.getElementById('generateReport');
    if (products.length <= 0) {
        genReportModalButton.classList.add('disabled');
    } else {
        genReportModalButton.classList.remove('disabled');
    }
    
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
                        <p class="prod-item-id card-text">ID : ${product.id}</p>
                        <p class="prod-item-pp card-text">Pmax : ${product.powerpeak} kW</p>
                        <p class="prod-item-area card-text">Area : ${product.area} m²</p>
                        <p class="prod-item-efficiency card-text">Efficiency : ${product.efficiency}</p>
                        <p class="prod-item-orientation card-text">Orientation : ${product.orientation}°</p>
                        <p class="prod-item-inclination card-text">Inclination : ${product.inclination}°</p>
                        <p class="prod-item-location card-text">Location : ${product.latitude}, ${product.longitude}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button type="button" class="${editable} edit-product btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#createProductModal">Edit</button>
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

function handleRadioChange(event) {
    event.preventDefault();
    let productConfig = pscProducts[event.target.id];

    document.querySelector('.prod-p-max').innerText = `Pmax: ${productConfig.powerPeak} kW`;
    document.querySelector('.prod-area').innerText = `Area: ${productConfig.area} m²`;
    document.querySelector('.prod-efficiency').innerText = `Efficiency: ${productConfig.efficiency}`;
}

export function handleAddProductButton(event) {
    document.querySelector('#createProductModal .title').textContent = 'Add Product'; // Change modal's header text to 'Add Product'

    // Fill latlng only it clicked from map
    const lat = getState().map.currentLat;
    const lng = getState().map.currentLng;
    if (lat != -1 && lng != -1) {
        document.querySelector('#lat-number').value = lat;
        document.querySelector('#lng-number').value = lng;
    }
}

function handleEditButton(event) {
    // 0) Grab all field data from '.product-item' so they can be putted to modal form
    const productItem = event.target.closest('.product-item');
    const productId = parseInt(productItem.dataset.id, 10);
    const productName = productItem.querySelector('.prod-item-name').textContent;
    const powerpeak = productItem.querySelector('.prod-item-pp').textContent.split(" : ")[1];
    const area = productItem.querySelector('.prod-item-area').textContent.split(" : ")[1];
    const efficiency = productItem.querySelector('.prod-item-efficiency').textContent.split(" : ")[1];
    const orientation = productItem.querySelector('.prod-item-orientation').textContent.split(' ')[2].slice(0, -1); // without '°'
    const inclination = productItem.querySelector('.prod-item-inclination').textContent.split(' ')[2].slice(0, -1); // without '°'
    const [latitude, longitude] = productItem.querySelector('.prod-item-location').textContent.split(" : ")[1].split(", ");

    // 1) Change modal's header text to 'Edit Product'
    document.querySelector('#createProductModal .title').textContent = 'Edit Product';

    // 2) Change content of modal based on grabbed data
    document.querySelector('#orientation').value = orientation;
    document.querySelector('#inclination').value = inclination;
    document.querySelector('#lat-number').value = latitude;
    document.querySelector('#lng-number').value = longitude;
    document.querySelector('.prod-p-max').textContent = `Pmax: ${powerpeak}`;
    document.querySelector('.prod-area').textContent = `Area: ${area}`;
    document.querySelector('.prod-efficiency').textContent = `Efficiency: ${efficiency}`;

    // 3) Select the radio button that has the label equal to 'productName'
    document.querySelectorAll('#addEditProductForm .form-check').forEach(radio => {
        const label = radio.querySelector('label').textContent.trim();
        if (label === productName) {
            radio.querySelector('input[type="radio"]').checked = true;
        }
    });

    // 4) Show modal
    let modal = Modal.getInstance(document.querySelector('#createProductModal'));
    modal.show();

    // 5) update state
    updateState({ currentProduct: { id: productId } });
}

function handleAddEditProductForm(event) {
    event.preventDefault();
    const isEditForm = getState().currentProduct.id != -1;

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
    if (isEditForm) { newProduct.Id = getState().currentProduct.id; }

    // Dismiss the modal
    let modal = Modal.getInstance(document.querySelector('#createProductModal'));
    modal.hide();

    // Call API
    const url = isEditForm ? '/Product/EditProduct' : '/Product/AddProduct';
    fetchData(url, newProduct, renderProductItemsAndMap);
}

function emptyAddEditForm() {
    document.querySelector('#orientation').value = "";
    document.querySelector('#inclination').value = "";
    document.querySelector('#lat-number').value = "";
    document.querySelector('#lng-number').value = "";
    updateState({ 
        currentProduct: { id: -1 },
        map: { currentLat: -1, currentLng: -1, }
    });
}

function handleDeleteButton(event) {
    const productItem = event.target.closest('.product-item');
    updateState({ currentProduct: { id: parseInt(productItem.dataset.id, 10) } });
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
    mapModule.render(products);
}

function handleGenerateReportButton(event) {
    // If project is read-only, scroll to rendered report
    if (!getState().currentProject.status) {
        document.querySelector(".report-container").scrollIntoView({ behavior: 'smooth' });
    } else {
        resetReportModal(true);
        Modal.getInstance(document.querySelector('#genReportModal')).show();
    }
}

function handleGenerateReportModal(event) {
    const oldState = getState().currentProject;
    const setProjectToReadonlyAndRerender = (reportData) => {
        Modal.getInstance(document.querySelector('#genReportModal')).hide();
        updateState({ // change project status in state and rerender
            currentProject: { 
                id: oldState.id,
                name: oldState.name,
                status: false 
            }
        }, true);
    };

    resetReportModal(false);
    fetchData('/Photovoltaic/GenerateElectricityReport', { ProjectId: oldState.id }, setProjectToReadonlyAndRerender);
}

function resetReportModal(isReset) {
    // Change to loading... text
    document.querySelector("#confirmGenReport > .proceed").style.display = isReset ? "inline" : "none";
    document.querySelector("#confirmGenReport > .loading").style.display = isReset ? "none" : "inline";
    // Disable modal's button
    document.querySelectorAll("#genReportModal .modal-footer button").forEach(button => button.disabled = !isReset);
}

function renderReport(reportData) {
    if (reportData.length > 0) {
        chartModule.drawLineChart(reportData);
        document.querySelector('.project-page > .report-container').style.display = 'block';
    } else {
        document.querySelector('.project-page > .report-container').style.display = 'none';
    }
}
