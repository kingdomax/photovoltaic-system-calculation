import '../scss/dashboard-page.scss';
import * as bootstrap from 'bootstrap';
import * as navbar from './navbarModule.js';

let dashboardState = { fieldA: '', fieldB: '', fieldC: '' };

if (!sessionStorage.getItem('usertoken')) { window.location.href = '/index.html'; }
navbar.init();
// projectList.init();
// projectPage.init();

export function getDashboardState() { JSON.parse(JSON.stringify(dashboardState)); }