# BirTalk — lazım olan şəkillər

Versiya 1 · 13 noyabr 2026

Bu siyahı hazırlanmalı bütün şəkilləri bir yerdə saxlayır. Şəkil hazır olanda statusu "✅ hazır" et, faylı `assets/` altında göstərilən ada qoy.

## Ümumi qaydalar

- **Personajlar:** ana maskot (narıncı başlıq, sadə plaş, qəhvəyi üz/əl/ayaq, sarı oval gözlər; şalvar, ayaqqabı, ip, cib YOX), gümüşü saçlı bənövşəyi geyimli qız, narıncı geyimli oğlan. Görünüş hər şəkildə eyni olsun.
- **Üslub:** yumşaq 3D, "oyuncaq" görünüşü, açıq bənövşəyi/lavanda fon, bənövşəyi və narıncı vurğular.
- **Şəkildə yazı olmasın**, cavabı göstərən jest və ya obyekt olmasın.
- **Eyni səhnə ardıcıl iki tapşırıqda təkrarlanmasın.**
- **Dinləmə və səsli tapşırıqlarda səhnə şəkli yoxdur** (yalnız maskotun kiçik avatarı).
- **Ölçü:** səhnə şəkilləri 3:2 (məs. 1536×1024), ana səhifə ikonları kvadrat 512×512, şəffaf fon.
- Hər şəkli yaradanda maskotun və personajların istinad şəkillərini də əlavə et.

## Prompt şablonu

> Soft 3D toy-like illustration, light lavender background, purple and orange accents. [SƏHNƏ]. Characters exactly as in the reference images: [kimlər]. No text, no letters, no speech-bubble text anywhere in the image. Friendly, calm lighting. 3:2 landscape.

---

## 1. Dərs 1 — Salamlaşma və sağollaşma

| # | Kart | Səhnə | Personajlar | Fayl | Status |
|---|---|---|---|---|---|
| 1.1 | Kart 2 · Salamlaşmanı öyrən | Bina girişində iki nəfər qarşılaşır, ikisi də gülümsəyib əl yelləyir | qız, oğlan | `assets/lessons/d1/greet-entrance.webp` | ⏳ |
| 1.2 | Kart 4 · Salamı özün yaz | Həyətdə/küçədə tanışlar rastlaşır, biri digərinə tərəf dönür (hələ danışmır) | qız, oğlan | `assets/lessons/d1/meet-street.webp` | ⏳ |
| 1.3 | Kart 6 · Sağollaşmanı öyrən | Qapı ağzında ayrılırlar, biri çıxır, ikisi də əl yelləyir | qız, oğlan | `assets/lessons/d1/farewell-door.webp` | ⏳ |
| 1.4 | Kart 9 · Dostuna kömək et | Maskot qapıdan çıxıb gedir, başı üstündə **boş** nitq balonu | maskot | `assets/lessons/d1/mascot-leaving.webp` | ⏳ |
| 1.5 | Kart 10 · İki mesaj (1) | Görüşün əvvəli: qız qapını açır, oğlan qapıda dayanıb | qız, oğlan | `assets/lessons/d1/visit-start.webp` | ⏳ (dizayn maketində var — istifadəçidən fayl istənilir) |
| 1.6 | Kart 10 · İki mesaj (2) | Görüşün sonu: oğlan darvazadan çıxır, əl yelləyir | qız, oğlan | `assets/lessons/d1/visit-end.webp` | ⏳ (dizayn maketində var — istifadəçidən fayl istənilir) |
| 1.7 | T2 · Təkrar | Həyətdə səhər rastlaşma (1.2-dən fərqli məkan: oyun meydançası və ya skamya) | qız, oğlan | `assets/lessons/d1/meet-yard.webp` | ⏳ |
| 1.8 | T7 · Təkrar | Maskot qonaqlıqdan çıxır (masa, şar), başı üstündə boş nitq balonu | maskot | `assets/lessons/d1/mascot-party-leaving.webp` | ⏳ |
| 1.9 | T8 · Təkrar (1) | Video zəngin əvvəli: telefon ekranında qız, oğlan telefona baxır | qız, oğlan | `assets/lessons/d1/video-start.webp` | ⏳ |
| 1.10 | T8 · Təkrar (2) | Video zəngin sonu: oğlan telefona əl yelləyir, zəngi bitirmək üzrədir | qız, oğlan | `assets/lessons/d1/video-end.webp` | ⏳ |

Dərs 1-in yeni ekranlara uyğunlaşdırılması təsdiqlənsə (layihə dəftəri, bənd 48), əlavə lazım olacaq:

| # | Yer | Səhnə | Fayl | Status |
|---|---|---|---|---|
| 1.11 | "Yeni söz: Hello / Hi" | Biri tanışını görüb salam verir (1.1-dən fərqli: küçədə) | `assets/lessons/d1/word-hello.webp` | ⏳ |
| 1.12 | "Yeni söz: Goodbye / Bye" | Biri gedərkən arxaya dönüb əl yelləyir | `assets/lessons/d1/word-goodbye.webp` | ⏳ |
| 1.13 | Kart 7A · "Səhnədə tap" | Kafenin qapısı: biri içəri girir, biri masada oturub, biri çıxıb əl yelləyir (3 ayrı, nömrə qoyula bilən personaj) | `assets/lessons/d1/cafe-door-scene.webp` | ⏳ |

## 2. Maskot

| # | Yer | Təsvir | Fayl | Status |
|---|---|---|---|---|
| 2.1 | Bütün ekranlar | Tam boy, əl yelləyir | `assets/mascot/hood_full.png` | ✅ hazır (istinad şəklindən kəsilib) |
| 2.2 | Səsli tapşırıqlar, ana səhifə | Yalnız baş (avatar) — **yenidən kəs, əl görünməsin** | `assets/mascot/hood_head.png` | 🔁 düzəliş |
| 2.3 | Düzgün cavab | Sevinir (qolları yuxarı, gözləri gülür) | `assets/mascot/hood_happy.png` | ⏳ |
| 2.4 | Səhv cavab | Ürək-dirək verir (yumşaq təbəssüm, əli ilə "olar" işarəsi) | `assets/mascot/hood_encourage.png` | ⏳ |
| 2.5 | Dərs nəticəsi / bölmə bitdi | Bayraq və ya ulduzla sevinir | `assets/mascot/hood_celebrate.png` | ⏳ |

## 3. Ana səhifə (ada)

Ada və yol kodla çəkilir — şəkil lazım deyil. Lazım olanlar:

| # | Yer | Təsvir | Fayl | Status |
|---|---|---|---|---|
| 3.1–3.8 | Bölmə 1 dərs ikonları | Hər dərs üçün bir ikon (dərslər yekunlaşanda): Salam, Adın, Ad soruş, Necəsən?, Təşəkkür, Üzr, Başa düşmədim, Bölmə söhbəti | `assets/home/b1/lesson-1.png` … `lesson-8.png` | ⏳ dərslər yekunlaşanda |
| 3.9 | Ana səhifənin yuxarısı | Maskot kitab tutub salam verir (istifadəçinin mövcud dizaynındakı kimi, yüksək keyfiyyətdə, şəffaf fon) | `assets/home/mascot-greeting.png` | ⏳ |

## 4. Yeni ekran növləri üçün

| # | Ekran | Təsvir | Status |
|---|---|---|---|
| 4.1 | "Yeni söz" | Hər yeni söz üçün bir kiçik səhnə — dərslər yazılanda siyahıya əlavə olunur | dərslərlə birlikdə |
| 4.2 | "Səhnədə tap" | Hər tapşırıq üçün 3 personajlı bir səhnə — dərslər yazılanda | dərslərlə birlikdə |
| 4.3 | Avatarlar | Qız və oğlanın dairəvi baş avatarları (mesajlaşma ekranları üçün) | `assets/characters/girl-avatar.png`, `boy-avatar.png` · ⏳ |

## 5. Dərs 2–8 (13 noyabr 2026, dərslər yazıldı)

Dərs 2–8-də şəkilsiz də işləyən quruluş seçildi: “Səhnədə tap” kartları şəkil gələnə qədər adi seçim siyahısı kimi görünür, şəkil gələndə nömrəli nöqtələr şəklin üstünə düşür. Nöqtələrin yeri (x, y — şəklin %-i ilə) dərs faylında yazılıb; şəkil hazır olanda yerləri şəklə görə düzəltmək lazım ola bilər.

| # | Yer | Səhnə | Personaj | Fayl və id | Status |
|---|---|---|---|---|---|
| 5.1 | Dərs 6, kart 6 · Səhnədə tap | Kafe: solda kitab oxuyan qız, ortada qəhvəni yerə tökən oğlan, sağda pəncərədən baxan adam | qız, oğlan, 1 neytral | `assets/lessons/d6/cafe-spill.webp` · `d6/cafe-spill` | ⏳ |
| 5.2 | Dərs 6, kart 6 təkrar | Avtobus dayanacağı: solda gözləyən oğlan, ortada yol soruşmaq istəyən qız, sağda telefonla danışan adam | qız, oğlan, 1 neytral | `assets/lessons/d6/bus-stop.webp` · `d6/bus-stop` | ⏳ |
| 5.3 | Dərs 8, kart 6 · Səhnədə tap | Ziyafət: solda tort kəsən qız, ortada musiqiyə qulaq asan adam, sağda qapıdan çıxan oğlan | qız, oğlan, 1 neytral | `assets/lessons/d8/party.webp` · `d8/party` | ⏳ |
| 5.4 | Dərs 8, kart 6 təkrar | Ziyafətin girişi: solda paltosunu geyinən oğlan, ortada yenicə girən qız, sağda masada oturan adam | qız, oğlan, 1 neytral | `assets/lessons/d8/party-door.webp` · `d8/party-door` | ⏳ |
| 5.5 | Dərs 2–8 · “Yeni söz” kartları | Hər yeni ifadə üçün bir şəkil (istəyə bağlı; şəkilsiz də işləyir) | — | `assets/lessons/dN/word-*.webp` | sonra |

Şəkil gələndə `src/config/sceneImages.ts`-ə bir sətir əlavə olunur (məs. `'d6/cafe-spill': require('../../assets/lessons/d6/cafe-spill.webp')`).

## 6. Dərs 2–8 — vəziyyət şəkilləri (13 noyabr 2026)

Tətbiqdə bu yerlərdə hələlik qırıq xətli çərçivə və şəklin nömrəsi görünür (`SHOW_IMAGE_SLOTS`). Söhbət, “Sözü tamamla”, səsli cavab və dinləmə ekranlarında şəkil yoxdur: orada danışanın avatarı və ya səs kartı vizual rolunu oynayır. “Yeni söz” kartlarında maskot banneri var; əlavə səhnə yalnız siyahıdakı yerlərdə.

| # | Yer | Səhnə | Fayl | Status |
|---|---|---|---|---|
| 6.1 | Dərs 2 · “Hansı cümlə düzgündür?” | Yeni tanışlar: qız özünü oğlana təqdim edir | `assets/lessons/d2/new-friend.webp` | ⏳ |
| 6.2 | Dərs 2 · eyni tapşırığın təkrarı | Sinifdə yeni yoldaşlar tanış olur | `assets/lessons/d2/new-classmates.webp` | ⏳ |
| 6.3 | Dərs 2 · “Adını yaz” | Qeydiyyat masası: işçi soruşur, oğlan cavab verir | `assets/lessons/d2/registration.webp` | ⏳ |
| 6.4 | Dərs 2 · təkrar | Telefonda oyun profili yaradılır | `assets/lessons/d2/game-profile.webp` | ⏳ |
| 6.5 | Dərs 6 · “O nə cavab verər?” | Oğlan qıza təşəkkür edir, qız gülümsəyir | `assets/lessons/d6/thank-girl.webp` | ⏳ |
| 6.6 | Dərs 6 · təkrar | Oğlan küçədə yol göstərir | `assets/lessons/d6/directions.webp` | ⏳ |
| 6.7 | Dərs 6 · “Nə ilə başlayarsan?” | Küçədə qız yoldan keçənə yaxınlaşır | `assets/lessons/d6/street-ask.webp` | ⏳ |
| 6.8 | Dərs 6 · təkrar | Avtobusda biri təsadüfən başqasının ayağına basır | `assets/lessons/d6/foot-step.webp` | ⏳ |
| 6.9 | Dərs 8 · “İki mesaj yaz” | Ziyafətdə iki nəfər tanış olur | `assets/lessons/d8/party-meet.webp` | ⏳ |
| 6.10 | Dərs 8 · təkrar | Onlayn dərs: ekranda yoldaşlar | `assets/lessons/d8/online-class.webp` | ⏳ |
