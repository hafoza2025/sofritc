// نظام تكامل تلجرام المتطور
class TelegramBotIntegration {
    constructor() {
        // إعدادات البوت (يجب تغييرها بالبيانات الحقيقية)
        this.botToken = '7829090712:AAEsWLymxnoQqS7g_FuHGL0mypcLsM7Avsw';
        this.chatId = '8146437115';
        this.apiUrl = 'https://api.telegram.org/bot';

        // حالة البوت
        this.isConnected = false;
        this.rateLimitDelay = 1000; // تأخير لتجنب تجاوز الحدود
        this.retryAttempts = 3;

        // قائمة انتظار الرسائل
        this.messageQueue = [];
        this.isProcessingQueue = false;

        this.initialize();
    }

    // تهيئة البوت
    async initialize() {
        console.log('🤖 جاري تهيئة بوت تلجرام...');

        // فحص الاتصال
        const connected = await this.testConnection();
        if (connected) {
            console.log('✅ تم الاتصال ببوت تلجرام بنجاح');
            this.isConnected = true;
            this.startQueueProcessor();
        } else {
            console.warn('⚠️ لم يتم الاتصال ببوت تلجرام - تأكد من إعدادات البوت');
        }
    }

    // فحص الاتصال بالبوت
    async testConnection() {
        try {
            const response = await fetch(`${this.apiUrl}${this.botToken}/getMe`);
            const data = await response.json();
            return data.ok;
        } catch (error) {
            console.error('خطأ في اختبار اتصال تلجرام:', error);
            return false;
        }
    }

    // إرسال رسالة
    async sendMessage(text, parseMode = 'HTML') {
        if (!this.isConnected) {
            console.warn('البوت غير متصل - إضافة الرسالة لقائمة الانتظار');
            this.messageQueue.push({ text, parseMode });
            return false;
        }

        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const response = await fetch(`${this.apiUrl}${this.botToken}/sendMessage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        chat_id: this.chatId,
                        text: text,
                        parse_mode: parseMode
                    })
                });

                const result = await response.json();

                if (result.ok) {
                    console.log('✅ تم إرسال الرسالة لتلجرام');
                    return true;
                } else {
                    throw new Error(result.description || 'خطأ غير معروف');
                }
            } catch (error) {
                console.error(`محاولة ${attempt}/${this.retryAttempts} فشلت:`, error);

                if (attempt === this.retryAttempts) {
                    console.error('❌ فشل في إرسال الرسالة نهائياً');
                    // إضافة لقائمة الانتظار للمحاولة لاحقاً
                    this.messageQueue.push({ text, parseMode });
                    return false;
                }

                // انتظار قبل المحاولة التالية
                await this.delay(this.rateLimitDelay * attempt);
            }
        }

        return false;
    }

    // إرسال رسالة مع صورة
    async sendPhoto(photo, caption = '') {
        if (!this.isConnected) {
            console.warn('البوت غير متصل');
            return false;
        }

        try {
            const response = await fetch(`${this.apiUrl}${this.botToken}/sendPhoto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: this.chatId,
                    photo: photo,
                    caption: caption,
                    parse_mode: 'HTML'
                })
            });

            const result = await response.json();
            return result.ok;
        } catch (error) {
            console.error('خطأ في إرسال الصورة:', error);
            return false;
        }
    }

    // تنسيق رسالة طلب جديد
    formatNewOrderMessage(orderData) {
        const { orderNumber, customer, items, pricing, deliveryZone, timestamp } = orderData;

        // تنسيق قائمة الأصناف
        const itemsList = items.map(item => {
            const itemTotal = item.price * item.quantity;
            const offerIcon = item.isOffer ? ' 🎁' : '';
            const popularIcon = item.popular ? ' ⭐' : '';

            return `• <b>${item.name}</b>${offerIcon}${popularIcon}
  الكمية: ${item.quantity} × ${item.price} ج = <b>${itemTotal} ج</b>`;
        }).join('\n\n');

        // معلومات منطقة التوصيل
        const zoneInfo = this.getZoneInfo(deliveryZone);

        // معلومات الخصم
        const discountInfo = pricing.discount > 0 ?
            `\n💸 <b>خصم طُبق:</b> ${pricing.discount} ج` : '';

        // معلومات التوصيل
        const deliveryInfo = pricing.deliveryFee === 0 ?
            'مجاني 🎉' : `${pricing.deliveryFee} ج`;

        // التوقيت المتوقع للتوصيل
        const estimatedTime = this.calculateEstimatedDelivery(deliveryZone, items.length);

        return `
🍽️ <b>طلب جديد من جاهزة سفرتك</b>

🆔 <b>رقم الطلب:</b> #${orderNumber}
⏰ <b>وقت الطلب:</b> ${new Date(timestamp).toLocaleString('ar-EG')}

👤 <b>بيانات العميل:</b>
📋 الاسم: ${customer.name}
📞 الهاتف: <a href="tel:${customer.phone}">${customer.phone}</a>
📍 العنوان: ${customer.address}

🍴 <b>تفاصيل الطلب:</b>
${itemsList}

💰 <b>ملخص الفاتورة:</b>
المجموع الفرعي: ${pricing.subtotal} ج
رسوم التوصيل: ${deliveryInfo}${discountInfo}
<b>الإجمالي النهائي: ${pricing.total} ج</b>

💳 <b>طريقة الدفع:</b> ${customer.paymentMethod === 'cash' ? 'كاش عند الاستلام 💵' : 'بطاقة ائتمانية 💳'}

🚚 <b>التوصيل:</b>
المنطقة: ${zoneInfo.name}
الوقت المتوقع: ${estimatedTime}

${customer.notes ? `📝 <b>ملاحظات العميل:</b>\n${customer.notes}\n` : ''}

⚡ <b>حالة الطلب:</b> جديد - في انتظار التأكيد
🔔 <b>تذكير:</b> يرجى الرد على هذه الرسالة لتأكيد استلام الطلب

---
<i>تم إرسال هذه الرسالة تلقائياً من نظام جاهزة سفرتك</i>
        `.trim();
    }

    // تنسيق رسالة تحديث حالة الطلب
    formatStatusUpdateMessage(orderNumber, status, additionalInfo = '') {
        const statusMessages = {
            'confirmed': '✅ تم تأكيد الطلب وبدء التحضير',
            'preparing': '👨‍🍳 جاري تحضير الطلب بعناية فائقة',
            'ready': '🎉 الطلب جاهز للتوصيل',
            'on_way': '🚗 الطلب في الطريق إليك الآن',
            'delivered': '✅ تم توصيل الطلب بنجاح - شكراً لاختيارك جاهزة سفرتك!',
            'cancelled': '❌ تم إلغاء الطلب'
        };

        const statusEmojis = {
            'confirmed': '🟡',
            'preparing': '🟠',
            'ready': '🔵',
            'on_way': '🟣',
            'delivered': '🟢',
            'cancelled': '🔴'
        };

        return `
📊 <b>تحديث حالة الطلب</b>

🆔 <b>رقم الطلب:</b> #${orderNumber}
${statusEmojis[status]} <b>الحالة:</b> ${statusMessages[status] || status}
⏰ <b>وقت التحديث:</b> ${new Date().toLocaleString('ar-EG')}

${additionalInfo ? `📋 <b>تفاصيل إضافية:</b>\n${additionalInfo}\n` : ''}

---
<i>نظام التتبع التلقائي - جاهزة سفرتك</i>
        `.trim();
    }

    // إرسال طلب جديد
    async sendNewOrder(orderData) {
        const message = this.formatNewOrderMessage(orderData);
        const success = await this.sendMessage(message);

        if (success) {
            // إرسال رسالة تأكيد منفصلة
            await this.delay(500);
            await this.sendOrderConfirmation(orderData.orderNumber);
        }

        return success;
    }

    // إرسال تأكيد استلام الطلب
    async sendOrderConfirmation(orderNumber) {
        const message = `
🎯 <b>تأكيد استلام الطلب</b>

رقم الطلب: #${orderNumber}
الوقت: ${new Date().toLocaleString('ar-EG')}
الحالة: <b>تم الاستلام ✅</b>

سيتم البدء في التحضير خلال دقائق...

<i>رسالة تأكيد تلقائية</i>
        `.trim();

        return await this.sendMessage(message);
    }

    // إرسال تحديث حالة الطلب
    async sendStatusUpdate(orderNumber, status, additionalInfo = '') {
        const message = this.formatStatusUpdateMessage(orderNumber, status, additionalInfo);
        return await this.sendMessage(message);
    }

    // إرسال تنبيه مشكلة
    async sendErrorAlert(orderNumber, error, context = '') {
        const message = `
🚨 <b>تنبيه: مشكلة في الطلب</b>

🆔 رقم الطلب: #${orderNumber}
❗ نوع المشكلة: ${error}
🕐 الوقت: ${new Date().toLocaleString('ar-EG')}

${context ? `📋 السياق:\n${context}\n` : ''}

⚠️ <b>يُرجى التدخل اليدوي</b>

---
<i>تنبيه تلقائي من النظام</i>
        `.trim();

        return await this.sendMessage(message);
    }

    // إرسال تقرير يومي
    async sendDailyReport(reportData) {
        const { date, totalOrders, totalRevenue, topItems, issues } = reportData;

        const topItemsList = topItems.map((item, index) =>
            `${index + 1}. ${item.name} (${item.orders} طلب)`
        ).join('\n');

        const message = `
📊 <b>التقرير اليومي - جاهزة سفرتك</b>

📅 <b>التاريخ:</b> ${date}

📈 <b>الإحصائيات:</b>
• إجمالي الطلبات: ${totalOrders}
• إجمالي المبيعات: ${totalRevenue} ج
• متوسط قيمة الطلب: ${totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0} ج

🏆 <b>الأصناف الأكثر طلباً:</b>
${topItemsList}

${issues.length > 0 ? `⚠️ <b>المشاكل المسجلة:</b>\n${issues.join('\n')}\n` : ''}

---
<i>تقرير تلقائي يومي</i>
        `.trim();

        return await this.sendMessage(message);
    }

    // معالج قائمة انتظار الرسائل
    async startQueueProcessor() {
        this.isProcessingQueue = true;

        while (this.isProcessingQueue) {
            if (this.messageQueue.length > 0 && this.isConnected) {
                const message = this.messageQueue.shift();
                await this.sendMessage(message.text, message.parseMode);
                await this.delay(this.rateLimitDelay);
            } else {
                await this.delay(5000); // فحص كل 5 ثوانِ
            }
        }
    }

    // إيقاف معالج قائمة الانتظار
    stopQueueProcessor() {
        this.isProcessingQueue = false;
    }

    // الحصول على معلومات المنطقة
    getZoneInfo(zoneId) {
        const zones = {
            'downtown': { name: 'وسط المدينة', time: '20-30' },
            'suburbs': { name: 'الضواحي', time: '30-45' },
            'outskirts': { name: 'الأطراف', time: '45-60' }
        };

        return zones[zoneId] || { name: 'غير محدد', time: '30-45' };
    }

    // حساب الوقت المتوقع للتوصيل
    calculateEstimatedDelivery(zone, itemCount) {
        const zoneInfo = this.getZoneInfo(zone);
        const baseTime = parseInt(zoneInfo.time.split('-')[0]);

        // إضافة وقت حسب عدد الأصناف
        const additionalTime = Math.ceil(itemCount / 3) * 5;

        // فحص ساعات الذروة
        const hour = new Date().getHours();
        const isRushHour = (hour >= 12 && hour <= 14) || (hour >= 19 && hour <= 21);

        const totalTime = baseTime + additionalTime + (isRushHour ? 15 : 0);

        return `${totalTime}-${totalTime + 15} دقيقة`;
    }

    // تأخير (وعد)
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // إعداد البوت بإعدادات جديدة
    configure(botToken, chatId) {
        this.botToken = botToken;
        this.chatId = chatId;
        this.isConnected = false;
        this.initialize();
    }

    // الحصول على إحصائيات البوت
    getStats() {
        return {
            isConnected: this.isConnected,
            queueLength: this.messageQueue.length,
            isProcessing: this.isProcessingQueue
        };
    }
}

// فئة إدارة الطلبات مع تكامل تلجرام
class OrderManager {
    constructor() {
        this.telegram = new TelegramBotIntegration();
        this.currentOrders = new Map();
        this.orderHistory = this.loadOrderHistory();
        this.orderCounter = this.getLastOrderNumber();
    }

    // تحميل سجل الطلبات
    loadOrderHistory() {
        try {
            const saved = localStorage.getItem('jaheeza_order_history');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('خطأ في تحميل سجل الطلبات:', error);
            return [];
        }
    }

    // حفظ سجل الطلبات
    saveOrderHistory() {
        try {
            // الاحتفاظ بآخر 500 طلب فقط
            const limitedHistory = this.orderHistory.slice(-500);
            localStorage.setItem('jaheeza_order_history', JSON.stringify(limitedHistory));
        } catch (error) {
            console.error('خطأ في حفظ سجل الطلبات:', error);
        }
    }

    // الحصول على آخر رقم طلب
    getLastOrderNumber() {
        if (this.orderHistory.length > 0) {
            const lastOrder = this.orderHistory[this.orderHistory.length - 1];
            return parseInt(lastOrder.orderNumber.replace('SF', '')) || 1000;
        }
        return 1000;
    }

    // إنشاء رقم طلب جديد
    generateOrderNumber() {
        this.orderCounter++;
        return `SF${this.orderCounter}`;
    }

    // معالجة طلب جديد
    async processNewOrder(customerData, cartData) {
        try {
            // إنشاء رقم الطلب
            const orderNumber = this.generateOrderNumber();
            const timestamp = new Date().toISOString();

            // إعداد بيانات الطلب
            const orderData = {
                orderNumber,
                timestamp,
                customer: {
                    name: customerData.name,
                    phone: customerData.phone,
                    address: customerData.address,
                    notes: customerData.notes || '',
                    paymentMethod: customerData.paymentMethod || 'cash'
                },
                items: cartData.items,
                pricing: cartData.pricing,
                deliveryZone: cartData.deliveryZone,
                status: 'new',
                appliedPromoCode: cartData.appliedPromoCode
            };

            // حفظ الطلب
            this.currentOrders.set(orderNumber, orderData);
            this.orderHistory.push(orderData);
            this.saveOrderHistory();

            // إرسال الطلب لتلجرام
            const telegramSuccess = await this.telegram.sendNewOrder(orderData);

            if (telegramSuccess) {
                console.log(`✅ تم إرسال الطلب ${orderNumber} لتلجرام`);

                return {
                    success: true,
                    orderNumber,
                    message: 'تم إرسال طلبك بنجاح!',
                    estimatedTime: this.telegram.calculateEstimatedDelivery(
                        cartData.deliveryZone,
                        cartData.items.length
                    )
                };
            } else {
                // حفظ الطلب محلياً حتى لو فشل الإرسال
                console.warn(`⚠️ تم حفظ الطلب ${orderNumber} محلياً - لم يتم الإرسال لتلجرام`);

                return {
                    success: true,
                    orderNumber,
                    message: 'تم حفظ طلبك، سيتم معالجته قريباً',
                    warning: 'قد يكون هناك تأخير في التأكيد'
                };
            }

        } catch (error) {
            console.error('خطأ في معالجة الطلب:', error);

            return {
                success: false,
                message: 'حدث خطأ في معالجة الطلب. يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.',
                error: error.message
            };
        }
    }

    // تحديث حالة الطلب
    async updateOrderStatus(orderNumber, newStatus, additionalInfo = '') {
        const order = this.currentOrders.get(orderNumber);

        if (!order) {
            console.warn(`طلب غير موجود: ${orderNumber}`);
            return false;
        }

        // تحديث الحالة
        order.status = newStatus;
        order.lastUpdated = new Date().toISOString();

        if (additionalInfo) {
            order.statusNotes = order.statusNotes || [];
            order.statusNotes.push({
                timestamp: order.lastUpdated,
                note: additionalInfo
            });
        }

        // إرسال التحديث لتلجرام
        const success = await this.telegram.sendStatusUpdate(
            orderNumber,
            newStatus,
            additionalInfo
        );

        if (success) {
            console.log(`✅ تم تحديث حالة الطلب ${orderNumber} إلى ${newStatus}`);
        }

        return success;
    }

    // البحث عن طلب
    findOrder(orderNumber) {
        return this.currentOrders.get(orderNumber) ||
            this.orderHistory.find(order => order.orderNumber === orderNumber);
    }

    // إحصائيات اليوم
    getTodayStats() {
        const today = new Date().toDateString();
        const todayOrders = this.orderHistory.filter(order =>
            new Date(order.timestamp).toDateString() === today
        );

        const totalRevenue = todayOrders.reduce((sum, order) =>
            sum + order.pricing.total, 0
        );

        // الأصناف الأكثر طلباً
        const itemCounts = {};
        todayOrders.forEach(order => {
            order.items.forEach(item => {
                itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
            });
        });

        const topItems = Object.entries(itemCounts)
            .map(([name, count]) => ({ name, orders: count }))
            .sort((a, b) => b.orders - a.orders)
            .slice(0, 5);

        return {
            date: today,
            totalOrders: todayOrders.length,
            totalRevenue,
            topItems,
            issues: [] // يمكن إضافة نظام تتبع المشاكل
        };
    }

    // إرسال التقرير اليومي
    async sendDailyReport() {
        const stats = this.getTodayStats();
        return await this.telegram.sendDailyReport(stats);
    }

    // تنظيف الطلبات القديمة
    cleanupOldOrders(daysToKeep = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        // إزالة من الطلبات النشطة
        for (const [orderNumber, order] of this.currentOrders.entries()) {
            if (new Date(order.timestamp) < cutoffDate) {
                this.currentOrders.delete(orderNumber);
            }
        }

        // تقليص سجل الطلبات
        this.orderHistory = this.orderHistory.filter(order =>
            new Date(order.timestamp) >= cutoffDate
        );

        this.saveOrderHistory();

        console.log(`🧹 تم تنظيف الطلبات الأقدم من ${daysToKeep} يوم`);
    }
}

// إنشاء نسخة عامة من مدير الطلبات
const orderManager = new OrderManager();

// تصدير للاستخدام العام
if (typeof window !== 'undefined') {
    window.orderManager = orderManager;
    window.telegramBot = orderManager.telegram;
}

// تنظيف الطلبات القديمة كل يوم
setInterval(() => {
    orderManager.cleanupOldOrders();
}, 24 * 60 * 60 * 1000); // كل 24 ساعة

console.log('📱 نظام تكامل تلجرام تم تحميله بنجاح');
