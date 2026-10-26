# Əvvəlki dərs ekranlarının bərpası

26 oktyabr 2026. İstifadəçi 6f852e0 paketindəki geniş görünüş dəyişikliklərinə etiraz etdi. Ekranın yığcamlaşdırılması bütün dərs sisteminin əvəzlənməsinə çevrilmişdi. Bu paket həmin görünüş dəyişikliklərini geri alır.

Bərpa mənbəyi: 114a711ee92e2ee820a6d92f479b59579a8d60ff (əvvəlki eff3b47 ekran kodları, sonra yalnız layihə qeydi yenilənmişdi).

## Bərpa edildi

- Əvvəlki ScrollView dərs quruluşu, şəkil ölçüləri və yerləşməsi, kart aralıqları, seçim və oxutma düymələrinin ölçüləri.
- Əvvəlki LessonVoiceInput, VoicePracticeRecorder və LessonFeedback mənbələri tam qaytarıldı.
- İzah və nəticə təfərrüatları əvvəlki kimi kartın daxilində açılır.
- Son paketdə əlavə edilmiş LessonViewport, LessonSheet, lessonPages və səhifələmə sınaqları çıxarıldı. “Ardını göstər / Əvvəlki hissə” nəzarətləri yoxdur.

## Saxlanıldı

- Bir dəfə qırmızı parlayıb Davam et seçilənədək qırmızı qalan səhv kənarı.
- “Səsi başa düşmürəm” mətn köməyi və dəqiq audio mətninin göstərilməsi. Mətn göstərilən tapşırığın dinləmə uğuru sayılmaması; texniki nasazlıqla anlama köməyinin ayrı qeyd olunması.
- Nəzərəçarpan kiçik səhv-təkrar giriş kartı.
- Mövcud cavab yoxlayıcısı, tapşırıq kilidi, təkrar növbəsi, əvvəlki məzmun, lüğət və mükafat qaydaları. Paket/SDK faylları dəyişməyib.

## Yoxlama və qalan məsələ

56 ekran sınağı keçdi. TypeScript və lint keçdi (0 xəta, əvvəlki profile.tsx xəbərdarlığı qalır). Səs axını, 79 cavab regressiyası və 210 məzmun/təkrar/imtahan qaydası keçdi. Üç qaytarılmış komponentin faylları əvvəlki mənbə ilə bayt-bayt müqayisə edildi. PacketLesson-un əvvəlki stil bloku (yeni mətn köməyinin ayrıca stilindən başqa), şəkil hündürlüyü/yerləşməsi, ScrollView parametrləri və oxutma sətri əvvəlki mənbə ilə eynidir.

Bu, real iPhone/SDK 58 ekranının vizual təsdiqi deyil. Səsli sahəni əvvəlki dizaynı qoruyaraq yığcamlaşdırmaq tələbi hələ tamamlanmayıb. Bunu hazır kimi təqdim etmə; gələcəkdə yalnız həmin sahəni dəyiş, bütün dərs ekranlarını əvəz etmə.
