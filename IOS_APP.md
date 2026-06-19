# the-sfm trader iPhone App

تم تجهيز مشروع iOS حقيقي باستخدام Capacitor داخل:

```text
ios/App/App.xcodeproj
```

## ماذا يعمل التطبيق؟

- يفتح منصة the-sfm trader داخل تطبيق iPhone مستقل.
- يستخدم الأيقونة والـ splash الخاصين بـ the-sfm trader.
- مضبوط حالياً على رابط السيرفر المحلي:

```text
http://192.168.255.180:4173
```

## التشغيل على الآيفون الخاص

هذه الخطوات تحتاج Mac عليه Xcode:

1. انقل مجلد المشروع إلى Mac.
2. افتح Terminal داخل مجلد المشروع.
3. شغل:

```bash
npm install
npm run ios:sync
npm run ios:open
```

## إذا ما عندك Mac

استخدم ملف البناء السحابي:

```text
CLOUD_IOS_BUILD.md
```

فيه طريقة GitHub Actions لبناء IPA خاص ورفعه إلى TestFlight بدون Mac محلي.

4. داخل Xcode:
   - افتح Target باسم `App`.
   - ادخل تبويب `Signing & Capabilities`.
   - اختر Apple ID / Team الخاص فيك.
   - وصل الآيفون بالكيبل.
   - اختر جهازك من أعلى Xcode.
   - اضغط Run.

## إذا تغير IP الكمبيوتر

غير الرابط في:

```text
capacitor.config.json
```

ثم شغل:

```bash
npm run ios:sync
```

## ملاحظات App Store

قبل رفعه إلى App Store نحتاج:

- استضافة backend على رابط HTTPS ثابت.
- تغيير `server.url` من IP محلي إلى رابط HTTPS.
- إضافة Privacy Policy.
- تجهيز وصف وصور App Store.
- مراجعة نصوص المخاطر: التطبيق تعليمي وليس نصيحة مالية.
- إزالة السماح العام للـ HTTP من `Info.plist` قبل النشر الرسمي.

## TestFlight

بعد بناء التطبيق في Xcode، يمكن رفعه إلى App Store Connect وتجربته عبر TestFlight قبل النشر العام.
