const productService = {
    getProducts: async function() {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
    },
    addProduct: async function(product) {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        if (!response.ok) throw new Error('Failed to add product');
        return response.json();
    },
    deleteProduct: async function(productId) {
        const response = await fetch(`/api/products/${productId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete product');
        return response.json();
    }
};

export default productService;
