# BirTalk — üçüncü tərəf məhsul rəyi: nə çatmır (14 noyabr 2026)

Müstəqil rəyçi, fayllara toxunmayıb. “(yoxlanmayıb)” — kodda təsdiqlənməyən fərziyyə.

## Ən vacib 5

1. **“Təkrar” axını qırıqdır — gündəlik qısa təkrar sessiyası lazımdır.** Ana səhifədəki say `hardPhrases()`-dən (`ApprovedHome.tsx`, dərsdəki `practiceNeeds`) gəlir, düymə isə `/vocabulary/wrong-words-list` açır, o da `vocabularyStore.wrongWords`-u göstərir; `addWrongWord()` heç yerdə çağırılmır → istifadəçi “3 ifadə” görür, ekran boş açılır. Səhvlər + vaxtı çatmış sözlər `DesignLesson` tapşırıqları ilə 3–5 dəqiqəlik sessiyaya yığıla bilər (`reviewTask` var). Effekt: yadda saxlama, geri qayıtma. Əmək: orta.
2. **Məzmun həcmi çox azdır.** 1 bölmə, 8 dərs, 11–14 kart; lüğət ~40–60 söz (`glossary.ts` ~42). Təxminən 1–1,5 saat, 1–2 həftə. Yararlı A1 üçün ən azı 8–10 bölmə, 400–600 söz (rəqəmlər, ailə, iş, yemək, alış-veriş, vaxt, istiqamət, Present Simple). Bölmə 2 olmasa retensiya 2-ci həftədə kəsilir. Əmək: böyük.
3. **Xatırlatma/bildiriş və gündəlik hədəf yoxdur.** `expo-notifications` yoxdur; profildəki “Bildirişlər” işləmir; onboarding-də seçilən gündəlik dəqiqə (`preferences.minutes`) istifadə olunmur; seriyanı qoruyan heç nə yoxdur. Böyüklər üçün ən güclü retensiya: hədəf + vaxtında xatırlatma. Əmək: kiçik–orta.
4. **Danışıq və tələffüz rəyi praktiki işləmir.** `cloudSpeech` yalnız `text + confidence` qaytarır, fonem/söz səviyyəsində rəy yoxdur; Expo Go-da tanıma işləmir → səsli cavablar “Yoxlanmadı”. Azərbaycanlılar üçün tipik çətinliklər: th, w/v, söz sonu samitlər, ı/ə. Ən azı ifadə üzrə uyğunluq və “bu sözü yenə de”; dev build şərtdir. Əmək: böyük.
5. **Bölmə imtahanı və irəliləyiş yeni dərslərə bağlı deyil.** `module/check.tsx` köhnə `PacketExam`-ı açır (köhnə “Dinlə” düymələri); “Edə bilirəm” yalnız dərs balından (`canDo` ≥90/≥60), vaxtla zəifləmir; sertifikat/bölmə nişanı yoxdur. Əmək: orta.

## Sahələr üzrə

**Öyrənmə dövrəsi**
- Var: səhvlərin dərs sonunda yeni vəziyyətdə təkrarı; iki addımlı kömək; Dinlə və seç / Dinlə və yaz / yavaş səs.
- Var: səviyyə testi (`onboarding/placement`) — amma yalnız A1 olduğu üçün nəticə heç nəyi dəyişmir.
- Zəif: aralıqlı təkrar yoxdur (`dueAt` saxlanmır); səhv bankı iki yerdədir (`practiceNeeds` və `wrongWords`), bağlı deyil.
- Zəif: dinləmə yalnız TTS (`expo-speech`) — təbii səs, sürət, aksent müxtəlifliyi yoxdur.
- Yoxdur: tələffüz balı, sərbəst danışıq (AI söhbət boş), sertifikat.

**Motivasiya və retensiya**
- Var: XP (təkrar verilmir), seriya, həftəlik aktivlik və bacarıq sayları (`AnalysisScreen`).
- Zəif: ürəklər profildə görünür, amma `DesignLesson` `loseHeart` çağırmır — yeni dərslərdə mənası yoxdur.
- Zəif: seriyanı dondurma, gündəlik hədəf halqası, həftəlik xülasə yoxdur.
- Zəif: “məqsəd” seçimi istifadə olunmur (UI: “Ayrıca məqsəd yolu hələ yoxdur.”).
- Var (yoxlanmayıb): offline iş — məzmun yerlidir, bulud tanıma şəbəkə istəyir.
- Yoxdur: irəliləyişin buludda sinxronu — Supabase yalnız giriş üçündür, irəliləyiş AsyncStorage-da; telefon dəyişəndə itir.

**Praktik boşluqlar (kodda)**
- “Təkrar” düyməsində say və açılan ekran uyğun deyil (1-ci bənd).
- `preferences.minutes` və `preferences.goal` saxlanılır, istifadə olunmur.
- Profildə sabit ad (`profile.tsx`, “Salam, …”) — real istifadəçi adı lazımdır.
- Ana səhifədəki dil/səviyyə seçicisi A2/B1/B2 təklif edir, məzmun yoxdur (boş ekrana aparırmı — yoxlanmayıb).
- `lesson/practice.tsx` (1478 sətir) heç yerdən açılmır — ölü kod.
- `vocabulary/test.tsx`-ə keçid yoxdur.

**Məzmun**
- Var: Bölmə 1 keyfiyyətli; “öyrədilmədən soruşma” `check-taught.cjs` ilə yoxlanır.
- Yoxdur: bölmə 2+, qrammatika izləyicisi, şəkillər (44).

**Monetizasiya**
- Yoxdur: satınalma SDK-sı, pulsuz/premium sərhədi, entitlement modeli, server tərəfdə profil.
- Zəif: satılacaq məzmun hələ yoxdur — əvvəl 2-ci bənd.
