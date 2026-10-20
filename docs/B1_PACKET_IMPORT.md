# Bölmə 1: yeni müəllif paketinin tətbiqə keçirilməsi

Mənbə: `BirTalk_A1_B1_Ilk_Tanisliq_Paket(1).zip`.
SHA256: `c91d2820dfbec7665274d40b79743db64b3e9d51ef5b40532a200004f4597ccb`.
Yüklənmiş ZIP dəyişdirilməyib. Yeni kod əvvəlki `067df8f` 3D şəkil versiyasının üzərindədir.

## Artıq tətbiqdə olan məzmun

| Dərs | Mövzu | Mənbədə kart mövqeyi |
| --- | --- | ---: |
| 1 | Salamlaşma və sağollaşma | 13 |
| 2 | Öz adını demək | 18 |
| 3 | Qarşı tərəfin adını soruşmaq | 20 |
| 4 | Hal-əhval | 20 |
| 5 | Nəzakətli ifadələr | 21 |
| 6 | Təkrar və yavaş danışmağı istəmək | 19 |
| 7 | BirFox ilə səsli söhbət | 15 |

126 müəllif kart mövqeyi var. Çoxnövbəli danışıq kartları işləyən axında ayrı cavab növbələrinə bölünür. Səhv təkrarı yalnız səhv qeydə alınanda açılır. Məqsəd, öyrətmə və nəticə kartları qiymətləndirilən sual sayılmır.

`scripts/import-b1-packet.py` paketin ayrıca D1–D7 sənədlərini çevirir. Təkrarlanan `Tam_Bolme` faylı ikinci dəfə import edilmir. Müəllif cavabları ilə tələbə mətni ayrı sahələrdədir. JSON-da hər kartın mənbə faylı və kart nömrəsi saxlanır.

## Tələbə axını

- Yeni bölmənin kartları `a1_en_b1_v2_*` identifikatorları ilə saxlanır. Köhnə 6 dərsin tamamlanması yeni məzmunda avtomatik 100% yaratmır. Keçmiş XP, enerji və tarixçə silinmir.
- Öyrətmə kartında 3D lövhə, izah və ayrıca ingiliscə dinləmə nümunələri var. Azərbaycan dilində mətn üçün TTS düyməsi yoxdur.
- Variant seçmək cavabı təsdiqləmir: ayrıca **Yoxla** var. Dinləmə tapşırığında audio dinlənmədən cavab yoxlanmır; transkript əvvəlcədən göstərilmir.
- Etibarlı yanlış/qismən əsas cavab yazılır, uyğun sual dərsin sonundakı növbəyə keçir və əsas dərs davam edir.
- Sonda **Səhv suallarını təkrarlayırsan** banneri və **Mənə başa sal** var. İlk faktiki cavab ayrıca qorunur; sonradan düz cavabla əvəzlənmir. Köhnə sualın cavabı ilə yeni təkrarın cavabı qarışdırılmır.
- Yazılı təkrarlar paketin yeni situasiya bankına əsasən uyğunlaşdırılıb. Səsli təkrarlar həmin ünsiyyət məqsədini hazır replikalarla yenidən məşq etdirir; bəzi səslər orijinal replikadan təkrar istifadə edir. Bu hissə bütün alternativ səs bankının sözbəsöz idxalı deyil.
- Qəbul qaydaları konkret tapşırıq və ünsiyyət məqsədinə görədir. Qısa/tam formalar və apostrof fərqləri normallaşdırılır. Çoxhissəli cavabda salam, ad, qarşı sual və digər məqsədlər ayrı göstərilir. Naməlum sərbəst cavab avtomatik yanlış sayılmır: **Yoxlanmadı** yolu var.
- Sabit rol adı veriləndə rol yoxlanır; açıq təqdimatda seçilmiş ad sərbəstdir. Paketdəki Sam/Alex adları dərslərdə Ali/Murad ilə birlikdə mətn, cavab və audioda uyğunlaşdırılıb. İmtahanın sabit rol adları mənbədəki kimi saxlanıb.
- Səs tanımanın Bye üçün By/Buy yazması yazılı orfoqrafiya ilə eyniləşdirilmir. Səsin transkripti tələffüz balı deyil.
- Danışıq zamanı təkrar/yavaşlıq istəmək öz-özlüyündə səhv sayılmır; eyni replika yenidən və ya daha yavaş səslənir.
- Dərs 7-də 09–10-cu sürət məşqləri əlavə məşqdir; tamamlanmanın məcburi hədəfləri deyil. Digər danışıq məşqlərində Keç = yoxlanmadı.

## Tamamlanma və mükafat

İlk altı dərsdə əsas yazılı/dinləmə tapşırıqlarını həqiqətən həll etmək dərsin tamamlanması üçün lazımdır. Danışığı keçmək yazılı bacarığı silmir, amma danışıq nəticəsi yaratmır və bütün tapşırıqları müstəqil keçmə bonusunu vermir. Son səsli dərsdə məcburi danışıq məqsədləri təsdiqlənmədən tamamlanma/XP verilmir.

Mövcud təkrar mükafat qoruması, enerji mənbəyi və streak saxlanır. Öyrətmə kartını keçmək, boş cavab və ya yalnız Keç düyməsi XP yaratmır. Hazır nümunə ilə danışıq köməklə sayılır.

## Keçid imtahanı

A və B variantlarının hərəsində 17 tapşırıq, o cümlədən 6 səsli cavab var. İlk cəhddə A, nəticə qeydi olan sonrakı cəhddə B istifadə olunur. Sınaq zamanı cavablar/izahlar göstərilmir; səsli göndərmə də cəhd zamanı doğru/yanlış mesajı vermir. Yazılı davam et və Keç var.

Keçid paketin əsas məqsədlər xəritəsinə görədir: 01, 02, 03, 05, 06, 07, 09, 10, 12, 14, 15, 16, 17. Çoxhissəli əsas cavabın hər tələb olunan hissəsi uyğun olmalıdır. Diaqnostik 04/08/11/13 nəticəsi vacib ünsiyyət məqsədini əvəzləmir. Yazılı cavabla tamamlanan səs kartı danışıq təsdiqi kimi göstərilmir.

Yeni sınaq `/module/check?moduleId=module_1` ekranına qoşulub. Ana ekranın kilidli bölmə pəncərəsi olduğu kimi qalır; bölmənin içərisinə imtahan düyməsi əlavə edilmir. İlk bölmə onsuz da açıq olduğuna görə onun kartında kilidli-bölmə pəncərəsi çıxmır. Ümumi onboarding yerləşdirmə testi dəyişdirilməyib.

## Yoxlamalar və sərhədlər

- Tam TypeScript və dəyişdirilən TS/TSX/CJS fayllarının lint yoxlaması.
- `check-b1-packet.cjs`: bütün 214 əsas/təkrar/imtahan cavab modeli, ardıcıllıq, müəllif qeydlərinin ayrılması, rol faktları, alternativlər, boşluq və sərbəst cavab fərqi.
- Mövcud progression, chapter-journey və home-reference yoxlamaları. Əlavə olaraq danışığı keçdikdə yazılı nəticənin qorunması, bonus verilməməsi, yüksək faizlə vacib məqsədin örtülməməsi və köhnə nəticənin silinməməsi yoxlanır.
- Expo iOS/Hermes export: məzmunun və şəkillərin paketə daxil olması.

Real iPhone-da yeni uzun kartlar, klaviatura, səs yazısı və axın sonadək yoxlanmayıb. Expo Go-da səs tanıma modulu yoxdur; danışığın yoxlanması development build tələb edir. Yeni audio faylları və Azure/ElevenLabs inteqrasiyası yaradılmayıb; hazırda cihaz TTS işləyir. Bütün düzgün sərbəst cümlələri və bütün benign yazı səhvlərini avtomatik tanımaq vəd edilmir. Bu import CEFR sertifikatı və ya yaş qruplarında istifadəçi sınağı deyil. Dərs ortası yeni kart vəziyyətinin cihaz bağlanandan sonra tam bərpası bu paketdə əlavə edilməyib.
