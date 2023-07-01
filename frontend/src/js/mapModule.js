import L from 'leaflet'; // Import leaflet into your JS file
import 'leaflet/dist/leaflet.css'; // This import is important to include leaflet's CSS
import { getState } from "./landingPage";

let map = null;
let markers = [];

export function render(products) {
  if (!map) { 
    initializeMap(); 
  }

  clearMarkers();
  setViewBasedOnProducts(products);
  renderProductMarkers(products);
}

function initializeMap() {
  map = L.map('map');

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  
  map.on('click', onMapClick);
}

function clearMarkers() {
  markers.forEach(marker => {
    map.removeLayer(marker);
  });
  markers = [];
}

function setViewBasedOnProducts(products) {
  if (products.length <= 0) {
    return;
  }

  const latLngs = products.map(p => [p.latitude, p.longitude]);
  const bounds = L.latLngBounds(latLngs);
  map.fitBounds(bounds, { padding: [20, 20] });
}

function renderProductMarkers(products) {
  products.forEach(product => {
    const marker = L.marker([product.latitude, product.longitude]).addTo(map);
    
    const content = document.createElement('div');

    const idParagraph = document.createElement('p');
    idParagraph.textContent = `ID: ${product.id}`;
    content.appendChild(idParagraph);

    const locationParagraph = document.createElement('p');
    locationParagraph.textContent = `Location: ${product.latitude}, ${product.longitude}`;
    content.appendChild(locationParagraph);

    if (getState().currentProject.status) { // marker's add/edit button willl not display on read-only project
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.addEventListener('click', () => editProduct(product.id));
      content.appendChild(editButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => deleteProduct(product.id));
      content.appendChild(deleteButton);
    }

    marker.bindPopup(content);
    markers.push(marker);
  });
}

function onMapClick(e) {
  const latLng = e.latlng;
  const lat = parseFloat(latLng.lat.toFixed(6));
  const lng = parseFloat(latLng.lng.toFixed(6));

  const content = document.createElement('div');

  const locationParagraph = document.createElement('p');
  locationParagraph.textContent = `Location: ${lat}, ${lng}`;
  content.appendChild(locationParagraph);

  if (getState().currentProject.status) {
    const addButton = document.createElement('button');
    addButton.textContent = 'Add product';
    addButton.addEventListener('click', () => addProduct(lat, lng));
    content.appendChild(addButton);
  }

  L.popup().setLatLng(latLng).setContent(content).openOn(map);
}

function addProduct(lat, lng) {
  // Implement your product add logic here
  console.log(`Add product at: ${lat}, ${lng}`);
}

function editProduct(id) {
  // Implement your product edit logic here
  console.log(`Edit product: ${id}`);
}

function deleteProduct(id) {
  // Implement your product delete logic here
  console.log(`Delete product: ${id}`);
}
