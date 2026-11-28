# Bölmə 2 — 16 səhnə şəkli (28 noyabr 2026)

Say koddan götürülüb (`src/data/unit2`): **16 şəkil**. 45 söz kartı şəkli bu siyahıya daxil deyil (sonra baxılır).
Hər şəkil: **3:2** (məs. 1536×1024), fayl `.webp`, `assets/lessons/d2/` yox, **`assets/lessons/u2/<ad>.webp`**. Şəkillər əvvəl yığılır, sonda birdən tətbiqə yerləşdirilir (`src/config/sceneImages.ts`).

## Ümumi qayda (hər promptun əvvəlinə yapışdır)

> Same style as the Bölmə 1 pictures: 3D toy-like characters on a warm, soft 2D background with small local details (Baku feel). Characters must look EXACTLY like the attached reference images — do not redraw or change them. No speech bubbles, no extra text except the signs/numbers listed. All signs and numbers must be big, sharp, clearly readable and not covered by anything. Horizontal 3:2 picture. Nothing important near the edges.

Seçim şəkildə **toxunulacaq yerlər**dir: sağdakı soldan-sağa **sıra düz verilib** — tətbiq həmin yerə klikləməyi gözləyir. Sıranı dəyişmə.

## Tapşırıq şəkilləri (soldan sağa sıra vacibdir)

| # | Fayl | Tapşırıq | Görünməli olan (soldan sağa) | Personaj |
|---|---|---|---|---|
| 1 | `u2/bus-stop` | Oğlan sürücüdən soruşur, hansı avtobusa minir | 3 avtobus: **7**, **6**, **5** | oğlan (dayanacaqda) |
| 2 | `u2/bus-stop-2` | Qız sürücüdən soruşur | 3 avtobus: **9**, **5**, **8** | qız |
| 3 | `u2/parking-zones` | Ofis parkinqi, mühafizəçi zonanı deyir | 3 zona lövhəsi: **T5**, **D5**, **V5** | yoxdur |
| 4 | `u2/parking-zones-2` | Ticarət mərkəzi parkinqi | **V2**, **T2**, **E2** | yoxdur |
| 5 | `u2/airport-gates` | Hava limanı qapıları | **G4**, **J4**, **A4** | yoxdur |
| 6 | `u2/airport-gates-2` | Başqa terminal | **J2**, **E2**, **G2** | yoxdur |
| 7 | `u2/airport-board` | Uçuş tablosu, 3 sətir yuxarıdan aşağı | **JFK — New York**, **GYD — Baku**, **IST — Istanbul** | yoxdur |
| 8 | `u2/airport-board-2` | Başqa tablo | **ZAG — Zagreb**, **GVA — Geneva**, **CDG — Paris** | yoxdur |
| 9 | `u2/gym-lockers` | İdman zalında dolablar | 3 dolab: **7**, **17**, **16** | yoxdur |
| 10 | `u2/gym-lockers-2` | Hovuzun soyunma otağı | **9**, **18**, **19** | yoxdur |
| 11 | `u2/registration-desk` | Qeydiyyat masası (Dərs 8 izah kartı) | masa arxasında dost (qıvrım saçlı) yeni tələbəni qarşılayır | dost + oğlan |

Forma şəkilləri (boş vərəq arxa fonu, sahələr tətbiqdə kodla yazılır, **şəkildə yazı olmasın**):

| # | Fayl | Nə göstərir |
|---|---|---|
| 12 | `u2/form-course` | Kurs qeydiyyat masası: boş vərəq, qələm, kitablar |
| 13 | `u2/form-gym` | İdman zalının qəbul masası: boş vərəq, su şüşəsi, dəsmal |
| 14 | `u2/form-office` | Ofisdə yeni işçi masası: boş vərəq, noutbuk, kofe |
| 15 | `u2/form-library` | Kitabxana masası: boş vərəq, kitab yığını, lampa |
| 16 | `u2/form-pool` | Hovuz qəbulu: boş vərəq, qoruyucu eynək, dəsmal |

## Hər şəkil üçün prompt

(Ümumi qaydanın üstünə əlavə et.)

1. `bus-stop`: A city bus stop in Baku on a sunny day. Three buses stand side by side, front view with big number boards, left to right: 7, 6, 5. The boy (reference image) stands at the stop near the middle bus, looking at the driver. Numbers on the buses very large and readable.
2. `bus-stop-2`: A different bus stop, evening light, Flame Towers far in the background. Three buses side by side, left to right: 9, 5, 8, big readable number boards. The girl (reference image) stands in front, waiting.
3. `parking-zones`: An office parking lot seen from the front. Three big zone signs on posts in a row, left to right: T5, D5, V5. A few parked cars far behind, no people.
4. `parking-zones-2`: A shopping-mall parking lot. Three big zone signs on posts in a row, left to right: V2, T2, E2. Mall entrance in the background, no people.
5. `airport-gates`: An airport waiting hall. Three big gate signs hanging in a row, left to right: G4, J4, A4. Large windows with a plane outside, no people.
6. `airport-gates-2`: Another airport terminal, different colours. Three gate signs, left to right: J2, E2, G2. No people.
7. `airport-board`: A large departures board facing the viewer, three rows from top to bottom: "JFK — New York", "GYD — Baku", "IST — Istanbul". Big white letters on a dark blue board, airport hall around it, no people.
8. `airport-board-2`: A different departures board, three rows top to bottom: "ZAG — Zagreb", "GVA — Geneva", "CDG — Paris". No people.
9. `gym-lockers`: A gym locker room. A row of tall lockers, three clearly visible lockers with big numbers on their doors, left to right: 7, 17, 16. Warm lighting, bench in front, no people.
10. `gym-lockers-2`: A swimming-pool changing room, bright tiles. Three lockers with big numbers, left to right: 9, 18, 19. No people.
11. `registration-desk`: A course registration desk. The foreign friend with curly dark hair (reference image) sits behind the desk smiling and greeting; the boy (reference image) stands in front of the desk as a new student. Papers and a pen on the desk, no text visible.
12. `form-course`: A course registration desk, top view slightly angled: an empty blank form sheet (no writing, no lines of text), pen, books, a cup of tea (armudu glass). No people.
13. `form-gym`: A gym reception desk: an empty blank form sheet (no writing), a pen, water bottle, towel. No people.
14. `form-office`: An office desk on a new employee's first day: an empty blank form sheet (no writing), laptop, coffee mug, pen. No people.
15. `form-library`: A library desk: an empty blank form sheet (no writing), stack of books, small desk lamp, pen. No people.
16. `form-pool`: A swimming-pool reception desk: an empty blank form sheet (no writing), swimming goggles, towel, pen. No people.

## Yerləşdirmə (hamısı hazır olanda)

Fayllar `assets/lessons/u2/` içinə, `sceneImages.ts`-ə 16 sətir (`'u2/bus-stop': require('../../assets/lessons/u2/bus-stop.webp')` və s.). Şəkilləri mən yerləşdirirəm.
