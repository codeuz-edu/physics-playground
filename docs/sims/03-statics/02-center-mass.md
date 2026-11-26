---
title: "Oğirlik markazi"
description: "Bir jinsli plastinkani mixga turli teşiklaridan osing. U har safar oğirlik markazi mixdan tik pastda bölgunça tebranib töxtaydi; şovun çiziqlari kesişgan nuqta oğirlik markazini körsatadi."
topic: "Statika · Bir jinsli jismlar muvozanati"
examples: 3
---

# Oğirlik markazi

<SimLab id="center-mass" />

## Asosiy ğoya

Ağdarilmas öyinçoq qanday ağdarilmasin, qaytib tik turadi; yuk maşinasining yuki baland ortilsa, burilişda ağdarilib ketişi mumkin. Ikkala holda ham hammasini jismning oğirlik markazi qayerda joylaşgani hal qiladi.

Bir jinsli jism — har bir qismining ziçligi bir xil bölgan jism. Uning oğirlik markazi faqat şakliga boğliq. Murakkab şaklli plastinkaning oğirlik markazini tajribada topişning oddiy usuli bor: plastinkani ikki nuqtadan navbatma-navbat osib, şovun yordamida tik çiziqlar çiziladi.

<div class="lesson-photos">

<SimPhoto name="pisa-tower" :width="788" :height="1200" :display-width="380" class="tall" alt="Piza şahridagi qiya minora" caption="Piza minorasi qariyb 4° ga qiyşaygan, lekin ağdarilmaydi: oğirlik markazidan tuşirilgan tik çiziq hali ham minora asosidan çiqmaydi." credit="Surat: Saffron Blaze, &lt;a href=&quot;https://creativecommons.org/licenses/by-sa/3.0&quot;&gt;CC BY-SA 3.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:The_Leaning_Tower_of_Pisa_SB.jpeg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Jismning oğirlik markazi — uning barça qismlariga taʼsir etuvçi oğirlik kuçlarining teng taʼsir etuvçisi qöyilgan nuqta. Bir jinsli simmetrik jismning oğirlik markazi uning simmetriya markazida yotadi: töğri törtburçakda — diagonallar kesişgan nuqtada. Bir jinsli uçburçakli plastinkaning oğirlik markazi esa medianalar kesişgan nuqtada yotadi.

<div class="eq-block">

<span class="eq-label">Murakkab jism (bölaklar massalari $m_i$)</span><span class="eq-body">$\displaystyle x_C = \frac{\sum m_i x_i}{\sum m_i}, \qquad y_C = \frac{\sum m_i y_i}{\sum m_i}$</span>

<span class="eq-label">Uçburçak</span><span class="eq-body">$\displaystyle x_C = \frac{x_1 + x_2 + x_3}{3}, \qquad y_C = \frac{y_1 + y_2 + y_3}{3}$</span>

</div>

Osilgan jism oğirlik markazi osiş nuqtasidan tik pastda bölgandagina muvozanatda turadi: aks holda oğirlik kuçining momenti uni aylantiradi. Şuning uçun jismni ikki xil nuqtadan osib, har safar şovun çiziğini çizsak, çiziqlar oğirlik markazida kesişadi. L-şaklli plastinkada bu nuqta plastinkadan taşqarida yotadi.

Muvozanat turlari: osiş nuqtasi oğirlik markazidan yuqorida bölsa — turğun, pastda bölsa — turğunmas, ustma-ust tuşsa — befarq muvozanat.

## Sinab köring

1. Plastinkani uçala teşikdan navbat bilan osing. Uçala şovun çiziği bir nuqtada kesişadimi?
2. L-şaklli plastinkada oğirlik markazi qayerda? Uni barmoq uçida muvozanatda uşlab bölarmidi?
3. Oyni tanlang: plastinka sekinroq tebranadi, lekin u qaysi holatda töxtaydi?

## Masalalar

### 1-masala. Töğri törtburçakli plastinka

Ölçamlari 60 sm × 40 sm bölgan bir jinsli plastinkaning oğirlik markazi qayerda? Plastinkani A teşikdan, söng B teşikdan osib tekşiring.

<SimExample :values='{"shape":0,"hole":0,"g":9.81}' check="Plastinka töxtagandan keyin “Osiş teşigi”ni B ga özgartiring va yana işga tuşiring: şovun çiziqlari (30; 20) sm nuqtada kesişadi.">

::: details Yeçimni körsatiş

1. Simmetriya markazi — diagonallar kesişgan nuqta: $x_C = 30\ \text{sm}$, $y_C = 20\ \text{sm}$.
2. A va B teşiklardan çizilgan şovun çiziqlari aynan şu nuqtada kesişadi.

**Javob.** Plastinkaning markazida: $(30\ \text{sm};\ 20\ \text{sm})$.

:::

</SimExample>

### 2-masala. L-şaklli plastinka

L-şaklli plastinka ikki töğri törtburçakdan iborat: pastdagisi 60 sm × 20 sm, uning çap qismidagi tikkasi 20 sm × 40 sm. Oğirlik markazini toping. U plastinkaning ustida yotadimi?

<SimExample :values='{"shape":1,"hole":0,"g":9.81}' check="A, söng B teşikdan osing: ikkinçi şovun çiziğidan keyin “Şovun çiziqlari bir nuqtada kesişdi — bu oğirlik markazi: x = 22,0 sm, y = 22,0 sm”.">

::: details Yeçimni körsatiş

1. Pastki bölak: yuzi $1200\ \text{sm}^2$, markazi $(30;\ 10)$. Tik bölak: yuzi $800\ \text{sm}^2$, markazi $(10;\ 40)$.
2. $x_C = \dfrac{1200 \cdot 30 + 800 \cdot 10}{2000} = 22\ \text{sm}$, $y_C = \dfrac{1200 \cdot 10 + 800 \cdot 40}{2000} = 22\ \text{sm}$.
3. $(22;\ 22)$ nuqtada plastinka yöq: oğirlik markazi jismdan taşqarida yotadi.

**Javob.** $(22\ \text{sm};\ 22\ \text{sm})$, plastinkadan taşqarida.

:::

</SimExample>

### 3-masala. Uçburçakli plastinka

Uçburçakli plastinkaning uçlari $(0;\ 0)$, $(60;\ 0)$ va $(20;\ 50)$ sm nuqtalarda. Oğirlik markazini toping.

<SimExample :values='{"shape":2,"hole":0,"g":9.81}' check="Ikki teşikdan osgandan keyin: “Şovun çiziqlari bir nuqtada kesişdi — bu oğirlik markazi: x = 26,7 sm, y = 16,7 sm”.">

::: details Yeçimni körsatiş

1. Oğirlik markazi medianalar kesişgan nuqtada, uning koordinatalari uçlar koordinatalarining örta arifmetik qiymatiga teng: $x_C = \dfrac{x_1 + x_2 + x_3}{3}$, $y_C = \dfrac{y_1 + y_2 + y_3}{3}$.
2. $x_C = \dfrac{0 + 60 + 20}{3} = \dfrac{80}{3} = 26{,}7\ \text{sm}$.
3. $y_C = \dfrac{0 + 0 + 50}{3} = \dfrac{50}{3} = 16{,}7\ \text{sm}$.

**Javob.** $(26{,}7\ \text{sm};\ 16{,}7\ \text{sm})$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 9-bob](https://openstax.org/books/university-physics-volume-1/pages/9-6-center-of-mass). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
