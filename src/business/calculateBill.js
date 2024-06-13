// calculateBill.js
function calculateBill(billItems) {
    let subtotal = 0;
    billItems.forEach(item => {
        subtotal += item.qty * item.price;
    });
    const ppn = subtotal * 0.1; // PPN is calculated as 10% of the subtotal
    const total = subtotal + ppn; // Total includes the subtotal and PPN
    return { subtotal, ppn, total };
}

export default calculateBill;
