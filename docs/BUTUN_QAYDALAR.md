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
6. Dərs 11–14 kart (DERS_STANDARTI-dəki 10–12 köhnədir; 14-dən çox olmaz). Bir dərsdə 2–3 yeni ifadə.
7. Seçim tapşırığında **3 variant**; yanlışlar Azərbaycan dilli öyrənənin real səhvlərindən (`docs/AZ_OYRENEN_SEHVLERI.md`). İki düzgün cavab ola bilməz.
8. Hər tapşırığın **ipucu** var: bir cümlə, yolu göstərir, cavabı açmır, vəziyyətə uyğundur, Təkrarın yeni vəziyyətinə uyğundur.
9. Səhvlər dərsin sonunda **yeni vəziyyətdə, eyni bacarıqla** təkrar gəlir (bacarıq yox, vəziyyət dəyişir).
10. Nümunə əvvəlcədən yalnız Dərs 1–2-də görünür; sonra yalnız Kömək ilə.
11. **Ad yeri** “…” ekranda **[ad]** görünür (ingiliscə və azərbaycanca). Öz adını yazanda istənilən ad qəbul olunur.
12. Personaj adları hələ boşdur: maskot `{M}` (“Dostun”), qız `{G}`, oğlan `{B}` — `src/config/characters.ts`. Yalnız iki insan personaj. Dostun adını bilirsən — ad soruşan “yeni tanış”dır, dost deyil.
13. Auditoriya **böyüklərdir**: “sinifdə uşaq” yox, “kursda yoldaş”, iş, kafe, küçə və s.
14. Başlıq, tərcümə və ingilis cümləsi **eyni zamandadır** (I don't understand → “Başa düşmürəm”).
15. “Edə bilirəm” və nəticə cümlələri öyrənənin **həqiqətən etdiyi işi** deyir.
16. Kurs “CEFR A1 təsvirlərinə əsaslanır” — “CEFR sertifikatlı” demə.

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
node scripts/export-unit1-docs.cjs   # docs/dersler/*.md
```
Yeni bölmə üçün eyni yoxlamalar yeni bölməyə də qoşulmalıdır.

## H. Mağazaya çıxmazdan əvvəl (audit — hələ edilməyib)

Hesab silmə; məxfilik siyasəti və link; profildəki işləməyən düymələr (Premium, Kömək, ayarlar) və “Lingua App v0.1”; “ŞƏKİL” işarələri və boş AI söhbət gizlənsin; Azure səs tanıması üçün açıq razılıq (pilot endpoint buraxılışa getməsin); icazə mətnləri ingiliscə də; yaş 13+. Ətraflı: `docs/BEYNELXALQ_AUDIT_2026-11-14.md`.

## I. Növbəti işlərin ardıcıllığı (təklif, `docs/FUNKSIONALLIQ_RAYI_2026-11-14.md`)

1. Gündəlik təkrar (indi düymə boş ekran açır) + xatırlatma və gündəlik hədəf.
2. Bölmə imtahanı yeni dizaynda, “bölmə bitdi” anı.
3. Bölmə 2+ (əvvəl bölmə xəritəsini istifadəçiyə təsdiqlət).
4. Tələffüz rəyi (dev build lazımdır).
