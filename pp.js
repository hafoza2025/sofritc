      
        // ===== نظام تنسيق الشاشات والواجهات الشامل =====
        class ScreenCoordinator {
            constructor() {
                this.screens = new Map();
                this.currentScreen = null;
                this.previousScreen = null;
                this.screenStack = [];
                this.transitionInProgress = false;
                this.overlays = new Map();
                this.globalState = {
                    user: null,
                    cart: null,
                    theme: 'light',
                    language: 'ar',
                    notifications: []
                };

                this.init();
            }

            // تهيئة النظام
            init() {
                this.registerScreens();
                this.setupEventListeners();
                this.initializeComponents();
                this.loadInitialScreen();

                console.log('🎬 نظام تنسيق الشاشات تم تهيئته بنجاح');
            }

            // تسجيل جميع الشاشات
            registerScreens() {
                // الشاشة الرئيسية
                this.screens.set('home', {
                    id: 'home',
                    element: document.getElementById('home'),
                    controller: new HomeScreenController(),
                    preloadData: true,
                    cacheData: true,
                    transitions: {
                        enter: 'fadeInUp',
                        exit: 'fadeOutDown'
                    }
                });

                // شاشة المنيو
                this.screens.set('menu', {
                    id: 'menu',
                    element: document.getElementById('menu'),
                    controller: new MenuScreenController(),
                    preloadData: true,
                    cacheData: true,
                    transitions: {
                        enter: 'slideInRight',
                        exit: 'slideOutLeft'
                    }
                });

                // شاشة العروض
                this.screens.set('offers', {
                    id: 'offers',
                    element: document.getElementById('offers'),
                    controller: new OffersScreenController(),
                    preloadData: false,
                    cacheData: true,
                    transitions: {
                        enter: 'bounceIn',
                        exit: 'bounceOut'
                    }
                });

                // شاشة عن المطعم
                this.screens.set('about', {
                    id: 'about',
                    element: document.getElementById('about'),
                    controller: new AboutScreenController(),
                    preloadData: false,
                    cacheData: false,
                    transitions: {
                        enter: 'zoomIn',
                        exit: 'zoomOut'
                    }
                });

                // شاشة التواصل
                this.screens.set('contact', {
                    id: 'contact',
                    element: document.getElementById('contact'),
                    controller: new ContactScreenController(),
                    preloadData: false,
                    cacheData: false,
                    transitions: {
                        enter: 'slideInUp',
                        exit: 'slideOutDown'
                    }
                });

                // النوافذ المنبثقة
                this.registerOverlays();
            }

            // تسجيل النوافذ المنبثقة
            registerOverlays() {
                this.overlays.set('cart', {
                    id: 'cart',
                    element: document.getElementById('cartSidebar'),
                    controller: new CartOverlayController(),
                    modal: false,
                    persistent: true
                });

                this.overlays.set('checkout', {
                    id: 'checkout',
                    element: document.getElementById('checkoutModal'),
                    controller: new CheckoutOverlayController(),
                    modal: true,
                    persistent: false
                });

                this.overlays.set('success', {
                    id: 'success',
                    element: document.getElementById('successModal'),
                    controller: new SuccessOverlayController(),
                    modal: true,
                    persistent: false
                });

                this.overlays.set('loading', {
                    id: 'loading',
                    element: document.getElementById('loadingScreen'),
                    controller: new LoadingOverlayController(),
                    modal: true,
                    persistent: true
                });
            }

            // إعداد مستمعي الأحداث
            setupEventListeners() {
                // التنقل بين الشاشات
                document.addEventListener('click', this.handleNavigation.bind(this));

                // أحداث لوحة المفاتيح
                document.addEventListener('keydown', this.handleKeyboard.bind(this));

                // أحداث المتصفح
                window.addEventListener('popstate', this.handleBrowserNavigation.bind(this));
                window.addEventListener('resize', this.handleResize.bind(this));

                // أحداث التمرير
                window.addEventListener('scroll', this.handleScroll.bind(this));

                // أحداث تغيير الحالة
                document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
            }

            // تهيئة المكونات
            initializeComponents() {
                // تهيئة النوافذ المنبثقة
                this.initializeOverlays();

                // تهيئة الشاشات
                this.initializeScreens();

                // تهيئة النظام العام
                this.initializeGlobalComponents();
            }

            // تحميل الشاشة الأولى
            loadInitialScreen() {
                const hash = window.location.hash.substring(1);
                const initialScreen = hash && this.screens.has(hash) ? hash : 'home';

                this.showScreen(initialScreen, { initial: true });
            }

            // عرض شاشة معينة
            async showScreen(screenId, options = {}) {
                if (this.transitionInProgress && !options.force) {
                    console.warn('انتقال قيد التنفيذ، يرجى الانتظار');
                    return false;
                }

                const screen = this.screens.get(screenId);
                if (!screen) {
                    console.error(`الشاشة ${screenId} غير موجودة`);
                    return false;
                }

                this.transitionInProgress = true;

                try {
                    // تحديث التاريخ
                    if (!options.initial && !options.skipHistory) {
                        this.updateBrowserHistory(screenId);
                    }

                    // إخفاء الشاشة الحالية
                    if (this.currentScreen && this.currentScreen !== screenId) {
                        await this.hideScreen(this.currentScreen);
                    }

                    // تحضير الشاشة الجديدة
                    await this.prepareScreen(screen, options);

                    // عرض الشاشة الجديدة
                    await this.displayScreen(screen, options);

                    // تحديث الحالة
                    this.updateScreenState(screenId);

                    return true;

                } catch (error) {
                    console.error('خطأ في عرض الشاشة:', error);
                    return false;
                } finally {
                    this.transitionInProgress = false;
                }
            }

            // إخفاء شاشة
            async hideScreen(screenId) {
                const screen = this.screens.get(screenId);
                if (!screen || !screen.element) return;

                // تنفيذ animation الخروج
                await this.runTransition(screen.element, screen.transitions.exit);

                // إخفاء العنصر
                screen.element.style.display = 'none';

                // تنظيف الشاشة
                if (screen.controller && screen.controller.onHide) {
                    screen.controller.onHide();
                }
            }

            // تحضير الشاشة
            async prepareScreen(screen, options) {
                // تحميل البيانات إذا لزم الأمر
                if (screen.preloadData || options.forceReload) {
                    await this.loadScreenData(screen);
                }

                // تهيئة الشاشة
                if (screen.controller && screen.controller.onPrepare) {
                    await screen.controller.onPrepare(options);
                }
            }

            // عرض الشاشة
            async displayScreen(screen, options) {
                // إظهار العنصر
                screen.element.style.display = 'block';

                // تنفيذ animation الدخول
                await this.runTransition(screen.element, screen.transitions.enter);

                // تفعيل الشاشة
                if (screen.controller && screen.controller.onShow) {
                    screen.controller.onShow(options);
                }

                // تحديث التنقل
                this.updateNavigation(screen.id);
            }

            // تحديث حالة الشاشة
            updateScreenState(screenId) {
                this.previousScreen = this.currentScreen;
                this.currentScreen = screenId;

                if (this.previousScreen) {
                    this.screenStack.push(this.previousScreen);
                }

                // تحديث العنوان
                this.updatePageTitle(screenId);

                // إرسال حدث تغيير الشاشة
                this.dispatchScreenChangeEvent(screenId);
            }

            // عرض نافذة منبثقة
            async showOverlay(overlayId, data = {}) {
                const overlay = this.overlays.get(overlayId);
                if (!overlay) {
                    console.error(`النافذة ${overlayId} غير موجودة`);
                    return false;
                }

                try {
                    // تحضير النافذة
                    if (overlay.controller && overlay.controller.onPrepare) {
                        await overlay.controller.onPrepare(data);
                    }

                    // عرض النافذة
                    overlay.element.style.display = 'flex';
                    overlay.element.classList.add('active');

                    // تشغيل animation
                    await this.runTransition(overlay.element, 'fadeIn');

                    // تفعيل النافذة
                    if (overlay.controller && overlay.controller.onShow) {
                        overlay.controller.onShow(data);
                    }

                    // إدارة التركيز للنوافذ المودال
                    if (overlay.modal) {
                        this.manageFocus(overlay.element);
                        document.body.style.overflow = 'hidden';
                    }

                    return true;

                } catch (error) {
                    console.error('خطأ في عرض النافذة:', error);
                    return false;
                }
            }

            // إخفاء نافذة منبثقة
            async hideOverlay(overlayId) {
                const overlay = this.overlays.get(overlayId);
                if (!overlay) return false;

                try {
                    // تشغيل animation الإخفاء
                    await this.runTransition(overlay.element, 'fadeOut');

                    // إخفاء النافذة
                    overlay.element.style.display = 'none';
                    overlay.element.classList.remove('active');

                    // تنظيف النافذة
                    if (overlay.controller && overlay.controller.onHide) {
                        overlay.controller.onHide();
                    }

                    // استعادة التركيز
                    if (overlay.modal) {
                        document.body.style.overflow = '';
                        this.restoreFocus();
                    }

                    return true;

                } catch (error) {
                    console.error('خطأ في إخفاء النافذة:', error);
                    return false;
                }
            }

            // تشغيل الانتقالات
            async runTransition(element, transitionName) {
                return new Promise((resolve) => {
                    const duration = this.getTransitionDuration(transitionName);

                    element.classList.add(`animate-${transitionName}`);

                    setTimeout(() => {
                        element.classList.remove(`animate-${transitionName}`);
                        resolve();
                    }, duration);
                });
            }

            // الحصول على مدة الانتقال
            getTransitionDuration(transitionName) {
                const durations = {
                    'fadeIn': 300,
                    'fadeOut': 300,
                    'fadeInUp': 500,
                    'fadeOutDown': 500,
                    'slideInRight': 400,
                    'slideOutLeft': 400,
                    'slideInUp': 400,
                    'slideOutDown': 400,
                    'bounceIn': 600,
                    'bounceOut': 400,
                    'zoomIn': 300,
                    'zoomOut': 300
                };

                return durations[transitionName] || 300;
            }

            // معالجة التنقل
            handleNavigation(event) {
                const target = event.target.closest('[data-screen]');
                if (!target) return;

                event.preventDefault();
                const screenId = target.dataset.screen;
                const options = JSON.parse(target.dataset.options || '{}');

                this.showScreen(screenId, options);
            }

            // معالجة لوحة المفاتيح
            handleKeyboard(event) {
                switch (event.key) {
                    case 'Escape':
                        this.handleEscapeKey();
                        break;
                    case 'Tab':
                        this.handleTabKey(event);
                        break;
                    case 'Enter':
                        this.handleEnterKey(event);
                        break;
                }
            }

            // معالجة مفتاح Escape
            handleEscapeKey() {
                // إغلاق النوافذ المنبثقة
                for (const [id, overlay] of this.overlays) {
                    if (overlay.element.classList.contains('active') && !overlay.persistent) {
                        this.hideOverlay(id);
                        break;
                    }
                }
            }

            // معالجة التنقل في المتصفح
            handleBrowserNavigation(event) {
                const hash = window.location.hash.substring(1);
                if (hash && this.screens.has(hash)) {
                    this.showScreen(hash, { skipHistory: true });
                }
            }

            // معالجة تغيير حجم النافذة
            handleResize() {
                // إعادة حساب أحجام العناصر
                this.recalculateLayout();

                // تحديث النوافذ المنبثقة
                this.updateOverlayPositions();
            }

            // معالجة التمرير
            handleScroll() {
                const scrollTop = window.pageYOffset;

                // تحديث الهيدر
                this.updateHeaderOnScroll(scrollTop);

                // تحديث التنقل
                this.updateNavigationOnScroll(scrollTop);
            }

            // تحميل بيانات الشاشة
            async loadScreenData(screen) {
                if (!screen.controller || !screen.controller.loadData) return;

                try {
                    const data = await screen.controller.loadData();
                    screen.data = data;
                    return data;
                } catch (error) {
                    console.error(`خطأ في تحميل بيانات ${screen.id}:`, error);
                    throw error;
                }
            }

            // تحديث تاريخ المتصفح
            updateBrowserHistory(screenId) {
                const url = `#${screenId}`;
                history.pushState({ screenId }, '', url);
            }

            // تحديث عنوان الصفحة
            updatePageTitle(screenId) {
                const titles = {
                    'home': 'جاهزة سفرتك - أشهى الأكل البيتي',
                    'menu': 'المنيو - جاهزة سفرتك',
                    'offers': 'العروض الخاصة - جاهزة سفرتك',
                    'about': 'عن المطعم - جاهزة سفرتك',
                    'contact': 'تواصل معنا - جاهزة سفرتك'
                };

                document.title = titles[screenId] || 'جاهزة سفرتك';
            }

            // تحديث التنقل
            updateNavigation(screenId) {
                // إزالة الفئة النشطة من جميع الروابط
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });

                // إضافة الفئة النشطة للرابط الحالي
                const activeLink = document.querySelector(`[href="#${screenId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }

            // إرسال حدث تغيير الشاشة
            dispatchScreenChangeEvent(screenId) {
                const event = new CustomEvent('screenChanged', {
                    detail: {
                        currentScreen: screenId,
                        previousScreen: this.previousScreen,
                        timestamp: Date.now()
                    }
                });

                document.dispatchEvent(event);
            }

            // إدارة التركيز
            manageFocus(element) {
                this.lastFocusedElement = document.activeElement;

                // العثور على أول عنصر قابل للتركيز
                const focusableElements = element.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );

                if (focusableElements.length > 0) {
                    focusableElements[0].focus();
                }
            }

            // استعادة التركيز
            restoreFocus() {
                if (this.lastFocusedElement) {
                    this.lastFocusedElement.focus();
                    this.lastFocusedElement = null;
                }
            }

            // العودة للشاشة السابقة
            goBack() {
                if (this.screenStack.length > 0) {
                    const previousScreen = this.screenStack.pop();
                    this.showScreen(previousScreen);
                }
            }

            // الحصول على الشاشة الحالية
            getCurrentScreen() {
                return this.currentScreen;
            }

            // الحصول على بيانات الشاشة
            getScreenData(screenId) {
                const screen = this.screens.get(screenId);
                return screen ? screen.data : null;
            }

            // تحديث الحالة العامة
            updateGlobalState(key, value) {
                this.globalState[key] = value;

                // إشعار جميع الشاشات بالتحديث
                for (const [id, screen] of this.screens) {
                    if (screen.controller && screen.controller.onGlobalStateUpdate) {
                        screen.controller.onGlobalStateUpdate(key, value);
                    }
                }
            }

            // الحصول على الحالة العامة
            getGlobalState(key) {
                return key ? this.globalState[key] : this.globalState;
            }
        }

        // ===== تحكم في الشاشات المختلفة =====

        // تحكم الشاشة الرئيسية
        class HomeScreenController {
            async onPrepare(options) {
                console.log('🏠 تحضير الشاشة الرئيسية');
                this.loadStats();
                this.initHeroAnimations();
            }

            onShow(options) {
                console.log('🏠 عرض الشاشة الرئيسية');
                this.startCounterAnimations();
                this.trackPageView('home');
            }

            onHide() {
                console.log('🏠 إخفاء الشاشة الرئيسية');
                this.pauseAnimations();
            }

            loadStats() {
                // تحميل إحصائيات المطعم
                const stats = {
                    customers: 2000,
                    dailyOrders: 500,
                    deliveryTime: 30,
                    experience: 5
                };

                this.animateCounters(stats);
            }

            animateCounters(stats) {
                Object.keys(stats).forEach(key => {
                    const element = document.querySelector(`[data-count="${stats[key]}"]`);
                    if (element) {
                        this.animateCounter(element, stats[key]);
                    }
                });
            }

            animateCounter(element, target) {
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    element.textContent = Math.floor(current);
                }, 30);
            }

            trackPageView(page) {
                // تتبع زيارة الصفحة
                if (typeof gtag !== 'undefined') {
                    gtag('config', 'GA_MEASUREMENT_ID', {
                        page_title: page,
                        page_location: window.location.href
                    });
                }
            }
        }

        // تحكم شاشة المنيو
        class MenuScreenController {
            constructor() {
                this.currentFilter = 'all';
                this.menuItems = [];
                this.filteredItems = [];
            }

            async loadData() {
                if (window.menuSystem && window.menuSystem.menuData) {
                    this.menuItems = window.menuSystem.menuData;
                    return this.menuItems;
                }

                // تحميل من API إذا لزم الأمر
                return [];
            }

            async onPrepare(options) {
                console.log('🍽️ تحضير شاشة المنيو');
                await this.loadData();
                this.initializeFilters();
                this.renderMenuItems();
            }

            onShow(options) {
                console.log('🍽️ عرض شاشة المنيو');
                this.trackPageView('menu');
                this.startItemAnimations();
            }

            initializeFilters() {
                const filterButtons = document.querySelectorAll('.filter-btn');
                filterButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        this.filterMenu(e.target.dataset.category);
                    });
                });
            }

            filterMenu(category) {
                this.currentFilter = category;
                this.filteredItems = category === 'all'
                    ? this.menuItems
                    : this.menuItems.filter(item => item.category === category);

                this.renderMenuItems();
                this.updateActiveFilter(category);
            }

            renderMenuItems() {
                const grid = document.getElementById('menuGrid');
                if (!grid) return;

                grid.innerHTML = this.filteredItems.map(item =>
                    this.createMenuItemHTML(item)
                ).join('');

                this.addItemEventListeners();
            }

            createMenuItemHTML(item) {
                const rating = this.getItemRating(item.id);
                const popularBadge = item.popular ? '<div class="popular-badge">الأكثر طلباً</div>' : '';

                return `
            <div class="menu-item" data-item-id="${item.id}">
                <div class="menu-item-image">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    ${popularBadge}
                </div>
                <div class="menu-item-content">
                    <h3 class="menu-item-title">${item.name}</h3>
                    <p class="menu-item-description">${item.description}</p>
                    ${rating ? `<div class="item-rating">${rating}</div>` : ''}
                    <div class="menu-item-footer">
                        <span class="menu-item-price">${item.price} جنيه</span>
                        <button class="add-to-cart-btn" data-item-id="${item.id}">
                            <i class="fas fa-plus"></i>
                            إضافة
                        </button>
                    </div>
                </div>
            </div>
        `;
            }

            addItemEventListeners() {
                const addButtons = document.querySelectorAll('.add-to-cart-btn');
                addButtons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const itemId = e.target.dataset.itemId;
                        this.addToCart(itemId);
                    });
                });
            }

            addToCart(itemId) {
                if (window.cart) {
                    window.cart.addToCart(itemId);
                }
            }
        }

        // تحكم شاشة العروض
        class OffersScreenController {
            async onPrepare(options) {
                console.log('🎁 تحضير شاشة العروض');
                this.loadOffers();
                this.initOfferCards();
            }

            onShow(options) {
                console.log('🎁 عرض شاشة العروض');
                this.trackPageView('offers');
                this.animateOffers();
            }

            loadOffers() {
                if (window.menuSystem && window.menuSystem.specialOffers) {
                    this.offers = Object.values(window.menuSystem.specialOffers);
                }
            }

            animateOffers() {
                const offerCards = document.querySelectorAll('.offer-card');
                offerCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 200);
                });
            }
        }

        // تحكم شاشة عن المطعم
        class AboutScreenController {
            onPrepare(options) {
                console.log('ℹ️ تحضير شاشة عن المطعم');
                this.initStatAnimations();
            }

            onShow(options) {
                console.log('ℹ️ عرض شاشة عن المطعم');
                this.trackPageView('about');
                this.startStatAnimations();
            }

            startStatAnimations() {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.animateStats();
                            observer.disconnect();
                        }
                    });
                });

                const statsSection = document.querySelector('.about-stats');
                if (statsSection) {
                    observer.observe(statsSection);
                }
            }

            animateStats() {
                const statNumbers = document.querySelectorAll('.stat-number[data-count]');
                statNumbers.forEach(element => {
                    const target = parseInt(element.dataset.count);
                    this.animateCounter(element, target);
                });
            }

            animateCounter(element, target) {
                let current = 0;
                const increment = target / 60;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    element.textContent = Math.floor(current);
                }, 25);
            }
        }

        // تحكم شاشة التواصل
        class ContactScreenController {
            onPrepare(options) {
                console.log('📞 تحضير شاشة التواصل');
                this.initContactForm();
                this.checkWorkingHours();
            }

            onShow(options) {
                console.log('📞 عرض شاشة التواصل');
                this.trackPageView('contact');
            }

            initContactForm() {
                const form = document.getElementById('contactForm');
                if (form) {
                    form.addEventListener('submit', this.handleFormSubmit.bind(this));
                }
            }

            handleFormSubmit(event) {
                event.preventDefault();
                // معالجة إرسال النموذج
                this.showSuccessMessage();
            }

            checkWorkingHours() {
                const now = new Date();
                const hour = now.getHours();
                const isOpen = hour >= 9 && hour < 23;

                const statusElement = document.querySelector('.status.online');
                if (statusElement) {
                    statusElement.textContent = isOpen ? 'مفتوح الآن' : 'مغلق الآن';
                    statusElement.className = `status ${isOpen ? 'online' : 'offline'}`;
                }
            }
        }

        // تحكم نافذة السلة
        class CartOverlayController {
            onPrepare(data) {
                console.log('🛒 تحضير نافذة السلة');
                this.updateCartDisplay();
            }

            onShow(data) {
                console.log('🛒 عرض نافذة السلة');
                this.trackEvent('cart_opened');
            }

            onHide() {
                console.log('🛒 إخفاء نافذة السلة');
            }

            updateCartDisplay() {
                if (window.cart) {
                    window.cart.updateCartDisplay();
                }
            }
        }

        // تحكم نافذة الطلب
        class CheckoutOverlayController {
            onPrepare(data) {
                console.log('💳 تحضير نافذة الطلب');
                this.populateOrderSummary();
                this.initFormValidation();
            }

            onShow(data) {
                console.log('💳 عرض نافذة الطلب');
                this.trackEvent('checkout_started');
            }

            populateOrderSummary() {
                if (window.cart) {
                    window.cart.populateCheckoutSummary();
                }
            }
        }

        // تحكم نافذة النجاح
        class SuccessOverlayController {
            onPrepare(data) {
                console.log('✅ تحضير نافذة النجاح');
                this.setupSuccessData(data);
            }

            onShow(data) {
                console.log('✅ عرض نافذة النجاح');
                this.trackEvent('order_completed');
                this.startConfetti();
            }

            setupSuccessData(data) {
                if (data.orderNumber) {
                    const orderNumberElement = document.getElementById('orderNumber');
                    if (orderNumberElement) {
                        orderNumberElement.textContent = data.orderNumber;
                    }
                }
            }

            startConfetti() {
                // تأثير الاحتفال
                if (typeof confetti !== 'undefined') {
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 }
                    });
                }
            }
        }

        // تحكم شاشة التحميل
        class LoadingOverlayController {
            onShow(data) {
                console.log('⏳ عرض شاشة التحميل');
                this.startLoadingAnimation();
            }

            onHide() {
                console.log('⏳ إخفاء شاشة التحميل');
                this.stopLoadingAnimation();
            }

            startLoadingAnimation() {
                const spinner = document.querySelector('.loading-spinner');
                if (spinner) {
                    spinner.style.animation = 'spin 1s linear infinite';
                }
            }

            stopLoadingAnimation() {
                const spinner = document.querySelector('.loading-spinner');
                if (spinner) {
                    spinner.style.animation = 'none';
                }
            }
        }

        // ===== الوظائف العامة =====

        // إنشاء نسخة عامة من منسق الشاشات
        const screenCoordinator = new ScreenCoordinator();

        // وظائف عامة للاستخدام
        function showScreen(screenId, options = {}) {
            return screenCoordinator.showScreen(screenId, options);
        }

        function showOverlay(overlayId, data = {}) {
            return screenCoordinator.showOverlay(overlayId, data);
        }

        function hideOverlay(overlayId) {
            return screenCoordinator.hideOverlay(overlayId);
        }

        function scrollToSection(sectionId) {
            const section = document.getElementById(sectionId);
            if (section) {
                const headerHeight = 80;
                const targetPosition = section.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // تحديث الحالة
                screenCoordinator.showScreen(sectionId, { skipAnimation: true });
            }
        }

        function closeCheckoutModal() {
            hideOverlay('checkout');
        }

        function closeSuccessModal() {
            hideOverlay('success');
        }

        function trackOrder() {
            const orderNumber = document.getElementById('orderNumber')?.textContent;
            if (orderNumber) {
                window.open(`#track-order?order=${orderNumber}`, '_blank');
            }
        }

        // تصدير للاستخدام العام
        if (typeof window !== 'undefined') {
            window.screenCoordinator = screenCoordinator;
            window.showScreen = showScreen;
            window.showOverlay = showOverlay;
            window.hideOverlay = hideOverlay;
            window.scrollToSection = scrollToSection;
        }

        // تهيئة النظام عند تحميل الصفحة
        document.addEventListener('DOMContentLoaded', function () {
            console.log('🚀 نظام تنسيق الشاشات جاهز للعمل');

            // إخفاء شاشة التحميل بعد التهيئة
            setTimeout(() => {
                hideOverlay('loading');
            }, 2000);
        });

        console.log('🎬 تم تحميل نظام تنسيق الشاشات بنجاح');

