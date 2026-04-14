# 📚 دليل الاستخدام - Next Step AI

## 🎯 الميزات الجديدة

### 1. Auto-save في ResumeBuilder

**كيفية العمل:**
- يحفظ تلقائياً كل 30 ثانية
- فقط إذا كان هناك اسم مدخل
- الحفظ صامت (بدون إزعاج)

**للحفظ يدوياً:**
```
Ctrl + S (Windows/Linux)
Cmd + S (Mac)
```

---

### 2. Form Validation

**Login & Register:**
- ✅ التحقق الفوري عند الخروج من الحقل (onBlur)
- ✅ رسائل خطأ واضحة تحت كل حقل
- ✅ أيقونات تحذير حمراء
- ✅ منع الإرسال إذا كانت هناك أخطاء

**Resume Builder:**
- ✅ التحقق من البريد الإلكتروني
- ✅ التحقق من رقم الهاتف (صيغة سعودية)
- ✅ تنبيهات فورية عند الخطأ

---

### 3. Confirmation Dialogs

**أين تظهر:**
- ❌ حذف سيرة ذاتية من Dashboard
- ❌ حذف تقديم وظيفة
- ❌ حذف خبرة/تعليم في Resume Builder
- 🚪 تسجيل الخروج

**الفائدة:**
- منع الحذف بالخطأ
- تأكيد الإجراءات الحساسة

---

### 4. Loading States

**Dashboard:**
- Skeleton loaders للبطاقات
- Animation سلسة
- وقت تحميل واقعي (1 ثانية)

**JobMatching:**
- Skeleton للوظائف
- Loading عند تطبيق الفلاتر
- Empty state جميلة

---

### 5. Progress Indicator

**في Resume Builder:**
```
الإكمال: 60%
آخر حفظ: 10:30:45 PM
```

**كيف يُحسب:**
- معلومات شخصية: 20%
- خبرة واحدة على الأقل: 20%
- تعليم واحد على الأقل: 20%
- مهارة واحدة على الأقل: 20%
- نبذة تعريفية: 20%

---

### 6. Error Boundary

**ماذا يفعل:**
- يمسك الأخطاء في React
- يمنع التطبيق من التوقف
- يعرض صفحة خطأ جميلة

**في Development:**
- يعرض تفاصيل الخطأ
- Stack trace كامل

**في Production:**
- رسالة ودية
- زر تحديث
- زر العودة للرئيسية

---

### 7. Safe LocalStorage

**كيفية الاستخدام:**
```typescript
import { safeLocalStorage } from '../utils/localStorage';

// Read
const data = safeLocalStorage.getItem('key', defaultValue);

// Write
safeLocalStorage.setItem('key', data);

// Remove
safeLocalStorage.removeItem('key');

// Check availability
if (safeLocalStorage.isAvailable()) {
  // Safe to use
}
```

**الفوائد:**
- لا تعطل (crash-safe)
- يعالج Quota exceeded
- يعالج JSON parsing errors
- يعالج disabled storage

---

### 8. Keyboard Shortcuts

**المتاحة حالياً:**
- `Ctrl/Cmd + S`: حفظ السيرة الذاتية
- `Enter`: إضافة مهارة (في حقل المهارات)
- `Esc`: إغلاق dialogs (افتراضي)

---

## 🎨 Toast Notifications

**Configuration:**
```typescript
// في App.tsx
<Toaster 
  position="top-center" 
  toastOptions={{
    duration: 3000,
    style: {
      direction: 'rtl',
    },
  }}
/>
```

**الأنواع:**
- ✅ Success: `toast.success('رسالة')`
- ❌ Error: `toast.error('رسالة')`
- ℹ️ Info: `toast('رسالة')`
- ⏳ Loading: `toast.loading('جاري...')`

---

## 🔍 Component Guide

### ConfirmDialog

```typescript
<ConfirmDialog
  open={dialogOpen}
  onOpenChange={setDialogOpen}
  onConfirm={handleConfirm}
  title="عنوان الحوار"
  description="الوصف"
  confirmText="تأكيد"
  cancelText="إلغاء"
  variant="destructive" // أو "default"
/>
```

### DashboardSkeleton

```typescript
{isLoading ? (
  <DashboardSkeleton />
) : (
  // المحتوى الفعلي
)}
```

### ErrorBoundary

```typescript
// في App.tsx
<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
sm:  640px  /* Small devices */
md:  768px  /* Tablets */
lg:  1024px /* Desktops */
xl:  1280px /* Large desktops */
2xl: 1536px /* Extra large */
```

**مثال:**
```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Full width on mobile, half on tablet, third on desktop */}
</div>
```

---

## 🐛 Troubleshooting

### المشكلة: LocalStorage لا يحفظ

**الحل:**
```typescript
// تحقق من التوفر
if (safeLocalStorage.isAvailable()) {
  // آمن للاستخدام
} else {
  // استخدم fallback (state only)
}
```

### المشكلة: Form validation لا تعمل

**الحل:**
- تأكد من `touched` state
- تأكد من `onBlur` handlers
- تحقق من validation functions

### المشكلة: Auto-save لا يعمل

**الحل:**
- تأكد من وجود name في personalInfo
- تحقق من console للأخطاء
- تأكد من localStorage enabled

---

## 🔒 Security Best Practices

### Input Validation

```typescript
// Always validate on client AND server
const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
```

### Safe Storage

```typescript
// Always use safe wrapper
import { safeLocalStorage } from '../utils/localStorage';

// DON'T
localStorage.setItem('key', JSON.stringify(data));

// DO
safeLocalStorage.setItem('key', data);
```

---

## 🎯 Performance Tips

### 1. Memoization

```typescript
const memoizedValue = useMemo(() => {
  return expensiveCalculation();
}, [dependencies]);
```

### 2. Lazy Loading

```typescript
const Component = lazy(() => import('./Component'));

<Suspense fallback={<Skeleton />}>
  <Component />
</Suspense>
```

### 3. Debouncing

```typescript
const debouncedSearch = useDebounce(searchQuery, 300);
```

---

## 📊 Testing

### Manual Testing Checklist

#### Login/Register:
- [ ] يرفض email غير صحيح
- [ ] يرفض كلمة مرور ضعيفة
- [ ] يعرض رسائل خطأ واضحة
- [ ] زر Submit معطل عند وجود أخطاء

#### Dashboard:
- [ ] يعرض loading skeleton
- [ ] يطلب تأكيد قبل الحذف
- [ ] Charts responsive

#### ResumeBuilder:
- [ ] Auto-save يعمل
- [ ] Ctrl+S يحفظ
- [ ] Progress يتحدث
- [ ] Validation تعمل

#### JobMatching:
- [ ] Loading skeleton يظهر
- [ ] Filters تعمل
- [ ] Empty state يظهر

---

## 🚀 Deployment Checklist

- [ ] Build successful
- [ ] No console errors
- [ ] All pages accessible
- [ ] Mobile responsive
- [ ] Forms work
- [ ] Auto-save works
- [ ] localStorage safe
- [ ] Error boundary tested

---

## 📞 Support

للأسئلة أو المشاكل:
1. افحص Console للأخطاء
2. تحقق من Network tab
3. راجع Error Boundary UI
4. افحص localStorage state

---

## 🎓 Learning Resources

### React Best Practices:
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com)

### UI/UX:
- [shadcn/ui](https://ui.shadcn.com)
- [Radix UI](https://www.radix-ui.com)
- [Lucide Icons](https://lucide.dev)

---

**🌟 استمتع باستخدام Next Step AI! 🌟**
