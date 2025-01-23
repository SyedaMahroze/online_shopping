// Select the search input and button
const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');

// Select the section where products are displayed
const productGrid = document.querySelector('.product-grid');

const products = [
    { name: 'Glam Essentials Makeup Kit', price: 29.99, image: 'pictures/Makeup1.jpeg' },
    { name: 'StridePro Sneakers', price: 59.99, image: 'pictures/S.jpg' },
    { name: 'UrbanTrail Runners', price: 79.99, image: 'pictures/shose2.jpg' },
    { name: 'EliteWalk Shoes', price: 99.99, image: 'pictures/Shose3.webp' },
    { name: 'TimePro Smart Watch', price: 199.99, image: 'pictures/SmartWat1.jpg' },
    { name: 'PulseTrack Smart Watch', price: 179.99, image: 'pictures/SmartWat2.jpg' },
    { name: 'InfinityWear Smart Watch', price: 149.99, image: 'pictures/SmartWat3.jpg' }
];


// Backup original product grid HTML
const originalProductGridHTML = productGrid.innerHTML;

// Event listener for search button
searchButton.addEventListener('click', performSearch);

// Event listener for pressing Enter in the search input
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        performSearch();
    }
});

// Function to perform the search
function performSearch() {
    const query = searchInput.value.trim().toLowerCase();

    if (query) {
        // Clear the current product grid
        productGrid.innerHTML = '';

        // Filter products based on the search query
        const results = products.filter(product =>
            product.name.toLowerCase().includes(query)
        );

        if (results.length > 0) {
            // Dynamically display the search results in the DOM
            results.forEach(product => {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');

                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$${product.price.toFixed(2)}</p>
                    <button>Add to Cart</button>
                `;

                productGrid.appendChild(productCard);
            });
        } else {
            // Display "No Results Found" message
            productGrid.innerHTML = '<p>No products found matching your search.</p>';
        }
    } else {
        // Restore the original product grid if the search is cleared
        productGrid.innerHTML = originalProductGridHTML;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const cartToggle = document.getElementById("cart-toggle");
    const cartTab = document.querySelector(".CartTab");
    const closeButton = document.querySelector(".close");
    const checkoutButton = document.querySelector(".checkout");
    const listCard = document.querySelector(".ListCard");
    const productCards = document.querySelectorAll(".product-card");
    const cartSummaryContainer = document.querySelector(".cart-summary-container");

    // Toggle cart visibility
    cartToggle.addEventListener("click", () => {
        cartTab.classList.toggle("active");
    });

    // Close cart when the "CLOSE" button is clicked
    closeButton.addEventListener("click", () => {
        cartTab.classList.remove("active");
    });

    // Function to add a product to the cart
    const addToCart = (productName, productPrice, productImage) => {
        const existingProduct = Array.from(listCard.children).find(
            (item) => item.querySelector(".name").textContent === productName
        );

        if (existingProduct) {
            const quantityElement = existingProduct.querySelector(".quantity span.quantity-value");
            const priceElement = existingProduct.querySelector(".price");
            const quantity = parseInt(quantityElement.textContent);
            const newQuantity = quantity + 1;

            // Update the quantity and price
            quantityElement.textContent = newQuantity;
            priceElement.textContent = `$${(productPrice * newQuantity).toFixed(2)}`;
        } else {
            const cartItem = document.createElement("div");
            cartItem.classList.add("product-card");

            cartItem.innerHTML = `
                <div class="image">
                    <img src="${productImage}" alt="${productName}">
                </div>
                <div class="name">${productName}</div>
                <div class="price">${productPrice}</div> <!-- Only show individual price, don't multiply by quantity here -->
                <div class="quantity">
                    <span class="minus">-</span>
                    <span class="quantity-value">1</span>
                    <span class="plus">+</span>
                </div>
            `;

            listCard.appendChild(cartItem);

            const minusButton = cartItem.querySelector(".minus");
            const plusButton = cartItem.querySelector(".plus");
            const priceElement = cartItem.querySelector(".price");

            minusButton.addEventListener("click", () => {
                const quantityValue = cartItem.querySelector(".quantity-value");
                const quantity = parseInt(quantityValue.textContent);

                if (quantity > 1) {
                    quantityValue.textContent = quantity - 1;
                    priceElement.textContent = `$${(productPrice * (quantity - 1)).toFixed(2)}`;
                } else {
                    listCard.removeChild(cartItem);
                }
                updateCartSummary(); // Recalculate the total when quantity changes
            });

            plusButton.addEventListener("click", () => {
                const quantityValue = cartItem.querySelector(".quantity-value");
                const quantity = parseInt(quantityValue.textContent);

                quantityValue.textContent = quantity + 1;
                priceElement.textContent = `$${(productPrice * (quantity+1)).toFixed(2)}`;
                updateCartSummary(); // Recalculate the total when quantity changes
            });
        }

        // Show the cart tab when a product is added
        cartTab.classList.add("active");

        // Update the cart summary after adding the product
        updateCartSummary();
    };

    // Add event listeners to all "Add to Cart" buttons
    productCards.forEach((card) => {
        const button = card.querySelector("button");
        const productName = card.querySelector("h3").textContent;
        const productPrice = parseFloat(card.querySelector("p").textContent.replace('$', '')); // Convert price to number
        const productImage = card.querySelector("img").src;

        button.addEventListener("click", () => {
            addToCart(productName, productPrice, productImage);
        });
    });

    // Function to update the cart summary and total amount
    const updateCartSummary = () => {
        const cartItems = Array.from(listCard.children);
        let totalAmount = 0;
        let cartSummary = "";

        // Build cart summary and calculate total
        cartItems.forEach((item) => {
            const productName = item.querySelector(".name").textContent;
            const productPrice = parseFloat(item.querySelector(".price").textContent.replace('$', ''));
            const quantity = parseInt(item.querySelector(".quantity-value").textContent);

            // Calculate total price per item based on quantity
            totalAmount += productPrice;
            cartSummary += `<div>${productName} (x${quantity}) - $${(productPrice).toFixed(2)}</div>`;
        });

        // Update the cart summary inside the cart box
        if (cartSummaryContainer) {
            cartSummaryContainer.innerHTML = `
                <h3>Cart Summary</h3>
                <div class="cart-items">
                    ${cartSummary}
                </div>
                <div class="total-amount">
                    <strong>Total: $${totalAmount.toFixed(2)}</strong>
                </div>
                <button class="checkout-btn">Proceed to Checkout</button>
            `;
        }
    };

    // Checkout functionality
    checkoutButton.addEventListener("click", () => {
        const cartItems = Array.from(listCard.children);
        let totalAmount = 0;
        let cartSummary = "";

        // Build cart summary and calculate total
        cartItems.forEach((item) => {
            const productName = item.querySelector(".name").textContent;
            const productPrice = parseFloat(item.querySelector(".price").textContent.replace('$', ''));
            const quantity = parseInt(item.querySelector(".quantity-value").textContent);

            // Calculate total price per item based on quantity
            totalAmount += productPrice ;
            cartSummary += `<div>${productName} (x${quantity}) - $${(productPrice).toFixed(2)}</div>`;
        });

        // If there are items in the cart, display a checkout summary
        if (cartItems.length > 0) {
            const checkoutMessage = `
                Your Cart Summary:\n\n
                ${cartSummary}
                \nTotal: $${totalAmount.toFixed(2)}
                \nProceeding to checkout...
            `;
            alert(checkoutMessage); // You can replace this with a modal or new page for checkout
            // Here you can redirect to a payment page or call your backend to process payment
        } else {
            alert("Your cart is empty. Please add products before proceeding.");
        }
    });
});

// login.js

document.querySelector('.login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting immediately

    // No logic, just redirect after submission
    window.location.href = 'index.html'; // Redirect to the index page
});

// signup.js

document.querySelector('.signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting immediately

    // No logic, just redirect after submission
    window.location.href = 'index.html'; // Redirect to login page after signup
});
