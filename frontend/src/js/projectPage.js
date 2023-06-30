import { Modal } from 'bootstrap';
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
        //fetchData('/Photovoltaic/GetReportData', { ProjectId: project.id }, renderReport); } // render report only when project is read-only mode
        renderReport(mockReportData()); 
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

function handleAddProductButton(event) {
    document.querySelector('#createProductModal .title').textContent = 'Add Product'; // Change modal's header text to 'Add Product'
    emptyAddEditForm(); // make sure all form fields are cleared
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

    // Clear the form
    emptyAddEditForm();

    // Call API
    const url = isEditForm ? '/Product/EditProduct' : '/Product/AddProduct';
    fetchData(url, newProduct, renderProductItemsAndMap);
}

function emptyAddEditForm() {
    document.querySelector('#orientation').value = "";
    document.querySelector('#inclination').value = "";
    document.querySelector('#lat-number').value = "";
    document.querySelector('#lng-number').value = "";
    updateState({ currentProduct: { id: -1 } });
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
    console.log('re-render pins on map');

    // mapModule.render();
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
    resetReportModal(false);

    const setProjectToReadonlyAndRerender = (reportData) => {
        // Modal.getInstance(document.querySelector('#genReportModal')).hide();
        
        // change project status in state and rerender
        const oldState = getState().currentProject;
        //updateState({
        //    currentProject: { 
        //        id: oldState.id,
        //        name: oldState.name,
        //        status: false 
        //    }
        //}, true);

    };

    // Call API --> setProjectToReadonlyAndRerender();
}

function resetReportModal(isReset) {
    // Change to loading... text
    document.querySelector("#confirmGenReport > .proceed").style.display = isReset ? "inline" : "none";
    document.querySelector("#confirmGenReport > .loading").style.display = isReset ? "none" : "inline";
    // Disable modal's button
    document.querySelectorAll("#genReportModal .modal-footer button").forEach(button => button.disabled = !isReset);
}

function renderReport(reportData) {
    document.querySelector('.project-page > .report-container').style.display = 'block';
    chartModule.drawLineChart(reportData);
}

function mockReportData() {
    return [
    {
        "title": "Titanic",
        "date": "1997-12-19T00:00:00.000Z",
        "day": 1,
        "gross": 8658814,
        "theaters": 2674,
        "totalGross": 8658814
    },
    {
        "title": "Titanic",
        "date": "1997-12-20T00:00:00.000Z",
        "day": 2,
        "gross": 10672013,
        "theaters": 2674,
        "totalGross": 19330827
    },
    {
        "title": "Titanic",
        "date": "1997-12-21T00:00:00.000Z",
        "day": 3,
        "gross": 9307304,
        "theaters": 2674,
        "totalGross": 28638131
    },
    {
        "title": "Titanic",
        "date": "1997-12-22T00:00:00.000Z",
        "day": 4,
        "gross": 5578212,
        "theaters": 2674,
        "totalGross": 34216343
    },
    {
        "title": "Titanic",
        "date": "1997-12-23T00:00:00.000Z",
        "day": 5,
        "gross": 6003119,
        "theaters": 2674,
        "totalGross": 40219462
    },
    {
        "title": "Titanic",
        "date": "1997-12-24T00:00:00.000Z",
        "day": 6,
        "gross": 3571345,
        "theaters": 2674,
        "totalGross": 43790807
    },
    {
        "title": "Titanic",
        "date": "1997-12-25T00:00:00.000Z",
        "day": 7,
        "gross": 9178529,
        "theaters": 2674,
        "totalGross": 52969336
    },
    {
        "title": "Titanic",
        "date": "1997-12-26T00:00:00.000Z",
        "day": 8,
        "gross": 12122298,
        "theaters": 2711,
        "totalGross": 65091634
    },
    {
        "title": "Titanic",
        "date": "1997-12-27T00:00:00.000Z",
        "day": 9,
        "gross": 12466455,
        "theaters": 2711,
        "totalGross": 77558089
    },
    {
        "title": "Titanic",
        "date": "1997-12-28T00:00:00.000Z",
        "day": 10,
        "gross": 10866520,
        "theaters": 2711,
        "totalGross": 88424609
    },
    {
        "title": "Titanic",
        "date": "1997-12-29T00:00:00.000Z",
        "day": 11,
        "gross": 7942920,
        "theaters": 2711,
        "totalGross": 96367529
    },
    {
        "title": "Titanic",
        "date": "1997-12-30T00:00:00.000Z",
        "day": 12,
        "gross": 8012909,
        "theaters": 2711,
        "totalGross": 104380438
    },
    {
        "title": "Titanic",
        "date": "1997-12-31T00:00:00.000Z",
        "day": 13,
        "gross": 8213735,
        "theaters": 2711,
        "totalGross": 112594173
    },
    {
        "title": "Titanic",
        "date": "1998-01-01T00:00:00.000Z",
        "day": 14,
        "gross": 11558520,
        "theaters": 2711,
        "totalGross": 124152693
    },
    {
        "title": "Titanic",
        "date": "1998-01-02T00:00:00.000Z",
        "day": 15,
        "gross": 11698861,
        "theaters": 2727,
        "totalGross": 135851554
    },
    {
        "title": "Titanic",
        "date": "1998-01-03T00:00:00.000Z",
        "day": 16,
        "gross": 12726625,
        "theaters": 2727,
        "totalGross": 148578179
    },
    {
        "title": "Titanic",
        "date": "1998-01-04T00:00:00.000Z",
        "day": 17,
        "gross": 8889792,
        "theaters": 2727,
        "totalGross": 157467971
    },
    {
        "title": "Titanic",
        "date": "1998-01-05T00:00:00.000Z",
        "day": 18,
        "gross": 3022271,
        "theaters": 2727,
        "totalGross": 160490242
    },
    {
        "title": "Titanic",
        "date": "1998-01-06T00:00:00.000Z",
        "day": 19,
        "gross": 3044822,
        "theaters": 2727,
        "totalGross": 163535064
    },
    {
        "title": "Titanic",
        "date": "1998-01-07T00:00:00.000Z",
        "day": 20,
        "gross": 2841351,
        "theaters": 2727,
        "totalGross": 166376415
    },
    {
        "title": "Titanic",
        "date": "1998-01-08T00:00:00.000Z",
        "day": 21,
        "gross": 2789088,
        "theaters": 2727,
        "totalGross": 169165503
    },
    {
        "title": "Titanic",
        "date": "1998-01-09T00:00:00.000Z",
        "day": 22,
        "gross": 7738150,
        "theaters": 2746,
        "totalGross": 176903653
    },
    {
        "title": "Titanic",
        "date": "1998-01-10T00:00:00.000Z",
        "day": 23,
        "gross": 12758118,
        "theaters": 2746,
        "totalGross": 189661771
    },
    {
        "title": "Titanic",
        "date": "1998-01-11T00:00:00.000Z",
        "day": 24,
        "gross": 8220042,
        "theaters": 2746,
        "totalGross": 197881813
    },
    {
        "title": "Titanic",
        "date": "1998-01-12T00:00:00.000Z",
        "day": 25,
        "gross": 2170146,
        "theaters": 2746,
        "totalGross": 200051959
    },
    {
        "title": "Titanic",
        "date": "1998-01-13T00:00:00.000Z",
        "day": 26,
        "gross": 2386164,
        "theaters": 2746,
        "totalGross": 202438123
    },
    {
        "title": "Titanic",
        "date": "1998-01-14T00:00:00.000Z",
        "day": 27,
        "gross": 2095782,
        "theaters": 2746,
        "totalGross": 204533905
    },
    {
        "title": "Titanic",
        "date": "1998-01-15T00:00:00.000Z",
        "day": 28,
        "gross": 2200465,
        "theaters": 2746,
        "totalGross": 206734370
    },
    {
        "title": "Titanic",
        "date": "1998-01-16T00:00:00.000Z",
        "day": 29,
        "gross": 7418385,
        "theaters": 2767,
        "totalGross": 214152755
    },
    {
        "title": "Titanic",
        "date": "1998-01-17T00:00:00.000Z",
        "day": 30,
        "gross": 12357344,
        "theaters": 2767,
        "totalGross": 226510099
    },
    {
        "title": "Titanic",
        "date": "1998-01-18T00:00:00.000Z",
        "day": 31,
        "gross": 10235305,
        "theaters": 2767,
        "totalGross": 236745404
    },
    {
        "title": "Titanic",
        "date": "1998-01-19T00:00:00.000Z",
        "day": 32,
        "gross": 6003510,
        "theaters": 2767,
        "totalGross": 242748914
    },
    {
        "title": "Titanic",
        "date": "1998-01-20T00:00:00.000Z",
        "day": 33,
        "gross": 2322334,
        "theaters": 2767,
        "totalGross": 245071248
    },
    {
        "title": "Titanic",
        "date": "1998-01-21T00:00:00.000Z",
        "day": 34,
        "gross": 2076976,
        "theaters": 2767,
        "totalGross": 247148224
    },
    {
        "title": "Titanic",
        "date": "1998-01-22T00:00:00.000Z",
        "day": 35,
        "gross": 2212942,
        "theaters": 2767,
        "totalGross": 249361166
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2015-12-18T00:00:00.000Z",
        "day": 1,
        "gross": 119119282,
        "theaters": 4134,
        "totalGross": 119119282
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2015-12-19T00:00:00.000Z",
        "day": 2,
        "gross": 68294204,
        "theaters": 4134,
        "totalGross": 187413486
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2015-12-20T00:00:00.000Z",
        "day": 3,
        "gross": 60553189,
        "theaters": 4134,
        "totalGross": 247966675
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2015-12-21T00:00:00.000Z",
        "day": 4,
        "gross": 40109742,
        "theaters": 4134,
        "totalGross": 288076417
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2015-12-22T00:00:00.000Z",
        "day": 5,
        "gross": 37361729,
        "theaters": 4134,
        "totalGross": 325438146
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2015-12-23T00:00:00.000Z",
        "day": 6,
        "gross": 38022183,
        "theaters": 4134,
        "totalGross": 363460329
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2015-12-24T00:00:00.000Z",
        "day": 7,
        "gross": 27395725,
        "theaters": 4134,
        "totalGross": 390856054
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2015-12-25T00:00:00.000Z",
        "day": 8,
        "gross": 49325663,
        "theaters": 4134,
        "totalGross": 440181717
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2015-12-26T00:00:00.000Z",
        "day": 9,
        "gross": 56731532,
        "theaters": 4134,
        "totalGross": 496913249
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2015-12-27T00:00:00.000Z",
        "day": 10,
        "gross": 43145665,
        "theaters": 4134,
        "totalGross": 540058914
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2015-12-28T00:00:00.000Z",
        "day": 11,
        "gross": 31362029,
        "theaters": 4134,
        "totalGross": 571420943
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2015-12-29T00:00:00.000Z",
        "day": 12,
        "gross": 29528583,
        "theaters": 4134,
        "totalGross": 600949526
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2015-12-30T00:00:00.000Z",
        "day": 13,
        "gross": 28085057,
        "theaters": 4134,
        "totalGross": 629034583
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2015-12-31T00:00:00.000Z",
        "day": 14,
        "gross": 22932686,
        "theaters": 4134,
        "totalGross": 651967269
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-01T00:00:00.000Z",
        "day": 15,
        "gross": 34394152,
        "theaters": 4134,
        "totalGross": 686361421
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-02T00:00:00.000Z",
        "day": 16,
        "gross": 34368250,
        "theaters": 4134,
        "totalGross": 720729671
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-03T00:00:00.000Z",
        "day": 17,
        "gross": 21479271,
        "theaters": 4134,
        "totalGross": 742208942
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-04T00:00:00.000Z",
        "day": 18,
        "gross": 8021882,
        "theaters": 4134,
        "totalGross": 750230824
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-05T00:00:00.000Z",
        "day": 19,
        "gross": 7967428,
        "theaters": 4134,
        "totalGross": 758198252
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-06T00:00:00.000Z",
        "day": 20,
        "gross": 6210432,
        "theaters": 4134,
        "totalGross": 764408684
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-07T00:00:00.000Z",
        "day": 21,
        "gross": 5972359,
        "theaters": 4134,
        "totalGross": 770381043
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-08T00:00:00.000Z",
        "day": 22,
        "gross": 10744380,
        "theaters": 4134,
        "totalGross": 781125423
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-09T00:00:00.000Z",
        "day": 23,
        "gross": 19204072,
        "theaters": 4134,
        "totalGross": 800329495
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-10T00:00:00.000Z",
        "day": 24,
        "gross": 12405333,
        "theaters": 4134,
        "totalGross": 812734828
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-11T00:00:00.000Z",
        "day": 25,
        "gross": 3108701,
        "theaters": 4134,
        "totalGross": 815843529
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-12T00:00:00.000Z",
        "day": 26,
        "gross": 3844408,
        "theaters": 4134,
        "totalGross": 819687937
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-13T00:00:00.000Z",
        "day": 27,
        "gross": 3114937,
        "theaters": 4134,
        "totalGross": 822802874
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-14T00:00:00.000Z",
        "day": 28,
        "gross": 3129967,
        "theaters": 4134,
        "totalGross": 825932841
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-15T00:00:00.000Z",
        "day": 29,
        "gross": 6328954,
        "theaters": 3822,
        "totalGross": 832261795
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-16T00:00:00.000Z",
        "day": 30,
        "gross": 11028514,
        "theaters": 3822,
        "totalGross": 843290309
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-17T00:00:00.000Z",
        "day": 31,
        "gross": 8984649,
        "theaters": 3822,
        "totalGross": 852274958
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-18T00:00:00.000Z",
        "day": 32,
        "gross": 6678148,
        "theaters": 3822,
        "totalGross": 858953106
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-19T00:00:00.000Z",
        "day": 33,
        "gross": 2380910,
        "theaters": 3822,
        "totalGross": 861334016
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-20T00:00:00.000Z",
        "day": 34,
        "gross": 1814233,
        "theaters": 3822,
        "totalGross": 863148249
    },
    {
        "title": "Star Wars Ep. VII: The Force Awakens",
        "date": "2016-01-21T00:00:00.000Z",
        "day": 35,
        "gross": 1884097,
        "theaters": 3822,
        "totalGross": 865032346
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-04-26T00:00:00.000Z",
        "day": 1,
        "gross": 157461641,
        "theaters": 4662,
        "totalGross": 157461641
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-04-27T00:00:00.000Z",
        "day": 2,
        "gross": 109264122,
        "theaters": 4662,
        "totalGross": 266725763
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-04-28T00:00:00.000Z",
        "day": 3,
        "gross": 90389244,
        "theaters": 4662,
        "totalGross": 357115007
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-04-29T00:00:00.000Z",
        "day": 4,
        "gross": 36874439,
        "theaters": 4662,
        "totalGross": 393989446
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-04-30T00:00:00.000Z",
        "day": 5,
        "gross": 33110349,
        "theaters": 4662,
        "totalGross": 427099795
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-01T00:00:00.000Z",
        "day": 6,
        "gross": 25251991,
        "theaters": 4662,
        "totalGross": 452351786
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-02T00:00:00.000Z",
        "day": 7,
        "gross": 21542852,
        "theaters": 4662,
        "totalGross": 473894638
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-03T00:00:00.000Z",
        "day": 8,
        "gross": 40736774,
        "theaters": 4662,
        "totalGross": 514631412
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-04T00:00:00.000Z",
        "day": 9,
        "gross": 61527049,
        "theaters": 4662,
        "totalGross": 576158461
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-05T00:00:00.000Z",
        "day": 10,
        "gross": 45119388,
        "theaters": 4662,
        "totalGross": 621277849
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-06T00:00:00.000Z",
        "day": 11,
        "gross": 10709607,
        "theaters": 4662,
        "totalGross": 631987456
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-07T00:00:00.000Z",
        "day": 12,
        "gross": 12518963,
        "theaters": 4662,
        "totalGross": 644506419
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-08T00:00:00.000Z",
        "day": 13,
        "gross": 8429166,
        "theaters": 4662,
        "totalGross": 652935585
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-09T00:00:00.000Z",
        "day": 14,
        "gross": 7510154,
        "theaters": 4662,
        "totalGross": 660445739
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-10T00:00:00.000Z",
        "day": 15,
        "gross": 16190479,
        "theaters": 4662,
        "totalGross": 676636218
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-11T00:00:00.000Z",
        "day": 16,
        "gross": 27542359,
        "theaters": 4662,
        "totalGross": 704178577
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-12T00:00:00.000Z",
        "day": 17,
        "gross": 19567066,
        "theaters": 4662,
        "totalGross": 723745643
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-13T00:00:00.000Z",
        "day": 18,
        "gross": 4702092,
        "theaters": 4662,
        "totalGross": 728447735
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-14T00:00:00.000Z",
        "day": 19,
        "gross": 5742618,
        "theaters": 4662,
        "totalGross": 734190353
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-15T00:00:00.000Z",
        "day": 20,
        "gross": 3788021,
        "theaters": 4662,
        "totalGross": 737978374
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-16T00:00:00.000Z",
        "day": 21,
        "gross": 3416496,
        "theaters": 4662,
        "totalGross": 741394870
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-17T00:00:00.000Z",
        "day": 22,
        "gross": 7470727,
        "theaters": 4220,
        "totalGross": 748865597
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-18T00:00:00.000Z",
        "day": 23,
        "gross": 12903478,
        "theaters": 4220,
        "totalGross": 761769075
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-19T00:00:00.000Z",
        "day": 24,
        "gross": 9599300,
        "theaters": 4220,
        "totalGross": 771368375
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-20T00:00:00.000Z",
        "day": 25,
        "gross": 3162240,
        "theaters": 4220,
        "totalGross": 774530615
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-21T00:00:00.000Z",
        "day": 26,
        "gross": 2900871,
        "theaters": 4220,
        "totalGross": 777431486
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-22T00:00:00.000Z",
        "day": 27,
        "gross": 1994512,
        "theaters": 4220,
        "totalGross": 779425998
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-23T00:00:00.000Z",
        "day": 28,
        "gross": 1905738,
        "theaters": 4220,
        "totalGross": 781331736
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-24T00:00:00.000Z",
        "day": 29,
        "gross": 4278676,
        "theaters": 3810,
        "totalGross": 785610412
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-25T00:00:00.000Z",
        "day": 30,
        "gross": 6452368,
        "theaters": 3810,
        "totalGross": 792062780
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-26T00:00:00.000Z",
        "day": 31,
        "gross": 6469698,
        "theaters": 3810,
        "totalGross": 798532478
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-27T00:00:00.000Z",
        "day": 32,
        "gross": 4863113,
        "theaters": 3810,
        "totalGross": 803395591
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-28T00:00:00.000Z",
        "day": 33,
        "gross": 1867668,
        "theaters": 3810,
        "totalGross": 805263259
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-29T00:00:00.000Z",
        "day": 34,
        "gross": 1288624,
        "theaters": 3810,
        "totalGross": 806551883
    },
    {
        "title": "Avengers: Endgame",
        "date": "2019-05-30T00:00:00.000Z",
        "day": 35,
        "gross": 1136901,
        "theaters": 3810,
        "totalGross": 807688784
    },
    {
        "title": "Avatar",
        "date": "2009-12-18T00:00:00.000Z",
        "day": 1,
        "gross": 26752099,
        "theaters": 3452,
        "totalGross": 26752099
    },
    {
        "title": "Avatar",
        "date": "2009-12-19T00:00:00.000Z",
        "day": 2,
        "gross": 25529036,
        "theaters": 3452,
        "totalGross": 52281135
    },
    {
        "title": "Avatar",
        "date": "2009-12-20T00:00:00.000Z",
        "day": 3,
        "gross": 24744346,
        "theaters": 3452,
        "totalGross": 77025481
    },
    {
        "title": "Avatar",
        "date": "2009-12-21T00:00:00.000Z",
        "day": 4,
        "gross": 16385820,
        "theaters": 3452,
        "totalGross": 93411301
    },
    {
        "title": "Avatar",
        "date": "2009-12-22T00:00:00.000Z",
        "day": 5,
        "gross": 16086461,
        "theaters": 3452,
        "totalGross": 109497762
    },
    {
        "title": "Avatar",
        "date": "2009-12-23T00:00:00.000Z",
        "day": 6,
        "gross": 16445291,
        "theaters": 3452,
        "totalGross": 125943053
    },
    {
        "title": "Avatar",
        "date": "2009-12-24T00:00:00.000Z",
        "day": 7,
        "gross": 11150998,
        "theaters": 3452,
        "totalGross": 137094051
    },
    {
        "title": "Avatar",
        "date": "2009-12-25T00:00:00.000Z",
        "day": 8,
        "gross": 23095046,
        "theaters": 3456,
        "totalGross": 160189097
    },
    {
        "title": "Avatar",
        "date": "2009-12-26T00:00:00.000Z",
        "day": 9,
        "gross": 28274406,
        "theaters": 3456,
        "totalGross": 188463503
    },
    {
        "title": "Avatar",
        "date": "2009-12-27T00:00:00.000Z",
        "day": 10,
        "gross": 24247681,
        "theaters": 3456,
        "totalGross": 212711184
    },
    {
        "title": "Avatar",
        "date": "2009-12-28T00:00:00.000Z",
        "day": 11,
        "gross": 19418139,
        "theaters": 3456,
        "totalGross": 232129323
    },
    {
        "title": "Avatar",
        "date": "2009-12-29T00:00:00.000Z",
        "day": 12,
        "gross": 18290628,
        "theaters": 3456,
        "totalGross": 250419951
    },
    {
        "title": "Avatar",
        "date": "2009-12-30T00:00:00.000Z",
        "day": 13,
        "gross": 18466123,
        "theaters": 3456,
        "totalGross": 268886074
    },
    {
        "title": "Avatar",
        "date": "2009-12-31T00:00:00.000Z",
        "day": 14,
        "gross": 14738136,
        "theaters": 3456,
        "totalGross": 283624210
    },
    {
        "title": "Avatar",
        "date": "2010-01-01T00:00:00.000Z",
        "day": 15,
        "gross": 25274008,
        "theaters": 3461,
        "totalGross": 308898218
    },
    {
        "title": "Avatar",
        "date": "2010-01-02T00:00:00.000Z",
        "day": 16,
        "gross": 25835551,
        "theaters": 3461,
        "totalGross": 334733769
    },
    {
        "title": "Avatar",
        "date": "2010-01-03T00:00:00.000Z",
        "day": 17,
        "gross": 17381129,
        "theaters": 3461,
        "totalGross": 352114898
    },
    {
        "title": "Avatar",
        "date": "2010-01-04T00:00:00.000Z",
        "day": 18,
        "gross": 8094554,
        "theaters": 3461,
        "totalGross": 360209452
    },
    {
        "title": "Avatar",
        "date": "2010-01-05T00:00:00.000Z",
        "day": 19,
        "gross": 7327233,
        "theaters": 3461,
        "totalGross": 367536685
    },
    {
        "title": "Avatar",
        "date": "2010-01-06T00:00:00.000Z",
        "day": 20,
        "gross": 6909167,
        "theaters": 3461,
        "totalGross": 374445852
    },
    {
        "title": "Avatar",
        "date": "2010-01-07T00:00:00.000Z",
        "day": 21,
        "gross": 6094445,
        "theaters": 3461,
        "totalGross": 380540297
    },
    {
        "title": "Avatar",
        "date": "2010-01-08T00:00:00.000Z",
        "day": 22,
        "gross": 13280653,
        "theaters": 3422,
        "totalGross": 393820950
    },
    {
        "title": "Avatar",
        "date": "2010-01-09T00:00:00.000Z",
        "day": 23,
        "gross": 21269537,
        "theaters": 3422,
        "totalGross": 415090487
    },
    {
        "title": "Avatar",
        "date": "2010-01-10T00:00:00.000Z",
        "day": 24,
        "gross": 15756027,
        "theaters": 3422,
        "totalGross": 430846514
    },
    {
        "title": "Avatar",
        "date": "2010-01-11T00:00:00.000Z",
        "day": 25,
        "gross": 5111193,
        "theaters": 3422,
        "totalGross": 435957707
    },
    {
        "title": "Avatar",
        "date": "2010-01-12T00:00:00.000Z",
        "day": 26,
        "gross": 5066734,
        "theaters": 3422,
        "totalGross": 441024441
    },
    {
        "title": "Avatar",
        "date": "2010-01-13T00:00:00.000Z",
        "day": 27,
        "gross": 4743762,
        "theaters": 3422,
        "totalGross": 445768203
    },
    {
        "title": "Avatar",
        "date": "2010-01-14T00:00:00.000Z",
        "day": 28,
        "gross": 4698802,
        "theaters": 3422,
        "totalGross": 450467005
    },
    {
        "title": "Avatar",
        "date": "2010-01-15T00:00:00.000Z",
        "day": 29,
        "gross": 10394264,
        "theaters": 3285,
        "totalGross": 460861269
    },
    {
        "title": "Avatar",
        "date": "2010-01-16T00:00:00.000Z",
        "day": 30,
        "gross": 17254108,
        "theaters": 3285,
        "totalGross": 478115377
    },
    {
        "title": "Avatar",
        "date": "2010-01-17T00:00:00.000Z",
        "day": 31,
        "gross": 15137240,
        "theaters": 3285,
        "totalGross": 493252617
    },
    {
        "title": "Avatar",
        "date": "2010-01-18T00:00:00.000Z",
        "day": 32,
        "gross": 11615834,
        "theaters": 3285,
        "totalGross": 504868451
    },
    {
        "title": "Avatar",
        "date": "2010-01-19T00:00:00.000Z",
        "day": 33,
        "gross": 4190947,
        "theaters": 3285,
        "totalGross": 509059398
    },
    {
        "title": "Avatar",
        "date": "2010-01-20T00:00:00.000Z",
        "day": 34,
        "gross": 3792807,
        "theaters": 3285,
        "totalGross": 512852205
    },
    {
        "title": "Avatar",
        "date": "2010-01-21T00:00:00.000Z",
        "day": 35,
        "gross": 3945213,
        "theaters": 3285,
        "totalGross": 516797418
    },
    {
        "title": "The Matrix",
        "date": "1999-03-31T00:00:00.000Z",
        "day": 1,
        "gross": 4803310,
        "theaters": 2704,
        "totalGross": 4803310
    },
    {
        "title": "The Matrix",
        "date": "1999-04-01T00:00:00.000Z",
        "day": 2,
        "gross": 4775000,
        "theaters": 2704,
        "totalGross": 9578310
    },
    {
        "title": "The Matrix",
        "date": "1999-04-02T00:00:00.000Z",
        "day": 3,
        "gross": 9630000,
        "theaters": 2849,
        "totalGross": 19208310
    },
    {
        "title": "The Matrix",
        "date": "1999-04-03T00:00:00.000Z",
        "day": 4,
        "gross": 10725000,
        "theaters": 2849,
        "totalGross": 29933310
    },
    {
        "title": "The Matrix",
        "date": "1999-04-04T00:00:00.000Z",
        "day": 5,
        "gross": 7869000,
        "theaters": 2849,
        "totalGross": 37802310
    },
    {
        "title": "The Matrix",
        "date": "1999-04-05T00:00:00.000Z",
        "day": 6,
        "gross": 3851135,
        "theaters": 2849,
        "totalGross": 41653445
    },
    {
        "title": "The Matrix",
        "date": "1999-04-06T00:00:00.000Z",
        "day": 7,
        "gross": 3432110,
        "theaters": 2849,
        "totalGross": 45085555
    },
    {
        "title": "The Matrix",
        "date": "1999-04-07T00:00:00.000Z",
        "day": 8,
        "gross": 3054134,
        "theaters": 2849,
        "totalGross": 48139689
    },
    {
        "title": "The Matrix",
        "date": "1999-04-08T00:00:00.000Z",
        "day": 9,
        "gross": 3057015,
        "theaters": 2849,
        "totalGross": 51196704
    },
    {
        "title": "The Matrix",
        "date": "1999-04-09T00:00:00.000Z",
        "day": 10,
        "gross": 6715000,
        "theaters": 2903,
        "totalGross": 57911704
    },
    {
        "title": "The Matrix",
        "date": "1999-04-10T00:00:00.000Z",
        "day": 11,
        "gross": 9455000,
        "theaters": 2903,
        "totalGross": 67366704
    },
    {
        "title": "The Matrix",
        "date": "1999-04-11T00:00:00.000Z",
        "day": 12,
        "gross": 6433000,
        "theaters": 2903,
        "totalGross": 73799704
    },
    {
        "title": "The Matrix",
        "date": "1999-04-12T00:00:00.000Z",
        "day": 13,
        "gross": 2009567,
        "theaters": 2903,
        "totalGross": 75809271
    },
    {
        "title": "The Matrix",
        "date": "1999-04-13T00:00:00.000Z",
        "day": 14,
        "gross": 2029919,
        "theaters": 2903,
        "totalGross": 77839190
    },
    {
        "title": "The Matrix",
        "date": "1999-04-14T00:00:00.000Z",
        "day": 15,
        "gross": 1769694,
        "theaters": 2908,
        "totalGross": 79608884
    },
    {
        "title": "The Matrix",
        "date": "1999-04-15T00:00:00.000Z",
        "day": 16,
        "gross": 1885931,
        "theaters": 2903,
        "totalGross": 81494815
    },
    {
        "title": "The Matrix",
        "date": "1999-04-16T00:00:00.000Z",
        "day": 17,
        "gross": 5220000,
        "theaters": 2903,
        "totalGross": 86714815
    },
    {
        "title": "The Matrix",
        "date": "1999-04-17T00:00:00.000Z",
        "day": 18,
        "gross": 7830000,
        "theaters": 2903,
        "totalGross": 94544815
    },
    {
        "title": "The Matrix",
        "date": "1999-04-18T00:00:00.000Z",
        "day": 19,
        "gross": 4876000,
        "theaters": 2903,
        "totalGross": 99420815
    },
    {
        "title": "The Matrix",
        "date": "1999-04-19T00:00:00.000Z",
        "day": 20,
        "gross": 1404184,
        "theaters": 2903,
        "totalGross": 100824999
    },
    {
        "title": "The Matrix",
        "date": "1999-04-20T00:00:00.000Z",
        "day": 21,
        "gross": 1507118,
        "theaters": 2903,
        "totalGross": 102332117
    },
    {
        "title": "The Matrix",
        "date": "1999-04-21T00:00:00.000Z",
        "day": 22,
        "gross": 1264635,
        "theaters": 2903,
        "totalGross": 103596752
    },
    {
        "title": "The Matrix",
        "date": "1999-04-22T00:00:00.000Z",
        "day": 23,
        "gross": 1317496,
        "theaters": 2903,
        "totalGross": 104914248
    },
    {
        "title": "The Matrix",
        "date": "1999-04-23T00:00:00.000Z",
        "day": 24,
        "gross": 3735000,
        "theaters": 2903,
        "totalGross": 108649248
    },
    {
        "title": "The Matrix",
        "date": "1999-04-24T00:00:00.000Z",
        "day": 25,
        "gross": 5650000,
        "theaters": 2903,
        "totalGross": 114299248
    },
    {
        "title": "The Matrix",
        "date": "1999-04-25T00:00:00.000Z",
        "day": 26,
        "gross": 3290000,
        "theaters": 2903,
        "totalGross": 117589248
    },
    {
        "title": "The Matrix",
        "date": "1999-04-26T00:00:00.000Z",
        "day": 27,
        "gross": 946838,
        "theaters": 2903,
        "totalGross": 118536086
    },
    {
        "title": "The Matrix",
        "date": "1999-04-27T00:00:00.000Z",
        "day": 28,
        "gross": 1114413,
        "theaters": 2903,
        "totalGross": 119650499
    },
    {
        "title": "The Matrix",
        "date": "1999-04-28T00:00:00.000Z",
        "day": 29,
        "gross": 927215,
        "theaters": 2903,
        "totalGross": 120577714
    },
    {
        "title": "The Matrix",
        "date": "1999-04-29T00:00:00.000Z",
        "day": 30,
        "gross": 927691,
        "theaters": 2903,
        "totalGross": 121505405
    },
    {
        "title": "The Matrix",
        "date": "1999-04-30T00:00:00.000Z",
        "day": 31,
        "gross": 2505000,
        "theaters": 2903,
        "totalGross": 124010405
    },
    {
        "title": "The Matrix",
        "date": "1999-05-01T00:00:00.000Z",
        "day": 32,
        "gross": 4050000,
        "theaters": 2903,
        "totalGross": 128060405
    },
    {
        "title": "The Matrix",
        "date": "1999-05-02T00:00:00.000Z",
        "day": 33,
        "gross": 2288000,
        "theaters": 2903,
        "totalGross": 130348405
    },
    {
        "title": "The Matrix",
        "date": "1999-05-03T00:00:00.000Z",
        "day": 34,
        "gross": 717341,
        "theaters": 2903,
        "totalGross": 131065746
    },
    {
        "title": "The Matrix",
        "date": "1999-05-04T00:00:00.000Z",
        "day": 35,
        "gross": 820679,
        "theaters": 2903,
        "totalGross": 131886425
    },
    {
        "title": "The Dark Knight",
        "date": "2008-07-18T00:00:00.000Z",
        "day": 1,
        "gross": 67165092,
        "theaters": 4366,
        "totalGross": 67165092
    },
    {
        "title": "The Dark Knight",
        "date": "2008-07-19T00:00:00.000Z",
        "day": 2,
        "gross": 47650240,
        "theaters": 4366,
        "totalGross": 114815332
    },
    {
        "title": "The Dark Knight",
        "date": "2008-07-20T00:00:00.000Z",
        "day": 3,
        "gross": 43596151,
        "theaters": 4366,
        "totalGross": 158411483
    },
    {
        "title": "The Dark Knight",
        "date": "2008-07-21T00:00:00.000Z",
        "day": 4,
        "gross": 24493313,
        "theaters": 4366,
        "totalGross": 182904796
    },
    {
        "title": "The Dark Knight",
        "date": "2008-07-22T00:00:00.000Z",
        "day": 5,
        "gross": 20868722,
        "theaters": 4366,
        "totalGross": 203773518
    },
    {
        "title": "The Dark Knight",
        "date": "2008-07-23T00:00:00.000Z",
        "day": 6,
        "gross": 18377288,
        "theaters": 4366,
        "totalGross": 222150806
    },
    {
        "title": "The Dark Knight",
        "date": "2008-07-24T00:00:00.000Z",
        "day": 7,
        "gross": 16464405,
        "theaters": 4366,
        "totalGross": 238615211
    },
    {
        "title": "The Dark Knight",
        "date": "2008-07-25T00:00:00.000Z",
        "day": 8,
        "gross": 23232292,
        "theaters": 4366,
        "totalGross": 261847503
    },
    {
        "title": "The Dark Knight",
        "date": "2008-07-26T00:00:00.000Z",
        "day": 9,
        "gross": 28272494,
        "theaters": 4366,
        "totalGross": 290119997
    },
    {
        "title": "The Dark Knight",
        "date": "2008-07-27T00:00:00.000Z",
        "day": 10,
        "gross": 23661680,
        "theaters": 4366,
        "totalGross": 313781677
    },
    {
        "title": "The Dark Knight",
        "date": "2008-07-28T00:00:00.000Z",
        "day": 11,
        "gross": 10518116,
        "theaters": 4366,
        "totalGross": 324299793
    },
    {
        "title": "The Dark Knight",
        "date": "2008-07-29T00:00:00.000Z",
        "day": 12,
        "gross": 9629366,
        "theaters": 4366,
        "totalGross": 333929159
    },
    {
        "title": "The Dark Knight",
        "date": "2008-07-30T00:00:00.000Z",
        "day": 13,
        "gross": 8755141,
        "theaters": 4366,
        "totalGross": 342684300
    },
    {
        "title": "The Dark Knight",
        "date": "2008-07-31T00:00:00.000Z",
        "day": 14,
        "gross": 8402546,
        "theaters": 4366,
        "totalGross": 351086846
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-01T00:00:00.000Z",
        "day": 15,
        "gross": 12709035,
        "theaters": 4266,
        "totalGross": 363795881
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-02T00:00:00.000Z",
        "day": 16,
        "gross": 17191150,
        "theaters": 4266,
        "totalGross": 380987031
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-03T00:00:00.000Z",
        "day": 17,
        "gross": 12764034,
        "theaters": 4266,
        "totalGross": 393751065
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-04T00:00:00.000Z",
        "day": 18,
        "gross": 6287429,
        "theaters": 4266,
        "totalGross": 400038494
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-05T00:00:00.000Z",
        "day": 19,
        "gross": 5661240,
        "theaters": 4266,
        "totalGross": 405699734
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-06T00:00:00.000Z",
        "day": 20,
        "gross": 5077367,
        "theaters": 4266,
        "totalGross": 410777101
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-07T00:00:00.000Z",
        "day": 21,
        "gross": 4734366,
        "theaters": 4266,
        "totalGross": 415511467
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-08T00:00:00.000Z",
        "day": 22,
        "gross": 7577362,
        "theaters": 4025,
        "totalGross": 423088829
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-09T00:00:00.000Z",
        "day": 23,
        "gross": 10502243,
        "theaters": 4025,
        "totalGross": 433591072
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-10T00:00:00.000Z",
        "day": 24,
        "gross": 8037425,
        "theaters": 4025,
        "totalGross": 441628497
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-11T00:00:00.000Z",
        "day": 25,
        "gross": 3742198,
        "theaters": 4025,
        "totalGross": 445370695
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-12T00:00:00.000Z",
        "day": 26,
        "gross": 3515389,
        "theaters": 4025,
        "totalGross": 448886084
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-13T00:00:00.000Z",
        "day": 27,
        "gross": 3002302,
        "theaters": 4025,
        "totalGross": 451888386
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-14T00:00:00.000Z",
        "day": 28,
        "gross": 2814471,
        "theaters": 4025,
        "totalGross": 454702857
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-15T00:00:00.000Z",
        "day": 29,
        "gross": 4937955,
        "theaters": 3590,
        "totalGross": 459640812
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-16T00:00:00.000Z",
        "day": 30,
        "gross": 6708833,
        "theaters": 3590,
        "totalGross": 466349645
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-17T00:00:00.000Z",
        "day": 31,
        "gross": 4732505,
        "theaters": 3590,
        "totalGross": 471082150
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-18T00:00:00.000Z",
        "day": 32,
        "gross": 2112203,
        "theaters": 3590,
        "totalGross": 473194353
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-19T00:00:00.000Z",
        "day": 33,
        "gross": 2148332,
        "theaters": 3590,
        "totalGross": 475342685
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-20T00:00:00.000Z",
        "day": 34,
        "gross": 1805312,
        "theaters": 3590,
        "totalGross": 477147997
    },
    {
        "title": "The Dark Knight",
        "date": "2008-08-21T00:00:00.000Z",
        "day": 35,
        "gross": 1726461,
        "theaters": 3590,
        "totalGross": 478874458
    },
    {
        "title": "Fight Club",
        "date": "1999-10-15T00:00:00.000Z",
        "day": 1,
        "gross": 3785000,
        "theaters": 1963,
        "totalGross": 3785000
    },
    {
        "title": "Fight Club",
        "date": "1999-10-16T00:00:00.000Z",
        "day": 2,
        "gross": 4150000,
        "theaters": 1963,
        "totalGross": 7935000
    },
    {
        "title": "Fight Club",
        "date": "1999-10-17T00:00:00.000Z",
        "day": 3,
        "gross": 3150000,
        "theaters": 1963,
        "totalGross": 11085000
    },
    {
        "title": "Fight Club",
        "date": "1999-10-18T00:00:00.000Z",
        "day": 4,
        "gross": 1133726,
        "theaters": 1963,
        "totalGross": 12218726
    },
    {
        "title": "Fight Club",
        "date": "1999-10-19T00:00:00.000Z",
        "day": 5,
        "gross": 1232636,
        "theaters": 1963,
        "totalGross": 13451362
    },
    {
        "title": "Fight Club",
        "date": "1999-10-20T00:00:00.000Z",
        "day": 6,
        "gross": 1121764,
        "theaters": 1963,
        "totalGross": 14573126
    },
    {
        "title": "Fight Club",
        "date": "1999-10-21T00:00:00.000Z",
        "day": 7,
        "gross": 1032236,
        "theaters": 1963,
        "totalGross": 15605362
    },
    {
        "title": "Fight Club",
        "date": "1999-10-22T00:00:00.000Z",
        "day": 8,
        "gross": 2045000,
        "theaters": 1966,
        "totalGross": 17650362
    },
    {
        "title": "Fight Club",
        "date": "1999-10-23T00:00:00.000Z",
        "day": 9,
        "gross": 2450000,
        "theaters": 1966,
        "totalGross": 20100362
    },
    {
        "title": "Fight Club",
        "date": "1999-10-24T00:00:00.000Z",
        "day": 10,
        "gross": 1800000,
        "theaters": 1966,
        "totalGross": 21900362
    },
    {
        "title": "Fight Club",
        "date": "1999-10-25T00:00:00.000Z",
        "day": 11,
        "gross": 609759,
        "theaters": 1966,
        "totalGross": 22510121
    },
    {
        "title": "Fight Club",
        "date": "1999-10-26T00:00:00.000Z",
        "day": 12,
        "gross": 719196,
        "theaters": 1966,
        "totalGross": 23229317
    },
    {
        "title": "Fight Club",
        "date": "1999-10-27T00:00:00.000Z",
        "day": 13,
        "gross": 568687,
        "theaters": 1966,
        "totalGross": 23798004
    },
    {
        "title": "Fight Club",
        "date": "1999-10-28T00:00:00.000Z",
        "day": 14,
        "gross": 574260,
        "theaters": 1966,
        "totalGross": 24372264
    },
    {
        "title": "Fight Club",
        "date": "1999-10-29T00:00:00.000Z",
        "day": 15,
        "gross": 1155000,
        "theaters": 1946,
        "totalGross": 25527264
    },
    {
        "title": "Fight Club",
        "date": "1999-10-30T00:00:00.000Z",
        "day": 16,
        "gross": 1230000,
        "theaters": 1946,
        "totalGross": 26757264
    },
    {
        "title": "Fight Club",
        "date": "1999-10-31T00:00:00.000Z",
        "day": 17,
        "gross": 900000,
        "theaters": 1943,
        "totalGross": 27657264
    },
    {
        "title": "Fight Club",
        "date": "1999-11-01T00:00:00.000Z",
        "day": 18,
        "gross": 419214,
        "theaters": 1943,
        "totalGross": 28076478
    },
    {
        "title": "Fight Club",
        "date": "1999-11-02T00:00:00.000Z",
        "day": 19,
        "gross": 533693,
        "theaters": 1943,
        "totalGross": 28610171
    },
    {
        "title": "Fight Club",
        "date": "1999-11-03T00:00:00.000Z",
        "day": 20,
        "gross": 439219,
        "theaters": 1943,
        "totalGross": 29049390
    },
    {
        "title": "Fight Club",
        "date": "1999-11-04T00:00:00.000Z",
        "day": 21,
        "gross": 434122,
        "theaters": 1943,
        "totalGross": 29483512
    },
    {
        "title": "Fight Club",
        "date": "1999-11-05T00:00:00.000Z",
        "day": 22,
        "gross": 773000,
        "theaters": 1606,
        "totalGross": 30256512
    },
    {
        "title": "Fight Club",
        "date": "1999-11-06T00:00:00.000Z",
        "day": 23,
        "gross": 1015000,
        "theaters": 1606,
        "totalGross": 31271512
    },
    {
        "title": "Fight Club",
        "date": "1999-11-07T00:00:00.000Z",
        "day": 24,
        "gross": 629000,
        "theaters": 1943,
        "totalGross": 31900512
    },
    {
        "title": "Fight Club",
        "date": "1999-11-08T00:00:00.000Z",
        "day": 25,
        "gross": 217437,
        "theaters": 1943,
        "totalGross": 32117949
    },
    {
        "title": "Fight Club",
        "date": "1999-11-09T00:00:00.000Z",
        "day": 26,
        "gross": 297089,
        "theaters": 1943,
        "totalGross": 32415038
    },
    {
        "title": "Fight Club",
        "date": "1999-11-10T00:00:00.000Z",
        "day": 27,
        "gross": 267402,
        "theaters": 1603,
        "totalGross": 32682440
    },
    {
        "title": "Fight Club",
        "date": "1999-11-11T00:00:00.000Z",
        "day": 28,
        "gross": 305609,
        "theaters": 1603,
        "totalGross": 32988049
    },
    {
        "title": "Fight Club",
        "date": "1999-11-14T00:00:00.000Z",
        "day": 31,
        "gross": 259000,
        "theaters": 741,
        "totalGross": 33247049
    },
    {
        "title": "Fight Club",
        "date": "1999-11-15T00:00:00.000Z",
        "day": 32,
        "gross": 120794,
        "theaters": 741,
        "totalGross": 33367843
    },
    {
        "title": "Fight Club",
        "date": "1999-11-16T00:00:00.000Z",
        "day": 33,
        "gross": 138897,
        "theaters": 741,
        "totalGross": 33506740
    },
    {
        "title": "Fight Club",
        "date": "1999-11-17T00:00:00.000Z",
        "day": 34,
        "gross": 108384,
        "theaters": 741,
        "totalGross": 33615124
    },
    {
        "title": "Fight Club",
        "date": "1999-11-18T00:00:00.000Z",
        "day": 35,
        "gross": 103717,
        "theaters": 741,
        "totalGross": 33718841
    },
    {
        "title": "Interstellar",
        "date": "2014-11-05T00:00:00.000Z",
        "day": 1,
        "gross": 1350209,
        "theaters": 249,
        "totalGross": 1350209
    },
    {
        "title": "Interstellar",
        "date": "2014-11-06T00:00:00.000Z",
        "day": 2,
        "gross": 801244,
        "theaters": 249,
        "totalGross": 2151453
    },
    {
        "title": "Interstellar",
        "date": "2014-11-07T00:00:00.000Z",
        "day": 3,
        "gross": 16871009,
        "theaters": 3561,
        "totalGross": 19022462
    },
    {
        "title": "Interstellar",
        "date": "2014-11-08T00:00:00.000Z",
        "day": 4,
        "gross": 18292991,
        "theaters": 3561,
        "totalGross": 37315453
    },
    {
        "title": "Interstellar",
        "date": "2014-11-09T00:00:00.000Z",
        "day": 5,
        "gross": 12346360,
        "theaters": 3561,
        "totalGross": 49661813
    },
    {
        "title": "Interstellar",
        "date": "2014-11-10T00:00:00.000Z",
        "day": 6,
        "gross": 5274857,
        "theaters": 3561,
        "totalGross": 54936670
    },
    {
        "title": "Interstellar",
        "date": "2014-11-11T00:00:00.000Z",
        "day": 7,
        "gross": 6900370,
        "theaters": 3561,
        "totalGross": 61837040
    },
    {
        "title": "Interstellar",
        "date": "2014-11-12T00:00:00.000Z",
        "day": 8,
        "gross": 3416154,
        "theaters": 3561,
        "totalGross": 65253194
    },
    {
        "title": "Interstellar",
        "date": "2014-11-13T00:00:00.000Z",
        "day": 9,
        "gross": 3366661,
        "theaters": 3561,
        "totalGross": 68619855
    },
    {
        "title": "Interstellar",
        "date": "2014-11-14T00:00:00.000Z",
        "day": 10,
        "gross": 8302649,
        "theaters": 3561,
        "totalGross": 76922504
    },
    {
        "title": "Interstellar",
        "date": "2014-11-15T00:00:00.000Z",
        "day": 11,
        "gross": 12510975,
        "theaters": 3561,
        "totalGross": 89433479
    },
    {
        "title": "Interstellar",
        "date": "2014-11-16T00:00:00.000Z",
        "day": 12,
        "gross": 7494002,
        "theaters": 3561,
        "totalGross": 96927481
    },
    {
        "title": "Interstellar",
        "date": "2014-11-17T00:00:00.000Z",
        "day": 13,
        "gross": 2163528,
        "theaters": 3561,
        "totalGross": 99091009
    },
    {
        "title": "Interstellar",
        "date": "2014-11-18T00:00:00.000Z",
        "day": 14,
        "gross": 2666312,
        "theaters": 3561,
        "totalGross": 101757321
    },
    {
        "title": "Interstellar",
        "date": "2014-11-19T00:00:00.000Z",
        "day": 15,
        "gross": 2022943,
        "theaters": 3561,
        "totalGross": 103780264
    },
    {
        "title": "Interstellar",
        "date": "2014-11-20T00:00:00.000Z",
        "day": 16,
        "gross": 1811803,
        "theaters": 3561,
        "totalGross": 105592067
    },
    {
        "title": "Interstellar",
        "date": "2014-11-21T00:00:00.000Z",
        "day": 17,
        "gross": 4220407,
        "theaters": 3415,
        "totalGross": 109812474
    },
    {
        "title": "Interstellar",
        "date": "2014-11-22T00:00:00.000Z",
        "day": 18,
        "gross": 6805320,
        "theaters": 3415,
        "totalGross": 116617794
    },
    {
        "title": "Interstellar",
        "date": "2014-11-23T00:00:00.000Z",
        "day": 19,
        "gross": 4315440,
        "theaters": 3415,
        "totalGross": 120933234
    },
    {
        "title": "Interstellar",
        "date": "2014-11-24T00:00:00.000Z",
        "day": 20,
        "gross": 1726816,
        "theaters": 3415,
        "totalGross": 122660050
    },
    {
        "title": "Interstellar",
        "date": "2014-11-25T00:00:00.000Z",
        "day": 21,
        "gross": 2420222,
        "theaters": 3415,
        "totalGross": 125080272
    },
    {
        "title": "Interstellar",
        "date": "2014-11-26T00:00:00.000Z",
        "day": 22,
        "gross": 3172132,
        "theaters": 3066,
        "totalGross": 128252404
    },
    {
        "title": "Interstellar",
        "date": "2014-11-27T00:00:00.000Z",
        "day": 23,
        "gross": 3040073,
        "theaters": 3066,
        "totalGross": 131292477
    },
    {
        "title": "Interstellar",
        "date": "2014-11-28T00:00:00.000Z",
        "day": 24,
        "gross": 6604574,
        "theaters": 3066,
        "totalGross": 137897051
    },
    {
        "title": "Interstellar",
        "date": "2014-11-29T00:00:00.000Z",
        "day": 25,
        "gross": 6111539,
        "theaters": 3066,
        "totalGross": 144008590
    },
    {
        "title": "Interstellar",
        "date": "2014-11-30T00:00:00.000Z",
        "day": 26,
        "gross": 3026892,
        "theaters": 3066,
        "totalGross": 147035482
    },
    {
        "title": "Interstellar",
        "date": "2014-12-01T00:00:00.000Z",
        "day": 27,
        "gross": 847665,
        "theaters": 3066,
        "totalGross": 147883147
    },
    {
        "title": "Interstellar",
        "date": "2014-12-02T00:00:00.000Z",
        "day": 28,
        "gross": 1046566,
        "theaters": 3066,
        "totalGross": 148929713
    },
    {
        "title": "Interstellar",
        "date": "2014-12-03T00:00:00.000Z",
        "day": 29,
        "gross": 850836,
        "theaters": 3066,
        "totalGross": 149780549
    },
    {
        "title": "Interstellar",
        "date": "2014-12-04T00:00:00.000Z",
        "day": 30,
        "gross": 876413,
        "theaters": 3066,
        "totalGross": 150656962
    },
    {
        "title": "Interstellar",
        "date": "2014-12-05T00:00:00.000Z",
        "day": 31,
        "gross": 2135264,
        "theaters": 3028,
        "totalGross": 152792226
    },
    {
        "title": "Interstellar",
        "date": "2014-12-06T00:00:00.000Z",
        "day": 32,
        "gross": 3581210,
        "theaters": 3028,
        "totalGross": 156373436
    },
    {
        "title": "Interstellar",
        "date": "2014-12-07T00:00:00.000Z",
        "day": 33,
        "gross": 2071883,
        "theaters": 3028,
        "totalGross": 158445319
    },
    {
        "title": "Interstellar",
        "date": "2014-12-08T00:00:00.000Z",
        "day": 34,
        "gross": 650235,
        "theaters": 3028,
        "totalGross": 159095554
    },
    {
        "title": "Interstellar",
        "date": "2014-12-09T00:00:00.000Z",
        "day": 35,
        "gross": 825347,
        "theaters": 3028,
        "totalGross": 159920901
    }
];}
