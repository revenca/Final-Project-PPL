import { productService } from '../application/productService.js';
import { calculateBill } from '../business/billCalculator.js';
import { receiptService } from '../application/receiptService.js';

$(document).ready(function() {
    const menuList = $('#menu-list');
    const billList = $('#bill-list');
    const subtotalElem = $('#subtotal');
    const ppnElem = $('#ppn');
    const totalElem = $('#total');

    async function fetchProducts() {
        try {
            const products = await productService.getProducts();
            updateMenu(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    function updateMenu(products) {
        menuList.empty();
        products.forEach(product => {
            menuList.append(`
                <tr data-id="${product.id}" data-category="${product.category}">
                    <td>${product.name}</td>
                    <td>${product.id}</td>
                    <td>Rp. ${product.price}</td>
                </tr>
            `);
        });
    }

    function updateBill() {
        const billItems = [];
        billList.find('tr').each(function() {
            const qty = parseInt($(this).find('.qty').text());
            const price = parseInt($(this).find('.price').text().replace('Rp. ', ''));
            billItems.push({ qty, price });
        });

        const { subtotal, ppn, total } = calculateBill(billItems);
        subtotalElem.text(subtotal);
        ppnElem.text(ppn);
        totalElem.text(total);
    }

    $('.add-button').click(function() {
        const selectedRow = menuList.find('tr.selected');
        if (selectedRow.length === 0) {
            alert('Please select a product first.');
            return;
        }
        const productId = selectedRow.data('id');
        const productName = selectedRow.find('td:first-child').text();
        const productPrice = parseInt(selectedRow.find('td:nth-child(3)').text().replace('Rp. ', ''));
        const qty = parseInt($('.quantity-selector input').val());

        if (productId) {
            billList.append(`
                <tr>
                    <td>${productName}</td>
                    <td class="qty">${qty}</td>
                    <td class="price">Rp. ${productPrice}</td>
                    <td><button class="delete-bill-item">Delete</button></td>
                </tr>
            `);
            updateBill();
        }
    });

    menuList.on('click', 'tr', function() {
        menuList.find('tr').removeClass('selected');
        $(this).addClass('selected');
    });

    billList.on('click', '.delete-bill-item', function() {
        $(this).closest('tr').remove();
        updateBill();
    });

    $('.quantity-selector .decrease').click(function() {
        const input = $('.quantity-selector input');
        let value = parseInt(input.val());
        if (value > 1) {
            value--;
            input.val(value);
        }
    });

    $('.quantity-selector .increase').click(function() {
        const input = $('.quantity-selector input');
        let value = parseInt(input.val());
        value++;
        input.val(value);
    });

    $('.order-type').click(function() {
        $('.order-type').removeClass('active btn-primary').addClass('btn-secondary');
        $(this).addClass('active btn-primary').removeClass('btn-secondary');
    });

    $('.dropdown-item').click(function() {
        const paymentMethod = $(this).text();
        $('#paymentDropdown').text(paymentMethod);
    });

    $('#add-product-form').submit(async function(e) {
        e.preventDefault();
        const name = $('#product-name').val();
        const id = $('#product-id').val();
        const price = parseInt($('#product-price').val());
        const category = $('#product-category').val();

        try {
            await productService.addProduct({ name, id, price, category });
            $('#admin-panel').hide();
            fetchProducts();
        } catch (error) {
            alert('Error adding product: ' + error.message);
        }
    });

    $('#filter-all').click(function() {
        filterProducts('all');
    });

    $('#filter-coffee').click(function() {
        filterProducts('coffee');
    });

    $('#filter-non-coffee').click(function() {
        filterProducts('non-coffee');
    });

    $('#filter-food').click(function() {
        filterProducts('food');
    });

    function filterProducts(category) {
        if (category === 'all') {
            menuList.find('tr').show();
        } else {
            menuList.find('tr').each(function() {
                const productCategory = $(this).data('category');
                if (productCategory === category) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
    }

    $('.checkout-button').click(async function() {
        const billItems = [];
        $('#bill-list').find('tr').each(function() {
            const name = $(this).find('td:nth-child(1)').text();
            const qty = parseInt($(this).find('.qty').text());
            const price = parseInt($(this).find('.price').text().replace('Rp. ', ''));
            billItems.push({ name, qty, price });
        });

        const subtotal = parseInt($('#subtotal').text());
        const ppn = parseInt($('#ppn').text());
        const total = parseInt($('#total').text());
        const orderType = $('.order-type.active').text();
        const paymentMethod = $('#paymentDropdown').text();
        const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

        const receiptId = await generateReceiptId();

        const receiptData = {
            receiptId,
            items: billItems,
            subtotal,
            ppn,
            total,
            orderType,
            paymentMethod,
            date
        };

        await receiptService.addOrder(receiptData);

        window.location.href = `receipt.html?receiptId=${receiptId}`;
    });

    async function generateReceiptId() {
        try {
            const response = await fetch('http://localhost:3000/api/receipt-id');
            const data = await response.json();
            return data.receiptId;
        } catch (error) {
            console.error('Error generating receipt ID:', error);
            return null;
        }
    }

    fetchProducts();
});

