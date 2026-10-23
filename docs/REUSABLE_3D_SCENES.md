# BirTalk üçün təkrar istifadə olunan 3D səhnələr

İstifadəçinin istəyi: lövhə əsas qalsın; yalnız seçilmiş yerlərə maraqlı statik 3D səhnələr əlavə edilsin. Eyni şəkillər növbəti dərslər üçün yenidən yaradılmasın.

## Daimi kataloq

`assets/lessons/scene-library.json` mövcud 9 şəkli sabit ID, fayl yolu, mövzu etiketləri və təsvirlə qeyd edir. Yeni dərs üçün əvvəlcə bu kataloqdan uyğun şəkil seç. Dil və səviyyə dəyişməsi eyni səhnəni yenidən yaratmaq üçün səbəb deyil. Mətn şəkilə yazılmır, tətbiqin öz mətn qatında qalır.

| ID | İstifadə sahəsi | Komponent |
| --- | --- | --- |
| written-classroom | Yeni 7 dərsin giriş, öyrətmə və yazı kartları; boş lövhəli kitabxana | ClassroomScene |
| teacher-board | Qrammatika, sual, izah, səhv düzəlişi | TeacherBoard3D |
| conversation | Salam, tanışlıq, söhbət, hal-əhval | ReusableLessonScene |
| morning | Səhər, məktəb, günün vaxtı | DaySceneArtwork |
| afternoon | Günorta, kafe, yemək, günün vaxtı | DaySceneArtwork |
| evening | Axşam, park, istirahət | DaySceneArtwork |
| gratitude | Kömək, itmiş əşyanı qaytarmaq, təşəkkür, dəyməz | ReusableLessonScene |
| apology | Kiçik səhv, üzr, eybi yoxdur, kitablar | ReusableLessonScene |
| clarify | Dinləmək, anlamamaq, təkrar, daha yavaş danışmaq | ReusableLessonScene |

Ad kartı, kitab, ev, çanta və qulaqlıq kimi digər mövcud 3D əşyalar da `HomeArtwork` və `ChapterArtwork` komponentlərində saxlanır. Bunlar da yeni şəkil yaratmadan istifadə edilə bilər.

## Bu dəyişiklikdə yeni olan şəkillər

| Fayl | Ölçü | Bayt |
| --- | --- | ---: |
| assets/lessons/scenes/gratitude-3d.webp | 900 × 600 | 88180 |
| assets/lessons/scenes/apology-3d.webp | 900 × 600 | 73042 |
| assets/lessons/scenes/clarify-3d.webp | 900 × 600 | 98618 |

Üçü birlikdə 259840 baytdır, təxminən 254 KiB. Hamısı şəffaf fonlu statik 3D raster şəkillərdir. Video, animasiya dövrü, yeni paket və şəkil üçün şəbəkə sorğusu əlavə edilməyib.

Built-in imagegen istifadə edilib. Əvvəlki söhbət şəklindəki personajlar üslub istinadı olub. Tam yaradılma promptları `assets/lessons/scenes/generation-prompts.json` faylında saxlanır. Gələcəkdə əvvəlcə mövcud WebP fayllarını istifadə et; promptlar yenidən yaratmaq məcburiyyəti deyil.

## 1-ci bölmədə yerləşmə

- Dərs 1, 3 və 4-ün girişində əvvəlki tanışlıq/söhbət şəkli istifadə olunur.
- Dərs 5, kart 04: dəftərin qaytarılması və təşəkkür səhnəsi.
- Dərs 5, kart 14: yerə düşmüş kitablar, üzr və anlayışla qarşılama.
- Dərs 6, giriş və kart 13: diqqətlə dinləmə/təkrar və yavaşlıq mövzusu üçün eyni səhnə.
- Digər kartlarda 3D lövhə qalır. Səhv təkrarlarında və qiymətləndirilən kartlarda mövzu şəkli düzgün cavabı bildirmir. İmtahan dəyişdirilməyib.

Seçim `src/utils/packetScene.ts` faylında açıq qeyd olunur; bütün suallara avtomatik şəkil əlavə edən qayda yoxdur. `ReusableLessonScene` komponenti ID ilə çağırılır və dərs nömrəsindən asılı olmayan şəkil mənbələrinə malikdir. Kataloq və yenidən istifadə qaydası `AGENTS.md` faylında da göstərilib.

Məzmun, cavab açarı, qiymətləndirmə, XP/enerji və imtahan davranışı dəyişdirilməyib. Yeni yerləşmələr üçün real iPhone baxışı hələ lazımdır.

## Yeni dərs arayüzü (2026-10-21)

Yeni 7 dərsin girişləri eyni kitabxana/lövhə səhnəsini istifadə edir. Seçilmiş öyrətmə kartlarında əvvəlki mövzu səhnələri qalır. `written-classroom.webp` əvvəlki təsdiqlənmiş sınaqdan götürülüb; yenidən şəkil yaradılmayıb. Səhnə telefonun ölçüsünə görə kəsiləndə native lövhə mətninin koordinatları da həmin kəsilməyə uyğun hesablanır. Danışıqda maskot şəkli əvəzinə mikrofon və cihazdan gələn səs səviyyələri göstərilir.

## 23 oktyabr 2026 — mövcud personajlarla yeni vəziyyətlər

Əlavə olaraq yalnız üç insan səhnəsi yaradılıb: farewell, name-card, feelings. BirFox və hər iki lövhə yenidən yaradılmayıb. Əvvəlki tanışlıq, təşəkkür, üzr və diqqətlə dinləmə səhnələri saxlanıb. Yeni səhnələrdə yazı yoxdur və şəffaf fon qorunur. Yüksək ölçülü orijinallar ayrıca qorunur; tətbiq üçün digər insan səhnələri kimi 900×600 şəffaf WebP faylları ixrac olunub.

| ID | Öyrətmə kartı | Məqsəd |
| --- | --- | --- |
| farewell | Dərs 1, kart 7 | Qapı yanında sağollaşma |
| name-card | Dərs 2, kart 4; dərs 3, kart 4 | Özünü təqdim etmək və ad soruşmaq |
| feelings | Dərs 4, kart 5 və 14 | Yaxşı, normal və yaxşı olmayan halı müqayisə etmək |

I am / My name is və my / your müqayisə kartları lövhədə qalır. Yeni səhnələr qiymətləndirilən suallara, imtahana və səhv təkrarlarına verilmir. Bu vizual dəyişiklik cavab yoxlaması, dərs tamamlanması və səs xətalarının həllini əhatə etmir.
