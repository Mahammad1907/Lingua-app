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

## 5. Dərs 2–8

Dərslər `docs/BOLME_1_XERITESI.md` üzrə yazılanda hər dərsin şəkilləri bu sənədə ayrıca bölmə kimi əlavə olunur.
