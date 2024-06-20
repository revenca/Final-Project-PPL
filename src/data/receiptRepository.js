const db = require('../infrastructure/db').db;

const receiptRepository = {
    getNextReceiptId: (callback) => {
        const sql = `SELECT MAX(receiptId) as receiptId FROM receipts`;
        db.get(sql, [], (err, row) => {
            if (err) {
                callback(err);
            } else {
                const nextId = row.receiptId ? row.receiptId + 1 : 1;
                callback(null, nextId);
            }
        });
    },
    save: (receipt, callback) => {
        const sql = `INSERT INTO receipts (receiptId, items, subtotal, ppn, total, orderType, paymentMethod, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [receipt.receiptId, receipt.items, receipt.subtotal, receipt.ppn, receipt.total, receipt.orderType, receipt.paymentMethod, receipt.date];
        db.run(sql, params, (err) => {
            callback(err);
        });
    },
    getById: (id, callback) => {
        const sql = `SELECT * FROM receipts WHERE receiptId = ?`;
        db.get(sql, [id], (err, row) => {
            callback(err, row);
        });
    }
};

module.exports = receiptRepository;
