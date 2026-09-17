# إتقان English - أهم كلمات A1 (Remix Remix Remix فوكابلري 3000)

دورة تفاعلية حديثة لتعلم أهم كلمات اللغة الإنجليزية لمستوى A1، مصممة بهوية بصرية مميزة لمنصة إتقان، ومدعومة بالذكاء الاصطناعي (Google Gemini) لتوليد القصص والاختبارات التفاعلية والشروحات اللغوية.

---

## 🚀 طريقة التشغيل في VS Code (Local Development)

المشروع مبني باستخدام **React 19 + TypeScript + Vite + Tailwind CSS + Express (Full-Stack)**.

### 1. المتطلبات الأساسية
- تثبيت [Node.js](https://nodejs.org/) (الإصدار 18 أو أحدث).

### 2. تثبيت الحزم (Dependencies)
افتح المجلد داخل VS Code وافتح التيرمينال (Terminal):
```bash
npm install
```

### 3. إعداد مفتاح الذكاء الاصطناعي (اختياري لميزات المعلم الذكي)
قم بإنشاء ملف `.env` في المجلد الرئيسي (مستنسخاً من `.env.example`):
```bash
cp .env.example .env
```
ثم أضف مفتاح Google Gemini API:
```env
GEMINI_API_KEY="your_api_key_here"
```

### 4. تشغيل خادم التطوير المحلي
```bash
npm run dev
```
افتح المتصفح على الرابط:
**`http://localhost:3000`**

سيعمل الموقع مباشرة مع خاصية التحديث الفوري (Hot Module Replacement) لجميع ملفات `src/`.

---

## 📦 بناء وتشغيل نسخة الإنتاج (Production Build)

لبناء النسخة النهائية الجاهزة للنشر والتشغيل:

```bash
# بناء ملفات dist والـ assets
npm run build

# تشغيل خادم الإنتاج
npm start
```

---

## 📂 هيكلة ملفات المشروع (Project Structure)

- `index.html`: نقطة الدخول الرئيسية لـ Vite مع مسار `/src/main.tsx`.
- `src/`: جميع ملفات المصدر (React Components, Data, Stories, Words, Audio utils).
  - `src/App.tsx`: التطبيق الرئيسي وإدارة الحالة والتقدم.
  - `src/components/`: المكونات التفاعلية (WordCard, CourseMap, QuizSection, StoryGenerator, AITutorChat, Navbar).
  - `src/data/`: قواعد البيانات اللغوية والكلمات والقصص والتصريفات.
- `dist/`: النسخة المترجمة والمجمعة الجاهزة للنشر المباشر (`dist/index.html`, `dist/assets/`, `dist/server.cjs`).
- `assets/`: نسخ محدثة ومتطابقة من ملفات JavaScript وCSS النهائية.
- `server.ts`: خادم Express يدعم وضع التطوير ووضع الإنتاج ويوفر واجهات الذكاء الاصطناعي Gemini API.
