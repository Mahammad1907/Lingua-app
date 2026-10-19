# Bölmə daxilində 3D dərs yolu

Əsas versiya: `0c0ef0f4d622395aa25bfeb6acd672656914d502`.
Təsdiqlənmiş vizual istiqamət: `previews/chapter-journey-reference.webp`.
Bu şəkil dizayn nümunəsidir, tətbiqdən çəkilmiş ekran görüntüsü deyil.

## Dəyişiklik sərhədi

Yalnız `src/app/module/[id].tsx` ekranı yeni `components/chapter/` komponentlərinə keçirilib.
Ana ekran, dərslərin məzmunu, enerji komponenti, istifadəçi store-u, XP/streak,
bölmə kilidləri və `/module/check` dəyişdirilməyib. Dərslərin mövcud açılma
qaydaları və session/vocabulary marşrutları saxlanılıb. Bölmə daxilində imtahan
düyməsi yoxdur. Məzmunsuz bölmələr açılmır.

- Yığcam 3D dayanacaqlar növbə ilə sola/sağa söykənir; kartlar arasında 70 px
  bağlantı sahəsi və aşağıda safe area ilə əlavə 72 px boşluq var.
- Enerji ana ekranın eyni `EnergyMeter` komponentidir; təkrar mənbə yaradılmayıb.
- BirFox yalnız başlıqda görünür. Dörd yeni 3D nişan bir şəffaf 1024×1024 WebP
  atlasda saxlanır (təxminən 140 KB); şəxsiyyət kartı və qulaqlıq mövcud şəkillərdir.
  SVG yalnız xətlər, halqalar və kiçik interfeys ikonları üçündür.
- Başlıqlar həqiqi dərs məlumatından gəlir, uzun adlar kəsilmir. Mətn ölçüsü
  böyüdüldükdə kartlar hündürləşə bilər; iri əlçatanlıq mətnində maskot gizlənərək
  başlığa yer saxlanılır. Dərs sayı altı ilə məhdudlaşmır.
- Tamamlanan dərslər 100%-dir. Qiymətləndirmə dəqiqliyi (`score`) tamamlanma
  faizi kimi istifadə edilmir. Cari cəhdin cavablandırılıb həll olunmuş, keçilməmiş
  tapşırıqları onun gözlənilən unikal tapşırıqlarına bölünür. Tamamlama təsdiqinə
  qədər maksimum 99% göstərilir.
- Faizlər eyni uzunluq aralıqları ilə ölçülən əyri nöqtəli yolun həmin hissəsini
  işıqlandırır. Tam yol nanə yaşılı, cari hissə narıncı, qalanı solğun bənövşəyidir.
  Dəyişiklik 450 ms-də irəliləyir; ekran fokusda olmadıqda animasiya işləmir.
  Davamlı loop, timer və yanıb-sönmə yoxdur.
- Kart basılması 0.98 scale, cari düymədə zəif glow, dəstəklənən cihazda soft
  haptik verir. Reduce Motion hərəkət/haptiki dayandırır. Kilidli dərsə toxunmaq
  2.4 saniyəlik “Əvvəlki dərsi tamamla” bildirir, dərsi açmır.

## Yoxlama

- `node node_modules/typescript/bin/tsc --noEmit --pretty false`
- Birbaşa ESLint: dəyişən ekran, yeni komponentlər, model, fixture və test skripti.
- `node scripts/check-chapter-journey.cjs`: tamamlanma və dəqiqliyin ayrılması,
  düzəldilmiş/keçilmiş tapşırıqlar, son cəhd, təkrar ID-lər, mövcud kilid davranışı,
  boş/40 dərsli siyahı, beş endə əyrinin simmetriyası və bərabər məsafəli nöqtələr.
- `node scripts/check-progression.cjs` və `node scripts/check-home-reference.cjs`:
  mövcud enerji/mükafat/kilid və ana ekran məntiqi.
- Expo web və iOS export: yeni ekranın JS/Hermes paketinə və atlasın asset-lərə
  yığılması keçdi. Bu, native cihazda işə salınma testi deyil. Müvəqqəti preview marşrutu və
  preview üçün dəyişdirilən layout saxlanmayıb; istehsal layout-u bərpa olunub.

Real iPhone görünüşü, toxunma, haptik və native animasiya bu mühitdə sınanmayıb.
Soyuq açılış sürəti ölçülməyib. Yeni paket quraşdırılmayıb.

## Cari versiyanın sərhədi

Son cəhdlərin məlumatı mövcud store-da yalnız cari tətbiq sessiyası ərzində yaşayır.
Bu ekran onların real həll sayını göstərir, yeni saxlama və ya davametmə sistemi
yaratmır. Tətbiq tam bağlanarsa yarımçıq faiz itə bilər; tamamlanan dərslər əvvəlki
qalıcı mənbədən gəlir. `Davam et` mövcud dərs marşrutunu açır, sual mövqeyinin
qalıcı bərpasını vəd etmir. Kilidli bölmənin imtahanını keçmək əvvəlki qaydaya uyğun
yalnız final review girişini əlçatan edə bilər, dərsləri tamamlanmış göstərmir.

`previews/ChapterPreview.fixture.tsx` yalnız nümunə məlumatlı yoxlama üçündür,
istehsal ekranından import edilmir. Atlas daxili imagegen ilə hazırlanıb:
şəffaf 2×2 cədvəldə günəş/salam, lövhə, dialoq və kitab/sual nişanları; sonra
şəffaflığı qorunmaqla WebP formatına optimallaşdırılıb.
