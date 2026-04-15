const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public')); // تشغيل الملفات الثابتة من مجلد public

// قاعدة بيانات وهمية (مصفوفة)
let users = [];

// مسار إنشاء حساب
app.post('/api/signup', (req, res) => {
    const { username, password, fullName } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'اسم المستخدم موجود بالفعل' });
    }
    const newUser = { 
        username, password, fullName, 
        bio: '', dob: '', socials: '', profilePic: 'https://via.placeholder.com/150'
    };
    users.push(newUser);
    res.json({ message: 'تم التسجيل بنجاح', user: newUser });
});

// مسار تسجيل الدخول
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ message: 'تم تسجيل الدخول', user });
    } else {
        res.status(400).json({ message: 'بيانات الدخول غير صحيحة' });
    }
});

// مسار تحديث الملف الشخصي
app.post('/api/profile/update', (req, res) => {
    const { username, fullName, bio, dob, socials, profilePic } = req.body;
    let userIndex = users.findIndex(u => u.username === username);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], fullName, bio, dob, socials, profilePic };
        res.json({ message: 'تم تحديث الملف الشخصي', user: users[userIndex] });
    } else {
        res.status(404).json({ message: 'المستخدم غير موجود' });
    }
});

// مسار جلب كل الأعضاء
app.get('/api/members', (req, res) => {
    // إخفاء كلمات المرور قبل إرسال البيانات
    const safeUsers = users.map(({password, ...user}) => user);
    res.json(safeUsers);
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
