import { fetchData } from './fetchModule.js';

export function init(){
    initialRenderUserInfo();
    bindEvents();
}

function initialRenderUserInfo() {
    // set everything to empty to get user info from server
    const emptyInfo = {
        userInfo: {
            firstName: "",
            lastName: "",
            address: "",
            country: "",
            state: "",
            zip: "",
            email: "",
        },
        newPassword: ""
    };

    const fillFormWithUserInfo = (response) => {
        document.getElementById('firstName').value = response.userInfo.firstName || "";
        document.getElementById('lastName').value = response.userInfo.lastName || "";
        document.getElementById('address').value = response.userInfo.address || "";
        document.getElementById('country').value = response.userInfo.country || "";
        document.getElementById('state').value = response.userInfo.state || "";
        document.getElementById('zip').value = response.userInfo.zip || "";
        document.getElementById('email').value = response.userInfo.email || "";
    };

    // This is initial rendering, not actual editing HTTP request
    editUserInfo(emptyInfo, fillFormWithUserInfo);
}

function bindEvents() {
    document.getElementById('editForm').addEventListener('submit', (event) => {
        const newUserInfo = {
            userInfo: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                address: document.getElementById('address').value,
                country: document.getElementById('country').value,
                state: document.getElementById('state').value,
                zip: document.getElementById('zip').value,
                email: document.getElementById('email').value
            },
            newPassword: document.getElementById('newPassword').value
        };
        editUserInfo(newUserInfo);
    });
}

function editUserInfo(requestBody, onSuccess) {
    fetchData('/Auth/EditAndRetreiveProfile', requestBody, onSuccess || ((response) => {}));
}