// ملف بيانات المنيو الكامل - جاهزة سفرتك
// تم تطويره ليكون نظام متكامل للمطعم

// بيانات المنيو الرئيسية
const menuData = [
    // الأطباق الرئيسية - Main Dishes
    {
        id: 'main_001',
        name: 'محشي ورق عنب',
        description: 'ورق عنب طازج محشي بالأرز والخضار والبهارات الشرقية، مطبوخ في مرق الدجاج الطبيعي',
        price: 500,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: true,
        ingredients: ['ورق عنب طازج', 'أرز مصري', 'بقدونس', 'طماطم', 'بصل', 'بهارات شرقية'],
        prepTime: 45,
        servings: 2,
        calories: 320,
        spiceLevel: 'mild',
        dietary: ['نباتي'],
        allergens: []
    },
    {
        id: 'main_002',
        name: 'صينية جلاش باللحمة',
        description: 'عجين جلاش رقيق ومقرمش محشو باللحمة المفرومة المتبلة والبصل المكرمل',
        price: 65,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: false,
        ingredients: ['عجين جلاش', 'لحمة مفرومة طازجة', 'بصل', 'توابل شرقية', 'زيت الطبخ'],
        prepTime: 50,
        servings: 3,
        calories: 480,
        spiceLevel: 'medium',
        dietary: ['يحتوي على لحوم'],
        allergens: ['جلوتين']
    },
    {
        id: 'main_003',
        name: 'محشي كوسة وباذنجان',
        description: 'كوسة وباذنجان محشي بخلطة الأرز واللحمة المفرومة في صلصة طماطم منزلية',
        price: 55,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: true,
        ingredients: ['كوسة طازجة', 'باذنجان', 'أرز', 'لحمة مفرومة', 'صلصة طماطم منزلية'],
        prepTime: 60,
        servings: 2,
        calories: 380,
        spiceLevel: 'mild',
        dietary: ['يحتوي على لحوم'],
        allergens: []
    },
    {
        id: 'main_004',
        name: 'دجاج محشي بالأرز',
        description: 'دجاجة كاملة طازجة محشية بالأرز المبهر والمكسرات والكبدة المقطعة',
        price: 85,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: true,
        ingredients: ['دجاجة كاملة طازجة', 'أرز بسمتي', 'كبدة دجاج', 'مكسرات متنوعة', 'بهارات خاصة'],
        prepTime: 90,
        servings: 4,
        calories: 520,
        spiceLevel: 'medium',
        dietary: ['غني بالبروتين', 'يحتوي على لحوم'],
        allergens: ['مكسرات']
    },
    {
        id: 'main_005',
        name: 'كوارع بالشوربة',
        description: 'كوارع خروف طرية مطبوخة ببطء في شوربة غنية مع الخضار الطازجة',
        price: 75,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: false,
        ingredients: ['كوارع خروف طازجة', 'جزر', 'بطاطس', 'طماطم', 'بصل', 'توابل الشوربة'],
        prepTime: 150,
        servings: 3,
        calories: 450,
        spiceLevel: 'mild',
        dietary: ['غني بالكولاجين', 'يحتوي على لحوم'],
        allergens: []
    },
    {
        id: 'main_006',
        name: 'ملوخية بالفراخ',
        description: 'ملوخية خضراء طازجة مع قطع الدجاج الطرية وشوربة الدجاج الغنية',
        price: 60,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: true,
        ingredients: ['ملوخية طازجة', 'قطع دجاج', 'شوربة دجاج', 'ثوم', 'كزبرة'],
        prepTime: 40,
        servings: 2,
        calories: 340,
        spiceLevel: 'mild',
        dietary: ['يحتوي على لحوم'],
        allergens: []
    },

    // المقبلات والسلطات - Appetizers & Salads
    {
        id: 'app_001',
        name: 'حمص بالطحينة',
        description: 'حمص مسلوق ومهروس ناعم مع طحينة طازجة وزيت زيتون بكر وثوم',
        price: 25,
        category: 'appetizers',
        image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: true,
        ingredients: ['حمص مسلوق', 'طحينة طازجة', 'ثوم', 'ليمون طازج', 'زيت زيتون بكر'],
        prepTime: 20,
        servings: 2,
        calories: 180,
        spiceLevel: 'mild',
        dietary: ['نباتي', 'خالي من الجلوتين'],
        allergens: ['سمسم']
    },
    {
        id: 'app_002',
        name: 'بابا غنوج',
        description: 'باذنجان مشوي على الفحم ومهروس مع طحينة وثوم وليمون طازج',
        price: 30,
        category: 'appetizers',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: false,
        ingredients: ['باذنجان مشوي', 'طحينة', 'ثوم', 'ليمون طازج', 'بقدونس'],
        prepTime: 35,
        servings: 2,
        calories: 120,
        spiceLevel: 'mild',
        dietary: ['نباتي', 'خالي من الجلوتين'],
        allergens: ['سمسم']
    },
    {
        id: 'app_003',
        name: 'سلطة فتوش',
        description: 'خضار مشكلة طازجة مع الخبز المحمص المقرمش والسماق الحامض',
        price: 20,
        category: 'appetizers',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: true,
        ingredients: ['خس طازج', 'طماطم', 'خيار', 'فجل', 'خبز محمص', 'سماق', 'زيت زيتون'],
        prepTime: 15,
        servings: 2,
        calories: 95,
        spiceLevel: 'mild',
        dietary: ['نباتي'],
        allergens: ['جلوتين']
    },
    {
        id: 'app_004',
        name: 'شوربة عدس',
        description: 'شوربة عدس أحمر كريمية مع الخضار والكمون والليمون',
        price: 18,
        category: 'appetizers',
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: false,
        ingredients: ['عدس أحمر', 'جزر', 'بصل', 'كمون', 'ليمون طازج', 'زيت زيتون'],
        prepTime: 30,
        servings: 1,
        calories: 160,
        spiceLevel: 'mild',
        dietary: ['نباتي', 'غني بالبروتين'],
        allergens: []
    },
    {
        id: 'app_005',
        name: 'متبل باذنجان',
        description: 'باذنجان مشوي متبل بالثوم والبقدونس وعصير الليمون الطازج',
        price: 28,
        category: 'appetizers',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: true,
        ingredients: ['باذنجان مشوي', 'ثوم', 'بقدونس طازج', 'ليمون', 'زيت زيتون بكر'],
        prepTime: 25,
        servings: 2,
        calories: 110,
        spiceLevel: 'medium',
        dietary: ['نباتي', 'خالي من الجلوتين'],
        allergens: []
    },
    {
        id: 'app_006',
        name: 'سلطة طحينة',
        description: 'سلطة خضراء متنوعة بصلصة الطحينة الكريمية والليمون',
        price: 22,
        category: 'appetizers',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: false,
        ingredients: ['خضار مشكلة', 'طحينة', 'ليمون', 'ثوم', 'زيت زيتون'],
        prepTime: 15,
        servings: 2,
        calories: 140,
        spiceLevel: 'mild',
        dietary: ['نباتي'],
        allergens: ['سمسم']
    },

    // الأرز والمكرونة - Rice & Pasta
    {
        id: 'rice_001',
        name: 'أرز بالبسطرمة',
        description: 'أرز بسمتي عطري مطبوخ مع البسطرمة الشهية والخضار الملونة',
        price: 50,
        category: 'rice',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: true,
        ingredients: ['أرز بسمتي', 'بسطرمة عالية الجودة', 'جزر', 'بازلاء', 'مرق دجاج طبيعي'],
        prepTime: 35,
        servings: 2,
        calories: 420,
        spiceLevel: 'medium',
        dietary: ['يحتوي على لحوم'],
        allergens: []
    },
    {
        id: 'rice_002',
        name: 'مكرونة بشاميل',
        description: 'مكرونة إيطالية مخبوزة بصلصة البشاميل الكريمية واللحمة المفرومة والجبن',
        price: 45,
        category: 'rice',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: false,
        ingredients: ['مكرونة إيطالية', 'لحمة مفرومة', 'صلصة بشاميل', 'جبن رومي مبشور'],
        prepTime: 45,
        servings: 3,
        calories: 480,
        spiceLevel: 'mild',
        dietary: ['يحتوي على لحوم', 'منتجات ألبان'],
        allergens: ['جلوتين', 'لاكتوز']
    },
    {
        id: 'rice_003',
        name: 'أرز بخاري',
        description: 'أرز بخاري عطري بقطع اللحم الطرية والجزر المحلى والزبيب واللوز',
        price: 70,
        category: 'rice',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: true,
        ingredients: ['أرز بسمتي عطري', 'لحم خروف طري', 'جزر محلى', 'زبيب', 'لوز محمص', 'بهارات بخارية'],
        prepTime: 80,
        servings: 3,
        calories: 550,
        spiceLevel: 'medium',
        dietary: ['يحتوي على لحوم'],
        allergens: ['مكسرات']
    },
    {
        id: 'rice_004',
        name: 'مكرونة نجرسكو',
        description: 'مكرونة كريمية مع قطع الدجاج الطرية والفطر الطازج في صلصة بيضاء',
        price: 55,
        category: 'rice',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: false,
        ingredients: ['مكرونة', 'قطع دجاج طرية', 'فطر طازج', 'كريمة طبخ', 'جبن بارميزان'],
        prepTime: 40,
        servings: 2,
        calories: 520,
        spiceLevel: 'mild',
        dietary: ['يحتوي على لحوم', 'منتجات ألبان'],
        allergens: ['جلوتين', 'لاكتوز']
    },
    {
        id: 'rice_005',
        name: 'أرز أصفر بالدجاج',
        description: 'أرز أصفر بالكركم مع قطع الدجاج المشوية والخضار',
        price: 48,
        category: 'rice',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: true,
        ingredients: ['أرز بسمتي', 'قطع دجاج مشوية', 'كركم', 'جزر', 'فاصوليا خضراء'],
        prepTime: 45,
        servings: 2,
        calories: 380,
        spiceLevel: 'mild',
        dietary: ['يحتوي على لحوم'],
        allergens: []
    },

    // الحلويات - Desserts
    {
        id: 'dessert_001',
        name: 'أم علي',
        description: 'حلوى أم علي التقليدية الدافئة بالعجين المقرمش واللبن والمكسرات والزبيب',
        price: 25,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: true,
        ingredients: ['عجين مقرمش', 'لبن طازج', 'فستق حلبي', 'زبيب', 'جوز هند', 'لوز'],
        prepTime: 25,
        servings: 2,
        calories: 320,
        spiceLevel: 'none',
        dietary: ['حلوى تقليدية', 'منتجات ألبان'],
        allergens: ['جلوتين', 'لاكتوز', 'مكسرات']
    },
    {
        id: 'dessert_002',
        name: 'مهلبية',
        description: 'مهلبية كريمية ناعمة بالحليب الطازج والنشا مزينة بالمكسرات المحمصة',
        price: 20,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: false,
        ingredients: ['حليب طازج', 'نشا', 'سكر', 'فانيليا', 'لوز مقشر محمص'],
        prepTime: 30,
        servings: 2,
        calories: 180,
        spiceLevel: 'none',
        dietary: ['منتجات ألبان'],
        allergens: ['لاكتوز', 'مكسرات']
    },
    {
        id: 'dessert_003',
        name: 'كنافة نابلسية',
        description: 'كنافة ناعمة ذهبية محشوة بالجبن الحلو الطري والقطر العطري',
        price: 35,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: true,
        ingredients: ['كنافة ناعمة', 'جبن عكاوي حلو', 'قطر عطري', 'فستق حلبي مفروم'],
        prepTime: 40,
        servings: 2,
        calories: 450,
        spiceLevel: 'none',
        dietary: ['حلوى شرقية', 'منتجات ألبان'],
        allergens: ['جلوتين', 'لاكتوز', 'مكسرات']
    },
    {
        id: 'dessert_004',
        name: 'رز باللبن',
        description: 'رز باللبن التقليدي الكريمي بالفانيليا الطبيعية والقرفة المطحونة',
        price: 22,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: true,
        ingredients: ['رز مصري', 'لبن طازج', 'سكر', 'فانيليا طبيعية', 'قرفة مطحونة'],
        prepTime: 50,
        servings: 3,
        calories: 280,
        spiceLevel: 'none',
        dietary: ['منتجات ألبان'],
        allergens: ['لاكتوز']
    },
    {
        id: 'dessert_005',
        name: 'بسبوسة',
        description: 'بسبوسة طرية بجوز الهند والسميد مشربة بالقطر العطري',
        price: 18,
        category: 'desserts',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: false,
        ingredients: ['سميد', 'جوز هند', 'لبن رايب', 'قطر', 'لوز للتزيين'],
        prepTime: 35,
        servings: 4,
        calories: 250,
        spiceLevel: 'none',
        dietary: ['حلوى شرقية'],
        allergens: ['جلوتين', 'لاكتوز', 'مكسرات']
    }
];

// العروض الخاصة
const specialOffers = {
    'family-meal': {
        id: 'family-meal',
        name: 'وجبة العائلة الكاملة',
        description: '3 أطباق رئيسية + 2 مقبلات + خبز + حلوى + مشروبات',
        originalPrice: 220,
        salePrice: 180,
        discount: 40,
        savings: 18, // نسبة التوفير
        items: [
            { id: 'main_001', name: 'محشي ورق عنب', quantity: 1 },
            { id: 'main_003', name: 'محشي كوسة وباذنجان', quantity: 1 },
            { id: 'main_006', name: 'ملوخية بالفراخ', quantity: 1 },
            { id: 'app_001', name: 'حمص بالطحينة', quantity: 1 },
            { id: 'app_003', name: 'سلطة فتوش', quantity: 1 },
            { id: 'dessert_001', name: 'أم علي', quantity: 1 }
        ],
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: true,
        validUntil: '2025-12-31',
        minOrderValue: 0,
        maxPerCustomer: 2
    },
    'quick-meal': {
        id: 'quick-meal',
        name: 'وجبة سريعة',
        description: 'طبق رئيسي + مقبلة + مشروب + خبز',
        originalPrice: 85,
        salePrice: 65,
        discount: 20,
        savings: 24,
        items: [
            { id: 'rice_001', name: 'أرز بالبسطرمة', quantity: 1 },
            { id: 'app_004', name: 'شوربة عدس', quantity: 1 }
        ],
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: false,
        validUntil: '2025-12-31',
        minOrderValue: 0,
        maxPerCustomer: 1
    },
    'breakfast-deal': {
        id: 'breakfast-deal',
        name: 'فطار شامي كامل',
        description: 'حمص + بابا غنوج + متبل + سلطة + خبز + شاي',
        originalPrice: 75,
        salePrice: 55,
        discount: 20,
        savings: 27,
        items: [
            { id: 'app_001', name: 'حمص بالطحينة', quantity: 1 },
            { id: 'app_002', name: 'بابا غنوج', quantity: 1 },
            { id: 'app_005', name: 'متبل باذنجان', quantity: 1 },
            { id: 'app_003', name: 'سلطة فتوش', quantity: 1 }
        ],
        image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: true,
        validUntil: '2025-12-31',
        minOrderValue: 0,
        maxPerCustomer: 1
    },
    'dessert-combo': {
        id: 'dessert-combo',
        name: 'تشكيلة حلويات',
        description: 'أم علي + كنافة + رز باللبن + مهلبية',
        originalPrice: 102,
        salePrice: 75,
        discount: 27,
        savings: 26,
        items: [
            { id: 'dessert_001', name: 'أم علي', quantity: 1 },
            { id: 'dessert_003', name: 'كنافة نابلسية', quantity: 1 },
            { id: 'dessert_004', name: 'رز باللبن', quantity: 1 },
            { id: 'dessert_002', name: 'مهلبية', quantity: 1 }
        ],
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
        popular: false,
        validUntil: '2025-12-31',
        minOrderValue: 0,
        maxPerCustomer: 1
    }
};

// فئات المنيو
const menuCategories = {
    all: {
        name: 'جميع الأطباق',
        description: 'كامل منيو المطعم',
        icon: 'fas fa-th-large',
        color: '#6C3FBF'
    },
    main: {
        name: 'الأطباق الرئيسية',
        description: 'أطباق مشبعة ولذيذة للوجبات الأساسية',
        icon: 'fas fa-utensils',
        color: '#FF6B6B'
    },
    appetizers: {
        name: 'المقبلات والسلطات',
        description: 'مقبلات شهية وسلطات طازجة',
        icon: 'fas fa-leaf',
        color: '#4ECDC4'
    },
    rice: {
        name: 'الأرز والمكرونة',
        description: 'أطباق الأرز والمكرونة المتنوعة',
        icon: 'fas fa-seedling',
        color: '#45B7D1'
    },
    desserts: {
        name: 'الحلويات',
        description: 'حلويات شرقية وتقليدية',
        icon: 'fas fa-birthday-cake',
        color: '#F9CA24'
    }
};

// إعدادات التوصيل والأسعار
const deliverySettings = {
    zones: {
        'downtown': {
            id: 'downtown',
            name: 'وسط المدينة',
            fee: 15,
            deliveryTime: '20-30 دقيقة',
            areas: ['وسط البلد', 'الحمراء', 'العتبة', 'رمسيس', 'الأزهر'],
            minOrder: 30
        },
        'suburbs': {
            id: 'suburbs',
            name: 'الضواحي القريبة',
            fee: 25,
            deliveryTime: '30-45 دقيقة',
            areas: ['مصر الجديدة', 'المعادي', 'الزمالك', 'المهندسين', 'الدقي'],
            minOrder: 50
        },
        'outskirts': {
            id: 'outskirts',
            name: 'الأطراف البعيدة',
            fee: 35,
            deliveryTime: '45-60 دقيقة',
            areas: ['التجمع الخامس', 'أكتوبر', 'الشروق', 'العبور', 'الرحاب'],
            minOrder: 80
        }
    },
    freeDeliveryMinimum: 150, // الحد الأدنى للتوصيل المجاني
    firstOrderDiscount: 20, // خصم الطلب الأول بالنسبة المئوية
    maxDiscountAmount: 50, // أقصى مبلغ خصم
    serviceFee: 0, // رسوم خدمة إضافية
    taxRate: 0, // ضريبة القيمة المضافة
    packagingFee: 5 // رسوم التغليف
};

// كوبونات الخصم
const promoCodes = {
    'WELCOME25': {
        id: 'WELCOME25',
        name: 'ترحيب بالعملاء الجدد',
        description: 'خصم 25% للعملاء الجدد',
        type: 'percentage',
        value: 25,
        minOrder: 80,
        maxDiscount: 60,
        validFrom: '2025-01-01',
        validUntil: '2025-12-31',
        usageLimit: 1,
        forNewCustomers: true,
        active: true
    },
    'FAMILY20': {
        id: 'FAMILY20',
        name: 'خصم العائلة',
        description: 'خصم 20% على الطلبات العائلية الكبيرة',
        type: 'percentage',
        value: 20,
        minOrder: 200,
        maxDiscount: 80,
        validFrom: '2025-01-01',
        validUntil: '2025-12-31',
        usageLimit: null,
        forNewCustomers: false,
        active: true
    },
    'SAVE30': {
        id: 'SAVE30',
        name: 'وفر 30 جنيه',
        description: 'خصم ثابت 30 جنيه على أي طلب',
        type: 'fixed',
        value: 30,
        minOrder: 120,
        maxDiscount: 30,
        validFrom: '2025-01-01',
        validUntil: '2025-06-30',
        usageLimit: 2,
        forNewCustomers: false,
        active: true
    },
    'WEEKEND15': {
        id: 'WEEKEND15',
        name: 'خصم عطلة نهاية الأسبوع',
        description: 'خصم 15% في الجمعة والسبت',
        type: 'percentage',
        value: 15,
        minOrder: 100,
        maxDiscount: 45,
        validFrom: '2025-01-01',
        validUntil: '2025-12-31',
        usageLimit: null,
        forNewCustomers: false,
        active: true,
        daysOfWeek: ['friday', 'saturday']
    }
};

// معلومات المطعم
const storeSettings = {
    name: 'جاهزة سفرتك',
    slogan: 'طعم البيت الأصيل على سفرتك',
    phone: '01013577712',
    whatsapp: '01013407772',
    email: 'info@jaheezasofretk.com',
    address: 'الأسكندرية، مصر',
    socialMedia: {
        facebook: 'https://www.facebook.com/share/15uB4Qbmas/',
        instagram: 'instagram.com/sofrtk_gahza45%3Figshid%3DMzNlNGNkZWQ4Mg%3D%3D',
    },
    workingHours: {
        sunday: { open: '09:00', close: '23:00', isOpen: true },
        monday: { open: '09:00', close: '23:00', isOpen: true },
        tuesday: { open: '09:00', close: '23:00', isOpen: true },
        wednesday: { open: '09:00', close: '23:00', isOpen: true },
        thursday: { open: '09:00', close: '23:00', isOpen: true },
        friday: { open: '09:00', close: '23:30', isOpen: true },
        saturday: { open: '09:00', close: '23:30', isOpen: true }
    },
    orderSettings: {
        minOrderAmount: 30,
        maxOrderAmount: 2000,
        prepTimeBuffer: 10, // وقت إضافي للتحضير
        advanceOrderDays: 2, // أيام الطلب المسبق
        maxItemsPerOrder: 50
    },
    paymentMethods: ['cash', 'card', 'mobile_wallet'],
    currencies: {
        primary: 'EGP',
        symbol: 'ج',
        name: 'جنيه مصري'
    }
};

// تقييمات العملاء (نموذج)
const customerReviews = {
    'main_001': {
        averageRating: 4.8,
        totalReviews: 324,
        distribution: { 5: 250, 4: 58, 3: 12, 2: 3, 1: 1 },
        recentReviews: [
            {
                id: 'rev_001',
                customerName: 'أحمد محمد',
                rating: 5,
                comment: 'محشي ورق العنب رائع جداً! طعم البيت الحقيقي',
                date: '2025-01-20',
                verified: true,
                helpful: 15
            },
            {
                id: 'rev_002',
                customerName: 'فاطمة علي',
                rating: 5,
                comment: 'أفضل محشي أكلته، التوصيل سريع والطعم ممتاز',
                date: '2025-01-19',
                verified: true,
                helpful: 12
            }
        ]
    },
    'main_003': {
        averageRating: 4.9,
        totalReviews: 287,
        distribution: { 5: 235, 4: 40, 3: 8, 2: 3, 1: 1 },
        recentReviews: [
            {
                id: 'rev_003',
                customerName: 'سارة أحمد',
                rating: 5,
                comment: 'محشي الكوسة والباذنجان تحفة! الطعم والجودة ممتازين',
                date: '2025-01-18',
                verified: true,
                helpful: 20
            }
        ]
    }
};

// معلومات التغذية
const nutritionInfo = {
    'main_001': {
        calories: 320,
        protein: 12,
        carbs: 52,
        fat: 8,
        fiber: 6,
        sodium: 580,
        sugar: 4,
        cholesterol: 0,
        vitamins: ['C', 'K', 'Folate'],
        minerals: ['Iron', 'Magnesium']
    },
    'main_002': {
        calories: 480,
        protein: 28,
        carbs: 35,
        fat: 22,
        fiber: 3,
        sodium: 720,
        sugar: 6,
        cholesterol: 65,
        vitamins: ['B12', 'B6'],
        minerals: ['Iron', 'Zinc']
    },
    'app_001': {
        calories: 180,
        protein: 8,
        carbs: 16,
        fat: 10,
        fiber: 7,
        sodium: 350,
        sugar: 2,
        cholesterol: 0,
        vitamins: ['E', 'Folate'],
        minerals: ['Magnesium', 'Phosphorus']
    }
};

// إعدادات المطبخ
const kitchenSettings = {
    maxConcurrentOrders: 25,
    avgPrepTimePerItem: 6,
    kitchenCapacity: {
        main: 15,
        appetizers: 25,
        rice: 12,
        desserts: 20
    },
    rushHours: [
        { start: '12:00', end: '14:30', name: 'وقت الغداء' },
        { start: '19:00', end: '21:30', name: 'وقت العشاء' }
    ],
    rushTimeMultiplier: 1.4,
    qualityCheckTime: 3, // دقائق للفحص النهائي
    specialPreparation: {
        'main_004': 90, // الدجاج المحشي يحتاج وقت أطول
        'rice_003': 80,  // الأرز البخاري
        'dessert_003': 40 // الكنافة
    }
};

// وظائف مساعدة للمنيو
const menuHelpers = {
    // البحث في المنيو
    searchMenu: function (query, options = {}) {
        if (!query || query.trim() === '') return menuData;

        const searchTerm = query.toLowerCase().trim();
        const searchFields = options.fields || ['name', 'description', 'ingredients'];

        return menuData.filter(item => {
            return searchFields.some(field => {
                if (field === 'ingredients' && Array.isArray(item[field])) {
                    return item[field].some(ingredient =>
                        ingredient.toLowerCase().includes(searchTerm)
                    );
                } else if (item[field]) {
                    return item[field].toLowerCase().includes(searchTerm);
                }
                return false;
            });
        });
    },

    // فلترة المنيو حسب الفئة
    filterByCategory: function (category) {
        if (!category || category === 'all') return menuData;
        return menuData.filter(item => item.category === category);
    },

    // فلترة حسب السعر
    filterByPrice: function (minPrice = 0, maxPrice = Infinity) {
        return menuData.filter(item =>
            item.price >= minPrice && item.price <= maxPrice
        );
    },

    // الحصول على الأطباق الشائعة
    getPopularItems: function (limit = null) {
        const popularItems = menuData.filter(item => item.popular);
        return limit ? popularItems.slice(0, limit) : popularItems;
    },

    // فلترة حسب النظام الغذائي
    filterByDietary: function (dietaryType) {
        return menuData.filter(item =>
            item.dietary && item.dietary.some(diet =>
                diet.toLowerCase().includes(dietaryType.toLowerCase())
            )
        );
    },

    // فلترة حسب مستوى الحرارة
    filterBySpiceLevel: function (spiceLevel) {
        return menuData.filter(item => item.spiceLevel === spiceLevel);
    },

    // الحصول على عنصر بالمعرف
    getItemById: function (id) {
        return menuData.find(item => item.id === id);
    },

    // الحصول على عناصر متعددة بالمعرفات
    getItemsByIds: function (ids) {
        return ids.map(id => this.getItemById(id)).filter(item => item);
    },

    // حساب إجمالي السعر لعناصر متعددة
    calculateItemsTotal: function (items) {
        return items.reduce((total, item) => {
            const menuItem = this.getItemById(item.id);
            return total + (menuItem ? menuItem.price * item.quantity : 0);
        }, 0);
    },

    // الحصول على العروض النشطة
    getActiveOffers: function () {
        const today = new Date().toISOString().split('T')[0];
        return Object.values(specialOffers).filter(offer =>
            offer.validUntil >= today && offer.active !== false
        );
    },

    // التحقق من صحة كود الخصم
    validatePromoCode: function (code, subtotal, isFirstOrder = false, orderDate = new Date()) {
        const promo = promoCodes[code.toUpperCase()];

        if (!promo || !promo.active) {
            return { valid: false, message: 'كود الخصم غير صحيح أو غير نشط' };
        }

        // فحص تاريخ الصلاحية
        const today = orderDate.toISOString().split('T')[0];
        if (today < promo.validFrom || today > promo.validUntil) {
            return { valid: false, message: 'كود الخصم منتهي الصلاحية' };
        }

        // فحص الحد الأدنى للطلب
        if (subtotal < promo.minOrder) {
            return {
                valid: false,
                message: `الحد الأدنى للطلب ${promo.minOrder} جنيه`
            };
        }

        // فحص إذا كان للعملاء الجدد فقط
        if (promo.forNewCustomers && !isFirstOrder) {
            return {
                valid: false,
                message: 'هذا الكود متاح للعملاء الجدد فقط'
            };
        }

        // فحص أيام الأسبوع المحددة
        if (promo.daysOfWeek) {
            const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const currentDay = dayNames[orderDate.getDay()];
            if (!promo.daysOfWeek.includes(currentDay)) {
                return {
                    valid: false,
                    message: 'هذا الكود متاح في أيام محددة فقط'
                };
            }
        }

        return { valid: true, promo: promo };
    },

    // حساب الخصم
    calculateDiscount: function (code, subtotal, isFirstOrder = false) {
        const validation = this.validatePromoCode(code, subtotal, isFirstOrder);
        if (!validation.valid) return 0;

        const promo = validation.promo;
        let discountAmount = 0;

        if (promo.type === 'percentage') {
            discountAmount = (subtotal * promo.value) / 100;
        } else if (promo.type === 'fixed') {
            discountAmount = promo.value;
        }

        // تطبيق الحد الأقصى للخصم
        if (promo.maxDiscount) {
            discountAmount = Math.min(discountAmount, promo.maxDiscount);
        }

        return discountAmount;
    },

    // حساب رسوم التوصيل
    calculateDeliveryFee: function (zoneId, subtotal) {
        const zone = deliverySettings.zones[zoneId];
        if (!zone) return 0;

        // توصيل مجاني للطلبات الكبيرة
        if (subtotal >= deliverySettings.freeDeliveryMinimum) {
            return 0;
        }

        return zone.fee;
    },

    // حساب وقت التحضير المتوقع
    calculatePrepTime: function (items) {
        if (!items || items.length === 0) return 0;

        let maxPrepTime = 0;
        items.forEach(item => {
            const menuItem = this.getItemById(item.id);
            if (menuItem) {
                // استخدام وقت خاص إذا كان متوفراً
                const specialTime = kitchenSettings.specialPreparation[item.id];
                const prepTime = specialTime || menuItem.prepTime || 30;
                maxPrepTime = Math.max(maxPrepTime, prepTime);
            }
        });

        // إضافة وقت حسب عدد الأصناف
        const itemTimeBuffer = items.length * kitchenSettings.avgPrepTimePerItem;

        // إضافة وقت الفحص النهائي
        const totalTime = maxPrepTime + itemTimeBuffer + kitchenSettings.qualityCheckTime;

        // فحص ساعات الذروة
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const isRushHour = kitchenSettings.rushHours.some(rush => {
            const [startHour, startMin] = rush.start.split(':').map(Number);
            const [endHour, endMin] = rush.end.split(':').map(Number);
            const rushStart = startHour * 60 + startMin;
            const rushEnd = endHour * 60 + endMin;
            return currentTime >= rushStart && currentTime <= rushEnd;
        });

        return Math.ceil(totalTime * (isRushHour ? kitchenSettings.rushTimeMultiplier : 1));
    },

    // اقتراح أطباق مماثلة
    getSimilarItems: function (itemId, limit = 4) {
        const targetItem = this.getItemById(itemId);
        if (!targetItem) return [];

        return menuData
            .filter(item =>
                item.id !== itemId &&
                item.category === targetItem.category
            )
            .sort((a, b) => {
                // ترتيب حسب الشعبية والتقييم
                const aScore = (a.popular ? 2 : 0) + (customerReviews[a.id]?.averageRating || 0);
                const bScore = (b.popular ? 2 : 0) + (customerReviews[b.id]?.averageRating || 0);
                return bScore - aScore;
            })
            .slice(0, limit);
    },

    // اقتراح أطباق مكملة
    suggestComplementaryItems: function (cartItems, limit = 3) {
        const currentCategories = cartItems.map(item =>
            this.getItemById(item.id)?.category
        ).filter(Boolean);

        const suggestions = [];

        // اقتراح مقبلات إذا كان هناك أطباق رئيسية
        if (currentCategories.includes('main') && !currentCategories.includes('appetizers')) {
            const appetizers = this.filterByCategory('appetizers').filter(item => item.popular);
            suggestions.push(...appetizers.slice(0, 2));
        }

        // اقتراح حلويات
        if (!currentCategories.includes('desserts') && cartItems.length >= 2) {
            const desserts = this.filterByCategory('desserts').filter(item => item.popular);
            suggestions.push(...desserts.slice(0, 1));
        }

        return suggestions.slice(0, limit);
    },

    // فحص المكونات المسببة للحساسية
    checkAllergens: function (items, customerAllergens = []) {
        const foundAllergens = [];

        items.forEach(item => {
            const menuItem = this.getItemById(item.id);
            if (menuItem && menuItem.allergens) {
                menuItem.allergens.forEach(allergen => {
                    if (customerAllergens.some(custAllergen =>
                        allergen.toLowerCase().includes(custAllergen.toLowerCase())
                    )) {
                        foundAllergens.push({
                            itemId: item.id,
                            itemName: menuItem.name,
                            allergen: allergen
                        });
                    }
                });
            }
        });

        return foundAllergens;
    },

    // حساب إجمالي السعرات الحرارية
    calculateTotalCalories: function (items) {
        return items.reduce((total, item) => {
            const nutrition = nutritionInfo[item.id];
            return total + (nutrition ? nutrition.calories * item.quantity : 0);
        }, 0);
    },

    // تنسيق السعر
    formatPrice: function (price, includeCurrency = true) {
        const formatted = price.toFixed(0);
        return includeCurrency ? `${formatted} ${storeSettings.currencies.symbol}` : formatted;
    },

    // تنسيق الوقت
    formatTime: function (minutes) {
        if (minutes < 60) {
            return `${minutes} دقيقة`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return mins > 0 ? `${hours} ساعة و ${mins} دقيقة` : `${hours} ساعة`;
        }
    },

    // الحصول على إحصائيات المنيو
    getMenuStats: function () {
        return {
            totalItems: menuData.length,
            categories: Object.keys(menuCategories).length - 1, // باستثناء 'all'
            popularItems: this.getPopularItems().length,
            priceRange: {
                min: Math.min(...menuData.map(item => item.price)),
                max: Math.max(...menuData.map(item => item.price)),
                average: Math.round(menuData.reduce((sum, item) => sum + item.price, 0) / menuData.length)
            },
            activeOffers: this.getActiveOffers().length,
            activeCoupons: Object.values(promoCodes).filter(code => code.active).length
        };
    }
};

// تصدير البيانات
if (typeof window !== 'undefined') {
    // في المتصفح
    window.menuSystem = {
        menuData,
        specialOffers,
        menuCategories,
        deliverySettings,
        promoCodes,
        storeSettings,
        customerReviews,
        nutritionInfo,
        kitchenSettings,
        menuHelpers
    };

    console.log('📋 نظام المنيو تم تحميله بنجاح');
    console.log(`🍽️ ${menuData.length} صنف متاح`);
    console.log(`🎁 ${Object.keys(specialOffers).length} عرض خاص`);
    console.log(`🏪 ${Object.keys(deliverySettings.zones).length} منطقة توصيل`);

} else if (typeof module !== 'undefined' && module.exports) {
    // في Node.js
    module.exports = {
        menuData,
        specialOffers,
        menuCategories,
        deliverySettings,
        promoCodes,
        storeSettings,
        customerReviews,
        nutritionInfo,
        kitchenSettings,
        menuHelpers
    };
}

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function () {
    console.log('🎯 ملف بيانات المنيو جاهز للاستخدام');

    // عرض إحصائيات سريعة
    if (typeof window !== 'undefined' && window.menuSystem) {
        const stats = window.menuSystem.menuHelpers.getMenuStats();
        console.log('📊 إحصائيات المنيو:', stats);
    }
});
