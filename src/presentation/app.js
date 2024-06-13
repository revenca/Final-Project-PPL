import productService from '../application/productService.js';

$(document).ready(function() {
    const menuList = $('#menu-list');

    function updateMenu(products) {
        menuList.empty();
        products.forEach(product => {
            menuList.append(`
                <tr data-id="${product.id}">
                    <td>${product.name}</td>
                    <td>${product.id}</td>
                    <td>Rp. ${product.price}</td>
                    <td><button class="delete-product">Delete</button></td>
                </tr>
            `);
        });
    }

    async function fetchProducts() {
        try {
            const products = await productService.getProducts();
            updateMenu(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    // Define this function to be called from admin window
    window.refreshMenuList = fetchProducts;

    fetchProducts();

    $('#admin-button').click(function() {
        window.location.href = '/admin'; // Direct navigation
    });

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
            $('#bill-list').append(`
                <tr>
                    <td>${productName}</td>
                    <td class="qty">${qty}</td>
                    <td class="price">Rp. ${productPrice}</td>
                </tr>
            `);
            updateBill();
        }
    });

    menuList.on('click', 'tr', function() {
        menuList.find('tr').removeClass('selected');
        $(this).addClass('selected');
    });

    menuList.on('click', '.delete-product', async function(e) {
        e.stopPropagation();
        const productId = $(this).closest('tr').data('id');

        try {
            await productService.deleteProduct(productId);
            fetchProducts(); // Refresh menu list
        } catch (error) {
            alert('Error deleting product: ' + error.message);
        }
    });

    function updateBill() {
        let subtotal = 0;
        $('#bill-list tr').each(function() {
            const qty = parseInt($(this).find('.qty').text());
            const price = parseInt($(this).find('.price').text().replace('Rp. ', ''));
            subtotal += qty * price;
        });

        const ppn = subtotal * 0.1;
        const total = subtotal + ppn;

        $('#subtotal').text(subtotal);
        $('#ppn').text(ppn);
        $('#total').text(total);
    }

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

    // Set current date
    const dateElement = $('#current-date');
    const currentDate = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    dateElement.text(currentDate.toLocaleDateString('id-ID', options));
});
