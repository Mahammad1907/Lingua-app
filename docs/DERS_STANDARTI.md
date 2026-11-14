# BirTalk dərs standartı

Versiya 2 · 13 noyabr 2026 (araşdırma əsasında yeniləndi)

Bu sənəd hər yeni dərsin necə yazılacağını müəyyən edir. Məzmun hazırlanan söhbətdə yeni dərs yazanda bu sənədi əsas götür. Burada olmayan qərarlar `docs/LAYIHE_DEFTERI.md`-də qeyd olunur.

---

## 1. Dərsin ölçüsü

- **Uzunluq:** 10–12 kart, 5–7 dəqiqə. 14 kartdan çox olmamalıdır. Mövzu böyükdürsə, iki dərsə böl.
- **Yeni material:** bir dərsdə ən çox 2–3 yeni ifadə (və ya bir quruluş + 2 ifadə).
- **Öyrətmə kartları:** dalbadal ən çox 2 öyrətmə kartı. Üçüncüdən əvvəl ən azı bir tapşırıq olmalıdır.

## 2. Kartların ardıcıllığı

| Hissə | Kartlar | Məqsəd |
|---|---|---|
| 1. Giriş | 1 | Dərsin adı, 2–3 sadə məqsəd, maskot |
| 2. Səhnə | 1 | Qısa real söhbəti dinləmək (2–4 replika). Hələ cavab tələb olunmur |
| 3. Əvvəlki dərsdən təkrar | 1–2 | Əvvəlki bacarığı yeni vəziyyətdə işlətmək (Dərs 1-də yoxdur) |
| 4. Öyrət → tanı | 3–4 | Öyrətmə, sonra dinləyib və ya oxuyub tanımaq |
| 5. Özün qur | 2–3 | Yazmaq, cümlə qurmaq, səhvi düzəltmək |
| 6. Danış | 1–2 | Səslə cavab vermək, sonra söhbəti özün başlatmaq |
| 7. Səhnəyə qayıt | 1 | 2-ci hissədəki söhbətdə indi öyrənən özü danışır |
| 8. Təkrar | 0–3 | Yalnız səhv olan tapşırıqlar, eyni ekran növü, yeni vəziyyət |
| 9. Nəticə | 1 | Bacarıqlar üzrə: Müstəqil / Köməklə / Yenidən məşq lazımdır / Yoxlanmadı |

## 3. Dəstəyin azaldılması

Hər yeni ifadə dərs boyu bu yolu keçir:

1. **Nümunə ilə:** ifadə ekranda görünür (köməklə sayılır).
2. **İpucu ilə:** ifadə görünmür, ipucu istəyə bağlıdır.
3. **Sərbəst:** nə nümunə, nə ipucu var. Müstəqil nəticə yalnız buradan gəlir.

Nümunə görünən tapşırıq heç vaxt "Müstəqil" sayılmır.

## 4. Tapşırıq qaydaları

- **Seçim tapşırıqları:** 3 variant. Yanlış variantlar öyrənənin real olaraq qarışdırdığı şeylər olmalıdır (my/your, Hello/Goodbye, am/is). Mənasız variant olmasın.
- **Səsli tapşırıqlar:** mümkün olduqca tək söz yox, qısa cümlə istə ("Hi, Leyla!", "Nice to meet you"). Səs tanıma qısa sözləri pis tanıyır.
- **Dinlə və yaz:** yalnız eşidilən sözü qəbul et. Bunu tapşırıqda aydın yaz ("eşitdiyin sözü yaz").
- **Sərbəst yazı:** məqsədə uyğun bütün düzgün cavablar qəbul olunur (məsələn, Hello! və Hi!).
- **Öz adın:** öz adını yazmaq tələb olunanda istənilən ad qəbul olunur.
- **Hər dərsdə hər bacarıq ən azı bir dəfə:** dinləmə, oxu, yazı, danışıq.
- **Hər yeni ifadə ən azı bir dəfə sərbəst istehsal olunmalıdır** (yazı və ya danışıq), yalnız seçimlə qalmamalıdır.

## 5. Mətn qaydaları

- **Başlıqlar öyrənən üçündür:** "Salamı özün yaz", "Dinlə və anla". "öyrətmə", "əsas tapşırıq — …" kimi müəllif etiketləri ekrana çıxmasın.
- **Müəllif qeydləri ekrana çıxmasın:** "Bu hökm yalnız … göstərilir" kimi cümlələr yalnız müəllif üçündür.
- **Dil sadə olsun:** cümlə 15 sözdən qısa olsun, termin işlənməsin.
- **Adlar tokenlə yazılsın:** maskot `{M}`, qız `{G}`, oğlan `{B}` (hal şəkilçisi ilə: `{M:gen}`, `{M:dat}` və s.). Adlar yalnız `src/config/characters.ts`-də dəyişir.
- **Yalnız iki insan personaj:** gümüşü saçlı qız və narıncı geyimli oğlan. Yeni adlı personaj əlavə olunmur.

## 6. Rəy və izahlar

Hər qiymətləndirilən tapşırıq üçün yazılır:

- **Düzgün cavab:** bir qısa səbəb ("Hello salam vermək üçün uyğundur.").
- **Səhv cavab:** bir qısa səbəb + beş hissəli "Mənə başa sal":
  1. Sənin cavabın (avtomatik)
  2. Uyğun cavablar
  3. Səbəb — niyə bu vəziyyətdə uyğun deyil
  4. Qısa qayda — bir cümlə
  5. Yeni nümunə — başqa vəziyyətdə
- **Ən çox yayılan 1–3 səhvə ayrıca izah** yazılır. "Bu tapşırıqda uyğun cavab: X" kimi boş izah qəbul olunmur.
- **Texniki problem** (səs açılmadı, səs tanınmadı) dil səhvi sayılmır və qırmızı göstərilmir.

## 7. Səs

- **Real səs yazısı:** dinləmə tapşırıqları üçün mümkün olduqca real insan səsi (kişi və qadın) istifadə olunsun. Sintetik səs yalnız müvəqqəti həlldir.
- **Sürət:** normal və "Yavaş dinlə".
- **Hər səs faylının mətni** tapşırıqda saxlanılır ("Mətnlə davam et" üçün).

## 8. Təkrar

- **Dərs daxilində:** yalnız səhv tapşırıqlar, dərsin sonunda, eyni bacarıq və cavab üsulu ilə, yeni vəziyyətdə. Sonsuz təkrar olmur.
- **Növbəti dərslərdə:** əvvəlki bacarıqlar yeni materialla birlikdə, dərsin ortasında, nümunəsiz işlədilir.
- **Gündəlik təkrar (planlaşdırılır):** dərsdən kənar 2 dəqiqəlik qısa təkrar, 3–5 sual.

## 9. CEFR uyğunluğu

### Nə demək olar, nə demək olmaz

CEFR dərs proqramı deyil, səviyyə təsvirləridir ("can-do" cümlələri). Rəsmi "CEFR-ə uyğun" sertifikatı yoxdur. Dürüst ifadə belədir: **"Dərslər CEFR A1 təsvirlərinə əsaslanır."** Öyrənənin A1 səviyyəsinə çatdığını iddia etmək üçün ayrıca, standarta bağlanmış test lazımdır. Bir dərsdəki "Müstəqil" nəticəsi səviyyə sübutu deyil.

### Bölmə 1 → A1 təsvirləri

| Dərs | Uyğun CEFR A1 təsviri (sadələşdirilmiş) |
|---|---|
| 1. Salamlaşma və sağollaşma | Sosial əlaqə: salamlaşma və sağollaşmanın ən sadə formaları |
| 2. Öz adını demək | Özünü sadə şəkildə təqdim etmək |
| 3. Ad soruşmaq, tanışlıq | Sadə suallar vermək və cavab vermək; tanışlıq ifadələri |
| 4. Hal-əhval | İnsanların necə olduğunu soruşmaq və cavab vermək |
| 5. Nəzakət ifadələri | please, thank you, sorry kimi nəzakət formaları |
| 6. Təkrar və yavaş danışıq istəmək | Başa düşmədiyini demək, təkrar və yavaş danışmağı xahiş etmək |
| 7. Səsli söhbət | Qarşı tərəf yavaş danışıb kömək etdikdə sadə ünsiyyət |

**Nəticə:** Bölmə 1-in mövzuları A1-in "sosial əlaqə" hissəsinə tam uyğundur.

**A1-in Bölmə 1-də olmayan hissələri** (növbəti bölmələr üçün): rəqəmlər, yaş, yaşadığı yer, ailə, sadə şəxsi məlumat sualları, sadə formaları doldurmaq, qısa sadə mətnləri oxumaq.

### Hər dərsdə CEFR üçün

- Giriş kartındakı məqsədlər "edə bilirəm" cümləsi kimi yazılsın ("Salam verə və sağollaşa bilirəm").
- Hər məqsəd ən azı bir sərbəst tapşırıqla yoxlansın.
- Nəticə ekranı bacarıqları məqsədlər üzrə göstərsin.

## 10. Elmi əsaslar (araşdırma, 13 noyabr 2026)

Qaydaların arxasındakı tədqiqatlar. "Güc" sütunu sübutun nə qədər möhkəm olduğunu göstərir.

| Qayda | Əsas | Güc |
|---|---|---|
| Yenidən oxutmaq yox, **xatırlatmaq** (tapşırıq) | Karpicke & Roediger, *Science* 2008: təkrar test uzunmüddətli yaddaşı kəskin artırır, təkrar oxuma artırmır | Güclü |
| Təkrarı **vaxta yay**, bir yerə yığma | Spacing effekti; L2 sözlərində paylanmış təkrar yığılmış təkrardan təxminən 2 dəfə yaxşıdır (Nakata 2015) | Güclü |
| Aralığın **olması** onun formasından vacibdir | Genişlənən və bərabər aralıqların fərqi kiçikdir və ya yoxdur (Nakata 2015; Kang və b. 2014) | Orta |
| İlk öyrənmədə qruplaşdır, sonra **qarışdır** | Interleaving fayda verir, xüsusən bir neçə sessiya boyunca (Pan və b. 2019, 2024) | Orta |
| İlk cəhddə uğur təxminən **80–90%** olsun | "85% qaydası" (Wilson və b. 2019) — yalnız sadə iki seçimli tapşırıqlarda və maşın öyrənməsində sübut olunub; insan dərsi üçün istiqamət kimi götürülür | Zəif |
| İrəliləyiş **görünən** olsun | SDT: bacarıq hissi (competence) motivasiyanın əsas hərəkətvericisidir; tətbiqlərdə irəliləyiş göstəriciləri bunu dəstəkləyir | Orta |
| Vaxt və seriya **irəliləyiş deyil** | Duolingo istifadəçilərində sərf olunan vaxt real irəliləyişlə əlaqəli çıxmayıb (Oxford, 2023, kiçik nümunə) | Zəif–orta |
| A1 üçün **~90–100 saat** | Cambridge English təlimat saatları | Rəsmi təxmin |

## 11. Təkrar cədvəli (spiral)

Hər yeni ifadə bu yolu keçir:

1. **Öyrədildiyi dərsdə:** 2–3 xatırlatma, aralarında başqa kartlar olmaqla. Dalbadal eyni ifadə soruşulmur.
2. **Növbəti dərsdə:** bir dəfə, yeni materialın içində (məsələn, "Hi, I'm Leyla" — salam + yeni ifadə).
3. **2–3 dərs sonra:** bir dəfə, nümunəsiz, yeni vəziyyətdə.
4. **Bölmənin son dərsində:** böyük söhbətin içində.
5. **Gündəlik təkrar** (planlaşdırılır): dərsdən kənar 2–3 dəqiqə; zəif ifadələr daha tez qayıdır.

Qayda: bir ifadə bir dərsdə 4 dəfədən çox soruşulmur. Daha çox lazım olsa, təkrarı sonrakı dərslərə yay.

## 12. Çətinlik

- **Hədəf:** ilk cəhddə təxminən 80–90% düz cavab. Hamısı asandırsa — darıxdırır; yarısı səhvdirsə — ruhdan salır.
- **Hər dərsdə bir "gərgin an":** öyrənənin əvvəlki biliyi ilə yenini birləşdirdiyi, bir az çətin tapşırıq (adətən sərbəst yazı və ya danışıq).
- **Real istifadəçi məlumatı gələndə:** hansı tapşırıqda ilk cəhd uğuru 60%-dən aşağı və ya 98%-dən yuxarıdırsa, həmin tapşırıq yenidən baxılır.

## 13. İrəliləyişi görünən etmək

- **"Edə bilirəm" siyahısı:** hər bölmənin məqsədləri. Bir məqsəd yalnız nümunəsiz, müstəqil cavabla yaşıl olur.
- **"Əvvəl / indi":** dərsdə çətinlik olan bacarıq sonrakı dərsdə müstəqil alındıqda öyrənənə göstərilir ("Dərs 2-də çətin idi — indi özün etdin").
- **Bölmə sonu söhbəti:** bütün bölmənin ifadələri bir real söhbətdə. Nəticə bacarıqlar üzrə göstərilir.
- **İrəliləyiş sayılmayanlar:** keçən vaxt, seriya günləri, açılan kartların sayı, nümunə ilə verilən cavablar.
- **Tətbiqin hesablaya biləcəyi göstəricilər:** müstəqil alınan məqsədlərin sayı; ilk cəhd uğuru (bölmə üzrə); əvvəl çətin olub sonra müstəqil alınan bacarıqlar; gecikmiş təkrarda (2+ dərs sonra) uğur faizi.

## 14. CEFR — dəqiqləşdirmələr

- **Səviyyə:** Bölmə 1-in əksər hədəfləri A1-in sosial ünsiyyət hissəsidir, bəziləri Pre-A1 səviyyəsindədir (qısa, sadə suallar yavaş və təkrarla deyilsə başa düşmək).
- **Hazır ifadələr:** A1-də ifadələr bütöv blok kimi öyrədilir, qrammatika kimi yox. "My name is…" qrammatika dərsi deyil, hazır ifadədir.
- **"Could you…?" / "Can you repeat that…?":** xahiş üçün modal felləri adətən A2 qrammatikası sayılır. A1-də istehsal üçün qısa formalar ("Sorry?", "Again, please.", "Slowly, please.") öyrədilir; uzun forma yalnız tanıma (dinləyib anlama) üçün verilir.
- **Ümumi həcm:** A1 üçün təxminən 90–100 təlimat saatı. Bölmə 1 bunun kiçik bir hissəsidir — "A1 səviyyəsini bitirdin" demək olmaz.

## 15. Müxtəliflik — dərslər şablon kimi görünməsin

Pedaqoji qövs eyni qalır (öyrət → tanı → qur → danış), amma hər dərsin görünüşü fərqlənir:

- **Ardıcıl iki kart eyni ekran növündə olmur** (öyrətmə istisna deyil: dalbadal ən çox 2).
- **Hər dərsdə ən azı 5 fərqli tapşırıq növü** işlənir; ardıcıl iki dərs eyni növ ardıcıllığı ilə başlamır.
- **Açılış dəyişir:** bəzi dərslər səhnə ilə, bəziləri sual ilə ("Bu adam nə dedi?"), bəziləri maskotun kiçik problemi ilə başlayır.
- **Məkan dəyişir:** küçə, məktəb, iş yeri, kafe, telefon, mesajlaşma, video zəng — ardıcıl iki dərsdə eyni məkan əsas olmur.
- **Hər dərsdə bir sürpriz:** yumor, gözlənilməz hadisə və ya mini oyun (məsələn, vaxta qarşı uyğunlaşdırma).
- **Yoxlama:** yeni dərs yazılanda avtomatik yoxlama skripti bu qaydaları tətbiq edir (planlaşdırılır).

## 16. Yeni dərs yoxlama siyahısı

- [ ] 10–12 kart, ən çox 2–3 yeni ifadə
- [ ] Səhnə ilə başlayır, səhnəyə qayıtmaqla bitir
- [ ] Dörd bacarığın hər biri var
- [ ] Hər yeni ifadə sərbəst istehsal olunur
- [ ] Seçimlər 3 variantlı, yanlış variantlar mənalıdır
- [ ] Hər tapşırığın düzgün səbəbi və beş hissəli izahı var
- [ ] Başlıqlarda müəllif etiketi yoxdur
- [ ] Adlar tokenlədir, yalnız iki insan personaj var
- [ ] Hər səhv tapşırığın təkrar variantı var (yeni vəziyyət)
- [ ] Məqsədlər "edə bilirəm" formasında və CEFR A1 təsvirinə bağlıdır
- [ ] Əvvəlki dərslərdən 2–3 ifadə yeni vəziyyətdə qayıdır (spiral)
- [ ] Heç bir ifadə bir dərsdə 4 dəfədən çox soruşulmur
- [ ] İstehsal üçün A1-dən yuxarı qrammatika tələb olunmur
- [ ] Ardıcıl iki kart eyni ekran növündə deyil; ən azı 5 tapşırıq növü var
- [ ] Açılış və məkan əvvəlki dərsdən fərqlidir

## 17. Nümunənin azalması və Kömək (13 noyabr 2026)

- Dərs 1–2: yeni ifadənin ilk səsli kartında nümunə açıq görünür.
- Dərs 3–8: nümunə görünmür; “Kömək” 1-ci pillə ipucu (Müstəqil qalır), 2-ci pillə nümunə (Köməklə).
- Bölmə 2-dən: hazır cavab nümunəsi yoxdur; kömək ipucu və ya başqa vəziyyətdən oxşar nümunədir.
- İpucu: termin yox, cavab yox, konkret yol (vəziyyət sualı və ya “harada öyrəndin”), 1–2 cümlə. Öyrənən kart nömrəsini görmür — “Kart 3” yazılmır.
- Sözə toxunub mənaya baxmaq tapşırıqda “Köməklə” sayılır; cavab variantlarında məna göstərilmir.
- Hər Yeni söz / Dinlə və təkrarla kartında Azərbaycan hərfləri ilə oxunuş (th qalın saxlanır, w → u).
