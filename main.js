// الملف الرئيسي للربط بين جميع أجزاء النظام
class MainApplication {
    constructor() {
        this.isInitialized = false;
        this.currentSection = 'home';
        this.menuFilter = 'all';
        this.isLoading = false;
        this.scrollPosition = 0;

        // مراجع العناصر
        this.elements = {};

        // حالة التطبيق
        this.appState = {
            cartOpen: false,
            modalOpen: false,
            mobileMenuOpen: false,
            orderInProgress: false
        };

        this.init();
    }

    // تهيئة التطبيق
    async init() {
        console.log('🚀 جاري تهيئة تطبيق جاهزة سفرتك...');

        try {
            // انتظار تحميل DOM
            await this.waitForDOM();

            // تهيئة العناصر
            this.initializeElements();

            // تهيئة الأحداث
            this.bindEvents();

            // تحميل المنيو
            await this.loadMenuItems();

            // تهيئة السلة
            this.initializeCart();

            // فحص حالة العمل
            this.checkWorkingHours();

            // تهيئة التنقل السلس
            this.initializeSmoothScrolling();

            // تحميل الإعدادات المحفوظة
            this.loadUserPreferences();

            this.isInitialized = true;
            console.log('✅ تم تحميل التطبيق بنجاح');

            // إخفاء شاشة التحميل إذا كانت موجودة
            this.hideLoadingScreen();

        } catch (error) {
            console.error('❌ خطأ في تهيئة التطبيق:', error);
            this.showErrorMessage('حدث خطأ في تحميل التطبيق');
        }
    }

    // انتظار تحميل DOM
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    // تهيئة مراجع العناصر
    initializeElements() {
        this.elements = {
            // الهيدر
            header: document.querySelector('.main-header'),
            logo: document.querySelector('.logo'),
            mainNav: document.getElementById('mainNav'),
            cartToggle: document.getElementById('cartToggle'),
            cartBadge: document.getElementById('cartBadge'),
            mobileMenuToggle: document.getElementById('mobileMenuToggle'),

            // المنيو
            menuGrid: document.getElementById('menuGrid'),
            menuFilters: document.querySelectorAll('.filter-btn'),

            // السلة
            cartSidebar: document.getElementById('cartSidebar'),
            cartItems: document.getElementById('cartItems'),
            cartFooter: document.getElementById('cartFooter'),
            deliveryZone: document.getElementById('deliveryZone'),
            checkoutBtn: document.getElementById('checkoutBtn'),

            // النوافذ المنبثقة
            checkoutModal: document.getElementById('checkoutModal'),
            successModal: document.getElementById('successModal'),
            orderForm: document.getElementById('orderForm'),

            // الحقول
            customerName: document.getElementById('customerName'),
            customerPhone: document.getElementById('customerPhone'),
            customerAddress: document.getElementById('customerAddress'),
            orderNotes: document.getElementById('orderNotes'),

            // الإشعارات
            notifications: document.getElementById('notifications')
        };

        console.log('📋 تم تهيئة عناصر الواجهة');
    }

    // ربط الأحداث
    bindEvents() {
        // أحداث النوافذ
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));

        // أحداث التنقل
        this.bindNavigationEvents();

        // أحداث المنيو
        this.bindMenuEvents();

        // أحداث النماذج
        this.bindFormEvents();

        // أحداث المودالات
        this.bindModalEvents();

        // أحداث القائمة المحمولة
        this.bindMobileMenuEvents();

        // أحداث لوحة المفاتيح
        this.bindKeyboardEvents();

        console.log('⚡ تم ربط جميع الأحداث');
    }

    // أحداث التنقل
    bindNavigationEvents() {
        // روابط التنقل
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', this.handleNavigation.bind(this));
        });

        // زر الشعار
        if (this.elements.logo) {
            this.elements.logo.addEventListener('click', () => {
                this.scrollToSection('home');
            });
        }
    }

    // أحداث المنيو
    bindMenuEvents() {
        // فلاتر المنيو
        this.elements.menuFilters.forEach(btn => {
            btn.addEventListener('click', this.handleMenuFilter.bind(this));
        });

        // أحداث منطقة التوصيل
        if (this.elements.deliveryZone) {
            this.elements.deliveryZone.addEventListener('change', this.handleDeliveryZoneChange.bind(this));
        }
    }

    // أحداث النماذج
    bindFormEvents() {
        // نموذج الطلب
        if (this.elements.orderForm) {
            this.elements.orderForm.addEventListener('submit', this.handleOrderSubmit.bind(this));
        }

        // حفظ بيانات العميل أثناء الكتابة
        [this.elements.customerName, this.elements.customerPhone, this.elements.customerAddress].forEach(field => {
            if (field) {
                field.addEventListener('blur', this.saveCustomerInfo.bind(this));
            }
        });
    }

    // أحداث المودالات
    bindModalEvents() {
        // إغلاق المودالات عند النقر خارجها
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeAllModals();
            }
        });

        // أزرار الإغلاق
        document.querySelectorAll('.modal-close, .close').forEach(btn => {
            btn.addEventListener('click', this.closeAllModals.bind(this));
        });
    }

    // أحداث القائمة المحمولة
    bindMobileMenuEvents() {
        if (this.elements.mobileMenuToggle) {
            this.elements.mobileMenuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
    }

    // أحداث لوحة المفاتيح
    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // Escape لإغلاق المودالات
            if (e.key === 'Escape') {
                this.closeAllModals();
                this.closeMobileMenu();
                if (this.appState.cartOpen) {
                    cart.closeCart();
                }
            }

            // Ctrl+Enter لإتمام الطلب (إذا كان النموذج مفتوح)
            if (e.ctrlKey && e.key === 'Enter' && this.appState.modalOpen) {
                const submitBtn = document.querySelector('.submit-btn');
                if (submitBtn && !submitBtn.disabled) {
                    submitBtn.click();
                }
            }
        });
    }

    // معالج التمرير
    handleScroll() {
        const scrollY = window.scrollY;
        this.scrollPosition = scrollY;

        // تأثير الهيدر عند التمرير
        if (this.elements.header) {
            if (scrollY > 100) {
                this.elements.header.classList.add('scrolled');
            } else {
                this.elements.header.classList.remove('scrolled');
            }
        }

        // تحديد القسم النشط
        this.updateActiveSection();

        // إظهار زر العودة للأعلى
        this.updateBackToTopButton();
    }

    // معالج تغيير حجم النافذة
    handleResize() {
        // إغلاق القائمة المحمولة عند تكبير الشاشة
        if (window.innerWidth > 768 && this.appState.mobileMenuOpen) {
            this.closeMobileMenu();
        }

        // تحديث عرض السلة للشاشات الصغيرة
        if (window.innerWidth <= 768 && this.elements.cartSidebar) {
            this.elements.cartSidebar.style.width = '100vw';
        }
    }

    // معالج إغلاق النافذة
    handleBeforeUnload(e) {
        // تحذير إذا كان هناك طلب قيد المعالجة
        if (this.appState.orderInProgress) {
            e.preventDefault();
            e.returnValue = 'هناك طلب قيد المعالجة. هل أنت متأكد من إغلاق الصفحة؟';
            return e.returnValue;
        }
    }

    // معالج التنقل
    handleNavigation(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        this.scrollToSection(targetId);

        // إغلاق القائمة المحمولة إذا كانت مفتوحة
        if (this.appState.mobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    // معالج فلتر المنيو
    async handleMenuFilter(e) {
        const category = e.target.dataset.category;

        // تحديث الزر النشط
        this.elements.menuFilters.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // تحميل العناصر المفلترة
        this.menuFilter = category;
        await this.loadMenuItems(category);
    }

    // معالج تغيير منطقة التوصيل
    handleDeliveryZoneChange(e) {
        const selectedZone = e.target.value;
        const selectedOption = e.target.selectedOptions[0];
        const fee = selectedOption ? selectedOption.dataset.fee : 0;

        cart.setDeliveryZone(selectedZone);

        // إظهار إشعار
        if (selectedZone) {
            const zoneName = selectedOption.textContent;
            cart.showNotification(`تم تحديد منطقة التوصيل: ${zoneName}`, 'success');
        }
    }

    // معالج إرسال الطلب
    async handleOrderSubmit(e) {
        e.preventDefault();

        if (this.appState.orderInProgress) {
            return;
        }

        // التحقق من صحة البيانات
        const validation = this.validateOrderForm();
        if (!validation.isValid) {
            cart.showNotification(validation.message, 'error');
            return;
        }

        this.appState.orderInProgress = true;
        const submitBtn = e.target.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;

        try {
            // تحديث الزر
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';

            // جمع بيانات النموذج
            const customerData = this.collectCustomerData();
            const cartData = cart.getOrderData();

            // حفظ بيانات العميل
            cart.saveCustomerInfo(customerData);

            // إرسال الطلب
            const result = await orderManager.processNewOrder(customerData, cartData);

            if (result.success) {
                // تسجيل أن العميل طلب من قبل
                cart.markAsOrderedBefore();

                // تفريغ السلة
                cart.clearCart();

                // إغلاق نافذة الطلب
                this.closeCheckoutModal();

                // عرض رسالة النجاح
                this.showSuccessModal(result.orderNumber, result.estimatedTime);

                // إرسال حدث نجاح الطلب
                this.trackEvent('order_completed', {
                    orderNumber: result.orderNumber,
                    total: cartData.pricing.total
                });

            } else {
                throw new Error(result.message);
            }

        } catch (error) {
            console.error('خطأ في إرسال الطلب:', error);
            cart.showNotification(error.message || 'حدث خطأ في إرسال الطلب', 'error');

        } finally {
            // إعادة تعيين الزر
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            this.appState.orderInProgress = false;
        }
    }

    // تحميل عناصر المنيو
    async loadMenuItems(category = 'all') {
        if (!this.elements.menuGrid) return;

        this.showLoading(this.elements.menuGrid);

        try {
            const items = window.menuSystem?.menuHelpers?.filterByCategory(category) ||
                menuData.filter(item => category === 'all' || item.category === category);

            this.elements.menuGrid.innerHTML = items.map(item => this.createMenuItemHTML(item)).join('');

            // تحريك العناصر عند الظهور
            this.animateMenuItems();

        } catch (error) {
            console.error('خطأ في تحميل المنيو:', error);
            this.elements.menuGrid.innerHTML = '<p class="error-message">خطأ في تحميل المنيو</p>';
        }
    }

    // إنشاء HTML لعنصر المنيو
    createMenuItemHTML(item) {
        const isPopular = item.popular ? '<div class="popular-badge">الأكثر طلباً</div>' : '';
        const rating = this.getItemRating(item.id);

        return `
            <div class="menu-item" data-item-id="${item.id}">
                <div class="menu-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    ${isPopular}
                </div>
                <div class="menu-item-content">
                    <h3 class="menu-item-title">${item.name}</h3>
                    <p class="menu-item-description">${item.description}</p>
                    ${rating ? `<div class="item-rating">${rating}</div>` : ''}
                    <div class="menu-item-footer">
                        <span class="menu-item-price">${item.price} جنيه</span>
                        <button class="add-to-cart-btn" onclick="addToCart('${item.id}')">
                            <i class="fas fa-plus"></i>
                            إضافة
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // الحصول على تقييم العنصر
    getItemRating(itemId) {
        const reviews = window.menuSystem?.customerReviews?.[itemId];
        if (reviews && reviews.averageRating) {
            const stars = '★'.repeat(Math.floor(reviews.averageRating)) +
                '☆'.repeat(5 - Math.floor(reviews.averageRating));
            return `<span class="stars">${stars}</span> (${reviews.totalReviews})`;
        }
        return null;
    }

    // تحريك عناصر المنيو
    animateMenuItems() {
        const items = this.elements.menuGrid.querySelectorAll('.menu-item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';

            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // تهيئة السلة
    initializeCart() {
        if (window.cart) {
            // ربط أحداث السلة
            window.cart.updateCartDisplay();
            console.log('🛒 تم ربط نظام السلة');
        }
    }

    // فحص ساعات العمل
    checkWorkingHours() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute;

        const workingHours = window.menuSystem?.storeSettings?.workingHours;
        if (workingHours) {
            const [openHour, openMinute] = workingHours.open.split(':').map(Number);
            const [closeHour, closeMinute] = workingHours.close.split(':').map(Number);

            const openTime = openHour * 60 + openMinute;
            const closeTime = closeHour * 60 + closeMinute;

            if (currentTime < openTime || currentTime > closeTime) {
                this.showClosedMessage();
            }
        }
    }

    // عرض رسالة الإغلاق
    showClosedMessage() {
        const workingHours = window.menuSystem?.storeSettings?.workingHours;
        const message = `نحن مغلقون حالياً. ساعات العمل: ${workingHours?.open || '9:00'} - ${workingHours?.close || '23:00'}`;

        const banner = document.createElement('div');
        banner.className = 'closed-banner';
        banner.innerHTML = `
            <div class="closed-content">
                <i class="fas fa-clock"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.insertBefore(banner, document.body.firstChild);
    }

    // تهيئة التنقل السلس
    initializeSmoothScrolling() {
        // تحديث الرابط النشط
        this.updateActiveNavLink();
    }

    // التمرير إلى قسم
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = this.elements.header?.offsetHeight || 80;
            const targetPosition = section.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            this.currentSection = sectionId;
            this.updateActiveNavLink();
        }
    }

    // تحديث القسم النشط
    updateActiveSection() {
        const sections = ['home', 'menu', 'offers', 'about', 'contact'];
        const headerHeight = this.elements.header?.offsetHeight || 80;

        for (const sectionId of sections) {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                if (rect.top <= headerHeight && rect.bottom >= headerHeight) {
                    if (this.currentSection !== sectionId) {
                        this.currentSection = sectionId;
                        this.updateActiveNavLink();
                    }
                    break;
                }
            }
        }
    }

    // تحديث الرابط النشط
    updateActiveNavLink() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${this.currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // تحديث زر العودة للأعلى
    updateBackToTopButton() {
        let backToTopBtn = document.getElementById('backToTop');

        if (this.scrollPosition > 500) {
            if (!backToTopBtn) {
                backToTopBtn = this.createBackToTopButton();
                document.body.appendChild(backToTopBtn);
            }
            backToTopBtn.style.display = 'block';
        } else if (backToTopBtn) {
            backToTopBtn.style.display = 'none';
        }
    }

    // إنشاء زر العودة للأعلى
    createBackToTopButton() {
        const button = document.createElement('button');
        button.id = 'backToTop';
        button.className = 'back-to-top';
        button.innerHTML = '<i class="fas fa-chevron-up"></i>';
        button.title = 'العودة للأعلى';

        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        return button;
    }

    // فتح/إغلاق القائمة المحمولة
    toggleMobileMenu() {
        this.appState.mobileMenuOpen = !this.appState.mobileMenuOpen;

        if (this.elements.mainNav) {
            this.elements.mainNav.classList.toggle('mobile-open');
        }

        if (this.elements.mobileMenuToggle) {
            this.elements.mobileMenuToggle.classList.toggle('active');
        }

        document.body.style.overflow = this.appState.mobileMenuOpen ? 'hidden' : '';
    }

    // إغلاق القائمة المحمولة
    closeMobileMenu() {
        this.appState.mobileMenuOpen = false;

        if (this.elements.mainNav) {
            this.elements.mainNav.classList.remove('mobile-open');
        }

        if (this.elements.mobileMenuToggle) {
            this.elements.mobileMenuToggle.classList.remove('active');
        }

        document.body.style.overflow = '';
    }

    // إغلاق نافذة الطلب
    closeCheckoutModal() {
        if (this.elements.checkoutModal) {
            this.elements.checkoutModal.classList.remove('active');
            this.appState.modalOpen = false;
            document.body.style.overflow = '';
        }
    }

    // عرض نافذة النجاح
    showSuccessModal(orderNumber, estimatedTime) {
        const successModal = this.elements.successModal;
        if (successModal) {
            const orderNumberElement = document.getElementById('orderNumber');
            if (orderNumberElement) {
                orderNumberElement.textContent = orderNumber;
            }

            // إضافة الوقت المتوقع إذا كان متوفراً
            if (estimatedTime) {
                const estimatedTimeElement = successModal.querySelector('.estimated-time');
                if (estimatedTimeElement) {
                    estimatedTimeElement.textContent = `الوقت المتوقع: ${estimatedTime}`;
                }
            }

            successModal.style.display = 'flex';
            this.appState.modalOpen = true;
            document.body.style.overflow = 'hidden';
        }
    }

    // إغلاق جميع المودالات
    closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.classList.remove('active');
            modal.style.display = 'none';
        });

        this.appState.modalOpen = false;
        document.body.style.overflow = '';
    }

    // التحقق من صحة نموذج الطلب
    validateOrderForm() {
        const name = this.elements.customerName?.value?.trim();
        const phone = this.elements.customerPhone?.value?.trim();
        const address = this.elements.customerAddress?.value?.trim();

        if (!name) {
            return { isValid: false, message: 'يرجى إدخال الاسم' };
        }

        if (!phone) {
            return { isValid: false, message: 'يرجى إدخال رقم الهاتف' };
        }

        if (!/^[0-9+\-\s()]+$/.test(phone)) {
            return { isValid: false, message: 'رقم الهاتف غير صحيح' };
        }

        if (!address) {
            return { isValid: false, message: 'يرجى إدخال العنوان' };
        }

        if (cart.isEmpty()) {
            return { isValid: false, message: 'السلة فارغة' };
        }

        if (!cart.deliveryZone) {
            return { isValid: false, message: 'يرجى اختيار منطقة التوصيل' };
        }

        return { isValid: true };
    }

    // جمع بيانات العميل
    collectCustomerData() {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'cash';

        return {
            name: this.elements.customerName.value.trim(),
            phone: this.elements.customerPhone.value.trim(),
            address: this.elements.customerAddress.value.trim(),
            notes: this.elements.orderNotes?.value?.trim() || '',
            paymentMethod: paymentMethod
        };
    }

    // حفظ بيانات العميل
    saveCustomerInfo() {
        const customerData = {
            name: this.elements.customerName?.value || '',
            phone: this.elements.customerPhone?.value || '',
            address: this.elements.customerAddress?.value || ''
        };

        cart.saveCustomerInfo(customerData);
    }

    // تحميل تفضيلات المستخدم
    loadUserPreferences() {
        try {
            const preferences = localStorage.getItem('jaheeza_preferences');
            if (preferences) {
                const prefs = JSON.parse(preferences);

                // تطبيق الثيم المحفوظ
                if (prefs.theme) {
                    document.body.className = prefs.theme;
                }

                // تطبيق اللغة المحفوظة
                if (prefs.language && prefs.language !== 'ar') {
                    this.changeLanguage(prefs.language);
                }
            }
        } catch (error) {
            console.warn('خطأ في تحميل التفضيلات:', error);
        }
    }

    // حفظ التفضيلات
    saveUserPreferences(preferences) {
        try {
            localStorage.setItem('jaheeza_preferences', JSON.stringify(preferences));
        } catch (error) {
            console.warn('خطأ في حفظ التفضيلات:', error);
        }
    }

    // عرض شاشة التحميل
    showLoading(container) {
        if (container) {
            container.innerHTML = `
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <p>جاري التحميل...</p>
                </div>
            `;
        }
    }

    // إخفاء شاشة التحميل
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }
    }

    // عرض رسالة خطأ
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-banner';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.insertBefore(errorDiv, document.body.firstChild);

        // إزالة الرسالة بعد 5 ثوانِ
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    // تتبع الأحداث (للتحليلات)
    trackEvent(eventName, eventData = {}) {
        console.log('📊 تتبع حدث:', eventName, eventData);

        // يمكن إضافة كود Google Analytics أو Facebook Pixel هنا
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }

        if (typeof fbq !== 'undefined') {
            fbq('track', eventName, eventData);
        }
    }

    // الحصول على حالة التطبيق
    getAppState() {
        return {
            isInitialized: this.isInitialized,
            currentSection: this.currentSection,
            menuFilter: this.menuFilter,
            cartItemCount: cart.getItemCount(),
            appState: this.appState
        };
    }
}

// وظائف عامة للاستخدام العام
function scrollToSection(sectionId) {
    if (window.app) {
        window.app.scrollToSection(sectionId);
    }
}

function closeSuccessModal() {
    if (window.app) {
        window.app.closeAllModals();
    }
}

function trackOrder() {
    // فتح صفحة تتبع الطلب
    const orderNumber = document.getElementById('orderNumber')?.textContent;
    if (orderNumber) {
        window.open(`#track-order?order=${orderNumber}`, '_blank');
    }
}

// تهيئة التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function () {
    console.log('🏁 بدء تحميل تطبيق جاهزة سفرتك');

    // إنشاء نسخة التطبيق الرئيسية
    window.app = new MainApplication();

    // تسجيل معلومات النظام
    console.log('ℹ️ معلومات النظام:', {
        userAgent: navigator.userAgent,
        language: navigator.language,
        screen: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`
    });
});

// معالجة الأخطاء العامة
window.addEventListener('error', function (e) {
    console.error('❌ خطأ JavaScript:', e.error);

    // إظهار رسالة خطأ للمستخدم في حالة الأخطاء الحرجة
    if (window.app) {
        window.app.showErrorMessage('حدث خطأ غير متوقع. يرجى إعادة تحميل الصفحة.');
    }
});

// معالجة الوعود المرفوضة
window.addEventListener('unhandledrejection', function (e) {
    console.error('❌ وعد مرفوض:', e.reason);
    e.preventDefault();
});

console.log('🎯 تم تحميل الملف الرئيسي للتطبيق');
