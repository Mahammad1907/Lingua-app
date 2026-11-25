# BirTalk — hər şey bir yerdə

Yığıldı: 25 noyabr 2026. Bu fayl əvvəlki dörd mənbəni birləşdirir: `AGENTS.md` (köhnə BirTalk bölmələri), `docs/BUTUN_QAYDALAR.md`, `docs/LAYIHE_DEFTERI.md`, `docs/YENI_SOHBET_UCUN.md`. O fayllar tarixçə üçün saxlanılır, amma **qüvvədə olan qaydalar yalnız buradadır**. Ziddiyyət olanda daha yeni qərar keçərlidir; köhnəlmişlər §8-dədir.

Ayrıca standart sənədləri (burada təkrarlanmır, linklə keçərlidir):
- `docs/DERS_STANDARTI.md` — dərs quruluşu (kart sayı istisna: §2.6)
- `docs/IZAH_STANDARTI.md` — “Mənə başa sal” izahları
- `docs/MENTIQ_YOXLAMASI.md` — vəziyyət və keyfiyyət yoxlamaları (L1–L21, Q1–Q6)
- `docs/AZ_OYRENEN_SEHVLERI.md` — səhv variantların mənbəyi
- `docs/SEKIL_SIYAHISI.md` — lazım olan bütün şəkillər
- `docs/BOLME_1..4_XERITESI.md`, `docs/A1_PLANI.md` — bölmə xəritələri və A1 planı
- `docs/dersler/` — Bölmə 1-in oxunaqlı mətni (`node scripts/export-unit1-docs.cjs` yaradır)
- `docs/BirTalk_Ders_1_Yekun.md` — Dərs 1-in təsdiqlənmiş mətni

---

## 0. Layihə və istifadəçi

- **BirTalk**: Azərbaycan dilində danışanlara ingilis dili öyrədən mobil tətbiq. A1, “CEFR A1 təsvirlərinə əsaslanır” — “CEFR sertifikatlı” deyilmir. Auditoriya **böyüklərdir** (kurs, iş, kafe, küçə — “sinifdə uşaq” yox).
- Kurs planı: A1 10 bölmə, A2 14, B1 18, B2 20. Hazırdır: **Bölmə 1–4** (`src/data/lesson1Design.ts`, `src/data/unit1..unit4/`).
- Repo `Mahammad1907/Lingua-app`, iş branch-i **`claude/lesson1-new-screens`** (bütün iş yalnız bura gedir).
- Stack: Expo, React Native, expo-router, zustand (AsyncStorage), expo-speech, expo-image, react-native-svg, reanimated, Nunito şrifti.
- İstifadəçi tək işləyir (müəllim, ana dilli yoxlayıcı, test edən adam yoxdur). Windows 10 PowerShell, iPhone (Expo Go), evdə Android telefon.
- **SDK:** istifadəçinin kompüterində yerli `sdk-58` branch-i var (iPhone Expo Go yalnız SDK 58 açır). O, işi belə gətirir: `git fetch origin` → `git merge origin/claude/lesson1-new-screens` → `npx expo start -c` (və ya `npx.cmd expo start -c --go`). Git “Unlink of file … (y/n)” → `n`, Metro-nu dayandır, yenidən.
- EAS hesabı `mahammad_07`, layihə `@mahammad_07/lingua-app`; `.env` EAS `preview` mühitində. Apple Developer hesabı yoxdur.

## 1. İstifadəçi ilə iş qaydası

1. **Azərbaycanca, qısa** yaz (telefondan oxuyur). Siyahı və aydın addımlar.
2. **Əvvəl nə edəcəyini de, “başla” deyəndən sonra başla.** Sual verəndə yalnız cavab ver, heç nəyi dəyişmə. Tək “Tamam / Yaxşı / Bəli” başlamaq əmri deyil. “Düzəlt”, “et”, “başla” — əmrdir.
3. İstifadəçi səhvləri bir-bir göndərir: “bitdi / hamısını et” deyənə qədər **yalnız nömrələyib qeyd et**, sonra hamısını birlikdə et. “Hələlik bunu et” — o bəndi dərhal.
4. **Qənaət (limit):** lazım olmayan faylı oxuma, şəkil render etmə, istənməyən ekran görüntüsünə baxma.
5. **Dürüstlük:** “edildi” deməzdən əvvəl kodda həqiqətən yoxla; nəyi yoxladığını və nəyi yoxlamadığını ayrıca de. **Telefonda yoxlanmayanı “yoxlandı” demə** — kod yoxlaması ≠ cihaz yoxlaması. Keçmişdə “edildi” yazılıb edilməyən bəndlər olub, istifadəçi bundan çox narazıdır.
6. İşin sonunda **hansı ekranlara baxacağını** siyahı ilə ver və yeniləmə əmrlərini yaz.
7. **Yeni ekran növü və ya böyük dizayn dəyişikliyi — əvvəlcə maket**, təsdiqdən sonra kod. Hər bölmə xəritəsində ən azı bir “Yeni ekran ideyası” olur.
8. Böyük məzmun işindən sonra **mətni yazmayan müstəqil yoxlayıcı** oxusun; hesabat süzülmədən göstərilsin.
9. İstifadəçinin qərarı olmadan təsdiqlənmiş şeyi dəyişmə. Dərs 1 dəyişsə — həm kodda, həm `docs/BirTalk_Ders_1_Yekun.md`-də.
10. **`package.json`, `package-lock.json`, SDK fayllarına icazəsiz toxunma.** Paket lazımdırsa əvvəl soruş; quraşdırma `npx expo install <paket>` ilə. `ios/`, `android/` əllə yaradılmır. `npm run reset-project` heç vaxt işlədilmir.
11. İstifadəçinin e-poçtu heç yerə yazılmır. Commit sonunda sessiyanın verdiyi attribution sətirləri.
12. Yeni qərar → bu fayla (müvafiq bölməyə + §7 tarixçəyə bir sətir).

## 2. Dərs məzmunu

1. **Öyrədilmədən soruşma (ən vacib).** Heç bir tapşırıq (seçim, səs, nümunə, qəbul siyahısı, izah, ipucu) əvvəl öyrədilməmiş ingilis sözünü göstərmir. Qeyddə keçən söz öyrədilmiş sayılmır. İfadə öz kartından əvvəl heç yerdə görünmür. (`check-taught`)
2. **Bir kartda bir ifadə**; yalnız eyni mənalı qısa cütlər birlikdə (Hello/Hi, Goodbye/Bye, Thank you/Thanks).
3. **Yeni söz kartında söz-söz izah** — həmişə: ifadədəki hər yeni söz ayrıca izah olunur; yeni sözlər rənglə, bilinənlər adi rəngdə; çətin səs (th, w) üçün qısa qeyd.
4. **Qısa formalar** (I'm, he's, what's …) ilk gəldiyi yerdə öyrədilir: ayrıca “Qısa forma” kartı və ya söz kartında `shortForm` bloku (səsli “What is → What's”), termin işlənmir.
5. **Müəllim izahı** (`type: 'explain'`): qayda olan yeni söz kartından sonra, tapşırıqlardan əvvəl; çətin mövzuda iki izah kartı, aralarında qısa tapşırıq. Hər izah avtomatik “Qaydalar” tabına düşür (`src/data/rules.ts`, `RULE_META` — sual formasında ad + ingilis nümunəsi).
6. **Kart sayı 11–14** (DERS_STANDARTI-dəki 10–12 köhnədir). Bölmə 2-dən dərsdə (hissədə) 4–6 yeni vahid; Bölmə 1-də 2–3.
7. **Xəritədə hər bölmə sabit 8 dərs**; çox material → dərs 2–3 hissəyə bölünür. Hər bölmənin sonunda **bölmə imtahanı**: Kömək yoxdur, keçid **≥70%**; keçilməyincə növbəti bölmə açılmır.
8. **Müxtəliflik:** eyni ekran növü dalbadal gəlmir (bir söhbətin növbələri istisna); iki dərs eyni 3 ekranla bitmir; açılış və məkan dəyişir. Hibrid: 12 noyabr ekranları + sonradan əlavə olunanlar, hər dərsdə hər iki qrupdan. Yeni ekran növləri yaradıla bilər (maketlə).
9. **Seçimdə 3 variant**; yanlışlar Azərbaycanlı öyrənənin real səhvlərindən; iki düzgün cavab olmaz.
10. **İpucu** hər tapşırıqda: bir cümlə, yol göstərir, cavabı (yarısını da) açmır, vəziyyətə uyğundur, Təkrarın yeni vəziyyətinə görə ayrıca yazılır, ekranda olmayandan danışmır. Toxun-yerləşdir ekranlarında (Kim nə dedi?, Cavab cütü, Söhbəti sırala) Kömək yoxdur.
11. **İzah** (`IZAH_STANDARTI.md`): 4 sətir — Uyğun / Səbəb / Qayda / Nümunə; yalnız ekrandakı iki formadan danış; “həmişə”, termin, IPA yoxdur.
12. **Səhvlər dərsin sonunda** yeni vəziyyətdə, eyni bacarıqla təkrar gəlir; sonsuz dövr yoxdur. Keç / texniki problem / qiymətləndirilməyən cavab “Yoxlanmadı” qalır. Qəbul edilmiş kiçik yazı fərqi səhv deyil (düzəlişi göstərilir).
13. Nümunə əvvəlcədən yalnız Dərs 1–2-də görünür; sonra yalnız Kömək ilə.
14. **Yer tutucular:** öyrənənin görəcəyi mətndə “…” qalmır — `[ad]`, `[soyad]`, `[ölkə]`, `[şəhər]`, `[millət]`, `[yaş]`, `[dil]`, `[nömrə]`; mümkünsə konkret nümunə. Boşluq `______`. İcazəli: `Twelve…`, `L… A… N…`. (`check-placeholders`)
15. **Personajlar** (`src/config/characters.ts`, adlar hələ boşdur): maskot `{M}` (boş olanda “Dostun”), qız `{G}`, oğlan `{B}`, **xarici dost `{F}`** (qadın, ABŞ-dan, ingiliscə danışır; Bölmə 4-dən). Birdəfəlik xaricilər adsız “Yeni tanış”. Dördüncü adlı personaj yoxdur. Dostun adını bilirsən — ad soruşan “yeni tanış”dır. Adlar lüğət sözü deyil, vurğulanmır. Öyrənənin öz adı istənilən ad ola bilər; rol verilibsə o ad qorunur.
16. Maskot adı yalnız `src/utils/mascot.ts` → `MASCOT_NAME` (BirFox müvəqqəti; `check-mascot-name`). Tətbiq adı “BirTalk” da müvəqqətidir — mərkəzdən dəyişdirilə bilən olmalıdır.
17. **“Azeri” sözü qadağandır** — yalnız “Azerbaijani”.
18. Başlıq, tərcümə və ingilis cümləsi eyni zamandadır; “edə bilirəm” cümlələri həqiqətən edilən işi deyir.
19. **Vəziyyət ekrana uyğun olmalıdır** (G8): üz-üzə görüş / göstərmək / zəng → danışmaq; mesaj / çat / e-poçt → yazmaq; cavab real həyatda belə deyilir/yazılır; təlimat düz cavablardan birini kənarda qoymur. Bütün qaydalar: `MENTIQ_YOXLAMASI.md` (L1–L21).
20. **İngilis təbiiliyi** (18 Nov, bütün yeni mətnə): sadə, yayğın dərslik forması; idiom/sabit birləşmə real işləndiyi yoxlanmadan girmir; hər bölmədən sonra ayrıca təbiilik yoxlayıcısı; B1–B2 real mətnə əsaslanır; “Şikayət et” düzəliş kanalıdır; bölmə təhvilində “ana dilli yoxlamasından keçməyib” yazılır.
21. **Dərslik qərarları (A1):** ad — “What's your name?”; “Nice to meet you.” adlardan sonra; “Excuse me” yalnız diqqət çəkmək / yad adam-işçi; anlamayanda “Sorry?”, “Say that again, please.”, “More slowly, please.”, “I don't understand.”; “I'm good / I'm fine, thanks. And you?”; “I'm not great.”; Mr. / Ms. nöqtə ilə. “Yes, I'm.” / “Yes, she's.” qəbul olunmur.

## 3. Tələffüz və səs

1. Səs hər yerdə **en-US**. Oxunuş Azərbaycan hərfləri ilə, Amerika tələffüzü, fonetik işarə yoxdur (“hau ar yu?”, “sari”); /æ/ = “ə”; **th** qalın narıncı. IPA yalnız `pronunciation` sahəsində (söz pəncərəsi, Lüğətim).
2. **Sürət düyməsi** (1x → 0.75x → 0.5x → 1.25x) dərsin bütün normal səs düymələrinə aiddir; basanda dərhal yeni sürətlə yenidən oxuyur; 0.5x-də sözlər arası fasilə. Qəsdən yavaş düymələr öz sürətindədir.
3. **Səs tanıma:** telefonun öz tanıması (`expo-speech-recognition`) əsasdır. Expo Go-da işləmir → səsli cavablar “Yoxlanmadı” — normaldır. Sınaq Android development build ilə. Azure qurulmayıb, hələlik lazım deyil; pullu bulud variantı sonra.
4. Mikrofon: basılı saxla və danış (bir toxunuşla da işləyir), buraxanda bir dəfə göndərilir; texniki problem/səssizlik cəza deyil.
5. Hazır cümləni oxumaq müstəqil cavab sübutu deyil; mətni göstərmək (“Səsi başa düşmürəm”) həmin tapşırığın dinləmə sübutunu silir, ürək almır.

## 4. Ekran dizaynı

**4.1 Vacib qaydalar (G6–G7)**
1. **İrəli aparan düymələr** (“Davam et”, “Başa düşdüm”, “Yoxla”) və **yuxarıdakı irəliləyiş barı** — maskot narıncısı `d.action` (#E06A00). **Cavab yoxlanandan sonrakı düymə:** düz — yaşıl, səhv — qırmızı.
2. **Dinləmə ikonu hər yerdə ▶**, bənövşəyi dairə: `SoundButton` / `SoundIcon` (`TaskScreens.tsx`); səsli mesaj kartının ▶-i də eyni rəngdə.
3. **Bir ekranda dəyişən ortaq element bütün ekranlarda dəyişir.** Ortaqlar: Header; ekran nişanı `KindChip` (“DƏRS 1 · YAZI / DİNLƏMƏ / DANIŞIQ / SEÇİM / YENİ SÖZ / MÜƏLLİM İZAHI …”); başlıq və tapşırıq cümləsi; kartlar (ağ, yumşaq `shadow`); səs düyməsi; Kömək; `ChoiceOption`, `Field`; köməkçi yazılar (`Capsule`); əsas düymə.
4. **Dərs ekranı sürüşmür** — iPhone və Android-də eyni: sığmayanda əvvəl şəkillər kiçilir (`fit.ts`, ArtFit), sonra kart tam enində kiçildilir (ən az 0.78). Sürüşmə yalnız klaviatura açıq olanda və çox böyük sistem şriftində. Hər yeni kart tam ölçüdən başlayır.

**4.2 Ümumi görünüş**
5. Açıq lavanda fon, bənövşəyi/narıncı vurğu, Nunito. **Solğun mətn yoxdur:** mətn rəngləri ≥4.5:1 (`orangeText #A84A08`, `greenText #0F6E2A`, `redText #B42318`); narıncı/yaşıl dolğu yalnız fon və böyük düymə üçün.
6. Səs düymələrində yazı yoxdur, yalnız ikon.
7. **Yeni söz kartı:** bənövşəyi banner + balonda ifadə (maskot yoxdur — 20 Nov), oxunuş, ▶, altda Mənası · Quruluşu · Nümunə · qısa qeyd; sürüşmür.
8. **Müəllim izahı ekranı** (24 Nov dizaynı): `KindChip` “MÜƏLLİM İZAHI” + böyük başlıq; maskot balonu (ingilis formaları bənövşəyi); formalar yan-yana kartlarda (etiket, ▶, izah); istəyə görə Səmimi…Rəsmi şkalası; ağ izah kartı; altına girən “Diqqət:” qutusu; narıncı “Başa düşdüm →”.
9. **Mesajlaşma ekranı** (`ChatThread`, 24 Nov): başlıqda avatar + yaşıl nöqtə, ad, “Onlayn”, Kömək; “Bu gün”; qarşı tərəfin mesajları saatla (sözsüz mesaj — 👋 🔑 📄 🎤 📷 — səslənmir); sənin balonun yalnız yazanda görünür, cavab bir yerdə (altdakı sahə); saat və ✓ yalnız Yoxla-dan sonra.
10. **Dinlə və anla:** “DƏRS 1 · DİNLƏMƏ”, başlıq, tapşırıq; səsli mesaj kartı (avatar, danışanın adı, “Səsli mesaj”, müddət, ▶, dalğa, sürət); sağda Kömək; dairəvi seçimlər; “İndi dinləyə bilmirəm”; narıncı Yoxla.
11. Səhv cavab: qırmızı (bir dəfə vurğu, sonra sabit) — texniki/qeyri-müəyyən cavaba səhv effekti yoxdur; düz — yaşıl. “Mənə başa sal” overlay-də açılır, əsas ekranı uzatmır, yalnız X ilə bağlanır. Xəta bildirmə — bayraq ikonu (yalnız telefonda saxlanır).
12. Sözə toxunanda mənası çıxır və səslənir; yerləşdirilmiş sözə toxunanda geri qayıdır. Sözlər ilk öyrədildiyi kartda “Lüğətim”ə təkrarsız düşür.
13. Animasiyalar 300–600 ms, kiçik; Reduce Motion; ekran silkələnmir; kart nömrələri görünmür.
14. **Ana səhifə** (23 Nov): ada xəritəsi (`IslandHome`); hər dərs dairə + ad/% kartı; tünd “Gündəlik təkrar” kartı birinci bölmə başlığının altında; **AI zəng** kartı xəritənin içində 4-cü və 5-ci dərs arasında (“tezliklə”); son dərsdən yol bölmə imtahanının kubokuna, kubok bu bölmə ilə növbətinin arasında; hər bölmənin öz rəngi.
15. **Menyu** (21 Nov): Öyrən · Qaydalar · AI müəllim · Lüğətim · Profil.
16. **Qaydalar tabı:** qayda “Başa düşdüm” basılanda açılır; izahdan sonrakı tapşırıqlar qaydaya bağlıdır (Zəif / Öyrənilir / Möhkəm); səhv panelində “Qaydaya bax”; cədvəllər (Rəqəmlər, Əlifba, Qısa formalar, Nömrə və e-poçt, Ölkə və millət). (`check-rules`)
17. Onboarding (4 Nov təsdiq): ağ-bənövşəyi qarşılama, məqsəd, səviyyə, başlanğıc planı; narıncı kapüşonlu maskot.

## 5. Şəkillər

1. **Şəkillər ən sonda**, bir dəfəyə (B2-yə qədər bölmələr hazırlanandan sonra). İndi hər şəkil yerində narıncı “ŞƏKİL n · təsvir” işarəsi: kartda `scenes`, `src/config/sceneImages.ts` → `SCENE_NOTES`, `docs/SEKIL_SIYAHISI.md`-də sətir (`check-quality` Q5 yoxlayır). Buraxılışdan əvvəl işarələr gizlədilir.
2. Üslub (11 Nov): BirTalk-a məxsus **3D oyuncaq dünyası** (blokvari, yumşaq plastik, isti işıq). Qız — gümüşü həndəsi bob saç, bənövşəyi geyim; oğlan — qəhvəyi saç, narıncı geyim; maskot ayrıdır (narıncı başlıq/plaş, qəhvəyi üz, sarı gözlər). Şəkildə yazı/cavab yoxdur; şəkil cavabı açmır.
3. Hər ekranda şəkil yoxdur: söhbət, dinləmə, səsli cavab, Sözü tamamla, Kim nə dedi ekranlarında avatar/səs kartı var, şəkil yox. Eyni şəkil dalbadal təkrarlanmır; ortaq səhnələr (kafe, ziyafət, qeydiyyat) təkrar istifadə olunur.
4. Şəkil vəziyyətin yerini göstərir (L15); mətn dəyişəndə şəkil də yoxlanır.

## 6. Kod xəritəsi və yoxlamalar

| Nə | Harada |
|---|---|
| Dərs axını, ekranın sığması, sürət | `src/components/design/DesignLesson.tsx`, `fit.ts` |
| Tapşırıq ekranları (TeacherView, ChatThread, LearnView/WordView, SoundButton, …) | `src/components/design/TaskScreens.tsx`, `NewTaskScreens.tsx` |
| Ortaq hissələr (Header, AudioPanel, ChoiceOption, Field, Capsule, KindChip, `ds`) | `src/components/design/parts.tsx` |
| Nəticə paneli, “Mənə başa sal”, Kömək | `src/components/design/LessonSheets.tsx` |
| Rənglər | `src/components/design/theme.ts` |
| Tiplər / qiymətləndirmə | `src/data/designLessonTypes.ts` / `src/utils/designLesson.ts`, `packetAnswer.ts` |
| Dərslər | `src/data/lesson1Design.ts`, `src/data/unit1..unit4/`, siyahı `src/data/designLessons.ts` |
| Müəllim izahları / qaydalar | `src/data/explainCards.ts` / `src/data/rules.ts` |
| Ana səhifə | `src/components/home/IslandHome.tsx`, `ApprovedHome.tsx`, `src/utils/homeCourse.ts` |
| İmtahan / təkrar | `src/utils/examResults.ts` / `spacedReview.ts`, `src/store/reviewStore.ts`, `src/data/reviewSession.ts` |
| Personaj adları / maskot adı | `src/config/characters.ts` / `src/utils/mascot.ts` |
| Şəkil yerləri | `src/config/sceneImages.ts` |
| Test girişi (bütün bölmələr açıq) | `src/config/testAccess.ts` → `[1, 2, 3, 4]` (buraxılışdan əvvəl `[]`) |

**Yoxlamalar — hər dəyişiklikdən sonra:**
```
node scripts/check-all.cjs        # hamısı birdən, qısa nəticə
node scripts/dump-tasks.cjs _b3_  # bölmənin bütün tapşırıqları bir siyahıda (insan yoxlaması üçün)
node scripts/export-unit1-docs.cjs  # Bölmə 1 dəyişəndə docs/dersler/
```
`check-all` bu mühitdə: 24 keçir, 4-ü paket olmadığı üçün işləmir (`react-test-renderer`, `zustand` — istifadəçinin kompüterində işləyir), 2 köhnə ekran yoxlaması (`check-chapter-journey`, `check-lesson-voice`) işlədilmir. Tam `tsc` burada işləmir (node_modules yoxdur).

## 7. Qərarlar tarixçəsi (qısa)

| Tarix | Qərar |
|---|---|
| 26–27 Okt | Səhv cavab: qırmızı kənar (bir vurğu, sonra sabit); kiçik yazı fərqi düzəlişlə qəbul; səhvlər dərs sonunda yeni vəziyyətdə; “Səsi başa düşmürəm” |
| 28–30 Okt | Azure sınağı (qurulmadı); maskot adı mərkəzdə `MASCOT_NAME`; Lopuki — namizəd |
| 2 Noy | Dərs ekranları sürüşməsin (ilk dəfə); dinləmə dalğasının yanında insan şəkli yox |
| 3–4 Noy | Qarşılama ekranı və onboarding (ağ-bənövşəyi); tətbiq adı müvəqqəti |
| 11 Noy | 3D oyuncaq dünyası üslubu; lüğətə ilk öyrədildikdə əlavə |
| 12–13 Noy | Yeni vahid dizayn (Dərs 1, sonra Bölmə 1); yeni ekran növləri; ana səhifə — ada; Nunito; hibrid ekranlar; Yeni söz kartı sadə, sürüşmür |
| 14 Noy | İzah standartı; 3 müstəqil yoxlama; Bölmə 2; dərsdə 4–6 vahid; oxunaqlı rənglər |
| 15 Noy | Bölmə 3; şəkillər ən sonda; söz-söz izah; “Azeri” qadağası |
| 18 Noy | Keçid 70%; təkrar sistemi 1/3/7/14 gün; xarici dost `{F}`; təbiilik qaydaları; Supabase, səsləndirmə, şəkillər — sonda |
| 19–20 Noy | Telefonun səs tanıması; SDK 58 (yerli `sdk-58`); Müəllim izahı kartı; qısa formalar; AI zəng — hər bölməyə, ən sonda, real API, 3 dəq/gündə 1 |
| 21 Noy | Bölmə 4; Qaydalar tabı və menyu; “…” qadağası |
| 23 Noy | Ana səhifə: Gündəlik təkrar yuxarıda, AI zəng xəritənin içində, imtahan bölmələr arasında; ekranlar iki platformada eyni və sabit; sürət düyməsi |
| 24 Noy | G6 (narıncı düymə və bar, ▶, cavabdan sonra yaşıl/qırmızı); yeni izah ekranı; G7 (ortaq elementlər, KindChip); G8 (vəziyyət ↔ ekran); mesajlaşma ekranı |
| 25 Noy | 4 bölmənin tam məntiq yoxlaması (~780 tapşırıq), `check-situation` L1–L21, `check-quality` Q1–Q6, `check-all`; qeydlər bu fayla yığıldı |

Ətraflı tarixçə: `docs/LAYIHE_DEFTERI.md`, `docs/YENI_SOHBET_UCUN.md`, `docs/BUTUN_QAYDALAR.md` (köçürülmədən əvvəlki mətnlər).

## 8. Köhnəlmiş qərarlar (qarışdırma)

| Köhnə | Yerinə |
|---|---|
| İnsan personajları Əli / Leyla (26 Okt) | Adlar boşdur, `{G}` `{B}` (12 Noy); görünüş 3D üslubdan |
| Retro 2D personaj üslubu (3 Noy) | 3D oyuncaq dünyası (11 Noy) |
| Səs `en-GB` (11 Noy) | `en-US` (13 Noy) |
| Öyrətmə kartında “Davam et” yaşıl (12 Noy), izahda yaşıl “Başa düşdüm” (20 Noy) | Narıncı (24 Noy, G6); yaşıl yalnız düz cavabdan sonra |
| Səs düyməsi “play + tısbağa” (13 Noy), dinamik ikonu (24 Noy, qısa müddət) | ▶ (24 Noy, G6); yavaşlatma — sürət düyməsi |
| Keçid balı 80% | 70% (18 Noy) |
| Mövcud sürüşən ekranları qoru (26 Okt) | Ekran sabitdir (2 Noy, 23 Noy) |
| Ekranı kiçiltmə yalnız Android-də (20 Noy) | İki platformada eyni (23 Noy) |
| Ana səhifə A5 kartları, sonra adanın altında AI zəng / Təkrar / kubok (20 Noy) | 23 Noy düzülüşü (§4.14) |
| Menyuda “AI söhbət”, “Təkrar” | “AI müəllim”, Təkrar menyudan çıxdı (21 Noy) |
| Yeni söz kartında maskot | Maskot yoxdur (20 Noy) |
| Kart sayı 10–12 (DERS_STANDARTI) | 11–14 |
| Test girişi `[1, 2, 3]` | `[1, 2, 3, 4]` |
| “Bu dərsdə” giriş ekranı | Göstərilmir (imtahanlarda qalır) |

## 9. Gözləyən işlər

**İstifadəçinin qərarı lazımdır**
1. Personaj adları (maskot, qız, oğlan, xarici dost) və tətbiqin yekun adı.
2. 4 istifadə olunmayan şəkil (`d1/greet-entrance`, `d1/farewell-door`, `u3/club`, `u3/passport`) — silinsin, yoxsa harasa qoyulsun.
3. Köhnə yoxlamalar `check-chapter-journey`, `check-lesson-voice` — silinsin?
4. A1 planı Bölmə 5–10 (`docs/A1_PLANI.md`; Bölmə 5 “Əşyalar və rənglər”, yeni ekran ideyası “Rəng/qiymət dükanı”).
5. `expo-asset` paketi (`npx expo install expo-asset`) — icazə; sonra yeni Android APK.

**Sonraya saxlanılıb (sıra ilə)**
6. Bölmə 5+ yazılması.
7. Şəkillər (hamısı birdən, `SEKIL_SIYAHISI.md`) və səsləndirmə (hər personaj üçün TTS səsi, fayllar buludda).
8. AI zəng: real AI API, pullu server; əvvəl maket (gələn zəng / danışıq / zəng bitdi); yalnız öyrədilmiş sözlərlə.
9. Supabase sinxronu (ilk variant: buluda saxla / bərpa et).
10. Mağaza auditi: hesab silmə, məxfilik siyasəti, işləməyən profil düymələri, “ŞƏKİL” işarələri və boş AI söhbət gizlənsin, test girişi `[]`, icazə mətnləri, yaş 13+ (`docs/BEYNELXALQ_AUDIT_2026-11-14.md`).

**Açıq texniki işlər**
11. Telefonda yoxlanmalı (23–25 Noy dəyişiklikləri): ana səhifə, sabit ekranlar, sürət düyməsi, Müəllim izahı, mesajlaşma, Dinlə və anla, KindChip, məntiq düzəlişləri.
12. Android səs tanıma diaqnostikası (`SPEECH_DEBUG`).
13. Xəritədə “Dəqiqlik %” saxlanmır.
14. Təbiilik qeydi: “He is fine” → “He's fine” (Bölmə 3 Dərs 5).
15. Ana dilli yoxlama mümkün deyil — G2 qaydaları məcburi (§2.20).
16. İstifadəçinin kompüterində `package-lock.json` vəziyyəti (`git status`).
