// Cart functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.updateCartCount();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showAddToCartNotification(product.name);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartCount();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }

    updateCartCount() {
        const cartIcon = document.querySelector('.cart-count');
        const count = this.getItemCount();
        
        if (cartIcon) {
            cartIcon.textContent = count > 0 ? count : '';
            cartIcon.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }

    showAddToCartNotification(productName) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="check-icon">✓</span>
                <span>${productName} added to cart!</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Search functionality
class ProductSearch {
    constructor() {
        this.products = [
            { id: 1, name: "Elegant Evening Dress", price: 299, category: "evening", image: "IMG-20250815-WA0022.jpg" },
            { id: 2, name: "Semi-Formal Blouse", price: 149, category: "semi-formal", image: "IMG-20250815-WA0027.jpg" },
            { id: 3, name: "Casual Summer Dress", price: 89, category: "casual", image: "IMG-20250815-WA0023.jpg" },
            { id: 4, name: "Business Blazer", price: 199, category: "formal", image: "IMG-20250815-WA0024.jpg" },
            { id: 5, name: "Bridal Gown", price: 599, category: "bridal", image: "IMG-20250815-WA0025.jpg" },
            { id: 6, name: "Sport Leggings", price: 59, category: "sportswear", image: "IMG-20250815-WA0026.jpg" }
        ];
        this.initializeSearch();
    }

    initializeSearch() {
        // Create search overlay
        this.createSearchOverlay();
        
        // Add event listeners
        const searchIcon = document.querySelector('.search-icon');
        const searchClose = document.querySelector('.search-close');
        const searchInput = document.querySelector('.search-input');
        
        if (searchIcon) {
            searchIcon.addEventListener('click', () => this.openSearch());
        }
        
        if (searchClose) {
            searchClose.addEventListener('click', () => this.closeSearch());
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }
        
        // Close search with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSearch();
            }
        });
    }

    createSearchOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'search-overlay';
        overlay.innerHTML = `
            <div class="search-container">
                <div class="search-header">
                    <input type="text" class="search-input" placeholder="Search for products...">
                    <button class="search-close">×</button>
                </div>
                <div class="search-results"></div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }

    openSearch() {
        const overlay = document.querySelector('.search-overlay');
        const input = document.querySelector('.search-input');
        
        if (overlay && input) {
            overlay.classList.add('active');
            setTimeout(() => input.focus(), 100);
        }
    }

    closeSearch() {
        const overlay = document.querySelector('.search-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    }

    handleSearch(query) {
        const resultsContainer = document.querySelector('.search-results');
        
        if (!query.trim()) {
            resultsContainer.innerHTML = '<div class="no-results">Start typing to search products...</div>';
            return;
        }
        
        const filteredProducts = this.products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        
        if (filteredProducts.length === 0) {
            resultsContainer.innerHTML = '<div class="no-results">No products found</div>';
            return;
        }
        
        resultsContainer.innerHTML = filteredProducts.map(product => `
            <div class="search-result-item" onclick="cart.addItem(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                <img src="${product.image}" alt="${product.name}">
                <div class="result-info">
                    <h4>${product.name}</h4>
                    <p class="category">${product.category}</p>
                    <p class="price">R${product.price}</p>
                </div>
                <button class="add-to-cart-btn">Add to Cart</button>
            </div>
        `).join('');
    }
}

// Initialize cart and search when DOM is loaded
let cart, search;

document.addEventListener('DOMContentLoaded', function() {
    cart = new ShoppingCart();
    search = new ProductSearch();
});

// Helper function to add products to cart from product pages
function addToCart(productId, productName, productPrice, productImage) {
    const product = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage
    };
    
    if (cart) {
        cart.addItem(product);
    }
}