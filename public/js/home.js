document.addEventListener('DOMContentLoaded', function () {
    const inpSearch = document.querySelectorAll('.search_inp');
    const search_btn = document.querySelectorAll('.search_btn');
    const product_box = document.querySelector('.product_box');
    var helpBox = document.querySelector('.helpBoxOne');
    let debounceTimeout;
    const debounceDelay = 300;

    function searchProducts() {
        search_btn.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                var inpValue = inpSearch[index].value.trim().toUpperCase();

                fetch('/api/products')
                    .then(res => {
                        if (!res.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return res.json();
                    })
                    .then(data => {
                        product_box.innerHTML = '';

                        data.forEach(product => {
                            if (product.productName && product.productName.toUpperCase().includes(inpValue)) {
                                var cardProduct = `
                                    <div class="product_card" data-id="${product._id}">
                                        <img src="${product.img}" class="product_img" alt="${product.productName}">
                                        <div class="product_details">
                                            <h5 class="product_name">${product.productName}</h5>
                                            <p class="product_size">Size: ${product.size}</p>
                                            <div class="pro_contact"><button class="whatsappButton">Məlumat Üçün</button></div>
                                        </div>
                                    </div>
                                `;
                                product_box.innerHTML += cardProduct;
                            }
                        });

                        // Ürün kartlarına tıklama olayı ekleme
                        document.querySelectorAll('.product_card').forEach(card => {
                            card.addEventListener('click', () => {
                                const productId = card.getAttribute('data-id');
                                window.location.href = `/productDetails/${productId}`; // Detay sayfasına yönlendirme
                            });
                        });
                    })
                    .catch(error => {
                        console.error('Ürünler alınırken hata oluştu', error);
                    });
            });
        });
    }
    searchProducts();

    function debounceFetch() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(fetchProducts, debounceDelay);
    }

    function fetchProducts() {
        helpBox.innerHTML = '';
        let uniqueProducts = new Set();

        inpSearch.forEach(input => {
            let inpHelpVal = input.value.trim().toUpperCase();

            if (inpHelpVal === '') {
                helpBox.style.display = 'none';
                return;
            }

            fetch('/api/products')
                .then(res => res.json())
                .then(data => {
                    data.forEach(product => {
                        if (product.productName) {
                            const productName = product.productName.toUpperCase();
                            if (productName.startsWith(inpHelpVal) && !uniqueProducts.has(productName)) {
                                uniqueProducts.add(productName);

                                let helpSpan = document.createElement('span');
                                helpSpan.classList.add('helpSpan');
                                helpSpan.textContent = product.productName;
                                helpSpan.addEventListener('click', function () {
                                    input.value = product.productName;
                                    helpBox.style.display = 'none';
                                });
                                helpBox.appendChild(helpSpan);
                            }
                        }
                    });

                    if (helpBox.children.length === 0) {
                        helpBox.style.display = 'none';
                    } else {
                        helpBox.style.display = 'flex';
                    }
                })
                .catch(err => {
                    console.error('Error fetching products:', err);
                });
        });
    }

    inpSearch.forEach(input => {
        input.addEventListener('input', debounceFetch);
    });

    document.querySelectorAll('.product_card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = card.getAttribute('data-id');
            window.location.href = `productDetails/${productId}`; // Redirect to product details page
        });
    });

    const productLinks = document.querySelectorAll('.product_link');
    productLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const category = e.target.getAttribute('data-category');
            try {
                const response = await fetch(`/api/category/${category}`);
                const products = await response.json();
                displayProducts(products);
            } catch (error) {
                console.error('Kategoriye göre ürünler getirilirken hata oluştu:', error);
            }
        });
    });

    function displayProducts(products) {
        const productBox = document.querySelector('.product_box');
        productBox.innerHTML = '';
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product_card');
            productCard.dataset.id = product._id;

            const productImg = document.createElement('img');
            productImg.src = product.img;
            productImg.alt = product.productName;
            productImg.classList.add('product_img');

            const productDetails = document.createElement('div');
            productDetails.classList.add('product_details');

            const productName = document.createElement('h5');
            productName.classList.add('product_name');
            productName.textContent = product.productName;

            const productSize = document.createElement('p');
            productSize.classList.add('product_size');
            productSize.textContent = `Size: ${product.size}`;

            const proContact = document.createElement('div');
            proContact.classList.add('pro_contact');

            const whatsappButton = document.createElement('button');
            whatsappButton.classList.add('whatsappButton');
            whatsappButton.textContent = 'Məlumat Üçün';

            proContact.appendChild(whatsappButton);
            productDetails.appendChild(productName);
            productDetails.appendChild(productSize);
            productDetails.appendChild(proContact);
            productCard.appendChild(productImg);
            productCard.appendChild(productDetails);
            productBox.appendChild(productCard);
        });

        // Ürün kartlarına tıklama olayı ekleme
        document.querySelectorAll('.product_card').forEach(card => {
            card.addEventListener('click', () => {
                const productId = card.getAttribute('data-id');
                window.location.href = `/productDetails/${productId}`; // Detay sayfasına yönlendirme
            });
        });
    }
});
var story_btn = document.querySelectorAll('.story_btn');
var story_section = document.querySelector('.story_section');
var fa_xmark = document.querySelector('.close_stoyr');
var container = document.querySelector('.container');
var close_story = document.querySelector('.close_story');

//*Story Side
story_btn.forEach(btn => {
    btn.addEventListener('click', () => {
        story_section.style.display = 'flex';
        story_section.style.position = 'fixed';

    });
});
close_story.addEventListener('click', () => {
    story_section.style.display = 'none';
    story_section.style.position = 'static';
});

var textstyle = document.querySelector('.textstyle').style.color='white';
var textstyle = document.querySelector('.textstyle').style.fontSize='20px';
