const db = require('../infrastructure/db');

const productRepository = {
    getAll: function(callback) {
        db.all(`SELECT * FROM products`, [], callback);
    },
    add: function(product, callback) {
        const { id, name, price, category } = product;
        db.run(`INSERT INTO products (id, name, price, category) VALUES (?, ?, ?, ?)`,
            [id, name, price, category], callback);
    },
    delete: function(productId, callback) {
        db.run(`DELETE FROM products WHERE id = ?`, [productId], callback);
    }
};

module.exports = productRepository;
