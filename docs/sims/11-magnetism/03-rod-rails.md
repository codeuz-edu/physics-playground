---
title: "Harakatlanuvçi ötkazgiç va Amper kuçi"
description: "Magnit maydondagi relslar böylab metall sterjen tortib borilmoqda. Unda EYK hosil böladi, zanjirdan tok ötadi, maydon esa bu tokka harakatga qarşi Amper kuçi bilan taʼsir qiladi. Tortiş işi rezistorda issiqlikka aylanadi."
topic: "Magnetizm · Amper kuçi va induksiya EYK"
examples: 3
---

# Harakatlanuvçi ötkazgiç va Amper kuçi

<SimLab id="rod-rails" />

## Asosiy ğoya

Elektr generatorida ötkazgiçlar magnit maydonda harakatlanadi va ularda tok hosil böladi. Generatorga yuklama qança katta bölsa, uni aylantiriş şunça qiyin: tokli ötkazgiçlarga taʼsir etuvçi Amper kuçi aylanişga qarşilik qiladi.

## Nazariya

Sterjen harakatlanganda uning içidagi erkin elektronlarga Lorens kuçi taʼsir qiladi va sterjen uçlarida EYK hosil böladi. Zanjir yopiq bölgani uçun tok ötadi. Magnit maydon endi bu tokli sterjenga Amper kuçi bilan taʼsir qiladi va u Lens qoidasiga köra harakatga qarşi yönalgan.

<div class="eq-block">

<span class="eq-label">Harakatlanuvçi ötkazgiçdagi EYK</span><span class="eq-body">$\displaystyle \mathcal{E} = B\upsilon l$</span>

<span class="eq-label">Tok</span><span class="eq-body">$\displaystyle I = \frac{\mathcal{E}}{R}$</span>

<span class="eq-label">Amper kuçi</span><span class="eq-body">$\displaystyle F_A = B I l\sin\alpha$</span>

<span class="eq-label">Energiya</span><span class="eq-body">$\displaystyle F_A s = I^2 R t$</span>

</div>

Sterjenni özgarmas tezlikda tortiş uçun Amper kuçiga teng tortiş kuçi kerak. Uning bajargan işi butunlay rezistorda issiqlikka aylanadi: generatorlarda mexanik energiya elektr energiyasiga xuddi şunday aylanadi.

## Sinab köring

1. Qarşilikni oşiring: sterjenni tortiş osonlaşadimi?
2. Tortiş işi F·s bilan issiqlik Q ni soliştiring.
3. Zanjir uzilsa (R juda katta), Amper kuçi nima böladi?

## Masalalar

### 1-masala. Relsdagi sterjen

Uzunligi 0,4 m bölgan sterjen induksiyasi 0,5 T bölgan maydonda 2 m/s tezlik bilan harakatlanmoqda, zanjir qarşiligi 2 Ω. EYK, tok, Amper kuçi va 2 m yölda ajralgan issiqlikni toping.

<SimExample :values='{"B":0.5,"l":0.4,"v":2,"R":2}' check="Sterjen 2 m yöl bosdi: ℰ = Bυl = 0,40 V, I = 0,20 A, tormozlovçi Amper kuçi F = 0,040 N, ajralgan issiqlik Q = 0,080 J.">

::: details Yeçimni körsatiş

1. $\mathcal{E} = 0{,}5 \cdot 2 \cdot 0{,}4 = 0{,}4\ \text{V}$, $I = 0{,}2\ \text{A}$.
2. $F_A = 0{,}5 \cdot 0{,}2 \cdot 0{,}4 = 0{,}04\ \text{N}$.
3. $Q = F_A s = 0{,}04 \cdot 2 = 0{,}08\ \text{J}$.

**Javob.** $\mathcal{E} = 0{,}4\ \text{V}$, $I = 0{,}2\ \text{A}$, $F_A = 0{,}04\ \text{N}$, $Q = 0{,}08\ \text{J}$.

:::

</SimExample>

### 2-masala. Ikki marta tez

Sterjen 4 m/s tezlik bilan tortilsa, Amper kuçi va 2 m yöldagi issiqlik qança böladi?

<SimExample :values='{"B":0.5,"l":0.4,"v":4,"R":2}' check="Sterjen 2 m yöl bosdi: ℰ = Bυl = 0,80 V, I = 0,40 A, tormozlovçi Amper kuçi F = 0,080 N, ajralgan issiqlik Q = 0,160 J.">

::: details Yeçimni körsatiş

1. $\mathcal{E} = 0{,}8\ \text{V}$, $I = 0{,}4\ \text{A}$, $F_A = 0{,}08\ \text{N}$.
2. $Q = 0{,}08 \cdot 2 = 0{,}16\ \text{J}$: ikki marta köp.

**Javob.** $F_A = 0{,}08\ \text{N}$, $Q = 0{,}16\ \text{J}$.

:::

</SimExample>

### 3-masala. Kuçli maydon

B = 1 T, l = 0,5 m, υ = 1 m/s, R = 1 Ω. Sterjenni tekis tortiş uçun qanday kuç kerak? 2 m yölda qança issiqlik ajraladi?

<SimExample :values='{"B":1,"l":0.5,"v":1,"R":1}' check="Sterjen 2 m yöl bosdi: ℰ = Bυl = 0,50 V, I = 0,50 A, tormozlovçi Amper kuçi F = 0,250 N, ajralgan issiqlik Q = 0,500 J.">

::: details Yeçimni körsatiş

1. $\mathcal{E} = 0{,}5\ \text{V}$, $I = 0{,}5\ \text{A}$, $F = BIl = 0{,}25\ \text{N}$.
2. $Q = I^2 R t = 0{,}25 \cdot 1 \cdot 2 = 0{,}5\ \text{J}$.

**Javob.** $F = 0{,}25\ \text{N}$, $Q = 0{,}5\ \text{J}$.

:::

</SimExample>

## Manbalar

Bu mavzu 11-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 2-jild, 13-bob](https://openstax.org/books/university-physics-volume-2/pages/13-3-motional-emf). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
