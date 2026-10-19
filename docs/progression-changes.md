# Enerji, XP və bölmə kilidləri

## Dəyişən və əlavə edilən fayllar

- `src/store/userStore.ts`
- `src/utils/rewards.ts`
- `src/utils/moduleAccess.ts`
- `src/utils/homeCourse.ts`
- `src/utils/lessonCompletion.ts`
- `src/hooks/useReducedMotion.ts`
- `src/components/EnergyMeter.tsx`
- `src/components/EarnedXP.tsx`
- `src/components/RecognizedVoiceComposer.tsx`
- `src/components/VoiceChatLesson.tsx`
- `src/components/VoicePractice.tsx`
- `src/components/home/HomeDashboard.tsx`
- `src/data/firstConversation.ts`
- `src/app/_layout.tsx`
- `src/app/(tabs)/index.tsx`
- `src/app/(tabs)/profile.tsx`
- `src/app/lesson/session.tsx`
- `src/app/lesson/practice.tsx`
- `src/app/lesson/activities.tsx`
- `src/app/lesson/complete.tsx`
- `src/app/module/[id].tsx`
- `src/app/module/check.tsx`
- `scripts/check-progression.cjs`
- `scripts/check-home-reference.cjs`
- `docs/previews/HomePreview.fixture.tsx` (yerli, Git tərəfindən izlənməyən preview fixture)
- `docs/progression-changes.md`

## Qaydalar

Enerji əvvəlki `hearts` mənbəyindən gəlir. Açılışda saxlanmış enerji dəyişdirilmir; yükləmə bitmədən dərs cəhdi başlamır. Göstəricilər yalnız görünən ekranda qısa azalma effekti oynadır. Reduce Motion aktivdirsə yeni hərəkət və titrəmə effektləri dayandırılır. Texniki səs xətaları, aşağı tanıma etibarlılığı və qeyri-müəyyən ad nəticələri cavab cəhdi sayılmır.

İlk real dərs tamamlanması 20 XP, həmin tamamlanmada bütün tapşırıqlar ilk cəhddə və köməksizdirsə əlavə 5 XP verir. Cavabsız və keçilmiş tapşırıqlar tamamlama mükafatı vermir. Real cavablarla edilən təkrar dərs günün birinci uyğun dərsi və seriya üçün sayıla bilər; əsas dərs və müstəqillik mükafatı təkrarlanmır. Gündəlik 10 XP, seriyanın 3-cü günündə 25 XP, 7-ci günündə 60 XP ayrıca unikal qeydlərlə qorunur. Eyni seriyada bu hədlər yenidən ödənmir.

Hər bölmənin tələb olunan dərsləri tamamlandıqda bir dəfə 100 XP verilir. Bölmə faizi dərs tamamlanması əsasında hesablanır. Sınaq öz bölməsini açır, əvvəlki dərsləri tamamlamır və sonrakı bölmələri avtomatik açmır. İlk uğurlu sınaq 50 XP verir; mövcud keçid həddi, o yoxdursa 80% istifadə edilir.

XP, mükafat açarları, tamamlanmalar, seriya və sınaq nəticələri əvvəlki AsyncStorage açarında bir snapshot kimi saxlanır. Yazmalar ardıcıldır. Saxlama uğursuz olarsa eyni tamamlama yenidən mükafat hesablamadan saxlanmağa cəhd edir. Mükafat animasiyası bir dəfə götürülən, yalnız həmin sessiyada yaşayan nəticə qəbzinə bağlıdır.

Köhnə XP saxlanılır; köhnə tamamlanmalara geriyə mükafat verilmir. Köhnə tətbiqə giriş əsasında yaranmış streak yeni uyğun dərs seriyasına çevrilmir. Yeni seriya yerli təqvim tarixləri ilə hesablanır. Oyun səviyyəsi `floor(xp / 100) + 1`-dir və dil səviyyəsindən ayrıdır.

## Yoxlamalar və məhdudiyyətlər

- `tsc --noEmit --pretty false`: keçdi.
- `node scripts/check-progression.cjs`: Asia/Baku və America/New_York saat qurşaqlarında keçdi. Saxlama adapteri simulyasiya olunur; enerji, açılış, köçürmə, cavabsız/keçilmiş/köməkli tapşırıqlar, paralel tamamlanmalar, təkrar mükafatlar, 3/7 günlük seriyalar, tarix sərhədləri, bölmə bonusu, kilid izolyasiyası və yazma xətasından sonra təkrar cəhd yoxlanır.
- `node scripts/check-home-reference.cjs`: keçdi.
- `expo lint`: nəticəsiz gözlədiyi üçün dayandırıldı; təkrar işlədilmədi.
- Real iPhone-da titrəmə, animasiya və səs tanıma yoxlanmayıb.
- Hazırda yalnız `module_1` üçün real dərslər və sınaq sualları mövcuddur. Bu bölmə ilkin olaraq açıqdır. 2–7-ci kartlar məzmunsuz “Tezliklə” kartlarıdır; imtahanla açılmırlar. Real kilidli bölmə məzmunu əlavə ediləndə öz sınağı yoxdursa başlama düyməsi deaktiv qalacaq.
- Reklam və premium ilə enerji bərpası inteqrasiyası yoxdur; yeni saxta bərpa seçimi əlavə edilməyib.
- Kart ölçüləri, 16 px aralıqlar, gradient kənarlar və 3D şəkillər saxlanılıb. Paket quraşdırılmayıb; commit, push və merge edilməyib.
