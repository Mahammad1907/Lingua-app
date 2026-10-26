# BirTalk — yalnız son dörd düzəliş

26 oktyabr 2026. İstifadəçi son izah-kartı tələbini bildirdikdən sonra yalnız toplanmış dörd düzəlişin tətbiqini açıq təsdiqlədi. Başlanğıc versiya: f1cf7b9b2609344322cb2dd2b2675bfa0acb6cc8.

## Dəyişikliklər

1. Səhv təkrarının giriş başlığı “Etdiyin səhvlərin təkrarı” oldu. Mövcud təkrar seçimləri, mərhələsi və məzmun ardıcıllığı saxlanıldı.
2. Audio mətni göstərilib-gizlədilir. Düymə “Səsi başa düşmürəm”dən “Mətni gizlət / Mətni göstər”ə çevrilir; görünən mətnə toxunmaq da onu gizlədir. Yalnız audionun dəqiq mətni göstərilir. Mətn daha aydın, qalın bənövşəyi və qısa 400 ms fade ilə açılır. Hərəkəti azaltma seçimi nəzərə alınır. Görünmə vəziyyəti ilə mətnin nə vaxtsa açılması ayrı saxlanır: gizlətmək və ya sonra yenidən dinləmək dinləmə balını geri qaytarmır.
3. Səsli giriş üçün kiçik mikrofon/dalğa bloku əlavə edildi. Yazılı cavabda bağlama X-i və mövcud klaviatura keçidi işləyir; əvvəl yazılmış cavab itmir. Expo Go qeyd edib dinləmə rejimində artıq iri başlıq, ikinci çərçivə və uzun təkrarlanan texniki mətn yoxdur; “Avtomatik yoxlanmır” qeydi qalır. Native səs tanıma varsa təsdiq, yenidən yazma, dinləmə, silmə və ləğv etmə imkanları saxlanır. Mikrofon həcmi əvvəlki real səviyyə ölçməsindən gəlir. Səsli giriş açıqkən təkrar dekorativ hero yığışır, yalnız həmin kartın mövcud blokları arasında boşluq paylanır. Yazılı səs qeydi zamanı Yoxla yerində qalır, deaktiv olur.
4. “Mənə başa sal” təfərrüatı artıq əsas dərs sahəsini uzatmır. Eyni izah ekranın üzərindəki ayrıca kartda açılır. X, “Başa düşdüm”, kartın çölünə toxunma və Android geri hərəkəti ilə bağlanır. Uzun mətn lazım olduqda kartın özündə sürüşür. Ana sual, cavab kilidi, nəticə və ekran mövqeyi dəyişmir.

## Dəyişməyən sərhədlər

Mövcud ScrollView dərs sistemi, ekran rəngləri, şəkil ölçüləri, şriftlər, düymələr və digər kartlar saxlanılıb. Qlobal sabit görünüş və səhifələmə əlavə edilməyib. Yalnız səsli giriş açıqkən yerləşdirmə uyğunlaşır. Məzmun ölçülmüş sahəyə sığdıqda həmin vəziyyətdə sürüşmə/bounce sönür. Böyük şrift, kiçik ekran və açıq klaviatura səbəbindən məzmun sığmasa, idarələri kəsmək əvəzinə əvvəlki əlçatan overflow qalır.

Dərs məlumatları, cavab yoxlayıcısı, məqsədlər, ardıcıllıq, təkrar bankı, lüğət, XP və imtahan qaydaları dəyişməyib. Başqa ekranların kodu və SDK/paket faylları dəyişdirilməyib. Səsli tapşırıqlara yeni şəkil əlavə edilməyib; vizual nümunə yalnız dizayn istinadıdır.

## Yoxlama

- 64 React Native ekran sınağı keçdi. Yeddi dərsin əsas və səhv-təkrar axını, danışıq sübutu, texniki xəta, mətn köməyini gizlətdikdən sonra balın bərpa olunmaması, izah kartının təkrar açılıb-bağlanması və cavabın saxlanması yoxlanır.
- Kiçik recorder üçün icazə xətası/bərpa, qeyd, dinləmə, yenidən qeyd və qeyd zamanı bağlama sınaqları keçdi. Qeyddən qiymətləndirilmiş cavab uydurulmur.
- TypeScript keçdi; lint 0 xəta, əvvəlki profile.tsx handleLogout xəbərdarlığı qalır.
- 79 cavab regressiyası, 104 audio məna uyğunluğu, 210 məzmun/təkrar/imtahan qaydası; səs axını, səs mənbə təhlükəsizliyi və proqress/mükafat yoxlamaları keçdi.
- Android və iOS JavaScript/Hermes paketləri, web və 28 statik marşrut ixracı keçdi.
- Paketlər, dərs məlumatları, store/qiymətləndirici, ortaq görünüş, giriş, dalğa, şəkil komponentləri və imtahandan seçilmiş 12 qorunan fayl başlanğıc Git blob-ları ilə eyni qaldı. Köhnə qeyri-yığcam səs görünüşü və mövcud stil blokları da müqayisə edildi.
- Bu yoxlamalar SDK 57 mənbə mühitindədir. Fiziki iPhone, istifadəçinin SDK 58 quraşdırması və real cihazda piksel üzrə görünüş burada yoxlanmayıb; bunu işlək vizual təsdiq kimi təqdim etmə.
