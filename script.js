document.addEventListener('DOMContentLoaded', (event) => {
    if (!localStorage.getItem('inventory')) {
        fetch('clothing.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('inventory', JSON.stringify(data));
                displayProducts();
            })
            .catch(error => console.error('Error loading JSON data:', error));
    } else {
        displayProducts();
    }
});

function displayProducts(filterSize = null) {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = '';

    let inventory = JSON.parse(localStorage.getItem('inventory'));

    if (filterSize) {
        inventory = inventory.filter(product => product.size === filterSize);
    }

    inventory.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <p>Maat: ${product.size}</p>
            <p>Aantal: <span id="amount-${product.id}">${product.amount}</span></p>
            <button onclick="updateAmount('${product.id}', 1)">+</button>
            <button onclick="updateAmount('${product.id}', -1)">-</button>
        `;
        productsContainer.appendChild(productElement);
    });
}

function updateAmount(productId, change) {
    let inventory = JSON.parse(localStorage.getItem('inventory'));

    inventory = inventory.map(product => {
        if (product.id === productId) {
            product.amount += change;
            if (product.amount < 0) product.amount = 0;
        }
        return product;
    });

    inventory = inventory.filter(product => product.amount > 0);

    localStorage.setItem('inventory', JSON.stringify(inventory));
    displayProducts();
}

function filterBySize(size) {
    displayProducts(size);
}

function resetFilter() {
    displayProducts();
}

function resetInventory() {
    fetch('clothing.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('inventory', JSON.stringify(data));
            displayProducts();
        })
        .catch(error => console.error('Error loading JSON data:', error));
}

displayProducts();