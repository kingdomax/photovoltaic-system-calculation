import { fetchData } from './fetchModule.js';

export function init(){
    renderUserInfo();
    bindingFormEvent();
}

function renderUserInfo() {
    // set everything to empty to get user info from server
    const emptyInfo = {
        userInfo: {
            firstName: "",
            lastName: "",
            address: "",
            country: "",
            state: "",
            zip: ""
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
    };

    editUserInfo(emptyInfo, fillFormWithUserInfo);
}

function bindingFormEvent() {
    document.getElementById('editForm').addEventListener('submit', (event) => {
        const newUserInfo = {
            userInfo: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                address: document.getElementById('address').value,
                country: document.getElementById('country').value,
                state: document.getElementById('state').value,
                zip: document.getElementById('zip').value
            },
            newPassword: document.getElementById('newPassword').value
        };
        editUserInfo(newUserInfo);
    });
}

function editUserInfo(requestBody, onSuccess) {
    fetchData(
        'http://localhost:7070/Auth/EditProfile',
        requestBody,
        onSuccess || ((response) => {}),
        (error) => { alert(`Login failed: ${error.message}`); }
    );
}