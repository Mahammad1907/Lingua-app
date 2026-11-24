# BirTalk — bütün qaydalar bir yerdə (14 noyabr 2026)

Bu fayl istifadəçinin indiyə qədər verdiyi bütün qərarların yığcam siyahısıdır. Ziddiyyət olanda **daha yeni qərar qüvvədədir**; burada köhnəsi artıq düzəldilib. Ətraflı: `docs/LAYIHE_DEFTERI.md` (tarixçə), `docs/DERS_STANDARTI.md`, `docs/IZAH_STANDARTI.md`, `AGENTS.md`.

---

## A. İş qaydası (istifadəçi ilə)

1. Cavablar **Azərbaycan dilində**, qısa və aydın. Telefondan oxuyur.
2. İstifadəçi səhvləri bir-bir göstərir. **“Bitdi” / “hələlik bu qədər, başla” deyənə qədər yalnız qeyd et**, kodu dəyişmə. Tək “Tamam”, “Yaxşı”, “Bəli” başlamaq əmri deyil. “Hələlik bunu et” desə — həmin bəndi dərhal et.
3. Hər qeydi nömrələ (1, 2, 3…), sonda hamısını birlikdə et.
4. **Bir ekranda dəyişiklik edəndə bütün ekranları yoxla.** Eyni problem başqa ekranda da varsa, orada da düzəlt.
5. **“Edildi” deməzdən əvvəl kodda həqiqətən yoxla.** Keçmişdə “edildi” yazılıb edilməyən bəndlər olub — istifadəçi bundan çox narazıdır. “Yaxşıdır” deməzdən əvvəl nəyi yoxladığını və nəyi yoxlamadığını ayrıca de.
6. Telefonda yoxlanmayanı “yoxlandı” demə. Kod yoxlaması ≠ telefonda yoxlama.
7. İşin sonunda istifadəçiyə **hansı ekranlara baxacağını** siyahı ilə ver.
8. **Qənaət:** lazım olmayan faylı oxuma, şəkil render etmə, istənməyən ekran görüntüsünə baxma (limit). Böyük mətn işini ayrıca agentə ver.
9. Yeni ekran növü və ya böyük dizayn dəyişikliyi: **əvvəlcə maket göstər**, istifadəçi təsdiqləsin, sonra kod.
10. Böyük məzmun işindən sonra **mətni yazmayan müstəqil yoxlayıcıya** oxut, hesabatı süzmədən istifadəçiyə göstər.
11. İstifadəçinin öz qərarı olmadan təsdiqlənmiş şeyi dəyişmə. Dərs 1 təsdiqlənmiş yekun sənəddəndir (`docs/BirTalk_Ders_1_Yekun.md`) — dəyişsə, həm kodda, həm sənəddə.
12. Telefonda yoxlama: Windows + iPhone, **Expo Go**: `git pull`, sonra `npx.cmd expo start -c --go`. Git “Unlink of file … (y/n)” → `n`, Metro-nu dayandır, yenidən `git pull`.
13. Commit sonunda iki sətir: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` və `Claude-Session: https://claude.ai/code/session_015orjzHXofg7AjSqio3a7pd`. İstifadəçinin e-poçtu heç yerə yazılmır.
14. `package.json`, `package-lock.json`, SDK fayllarına toxunma. `ios/` `android/` əllə yaradılmır.

## B. Məzmun qaydaları

1. **Öyrədilmədən soruşma (ən vacib).** Heç bir tapşırıq — seçim, səs, nümunə, qəbul siyahısının hamısı, izah, ipucu — əvvəl öyrədilməmiş ingilis sözünü göstərmir. Qeyddə keçən söz öyrədilmiş sayılmır. Dərs sonundakı “Təkrar”da həmin dərsin sözləri ola bilər.
2. **İfadə öz kartından əvvəl heç yerdə görünmür** (səhv variant və nümunə də daxil).
3. **Bir kartda bir ifadə.** Yalnız eyni mənalı qısa cütlər birlikdə: Hello/Hi, Goodbye/Bye, Thank you/Thanks.
4. **Hibrid ekranlar:** 12 noyabr təsdiqlənmiş ekranları (Dinlə və seç, Dinlə və yaz, Yazı, Səslə cavab, İki mesaj, Seçim) + sonra əlavə olunanlar (Sözü tamamla, Mesaj yaz, Dialoq, Kim nə dedi?, Səhnədə tap, Təkrarla, Söhbəti sırala, Cavab cütü). Hər dərsdə hər iki qrupdan.
5. **Şablon yoxdur:** eyni ekran növü dalbadal gəlmir (bir söhbətin növbələri istisna); iki dərs eyni üç ekranla bitmir; dərslərin açılışı və məkanı dəyişir.
6. Dərs 11–14 kart (DERS_STANDARTI-dəki 10–12 köhnədir; 14-dən çox olmaz). **Bölmə 2-dən: bir dərsdə (hissədə) 4–6 yeni vahid** (14 noyabr; hazır ifadə və nümunə qrupu bir vahid). Bölmə 1 2–3 ilə qalır.
6b. **Bölmə 2 hazırdır** (14 noyabr): mətn `src/data/unit2/`, imtahanlar `src/data/unit1/exam.ts`, `src/data/unit2/exam.ts`. Hər dəyişiklikdən sonra: `node scripts/check-taught.cjs`, `check-unit1.cjs`, `check-unit2.cjs`, sonra `node scripts/export-unit1-docs.cjs` (bütün `docs/dersler/` sənədləri). Yeni ekranlar: Nömrəni yığ, Hərfləri tut, Formanı doldur; xəritədə 2 hissəli dərs və bayraqlı imtahan düyməsi. Telefonda yoxlanmayıb.
6c. **Bölmə 3 hazırdır** (15 noyabr): mətn `src/data/unit3/` (11 hissə + `exam.ts`), xəritə `docs/BOLME_3_XERITESI.md`. Yoxlama: `node scripts/check-unit3.cjs` (səhvlər `scripts/unit3-mistakes/`). Yeni ekran: **Xəritədə tap**. “Yes, I'm.” / “Yes, she's.” kimi qısa cavablar qəbul olunmur. Telefonda yoxlanmayıb.
6d. **Bölmə 4 "Ailə və insanlar" hazırdır** (21 noyabr 2026): mətn `src/data/unit4/` (9 hissə: 1, 2a, 2b, 3, 4, 5, 6, 7, 8 + `exam.ts`), xəritə `docs/BOLME_4_XERITESI.md`. Yoxlama: `node scripts/check-unit4.cjs` (səhvlər `scripts/unit4-mistakes/`). Yeni ekranlar: Ailə ağacı (`tree`), Söz sürüklə (`drag`), Profil kartı (`profile`) — `docs/NEW_LESSON_SCREENS.md`. Cihazda yoxlanmayıb.
6e. **Hər bölmə xəritəsində “Yeni ekran ideyası” sətri məcburidir** (21 noyabr 2026, istifadəçi): hər bölmənin xəritəsini yazanda mövzuya uyğun ən azı bir yeni ekran təklif olunur (A9 — əvvəlcə maket). Agentlərə bölmə yazdıranda bu sətir tapşırığa daxil edilir.
6a. **Xəritədə hər bölmə sabit 8 dərs.** Çox material → dərs 2 hissəyə bölünür, xəritə uzanmır. Hər bölmənin sonunda **bölmə imtahanı** (Kömək yoxdur, keçid ≥70%). Ətraflı: `docs/BOLME_2_XERITESI.md` §0.
7. Seçim tapşırığında **3 variant**; yanlışlar Azərbaycan dilli öyrənənin real səhvlərindən (`docs/AZ_OYRENEN_SEHVLERI.md`). İki düzgün cavab ola bilməz.
8. Hər tapşırığın **ipucu** var: bir cümlə, yolu göstərir, cavabı açmır, vəziyyətə uyğundur, Təkrarın yeni vəziyyətinə uyğundur.
9. Səhvlər dərsin sonunda **yeni vəziyyətdə, eyni bacarıqla** təkrar gəlir (bacarıq yox, vəziyyət dəyişir).
10. Nümunə əvvəlcədən yalnız Dərs 1–2-də görünür; sonra yalnız Kömək ilə.
11. **Ad yeri** “…” ekranda **[ad]** görünür (ingiliscə və azərbaycanca). Öz adını yazanda istənilən ad qəbul olunur.
12. Personaj adları hələ boşdur: maskot `{M}` (“Dostun”), qız `{G}`, oğlan `{B}`, **xarici dost `{F}`** — `src/config/characters.ts`. **Üç daimi insan personaj** (18 noyabr 2026, istifadəçi): qız, oğlan və xarici dost (**qadın, ABŞ-dan**, ingiliscə danışır; rəngi qız-oğlandan fərqli, şəkillər çəkiləndə seçilir). Dostun adını bilirsən — ad soruşan “yeni tanış”dır, dost deyil. Birdəfəlik başqa ölkələrdən olan xaricilər adsız “Yeni tanış” qalır (dördüncü adlı personaj yoxdur). `{F}` Bölmə 4-dən istifadə olunur; Bölmə 1–3-ün “tanışlıq” tapşırıqları dəyişmir.
13. Auditoriya **böyüklərdir**: “sinifdə uşaq” yox, “kursda yoldaş”, iş, kafe, küçə və s.
14. Başlıq, tərcümə və ingilis cümləsi **eyni zamandadır** (I don't understand → “Başa düşmürəm”).
15. “Edə bilirəm” və nəticə cümlələri öyrənənin **həqiqətən etdiyi işi** deyir.
16. Kurs “CEFR A1 təsvirlərinə əsaslanır” — “CEFR sertifikatlı” demə.
19. **Şəkillər ən sonda** (15 noyabr 2026, istifadəçi): bütün bölmələr B2-yə qədər hazırlanır, şəkillər ən sonda bir dəfəyə yaradılır. O vaxta qədər hər şəkil yeri işarə ilə qalır və `SCENE_NOTES`-də qısa təsviri yazılır (kim, harada, nə edir). Ortaq səhnələr (kafe, ziyafət, qeydiyyat) təkrar istifadə olunur; yeni söz kartları maskotun bir neçə pozasını işlədir.
18. **Yeni söz kartında söz-söz izah — həmişə, bütün dərslərdə** (15 noyabr 2026, istifadəçi): ifadənin ümumi mənası kifayət deyil. Kartda ifadədəki hər yeni söz ayrıca izah olunur (məs. Is — “-dır?” sualı başladır; that — o, bu; right — düz). Yeni sözlər rənglə, əvvəldən bilinənlər adi rəngdə. Çətin səs varsa (th, w…) qısa tələffüz qeydi. Bölmə 1, Bölmə 2 və bütün gələcək dərslərə aiddir.
20. **"Azeri" sözü qadağandır** (15 noyabr 2026, istifadəçi): Azərbaycanda işlədilməsinə pis baxılır. Heç yerdə — kart, variant, qəbul siyahısı, izah — yalnız "Azerbaijani".
17. **Yeni ekran növləri yaradıla bilər** (14 noyabr 2026): dərsin məqsədinə lazım olanda yeni, maraqlı tapşırıq ekranları əlavə olunur. Hər yeni ekran əvvəlcə maket kimi göstərilir (A9), təsdiqdən sonra kod. Dərslər bir-birinin eyni olmamalıdır (B5).

## C. İzah qaydaları (“Mənə başa sal”) — `docs/IZAH_STANDARTI.md`

1. Düz 4 sətir, hər biri bir cümlə: **Uyğun / Səbəb / Qayda / Nümunə**.
2. Yalnız ekrandakı iki formadan danış; “həmişə”, “başqa şəxslər”, he/she/we/they yazma.
3. Termin yoxdur: fel, şəxs, inkar, kopula, qoşma.
4. Qayda — iki hazır cümlə (forma cütü), lüğət tərcüməsi deyil (“fine = yaxşı” olmaz).
5. Sistem cümləsi və boş şablon yoxdur (“müəyyən edilmədi”, `{purpose}`).
6. Başqa tapşırığın cümləsini köçürmə; izahda IPA yoxdur.
7. Öyrədilmiş formalar: I + am → I'm; How are you?; My name is (is ayrıca söz); I'm not very well — burada not; I don't understand — burada don't; please = xahiş; thanks = təşəkkür (həm də “I'm fine, thanks”); You're welcome = təşəkkürə cavab; Excuse me = “Bağışlayın (diqqət)”, Sorry! = “Bağışlayın (səhv)”; Sorry? = nə dedin.

## C2. İpucu necə yazılır (hər tapşırıqda və hər Təkrarda)

1. Bir qısa cümlə, öyrənənə yol göstərir — cavabı demir, cavabın yarısını da açmır.
2. Ekrandakı vəziyyətə uyğundur; Təkrarda vəziyyət dəyişibsə, ipucu da yeni vəziyyətə görə yazılır (əsas tapşırıqdan köçürülmür).
3. Ekranda olmayan şeydən danışmır; öyrədilməmiş ingilis sözü, IPA, termin yoxdur.
4. Əvvəlki dərsə istinad edirsə, düzgün dərsi göstərir.
5. Toxun-yerləşdir ekranlarında (Kim nə dedi?, Cavab cütü, Söhbəti sırala) Kömək düyməsi olmadığı üçün ipucu göstərilmir.

| Pis | Niyə | Yaxşı |
|---|---|---|
| “Sual kimi deyilən ‘Sorry?’ üzr deyil, ‘nə dedin?’ deməkdir.” | cavabı açır | “Sual kimi deyilən sözə diqqət et — o, üzr deyil.” |
| “Sənə nəsə verəndə nə deyirsən?” (vəziyyət: qapını açır) | vəziyyətə uymur | “Sənə kömək edəndə nə deyirsən?” |
| “…yoxsa xahiş edəndə?” (ekranda please yoxdur) | ekranda olmayan şey | “…yoxsa hal soruşanda?” |
| “ingiliscə ‘-am’ ayrıca sözdür” | cavabı demək olar açır | “Azərbaycancada şəkilçi olan hissə ingiliscə I-dan sonra ayrıca söz kimi gəlir.” |
| “Başa düşməyəndə nə deyirsən?” (vəziyyət: eşitmədin) | Again ≠ I don't understand | “Eşitməyəndə nə deyirsən?” |
| — | yaxşı nümunə | “Əvvəl salam, sonra adın.” |

Yoxlama: `check-taught.cjs` ipucularda öyrədilməmiş sözü, IPA-nı və qadağan sözləri tutur; məntiqi (vəziyyətə uyğunluq, cavabı açmaq) isə yalnız müstəqil yoxlayıcı tutur — yeni dərslərdən sonra ona mütləq ipuclarını da yoxlat.

## D. Tələffüz və səs

1. Səs hər yerdə **en-US** (Amerika).
2. Oxunuş Azərbaycan hərfləri ilə, Amerika tələffüzü, **iki nöqtə və fonetik işarə yoxdur**: “hau ar yu?”, “uats yor neym?”, “sari”; /æ/ = “ə” (**th**ənks, ənd); “your” = “yor”; **th** qalın narıncı.
3. IPA yalnız `pronunciation` sahəsində (söz pəncərəsi, Lüğətim), kartda göstərilmir.

## E. Ekran dizaynı

1. Əsas — 12 noyabr təsdiqlənmiş dizayn şəkilləri (açıq lavanda fon, bənövşəyi/narıncı vurğu, Nunito).
2. **Solğun mətn yoxdur:** vəziyyət sətri tünd bənövşəyi extrabold 18, tapşırıq sətri tünd extrabold 19. Mətn rəngləri ≥4.5:1 kontrast: `orangeText #A84A08`, `greenText #0F6E2A`, `redText #B42318`; narıncı/yaşıl dolğu yalnız fon və böyük düymə üçün.
3. **Səs düymələri yalnız ikon:** dairəvi play + tısbağa (yavaş). “Dinlə” yazısı yoxdur.
4. **Yeni söz kartı:** bənövşəyi banner + maskot + balonda ifadə, altında oxunuş, play, tısbağa; altda Mənası · Quruluşu (lazım olanda) · Nümunə · bir qısa qeyd. **Ekran sürüşmür.**
5. Danışanın kartı: avatar + cümlə + play + dalğa + tısbağa. Avatar: maskot başı (kəsilmir) və ya çəkilmiş qız/oğlan (hərf yox).
6. Kömək: dinləmədə səs kartının altında; **Kim nə dedi?, Cavab cütü, Söhbəti sırala ekranlarında Kömək yoxdur.**
7. Sözə toxunanda mənası çıxır və səslənir; yerləşdirilmiş söz/balona toxunanda geri qayıdır.
8. Səhv cavab: qırmızı (bir dəfə vurğu, sonra sabit), “Mənə başa sal” yalnız X ilə bağlanır; düzgün: yaşıl. Texniki problem dil səhvi deyil, qırmızı olmur. Xəta bildirmə — bayraq ikonu.
9. Mikrofon: “Basılı saxla və danış” (bir toxunuşla da işləyir). Expo Go-da səs tanıma işləmir → “Yoxlanmadı”, normaldır.
10. Ana səhifə (A5): yumru dərs düymələri, faiz halqaları, nöqtəli yol (rəngli → rəngsiz), toxunanda kart açılır, yuxarı sağda maskot başı, Analiz ikonu, altda üzən menyu (AI söhbət “tezliklə”). Uzun dərs kartları yox, maskot qucaqlamır.
11. Analiz ekranı: müasir, amma başa düşülən qrafiklər.
12. Animasiyalar: 300–600 ms, kiçik; Reduce Motion dəstəklənir; ekran silkələnmir.

## F. Şəkillər

1. **Hələlik boş qalır** — şəkil yaratma/axtarma. Lazım olan yerə narıncı “ŞƏKİL n · təsvir” işarəsi: kartda `scenes`, `src/config/sceneImages.ts`-də `SCENE_NOTES`, `docs/SEKIL_SIYAHISI.md`-də sətir.
2. Söhbət, dinləmə, səsli cavab, Sözü tamamla, Kim nə dedi ekranlarında şəkil yoxdur (avatar/səs kartı var).
3. Eyni 3D oyuncaq üslubu, eyni qız, oğlan, maskot. Şəkildə yazı olmasın. Buraxılışdan əvvəl işarələr gizlədilməlidir.

## G. Yoxlama proqramları (hər dəyişiklikdən sonra)

```
node scripts/check-taught.cjs        # B1, B2, B5, C, izah/ipucu sözləri
node scripts/check-unit1.cjs         # Dərs 2–8 quruluşu
node scripts/check-design-lesson.cjs # Dərs 1
node scripts/check-unit2.cjs         # Bölmə 2
node scripts/check-unit3.cjs         # Bölmə 3
node scripts/export-unit1-docs.cjs   # docs/dersler/*.md
```
Yeni bölmə üçün eyni yoxlamalar yeni bölməyə də qoşulmalıdır.

## G2. İngilis mətninin təbiiliyi (18 Nov 2026 qərarı — bu gündən sonra yazılan HƏR mətnə aiddir)
Ana dilli müəllim və real istifadəçi yoxlaması yoxdur. Ona görə təbiilik üçün bu qaydalar məcburidir (A1, A2, B1, B2 — hamısı):
1. **Sadə və yayğın forma.** Şübhə olanda ən çox işlənən dərslik formasını seç, qeyri-adi və ya "ağıllı" ifadə yazma. Hər cümlə “ana dilli bunu belə deyərdimi?” sualından keçməlidir.
2. **İdiom və sabit ifadə yoxlanır.** Hər idiom, sabit söz birləşməsi və B1+ ifadəsi WebSearch ilə real işləndiyi yoxlanmadan dərsə girmir; tapılmırsa çıxarılır. A1-də də şübhəli birləşmə üçün eyni.
3. **Ayrıca təbiilik yoxlayıcısı.** Hər yeni bölmə bitəndə müstəqil (dərsi yazmayan) agent yalnız ingilis təbiiliyinə və Azərbaycan izahının tonuna baxır; tapıntılar düzəldilir. Bu, adi quruluş rəyindən ayrıdır.
4. **Real mətnə əsaslanmaq (B1–B2).** Uydurma cümlə əvəzinə real işlənən nümunələrdən çıxış et.
5. **İstifadəçi düzəlişi.** Tətbiqdəki “Şikayət et” (`ReportSheet`) qeyri-təbii cümlələr üçün əsas kanaldır; buraxılışdan sonra gələn şikayətlər birinci sırada baxılır.
6. **Hesabatda dürüstlük.** Bölmə təhvil verəndə “ana dilli yoxlamasından keçməyib” qeydi yazılır; belə yoxlama olmadan “təbiidir” deyilmir.

## G3. Qərarlar — 18 Nov 2026 söhbəti (yeni söhbət bunları bilməlidir)
- **Keçid balı 70%** (`src/utils/examResults.ts`); bölmə imtahanı keçilməyincə növbəti bölmə açılmır (`TEST_OPEN_SECTIONS` test üçün hələ açıqdır).
- **Təkrar sistemi** 1/3/7/14 gün: `src/utils/spacedReview.ts`, `reviewStore.ts`, `reviewSession.ts`, ana səhifə “Gündəlik təkrar” kartı.
- **Sinxron (Supabase)** buraxılışdan əvvələ saxlanılıb; ilk variant: yalnız “buluda saxla / yeni cihazda bərpa et”. **Səsləndirmə** və **şəkillər** sonda; səs: hər personaj üçün ayrıca TTS səsi, fayllar buludda (Duolingo yolu). Hamısı Bölmə 4-dən SONRA.
- **Səs tanıma:** telefonun öz tanıması (`expo-speech-recognition`) əsasdır; Azure ehtiyatı qurulmayıb və hələlik lazım deyil. İstifadəçi iPhone + Expo Go işlədir (səs tanıma orada işləmir) və evdə Android telefonu var → səs sınağı Android development build ilə (EAS, pulsuz). Apple hesabı yoxdur.
- **Real istifadəçi və ana dilli müəllim yoxlaması mümkün deyil** → G2 qaydaları məcburidir, bölmə təhvilində “ana dilli yoxlamasından keçməyib” yazılır.
- **Dərslik təcrübəsi (A1) — nə öyrədilir:** ad soruşmaq “What's your name?” (+ “Nice to meet you.” adlardan SONRA); “Excuse me” yalnız diqqət çəkmək üçün (“Excuse me, how do you spell that?”); anlamayanda “Sorry?”, “Can you say that again, please?”, “Can you speak more slowly, please?”, “I don't understand.”; “I'm good / I'm fine, thanks. And you?”; “I'm not great.” (“not very well” ABŞ-da xəstəlik deməkdir). CEFR A1 cümlə siyahısı vermir, bacarığı təsvir edir; təbiilik üçün nəzakətli variant əsas, “Again, please.” yalnız qısa alternativdir.
- **Gündəlik / rəsmi:** “Hi! What's your name?” gündəlik; “Excuse me, what's your name?” nəzakətli-rəsmi tərəfə yaxın; “Say that again, please.” gündəlik; “Could you say that again?” neytral-nəzakətli.
- **Yoxlayıcı tapıntıları (Bölmə 1–3):** DÜZƏLDİLDİ (18 Nov): “Say that again, please.” / “More slowly, please.” (köhnə qısa formalar qəbul olunur), “Excuse me, what's your name?” yalnız yad adam/işçi situasiyasında, “Nice to meet you!” adlardan sonra, “I'm not great.”. HƏLƏ DÜZƏLDİLMƏYƏN: (4) “He is fine” → “He's fine” (Bölmə 3 Dərs 5, “is” öyrədildiyi üçün ehtiyatla); (6) ~~Mr/Ms nöqtəsi~~ — DÜZƏLDİLDİ 21 Nov: Mr. / Ms. nöqtə ilə, “I'm not very well”, forma etiketi “How old are you?” (“Age” hələ öyrədilməyib — taught-before-asked). Düzəldilmişlər: commit 6442128.

- **Müəllim izahı ekranı (20 Nov 2026, təsdiqlənmiş maket):** mövzu qısa söz kartı ilə tam açılmırsa, söz kartından sonra `type: 'explain'` kartı gəlir: maskot balonu, 1–3 nömrəli hissə (kim haqqında / niyə belə yazılır / necə qurulur), “Diqqət et” qeydi, yaşıl “Başa düşdüm”. Mövzu çox qəlizdirsə, ikinci izah kartı ola bilər, aralarında qısa tapşırıq olur. İlk istifadə: Bölmə 3 Dərs 5 (1-ci hissə). Dərsin əvvəlindəki “Bu dərsdə” ekranı göstərilmir (imtahanlarda qalır).
- **Qısa formalar (20 Nov 2026):** qısa forma (I'm, he's, she's, what's …) dərsdə ilk dəfə gələndə ondan əvvəl “Qısa forma” teach kartı olur: iki forma səsli (I am → I'm), “Danışıqda qısa deyilir. Mənası eynidir.” və apostrofun düşən hərfin yerini göstərdiyi deyilir. Termin işlənmir. Sonrakı kart əvvəlkini xatırladır. İndi var: Bölmə 1 Dərs 2 (I'm), Bölmə 3 Dərs 5 (he's / she's) ayrıca kartla. Dərs 14 kartdadırsa, ayrıca kart yox, söz kartında `shortForm` bloku (səsli “What is → What's”): What's, You're, don't, It's, that's, Where's, isn't.

## H. Mağazaya çıxmazdan əvvəl (audit — hələ edilməyib)

Hesab silmə; məxfilik siyasəti və link; profildəki işləməyən düymələr (Premium, Kömək, ayarlar) və “Lingua App v0.1”; “ŞƏKİL” işarələri və boş AI söhbət gizlənsin; Azure səs tanıması üçün açıq razılıq (pilot endpoint buraxılışa getməsin); icazə mətnləri ingiliscə də; yaş 13+. Ətraflı: `docs/BEYNELXALQ_AUDIT_2026-11-14.md`.

## I. Növbəti işlərin ardıcıllığı (təklif, `docs/FUNKSIONALLIQ_RAYI_2026-11-14.md`)

1. Gündəlik təkrar (indi düymə boş ekran açır) + xatırlatma və gündəlik hədəf.
2. Bölmə imtahanı yeni dizaynda, “bölmə bitdi” anı.
3. Bölmə 2+ (əvvəl bölmə xəritəsini istifadəçiyə təsdiqlət).
4. Tələffüz rəyi (dev build lazımdır).

## G4. Qaydalar tabı və menyu (21 Nov 2026, istifadəçi)
- Menyu: Öyrən · Qaydalar · AI müəllim · Lüğətim · Profil. Təkrar menyudan çıxdı (xəritədə qalır). "AI söhbət" adı — "AI müəllim".
- Hər Müəllim izahı avtomatik qaydadır (`src/data/rules.ts`). Yeni izah kartı yazanda `RULE_META`-ya qısa ad və mövzu yazılır — `node scripts/check-rules.cjs` olmayanı tutur.
- Qayda "Başa düşdüm" basılanda (və ya dərs bitəndə) açılır. İzahdan sonrakı tapşırıqlar həmin qaydaya bağlıdır: səhvlər qaydanı zəiflədir (Zəif / Öyrənilir / Möhkəm), "Diqqət lazımdır"da görünür. Səhv panelində "Qaydaya bax".
- Cədvəllər (Rəqəmlər, Əlifba, Qısa formalar, Nömrə və e-poçt, Ölkə və millət) dərslərin söz kartlarından qurulur; yalnız başlanmış dərslərin sətirləri açıqdır.

## G5. Dərs mətnində “…” yoxdur (21 Nov 2026, istifadəçi)
- Öyrənənin görəcəyi heç bir mətndə yarımçıq “…” qalmır (“I'm …”, “Mən …-am”). Ad yerində `[ad]`, soyad `[soyad]`, ölkə `[ölkə]`, şəhər `[şəhər]`, millət `[millət]`, yaş `[yaş]`, dil `[dil]`, nömrə `[nömrə]` yazılır; mümkün olanda konkret nümunə (I'm from Baku.) daha yaxşıdır.
- Boşluq doldurma tapşırığında boş yer ekranda `______` ilə çəkilir; sahə placeholder-i “Adını yaz” kimi sözlə yazılır.
- Icazəli “…”: sözə bitişik davam/kəsilmiş sıra (`Twelve…`, `L… A… N…`, `It's oh five oh…`).
- Səs oxunuşu `[…]` nişanlarını oxumur (TapText, DesignLesson). `node scripts/check-placeholders.cjs` boş “…” tapsa uğursuz olur.
- Qaydalar tabında qayda adları sual formasındadır (“Salamı necə deyim?”) və hər birinin altında ingilis nümunəsi var (`RULE_META.eg`); `check-rules.cjs` “?” və nümunəni yoxlayır. Mövzular ekranda göstərilmir, qaydalar bölmələrə görə (yenisi yuxarıda) qruplanır.

## G6. VACİB QAYDA — rənglər və dinləmə ikonu (24 Nov 2026, istifadəçi)
- Bütün dərs ekranlarında **irəli aparan düymələr** (“Davam et”, “Başa düşdüm”, “Yoxla”) və **yuxarıdakı irəliləyiş barı** maskotun standart rəngindədir: narıncı `d.action` (#E06A00, ağ yazı oxunsun deyə maskot narıncısının bir az tünd tonu).
- **İstisna — cavab yoxlanandan sonrakı düymə:** cavab düzdürsə **yaşıl**, səhvdirsə **qırmızı** (`ResultPanel`, `LessonSheets.tsx`). Bu, əvvəldən belə idi və belə qalır.
- **Dinləmə ikonu bütün səhifələrdə eynidir: ▶ (play)**, bənövşəyi dairəvi düymədə. Bir ortaq komponent: `SoundButton` / `SoundIcon` (`src/components/design/TaskScreens.tsx`); səsli mesaj kartının düyməsi də eyni rəngdədir. Dinamik, dalğa və s. kimi başqa səs ikonları işlənmir.

## G7. VACİB QAYDA — bütün ekranlarda eyni olanlar (24 Nov 2026, istifadəçi)
Bir ekranda dəyişən ortaq element **bütün ekranlarda eyni** dəyişir. Hər dəyişiklikdən sonra bütün ekran növləri bu siyahı ilə yoxlanır:
1. Yuxarı hissə: geri düyməsi, narıncı irəliləyiş barı, menyu (`Header`).
2. Ekran nişanı: ikon + “DƏRS 1 · NÖV” — bir komponent `KindChip` (`parts.tsx`): YENİ SÖZ, ÖYRƏN, MÜƏLLİM İZAHI, DİNLƏMƏ, YAZI, DANIŞIQ, SEÇİM, UYĞUNLAŞDIR, YERLƏŞDİR, ANKET.
3. Başlıq və tapşırıq cümləsi: eyni ölçü və rəng.
4. Kartlar: ağ fon, yumşaq kölgə (`shadow`), eyni künc.
5. Səs düyməsi: ▶ bənövşəyi dairə (`SoundButton`, G6).
6. Kömək düyməsi: eyni forma; mesajlaşma ekranında söhbətin başlığında.
7. Cavab variantları və yazı sahəsi: eyni görünüş (`ChoiceOption`, `Field`).
8. Köməkçi yazılar (“İndi dinləyə bilmirəm” və s.): eyni üslub (`Capsule`).
9. Əsas düymə narıncı; cavabdan sonra yaşıl/qırmızı (G6).

## G8. VACİB QAYDA — vəziyyət ekrana uyğun olmalıdır (24 Nov 2026, istifadəçi)
Tapşırığın vəziyyəti öyrənənin ekranda etdiyi işə uyğun olmalıdır: **üz-üzə görüş, göstərmək, zəng → danışmaq**; **mesaj, çat, e-poçt → yazmaq**. Mesajlaşma ekranı (`ChatThread`) olan tapşırığın mətni yazışma olduğunu deyir (“yazır”, “mesaj”, “çat”), şəkli də görüş şəkli olmur. Cavab o vəziyyətdə real həyatda deyiləcək/yazılacaq şey olmalıdır; təlimat düz cavablardan birini kənarda qoymamalıdır (“qısa salam” → Hello da düzdür). Yoxlama: `node scripts/check-situation.cjs` (tapdığı hər yeri insan oxuyub qərar verir).
