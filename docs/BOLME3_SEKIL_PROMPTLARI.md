# Bölmə 3 — səhnə şəkilləri (7 ədəd)

Hər şəkil: **3:2**, sonda `assets/lessons/u3/<ad>.webp` (1200 px) kimi yerləşdirilir və `sceneImages.ts`-ə bir sətir əlavə olunur. Şəkillər əvvəl yığılır, sonda birdən yerləşdirilir.

Personajlar: qız, oğlan, dost (qıvrım saçlı) — Gemini-yə həmişə öz referans şəkilləri verilir, yenidən çəkilmir. Maskot səhnələrə girmir.
Xarici gənclər (İngiltərədən, Almaniyadan, İrandan və s. olan tanışlar) üçün referans yoxdur: eyni 3D oyuncaq üslubunda **adi, neytral** gənclər çəkilir — bayraq, milli geyim, stereotip yoxdur (ölkəni tapşırığın mətni deyir).

Siyahıda olan, amma heç bir dərsdə işlənməyən 4 şəkil çəkilmir: `u3/club`, `u3/passport`, `u3/map-class`, `u3/exchange`.

| № | Ad | Harada işlənir | Səhnə | Personajlar |
|---|----|----------------|-------|-------------|
| 1 | `u3/airport` | Dərs 2a, “Yaz”: tabloda Istanbul | Hava limanı, uçuş tablosunda iri **ISTANBUL** | qız + oğlan, çamadanla |
| 2 | `u3/train` | Dərs 2a təkrar (tabloda Tbilisi); Dərs 5a “Seçim” (yanındakı qadın) | Qatar vaqonu, kiçik tabloda **TBILISI** | oğlan + yanında oturan qadın sərnişin |
| 3 | `u3/hostel` | Dərs 3b söz kartı və “Formanı doldur”; imtahan; Dərs 5a təkrar | Hostel resepsiyası, qız boş qeydiyyat vərəqi doldurur | qız |
| 4 | `u3/hostel-kitchen` | Dərs 4 söz kartı; Dərs 5a, 5b təkrarları (qız tanışını təqdim edir; mətbəxdəki qadın) | Hostelin mətbəxi, çay | qız + xarici gənc kişi + xarici gənc qadın |
| 5 | `u3/videocall` | Dərs 5a (ekrandakı qadın), 5b (ekrandakı kişi) | Qız noutbukda video zəngdə, ekranda 2 nəfər | qız; ekranda qadın + kişi |
| 6 | `u3/cafe` | Dərs 6 “Mesaj yaz”: kafedəki tanış | Kafe masası, söhbət | qız + xarici gənc qadın |
| 7 | `u3/party` | Dərs 8 izah kartı: dil klubunun ziyafəti | Ayaq üstə söhbət, isti işıq | qız + oğlan + dost + 2–3 xarici gənc |

## Promptlar

Hər promptun əvvəlinə ortaq hissə gəlir:

```
Same style as the Bölmə 1 pictures: 3D toy characters exactly as in the reference images (do not redraw them), on a flat 2D warm cream and lavender background with soft shapes and small Baku details. Horizontal 3:2 picture. No speech bubbles. No text anywhere except what is listed. Nothing important near the edges.
```

1. **airport** — An airport departure hall. A big dark departure board on the wall; its top row shows only the word ISTANBUL in large, sharp, clearly readable white letters; the other rows are empty dark lines. The girl and the boy stand in front of the board with suitcases, looking up at it, friendly and excited.
2. **train** — Inside a bright train carriage with big windows and a calm landscape outside. A small display above the door shows only the word TBILISI in large clear letters. The boy sits by the window and talks in a friendly way with the adult woman sitting next to him (a new neutral passenger in the same 3D toy style, simple everyday clothes).
3. **hostel** — A cosy hostel reception desk with a key board, a plant and backpacks. The girl stands at the desk and writes on a blank registration form with a pen (the form has only empty grey lines, no writing). Behind the desk a friendly receptionist (new neutral character in the same style).
4. **hostel-kitchen** — A cosy shared hostel kitchen with a table, tea cups and a teapot. The girl sits at the table with two new young people in the same 3D toy style: a young man and a young woman (neutral everyday clothes). They are smiling and talking over tea.
5. **videocall** — The girl sits at a desk at home in front of an open laptop, waving. The laptop screen shows a video call split into two windows: a smiling woman in one and a smiling man in the other (new neutral characters, same style). No text or icons on the screen.
6. **cafe** — A small warm Baku café with a table by the window. The girl sits at the table with a new young woman (same 3D toy style, neutral clothes); both have cups of tea and are chatting happily.
7. **party** — A language club party in a bright room with paper garlands and a snack table. Everyone stands and chats in small groups: the girl, the boy and the friend with curly dark hair, plus two or three new young people in the same style. Warm, friendly mood.
