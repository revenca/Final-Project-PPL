export const receiptService = {
    getOrder: async function(receiptId) {
        const response = await fetch(`http://localhost:3000/api/receipts/${receiptId}`);
        if (!response.ok) throw new Error('Failed to fetch receipt');
        return response.json();
    },
    addOrder: async function(receiptData) {
        const response = await fetch('http://localhost:3000/api/receipts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(receiptData)
        });
        if (!response.ok) throw new Error('Failed to add receipt');
        return response.json();
    }
};
