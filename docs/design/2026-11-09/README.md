# Ana səhifə və dərs təcrübəsi — razılaşdırılmış qaydalar

Tarix: 9 noyabr 2026. Bu sənəd söhbətdə seçilmiş qaydaların vahid mənbəyidir. Köhnə dəftərdəki ziddiyyətli görünüş və göndərmə qeydlərinə münasibətdə bu tarixli seçimlər əsasdır. Müəllif məzmunu və qiymətləndirmə sübutlarının bütövlüyü dəyişmir.

## 1. Statusu düzgün göstərmək

| Hissə | Bu yükləmədə status |
|---|---|
| Qaydalar, adlar, qəbul şərtləri | Sənədləşdirilib |
| Mövcud vizual nümunələr | Dizayn arxivinə yüklənir; işlək ekran deyil |
| Yeni ana ekranın peşəkarlaşdırılması | Tələblər təsdiqlənib; bu commitdə tətbiq edilmir |
| Yeni dərs görünüşləri və avtomatik səs göndərmə | Tələblər qeydə alınıb; bu commitdə tətbiq edilmir |
| Əvvəlki v2 kodu və 10 şəkil | Əvvəlki branchdə var; yeni maketlərlə tam uyğunluğu təsdiqlənməyib |
| Real telefon, mikrofon, ASR, native ölçülər | Bu yükləmədə yoxlanmayıb |

Əvvəlki rəng yenilənməsi istifadəçinin göndərdiyi ekran quruluşunun tam tətbiqi deyildi. Onu razılaşdırılmış yekun dizayn və ya cihazda yoxlanmış ekran kimi təqdim etmək olmaz. Bu commit tətbiq məntiqini, SDK/paketləri, profili və işlək ana ekran branchini dəyişmir. Vizual şəkli bütöv ekran fonu kimi tətbiqə yerləşdirmək olmaz: mətn, düymə, input və audio idarəsi işlək native elementlər olmalıdır.

## 2. Ana səhifə: 7 qrup, 12 ayrıca dərs

| Xəritədə qrup adı | Paneldə dərslər |
|---|---|
| İlk salam | 1. Salamlaşma və sağollaşma |
| Mənim adım… | 2. Öz adını demək |
| Adın nədir? | 3. Ad soruşmaq; 4. Tanışlıqdan məmnunluq |
| Necəsən? | 5. Hal soruşmaq və cavab vermək; 6. Fərqli halları bildirmək |
| Xoş sözlər | 7. Təşəkkür və qarşılıq; 8. Nəzakətli xahiş; 9. Üzr və qarşılıq |
| Bir də, lütfən | 10. Anlamama və təkrar xahişi; 11. Yavaş danışıq istəmək |
| Gəl danışaq! | 12. Yekun səsli söhbət |

- Rənglər açıq lavanda–narıncıdır. Ana səhifənin təsdiqlənmiş maskotu və xəritənin ölçü/əsas kompozisiyası saxlanır. Profil istisnadır.
- Bölmə başlığı: “İlk tanışlıq”. Altında real say və faiz: məsələn, **2/12 dərs tamamlanıb · 17%**. Faiz `round(uniqueCompletedMainLessonIds / 12 * 100)` ilə hesablanır; 0/12=0%, 12/12=100%. Aidiyyətsiz və təkrar ID-lər sayılmır.
- Hər qrupda “1/2 dərs” kimi real say var; ayrıca hər karta faiz əlavə etməklə görünüş yüklənmir.
- Cari qrup narıncı vurğu və “Davam et” ilə seçilir. Tamamlanmış qrupda kiçik təsdiq işarəsi, digər qruplarda sakit bənövşəyi təqdimat var. Kilid real mövcud açılma qaydasından gəlir.
- Xəritənin yolu ardıcıl tamamlanmış hissəyə qədər yumşaq dolur; yarımçıq hissənin üstündən dolu yol çəkilmir. Bölmə fonu real ümumi faizə uyğun çox yüngül tündləşir; yazının kontrastı itmir.
- Qrupa toxunanda aşağı panel açılır. Dərslər ayrı açılır və tamamlanır; “Başla / Davam et / Yenidən məşq et” vəziyyətləri real yaddaşa əsaslanır. Qaldığı dərsin qrupu seçilir, növbəti dərs özbaşına başlamır.
- İmtahan, Özünü yoxla və hekayə 12 əsas dərsin faizinə daxil deyil. Tamamlanma faizi düzgün cavab faizi və ya təsdiqlənmiş bacarıq göstəricisi deyil.

## 3. Vizual dil və ölçülər

- Səliqəli açıq bənövşəyi–narıncı UI, tünd gavalı rəngli oxunaqlı mətn, incə çərçivə, seçilmiş yerlərdə zəif şüşə effekti və yumşaq kölgə. Artıq parıltı və çərçivə yığını yoxdur.
- Başlıq yığcamdır. Başlanğıc ölçü istiqaməti: əsas başlıq təxminən 24 pt, mətn 14–16 pt, köməkçi yazı 12–14 pt, düymə mətni 16 pt. Bunlar yoxlanmalı dizayn başlanğıcıdır; sistem şrift böyütməsini ləğv etmək və bütün ekranı kiçiltmək icazəsi deyil.
- Vahid şrift ailəsi, iki əsas qalınlıq və eyni xətt üslubunda ikonlar. Mətn və idarələr native/vektor qalır, bulanıq ekran rasteri böyüdülmür.
- Səhnə məzmunu sıxışdırmır; geniş boşluqlar və boş “şəkil yeri” saxlanmır. Sahə çatmadıqda əvvəl dekorasiya və boşluq azalır. Cavab sahəsi və əsas idarə kəsilmir.
- **Personajlar başdan ayağa tam görünür.** Ayaq, baş, əl və digər hissələri kəsmək olmaz. Bu tələb səhnə kiçildiləndə də qüvvədədir; `contain` tipli uyğunlaşdırma və real sərhəd yoxlaması tələb olunur.
- Personajlar, lövhə və səhnənin daxili hissəsi aydın qalır. Yalnız xarici perimetrdə dar, yüngül şəffaflıq keçidi fonla birləşir. Sərt düzbucaqlı şəkil kənarı, ağ halo və bütün təsvirə güclü blur yoxdur. Kənar maska personajın ayağını silməməlidir.
- Rəng/maskot/lövhə və insan personajları ayrı rollardır: narıncı kapüşonlu maskot müəllimdir; insan oyuncaqları danışıq personajlarıdır.

## 4. Səhnə və lövhə seçimi

| Kart növü | Vizual qaydası |
|---|---|
| Öyrətmə | Məzmun tələb edirsə kiçik səhnə; uyğun səhnə lazım deyilsə lavanda lövhə və narıncı kapüşonlu maskot |
| Hazırlanmış danışıq | Məqsədə uyğun kiçik insan səhnəsi mümkündür; hər kartda məcburi deyil |
| Yazı, boşluq, iki sahəli tapşırıq, səhv təkrarı | Dekorativ şəkil yoxdur; mətn və cavab idarələri əsasdır |
| Dinlə və seç / Dinlə və yaz | Səs idarəsi və neytral dalğa; cavabı göstərən illüstrasiya, avtomatik transcript və tərcümə yoxdur |

Köhnə dərs səhnələri avtomatik təkrar istifadə edilmir; lövhə ideyası saxlanır, tülkü müəllim təsdiqlənən kapüşonlu maskotla əvəzlənir. Yeni lövhə açıq lavanda səth və bənövşəyi çərçivəlidir. İngilis mətn, tərcümə və toxunulan sözlər şəkilə bişirilmir, ayrıca qatdır. Nağıl/akvarel sınağı rədd edilib. Həddindən artıq mexaniki robot variantı da əsas seçilməyib. Son yumşaq həndəsi 3D oyuncaq sınağında qızın saçı ağa yaxın açıq boz, oğlan çantasızdır; bunun bütün köhnə asset-lərə tətbiq edildiyi iddia olunmur.

## 5. Kart sırası və səkkiz təqdimat növü

Öyrətmə, dinləyib seçmə, yazı, boşluq doldurma, dinləyib yazma, iki sahəli tapşırıq, danışıq və şərti səhv təkrarı üçün uyğun idarələr hazırlanır. Bunlar müəllif kartlarını yenidən sıralamaq və mövcud olmayan sual əlavə etmək səbəbi deyil. Danışıq tapşırıqları dərsin sonunda bir yerə yığılmır. “Sözlər / Qrammatika / Dinləmə / Danışıq” təqdimat növləridir.

- Boş cavab/seçim olduqda Yoxla deaktivdir. Qiymətləndirmədən əvvəl seçim rəngi və animasiya doğru cavabı göstərmir.
- İki sahə ayrıca qiymətləndirilir; müəllifin təkrarında düzgün sahə saxlanıb kilidlənir, səhv sahə yeni situasiyada cavablandırılır.
- Səhv təkrarı yalnız təsdiqlənmiş dil səhvlərində və müəllifin bir dəfəlik yeni situasiyası ilədir. Texniki hal təkrar bankına dil səhvi kimi daxil edilmir. İlkin cavab düzəlişlə əvəz olunmur.
- Üçüncü kollajdakı nəticə/kolleksiya görünüşü rədd edilib. **Nəticə ekranı ləğv olunmayıb: yalnız dərsin sonunda ayrıca olacaq**, onun yekun dizaynı ayrıca hazırlanmalıdır.

## 6. Sadə danışıq idarəsi və avtomatik göndərmə

- Əsas mikrofon və “Danışmaq üçün toxun” yazısı qalır. Bu yazının altında təlimat, Dinlə/Yenidən yaz/Göndər sətri və əlavə alt düymələr olmur.
- Toxunuş qeyd açır; danışıq bitəndə bir real cavab avtomatik təqdim edilir. Bu yeni seçim v2 üçün əvvəlki məcburi manual Göndər görünüşünü əvəz edən **tələbdir**, hələ həmin davranışın kodda qurulduğunun sübutu deyil.
- Avtomatik göndərmə kartı avtomatik keçmir. Yoxlamadan sonra uyğun geribildirim və ayrıca davam addımı qalır.
- Native sistem yalnız yekun, kifayət qədər etibarlı tanınmış mətni qiymətləndirməyə ötürür. Qismən tanıma, səssizlik, icazə/xidmət xətası, ləğv, arxa plana keçid və təkrar callback saxta cavab və ya dil səhvi yaratmır.
- Yalnız səs yazısı varsa, onu ötürmək danışıq bacarığının yoxlanması deyil. Səs etibarlı yoxlanmayıbsa “Yoxlanmadı” qalır; yazılı məşq danışıq sübutu olmur.
- Cari UI-dən əl ilə göndərmə sətri çıxarılsa da qeyd dayandırma/ləğv, texniki təkrar, keçmə və çıxış yolları əlçatan qalmalıdır. Bunların yerləşməsi yazının altında əlavə panel yaratmadan ayrıca layihələndirilib cihazda yoxlanmalıdır.
- Paketdəki danışıq müəllifin əvvəlcədən hazırlanmış qarşılıqlı ssenarisidir; sərbəst AI söhbəti deyil. Görünən müəllif nümunəsi varsa model dəstəyi daxildə qeydə alınır.

## 7. Kömək və nəticə mətnləri

- İstifadəçi **“Köməklə” yazısının vizuallarda görünməməsini** seçdi. Bu, daxili assisted/help izini, mətn dəstəyini, ilk cəhdi və ya qiymətləndirmə siyasətini silmək deyil.
- Doğru, səhv/qismən və Yoxlanmadı hallarının mətnlə fərqi qalır. Dəstəklənmiş cavab sonradan müstəqil uğur kimi təqdim edilmir. Yekun hesabatın dəqiq etiketi seçilməyibsə belə alternativ UI mətni uydurulub razılaşdırılmış sayılmır.
- İstifadəçi cavab vermədən “Düzdür” görünmür. “Lüğətimə əlavə edildi” yalnız yaddaşa uğurlu yazıdan sonra görünür. Səs hələ yazılmayıbsa “Cavabını dinlə” olmur.
- Transcript gizlədilsə və audio yenidən oynadılsa da əvvəl açılmış kömək izi silinmir. Texniki problem səhv cavab kimi göstərilmir. İmtahan üçün özbaşına keçid faizi qoyulmur.

## 8. Söz, ifadə və gələcək şəkilli öyrətmə

- Yeni söz/ifadə mövcud dizaynın vurğu rəngi ilə seçilir; bütöv cümlə, proper name, tərcümə və qiymətləndirmə variantları rənglə cavab ipucu almır.
- Toxunanda müəllifin bu kontekstdə verdiyi Azərbaycan mənası, sadə nümunəsi və yalnız ingiliscə audio açılır. Bütöv ifadə ayrı söz tərcümələrinə parçalanmır.
- İlk öyrətmədə Lüğətimə avtomatik, sabit kimliklə təkrarsız əlavə edilir. Əvvəl öyrədilmiş sözə yenə toxunmaq olur; hər dəfə yeni rəngi almır.
- Şəkilli konkret söz kartında uyğun şəkil, ingilis söz, müəllif mənası, ingilis audio, qısa nümunə və tərcümə olur. Nümunə əvvəl öyrədilməmiş əlavə söz/quruluş tələb etmir.
- Sonrakı xatırlamada hədəf söz/tərcümə gizlidir, yalnız əvvəl öyrədilən məqsəd soruşulur; qiymətləndirmə şəkli cavabı daşımır. Cavabı açan məna köməyi cəhdə təsir edir.
- Cari tanışlıq paketinə əlaqəsiz meyvə və əşya sözləri əlavə edilmir. Gələcək mövzu üçün müəllif məzmunu/brif yoxdursa belə kart hazır kimi təqdim edilmir; tərcümə və nümunə özbaşına uydurulmur.

## 9. Təsdiqlənən dərsdaxili təcrübələr

1. Canlı lövhə: hazır ifadənin hissə-hissə açılması, audioya uyğun söz vurğusu, toxunanda məna. Audio izləmə mövcud deyilsə saxta sinxronizasiya vəd edilmir.
2. Qarşılıqlı səhnə: personaj/istifadəçi növbəsi aydındır; yoxlanmış cavabdan sonra yalnız müəllifin icazə verdiyi qarşılıq audio və mimika ilə göstərilir.
3. Söz kartları cümlə qurma zamanı yerinə yumşaq oturur və çıxarılanda qayıdır; hərəkət cavabı həll etmir.
4. Mənalı reaksiyalar: doğru cavabda qısa sevinc, səhvdə sakit izah, dəstəkdə yardımçı mimika, texniki qeyri-müəyyənlikdə səhv effekti yoxdur.
5. Hər tapşırıq öz məqsədinə uyğun görünür; hamısı eyni mətn qutusu deyil.
6. Konkret nəticə real cavab sübutuna əsaslanır: nəyi özün etdin, nə dəstək aldı, nə yoxlanmadı. Dil səviyyəsi sertifikatı və ya yoxlanmamış tələffüz balı deyil.
7. Uyğun səhnədə personaja toxunmaq müəllifin hazır salamını səsləndirə bilər; audio zamanı danışan personaj önə çıxır. Hədəfi açan dəstək gizlədilmir.
8. Söhbətin vizual yaddaşı: tamamlanan növbələr balonlarda qalır; gələcək hədəf əvvəlcədən açılmır. **Balonların yanında kiçik profil şəkilləri yoxdur.** Keçmiş balon cari cavabı açırsa dəstək izi saxlanılır.
9. Dərs sonu “öyrəndiklərim” kolleksiyası: faktiki öyrədilən ifadə, uyğun şəkil, məna və ingilis audio. Əlavə XP/tamamlanma/duplikat lüğət yaratmır. Kolleksiya ideyası təsdiqlənib, əvvəlki üçüncü ekranın quruluşu isə rədd edilib.

Mimika nümunəsi üçün düşünən, təəccüblənən və anlamayan ifadələr eyni personaj görünüşü ilə yan-yana hazırlanacaq. Bu nümunə hələ hazır deyil. Qulaqlıq, yeni geyim, saç formasının ayrıca dəyişdirilməsi və sadəcə dekorasiya üçün yeni məktəb/park səhnəsi seçilməyib. Son iki əlavə təklif (izahın iki səhnəsi və “Burada qalmışdın” önizləməsi) ayrıca təsdiqlənməyib.

## 10. Hərəkət, səs və əlçatanlıq

Animasiya qısa, sakit və bir dəfəlikdir; daimi döngə, ekran silkələnməsi və diqqət yayındıran effekt yoxdur. Reduced motion-də statik/dərhal vəziyyət var. Animasiya qiyməti, XP-ni və ya naviqasiyanı özü dəyişmir. Şəkil kənarı yumşaldılması mətnə və idarələrə blur tətbiq etmir. Alt təsvir hədəf ingilis cavabını açmır. Ölçülər kiçik ekran, böyük sistem şrifti, safe area və klaviatura ilə yoxlanır. Dekorativ dalğa faktiki mikrofon ölçüsü kimi göstərilmir.

## 11. Qəbul və davam planı

- Əvvəl mövcud types, real müəllif kartı və işləyən nümunə yoxlanır; renderer karta uyğun bağlanır. Paket dəyişdirilmir.
- Dərs 1-də giriş, öyrətmə, bütün real tapşırıqlar, aralı danışıq, şərti təkrar və konkret nəticə tam yoxlanır; sonra ortaq görünüş digər dərslərə ötürülür.
- 320/390/430 en, böyük şrift, klaviatura, gecikən/xətalı audio, ləğv, səssizlik, offline/unknown ASR, dəstək, təkrar saxlanma və tətbiqə qayıdış ayrıca yoxlanır.
- Kod dəyişikliklərində TypeScript/lint və uyğun funksional testlər işlədilir. MD/şəkil arxivi yükləməsi bu testlərin yenidən keçdiyi iddiası deyil.
- Fiziki iPhone/Android, mikrofon, real tanıma və animasiya görünüşü yoxlanmadan “tam işləyir”, “səhvsizdir” və ya “telefonda yoxlanıb” deyilməz.
- Dizayn arxivi təsdiqlənmiş istehsal asset-i deyil. Kəsilmiş ayaq, hələ iri şrift və boşluq, səhnə sərhədi və passiv/aktiv düymə kimi generasiya qüsurları native tətbiqə köçürülməməlidir.

## Vizual arxiv

[Önizləmə indeksi və hər nümunənin statusu](PREVIEWS.md). Mətnləri və elementləri bu şəkillərdən raster kimi çıxarıb ekran kimi istifadə etmək olmaz. Əvvəlki on şəkilin branchdə olması son 3D sınaq görünüşünün artıq yerləşdirilməsi demək deyil.
