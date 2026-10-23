# A1 ilk tanışlıq: 7 dərsin icra düzəlişləri

Aktiv mənbə: `codex/b1-lesson-screens-20261021`. Köhnə `master` tətbiqi bu versiyanın üzərinə köçürülməyib.

- Ad təqdimatı ölkə, peşə və hal məlumatından ayrılır; verilmiş roldakı ad qorunur.
- Müsbət hal cavabı inkarla qəbul olunmur. Tam hal-əhval sualı tələb ediləndə `And you?` kifayət etmir.
- Kontekstə uyğun təbii alternativlər və apostrof variantları qəbul olunur.
- Yazıda hər söz üçün bir hərf əlavə/əskik/səhv ola bilər. Başqa real ingilis sözünə çevrilən variantlar, qısa qrammatik sözlər və adlar avtomatik düzəldilmir. Səs transkriptinə bu yumşaltma tətbiq edilmir.
- Səs xətasında, cavab çağırışı gəlmədikdə və ya istifadəçi səsi eşitmədikdə mətnlə davam mümkündür. `Texniki səbəbdən mətnlə` ayrıca saxlanır; müstəqil və köməklə dinləmə sayına daxil olmur. Bu yolla dərsi tamamlamaq mümkündür; nəticə dinləmənin sübutu kimi təqdim olunmur.
- 7-ci dərsdə mətnlə göstərilən replika mikrofonu açır. Məcburi danışıq cavabının redaktə edilmiş mətni danışıq kimi təsdiqlənmir.
- 1–6-cı dərslərdə araya yerləşən könüllü danışıq kartından geri düyməsi həmin kartı keçir və növbəti karta aparır. Cavablanmamış məcburi suallar atlanaraq dərs tamamlanmır.
- Məcburi tapşırıq qalanda nəticə ekranı bunu açıq göstərir. Yalnız qalan tapşırıqları təkrar etmək mümkündür. Keçilmiş tapşırığa sonradan düzgün cavab vermək əvvəlki düzgün cavabları silmir.
- Yazılı, səsli və dinləmə nəticələri ayrılır; məlumat irəliləyişlə saxlanır. Transkript tələffüz balı sayılmır.
- Təkrar kartları müxtəlif bacarıqları saxlayır. Həm təkrar, həm yavaş danışıq xahişi təkrarda da hər iki məqsədi tələb edir.
- Bütün 95 dinləmə, səsli təkrar və cavab replikası istifadəsi üçün Azərbaycan dilində məna mövcuddur.
- 7-ci dərsdə lazımsız ikinci təşəkkür tapşırığı söhbət keçidi ilə əvəzlənib. Yavaş xahişindən sonrakı replika `0.45` sürətini saxlayır.
- Yeni sözlər əvvəlki dərslərin lüğəti ilə müqayisə edilərək öyrətmə mətnində tətbiqin narıncı rəngi ilə seçilir. Sualın cavabını göstərən rəng ipucu əlavə edilməyib.
- Salamlaşmada mövcud insan səhnəsi, sağollaşma/ad/hal üçün uyğun üç yeni səhnə istifadə olunur. Qrammatik müqayisələrdə lövhə saxlanır. Birinci dərsdə eyni ifadənin ayrıca tərcümə abzası təkrarlanmır; mənası səs düyməsinin yanında göstərilir.

## Yoxlama

- `tsc --noEmit`
- `expo lint` — dərs kodunda xəta yoxdur; profil ekranındakı əvvəlki istifadə olunmayan `handleLogout` xəbərdarlığı qalır.
- `node scripts/check-b1-packet.cjs` — 212 mövcud dərs/təkrar/imtahan qaydası.
- `node scripts/check-lesson-regressions.cjs` — 65 əlavə cavab nümunəsi, mənalar, təkrar məqsədləri, nəticələrin ayrılması və yeni sözlər.
- `node scripts/check-progression.cjs` — XP, ikiqat təsdiq, yarımçıq dərsə davam, yazı/danışıq fərqi və nəticənin saxlanması.
- Mövcud ekran, səs, native tanıma və audio yoxlama skriptləri.
- React Native test mühitində 12 ekran ssenarisi: yeddi dərsin axını, yalnız qalan sualın təkrarı, səs xətası, callback gecikməsi, səssiz playback, 7-ci dərsdə mikrofon və redaktə edilmiş cavab.

`ParticleWave`, `LessonVoiceInput`, `ListeningScene` və `useLessonSpeech` faylları dəyişdirilməyib; əvvəlki GitHub mənbə SHA-ları ilə eyniliyi yoxlanılıb.

Real telefonda səs, mikrofon, Android edge-to-edge klaviatura və vizual yerləşmə ayrıca yoxlanmalıdır. Avtomatik testlər cihaz testini əvəz etmir. Bu bölmə sadə tanışlıq söhbətini məşq etdirir; bütün A1 səviyyəsinin tamamlanması deyil.
