# بناء the-sfm trader للآيفون بدون Mac

هذا المسار يخليك تبني تطبيق iPhone خاص باستخدام GitHub Actions على Mac سحابي.

## الوضع الحالي

تم تجهيز:

- مشروع iOS: `ios/App/App.xcodeproj`
- Workflow فحص بدون توقيع: `.github/workflows/ios-simulator-check.yml`
- Workflow بناء IPA موقّع: `.github/workflows/ios-private-ipa.yml`
- Workflow اختياري لرفع TestFlight من نفس البناء

## أفضل خيار خاص لك الآن

استخدم TestFlight كنسخة خاصة لك فقط. التطبيق لا يظهر للعامة في App Store.

الترتيب:

1. ترفع المشروع إلى GitHub private repository.
2. تضيف Apple signing secrets في GitHub.
3. تشغل Workflow باسم `iOS Private IPA`.
4. تختار `upload_testflight = true`.
5. يطلع التطبيق في TestFlight خاص لك.

## المطلوب من Apple

تحتاج حساب Apple Developer.

ثم من Apple Developer / App Store Connect جهز:

- Bundle ID:
  ```text
  com.malq.thesfmtrader
  ```
- App Store Connect app باسم:
  ```text
  the-sfm trader
  ```
- Apple Distribution certificate بصيغة `.p12`
- Provisioning Profile مناسب لـ App Store / TestFlight
- App Store Connect API Key بصيغة `.p8`

## GitHub Secrets المطلوبة

داخل GitHub repository:

`Settings` -> `Secrets and variables` -> `Actions` -> `New repository secret`

أضف:

```text
APPLE_TEAM_ID
IOS_CERTIFICATE_BASE64
IOS_CERTIFICATE_PASSWORD
IOS_PROVISION_PROFILE_BASE64
APP_STORE_CONNECT_KEY_ID
APP_STORE_CONNECT_ISSUER_ID
APP_STORE_CONNECT_API_KEY_BASE64
```

## تحويل الملفات إلى Base64 على Windows

استخدم السكربت:

```powershell
.\tools\to-base64-secret.ps1 "C:\path\certificate.p12"
```

راح ينسخ النص إلى clipboard. حطه في GitHub Secret.

كررها مع:

```powershell
.\tools\to-base64-secret.ps1 "C:\path\profile.mobileprovision"
.\tools\to-base64-secret.ps1 "C:\path\AuthKey_XXXXXX.p8"
```

## تشغيل Workflow الخاص

من GitHub:

1. افتح تبويب `Actions`.
2. اختر `iOS Private IPA`.
3. اضغط `Run workflow`.
4. اترك `server_url` على:

```text
http://192.168.255.180:4173
```

إذا بتجرب TestFlight من خارج البيت لاحقاً، لازم يكون السيرفر HTTPS ثابت، مثال:

```text
https://api.the-sfm-trader.com
```

5. اختر:

```text
upload_testflight = true
export_method = app-store-connect
```

## فحص المشروع بدون توقيع

قبل شهادات Apple تقدر تشغل:

```text
iOS Simulator Check
```

هذا فقط يتأكد أن مشروع iOS يبني على Mac سحابي، لكنه لا يعطيك تطبيق يركب على آيفون.

## ملاحظات مهمة

- الآيفون لا يقبل تطبيق حقيقي بدون توقيع Apple.
- بدون Mac، أفضل طريقة خاصة هي TestFlight عبر cloud build.
- TestFlight مناسب للتطوير الخاص قبل App Store.
- عند النشر العام لاحقاً نحتاج HTTPS ثابت، Privacy Policy، وصف App Store، وسكرينشوتات.
