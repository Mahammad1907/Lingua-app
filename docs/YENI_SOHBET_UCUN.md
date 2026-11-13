# BirTalk — yeni söhbət üçün tam vəziyyət (13 noyabr 2026, gecə)

Bu fayl yeni söhbətdə işə davam etmək üçündür. Əvvəlcə bunu, sonra `AGENTS.md`-ni və `docs/LAYIHE_DEFTERI.md`-nin son bölmələrini oxu.

## 1. Layihə

- **BirTalk**: Azərbaycan dilində danışanlara ingilis dili öyrədən mobil tətbiq (A1 səviyyəsi, CEFR A1 təsvirlərinə əsaslanır — “sertifikatlı” demə).
- Repo: `Mahammad1907/Lingua-app`, branch **`claude/lesson1-new-screens`**, PR #5. Son commit: `95f7f2f`.
- Stack: Expo SDK 57, React Native 0.86, expo-router, zustand (`src/store/userStore.ts`, AsyncStorage), expo-speech, expo-image, react-native-svg, reanimated, expo-haptics, Nunito şrifti.
- **`package.json`, `package-lock.json`, SDK fayllarına toxunma.**

## 2. İstifadəçi necə işləyir (vacib)

- Windows + iPhone, **Expo Go** ilə yoxlayır: `git pull`, sonra `npx.cmd expo start -c --go`, kamera ilə QR. Dev build yoxdur (Apple Developer hesabı yoxdur). Expo Go-da nitq tanıma işləmir → səsli cavablar “Yoxlanmadı” olur, bu normaldır.
- Git “Unlink of file … failed (y/n)” çıxsa: `n`, Metro-nu dayandır, yenidən `git pull`.
- **İş qaydası:** səhvləri bir-bir göstərir. “Bitdi” (və ya “hələlik bu qədər, başla”) deyənə qədər **yalnız qeyd et, kodu dəyişmə**. Sonra hamısını birlikdə et. Tək “Tamam/Yaxşı” başlamaq göstərişi deyil. İstisna: “hələlik bunu et” desə, o bəndi dərhal et.
- **Bir ekranda dəyişiklik edəndə bütün ekranları yoxla.** “Edildi” yazdığın hər şeyi kodda həqiqətən yoxla — keçmişdə “edildi” yazılıb edilməyən bəndlər olub və istifadəçi bundan çox narazıdır.
- **Qənaət:** lazım olmayan faylı oxuma, şəkil render etmə, istəmədən ekran görüntüsünə baxma (limit). Cavablar qısa, Azərbaycan dilində.
- Telefonda yoxlanmayanı “yoxlandı” demə. Cavabın sonunda istifadəçiyə **hansı ekranlara baxacağını** siyahı ilə ver.
- Commit sonunda:
  ```
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_015orjzHXofg7AjSqio3a7pd
  ```
- İstifadəçinin e-poçtu şəxsidir, heç yerə yazma.

## 3. Kod xəritəsi

| Nə | Harada |
|---|---|
| Dərs axını (bütün 8 dərs) | `src/components/design/DesignLesson.tsx` |
| Tapşırıq ekranları (SayBubble, LearnView/WordView, GapSentence, ChatThread, TileTray, MatchBoard + OrderBoard, SceneSpots, PhraseCard, ImageSlot, PlayButton, SlowButton) | `src/components/design/TaskScreens.tsx` |
| Ümumi hissələr (Header, AudioPanel, ChoiceOption, Field, Capsule, `ds` stilləri, `nameSlot`) | `src/components/design/parts.tsx` |
| Nəticə paneli, “Mənə başa sal”, Kömək | `src/components/design/LessonSheets.tsx` |
| Mikrofon | `src/components/design/HoldToTalk.tsx` |
| Rənglər | `src/components/design/theme.ts` |
| Tiplər | `src/data/designLessonTypes.ts` |
| Qiymətləndirmə (gradeChoice/Text/Two/Match, reviewTask, resolveLesson) | `src/utils/designLesson.ts` |
| Dərs 1 | `src/data/lesson1Design.ts` (təsdiqlənmiş yekun sənəddən — **toxunma**, istifadəçi belə istədi) |
| Dərs 2–8 | `src/data/unit1/lesson2.ts … lesson8.ts`, köməkçilər `build.ts`, lüğət `glossary.ts` |
| **Kartların ardıcıllığı** | `src/data/unit1/index.ts` → `ordered(lessonN, [...])` (nömrələri özü verir) |
| Şəkillər / işarələr | `src/config/sceneImages.ts` (`SCENE_IMAGES` boşdur, `SHOW_IMAGE_SLOTS = true`, `SCENE_NOTES`) |
| Ana səhifə (ada xəritəsi, A5) | `src/components/home/IslandHome.tsx`, `ApprovedHome.tsx` |
| Analiz | `src/components/analysis/AnalysisScreen.tsx`, `src/utils/progressInsights.ts` |
| AI söhbət | `src/app/ai-chat.tsx` (boş, “Tezliklə”) |

## 4. Yoxlamalar

```
node scripts/check-taught.cjs        # öyrədilmədən soruşma + ekran müxtəlifliyi (ƏN VACİB)
node scripts/check-unit1.cjs         # dərs 2–8 quruluşu
node scripts/check-design-lesson.cjs # dərs 1
node scripts/export-unit1-docs.cjs   # docs/dersler/Ders_N.md yenilə
```
- `check-home-render`, `check-lesson-voice`, `check-onboarding-flow`, `check-progression`, `check-vocabulary-persistence` əvvəldən uğursuzdur (node_modules yoxdur) — yeni xəta deyil.
- node_modules yoxdur. Typecheck üçün stub `tsconfig` qurmaq lazımdır (köhnə sessiyada `/home/claude/tscheck` idi: modul tapılmama xətaları TS2305/TS7006/TS7031/TS2307 və köhnə userStore/supabase/cloudSpeech xətaları süzülürdü).

## 5. Qəbul olunmuş qaydalar (qısa)

**Məzmun**
- **Heç bir tapşırıq öyrədilməmiş ingilis sözü göstərmir/soruşmur.** Yalnız qeyddə keçən söz öyrədilmiş sayılmır. Söz Yeni söz kartında (word, example, structure) öyrədilir. `check-taught.cjs` yoxlayır.
- Eyni ekran növü dalbadal gəlmir (bir söhbətin növbələri istisna), iki dərs eyni 3 ekranla bitmir. Dərslər şablon deyil.
- **Hibrid:** 12 noyabr təsdiqlənmiş ekranları (Dinlə və seç, Dinlə və yaz, Yazı, Səslə cavab, İki mesaj, Seçim) + sonradan əlavə olunanlar (Sözü tamamla, Mesaj yaz, Dialoq, Kim nə dedi?, Səhnədə tap, Təkrarla, Söhbəti sırala, Cavab cütü). Hər dərsdə hər iki qrupdan.
- **Yeni ekran növü əvvəlcə maket kimi göstərilir**, istifadəçi təsdiqləyir, sonra kod.
- Oxunuşlar Azərbaycan hərfləri ilə, **Amerika tələffüzü**, iki nöqtə/fonetik işarə yoxdur (“hau ar yu?”, “uats yor neym?”, “sari”), **th** qalın narıncı. IPA da Amerika variantı (ː yoxdur). Səs hər yerdə `en-US`.
- Ad yeri “…” ekranda **[ad]** görünür (`nameSlot`), Azərbaycanca mənalarda da.
- Personaj adları boşdur (`src/config/characters.ts`, `{M}` `{G}` `{B}` tokenləri). Maskot = “Dostun”.
- Hər tapşırığın ipucu var, cavabı açmır. Kömək iki addımdır: ipucu → nümunə (səsli) / mətn (dinləmə). Nümunə əvvəlcədən yalnız 1–2-ci dərsdə görünür.
- Səhvlər dərsin sonunda başqa vəziyyətdə təkrar gəlir.

**Görünüş**
- Vəziyyət sətri tünd bənövşəyi extrabold 18, tapşırıq sətri tünd extrabold 19. **Solğun mətn yoxdur** (istifadəçi dəfələrlə şikayət edib).
- Səs düymələri **yalnız ikon**: dairəvi play + tısbağa (yavaş). “Dinlə” yazısı yoxdur.
- **Yeni söz kartı** (təsdiqlənmiş “İlk salam” dizaynı, sadələşdirilmiş): bir kartda bir ifadə (yalnız eyni mənalı qısa cütlər birlikdə: Hello/Hi, Goodbye/Bye, Thank you/Thanks); bənövşəyi banner + maskot + balonda ifadə, altında oxunuş, play, tısbağa; altda Mənası · Quruluşu (lazım olanda) · Nümunə · bir qısa qeyd. Sürüşmə yoxdur. Fonetik yazı kartda yoxdur.
- Danışanın kartı (səsli cavab): avatar + cümlə + play + dalğa + tısbağa.
- Dinləmədə Kömək səs kartının altındadır.
- **Kim nə dedi?, Cavab cütü, Söhbəti sırala ekranlarında Kömək yoxdur.**
- Şəkil yerləri: narıncı qırıq xətli “ŞƏKİL n · …” işarəsi. Söhbət/dinləmə/səsli/Sözü tamamla/Kim nə dedi ekranlarında şəkil yoxdur.
- Ana səhifə: A5 — yumru dərs düymələri, faiz halqaları, nöqtəli yol, toxunanda kart açılır, yuxarı sağda maskot başı, Analiz ikonu, altda üzən menyu (AI söhbət “tezliklə”).

## 6. Dərslərin vəziyyəti

- 8 dərs, hamısı `DesignLesson`-da. Dərs 8 = bölmə söhbəti.
- Kart sayı 11–14. Yeni ayrıca söz kartları: d2_c02b, d3_c06b, d4_c04b, d4_c04c, d5_c05b, d6_c04b, d7_c04b.
- Söhbəti sırala: d4_c07, d7_c09, d8_c08. Cavab cütü: d5_c13, d8_c13. Kim nə dedi?: Dərs 2–8.
- Lazım olan şəkillər: dərslər üçün 44 (siyahı `docs/SEKIL_SIYAHISI.md` §1, §5, §6, §7), üstəlik maskot pozaları 4, ana səhifə 9, avatarlar 2. 1.1 və 1.3 köhnədir, siyahıdan çıxarılmalıdır.

## 7. Açıq işlər

1. Gündəlik təkrar ayrıca qısa sessiya deyil (düymə səhv sözlər siyahısını açır).
2. Bölmə imtahanı köhnə kartlardadır, “Dinlə” (öz səsini dinlə) düymələri orada qalıb.
3. Şəkillər hazır deyil; “Səhnədə tap” nöqtələrinin yeri təxminidir.
4. Yeni söz kartına əsl şəkil gələndə kart sürüşə bilər → şəkli bannerin içinə (maskotun yerinə) qoymaq təklif olunub.
5. Personaj adları seçilməyib.
6. Bölmə 2+, yeni ekran ideyaları (Kim deyər?, Səsi tap, 2 boşluqlu dialoq), AI söhbət.
7. Telefonda son dəyişikliklər (Yeni söz kartı, Söhbəti sırala, Cavab cütü, tünd mətnlər) hələ istifadəçi tərəfindən tam yoxlanmayıb.
