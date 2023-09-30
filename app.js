function initializePage() {
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
            loadVendors(currentPage);
            addVendorForm.reset();
        })
        .catch(error => {
            console.log(error);
        });
    });
}

document.addEventListener('DOMContentLoaded', initializePage);

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
        const pageNumberSpan = document.getElementById('page-number');
        
        const vendorTable = document.getElementById('vendor-list').getElementsByTagName('tbody')[0];
        const updateButton = document.getElementById('update-vendor-button');
        updateButton.style.display='none';
        vendorTable.innerHTML = '';
        
        
        data.content.forEach(vendor => {
            const row = vendorTable.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);

            cell1.textContent = vendor.vendorName;
            cell2.textContent = vendor.bankAccountNo;
            cell3.textContent = vendor.bankName;
            
            // Edit link
            const editLink = document.createElement('a');
            editLink.href = `javascript:editVendor('${vendor.id}')`; // Call edit function
            editLink.textContent = 'Edit';
            cell4.appendChild(editLink);

            // Delete link
            const deleteLink = document.createElement('a');
            deleteLink.href = `javascript:deleteVendor('${vendor.id}')`; // Call delete function
            deleteLink.textContent = 'Delete';
            cell5.appendChild(deleteLink);
        });

        // Update current page
        currentPage = data.number;
        pageNumberSpan.textContent = `Page ${currentPage + 1} of ${data.totalPages}`;

        // Disable/enable pagination buttons based on the page number
        document.getElementById('prev-page').disabled = currentPage === 0;
        document.getElementById('next-page').disabled = currentPage === data.totalPages - 1;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to delete a vendor
function deleteVendor(id) {
    const confirmDelete = confirm('Are you sure you want to delete this vendor?');
    
    if (confirmDelete) {
        const apiUrl = `http://localhost:8080/delete/${id}`;

        fetch(apiUrl, {
            method: 'DELETE',
            mode: 'cors',
        })
        .then(response => {
            console.log('Response status:', response.status); 
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            if (response.status === 204) {
                loadVendors(currentPage);
            } else {
                throw new Error('Deletion failed');
            }
        })
        .catch(error => {
            console.error('Error:', error); 
        });
    }
}


// Event listener for previous page button
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 0) {
        loadVendors(currentPage - 1);
    }
});

// Event listener for next page button
document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = 10; 

    if (currentPage < totalPages - 1) {
        loadVendors(currentPage + 1);
    }
});






// Function to handle editing a vendor
function editVendor(id) {
    // Fetch the vendor details by id backend
    const apiUrl = `http://localhost:8080/${id}`; 

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
        // Populate the form with the vendor details for editing
        document.getElementById('vendorName').value = data.vendorName;
        document.getElementById('bankAccountNo').value = data.bankAccountNo;
        document.getElementById('bankName').value = data.bankName;
        document.getElementById('addressLine1').value = data.addressLine1;
        document.getElementById('addressLine2').value = data.addressLine2;
        document.getElementById('city').value = data.city;
        document.getElementById('country').value = data.country;
        document.getElementById('zipCode').value = data.zipCode;

        // Modify the update button text and show it
        const updateButton = document.getElementById('update-vendor-button');
        updateButton.style.display = 'block';
        const addButton = document.querySelector('#add-vendor-form button[type="submit"]');
        addButton.style.display = 'none';

        // Add an event listener for the update button
        updateButton.addEventListener('click', () => {
            // Create a JSON object with the updated data
            const updatedData = {
                vendorName: document.getElementById('vendorName').value,
                bankAccountNo: document.getElementById('bankAccountNo').value,
                bankName: document.getElementById('bankName').value,
                addressLine1: document.getElementById('addressLine1').value,
                addressLine2: document.getElementById('addressLine2').value,
                city: document.getElementById('city').value,
                country: document.getElementById('country').value,
                zipCode: document.getElementById('zipCode').value,
            };

            // Perform the PUT request to update the vendor
            fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
                mode: 'cors',
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            })
            .then(data => {
                // After updating, reset the form and change the button text back to 'Add Vendor'
                document.getElementById('add-vendor-form').reset();
                updateButton.style.display = 'none';
                addButton.style.display = 'block';
                loadVendors(currentPage);
            })
            .catch(error => {
                console.log(error);
            });
        });
    })
    .catch(error => {
        console.log(error);
    });
}




// Initial load of the first page
loadVendors(currentPage);

