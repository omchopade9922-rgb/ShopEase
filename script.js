
// ShopEase Product Data

const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 1299,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "Electronics",
        price: 1899,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
    },
    {
        id: 3,
        name: "Classic Backpack",
        category: "Accessories",
        price: 899,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    },
    {
        id: 4,
        name: "Running Shoes",
        category: "Fashion",
        price: 1599,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
    },
    {
        id: 5,
        name: "Sunglasses",
        category: "Accessories",
        price: 599,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500"
    },
    {
        id: 6,
        name: "Camera",
        category: "Electronics",
        price: 2499,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500"
    },
    {
        id: 7,
        name: "Travel Bottle",
        category: "Lifestyle",
        price: 399,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500"
    },
    {
        id: 8,
        name: "Desk Lamp",
        category: "Home",
        price: 749,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500"
    }
];

// Display Products

const productList = document.getElementById("product-list");

function displayProducts() {
    productList.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">

            <div class="product-info">
                <small>${product.category}</small>
                <h3>${product.name}</h3>
                <p>₹${product.price.toLocaleString("en-IN")}</p>

                <button class="add-btn" data-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join("");
}

displayProducts();

// Shopping Cart

let cart = JSON.parse(localStorage.getItem("shopEaseCart")) || {};

// Save Cart
function saveCart() {
    localStorage.setItem("shopEaseCart", JSON.stringify(cart));
}

// Add Product to Cart
function addToCart(id) {
    if (cart[id]) {
        cart[id]++;
    } else {
        cart[id] = 1;
    }

    saveCart();
    updateCart();
}

// Update Cart Count
function updateCart() {
    const cartCount = document.getElementById("cart-count");

    const totalItems = Object.values(cart).reduce(
        (sum, quantity) => sum + quantity, 0
    );

    cartCount.textContent = totalItems;
}

// Add Button Click Event
productList.addEventListener("click", function(event) {
    if (event.target.classList.contains("add-btn")) {
        const id = Number(event.target.dataset.id);

        addToCart(id);

        event.target.textContent = "Added ✓";

        setTimeout(() => {
            event.target.textContent = "Add to Cart";
        }, 1000);
    }
});

// Load Saved Cart
updateCart();

// Display Shopping Cart

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    let subtotal = 0;

    const cartProducts = Object.keys(cart);

    if (cartProducts.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty. Start shopping!</p>";
        cartTotal.textContent = "Total: ₹0";
        return;
    }

    cartItems.innerHTML = cartProducts.map(id => {
        const product = products.find(p => p.id === Number(id));
        const quantity = cart[id];
        const itemTotal = product.price * quantity;

        subtotal += itemTotal;

        return `
            <div class="cart-item">
                <div>
                    <h3>${product.name}</h3>
                    <p>₹${product.price.toLocaleString("en-IN")} × ${quantity}</p>
                    <strong>₹${itemTotal.toLocaleString("en-IN")}</strong>
                </div>

                <div class="quantity-controls">
                    <button onclick="changeQuantity(${id}, -1)">−</button>
                    <span>${quantity}</span>
                    <button onclick="changeQuantity(${id}, 1)">+</button>
                    <button class="remove-btn"
                        onclick="removeItem(${id})">Remove</button>
                </div>
            </div>
        `;
    }).join("");

    const delivery = subtotal > 0 && subtotal < 500 ? 40 : 0;
    const total = subtotal + delivery;

    cartTotal.innerHTML = `
        Subtotal: ₹${subtotal.toLocaleString("en-IN")}<br>
        Delivery: ₹${delivery}<br>
        Grand Total: ₹${total.toLocaleString("en-IN")}
    `;
}

// Change Quantity

function changeQuantity(id, delta) {
    cart[id] += delta;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    saveCart();
    updateCart();
    renderCart();
}

// Remove Product

function removeItem(id) {
    delete cart[id];

    saveCart();
    updateCart();
    renderCart();
}

// Update Existing Functions

const originalUpdateCart = updateCart;

updateCart = function() {
    originalUpdateCart();
    renderCart();
};

// Initial Cart Display
renderCart();

/* Checkout Preview */

const checkoutBtn = document.getElementById("checkout-btn");
const checkoutModal = document.getElementById("checkout-modal");
const checkoutDetails = document.getElementById("checkout-details");
const closeModal = document.getElementById("close-modal");

checkoutBtn.addEventListener("click", function() {
    if (Object.keys(cart).length === 0) {
        alert("Your cart is empty. Please add some products first.");
        return;
    }

    let subtotal = 0;

    const orderItems = Object.keys(cart).map(id => {
        const product = products.find(p => p.id === Number(id));
        const quantity = cart[id];
        const itemTotal = product.price * quantity;

        subtotal += itemTotal;

        return `
            <div class="checkout-item">
                <span>${product.name} × ${quantity}</span>
                <span>₹${itemTotal.toLocaleString("en-IN")}</span>
            </div>
        `;
    }).join("");

    const delivery = subtotal > 0 && subtotal < 500 ? 40 : 0;
    const total = subtotal + delivery;

    checkoutDetails.innerHTML = `
        ${orderItems}

        <hr>

        <div class="checkout-item">
            <span>Subtotal</span>
            <span>₹${subtotal.toLocaleString("en-IN")}</span>
        </div>

        <div class="checkout-item">
            <span>Delivery</span>
            <span>₹${delivery.toLocaleString("en-IN")}</span>
        </div>

        <h3 class="checkout-total">
            Total: ₹${total.toLocaleString("en-IN")}
        </h3>
    `;

    checkoutModal.showModal();
});

closeModal.addEventListener("click", function() {
    checkoutModal.close();
});
