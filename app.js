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
        const vendorTable = document.getElementById('vendor-list').getElementsByTagName('tbody')[0];
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
            editLink.href = `edit.html?id=${vendor.id}`;
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

// Initial load of the first page
loadVendors(currentPage);

