# Bölmə daxilində 3D dərs yolu

Əsas tətbiq versiyası: `0c0ef0f4d622395aa25bfeb6acd672656914d502`.
Son vizual istinad: istifadəçinin 20 oktyabrda təsdiqlədiyi
`previews/chapter-journey-reference.webp`. Bu, dizayn şəklidir, tətbiqdən çəkilmiş ekran görüntüsü deyil.

## Dəyişiklik sərhədi

Bölmə ekranı `src/app/module/[id].tsx` və `components/chapter/` ilə qurulur.
Ana ekran, dərs məzmunu, istifadəçi store-u, enerji/XP/streak qaydaları, bölmə
kilidləri və `/module/check` dəyişdirilməyib. Bölmənin daxilində imtahan düyməsi yoxdur.
`EnergyMeter`-ə yalnız bölmə üçün əlavə görünüş seçimi verilib: faiz yuxarıda,
ildırım çubuğun içində. Default görünüş və enerji mənbəyi saxlanılır. Animasiya
obyektlərinin ilkin yaradılması lint-ə uyğun stabil state initializer istifadə edir.

## Son istinadın nisbətləri

345 layout vahidlik daxili endə:
- BirFox 168×156, başlıq sahəsi 128 hündürlükdədir. Faiz və çubuq soldakı 60%-də,
  maskot sağda yerləşir; faiz ayrıca böyük boşluğun altına düşmür.
- Dairəvi 3D nişanlar 88 ölçüdə, qısa panellər isə mövzuya uyğun 221–328 endədir.
  Mətnin ölçüsü 12.5, uzun başlıqların sətir hündürlüyü 17-dir. Dar ekranda başlıq
  şrifti 12-dən aşağı düşmür; böyük əlçatanlıq mətnində panellər genişlənir.
- Bağlantı sahəsi 28, cari dərsdən sonra 36-dır. Qısa əyri körpülər kartların tam
  eni boyunca sıx nöqtə zənciri yaratmır. Parıltı şəffaf qatlarla yumşaldılıb.
- Dairələrdə gradient halqa, radial işıq və tünd səth var. Kartlarda incə gradient
  sərhəd, cari düymədə sabit glow və basılmada 0.98 scale tətbiq olunur.
- Yeni şəffaf `reference-atlas.webp` yalnız bölmə maskotu və kitabsız şəxsiyyət kartı
  üçündür. `lesson-atlas.webp` salamlaşma/lövhə/dialoq/sual nişanlarını daşıyır.
  Hər ikisi daxili imagegen ilə hazırlanıb və WebP-yə optimallaşdırılıb. SVG
  illüstrasiya əvəzi deyil: halqa, glow, fon dalğası və interfeys işarələri üçündür.
- Birinci bölmənin altı görünən qısa başlığı istinadla eyniləşdirilib; mənbə dərs
  adları və tam əlçatanlıq etiketləri saxlanılıb. Sonrakı bölmələrin adı məlumatdan gəlir.

## Real irəliləyiş və davranış

Tamamlanan dərs 100%-dir. `LessonProgress.score` tamamlanma faizi deyil.
Cari cəhdin həll olunmuş və keçilməmiş tapşırıqları unikal gözlənilən tapşırıqlara
bölünür; tamamlama təsdiqinə qədər maksimum 99% göstərilir. Yoldakı işıq həmin
faiz qədər əyrinin uzunluğu üzrə irəliləyir. Ekran fokusda deyilsə animasiya dayanır.
Reduce Motion hərəkət və haptiki dayandırır. Kilidli dərs 2.4 saniyəlik
“Əvvəlki dərsi tamamla” bildirir; açılmır. Mövcud session/vocabulary marşrutları qorunur.
Nümunədəki 33%, 40%, 80% tətbiqdə sabit rəqəmlər deyil.

## Yoxlama və sərhədlər

- TypeScript typecheck və dəyişən faylların birbaşa ESLint yoxlaması.
- `check-chapter-journey.cjs`: dəqiqlik/tamamlama ayrılması, keçilmiş tapşırıqlar,
  son cəhd, təkrar ID, kilid, boş/40 dərsli siyahı, beş endə əyri uzunluğu və
  istinad nisbətləri (qısa panellər, böyük maskot, seyrək körpülər).
- `check-progression.cjs` və `check-home-reference.cjs`: mövcud enerji/mükafat/kilid
  və ana ekran davranışının reqressiya yoxlaması.
- Expo iOS export: Hermes paketi və yeni asset-lərin yığılması.

Real iPhone-da yeni görüntü, toxunma və native animasiya yoxlanmayıb. Telefonun
status bar/safe area sahəsi dizayn şəklinin koordinatlarından əlavədir; siyahı
sürüşür, bütün dərslər məcburi bir ekrana sıxılmır. Ekran görüntüsü üzrə piksel
bərabərliyi təsdiqlənməyib. Soyuq açılış sürəti ölçülməyib. Paket quraşdırılmayıb.

Mövcud store yarımçıq cəhdləri yalnız tətbiqin cari sessiyasında saxlayır. Tətbiq
bağlanarsa yarımçıq faiz itə bilər; tamamlanmalar əvvəlki qalıcı mənbədə qalır.
Bu dizayn sual mövqeyinin qalıcı bərpasını əlavə etmir.
`previews/ChapterPreview.fixture.tsx` yalnız nümunədir, istehsal ekranından import edilmir.
