# BirTalk — yığcam dərs ekranları və mətn köməyi (geri alınmış görünüş)

Bu hesabat 6f852e0 paketinin tarixçəsidir. İstifadəçinin etirazından sonra geniş görünüş dəyişiklikləri geri alındı. Cari qərar: docs/LESSON_LAYOUT_RESTORE_20261026.md. Buradakı 62 sınaq köhnə versiyaya aiddir; sabit görünüş və səhifələmə artıq cari imkan deyil.

26 oktyabr 2026. İstifadəçi topladığı dörd düzəlişin tətbiqini təsdiqlədi. Mövcud yeddi dərsin məzmunu, məqsədləri, ardıcıllığı və sabit tapşırıq ID-ləri saxlanıldı.

## Dəyişikliklər

1. Səhv təkrarının girişində “Bir daha məşq edək!” başlığı, ↻ işarəsi, bənövşəyi çərçivə və bir dəfə qısa görünmə animasiyası var. Alt mətn: “Bu hissədə çətinlik oldu. İndi başqa vəziyyətdə yenidən yoxlayaq.”
2. Dərsin əsas sahəsi sabitdir, şaquli sürüşdürülmür. Səsli məşq yığcamlaşıb; daxili qeydiyyat çərçivəsi təkrarlanmır. Dinləmə dalğası oxutma düyməsinin yanında yerləşir; danışıqda bir mikrofon dalğası qalır. Nümunə ayrıca iri kart əvəzinə bir sətrə yerləşir. Əsas hərəkətlər sabit alt hissədədir. Uzun “Mənə başa sal” izahı və tapşırıqların nəticə siyahısı ayrıca pəncərədə açılır. Yalnız bu əlavə pəncərələrdə uzun mətn sürüşdürülə bilər.
3. Yer çatmasa (kiçik ekran, böyük şrift, açıq klaviatura), məzmunu kəsmək və ya yazını kiçiltmək əvəzinə kartın daxilində “Ardını göstər” / “Əvvəlki hissə” keçidləri görünür. Bu keçidlər dərsi irəlilətmir, cavabı təsdiqləmir, cavab/nəticə/səs komponentinin vəziyyətini sıfırlamır. Bir ekrana sığan kartlarda bu əlavə nəzarətlər görünmür. Yeni tapşırıq başladıqda görünüş ilk hissəyə qayıdır.
4. Yanlış cavab sahəsinin/seçimin və izah panelinin kənarı bir dəfə qırmızı parlayır, sonra Davam et seçilənədək sabit qırmızı qalır. Təkrarlanan yanıb-sönmə və ekran silkələnməsi yoxdur. Hərəkəti azaltma seçimi olduqda kənar birbaşa qırmızı olur. Texniki və qeyri-müəyyən nəticələr səhv effekti almır.
5. Mətn köməyinin düyməsi “Səsi başa düşmürəm”dir. Açıldıqda yalnız həmin audionun dəqiq mətni göstərilir. Texniki başlıq, təkrarlanan xəbərdarlıq və ayrı nümunə gizlədilir. Bu hərəkət transcriptShown kimi saxlanır, həqiqi audio texniki xətası ilə qarışdırılmır.

## Qiymətləndirmə

Mətn köməyi açıldıqdan sonra həmin tapşırıq heç bir müstəqil və ya köməklə dinləmə nəticəsinə daxil edilmir. Audionun sonradan yenidən dinlənməsi bu məhdudiyyəti aradan qaldırmır. Digər faktiki dinləmə nəticələri saxlanır. Mətnlə düzgün cavab məşq və dərsin tamamlanması üçün qəbul edilə bilər; dinləmə sübutu yaratmır və müstəqil/perfect bonus vermir. Mətnlə yoxlanmayan cavabla Yoxlanmadı seçərək davam etmək mümkündür; bu halda ürək itirilmir və dinləmə səhvi təkrarı yaranmır.

Həqiqi səs xətası və gecikmiş callback üçün əvvəlki bərpa/qoruma mexanizmləri qalır. İmtahanın ayrıca texniki mətn rejimi və keçid qaydaları dəyişdirilmir. Səs tanıma Expo Go-da yoxdursa, sadəcə qeyd edib dinləmə imkanı qalır; bu dəyişiklik yeni qiymətləndirmə mühərriki əlavə etmir.

## Yoxlama

- 62 React Native ekran sınağı keçdi. Bütün yeddi dərsin düzgün/səhv axını, qısa son təkrar, cavabın kilidi, səs xətaları, mətn köməyi və yadda saxlanan sübut yoxlanır.
- Ölçüsü dəyişən sabit görünüşdə əlavə keçidlərin cavabı yenidən yaratmaması və məzmunu bütöv əhatə etməsi sınaqdan keçirildi. Bu, real telefonun piksel üzrə vizual yoxlaması deyil.
- TypeScript keçdi. Lint: 0 xəta; əvvəlcədən olan profile.tsx handleLogout xəbərdarlığı qalır.
- 79 cavab regressiyası, 104 audio məna uyğunluğu və 210 məzmun/təkrar/imtahan qaydası keçdi.
- İrəliləyiş, XP/təkrar mükafat, davamlı yaddaş, səs yazısının təhlükəsiz mənbə idarəsi və səs axını yoxlamaları keçdi.
- Android, iOS və web JavaScript ixracı keçdi.
- Bu mühitdə paketlər SDK 57-dir. İstifadəçinin iPhone/yerli SDK 58 quraşdırmasında fiziki və vizual baxış aparılmayıb.
- package.json, package-lock.json, Expo SDK və şəkil faylları dəyişdirilməyib.
