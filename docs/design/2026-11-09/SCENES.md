# Yeni tanışlıq səhnələri — tamamlanan dəst

9 noyabr 2026. Bu əlavə əvvəlki hesabatdakı çatışmayan mövzu səhnələrini tamamlayır. Tətbiqin mövcud narıncı kapüşonlu maskotu saxlanır. İnsanlar seçilmiş bucaqlı 3D oyuncaq istiqamətindədir: qızın saçı açıq boz, oğlan çantasızdır. Nağıl, tülkü və yumru başlı alternativlər qoşulmur.

| Səhnə | Fayl və hissə | Öyrətmə kartı |
|---|---|---|
| Salamlaşma | `greeting-pair.webp` | Dərs 1, kart 2 |
| Sağollaşma | `introductions-atlas.webp`, yuxarı sol | Dərs 1, kart 6 |
| Adını demə / boş ad nişanı | `introductions-atlas.webp`, yuxarı sağ | Dərs 2, kart 4 və 9 |
| Yeni tanışlıq | `introductions-atlas.webp`, aşağı sol | Dərs 3 və 4, kart 4 |
| Yaxşı / normal / özünü yaxşı hiss etməyən | `introductions-atlas.webp`, aşağı sağ | Dərs 6, kart 4 |
| Təşəkkür və qarşılıq | `politeness-atlas.webp`, yuxarı sol | Dərs 7, kart 4 |
| Nəzakətlə diqqət çəkmə | `politeness-atlas.webp`, yuxarı sağ | Dərs 8, kart 8 |
| Üzr və qarşılıq | `politeness-atlas.webp`, aşağı sol | Dərs 9, kart 4 və 5 |
| Anlamama / təkrar / yavaş danışıq | `politeness-atlas.webp`, aşağı sağ | Dərs 10, kart 4 və 8; Dərs 11, kart 4 |
| Hazırlanmış yekun söhbət | `conversation.webp` | Dərs 12, kart 4 |

Fayllar `assets/lessons/current/` qovluğundadır. Hər dərsin uyğun danışıq təqdimatına ayrıca mövzu seçimi də bağlanıb. Dərs 1-də və mətnin maskotla danışdığını açıq dediyi növbələrdə mövcud maskot göstərilir. Personaj şəklinin özü yeni qiymətləndirmə ipucu və ya yazılı cavab daşımır.

Üç mimika — düşünən, təəccüblənən və anlamayan — `emotions.webp` faylında yan-yana hazırdır. Bu, seçilmiş mimika nümunəsidir; tələbəyə əlavə öyrədilməmiş emosiyalar dərsi və ya hər cavabın altında dekorativ panel əlavə edilməyib.

Şəkillər atlas hüceyrələrindən ölçü nisbəti saxlanaraq göstərilir. Hər hüceyrənin daxilində personajlar başdan ayağa tamdır; çərçivə qonşu səhnəni gizlədir, personajın ayağını kəsmir. İstehsal PNG-lərinin şəffaflığı WebP çevirməsində eyni qalıb. Şəkil mətn, cavab, variant və ya müəllif açarı daşımır. Müəllif kartları dəyişdirilməyib.

Dərs 5-in hal soruşma kartına Dərs 6-da öyrədilən müxtəlif hallar səhnəsi qabaqcadan qoyulmur. Dərs 8-in diqqət çəkməsinə Dərs 9-un üzr səhnəsi qarışdırılmır. Şəkil lazım olmayan öyrətmədə native lavanda lövhə və mövcud maskot qalır. Dinləmə, yazı, boşluq, iki sahəli qiymətləndirmə və səhv təkrarı şəkilsizdir.

## Canlı lövhə

`expo-speech` versiya 57-nin `onBoundary` hadisəsi gələndə uyğun müəllif ingilis ifadəsində yalnız oxunan hissə vurğulanır. Süni vaxtlayıcı işlədilmir. Səs mühərriki etibarlı sərhəd hadisəsi vermirsə vurğu yoxdur; mətn, məna və audio işləməyə davam edir. Yeni söz rəngi və oxunan hissənin fonu ayrı məqsədlərdir; qiymətləndirmə variantlarına bu vurğu ötürülmür.

## Yoxlama sərhədi

10 səhnənin hamısının müəllif kontekstinə bağlanması, 12 danışıq təqdimatı seçimi, kiçik sahədə atlas həndəsəsi, qiymətləndirmədə şəkil olmaması, sərhəd hadisəsinin etibarlılığı və bütün dərs axını JS səviyyəsində yoxlanır. Fiziki telefonda görüntü, ayaqların real native görünməsi və səs mühərrikinin söz hadisələri ayrıca cihaz sınağı tələb edir. Bu sənəd telefon yoxlamasının aparıldığını iddia etmir.
