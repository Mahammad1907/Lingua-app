# İlk tanışlıq — dərslərin 3D şəkilləri

İstifadəçinin son dəqiqləşdirməsinə əsasən şəkillər statikdir: video, danışan ağız animasiyası və yeni hərəkət effekti əlavə edilməyib.

## Dərslərdə istifadə

| Dərs / vəziyyət | Şəkil |
| --- | --- |
| Salamlaşma, günün vaxtını seçmək | Qulaqlıq və üç ayrı 3D səhnə: səhər məktəb, günorta kafe, axşam park |
| Özünü təqdim etmək | 3D ad kartı; boşluq və uyğun cümlə tapşırıqlarında lövhəli BirFox |
| Təqdimat cümlələrini düzəltmək | Təbaşir tutan 3D BirFox və sualın öz mətnini göstərən həcmli lövhə |
| Hal-əhval söhbəti | İki insanın 3D söhbət şəkli; qrammatika tapşırıqlarında lövhə |
| Sağollaşmaq və təkrar istəmək | 3D mesaj qabarcıqları, söhbət personajları, düzəliş tapşırıqlarında lövhə |
| BirFox ilə səsli söhbət və dərslərin danışıq mərhələsi | Lövhəli BirFox; səsli mesaj və qeyd düymələri əvvəlki axında qalır |

Lövhə mətni ayrıca React Native `Text` komponentidir. Bir şəkil müxtəlif suallarla təkrar istifadə olunur; cavab şəkilə yazılmır. Şagirdə verilən səhv cümlə lövhədə dəyişdirilmədən saxlanılır. Tam sual şəkildən kənarda da görünür. Günün vaxtı səhnələri cavab variantının mətninə görə seçilir; doğru cavaba və variantın sırasına görə seçilmir. Dinləmə sualının üstündə düzgün səhnəni qabaqcadan göstərən şəkil yoxdur.

Ana ekran, bölmə xəritəsi, enerji/XP/streak mənbələri, dərs məzmunu, cavablar, qiymətləndirmə və keçid imtahanı dəyişdirilməyib. Əvvəlki seçimə toxunan kimi yoxlama davranışı bu vizual dəyişiklik paketində dəyişdirilmir.

## Yeni lokal fayllar

Built-in imagegen vasitəsilə yaradılıb, sonra WebP formatına sıxılıb. Yeni paket quraşdırılmayıb. Şəkillərin açılması üçün şəbəkə sorğusu yoxdur.

| Yol | Ölçü | Bayt |
| --- | --- | ---: |
| `assets/lessons/teacher-board-3d.webp` | 1008 × 672 | 77900 |
| `assets/lessons/morning-3d.webp` | 480 × 480 | 47808 |
| `assets/lessons/afternoon-3d.webp` | 480 × 480 | 63358 |
| `assets/lessons/evening-3d.webp` | 480 × 480 | 71804 |
| `assets/lessons/conversation-3d.webp` | 900 × 600 | 92556 |

Birlikdə 353426 bayt. Ad kartı, mesaj qabarcıqları və qulaqlıq üçün layihədəki mövcud 3D şəkillər istifadə olunur. Köhnə SVG səhnələri başqa istifadəçilər üçün silinməyib; bu altı dərsin sessiya ekranları artıq onlardan istifadə etmir.

## Yoxlama

- TypeScript və dəyişən faylların lint yoxlaması.
- `node scripts/check-lesson-artwork.cjs`: 40 tapşırıqda səhnə seçimi, cavabın sızmaması, səhv cümlənin qorunması, variantların yeri dəyişəndə düzgün şəkil, şəkil ölçüsü büdcəsi.
- Mövcud progression, chapter-journey və home-reference yoxlamaları.
- Expo iOS/Hermes export: lokal şəkillərin paketə daxil olması.

Real iPhone-da şəkil/mətn yerləşimi və səs axını hələ yoxlanmayıb. Cihaz TTS səsi əvvəlki kimi qalır; yeni audio faylları və ya yeni səs provayderi əlavə edilməyib.

## Yaradılma promptları

### Lövhəli BirFox

Use case: stylized-concept. Asset type: transparent 3D educational game illustration for BirTalk. Reference image: BirFox character identity and polished fur. Create BirFox as a cheerful small teacher holding white chalk in raised paw, standing entirely in LEFT 30% of wide LANDSCAPE 3:2 image, facing a large empty chalkboard in RIGHT 68%. Board front on, perfectly rectangular deep green matte writing surface with thick warm orange rounded wooden frame, bottom tray and small eraser. Inner writable rectangle approximately x38%-94%, y16%-78%. Fox face turned toward viewer, chalk paw touching left edge of board. Full body, fluffy tail and feet visible. Actual chalkboard must be 3D with thickness, bevels and tactile wood, but writing surface flat facing camera for later dynamic app text. Premium feature animation film 3D rendering matching reference fur, cream muzzle, brown eyes, soft orange/lavender rim lighting. Completely BLANK board: NO text, NO symbols, NO letters. No surrounding room or background rectangle. Genuinely transparent background, all silhouettes within 5% margin.

### Səhər

Use case: stylized-concept. One square isolated 3D miniature diorama for BirTalk language lessons: charming school courtyard on rounded deep navy oval base, open gate, pale cream small school with orange roof, one small green tree, warm rising sun LOW behind roof, long MORNING shadows, tiny backpack by gate. Premium soft 3D animation film / tactile clay style, convincing volume, purple and orange accents, crisp silhouettes readable at90px. Entire diorama on genuinely transparent background. No fox, no people, no text, no numerals, no enclosing rectangle. Centered with safe margins.

### Günorta

Use case: stylized-concept. One square isolated 3D miniature diorama for BirTalk language lessons: cozy outdoor cafe on rounded deep navy oval base, small round wooden table with coffee cup and purple chair, orange parasol, bright sun HIGH overhead, potted green tree. Clearly AFTERNOON bright daylight and short shadows. Premium soft 3D animation film / tactile clay style, convincing volume, purple and orange accents, crisp silhouettes readable at90px. Entire diorama on genuinely transparent background. No fox, no people, no text, no numerals, no enclosing rectangle. Centered with safe margins.

### Axşam

Use case: stylized-concept. One square isolated 3D miniature diorama for BirTalk language lessons: peaceful park on rounded deep navy oval base, wooden bench under small purple leafy tree, glowing warm amber streetlamp, LOW orange sunset sun and violet wispy cloud behind. Clearly EARLY EVENING twilight, not midnight. Premium soft 3D animation film / tactile clay style, convincing volume, purple and orange accents, crisp silhouettes readable at90px. Entire diorama on genuinely transparent background. No fox, no people, no text, no numerals, no enclosing rectangle. Centered with safe margins.

### Söhbət

Use case: stylized-concept. One wide landscape 3:2 isolated 3D conversational illustration for BirTalk. Two friendly young Azerbaijani adults, man with short dark hair orange hoodie and woman with dark brown shoulder length hair lavender jacket, facing each other in relaxed natural conversation, man waving small hello and woman smiling. Waist up, enough space between them. Small glossy empty speech bubbles one purple one orange above them. Premium 3D animation film character rendering, expressive brown eyes, soft volumetric lighting, navy purple orange palette. NOT flat vector. No fox, text, flags, numbers or logos. Entire group on genuinely transparent background, safe margins.
