# Yalnız birinci dərsin giriş ekranı

İstinad: istifadəçinin bu söhbətdə yenidən göndərdiyi `5D7FC6ED-9C46-4303-B3A1-87B0FFFBF088(1).jpeg`.

Bu düzəliş yalnız `a1_en_b1_v2_d1` dərsinin girişinə aiddir. Öyrətmə, seçim, yazı və digər dərslərin girişləri dəyişdirilmir. Dərs/imtahan məzmunu, qiymətləndirmə və SDK dəyişmir. Yeni şəkil yaradılmır.

- İstinaddakı “İlk tanışlıq”, alt başlıq və üç məqsəd eyni mətnlə göstərilir.
- Başlıq, maskot və məqsəd kartı bütün səhifəni miqyaslayan FixedLessonViewport-dan ayrılır. Mətnin təbii ölçüsü saxlanır; əlavə şaquli yer maskota verilir.
- Mövcud düzgün giriş maskotu, yumşaq bənövşəyi halo, yer kölgəsi və üç məqsədə uyğun xətt ikonları istifadə olunur.
- Geri düyməsi və başlıq aralıqları yalnız bu girişdə uyğunlaşdırılır. Dərsə başla düyməsi oxla birlikdə yalnız bir dəfə göstərilir və əvvəlki dərs başlama əməliyyatını çağırır.
- Kiçik ekran/böyük şrift üçün başlıq və məqsəd aralıqları yığcamlaşır; footer təhlükəsiz alt sahəni saxlayır.
- Developer önbaxışında Dərsə giriş seçimi də həmin real komponenti göstərir.

Kod/type/lint yoxlaması ilə fiziki iPhone baxışı ayrıdır. Telefon görünüşü istifadəçi tərəfindən qəbul edilənə qədər bu dizayn digər ekranlara yayılmır. Native screenshot bu mühitdə alınmayıb.
