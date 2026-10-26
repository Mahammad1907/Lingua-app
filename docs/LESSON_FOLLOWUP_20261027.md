# BirTalk — yalnız 6 təsdiqlənmiş düzəliş

27 oktyabr 2026. Başlanğıc: 9ce11934ba7040538a43ae2366b74110566bcc88. İstifadəçinin son siyahısındakı altı dəyişiklik tətbiq edildi; gələcək qaydalar AGENTS.md və LAYIHE_DEFTERI.md-də saxlanıldı.

## Dəyişikliklər

- Qəbul edilən birhərflik səhvin düzəlişi yaşıl nəticədə görünür; əvvəlki və düzgün yazılışda dəyişən hissə seçilir. Assessorun mövcud status/seçim qaydası saxlanır, yalnız əlavə düzəliş məlumatı qaytarılır.
- Səsli bloklardakı space-evenly/flexGrow paylanması çıxarıldı; sabit yığcam məsafə qalır. Kiçik qeyd panelinin süni dalğası çıxarıldı. Mikrofonun real qeyd vəziyyəti və dayandırma imkanı qalır.
- Səs tanıma olan kompakt giriş yekun, yetərincə etibarlı transkripti bir dəfə avtomatik eyni cavab yoxlayıcısına ötürür. Yarımçıq, zəif etibarlı və təkrar native hadisələr qiymətləndirilmiş cavab yaratmır. Köhnə qeyri-kompakt/manual rejim standart olaraq dəyişmir.
- Yalnız səs yazan rejim səs və sonrakı 1,8 saniyəlik fasilə əsasında qeydi bitirir. 8 saniyə səssizlik göndərilmir; mövcud 20 saniyə həddi saxlanır. Bu, danışıq/tələffüz qiymətləndirməsi deyil. Real səs yazısı çatdırıldıqda tətbiq neytral bildiriş göstərir; yalnız istifadəçi “Yoxlanmadı ilə davam et” seçdikdə cavab yoxlanmamış olaraq saxlanır. Ürək itirilmir, səhv təkrarı yaranmır, danışıq uğuru hesablanmır. Ləğv, bağlama, arxa plana keçmə və texniki xəta səssiz avtomatik təqdimat yaratmır.
- Köməkçi idarələrin kontrastı, şrifti və toxunma sahəsi yaxşılaşdırıldı. Əsas ekranın digər komponentləri və məzmunu dəyişmir.
- İzahın başlığı “Səhv cavabın izahı” oldu; kart, nümunələr və düymə daha aydındır. Təsdiq 280 ms neytral işıq keçidi + 180 ms yumşaq bağlanma ilə işləyir; ekran silkələnmir, nəticə/XP/sual dəyişmir. Təkrar basma və animasiyanın yarıda bağlanması əlavə əməliyyat yaratmır. Azaldılmış hərəkətdə dərhal bağlanır.

## Yoxlama

- 74 React Native ekran sınağı keçdi: qəbul edilən typo bildirişi, digər yeddi dərs axını, bir dəfə avtomatik göndərmə, səssizlik və dayandırma, zəif etibarlı səs, xam səsin yoxlanmamış qalması və animasiya ləğvi daxil olmaqla.
- TypeScript və lint keçdi. Lint: 0 xəta, əvvəlcədən olan profile.tsx handleLogout xəbərdarlığı qalır.
- 79 cavab regressiyası, 104 audio məna uyğunluğu və 210 məzmun/təkrar/imtahan qaydası, səs axını və native audio-mənbə yoxlamaları keçdi.
- Android/iOS və web ixracı keçdi.
- 13 qorunan fayl (paketlər, dərs məlumatları, store, spelling qaydası, təkrar/sübut qaydaları, ümumi səhnə/giriş/dalğa və imtahan) başlanğıc Git blob-ları ilə eynidir. Assessorun məna/status müəyyən edən əsas funksiyası bayt-bayt eynidir.
- Real iPhone, yerli SDK 58, mikrofon mühiti və görünüş bu mühitdə yoxlanmayıb. Avtomatik susma vaxtlamasını və səs səviyyəsi həddini fiziki cihazda yoxlanmış imkan kimi təqdim etmə. Expo Go-da olmayan səs tanıma mühərriki əlavə edilməyib.
