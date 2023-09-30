document.addEventListener('DOMContentLoaded', () => {
    const addVendorForm = document.getElementById('add-vendor-form');

    addVendorForm.addEventListener('submit', event => {
        event.preventDefault();


        const vendorData = {
            vendorName: document.getElementById('vendorName').value,
            bankAccountNo: document.getElementById('bankAccountNo').value,
            bankName: document.getElementById('bankName').value,
            addressLine1: document.getElementById('addressLine1').value,
            addressLine2: document.getElementById('addressLine2').value,
            city: document.getElementById('city').value,
            country: document.getElementById('country').value,
            zipCode: document.getElementById('zipCode').value,
        };
        console.log(JSON.stringify(vendorData));

        fetch('http://localhost:8080/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vendorData),
            mode: 'cors', 
        })
        .then(response => response.json())
        .then(data => {
            console.log("vendor");
            addVendorForm.reset();
        })
        .catch(error => {
            console.log(error);
        });
    });
});



let currentPage = 0; 
function loadVendors(page) {

    const apiUrl = `http://localhost:8080/page?page=${page}&size=5`; 

    fetch(apiUrl, {
        method: 'GET',
        mode: 'cors',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const vendorList = document.getElementById('vendor-list');
        vendorList.innerHTML = '';

        data.content.forEach(vendor => {
            const listItem = document.createElement('li');
            listItem.textContent = vendor.vendorName;
            vendorList.appendChild(listItem);
        });


        currentPage = data.number;


        document.getElementById('prev-page').disabled = currentPage === 0;
        document.getElementById('next-page').disabled = currentPage === data.totalPages - 1;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 0) {
        loadVendors(currentPage - 1);
    }
});

document.getElementById('next-page').addEventListener('click', () => {

    const totalPages = 10; 

    if (currentPage < totalPages - 1) {
        loadVendors(currentPage + 1);
    }
});


loadVendors(currentPage);
