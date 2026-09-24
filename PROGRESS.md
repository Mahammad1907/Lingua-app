
# 📊 LİNGUA APP — İRƏLİLƏYİŞ

**Son yenilənmə:** 24.09.2026

---

## 🎯 LAYİHƏ NƏDİR
Duolingo-dan güclü dil öyrənmə tətbiqi
- Dillər: 🇬🇧 İngilis, 🇩🇪 Alman, 🇷🇺 Rus
- Səviyyələr: A1 → C2
- Platforma: Android + iOS

## 🛠️ TEXNOLOGİYA
- Expo + React Native
- TypeScript
- Supabase (backend + DB + auth)
- Zustand (state) - gözləyir
- Expo Router (naviqasiya)
- AsyncStorage (yerli yaddaş)
- expo-speech (səsli oxuma)
- RevenueCat (ödəniş) - gözləyir
- AdMob (reklam) - gözləyir

## ✅ BİTƏN İŞLƏR

### Setup
- [x] Node.js quraşdırıldı (v24.21.0)
- [x] VS Code quraşdırıldı
- [x] Expo layihəsi yaradıldı
- [x] GitHub repo yaradıldı
- [x] PROGRESS.md yaradıldı

### Struktur
- [x] src/constants/colors.ts
- [x] src/constants/theme.ts
- [x] src/types/index.ts

### Backend
- [x] Supabase hesabı yaradıldı
- [x] .env faylı (URL + Publishable key)
- [x] src/lib/supabase.ts
- [x] Supabase qoşuldu və test edildi

### Auth
- [x] src/app/login.tsx
- [x] src/app/register.tsx
- [x] Qeydiyyat İŞLƏYİR ✅
- [x] Login İŞLƏYİR ✅

### Onboarding
- [x] src/app/index.tsx (dil seçimi)
- [x] src/app/onboarding/level.tsx
- [x] src/app/onboarding/placement.tsx (10 sual)
- [x] src/app/onboarding/welcome.tsx

### Əsas Tətbiq
- [x] src/app/(tabs)/_layout.tsx (tab naviqasiya)
- [x] src/app/(tabs)/index.tsx (Dərslər - placeholder)
- [x] src/app/(tabs)/profile.tsx (Profil - placeholder)

### Kontent
- [x] src/data/lessons.ts
- [x] 4 dərs A1 İngilis (35 məşq)
- [x] Sözlər, tərcümələr, tələffüz, nümunələr

### Paketlər
- [x] @supabase/supabase-js
- [x] @react-native-async-storage/async-storage
- [x] expo-speech

## 🚧 HAZIRDA
Dərs ekranlarını qururuq (TapText, vocabulary, lesson)

## ⏭️ NÖVBƏTİ ADDIMLAR
1. src/components/TapText.tsx — sözə bas → tərcümə + səs
2. src/app/lesson/vocabulary.tsx — söz ekranı
3. src/app/lesson/[id].tsx — dərs məşqləri
4. (tabs)/index.tsx-də linkləri bağlamaq
5. XP, hearts, streak sistemi
6. Supabase-ə progress yazmaq

## 🐛 PROBLEMLƏR
- iOS-da `npm run ios` Xcode tələb edir → həll: `npm start` istifadə et
- PowerShell script bloklayır → həll: Node.js command prompt istifadə et
- .env faylı kök qovluqda olmalıdır (src-də yox)

## 💡 QƏRARLAR
- Backend: Supabase
- Dil: TypeScript
- Naviqasiya: Expo Router
- Bot: Ssenari sistemi (real AI yox)
- Ödəniş: RevenueCat
- Reklam: AdMob
- Tərcümə: Manual (hazır) + gələcəkdə API
- Səsli oxuma: expo-speech (pulsuz)
- Onboarding: dil → səviyyə → placement → welcome
- Auth: onboarding-dən sonra (soft signup)

## 📝 QEYDLƏR
- GitHub: github.com/Mahammad1907/Lingua-app
- Layihə adı: lingua-app
- Başlama tarixi: 23.09.2026
- Supabase URL: https://ovtaycqtehnzzozgbzcy.supabase.co
- Supabase Region: ap-northeast-1 (Tokyo)
- Supabase email təsdiqi: SÖNDÜRÜLDÜ (development üçün)
- İş rejimi: Agile + AI-first

## 🕐 TARİXÇƏ
- 23.09.2026 — Layihə başladı, plan yazıldı
- 23.09.2026 — Node.js + VS Code yoxlandı
- 23.09.2026 — GitHub repo yaradıldı
- 23.09.2026 — PROGRESS.md yaradıldı
- 23.09.2026 — Expo layihəsi quruldu
- 23.09.2026 — Rənglər, tema, tiplər
- 23.09.2026 — Supabase qoşuldu
- 23.09.2026 — Auth (login + register) İŞLƏDİ ✅
- 23.09.2026 — Onboarding (4 ekran)
- 23.09.2026 — 4 dərs A1 İngilis (35 məşq)
- 24.09.2026 — expo-speech quraşdırıldı
- 24.09.2026 — Dərs ekranları hazırlanır