# A1 · Dərs 2 — Öz adını demək

İkinci dərs mövcud yeddi dərslik “İlk tanışlıq” bölməsində `a1_en_b1_v2_d2` ID-si ilə yerləşir. Yeni dərs nüsxəsi və ya yeni marşrut yaradılmayıb. Dərs həmin müasir giriş, lövhə, yazı, dinləmə və native danışıq komponentlərindən istifadə edir.

## Axın

| Kart | Məzmun |
| --- | --- |
| 1 | Giriş: məqsəd və üç öyrənmə hədəfi |
| 2–3 | Əvvəlki dərsdən salamlaşma və sağollaşma təkrarı |
| 4 | I am / I’m + ad; izah və dinlənən nümunələr |
| 5 | Dinlə və danışanın adını seç |
| 6–7 | I am quruluşu: sözlərdən cümlə və boşluq |
| 8 | Verilən adla dəstəkli səsli təqdimat |
| 9 | My name is + ad; düzgün nümunə lövhədə |
| 10–11 | Mənanı seç və səhv təqdimatı düzəlt |
| 12 | İstifadəçinin seçdiyi adla səsli təqdimat |
| 13–14 | My name is: cümlə qur və dinləyib boşluğu tamamla |
| 15 | Salam verib seçdiyin adla müstəqil yazılı təqdimat |
| 16 | İki səsli növbə: təqdimat və sağollaşma |
| 17 | Yalnız ehtiyac olduqda səhvə uyğun təkrar; ayrıca adi ekran deyil |
| 18 | Məşqin nəticəsi |

Əsas axında 18 görünən mərhələ var: bir giriş, iki öyrətmə, on yazı/seçim/dinləmə tapşırığı, dörd səsli növbə və bir nəticə. Səhv təkrarları ehtiyac olduqda əlavə olunur. Danışıq növbələri mövcud qaydada seçimlidir.

## Bu yeniləmə

- Yeni quruluş öyrədiləndə lövhədə `My name is Leyla.` göstərilir; əvvəlki `I am` nümunəsi ilə qarışmır.
- `I am` və `My name is` izahları qısa və Azərbaycan dilindədir. Səhv cavab izahları sadəcə nümunə göstərmir, söz sırasını və `am`/`is` seçimini açıqlayır.
- Leylanın səhv cümləsini təkrar düzəldərkən başqa adla cavab düzgün sayılmır. Sərbəst təqdimatda isə seçilən ad qəbul olunur.
- Cümlə qurma təkrarı yenidən sözlərdən cümlə qurur; dinləmə boşluğu təkrarı yeni səs və həmin quruluşla davam edir.
- Dərsin səslərindəki bütün cümlələrə əl ilə yazılmış Azərbaycan dilində mənalar əlavə edilib. Mövcud nəticə kartındakı “Mənasını göstər” ilə, cavab yoxlandıqdan sonra göstərilir. Cavab seçiminə əsasən tərcümə yaradılmır.
- Şəkil yaratma və xarici API çağırışı yoxdur. Mövcud kitabxana/lövhə səhnəsi və səs dalğası istifadə olunur.

Kart ID-ləri, digər altı dərs, imtahanlar, XP/enerji və açılma qaydaları saxlanıb. İlkin mənbə istinadları paketdə qorunub; yuxarıdakı aydınlaşdırmalar tətbiq məzmununa edilib.

## Yoxlama

`check-b1-packet.cjs` ikinci dərsin canlı kursa bağlılığını, verilmiş adın qorunmasını, sərbəst adları və təkrar cavablarını yoxlayır. `check-lesson-screens.cjs` ikinci dərsin bütün dinləmə və danışıq cümlələri üçün yazılmış mənanın olduğunu yoxlayır. Mövcud irəliləyiş və səs/yerləşmə yoxlamaları da işlədilir.

Real Android/iPhone görünüşü və mikrofon sınağı yeni quraşdırmadan sonra ayrıca yoxlanmalıdır. Bu dəyişiklikdən əvvəl yaradılmış APK yeni məzmunu özündə daşımır.
