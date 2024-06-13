const db = require('../infrastructure/db');

const productRepository = {
    add: (product, callback) => {
        const { id, name, price } = product;
        const sql = 'INSERT INTO products (id, name, price) VALUES (?, ?, ?)';
        db.run(sql, [id, name, price], callback);
    },

    getAll: (callback) => {
        const sql = 'SELECT * FROM products';
        db.all(sql, [], callback);
    },

    delete: (id, callback) => {
        const sql = 'DELETE FROM products WHERE id = ?';
        db.run(sql, [id], callback);
    }
};

module.exports = productRepository;
