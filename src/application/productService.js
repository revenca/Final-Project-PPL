const productService = {
    async getProducts() {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error('Failed to load products');
        }
        return response.json();
    },

    async addProduct(product) {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add product');
        }
    },

    async deleteProduct(productId) {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete product');
        }
    }
};

module.exports = productService;
