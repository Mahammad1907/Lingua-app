# Tətbiq vəziyyəti — 9 noyabr 2026

**Son səhnə əlavəsi:** [SCENES.md](SCENES.md). Aşağıdakı ilkin yükləmədə çatışmayan 10 mövzu səhnəsi dəsti və üç mimika artıq hazırlanıb; uyğun səhnələr əsas dərslərə bağlanıb. Canlı lövhənin söz vurğusu həqiqi `onBoundary` hadisəsinə bağlanıb. Cihaz yoxlaması ayrıca qalır.

Branch: `codex/v2-groups-12-lessons-20261105`. Baxış: PR #3. Bu hesabat işlək kod dəyişikliyini əvvəlki maket arxivindən ayırır. Fiziki cihaz yoxlaması aparılmayıb.

## Kodda yerləşdirilənlər

| Hissə | Vəziyyət |
|---|---|
| Ana xəritə | Eyni əsas kompozisiya, rənglər və mövcud maskot; 7 qrup / 12 ayrıca dərs. Qrupun sayları, cari qrupun narıncı vurğusu və “Davam et”, tamamlanmış qrupun işarəsi saxlanır. |
| Ümumi irəliləyiş | Qrupdakı unikal əsas dərslərin real tamamlanmasından hesablanır; 2/12 = 17%. İncə zolaq, ardıcıl tamamlanan qrupların yolu və fon tonu bu məlumatla işləyir. Təkrar ID və əlavə fəaliyyətlər faizi artırmır. |
| Qrup paneli | Ayrı dərslər, həqiqi kilid, Başla / Davam et / Yenidən məşq et; reduced motion nəzərə alınır. Növbəti dərs avtomatik başlamır. |
| Dərs 1 | Giriş, öyrətmə, dinləmə, yazı, iki sahəli cavab, aralı danışıq, bir dəfəlik müəllif təkrarı və nəticə komponent axınında yoxlanıb. |
| Ortaq dərs görünüşü | Açıq lavanda–narıncı, yığcam başlıqlar və yerli mətn/idarələr. Müəllif kartlarının sırası dəyişmir. 12 dərsin 157 aktiv mərhələsi JS renderer-də açılır; bu, hər dərsin telefonda tam keçildiyi demək deyil. |
| Lövhə | Bənövşəyi çərçivə, lavanda səth və tətbiqdəki mövcud narıncı kapüşonlu maskot. İngilis ifadə native, toxunulan və aydındır. Audio yalnız müəllifin ingilis lüğət ifadəsindən gəlir. |
| Danışıq | Danışıq bitdikdə etibarlı yekun ASR mətni bir dəfə avtomatik təqdim olunur. Kart yalnız ayrıca Davam et ilə keçir. Səssizlik, qismən mətn, etibarlılığı məlum olmayan nəticə, ləğv, arxa plan və texniki xəta avtomatik cavab yaratmır. |
| Sadə mikrofon | Hazır vəziyyətdə əsas mikrofon və “Danışmaq üçün toxun”; altında əl ilə göndərmə sırası və təlimat yoxdur. Cari danışıq kartını keçmək yuxarıdadır, dayandırma həmin mikrofondadır, çıxış və texniki təkrar qalır. |
| Yoxlanmayan səs | Tək səs yazısı tanınmış danışıq sayılmır. Real səs səviyyəsi olan yazı bir dəfə ötürülə bilər; etibarlı yoxlama olmadıqda Yoxlanmadı. Azure keçidi konfiqurasiya və ayrıca razılıq tələb edir. |
| Geribildirim | Doğru, qismən/səhv və Yoxlanmadı mətnlə ayrılır. Görünən “Köməklə” etiketi çıxarılıb; daxili assisted, nümunə, transcript, ilkin cavab və təkrar sübutları qalır. Dəstəkli cavab müstəqil kimi göstərilmir. |
| Danışıq yaddaşı | Cavab kilidləndikdən sonra müəllifin növbəsi və verilən cavab balonlarda görünür, avatar yoxdur. Əvvəlki tamamlanan danışıq növbələri ayrıca paneldədir; onu cavabdan əvvəl açmaq dəstək kimi qeydə alınır. Gələcək cavablar əlavə edilmir. |
| Söz və ifadə | Müəllif mənası, ingilis audio, yalnız uyğun əvvəlki/cari lüğətlə qurulmuş müəllif nümunəsi. İlk öyrətmə avtomatik və təkrarsız saxlanır; təsdiq yalnız yazı uğurlu olduqda görünür. Saxlama xətasının təkrarı var. Keçilmiş ifadə yenidən “yeni” rəng almır, mənası açılır. |
| Dərs sonu kolleksiyası | Yalnız faktiki öyrətmə kartları və artıq lüğətdə olan ifadələr, müəllif mənası və ingilis audio. Əlavə XP və ya təkrar lüğət yazısı yaratmır. |
| Söz çipləri | Qısa, neytral yerləşmə/geri qayıtma reaksiyası; cavabı həll etmir və reduced motion-də sakitdir. |

Ana ekrandakı əvvəl “AI söhbət” adlanan düymə sərbəst AI xidməti qoşulu olmadığı üçün “Danışıq” kimi göstərilir və mövcud hazırlanmış danışıq qrupunu açır. Sərbəst AI danışıq funksiyası hazır kimi təqdim edilmir. Keçid imtahanına yeni hədd qoyulmayıb. Əlavə fəaliyyətlərin ayrıca vəziyyəti və qəbul qaydaları saxlanılıb.

## Şəkillər

| Vizuallar | Status |
|---|---|
| `assets/onboarding/welcome.png` | Tətbiqin mövcud, seçilmiş maskotu. Ana ekranda, girişdə, lövhədə və Dərs 1-in uyğun danışığında istifadə olunur; əlavə kəsmə yoxdur. |
| `assets/lessons/current/greeting-pair.webp` | `01-compact-teaching-chat.webp` istinadından çıxarılan tam boy yeni 3D variant. Açıq boz saçlı qız, bucaqlı qəhvəyi saçlı çantasız oğlan. Uyğun erkən tanışlıq danışıq kartlarına bağlanıb; ayrıca yeni təsdiqlənmiş yekun personaj dəsti olduğu iddia edilmir. |
| Yerli lövhə | Koddan qurulub; ekran maketi raster fon kimi istifadə olunmur. |
| Əvvəlki P01–P09 2D şəkillər | Fayllar uyğunluq/arxiv üçün qalır. Yeni əsas v2 dərs renderer-i və hekayə onları göstərmir. |
| Bu söhbətdə səhv yaradılan yeni maskot və yumru başlı insanlar | Rədd edilib, tətbiq assets-inə və səhnələrinə bağlanmayıb. |
| Digər mövzuların səhnələri və üç mimika | Tamamlanıb; fayl, kart və göstərmə qaydası SCENES.md-dədir. |

İllüstrasiyalar `contain` ilə, tam bədən göstərilərək yerləşdirilir. Personajın üstünə geniş blur və ayaqları silən maska tətbiq edilmir. Şəkilsiz tapşırıqlarda boş şəkil sahəsi saxlanmır. Dinləmə, yazı, boşluq və səhv təkrarına cavabı açan dekorativ şəkil qoyulmur.

## Mətn ölçüsü və daşma qərarı

Yeni v2 rejimi bütün kartı `scale` ilə kiçiltmir. Normalda sahəyə sığan kart sürüşmür; başlıq və əsas düymə sabitdir. Böyük sistem şrifti, açılan dəstək və klaviatura səbəbindən məzmun sığmadıqda yalnız kartın daxilində ölçülmüş daşma əlçatan qalır. Bu, əvvəlki bütün ekranı sıxışdırma üsulundan fərqlənir; “hər ölçüdə sürüşməsiz hazırdır” iddiası yoxdur. Xəritə normal ölçüsünü saxlayır, böyüdülmüş şriftdə kartlar və yol şaquli birlikdə genişlənir. Native ölçülər real telefonda ayrıca təsdiqlənməlidir.

## Yoxlamalar

- `npx tsc --noEmit`.
- `npm run lint`: 0 xəta; profilin əvvəlcədən olan `handleLogout` xəbərdarlığına toxunulmayıb.
- `check-lesson-one-flow.cjs`: Dərs 1-in tam komponent axını və 12 dərsin 157 mərhələsinin renderi. Native/audio mock-dur.
- `check-lesson-speech-native.cjs`: avtomatik göndərmə, yalnız etibarlı final, təkrar callback, qismən mətn, bilinməyən etibarlılıq, icazə, ləğv, arxa plan və xidmət xətası. Native hadisələr mock-dur.
- `check-v2-readable-voice.cjs`: sadə mikrofon, avtomatik göndərmə bağlanışı, həqiqi səs/səssizlik endpoint-i, ləğv, mətnin kiçildilməməsi və ölçülmüş daşma. Native/audio mock-dur.
- `check-v2-home-render.cjs`: 320/390/430 en, 1× və 1.6× şrift, kart çərçivələrinin üst-üstə düşməməsi, real panel/keçid/kilid, 1/12=8%, 2/12=17%, təkrar və əlavə ID-lərin istisnası. Bu, fiziki native həndəsə testi deyil.
- `check-v2-groups.cjs`, `check-v2-supplements.cjs`, `check-picture-plan.cjs`: müəllif cavabları, qruplar, sübut, təkrar qaydaları, məna/şəkil məhdudiyyətləri.
- `check-vocabulary-persistence.cjs`: 32 ifadə kartı, bütöv ifadə/alternativ kimliyi, saxlama/yükləmə, təkrar, xəta və hydration sərhədi.
- `check-v2-supplement-render.cjs`: mövcud Özünü yoxla axını, saxlanma və hekayə şərti; əlavə fəaliyyətin manual səs qaydası dəyişməyib.
- `check-recorded-audio.cjs`: boş/səhv mənbə, səs yazısını yeniləmə və native resurs xətaları.
- `check-lesson-regressions.cjs`: 79 köhnə cavab yoxlaması və 104 audio/məna uyğunluğu. Skript əvvəl 7 dərsin kart nömrələrini yeni 12 dərslə qarışdırırdı; eyni uğursuzluq dəyişiklikdən əvvəlki HEAD-də də təsdiqləndi. Sınaq mənbəyi köhnə `b1Packet.json` fixture-inə düzəldilib. Cari v2 məzmunu ayrıca daha geniş testlərlə yoxlanır; qəbul qaydası dəyişdirilməyib.
- Expo web export: paketlənmə/import yoxlamasıdır, native ekran və mikrofon yoxlaması deyil.

Renderer yoxlamaları üçün test aləti layihə paketlərinə əlavə edilmədən ayrıca qovluqda quraşdırılıb; `V2_RENDERER` React 19.2.3 ilə uyğun test renderer yolunu göstərir. SDK və dependency versiyaları dəyişdirilməyib.

## Açıq qalan işlər

1. Fiziki iPhone/Android-də Dərs 1-in ölçüsü, klaviatura, icazə, səs tanıma xidmətinin etibarlılıq vermədiyi hal, səssizlik, arxa plan, offline, sürət və reduced motion yoxlamaları.
2. Dərs 2–12-ni real cihazda ayrıca başdan sona keçmək. Ortaq renderer-in açılması bu yoxlamanın əvəzi deyil.
3. Səhnə və mimika dəsti hazırlanıb; native göstərmə ölçülərinin fiziki cihazda təsdiqi qalır.
4. Audio-söz vurğusu həqiqi sərhəd hadisəsinə bağlanıb; fərqli telefon səs mühərriklərində real yoxlama qalır. Hadisə yoxdursa saxta vurğu olmur.
5. Gələcək konkret əşya dərslərinin müəllif şəkil/məna/nümunə planı və keçid imtahanının qəbul qaydası ayrıca müəyyənləşdirilməlidir. Tanışlıq dərslərinə yeni əşya sözləri əlavə edilməyib.

Profil, müəllif paket JSON-u, dərs ardıcıllığı və imtahan həddi bu dəyişiklikdə yenilənmir. PR işçi ana ekran branchinə avtomatik birləşdirilmir.
