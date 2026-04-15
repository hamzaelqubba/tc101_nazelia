const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// --- قواعد بيانات مؤقتة ---
const users = []; // لتخزين المستخدمين
const posts = []; // لتخزين المنشورات

// --- إعدادات ---
app.use(bodyParser.urlencoded({ extended: true }));
// لخدمة ملفات CSS و JS
app.use(express.static(__dirname));

// --- المسارات (Routes) ---

// 1. عرض صفحة التسجيل/الدخول
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. معالجة إنشاء حساب
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    if (users.find(u => u.email === email)) {
        return res.send('هذا البريد الإلكتروني مسجل بالفعل!');
    }
    users.push({ username, email, password });
    res.send('تم إنشاء حسابك بنجاح! <a href="/">عد لتسجيل الدخول</a>');
});

// 3. معالجة تسجيل الدخول (*** تحديث مهم هنا ***)
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // بدلاً من إرسال رسالة، نوجهه إلى الصفحة الرئيسية مع تمرير اسم المستخدم
        res.redirect(`/home?username=${user.username}`);
    } else {
        res.send('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    }
});

// 4. عرض الصفحة الرئيسية مع المنشورات (*** مسار جديد ***)
app.get('/home', (req, res) => {
    //  إرسال ملف home.html
    res.sendFile(path.join(__dirname, 'home.html'));
});


// 5. مسار لجلب المنشورات كـ JSON (*** مسار جديد ***)
// سيقوم الفرونت اند بطلب هذه البيانات
app.get('/posts', (req, res) => {
    // نعكس ترتيب المنشورات لعرض الأحدث أولاً
    res.json(posts.slice().reverse());
});


// 6. معالجة منشور جديد (*** مسار جديد ***)
app.post('/post', (req, res) => {
    const { postContent, username } = req.body;
    
    if (postContent && username) {
        const newPost = {
            author: username,
            content: postContent,
            timestamp: new Date().toLocaleString('ar-EG') // تاريخ مقروء
        };
        posts.push(newPost);
        console.log("منشور جديد:", newPost);
    }
    // إعادة توجيه المستخدم إلى الصفحة الرئيسية ليرى منشوره الجديد
    res.redirect(`/home?username=${username}`);
});


// --- تشغيل الخادم ---
app.listen(port, () => {
    console.log(`الخادم يعمل على http://localhost:${port}`);
});

