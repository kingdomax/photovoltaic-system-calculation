export function fetchData(url, requestBody, onSuccess) {
    fetch(`http://localhost:7070${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${sessionStorage.getItem('usertoken')}`
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(err => {
                throw new Error(`${err} (code ${response.status})`);
            });
        }
        return response.json();
    })
    .then(onSuccess)
    .catch((error) => { 
        alert(`API Error ${url} : ${error.message}`); 
    });
}
