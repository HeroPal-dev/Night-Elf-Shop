// Обработчики для мобильного меню
document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (burgerMenu && mobileMenu) {
        // Обработчик клика по бургер-меню
        burgerMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            burgerMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Закрытие мобильного меню при клике вне его
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !burgerMenu.contains(e.target)) {
                burgerMenu.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    }
});

// Обработчики для выбора валюты
const desktopCurrencyBtn = document.getElementById('currencyBtn');
const mobileCurrencyBtn = document.getElementById('mobileCurrencyBtn');
const desktopCurrencyDropdown = document.getElementById('currencyDropdown');
const mobileCurrencyDropdown = document.getElementById('mobileCurrencyDropdown');

if (desktopCurrencyBtn && desktopCurrencyDropdown) {
    desktopCurrencyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        desktopCurrencyDropdown.classList.toggle('show');
        if (mobileCurrencyDropdown) {
            mobileCurrencyDropdown.classList.remove('show');
        }
    });
}

if (mobileCurrencyBtn && mobileCurrencyDropdown) {
    mobileCurrencyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileCurrencyDropdown.classList.toggle('show');
        if (desktopCurrencyDropdown) {
            desktopCurrencyDropdown.classList.remove('show');
        }
    });
}

// Закрытие дропдаунов при клике вне них
document.addEventListener('click', (e) => {
    if (!desktopCurrencyBtn?.contains(e.target) && !mobileCurrencyBtn?.contains(e.target)) {
        if (desktopCurrencyDropdown) {
            desktopCurrencyDropdown.classList.remove('show');
        }
        if (mobileCurrencyDropdown) {
            mobileCurrencyDropdown.classList.remove('show');
        }
    }
});

// Обработка выбора валюты
document.querySelectorAll('.currency-option').forEach(option => {
    option.addEventListener('click', () => {
        const currency = option.dataset.currency;
        const symbol = option.dataset.symbol;
        const rate = parseFloat(option.dataset.rate);

        // Обновление отображаемой валюты
        document.querySelectorAll('.current-currency').forEach(el => {
            el.textContent = currency;
        });

        // Обновление символа валюты
        document.querySelectorAll('.currency-symbol').forEach(symbolEl => {
            symbolEl.textContent = symbol;
        });

        // Обновление цен
        document.querySelectorAll('.price-value').forEach(priceEl => {
            const originalPrice = parseFloat(priceEl.dataset.originalPrice || priceEl.textContent);
            if (!priceEl.dataset.originalPrice) {
                priceEl.dataset.originalPrice = originalPrice;
            }
            const newPrice = (originalPrice * rate).toFixed(2);
            priceEl.textContent = newPrice;
        });

        // Обновление цен в корзине
        document.querySelectorAll('.basket-item-price').forEach(priceEl => {
            const originalPrice = parseFloat(priceEl.dataset.basePrice);
            const quantity = parseInt(priceEl.dataset.quantity || 1);
            const newPrice = (originalPrice * rate * quantity).toFixed(2);
            priceEl.innerHTML = `<span class="currency-symbol">${symbol}</span>${newPrice}`;
        });

        // Обновление общей суммы в корзине
        const summaryTotal = document.querySelector('.summary-total');
        if (summaryTotal) {
            const items = document.querySelectorAll('.basket-item-price');
            let total = 0;
            items.forEach(item => {
                const price = parseFloat(item.dataset.basePrice);
                const quantity = parseInt(item.dataset.quantity || 1);
                total += price * quantity;
            });
            total = (total * rate).toFixed(2);
            summaryTotal.innerHTML = `<span class="currency-symbol">${symbol}</span>${total}`;
        }

        // Закрытие дропдаунов
        const dropdowns = document.querySelectorAll('.currency-dropdown');
        dropdowns.forEach(dropdown => dropdown.classList.remove('show'));

        // Сохранение выбранной валюты
        localStorage.setItem('selectedCurrency', currency);
        localStorage.setItem('selectedSymbol', symbol);
        localStorage.setItem('selectedRate', rate);
    });
});

// Загрузка сохраненной валюты при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    const savedSymbol = localStorage.getItem('selectedSymbol');
    const savedRate = localStorage.getItem('selectedRate');

    if (savedCurrency && savedSymbol && savedRate) {
        // Обновление отображаемой валюты
        document.querySelectorAll('.current-currency').forEach(el => {
            el.textContent = savedCurrency;
        });

        // Обновление цен
        document.querySelectorAll('.price-value').forEach(priceEl => {
            // Получаем оригинальную цену в USD
            const originalPrice = parseFloat(priceEl.dataset.originalPrice || priceEl.textContent);
            // Если оригинальная цена не сохранена, сохраняем её
            if (!priceEl.dataset.originalPrice) {
                priceEl.dataset.originalPrice = originalPrice;
            }
            // Пересчитываем цену с учетом курса
            const newPrice = originalPrice * parseFloat(savedRate);
            priceEl.textContent = newPrice.toFixed(2);
        });

        // Обновление символа валюты
        document.querySelectorAll('.currency-symbol').forEach(symbolEl => {
            symbolEl.textContent = savedSymbol;
        });
    }
});

// настройки для наблюдателя за пересечением элементов
const observerOptions = {
    threshold: 0.1 // порог видимости элемента для срабатывания
};

// создаем наблюдатель за появлением элементов в viewport
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// добавляем анимацию появления для карточек товаров и элементов футера
document.querySelectorAll('.product-card, .footer-link, .social-icon, .payment-icon').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// настраиваем плавный скролл для якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// функция анимации изменения цены
const animatePrice = (element) => {
    const price = parseFloat(element.textContent);
    let current = 0;
    const duration = 1000; // длительность анимации в миллисекундах
    const steps = 60; // количество шагов анимации
    const increment = price / steps; // величина изменения на каждом шаге
    const stepTime = duration / steps; // время одного шага

    const timer = setInterval(() => {
        current += increment;
        if (current >= price) {
            element.textContent = price.toFixed(2);
            clearInterval(timer);
        } else {
            element.textContent = current.toFixed(2);
        }
    }, stepTime);
};

// добавляем анимацию цен при появлении карточек
document.querySelectorAll('.price-value').forEach(price => {
    observer.observe(price);
    price.addEventListener('animationend', () => {
        animatePrice(price);
    });
});

// Инициализация корзины
let cart;

// Инициализация компонентов при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // инициализация корзины
    if (!cart) {
        cart = new ShoppingCart();
    }
    
    // инициализация фильтра товаров
    new ProductFilter();
    
    // инициализация страницы товара, если она существует
    if (document.querySelector('.product-page')) {
        const productPage = new ProductPage();
        productPage.init();
    }
});

// класс для управления корзиной покупок
class ShoppingCart {
    constructor() {
        // инициализация состояния корзины
        this.items = JSON.parse(localStorage.getItem('cartItems')) || [];
        this.currentRate = parseFloat(localStorage.getItem('currentRate')) || 1;
        this.currentSymbol = localStorage.getItem('currentSymbol') || '$';
        this.init();
    }

    // инициализация корзины
    init() {
        this.renderCart();
        this.updateCartCount();
        this.setupEventListeners();
    }

    // настройка обработчиков событий
    setupEventListeners() {
        // обработчик для кнопок добавления в корзину
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const productCard = e.target.closest('.product-card');
                const productId = productCard.dataset.id;

                // загрузка данных о товаре
                try {
                    const response = await fetch('products.json');
                    const data = await response.json();
                    const productData = data.products[productId];

                    // создание объекта товара
                    const product = {
                        id: productId,
                        title: productCard.querySelector('.product-title').textContent,
                        price: parseFloat(productCard.dataset.price),
                        image: productCard.querySelector('.product-image').src,
                        description: productData.description.overview,
                        publisher: productData.publisher,
                        genres: productData.genres.join(', ')
                    };

                    // добавление товара в корзину
                    this.addItem(product);

                    // анимация кнопки при клике
                    const button = e.target;
                    button.classList.add('clicked');
                    const ripple = document.createElement('div');
                    ripple.classList.add('ripple');
                    button.appendChild(ripple);

                    // удаление эффекта анимации
                    setTimeout(() => {
                        ripple.remove();
                        button.classList.remove('clicked');
                    }, 1000);
                } catch (error) {
                    console.error('Error loading product data:', error);
                }
            });
        });

        // обработчик клика по карточке товара
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function(e) {
                // проверяем, не был ли клик по кнопке корзины
                if (!e.target.classList.contains('add-to-cart')) {
                    const productId = this.dataset.id;
                    if (productId) {
                        window.location.href = `product.html?id=${productId}`;
                    }
                }
            });
        });

        // обработчик изменения валюты
        document.addEventListener('currencyChanged', (e) => {
            this.currentRate = e.detail.rate;
            this.currentSymbol = e.detail.symbol;
            this.updatePrices();
        });
    }

    // показ уведомления
    showNotification(message) {
        // создание элемента уведомления
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // добавление на страницу
        document.body.appendChild(notification);
        
        // анимация появления
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // удаление через 3 секунды
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // добавление товара в корзину
    addItem(product) {
        // проверка наличия товара в корзине
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            // увеличение количества существующего товара
            existingItem.quantity += 1;
        } else {
            // добавление нового товара
            this.items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                description: product.description || 'Описание отсутствует',
                publisher: product.publisher || 'Не указан',
                genres: product.genres || 'Не указаны',
                quantity: 1
            });
        }
        
        // сохранение состояния корзины
        this.saveToLocalStorage();
        
        // обновление отображения
        this.renderCart();
        this.updateCartCount();
        
        // показ уведомления
        this.showNotification('Товар добавлен в корзину');
    }

    // удаление товара из корзины
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToLocalStorage();
        this.updateCartCount();
        this.renderCart();
    }

    // обновление количества товара
    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = newQuantity;
                this.saveToLocalStorage();
                this.renderCart();
            }
        }
    }

    // подсчет общей стоимости
    calculateTotal() {
        return this.items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    }

    // обновление счетчика товаров
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    // обновление цен при смене валюты
    updatePrices() {
        const total = this.calculateTotal() * this.currentRate;
        const summaryTotal = document.querySelector('.summary-total');
        if (summaryTotal) {
            summaryTotal.innerHTML = `
                <span class="currency-symbol">${this.currentSymbol}</span>
                ${total.toFixed(2)}
            `;
        }

        // обновление цен отдельных товаров
        document.querySelectorAll('.basket-item-price').forEach(priceElement => {
            const basePrice = parseFloat(priceElement.dataset.basePrice);
            const quantity = parseInt(priceElement.dataset.quantity);
            const convertedPrice = basePrice * this.currentRate * quantity;
            priceElement.innerHTML = `
                <span class="currency-symbol">${this.currentSymbol}</span>
                ${convertedPrice.toFixed(2)}
            `;
        });
    }

    // отрисовка содержимого корзины
    renderCart() {
        const basketItems = document.querySelector('.basket-items');
        const summaryTotal = document.querySelector('.summary-total');
        
        if (!basketItems || !summaryTotal) return;

        // если корзина пуста, показываем сообщение
        if (this.items.length === 0) {
            basketItems.innerHTML = '<div class="empty-cart">Ваша корзина пуста</div>';
            summaryTotal.innerHTML = `
                <span class="currency-symbol">${this.currentSymbol}</span>
                0.00
            `;
            return;
        }

        // формируем HTML для каждого товара в корзине
        basketItems.innerHTML = this.items.map(item => `
            <div class="basket-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.title}" class="basket-item-image">
                <div class="basket-item-info">
                    <div class="basket-item-title">${item.title}</div>
                    <div class="basket-item-details">
                        <div class="basket-item-publisher">Издатель: ${item.publisher || 'Не указан'}</div>
                        <div class="basket-item-genres">Жанры: ${item.genres || 'Не указаны'}</div>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus">-</button>
                        <span class="quantity">${item.quantity || 1}</span>
                        <button class="quantity-btn plus">+</button>
                    </div>
                </div>
                <div class="basket-item-price" data-base-price="${item.price}" data-quantity="${item.quantity || 1}">
                    <span class="currency-symbol">${this.currentSymbol}</span>
                    ${((item.price * (item.quantity || 1)) * this.currentRate).toFixed(2)}
                </div>
                <button class="basket-item-remove">✕</button>
            </div>
        `).join('');

        // обновляем общую сумму
        const total = this.calculateTotal() * this.currentRate;
        summaryTotal.innerHTML = `
            <span class="currency-symbol">${this.currentSymbol}</span>
            ${total.toFixed(2)}
        `;

        // добавляем обработчики для кнопок управления количеством
        basketItems.querySelectorAll('.basket-item').forEach(item => {
            const id = item.dataset.id;
            const product = this.items.find(p => p.id === id);

            // уменьшение количества
            item.querySelector('.minus').addEventListener('click', () => {
                if (product) this.updateQuantity(id, (product.quantity || 1) - 1);
            });

            // увеличение количества
            item.querySelector('.plus').addEventListener('click', () => {
                if (product) this.updateQuantity(id, (product.quantity || 1) + 1);
            });

            // удаление товара
            item.querySelector('.basket-item-remove').addEventListener('click', () => {
                this.removeItem(id);
            });
        });
    }

    // сохранение состояния корзины в localStorage
    saveToLocalStorage() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    }
}

// анимация иконок социальных сетей при наведении
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) scale(1.1)';
    });
    
    icon.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// обработка клика по кнопкам фильтров
document.querySelectorAll('.filter-button').forEach(button => {
    button.addEventListener('click', function() {
        // переключение активного состояния
        this.classList.toggle('active');
        
        // добавление эффекта пульсации
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        // удаление эффекта через 600мс
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// класс для работы со страницей товара
class ProductPage {
    constructor() {
        this.currentImageIndex = 0;
        this.productData = null;
    }

    // инициализация страницы товара
    async init() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        if (!productId) {
            console.error('Product ID not found in URL');
            return;
        }
        await this.loadProductData(productId);
        this.setupAddToCartButton();
    }

    // загрузка данных о товаре
    async loadProductData(productId) {
        try {
            const response = await fetch('products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.productData = data.products[productId];
            
            if (this.productData) {
                document.title = this.productData.title + " - Night Elf Shop";
                this.loadProductInfo();
                this.setupGallery();
                this.setupTabs();
                this.loadTabContent('description');
            } else {
                console.error('Product not found:', productId);
            }
        } catch (error) {
            console.error('Error loading product data:', error);
        }
    }

    // загрузка информации о товаре на страницу
    loadProductInfo() {
        const titleElement = document.querySelector('.product-title');
        const tagsContainer = document.querySelector('.product-tags');
        const priceElement = document.querySelector('.product-price');
        const genresElement = document.querySelector('.product-genres');
        const releaseDateElement = document.querySelector('.product-release-date');
        const publisherElement = document.querySelector('.product-publisher');
        const developerElement = document.querySelector('.product-developer');
        const interfaceLanguages = document.querySelector('.interface-languages');
        const voiceLanguages = document.querySelector('.voice-languages');

        // заполнение элементов данными
        if (titleElement) titleElement.textContent = this.productData.title;
        
        // создание тегов товара
        if (tagsContainer) {
            tagsContainer.innerHTML = '';
            this.productData.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
        }

        // заполнение остальной информации
        if (priceElement) priceElement.textContent = `${this.productData.price}$`;
        if (genresElement) genresElement.textContent = this.productData.genres.join(', ');
        if (releaseDateElement) releaseDateElement.textContent = this.productData.releaseDate;
        if (publisherElement) publisherElement.textContent = this.productData.publisher;
        if (developerElement) developerElement.textContent = this.productData.developer;
        if (interfaceLanguages) interfaceLanguages.textContent = this.productData.languages.interface.join(', ');
        if (voiceLanguages) voiceLanguages.textContent = this.productData.languages.voice.join(', ');
    }

    // настройка галереи изображений
    setupGallery() {
        const mainImage = document.querySelector('.main-image img');
        const thumbnailsContainer = document.querySelector('.thumbnails');
        const prevButton = document.querySelector('.prev-button');
        const nextButton = document.querySelector('.next-button');

        if (!mainImage || !thumbnailsContainer || !prevButton || !nextButton) {
            console.error('Gallery elements not found');
            return;
        }

        // установка главного изображения
        mainImage.src = this.productData.images[this.currentImageIndex];

        // создание миниатюр
        thumbnailsContainer.innerHTML = '';
        this.productData.images.forEach((image, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = image;
            thumbnail.className = index === this.currentImageIndex ? 'active' : '';
            thumbnail.addEventListener('click', () => this.changeImage(index));
            thumbnailsContainer.appendChild(thumbnail);
        });

        // обработчики для кнопок навигации
        prevButton.addEventListener('click', () => {
            this.changeImage(this.currentImageIndex - 1);
        });

        nextButton.addEventListener('click', () => {
            this.changeImage(this.currentImageIndex + 1);
        });
    }

    // смена изображения в галерее
    changeImage(index) {
        const mainImage = document.querySelector('.main-image img');
        const thumbnails = document.querySelectorAll('.thumbnails img');
        
        // обработка циклического переключения
        if (index < 0) {
            index = this.productData.images.length - 1;
        } else if (index >= this.productData.images.length) {
            index = 0;
        }
        
        // анимация смены изображения
        mainImage.classList.add('fade-out');
        
        setTimeout(() => {
            // обновление изображения
            mainImage.src = this.productData.images[index];
            mainImage.alt = `${this.productData.title} - изображение ${index + 1}`;
            
            // обновление активной миниатюры
            thumbnails.forEach((thumb, i) => {
                if (i === index) {
                    thumb.classList.add('active');
                } else {
                    thumb.classList.remove('active');
                }
            });
            
            // анимация появления нового изображения
            mainImage.classList.remove('fade-out');
            mainImage.classList.add('fade-in');
            
            setTimeout(() => {
                mainImage.classList.remove('fade-in');
            }, 600);
            
            this.currentImageIndex = index;
        }, 300);
    }

    // настройка вкладок с информацией
    setupTabs() {
        const tabs = document.querySelectorAll('.tab');
        if (!tabs.length) {
            console.error('Tabs not found');
            return;
        }

        // добавление обработчиков для вкладок
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // активация первой вкладки по умолчанию
        this.switchTab('description');
    }

    // переключение между вкладками
    switchTab(tabId) {
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');

        if (!tabs.length || !tabContents.length) return;

        // обновление активной вкладки
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-tab') === tabId) {
                tab.classList.add('active');
            }
        });

        // обновление активного содержимого
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.getAttribute('data-tab') === tabId) {
                content.classList.add('active');
            }
        });

        // загрузка содержимого вкладки
        this.loadTabContent(tabId);
    }

    // загрузка содержимого вкладки
    loadTabContent(tabId) {
        const content = document.querySelector(`.tab-content[data-tab="${tabId}"]`);
        if (!content || !this.productData) return;
        
        // заполнение содержимого в зависимости от типа вкладки
        switch(tabId) {
            case 'description':
                content.innerHTML = `
                    <h3>Описание</h3>
                    <p>${this.productData.description.overview}</p>
                    <h4>Особенности:</h4>
                    <ul>
                        ${this.productData.description.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                `;
                break;

            case 'requirements':
                content.innerHTML = `
                    <h3>Минимальные требования:</h3>
                    <ul>
                        ${Object.entries(this.productData.systemRequirements.minimum)
                            .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
                            .join('')}
                    </ul>
                    <h3>Рекомендуемые требования:</h3>
                    <ul>
                        ${Object.entries(this.productData.systemRequirements.recommended)
                            .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
                            .join('')}
                    </ul>
                `;
                break;

            case 'activation':
                content.innerHTML = `
                    <h3>Инструкция по активации:</h3>
                    <p><strong>Регион активации:</strong> ${this.productData.activation.region}</p>
                    <p><strong>Сервис активации:</strong> ${this.productData.activation.service}</p>
                    <ol>
                        ${this.productData.activation.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                    </ol>
                    <p class="note">${this.productData.activation.note}</p>
                `;
                break;
        }
    }

    // настройка кнопки добавления в корзину
    setupAddToCartButton() {
        const addToCartBtn = document.querySelector('.product-page .add-to-cart-large');
        if (addToCartBtn && this.productData) {
            addToCartBtn.addEventListener('click', () => {
                // создание объекта товара
                const product = {
                    id: new URLSearchParams(window.location.search).get('id'),
                    title: this.productData.title,
                    price: parseFloat(this.productData.price),
                    image: this.productData.images[0],
                    details: this.productData.description.overview,
                    publisher: this.productData.publisher,
                    genres: this.productData.genres.join(', ')
                };

                // добавление товара в корзину
                cart.addItem(product);

                // анимация кнопки
                addToCartBtn.classList.add('clicked');
                const ripple = document.createElement('div');
                ripple.classList.add('ripple');
                addToCartBtn.appendChild(ripple);

                // удаление эффекта анимации
                setTimeout(() => {
                    ripple.remove();
                    addToCartBtn.classList.remove('clicked');
                }, 1000);
            });
        }
    }
}

// класс для фильтрации товаров
class ProductFilter {
    constructor() {
        this.filterButtons = document.querySelectorAll('.filter-button');
        this.products = document.querySelectorAll('.product-card');
        this.init();
    }

    init() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => this.filterProducts(button));
        });
    }

    filterProducts(clickedButton) {
        // Убираем активный класс со всех кнопок
        this.filterButtons.forEach(button => button.classList.remove('active'));
        
        // Добавляем активный класс на нажатую кнопку
        clickedButton.classList.add('active');
        
        const selectedGenre = clickedButton.dataset.genre;
        
        this.products.forEach(product => {
            if (selectedGenre === 'all') {
                product.style.display = 'flex';
                return;
            }
            
            const productGenres = product.dataset.genres.split(',');
            if (productGenres.includes(selectedGenre)) {
                product.style.display = 'flex';
            } else {
                product.style.display = 'none';
            }
        });
    }
} 