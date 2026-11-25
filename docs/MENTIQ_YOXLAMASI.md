# Məntiq yoxlaması — hər tapşırıq real həyata uyğun olmalıdır

İstifadəçi qaydası (24–25 noyabr 2026): tapşırığın vəziyyəti, ekranı, şəkli, cavabı və təlimatı bir-birinə və real həyata uyğun olmalıdır. Bölmə 1–4 tam oxunanda tapılan **bütün səhv növləri** aşağıdakı L1–L21 qaydalarıdır. Hamısı bir əmrlə tapılır (keyfiyyət yoxlamaları Q1–Q6 isə aşağıda, ayrıca əmrlədir):

```
node scripts/check-situation.cjs
```

Skript söz siyahıları ilə işləyir — tapdığı hər yeri insan oxuyub qərar verir. Skriptin tuta bilmədiyi hallar üçün aşağıdakı “İnsan yoxlaması” siyahısı da hər bölmədə keçilir.

## Avtomatik qaydalar (check-situation.cjs)

| # | Qayda | Səhv nümunə | Düzgün |
|---|---|---|---|
| L1 | Mesajlaşma ekranı (`chat`) olan tapşırığın mətni yazışma olduğunu deyir | “Tanışınla qarşılaşdın… salam yaz” + çat pəncərəsi | “Yeni tanışınla ilk dəfə mesajlaşırsan” |
| L2 | Üz-üzə vəziyyət (görüşmək, göstərmək, vermək, zəng) → danışmaq; mesaj/çat → yazmaq | “{F} yanındakı adamı göstərib soruşur” (çatda) | “{F} çatda şəklindəki adamı görüb soruşur” |
| L3 | Mesajlaşma ekranında görüş şəkli olmur | çat + `meet-street` şəkli | çat, şəkilsiz |
| L3b | “İki mesaj yaz” tapşırığı üz-üzə vəziyyətdə olmur | “Ziyafətdə tanış olursan. İki mesaj yaz” | “Ziyafətdə gördüyün adama sonra mesaj yazırsan” |
| L3c | Səslə deyilənə yazılı cavab yalnız səsli mesajdırsa | “Qonşunu dinlə. Cavab ver” (yazı) | “Qonşun səsli mesaj göndərdi. Mesajla cavab ver” |
| L4 | Yazılı mesajda nömrə rəqəmlə yazılır, sözlə yox (“oh” yalnız danışıqdadır) | çatda “Zero five zero… / Oh five five…” | “050 321 45 67? Is that right?” |
| L5 | Söhbətdə yazılmış sözün “hərf-hərf necə yazılır?” soruşulmur | çatda “Lankaran.” + “How do you spell it?” | qonaq 🎤 səsli mesaj göndərir |
| L6 | Eşidilən rəqəmi sözlə yazmağın səbəbi olmalıdır | “Liftdə oğlan mərtəbəni deyir. Sözlə yaz” | “Dostun soruşur ki, bu rəqəm ingiliscə necə yazılır” |
| L7 | Formaya / anketə cümlə yazılmır, məlumat yazılır | “Qız formada yaşını tam cümlə ilə yazır” | “Qız mesajda yaşını tam cümlə ilə yazır” |
| L8 | Növbədə, küçədə, liftdə yad adam şəxsi məlumat (yaş, nömrə, e-poçt, soyad) soruşmur | “Qeydiyyat növbəsində yanındakı adam yaşını soruşur” | kurs yoldaşı / qeydiyyatçı soruşur |
| L9 | Suala cavab “Excuse me” ilə başlamır | ofisiant soruşur → “Excuse me, six, please” | “Six, please.” |
| L10 | Otel/ofis/liftdəki adam “qonşu” deyil | “Otel liftində qonşu deyir” | “yanındakı adam” |
| L11 | “Hərf-hərf de” tapşırığının nümunə cavabı hərflərlə göstərilir | ✓ “It's [ad]” | ✓ “It's A-L-I.” |
| L12 | Telefon / e-poçt ümumi qrup çatında soruşulmur | “Kursun qrup çatına yeni üzv qoşuldu… nömrəsini soruş” | şəxsi mesajda soruşulur |
| L13 | Yazdığın nömrəni yoxlayanda nömrənin özü də mesajda olur | ikinci mesaj: “Is that right?” | “050 321 45 67? Is that right?” |
| L14 | Qarşındakı adama yazmırsan (söhbət/mesaj deyilmirsə) | “Dil mübadiləsi masasındasan… sual qur” (yazı) | “Dil mübadiləsi qrupunda yeni tanışa mesaj yazırsan” |
| L15 | Şəkil vəziyyətin yerini göstərir | hostel söhbəti + video zəng şəkli | hostel şəkli / şəkilsiz |
| L16 | Eşitdiyini / eşitdiyin sözü yazmağın səbəbi var (orada işləyirsən, forma, kimsə soruşur) | “Qonaq millətini deyir. Millətini yaz.” | “Sən resepsiyada işləyirsən… vərəqə yazırsan” |
| L17 | İşçi (bələdçi, resepsiyaçı) səndən yanındakı yad adamlar haqqında soruşmur | “Bələdçi soruşur: Where's he from?” | yol yoldaşın tanışların haqqında soruşur |
| L18 | Xarici dost sənin “ailə çatı”nda olmur; ailən səndən qohumunun kim olduğunu soruşmur | “Ailə çatında {f} şəklə baxıb yazır: Who's she?” | “{F} çatda sənin şəklinə baxıb yazır” |
| L19 | Şəkli göstərən adam “bu kimdir / nə işləyir?” soruşmur | “İş yoldaşın qadının şəklini göstərir… What's her job?” | “Sən iş yoldaşına şəkli göstərirsən. O soruşur” |
| L20 | Söhbətdəki suala uyğun cavab | çatda “Who's this?” → ✓ “My grandmother is in Ganja.” | çatda “My grandmother is in London. And your grandmother?” |
| L21 | Yazının ünvanı var (mesaj, çat, şəklin altı, forma, siyahı) | “Şəkildə kişi həkimdir. Sözlərdən cümlə qur.” | “Albomdakı şəklin altına yazı yazırsan…” |

## Keyfiyyət yoxlamaları (check-quality.cjs)

```
node scripts/check-quality.cjs
```

Skript sonda nəyi neçə dəfə yoxladığını da yazır (“0 problem” “0 yoxlanıb” demək olmasın). Hər qayda süni səhvlə sınanıb.

| # | Qayda | Necə yoxlanır |
|---|---|---|
| Q1 | Düz cavabın başqa normal yazılışı da düz sayılır | Hər yazı/danışıq tapşırığının (və “iki mesaj” sahələrinin) hər nümunə cavabı kiçik hərflə, nöqtəsiz, durğu işarəsiz, I'm ↔ I am, What's ↔ What is, It's ↔ It is, ’ apostrofla yoxlayıcıya verilir; “səhv” çıxsa — xəta. Nümunə cavabın özü düz sayılmırsa — xəta. (E-poçtda nöqtə qalır; öz məlumatı olan cavablar öz qəlibi ilə yoxlanır.) |
| Q2 | Seçim tapşırığında “səhv” variant eyni dərəcədə düz deyil | Düz variant və səhv variant eyni məna qrupundadırsa (Hi/Hello/Hey, Bye/Goodbye, Thanks/Thank you, Fine/Good/Great/OK, Sorry/I'm sorry) — xəta. |
| Q3 | İpucu cavabı açıb deməz | İpucunda düz cavab (2+ söz və ya 6+ hərf) tam görünürsə — xəta. |
| Q4 | Səsdə deyilən ilə düz variant uyğundur, səhv variant uyğun deyil | Səsdəki rəqəm/hərf sözləri (sixty-five → 65, double L → LL, oh → 0) kodlaşdırılır; düz variantın rəqəm/hərf kodu səsdə yoxdursa və ya səhv variantın kodu səsə tam uyğundursa — xəta. “Dinlə və yığ” tapşırıqlarında səsdəki rəqəmlər cavabla eyni olmalıdır. |
| Q5 | Hər dərs şəkli `docs/SEKIL_SIYAHISI.md`-də var | Dərsdə işlənən şəkil siyahıda yoxdursa, və ya siyahıdakı şəkil heç yerdə işlənmir və “lazım deyil” yazılmayıbsa — xəta. |
| Q6 | Ekranlar ortaq hissələrdən istifadə edir (G6/G7) | Kodda dinamik ikonu, SoundButton/SoundIcon-dan kənar ▶, nəticə panelindən kənar yaşıl düymə, KindChip əvəzinə əl ilə yazılmış dərs adı — xəta. |

## Skriptlə yoxlanmayanlar (insan / cihaz)

| # | Nə | Necə |
|---|---|---|
| H1 | Uyğunlaşdırma cütlərinin tərcüməsi düzdür | `dump-tasks.cjs` + uyğunlaşdırma sətirləri oxunur |
| H2 | İngiliscənin təbiiliyi (G2) | Claude oxuyur; doğma danışan yoxlaması əvəz olunmur |
| H3 | Ekran telefonda sürüşmür, hər şey sığır | yalnız iPhone/Android-də baxılır — kodla yoxlanmış hesab edilmir |

## İnsan yoxlaması (skript tutmur — hər bölmədə oxunur)

`node scripts/dump-tasks.cjs _b3_ > /tmp/b3.txt` — bölmənin hər tapşırığı bir sətirdə (vəziyyət, səs, çat, boşluq, cavablar, şəkil, ipucu). Hər sətirdə bu suallar:

1. **Kim kimə, harada, hansı dildə?** İngiliscə danışan adamın ingiliscə danışmağının səbəbi var (xarici dost, turist, beynəlxalq ofis). Nümunə: “Hava limanında dostun soruşur…” → “xarici dostun”.
2. **Bu adam bu vaxt bu sualı verərmi?** (ziyafətdə ilk sözdən soyad soruşmaq — rəsmidir, amma mümkündür; yad adamdan yaş soruşmaq — yox).
3. **Cavab real həyatda belə deyilər/yazılarmı?** Qısa, təbii cavab da düz sayılır (“Last name, please?” → “It's Mammadov.”; “Nice to meet you!” → “You too! Bye!”).
4. **Təlimat düz cavablardan birini kənarda qoyurmu?** (“qısa salam yaz” → Hello də düzdür).
5. **Söhbət pəncərəsi boşdursa**, mətn “o sənə yazdı” deyirsə — söhbətdə onun mesajı (və ya 👋 🔑 📄 🎤 kimi işarə) görünür.
6. **Şəkil mətndəki vəziyyəti göstərir** (mətn dəyişəndə şəkil də yoxlanır; lazım olmayan şəkil `docs/SEKIL_SIYAHISI.md`-də “lazım deyil” olur).
7. **Uyğunlaşdırma / sıralama cümlələri** (`rows`) də eyni qaydalarla oxunur.

## Hansı bölmə yoxlanıb

| Bölmə | Tarix | Nəticə |
|---|---|---|
| 1 | 24 Nov 2026 | 179 tapşırıq oxundu, 11 düzəliş edildi |
| 2 | 25 Nov 2026 | 223 tapşırıq + 32 uyğunlaşdırma oxundu, 12 düzəliş edildi (13-cü — “Last name, please?” qısa cavabı — artıq düz sayılırdı, nümunəyə əlavə edildi); 15 şəkil siyahıya yazıldı |
| 3 | 25 Nov 2026 | 199 tapşırıq + 38 uyğunlaşdırma oxundu, 8 qrup düzəliş (+1 şəkil u3d6_c09 təkrarında); yeni qaydalar L14–L17 |
| 4 | 25 Nov 2026 | 177 tapşırıq + 31 uyğunlaşdırma oxundu, 6 qrup düzəliş (+ Dərs 1 d1_c07b); yeni qaydalar L18–L21 |
