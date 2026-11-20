# BirTalk — beynəlxalq buraxılışa hazırlıq auditi (14 noyabr 2026)

Müstəqil auditor (üçüncü tərəf kimi), fayllara toxunmayıb. **Bu, hüquqi məsləhət deyil.** Auditor mağaza qaydalarının canlı mətninə baxmayıb — təqdimdən əvvəl Apple App Review Guidelines, Google Play Developer Policy, Data Safety / App Privacy tələblərinin cari versiyası yoxlanmalıdır.

## Ən vacib (bloklayıcılar)
1. **Hesab silmə yoxdur.** `src/app/register.tsx` Supabase ilə hesab yaradır, `src/app/(tabs)/profile.tsx`-də yalnız “Hesabdan çıx” var. Apple 5.1.1(v) və Google Play hesab silmə tələbi. Play üçün tətbiqdə silmə + veb link. **Həll:** Profildə “Hesabı sil” (serverdə Supabase istifadəçisi və məlumatları silinir).
2. **Tamamlanmamış məzmun görünür.** Dərslərdə narıncı “ŞƏKİL n” çərçivələri (`TaskScreens.tsx`, `ImageSlot`), boş “AI söhbət — Tezliklə” (`src/app/ai-chat.tsx`, `IslandHome.tsx`). Apple 2.1 / 4.2 üzrə rədd riski. **Həll:** buraxılışda şəkil yoxdursa `ImageSlot` görünməsin; AI tabı gizlədilsin.
3. **İşləməyən düymələr.** `profile.tsx`-də “Premium”, “Kömək”, ayarlar, “dəyiş” — `onPress` yoxdur; “Lingua App v0.1” yazısı qalıb. **Həll:** silinsin və ya işlək olsun. Premium satılacaqsa StoreKit / Play Billing; paywall-da qiymət, müddət, avtomatik yenilənmə, Restore Purchases, Şərtlər və Məxfilik linkləri.
4. **Məxfilik siyasəti yoxdur** (tətbiqdə link yoxdur). Hesab və mikrofon olduğu üçün hər iki mağazada məcburidir.

## 1. Mağaza qaydaları — Bloklayıcı
1. Yuxarıdakı 1–4.
2. İcazə mətnləri (`app.json`, `expo-speech-recognition`) aydındır, amma yalnız azərbaycancadır; qlobal mağaza üçün ingiliscə də (InfoPlist.strings). Məqsəd konkret yazılsın (“… üçün istifadə edir”).
3. Bulud səs tanıma Azure-a gedir (`src/utils/cloudSpeech.ts`, `server/speech-proxy`, README: “pilot, not production”). Apple 5.1.2(i): şəxsi məlumat üçüncü tərəfə (AI xidməti daxil) göndərilməzdən əvvəl açıq bildiriş və razılıq; Azure adı göstərilsin; pilot endpoint buraxılışa getməsin. (`HoldToTalk.tsx`-də yalnız şəbəkə üçün razılıq düyməsi var.)
4. Yaş reytinqi: 13 yaşdan kiçik hədəflənirsə Kids Category / COPPA / Play Families sərt tələblər (mikrofon + hesab). Tövsiyə: 13+. AI söhbət gələrsə — AI məzmunu bildirişi və şikayət mexanizmi.

## 2. Əlçatanlıq (WCAG 2.2 AA) — Düzəliş lazımdır
Kontrast (`theme.ts`): keçənlər — ink/bg 13.8, inkSoft 8.7, lavenderText 5.25, ağ/purple 8.2, ağ/red 4.8.
1. Narıncı vurğu mətni (`d.orange` açıq fonda, `TaskScreens.tsx` — oxunuşdakı **th**) **2.3:1** → tünd narıncı (~`#B4530A`).
2. Ağ / narıncı `#F27A12` **2.77:1** — mətnli düymədə işlənməsin.
3. Ağ / green **3.67:1** — yalnız 20pt bold düymədə qəbul edilir; kiçik mətndə ~`#127A2E`.
4. `d.green`/`greenSoft` 3.17, `d.red`/`redSoft` 3.76 — nəticə mətnləri üçün azdır.
5. `IslandHome.tsx`: “tezliklə” nişanı 8pt (4.08:1), alt menyu 11pt (4.18:1) → ən azı 12–13pt və 4.5:1.
6. Toxunma sahələri: play/turtle 48 + hitSlop yaxşıdır; ada node-ları, bağla və bayraq düymələri cihazda 44pt/48dp üçün yoxlansın. `ImageSlot` ekran oxuyucuya placeholder elan edir.
7. Rəng tək məna daşımasın: düzgün/səhv nəticəyə ikon + mətn.
8. Müsbət: Reduce Motion dəstəklənir, font miqyası söndürülməyib; 200% Dynamic Type ilə sabit hündürlüklü kartlar sınansın.
9. İkon düymələrinin label-ləri var; ada node-ları VoiceOver/TalkBack ilə yoxlansın.

## 3. Əqli mülkiyyət / ticarət görünüşü — Düzəliş lazımdır (risk: aşağı–orta)
1. Ada xəritəsi + dairəvi dərs node-ları + seriya/XP başlığı + ürəklər birlikdə Duolingo quruluşunu xatırladır. Ayrı-ayrılıqda janr konvensiyasıdır; bənövşəyi palitra və maskot fərqləndirir. Duolingo-nun konkret elementlərinin (yaşıl tonlar, bayquş, ikon formaları) kopyasından qaçılsın.
2. Maskot (`assets/mascot/`): orijinallığın mənbəyi sənədləşdirilsin (rəssam müqaviləsi və ya AI alətinin şərtləri).
3. Nunito — SIL OFL 1.1 (`assets/fonts/Nunito-OFL.txt`), problem yoxdur.
4. `WORD_LIST_LICENSE.txt` — kommersiya istifadəsinə icazə yoxlansın.

## 4. Beynəlmiləlləşdirmə — Düzəliş lazımdır
1. Tərcümə qatı yoxdur, bütün UI mətnləri komponentlərdə azərbaycanca. Yalnız azərbaycandilli auditoriya üçün qəbul edilir; gələcək dillər üçün i18n + `expo-localization`.
2. Şrift əhatəsi tamdır (ə Ə ğ ı İ ö ü ş ç), `toLocaleLowerCase('az')` düzgündür.
3. RTL hazırda lazım deyil; uzun mətnlərin sığması sınansın.
4. Mağaza vitrini ən azı EN + AZ.

## 5. Məxfilik — Bloklayıcı
1. Məxfilik siyasəti və linki yoxdur.
2. App Privacy / Data Safety-də: e-poçt və istifadəçi ID (Supabase), səs yazıları və transkript (Azure, Apple/Google tanıma), tərəqqi məlumatı.
3. `recordingOptions: { persist: true }` (`RecognizedVoiceComposer.tsx`) səsi cihazda saxlayır — müddəti və silinməsi siyasətdə yazılsın.
4. AsyncStorage-da səviyyə, test balı, onboarding, 50-yə qədər xəta bildirişi — serverə göndərilirsə bəyan edilsin.
5. Yaxşı: yerli tanıma defoltdur, şəbəkə yalnız razılıqla.
