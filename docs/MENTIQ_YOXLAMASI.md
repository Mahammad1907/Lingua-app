# Məntiq yoxlaması — hər tapşırıq real həyata uyğun olmalıdır

İstifadəçi qaydası (24–25 noyabr 2026): tapşırığın vəziyyəti, ekranı, şəkli, cavabı və təlimatı bir-birinə və real həyata uyğun olmalıdır. Bölmə 1 və 2 tam oxunanda tapılan **bütün səhv növləri** aşağıdakı L1–L13 qaydalarıdır. Hamısı bir əmrlə tapılır:

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
| 2 | 25 Nov 2026 | 223 tapşırıq + 32 uyğunlaşdırma oxundu, 13 düzəliş tapıldı (istifadəçinin təsdiqini gözləyir) |
| 3 | — | yoxlanmayıb |
| 4 | — | yoxlanmayıb |
