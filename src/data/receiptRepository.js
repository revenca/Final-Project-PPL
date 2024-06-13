const db = require('../infrastructure/db');

const receiptRepository = {
    getNextReceiptId: function(callback) {
        db.get(`SELECT COALESCE(MAX(receiptId), 0) + 1 AS nextId FROM receipts`, [], (err, row) => {
            if (err) return callback(err);
            callback(null, row.nextId);
        });
    },
    save: function(receiptData, callback) {
        const { receiptId, items, subtotal, ppn, total, orderType, paymentMethod, date } = receiptData;
        db.run(`INSERT INTO receipts (receiptId, items, subtotal, ppn, total, orderType, paymentMethod, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
            [receiptId, JSON.stringify(items), subtotal, ppn, total, orderType, paymentMethod, date], callback);
    },
    getById: function(receiptId, callback) {
        db.get(`SELECT * FROM receipts WHERE receiptId = ?`, [receiptId], (err, row) => {
            if (err) return callback(err);
            callback(null, row);
        });
    }
};

module.exports = receiptRepository;
