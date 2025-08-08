// نظام إدارة السلة والطلبات المتكامل
class CartManager {
    constructor() {
        this.cart = this.loadCartFromStorage();
        this.deliveryZone = this.loadDeliveryZone();
        this.deliveryFee = 0;
        this.isFirstOrder = this.checkFirstOrder();
        this.discount = 0;
        this.appliedPromoCode = null;
        this.customerInfo = this.loadCustomerInfo();

        // ربط الأحداث
        this.bindEvents();
        this.updateCartDisplay();
        this.calculateDeliveryFee();
    }

    // تحميل السلة من التخزين المحلي
    loadCartFromStorage() {
        try {
            const savedCart = localStorage.getItem('jaheeza_cart');
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('خطأ في تحميل السلة:', error);
            return [];
        }
    }

    // تحميل منطقة التوصيل المحفوظة
    loadDeliveryZone() {
        return localStorage.getItem('jaheeza_delivery_zone') || '';
    }

    // تحميل بيانات العميل المحفوظة
    loadCustomerInfo() {
        try {
            const savedInfo = localStorage.getItem('jaheeza_customer_info');
            return savedInfo ? JSON.parse(savedInfo) : {};
        } catch (error) {
            return {};
        }
    }

    // حفظ السلة في التخزين المحلي
    saveCartToStorage() {
        try {
            localStorage.setItem('jaheeza_cart', JSON.stringify(this.cart));
            this.updateCartDisplay();
        } catch (error) {
            console.error('خطأ في حفظ السلة:', error);
        }
    }

    // حفظ منطقة التوصيل
    saveDeliveryZone() {
        localStorage.setItem('jaheeza_delivery_zone', this.deliveryZone);
    }

    // حفظ بيانات العميل
    saveCustomerInfo(info) {
        this.customerInfo = { ...this.customerInfo, ...info };
        localStorage.setItem('jaheeza_customer_info', JSON.stringify(this.customerInfo));
    }

    // فحص إذا كان الطلب الأول
    checkFirstOrder() {
        return !localStorage.getItem('jaheeza_has_ordered');
    }

    // ربط الأحداث
    bindEvents() {
        // زر فتح السلة
        const cartToggle = document.getElementById('cartToggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', () => this.toggleCart());
        }

        // زر إغلاق السلة
        const cartClose = document.getElementById('cartClose');
        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeCart());
        }

        // تغيير منطقة التوصيل
        const deliveryZoneSelect = document.getElementById('deliveryZone');
        if (deliveryZoneSelect) {
            deliveryZoneSelect.addEventListener('change', (e) => {
                this.setDeliveryZone(e.target.value);
            });
        }

        // زر الطلب
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
        }

        // إغلاق النوافذ عند النقر خارجها
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeAllModals();
            }
        });
    }

    // إضافة صنف للسلة
    addToCart(itemId, quantity = 1, customizations = {}) {
        const menuItem = window.menuSystem?.menuHelpers?.getItemById(itemId) ||
            menuData.find(item => item.id === itemId);

        if (!menuItem) {
            this.showNotification('عذراً، لم يتم العثور على هذا الصنف', 'error');
            return false;
        }

        // البحث عن الصنف في السلة
        const existingItemIndex = this.cart.findIndex(cartItem =>
            cartItem.id === itemId &&
            JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
        );

        if (existingItemIndex > -1) {
            // زيادة الكمية
            this.cart[existingItemIndex].quantity += quantity;
        } else {
            // إضافة صنف جديد
            this.cart.push({
                id: itemId,
                name: menuItem.name,
                description: menuItem.description,
                price: menuItem.price,
                image: menuItem.image,
                quantity: quantity,
                customizations: customizations,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCartToStorage();
        this.showNotification(`تم إضافة ${menuItem.name} للسلة`, 'success');

        // تأثير بصري على الزر
        this.animateAddToCart();

        return true;
    }

    // إضافة عرض خاص للسلة
    addOfferToCart(offerId) {
        const offer = window.menuSystem?.specialOffers?.[offerId] || specialOffers[offerId];

        if (!offer) {
            this.showNotification('عذراً، هذا العرض غير متوفر', 'error');
            return false;
        }

        // إزالة أي عروض سابقة (يمكن تعديل هذا السلوك)
        this.cart = this.cart.filter(item => !item.isOffer);

        // إضافة العرض
        this.cart.push({
            id: offerId,
            name: offer.name,
            description: offer.description,
            price: offer.salePrice,
            originalPrice: offer.originalPrice,
            image: offer.image,
            quantity: 1,
            isOffer: true,
            discount: offer.originalPrice - offer.salePrice,
            addedAt: new Date().toISOString()
        });

        this.saveCartToStorage();
        this.showNotification(`تم إضافة ${offer.name} للسلة`, 'success');

        return true;
    }

    // تحديث كمية صنف
    updateQuantity(itemId, newQuantity, customizations = {}) {
        if (newQuantity < 1) {
            return this.removeFromCart(itemId, customizations);
        }

        const itemIndex = this.cart.findIndex(cartItem =>
            cartItem.id === itemId &&
            JSON.stringify(cartItem.customizations || {}) === JSON.stringify(customizations)
        );

        if (itemIndex > -1) {
            this.cart[itemIndex].quantity = newQuantity;
            this.saveCartToStorage();
            return true;
        }

        return false;
    }

    // حذف صنف من السلة
    removeFromCart(itemId, customizations = {}) {
        const originalLength = this.cart.length;

        this.cart = this.cart.filter(cartItem =>
            !(cartItem.id === itemId &&
                JSON.stringify(cartItem.customizations || {}) === JSON.stringify(customizations))
        );

        if (this.cart.length < originalLength) {
            this.saveCartToStorage();
            this.showNotification('تم حذف الصنف من السلة', 'info');
            return true;
        }

        return false;
    }

    // تفريغ السلة
    clearCart() {
        this.cart = [];
        this.appliedPromoCode = null;
        this.discount = 0;
        this.saveCartToStorage();
        this.showNotification('تم تفريغ السلة', 'info');
    }

    // حساب المجموع الفرعي
    getSubtotal() {
        return this.cart.reduce((total, item) => {
            let itemPrice = item.price;

            // إضافة تكلفة التخصيصات
            if (item.customizations) {
                // يمكن إضافة منطق حساب التخصيصات هنا
            }

            return total + (itemPrice * item.quantity);
        }, 0);
    }

    // تطبيق كود خصم
    applyPromoCode(code) {
        if (!window.menuSystem?.advancedMenuHelpers?.applyPromoCode) {
            this.showNotification('نظام الأكواد غير متوفر حالياً', 'error');
            return false;
        }

        const result = window.menuSystem.advancedMenuHelpers.applyPromoCode(
            code,
            this.getSubtotal(),
            this.isFirstOrder
        );

        if (result.valid) {
            this.appliedPromoCode = code;
            this.discount = result.discountAmount;
            this.showNotification(result.message, 'success');
            this.updateCartDisplay();
            return true;
        } else {
            this.showNotification(result.message, 'error');
            return false;
        }
    }

    // إزالة كود الخصم
    removePromoCode() {
        this.appliedPromoCode = null;
        this.discount = 0;
        this.updateCartDisplay();
        this.showNotification('تم إزالة كود الخصم', 'info');
    }

    // تعيين منطقة التوصيل
    setDeliveryZone(zone) {
        this.deliveryZone = zone;
        this.calculateDeliveryFee();
        this.saveDeliveryZone();
        this.updateCartDisplay();
    }

    // حساب رسوم التوصيل
    calculateDeliveryFee() {
        if (!this.deliveryZone) {
            this.deliveryFee = 0;
            return;
        }

        const subtotal = this.getSubtotal();

        if (window.menuSystem?.menuHelpers?.calculateDeliveryFee) {
            this.deliveryFee = window.menuSystem.menuHelpers.calculateDeliveryFee(
                this.deliveryZone,
                subtotal
            );
        } else {
            // حساب بسيط كبديل
            const zones = {
                'downtown': 15,
                'suburbs': 25,
                'outskirts': 35
            };

            this.deliveryFee = subtotal >= 100 ? 0 : (zones[this.deliveryZone] || 0);
        }
    }

    // حساب الخصم
    calculateDiscount() {
        let totalDiscount = 0;

        // خصم الطلب الأول
        if (this.isFirstOrder) {
            const subtotal = this.getSubtotal();
            const firstOrderDiscount = Math.min(
                (subtotal * 20) / 100, // 20%
                50 // أقصى خصم 50 جنيه
            );
            totalDiscount += firstOrderDiscount;
        }

        // خصم كود الخصم
        if (this.appliedPromoCode && this.discount > 0) {
            totalDiscount += this.discount;
        }

        return totalDiscount;
    }

    // حساب المجموع النهائي
    getTotal() {
        const subtotal = this.getSubtotal();
        const discount = this.calculateDiscount();
        const deliveryFee = this.deliveryFee;

        return Math.max(0, subtotal - discount + deliveryFee);
    }

    // عدد العناصر في السلة
    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // فحص إذا كانت السلة فارغة
    isEmpty() {
        return this.cart.length === 0;
    }

    // تحديث عرض السلة
    updateCartDisplay() {
        this.updateCartBadge();
        this.updateCartItems();
        this.updateCartSummary();
        this.updateCheckoutButton();
    }

    // تحديث شارة السلة
    updateCartBadge() {
        const cartBadge = document.getElementById('cartBadge');
        if (cartBadge) {
            const itemCount = this.getItemCount();
            cartBadge.textContent = itemCount;
            cartBadge.style.display = itemCount > 0 ? 'flex' : 'none';
        }
    }

    // تحديث عناصر السلة
    updateCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        if (!cartItemsContainer) return;

        if (this.isEmpty()) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>السلة فارغة</p>
                    <span>ابدأ بإضافة أطباقك المفضلة</span>
                </div>
            `;
            return;
        }

        cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">
                        ${item.price} جنيه × ${item.quantity} = ${item.price * item.quantity} جنيه
                    </div>
                    ${item.isOffer ? '<div class="offer-label">🎁 عرض خاص</div>' : ''}
                    ${item.originalPrice ? `<div class="original-price">قبل الخصم: ${item.originalPrice} جنيه</div>` : ''}
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <button class="remove-btn" onclick="cart.removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // تحديث ملخص السلة
    updateCartSummary() {
        const cartFooter = document.getElementById('cartFooter');
        if (!cartFooter) return;

        if (this.isEmpty()) {
            cartFooter.style.display = 'none';
            return;
        }

        cartFooter.style.display = 'block';

        // تحديث الأسعار
        const subtotal = this.getSubtotal();
        const discount = this.calculateDiscount();
        const total = this.getTotal();

        // تحديث العناصر
        const subtotalElement = document.getElementById('subtotalAmount');
        const discountElement = document.getElementById('discountAmount');
        const discountLine = document.getElementById('discountLine');
        const deliveryElement = document.getElementById('deliveryAmount');
        const totalElement = document.getElementById('totalAmount');

        if (subtotalElement) subtotalElement.textContent = `${subtotal} ج`;
        if (totalElement) totalElement.textContent = `${total} ج`;

        // عرض الخصم
        if (discount > 0) {
            if (discountLine) discountLine.style.display = 'flex';
            if (discountElement) discountElement.textContent = `${discount} ج`;
        } else {
            if (discountLine) discountLine.style.display = 'none';
        }

        // عرض التوصيل
        if (deliveryElement) {
            if (this.deliveryFee === 0 && this.deliveryZone) {
                deliveryElement.textContent = 'مجاني 🎉';
                deliveryElement.style.color = '#28a745';
            } else if (this.deliveryZone) {
                deliveryElement.textContent = `${this.deliveryFee} ج`;
                deliveryElement.style.color = '';
            } else {
                deliveryElement.textContent = 'اختر المنطقة';
                deliveryElement.style.color = '#ffc107';
            }
        }

        // تحديث منطقة التوصيل المحفوظة
        const deliveryZoneSelect = document.getElementById('deliveryZone');
        if (deliveryZoneSelect && this.deliveryZone) {
            deliveryZoneSelect.value = this.deliveryZone;
        }
    }

    // تحديث زر الطلب
    updateCheckoutButton() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (!checkoutBtn) return;

        if (this.isEmpty()) {
            checkoutBtn.disabled = true;
            checkoutBtn.textContent = 'السلة فارغة';
        } else if (!this.deliveryZone) {
            checkoutBtn.disabled = true;
            checkoutBtn.textContent = 'اختر منطقة التوصيل';
        } else {
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = 'إتمام الطلب';
        }
    }

    // فتح/إغلاق السلة
    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            cartSidebar.classList.toggle('active');
            document.body.style.overflow = cartSidebar.classList.contains('active') ? 'hidden' : '';
        }
    }

    // إغلاق السلة
    closeCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        if (cartSidebar) {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // الانتقال لصفحة الطلب
    proceedToCheckout() {
        if (this.isEmpty()) {
            this.showNotification('السلة فارغة!', 'warning');
            return;
        }

        if (!this.deliveryZone) {
            this.showNotification('يرجى اختيار منطقة التوصيل', 'warning');
            return;
        }

        this.closeCart();
        this.showCheckoutModal();
    }

    // عرض نافذة الطلب
    showCheckoutModal() {
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal) {
            checkoutModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.populateCheckoutSummary();
            this.populateCustomerInfo();
        }
    }

    // إغلاق نافذة الطلب
    closeCheckoutModal() {
        const checkoutModal = document.getElementById('checkoutModal');
        if (checkoutModal) {
            checkoutModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // ملء ملخص الطلب في النافذة
    populateCheckoutSummary() {
        const summaryContainer = document.getElementById('orderSummaryModal');
        if (!summaryContainer) return;

        const subtotal = this.getSubtotal();
        const discount = this.calculateDiscount();
        const total = this.getTotal();

        summaryContainer.innerHTML = `
            <div class="summary-items">
                ${this.cart.map(item => `
                    <div class="summary-item">
                        <span>${item.name} × ${item.quantity}</span>
                        <span>${item.price * item.quantity} ج</span>
                    </div>
                `).join('')}
            </div>
            <div class="summary-totals">
                <div class="summary-line">
                    <span>المجموع الفرعي:</span>
                    <span>${subtotal} ج</span>
                </div>
                ${discount > 0 ? `
                    <div class="summary-line discount">
                        <span>الخصم:</span>
                        <span>-${discount} ج</span>
                    </div>
                ` : ''}
                <div class="summary-line">
                    <span>التوصيل:</span>
                    <span>${this.deliveryFee === 0 ? 'مجاني' : this.deliveryFee + ' ج'}</span>
                </div>
                <div class="summary-line total">
                    <span>الإجمالي:</span>
                    <span>${total} ج</span>
                </div>
            </div>
        `;
    }

    // ملء بيانات العميل المحفوظة
    populateCustomerInfo() {
        if (this.customerInfo.name) {
            const nameField = document.getElementById('customerName');
            if (nameField) nameField.value = this.customerInfo.name;
        }

        if (this.customerInfo.phone) {
            const phoneField = document.getElementById('customerPhone');
            if (phoneField) phoneField.value = this.customerInfo.phone;
        }

        if (this.customerInfo.address) {
            const addressField = document.getElementById('customerAddress');
            if (addressField) addressField.value = this.customerInfo.address;
        }
    }

    // إغلاق جميع النوافذ
    closeAllModals() {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }

    // تأثير بصري لإضافة للسلة
    animateAddToCart() {
        const cartToggle = document.getElementById('cartToggle');
        if (cartToggle) {
            cartToggle.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartToggle.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // عرض الإشعارات
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        notification.innerHTML = `
            <i class="${icons[type]}"></i>
            <span>${message}</span>
        `;

        const container = document.getElementById('notifications') || this.createNotificationContainer();
        container.appendChild(notification);

        // إزالة الإشعار بعد 4 ثوانٍ
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // إنشاء حاوي الإشعارات
    createNotificationContainer() {
        let container = document.getElementById('notifications');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notifications';
            container.className = 'notifications-container';
            document.body.appendChild(container);
        }
        return container;
    }

    // الحصول على بيانات الطلب للإرسال
    getOrderData() {
        return {
            items: this.cart,
            pricing: {
                subtotal: this.getSubtotal(),
                discount: this.calculateDiscount(),
                deliveryFee: this.deliveryFee,
                total: this.getTotal()
            },
            deliveryZone: this.deliveryZone,
            appliedPromoCode: this.appliedPromoCode,
            isFirstOrder: this.isFirstOrder,
            timestamp: new Date().toISOString()
        };
    }

    // تسجيل أن العميل طلب من قبل
    markAsOrderedBefore() {
        localStorage.setItem('jaheeza_has_ordered', 'true');
        this.isFirstOrder = false;
    }
}

// إنشاء نسخة عامة من السلة
const cart = new CartManager();

// تصدير السلة للاستخدام العام
if (typeof window !== 'undefined') {
    window.cart = cart;
}

// وظائف مساعدة عامة
function addToCart(itemId, quantity = 1) {
    return cart.addToCart(itemId, quantity);
}

function addOfferToCart(offerId) {
    return cart.addOfferToCart(offerId);
}

function toggleCart() {
    cart.toggleCart();
}

function closeCheckoutModal() {
    cart.closeCheckoutModal();
}

// تحديث السلة كل 30 ثانية (للمزامنة)
setInterval(() => {
    cart.updateCartDisplay();
}, 30000);

console.log('🛒 نظام السلة تم تحميله بنجاح');

