# İzah standartı — “Mənə başa sal” (14 noyabr 2026)

Oxucu Azərbaycan dilində danışan böyükdür, ingiliscə yeni başlayır. İzah səhv cavabdan sonra “Mənə başa sal” düyməsində görünür. Mənbə: istifadəçinin göndərdiyi xarici yoxlama, istifadəçi qəbul etdi.

## Quruluş — düz 4 sətir, hər sətir bir cümlə

```
Uyğun:  yalnız düzgün cavab
Səbəb:  bu səhv niyə alınmır — ekrandakı sözlərlə
Qayda:  bir cüt forma, bir cümlə
Nümunə: artıq öyrədilmiş bir cümlə
```
Kodda: `ex(answers, reason, rule, example)` (`src/data/unit1/build.ts`). “Sənin cavabın” sətrini tətbiq özü əlavə edir.

## Qrammatikanı sadələşdirmək

1. Yalnız ekrandakı iki formadan danış. He/she/we/they, “bütün fellər”, “başqa şəxslər”, “həmişə” yazma — növbəti dərsdə yalan çıxır.
2. Azərbaycan fərqini bir cümlə ilə göstər, termin işlətmə (fel, şəxs, inkar, kopula, qoşma yox). Məs.: “Azərbaycancada -dır şəkilçidir. İngiliscə is ayrıca sözdür.”
3. Qaydanı tərif kimi yox, iki hazır cümlə kimi ver. Sözün lüğət tərcüməsini qayda sayma.

## Qadağalar

- Öyrədilməmiş ingilis sözü izahda, nümunədə və ipucunda olmaz. Qeyddə keçən söz öyrədilmiş sayılmır.
- `{purpose}` və ya boş şablon olmaz.
- Başqa tapşırığın hazır cümləsini köçürmə. Bu tapşırıqda üzr yoxdursa, “üzr” yazma.
- Sistem cümləsi olmaz (“məqsəd müəyyən edilmədi”). Birbaşa de: “Bu, salam deyil. Hello! və ya Hi! yaz.”
- İpucu cavabı açmır, yalnız yolu göstərir.

## Öyrədilmiş formalar — pozma, genişləndirmə

- I + am → I'm. you + are ayrıca qalır: How are you?
- My name is … — is ayrıca sözdür.
- I'm not very well. — not am-dan sonradır. “not = deyil” yazma.
- I don't understand. — “I not understand” və “I am understand” demirik.
- Bu ikisini qarışdırma, yan-yana göstər, ümumi fel qaydası çıxarma: *I'm not very well. — burada not. I don't understand. — burada don't.*
- please = xahiş (Tea, please). thanks = kömək və ya “Necəsən?” cavabı (Thanks! / I'm fine, thanks) — “yalnız aldıqdan sonra” demə. You're welcome = təşəkkürə cavab.
- Excuse me = diqqət. Sorry = səhv. Fərq siz/sən deyil, işdir. İkisini də “Bağışlayın” ilə ver, mötərizədə işini yaz.
- Sorry? = nə dedin? Sorry! = üzr.

## Nümunələr

| Pis | Yaxşı |
|---|---|
| “is başqa şəxslər üçündür. I ilə həmişə am gəlir.” | “I ilə is demirik. I + am → I'm.” |
| “Fel ilə inkar do not ilə qurulur.” | “I'm not very well. — burada not. I don't understand. — burada don't.” |

## Yazmazdan əvvəl yoxla

Öyrədilməmiş söz varmı? “Həmişə” növbəti dərsi yalan çıxarırmı? Qayda iki sətirdən uzundurmu? Uzundursa, bir cütü saxla, qalanını sil.

`node scripts/check-taught.cjs` avtomatik yoxlayır: izah, nümunə və ipucunda öyrədilməmiş söz; `{purpose}`, “müəyyən edilmədi”, “həmişə”, “başqa şəxs”, “inkar”, “fel”, “not = deyil”.

## Tapşırıq qaydası (izahdan ayrı, 14 noyabr 2026 — xarici yoxlama, istifadəçi qəbul etdi)

- Əsas yolda seçim, səs, nümunə və **qəbul siyahısının hamısı** yalnız artıq öyrədilmiş sözləri göstərir. Dərsin sonundakı “Təkrar”da həmin dərsin sözləri ola bilər.
- Qeyddə keçən söz öyrədilmiş sayılmır; qeyddəki cümləni dinləmə və ya sual etmə.
- Qəbul siyahısına öyrədilməmiş variant yazma (məs. “That's OK” kartı yoxdursa, nə düzgün cavab, nə nümunə).
- Sözü öz kartından əvvəl səhv variantda da göstərmə.
- Eyni ekran növü dalbadal gəlmir.
- Başlıq, tərcümə və öyrədilən cümlə eyni zamandadır (I don't understand → “Başa düşmürəm”, “Başa düşmədim” yox).
- “Edə bilirəm” cümləsi öyrənənin həqiqətən dediyi işi deyir.
