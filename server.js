const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// قاعدة بيانات مؤقتة (في الواقع ستستخدم قاعدة بيانات حقيقية مثل MongoDB أو MySQL)
const users = [];

// إعدادات
app.use(bodyParser.urlencoded({ extended: true }));

// مسار لعرض الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// مسار لمعالجة إنشاء حساب جديد
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    
    // تحقق إذا كان المستخدم موجوداً
    const userExists = users.find(user => user.email === email);
    if (userExists) {
        return res.send('هذا البريد الإلكتروني مسجل بالفعل!');
    }

    // إضافة المستخدم الجديد
    users.push({ username, email, password });
    console.log('المستخدمون المسجلون:', users); // لغرض التجربة
    res.send('تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول.');
});

// مسار لمعالجة تسجيل الدخول
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    // البحث عن المستخدم
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        res.send(`مرحباً بعودتك، ${user.username}!`);
    } else {
        res.send('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
    }
});

// تشغيل الخادم
app.listen(port, () => {
    console.log(`الخادم يعمل على http://localhost:${port}`);
});
