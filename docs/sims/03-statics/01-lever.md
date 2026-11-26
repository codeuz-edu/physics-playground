---
title: "Riçag va kuç momenti"
description: "Tayanç ustidagi riçagga ikki yuk qöyilgan. Yuklarni riçag böylab suring yoki massalarni özgartiring: kuç momentlari teng bölganda riçag muvozanatda turadi, kiçik kuç bilan katta yukni kötariş mumkin."
topic: "Statika · Riçagning muvozanat şarti"
examples: 3
---

# Riçag va kuç momenti

<SimLab id="lever" />

## Asosiy ğoya

“Menga tayanç nuqtasini beringlar, men Yerni ağdarib yuboraman”, — degan ekan Arximed. Lom bilan toş kötariş, qayçi, ombir, eşkak, hatto qölimizning suyaklari ham riçag vazifasini bajaradi. Riçag — qözğalmas tayanç atrofida aylana oladigan qattiq jism.

Riçagga qöyilgan kuçning taʼsiri faqat uning kattaligiga emas, qayerga qöyilganiga ham boğliq. Eşikni tutqiçidan itarsak oson oçiladi, oşiq-moşiq yonidan itarsak qiyin. Aylantiruvçi taʼsirning ölçovi — kuç momenti.

<div class="lesson-photos">

<SimPhoto name="seesaw" :width="1200" :height="800" alt="Bolalar maydonçasidagi yoğoç çayqalma taxta" caption="Çayqalma taxta — tayanç nuqtasi örtada bölgan riçag. Yengilroq bola örtadan uzoqroq ötirsa, ikkala bolaning kuç momentlari tenglaşadi va taxta muvozanatda turadi." credit="Surat: Roberto Picco, &lt;a href=&quot;https://creativecommons.org/licenses/by/2.0&quot;&gt;CC BY 2.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Up_and_down.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Kuçning aylantiruvçi taʼsiri kuç momenti bilan ölçanadi: kuç moduli va kuç yelkasi köpaytmasi. Kuç yelkasi — aylaniş öqidan kuç taʼsir çiziğigaça bölgan eng qisqa masofa. Riçag muvozanatda bölişi uçun uni soat strelkasi yönalişida va unga teskari aylantiruvçi momentlar teng bölişi kerak.

<div class="eq-block">

<span class="eq-label">Kuç momenti</span><span class="eq-body">$\displaystyle M = F\,d$</span>

<span class="eq-label">Riçagning muvozanat şarti</span><span class="eq-body">$\displaystyle F_1 d_1 = F_2 d_2$</span>

<span class="eq-label">Kuçdan yutiş</span><span class="eq-body">$\displaystyle \frac{F_1}{F_2} = \frac{d_2}{d_1}$</span>

</div>

Kuç momentining birligi — nyuton-metr (N·m). Riçag yordamida kuçdan neça marta yutilsa, yöldan şunça marta yutqaziladi: kiçik kuç qöyilgan uç katta yöl bosadi. Bu mexanikaning “oltin qoidasi”.

## Sinab köring

1. Bitta yukning massasini ikki marta oşiring. Muvozanat uçun yelkasini qanday özgartiriş kerak?
2. d₁ va d₂ ni teng qiling. Muvozanat uçun massalar qanday bölişi kerak?
3. 0,1 kg li yuk bilan 10 kg li yukni muvozanatlaş mumkinmi?

## Masalalar

### 1-masala. Muvozanat uçun yelka

Riçagning çap uçida tayançdan 0,30 m masofada 2,0 kg yuk turibdi. 1,0 kg li yukni öng tomonga qanday masofaga qöysak, riçag muvozanatda böladi?

<SimExample :values='{"m1":2,"d1":0.3,"m2":1,"d2":0.6,"g":9.81}' check="Riçag muvozanatda: M₁ = 5,89 N·m, M₂ = 5,89 N·m. Kuç momentlari teng.">

::: details Yeçimni körsatiş

1. Muvozanat şarti: $m_1 g d_1 = m_2 g d_2$, $g$ qisqaradi.
2. $d_2 = \dfrac{m_1 d_1}{m_2} = \dfrac{2{,}0 \cdot 0{,}30}{1{,}0} = 0{,}60\ \text{m}$.
3. Momentlar: $M = 2{,}0 \cdot 9{,}81 \cdot 0{,}30 = 5{,}89\ \text{N}\cdot\text{m}$.

**Javob.** $d_2 = 0{,}60\ \text{m}$.

:::

</SimExample>

### 2-masala. Qaysi tomon ağadi?

Riçagning çap tomonida tayançdan 0,40 m da 3,0 kg, öng tomonida 0,50 m da 2,0 kg yuk turibdi. Riçag qaysi tomonga ağadi? Muvozanat uçun öngdagi yukni qayerga suriş kerak?

<SimExample :values='{"m1":3,"d1":0.4,"m2":2,"d2":0.5,"g":9.81}' check="Riçag çap tomonga ağdi: M₁ = 11,77 N·m, M₂ = 9,81 N·m. Katta moment tomoni pastga tuşadi.">

::: details Yeçimni körsatiş

1. $M_1 = 3{,}0 \cdot 9{,}81 \cdot 0{,}40 = 11{,}77\ \text{N}\cdot\text{m}$, $M_2 = 2{,}0 \cdot 9{,}81 \cdot 0{,}50 = 9{,}81\ \text{N}\cdot\text{m}$.
2. $M_1 > M_2$: riçag çap tomonga ağadi.
3. Muvozanat uçun $d_2 = \dfrac{3{,}0 \cdot 0{,}40}{2{,}0} = 0{,}60\ \text{m}$.

**Javob.** Çapga ağadi; öngdagi yukni 0,60 m ga suriş kerak.

:::

</SimExample>

### 3-masala. Lom bilan toş kötariş

Lomning qisqa uçi (tayançdan 0,20 m) 5,0 kg li toş ostiga qöyilgan. Uzun uçi tayançdan 1,0 m. Toşni kötariş uçun lomning uzun uçiga qanday kuç qöyiş kerak? Kuçdan neça marta yutiladi?

<SimExample :values='{"m1":5,"d1":0.2,"m2":1,"d2":1,"g":9.81}' check="Riçag muvozanatda: M₁ = 9,81 N·m, M₂ = 9,81 N·m. Kuç momentlari teng.">

::: details Yeçimni körsatiş

1. $F = \dfrac{m g d_1}{d_2} = \dfrac{5{,}0 \cdot 9{,}81 \cdot 0{,}20}{1{,}0} = 9{,}81\ \text{N}$ — bu 1,0 kg yukning oğirligiga teng.
2. Kuçdan yutiş: $\dfrac{d_2}{d_1} = 5$ marta. Lekin uzun uç toşdan 5 marta köp yöl bosadi.

**Javob.** $F = 9{,}81\ \text{N}$; kuçdan 5 marta yutiladi.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 12-bob](https://openstax.org/books/university-physics-volume-1/pages/12-1-conditions-for-static-equilibrium). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
