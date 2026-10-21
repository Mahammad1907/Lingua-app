# Yazılı cavab ekranı — köhnə versiya üzərində ayrıca iş

Bu dəyişiklik istifadəçinin göndərdiyi `Lingua-app-master (7)(2).zip` üzərində hazırlanıb. ZIP-in `src/app/lesson/session.tsx` faylının Git blob SHA-sı `da7143ecd881b5a351cfa9a04f72a4a6652b3e56` olub və master-in `557b668a51585eca73cf2adac3f9016be3598e26` commit-indəki faylla eynidir.

## Nə işlənib

Yalnız `fill_blank` və `translation` yazılı tapşırıqları yeni `WrittenPracticeScreen` ilə göstərilir. Digər tapşırıq ekranları, ana səhifə, xəritə, qiymətləndirmə, XP və dərs açılma qaydaları dəyişmir. Bu köhnə nüsxədə 6 dərs var; yeni 7-dərs məzmunu buraya köçürülməyib.

- Ayrı WebP asset: isti işıqlı sinifdə BirFox və boş lövhə. Lövhəyə yazı native Text ilə əlavə edilir.
- Yumru sual kartı, incə bənövşəyi kənar, yığcam “Mənə başa sal”, işıqlı mətn sahəsi, narıncı gradient düymə.
- İpucu mətn sahəsinin içində deyil, sual kartında açılır. Sadə tərcümə tapşırıqlarında uyğun ipucu yoxdursa düymə göstərilmir.
- Fokus/klaviatura zamanı böyük səhnə çıxarılır; sual və cavab sahəsi önə keçir. Uzun mətn və böyük şriftdə təhlükəsiz sürüşdürmə saxlanır.
- Qiymətləndirmə nəticəsi düymənin yuxarısında, alt panelin içində yerləşir.
- Enerji mövcud store-un həqiqi hearts dəyərindən göstərilir; nümunə 80% yazılmır.
- Təkrar kartının progress göstəricisi əvvəlki kimi təkrardır.

## Nə hazır deyil

Bu bütün dərs dizaynlarının bitmiş versiyası deyil. Giriş, dinləmə, səs yazma, söz düzmə və nəticə ekranları hələ yenidən qurulmayıb. Səs dalğası inteqrasiyası yoxdur. Mövcud altı dərsin qiymətləndirmə məntiqi olduğu kimi qalır.

## Yoxlama

- Dəyişən iki TSX faylında ESLint: keçdi.
- iOS Hermes export: keçdi; 1342 modul, 3.6 MB bundle, 27 asset. Yeni səhnə təxminən 72 KB olaraq yığıma daxil oldu.
- Tam TypeScript: Expo typed routes yaradıldıqdan sonra əvvəlcədən mövcud iki TS2345 xətası qalır: `src/app/module/[id].tsx:165` və `src - Copy/app/module/[id].tsx:163`. Hər ikisi mövcud olmayan `/placement/${string}` marşrutuna aiddir. Bu UI işi həmin faylları dəyişmir.
- Browser/iPhone vizual yoxlaması tamamlanmayıb: mövcud mühitdə Chromium executable yoxdur. Heç bir brauzer və ya yeni paket quraşdırılmayıb. Klaviatura üçün balaca viewport və real iPhone sınağı hələ lazımdır; uğurlu kimi göstərilmir.

## Axşam açmaq

Bu budağı ayrıca qovluqda açın; kompüterdəki yeni 7-dərs layihəsinin üstünə yazmayın. Mövcud Expo quruluşu ilə başladın. İlk dərsin `Good ___` yazılı kartına çatanda yeni ekran görünür. Üçüncü dərsin `I ___ Ali` təkrar kartı da bu komponenti istifadə edir.

Sınaq: boş cavabda düymə deaktivdir; yazıdan sonra “Yoxla” aktivləşir; düzgün cavabda nəticə düyməni örtmür; “Davam et” əvvəlki axına keçir; klaviaturada cavab görünür; geri düyməsi xəritəyə qaytarır. Native sınaqdan sonra digər ekranlara keçmək olar.

## Şəkil mənşəyi və təkrar istifadə

`assets/lessons/written-classroom.webp`, 1200×800 WebP. Daxili şəkil yaratma aləti ilə təsdiqlənmiş yazılı ekran referansından hazırlanıb, sonra yalnız format/ölçü optimallaşdırılıb.

Prompt: Extract only the cinematic 3D library illustration from the approved BirTalk written screen. Same fluffy orange fox with white chest/muzzle and brown eyes at left, holding chalk and pointing to a front-facing empty dark teal-green wood-framed board on right; amber lamp, blurred navy bookshelves, purple plant pot, warm floor lighting. Board writing area blank; no UI, text, logos or waveform. Landscape 3:2, 1536×1024 original. Reuse for later lessons/languages; native app text is overlaid.
