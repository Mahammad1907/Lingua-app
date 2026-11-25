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

1. Səs hər yerdə **en-US**. Oxunuş Azərbaycan hərfləri ilə, Amerika tələffüzü, fonetik işarə yoxdur (“hau ar yu?”, “sari”); /æ/ = “ə”; **th** qalın narıncı, oxunuş sətri bənövşəyi (25 Nov: istifadəçi köhnə kartı geri istədi). IPA yalnız `pronunciation` sahəsində (söz pəncərəsi, Lüğətim).
2. **Sürət düyməsi** (1x → 0.75x → 0.5x → 1.25x) dərsin bütün normal səs düymələrinə aiddir; basanda dərhal yeni sürətlə yenidən oxuyur; 0.5x-də sözlər arası fasilə. Qəsdən yavaş düymələr öz sürətindədir.
3. **Səs tanıma:** telefonun öz tanıması (`expo-speech-recognition`) əsasdır. Expo Go-da işləmir → səsli cavablar “Yoxlanmadı” — normaldır. Sınaq Android development build ilə. Azure qurulmayıb, hələlik lazım deyil; pullu bulud variantı sonra.
4. Mikrofon: basılı saxla və danış (bir toxunuşla da işləyir), buraxanda bir dəfə göndərilir; texniki problem/səssizlik cəza deyil.
5. Hazır cümləni oxumaq müstəqil cavab sübutu deyil; mətni göstərmək (“Səsi başa düşmürəm”) həmin tapşırığın dinləmə sübutunu silir, ürək almır.

## 4. Ekran dizaynı

**4.1 Vacib qaydalar (G6–G7)**
1. **İrəli aparan düymələr** (“Davam et”, “Başa düşdüm”, “Yoxla”) və **yuxarıdakı irəliləyiş barı** — isti narıncı qradiyent `d.actionLight → d.action` (#F97316 → #EA580C, 25 Nov), bütün ekranlarda. **Cavab yoxlanandan sonrakı düymə:** düz — yaşıl, səhv — qırmızı.
2. **Dinləmə ikonu hər yerdə ▶**, bənövşəyi dairə: `SoundButton` / `SoundIcon` (`TaskScreens.tsx`); səsli mesaj kartının ▶-i də eyni rəngdə.
3. **Bir ekranda dəyişən ortaq element bütün ekranlarda dəyişir.** Ortaqlar: Header; ekran nişanı `KindChip` (“DƏRS 1 · YAZI / DİNLƏMƏ / DANIŞIQ / SEÇİM / YENİ SÖZ / MÜƏLLİM İZAHI …”); başlıq və tapşırıq cümləsi; kartlar (ağ, yumşaq `shadow`); səs düyməsi; Kömək; `ChoiceOption`, `Field`; köməkçi yazılar (`Capsule`); əsas düymə.
4. **Dərs ekranı sürüşmür** — iPhone və Android-də eyni: sığmayanda əvvəl şəkillər kiçilir (`fit.ts`, ArtFit), sonra kart tam enində kiçildilir (ən az 0.78). Sürüşmə yalnız klaviatura açıq olanda və çox böyük sistem şriftində. **Klaviatura açıq olanda** heç nə kiçilmir (aydın oxunsun); səhifə özü aşağı sürüşür ki, yazı sahəsi düymənin düz üstündə görünsün (25 Nov). Hər yeni kart tam ölçüdən başlayır.

**4.2 Ümumi görünüş**
5. **Dizayn sistemi (25 Nov):** fon `#F6F7FB`; rol rəngləri — narıncı: bar + irəli düymələr; bənövşəyi (`#5B21B6`/`#6D28D9`): seçim, ▶, sürət, Kömək, fokus, mikrofon, başlıqdakı vurğu sözləri (başlığın birinci sözü tünd, qalanı bənövşəyi — `accentTitle`); yaşıl/qırmızı yalnız yoxlamadan sonra. Tapşırıq cümləsi çərçivəsiz, boz-göy (`d.slate`) alt başlıqdır (köhnə bənövşəyi sol xətli qutu yoxdur). Nunito. **Solğun mətn yoxdur:** mətn rəngləri ≥4.5:1 (`orangeText #A84A08`, `greenText #0F6E2A`, `redText #B42318`); narıncı/yaşıl dolğu yalnız fon və böyük düymə üçün.
6. Səs düymələrində yazı yoxdur, yalnız ikon.
7. **Yeni söz kartı** (25 Nov, son): yuxarıdakı ifadə kartı **köhnə təsdiqlənmiş görünüşdədir** — qalın bənövşəyi çərçivə, böyük ifadə (qısa cütlər bir sətirdə: “Hello! · Hi!”), bənövşəyi oxunuş + narıncı th, ▶ və yanında sürət düyməsi (tısbağa yoxdur; Öyrən kartında da eyni); altda yeni 4 sətirli kart (kvadrat ikonlar, boz etiketlər, alt qeyd zolağı) və söz-söz seqment düyməsi (çoxsözlü ifadədə sözlər, “·” ilə bir neçə ifadədə hər ifadə öz mənası ilə); kartlar yuxarıdan başlayır (ortaya yaymaq avto-kiçiltməni pozurdu); **adi ölçüdə geniş** sətirlər (böyük ikon, etiket, boşluq) — yalnız kart sığmayanda yığcam sətirlərə keçir, sonra lazım olsa kiçilir (Yeni söz və Öyrən, bütün dərslər); söz-söz sözləri ifadədəki kimi yazılır (I'm, OK); sürüşmür.
8. **Müəllim izahı ekranı** (24 Nov dizaynı): `KindChip` “MÜƏLLİM İZAHI” + böyük başlıq; maskot balonu (ingilis formaları bənövşəyi); formalar yan-yana kartlarda (etiket, ▶, izah); istəyə görə Səmimi…Rəsmi şkalası; ağ izah kartı; altına girən “Diqqət:” qutusu; narıncı “Başa düşdüm →”.
9. **Mesajlaşma ekranı** (`ChatThread`, 24 Nov; 25 Nov: yaşıl onlayn nöqtəsi yoxdur; sahədə bənövşəyi ↑ — balon yerinə “oturur”, tanış “...” yazır; tanışın reaksiyası **yalnız Yoxla-dan sonra, düz cavabda** — Dərs 1-də yalnız emoji, sonrakı dərslərdə yalnız öyrədilmiş sözlər (`chat.reply`, `check-taught` yoxlayır); Yoxla-dan sonra öz balonunun yanında ▶). **“İki mesajı özün yaz” çat xətti** (`ChatTimeline.tsx`, `thread` sahəsi): hər mesaja vaxt pill-i, qırıq xətli gözləmə balonu, ↑ ilə göndər, ✎ ilə düzəlt, hamısı göndəriləndə Yoxla açılır. Köhnə: başlıqda avatar + yaşıl nöqtə, ad, “Onlayn”, Kömək; “Bu gün”; qarşı tərəfin mesajları saatla (sözsüz mesaj — 👋 🔑 📄 🎤 📷 — səslənmir); sənin balonun yalnız yazanda görünür, cavab bir yerdə (altdakı sahə); saat və ✓ yalnız Yoxla-dan sonra.
10a. **Səs kartı** (`AudioPanel`, 25 Nov, dinləmə və danışıq ekranlarında eyni): avatar, başlıq + alt yazı, müddət; ▶/⏸, **Glow Line** (`GlowLine.tsx` — soldan sağa dolmur; dayanıqda nazik xətt, oxuyanda ortası bənövşəyi→narıncı parıltı ilə dalğalanır, dalğa sürətə uyğun yavaşlayır), sürət pill-i. Tısbağa və ayırıcı xətt yoxdur. Danışıq ekranında qarşı tərəfin cümləsi bu kartın başlığıdır (toxunulan sözlər nöqtəli xətlə).
10b. **Danışıq ekranı** (25 Nov): səs kartının altında sıra — solda ağ “Nümunə: Hi! ▶” pill-i (yalnız Dərs 1–2 və ya Kömək ilə), sağda Kömək; ortada mikrofon: dayanıqda bənövşəyi dairə + halqalar + “Basılı saxla və danış”; danışarkən **yalnız AI Voice Orb** görünür — 1.3 dəfə böyüyür, kənara yayılan parıltı qatları ilə “dağılır”, səs ucaldıqca daha çox böyüyür; (ikon və yazı yox, `VoiceOrb.tsx`); orbun öz qısa səsləri var (`assets/sounds/orb-start.wav`, `orb-send.wav`, BirTalk üçün yaradılıb); **susanda cavab özü göndərilir** (Expo Go: mikrofon səviyyəsi ~1.3 s sakit; telefonun tanıması: özü bitir), basılı saxla-burax da işləyir; altda “İndi danışa bilmirəm” (köhnə “Keç” yerinə). Çat, danışıq, dinləmə ekranlarında şəkil/ŞƏKİL işarəsi göstərilmir (§5.3).
10. **Dinlə və anla:** “DƏRS 1 · DİNLƏMƏ”, başlıq, tapşırıq; səsli mesaj kartı (avatar, danışanın adı, “Səsli mesaj”, müddət, ▶, dalğa, sürət); sağda Kömək; dairəvi seçimlər; “İndi dinləyə bilmirəm”; narıncı Yoxla.
11a. **Nəticə paneli** (`ResultPanel`, 25 Nov): ağ alt panel (28px künc, tutacaq — toxunanda kiçilir), arxa fon tutqun, yaysız sakit sürüşür; ikon + başlıq + ⚑ bir sırada; XP yoxdur. Səhv: ❗ “Bir daha baxaq”, qırmızımtıl kart — çox hissəlidə hər hissə ✓/✕ sətri (öz cavabın üstüxətli → ▶ düz cavab), təkdə “UYĞUN CAVAB”: bir sətirdə ✕ ~~sənin cavabın~~ → ▶ çiplər; ▶ yalnız lüğətdə ingiliscə söz olan ifadəyə (Azərbaycanca variant səslənmir), dinləmədə “TƏLƏFFÜZÜ DİNLƏ” dinlənən səsi verir; “Qaydaya bax” | “Mənə başa sal” yan-yana; qırmızı qradiyent düymə. Düz: ✓ “Əla!” (Kömək işlənibsə “Düzgündür” + “Köməklə”), ingiliscə cavab varsa nanə rəngli “TƏLƏFFÜZÜ DİNLƏ” ▶ çipləri; yaşıl qradiyent (#16A34A→#15803D — ağ yazı oxunsun). Neytral “Yoxlanmadı” boz ikonla. Saxlanıb: yazı düzəlişi, mənası, “Təkrarla”, danışıqda “Yenidən cəhd et”.
11. Səhv cavab: qırmızı (bir dəfə vurğu, sonra sabit) — texniki/qeyri-müəyyən cavaba səhv effekti yoxdur; düz — yaşıl. “Mənə başa sal” overlay-də açılır, əsas ekranı uzatmır, yalnız X ilə bağlanır. Xəta bildirmə — bayraq ikonu (yalnız telefonda saxlanır).
12. Sözə toxunanda mənası çıxır və səslənir; yerləşdirilmiş sözə toxunanda geri qayıdır. Sözlər ilk öyrədildiyi kartda “Lüğətim”ə təkrarsız düşür.
13. Animasiyalar 300–600 ms, kiçik; Reduce Motion; ekran silkələnmir; kart nömrələri görünmür. **Canlı toxunuşlar (25 Nov):** yüngül titrəmə — seçim, ▶, sürət, Kömək/kapsullar, ↑; orta — mikrofon; uğur/xəta — Yoxla nəticəsi. Bar yay kimi dolur; yeni addım 8px aşağıdan çıxır; ▶ basanda 0.94; seçim kartı 0.98→1; Müəllim izahında ifadə kartı toxunanda böyüyür, lavanda parlayır, kiçik Glow Line; şkala nişanları yerinə sürüşür.
14a. **Ana səhifə (25 Nov dizaynı):** fon #F6F7FB; üst sətir — BirTalk (`APP_NAME`), `EN · A1` pill, statistika / ⚡ seriya / ★ xal ağ pill-ləri; **yapışqan bölmə başlığı** (BÖLMƏ n, ad, % halqası, maskot) ekrandakı bölməyə görə dəyişir, bölmələr arası başlıqlar yoxdur; tünd qradiyentli “Gündəlik təkrar” (#1E1B4B→#3B1E7A) narıncı “Başla” ilə; **hər bölmənin öz rəngi** (20 Nov qərarı, 25 Nov bərpa); **ada su kimi dolur** — bölmənin faizi qədər aşağıdan yuxarı, dalğalı səthlə, açıqdan xeyli tünd rəngə, bitəndə tam tünd (suyun altındakı yazılar ağ); dairələr maket kimi ağ haşiyəli, dolğusu faizlə açıqdan tünd bölmə rənginə (≥50% ağ ikon); dairə ətrafında **faiz halqası hər bölmədə eyni firuzəyi-yaşıl** (#2BA68C), doldaqca yüngül parıldayır; yol **rəngsiz** qırıq xətlər (yumşaq əyri), dərsin faizi qədər növbəti dairəyə doğru işıqlanır; yapışqan başlıqda BÖLMƏ n və halqa da bölmə rəngində; dərslər — duotone vektor ikonlu dairələr (`LessonIcon.tsx`, xəritə `ICONS` ApprovedHome-da; emoji yoxdur), nöqtəli yol dairənin aşağısından çıxıb növbətiyə yuxarıdan girir (yazılara toxunmur), yanında ad + % (hissəlidə “· 2 hissə”), kart və nömrə yoxdur; **bütün bölmə bir ekrana sığır** (Gündəlik təkrarın altında); ikonlar dolu, ağ detallı, adlara uyğun (Salam — yellənən əl, Necəsən? — gülümsəyən balon, Üzr — kədərli balon, Başa düşmürəm — baş + ?, Yaş — “18” …); cari dərs (son açılan, yoxsa ilk bitməmiş) böyük narıncı dairə + nəfəs alan halə;  AI zəng kartı yolda; bölmələr arasında **körpü yoxdur**, yalnız böyük qızılı kubok medalyonu (yazı və nöqtə yoxdur, toxunanda imtahan); dərsə toxunanda **alt panel** (ikon, DƏRS n · k HİSSƏ, başlıq, ✕, narıncı bar, hissə kartları — cari ağ/narıncı “Davam →”, digərləri boz/lavanda “Başla”; hissəsiz dərsdə tək narıncı düymə; panel yaysız, sakit sürüşür (0.26 s); söz siyahısı yoxdur; ▶ işlənmir — o, dinləmə ikonudur); düyünlərdə titrəmə + 0.93 yaylanma.
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
| 25 Noy | Vahid dizayn sistemi: fon #F6F7FB, narıncı qradiyent #F97316→#EA580C (hər yerdə), başlıqda bənövşəyi vurğu, çərçivəsiz tapşırıq cümləsi, Glow Line, AI Voice Orb, “İndi danışa bilmirəm”; sürət dövrü qalır (1x→0.75x→0.5x→1.25x) |
| 25 Noy | Orb: yalnız orb, susanda avto-göndər, öz səsləri; çatda ↑ + “...” + reaksiya yalnız düz cavabda (Dərs 1 emoji, sonra öyrədilmiş sözlər); “İki mesajı özün yaz” çat xətti; titrəmə və mikro-hərəkətlər hər ekranda |
| 25 Noy | “Söhbəti sırala” hibrid: hər söhbət ya cümlə rejimində (balonları sırala), ya söz rejimində (“Söhbəti tamamla” — sətirlər yerində, hər birində bir öyrədilmiş söz boş + 1–2 yanlış söz); kursda növbə ilə (`utils/orderGaps.ts`, dərsin sırası + tapşırığın sırası); vəziyyət yazısı yoxdur |
| 25 Noy | “xarici dost” sözü çıxarıldı: adsız xarici dost hər yerdə “dostun” kimi yazılır (ad seçiləndə adı); Uyğunlaşdır ekranlarında yalnız “Cümləyə toxun, sonra cavabını seç.” / “İfadəyə toxun, sonra mənasını seç.”; cavab xanası sıçramır (yaysız fade) |
| 25 Noy | Yeni söz/Öyrən: adi ölçüdə geniş, yığcam yalnız sığmayanda; lüğət: who's = kimdir |
| 25 Noy | Xəritə: maket görünüşü + su kimi dolan ada, faizlə tündləşən dairələr, eyni firuzəyi halqa (parıltılı), rəngsiz yol irəlilədikcə işıqlanır |
| 25 Noy | Xəritə: yol yazılara toxunmur, bölmə rəngləri + tündləşmə qayıtdı, körpü silindi (yalnız kubok), ikonlar adlara uyğun; Yeni söz kartları tam ölçüdə, söz-söz hərf ölçüsü |
| 25 Noy | `check-compile` əlavə olundu (check-all-un içində): təkrar import, elan olunmadan istifadə, təkrar sahə, sintaksis — tətbiq açılmazdan əvvəl tutulur; unit3 lesson2a təkrarında qatar səhnəsi saxlandı |
| 25 Noy | Düzəlişlər: xəritə bir ekrana, dolu ikonlar, yaysız panellər, hissəsiz dərsdə tək düymə, Yeni söz kartı köhnə çərçivəyə qayıtdı (th narıncı), söz-söz hər ifadəyə, orb böyüyür/yayılır/səsə cavab verir, “Salam verir.” artıq səslənmir |
| 25 Noy | Ana səhifə yeni dizaynı: yapışqan bölmə başlığı, ağ adalar, ikonlu düyünlər, narıncı cari dərs, ağ körpü + kubok, dərs alt paneli |
| 25 Noy | Yeni söz kartının yeni dizaynı (ağ kart, slot pill-ləri, ▶|sürət kapsulu, seqment söz-söz); th rəngi bənövşəyi |
| 25 Noy | Yeni nəticə paneli (ağ alt panel, ✓/✕ sətirləri, TƏLƏFFÜZÜ DİNLƏ, “Əla!”); “Daha çox soruş · tezliklə” yer tutucusu |
| 25 Noy | 4 bölmənin tam məntiq yoxlaması (~780 tapşırıq), `check-situation` L1–L21, `check-quality` Q1–Q6, `check-all`; qeydlər bu fayla yığıldı |

Ətraflı tarixçə: `docs/LAYIHE_DEFTERI.md`, `docs/YENI_SOHBET_UCUN.md`, `docs/BUTUN_QAYDALAR.md` (köçürülmədən əvvəlki mətnlər).

## 8. Köhnəlmiş qərarlar (qarışdırma)

| Köhnə | Yerinə |
|---|---|
| İnsan personajları Əli / Leyla (26 Okt) | Adlar boşdur, `{G}` `{B}` (12 Noy); görünüş 3D üslubdan |
| Retro 2D personaj üslubu (3 Noy) | 3D oyuncaq dünyası (11 Noy) |
| Səs `en-GB` (11 Noy) | `en-US` (13 Noy) |
| Öyrətmə kartında “Davam et” yaşıl (12 Noy), izahda yaşıl “Başa düşdüm” (20 Noy) | Narıncı (24 Noy, G6); yaşıl yalnız düz cavabdan sonra |
| Narıncı #E06A00, tapşırıq cümləsi bənövşəyi sol xətli qutuda, sütunlu dalğa (soldan dolan), danışıqda “Keç” pill-i | 25 Noy dizayn sistemi (§4.5, §4.10a–b) |
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
8a. **“Daha çox soruş”** (25 Nov qərarı): “Mənə başa sal” hazır, yoxlanmış izah olaraq qalır; altında AI ilə əlavə sual düyməsi — indi yalnız “tezliklə” yer tutucusu (`LessonSheets.tsx`), AI serveri qurulanda işə düşür (AI müəllim və AI zəng ilə eyni server; izahın və dərsin sözlərinə əsaslanır).
8. AI zəng: real AI API, pullu server; əvvəl maket (gələn zəng / danışıq / zəng bitdi); yalnız öyrədilmiş sözlərlə.
9. Supabase sinxronu (ilk variant: buluda saxla / bərpa et).
10. Mağaza auditi: hesab silmə, məxfilik siyasəti, işləməyən profil düymələri, “ŞƏKİL” işarələri, boş AI söhbət və işləməyən “Daha çox soruş” gizlənsin, test girişi `[]`, icazə mətnləri, yaş 13+ (`docs/BEYNELXALQ_AUDIT_2026-11-14.md`).

**Açıq texniki işlər**
11. Telefonda yoxlanmalı (23–25 Noy dəyişiklikləri; 25 Noy dizayn sistemi — Glow Line və Orb animasiyası, qradiyentlər): ana səhifə, sabit ekranlar, sürət düyməsi, Müəllim izahı, mesajlaşma, Dinlə və anla, KindChip, məntiq düzəlişləri.
12. Android səs tanıma diaqnostikası (`SPEECH_DEBUG`).
13. Xəritədə “Dəqiqlik %” saxlanmır.
14. Təbiilik qeydi: “He is fine” → “He's fine” (Bölmə 3 Dərs 5).
15. Ana dilli yoxlama mümkün deyil — G2 qaydaları məcburi (§2.20).
16. İstifadəçinin kompüterində `package-lock.json` vəziyyəti (`git status`).
