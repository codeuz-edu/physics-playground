---
title: "Yoruğlikning qaytişi va sindirişi"
description: "Yoruğlik nuri ikki muhit çegarasiga tuşganda qisman qaytadi va qisman sinadi. Muhitlarning sindiriş körsatkiçlari va tuşiş burçagini özgartiring; optik ziç muhitdan çiqişda töla içki qaytişni kuzating."
topic: "Geometrik optika · Sindiriş qonuni"
examples: 3
---

# Yoruğlikning qaytişi va sindirişi

<SimLab id="refraction" />

## Asosiy ğoya

Suvli stakandagi qoşiq sinib qolganday körinadi, hovuz esa aslida bölgandan sayozroq tuyuladi. Bu yoruğlikning sindirişi. Optik tolada esa nur töla içki qaytiş tufayli tola içida qolib, minglab kilometrga yetib boradi.

## Nazariya

Yoruğlik bir muhitdan ikkinçisiga ötganda tezligi özgaradi va nur sinadi. Tuşgan nur, singan nur va çegaraga ötkazilgan perpendikulyar bitta tekislikda yotadi.

<div class="eq-block">

<span class="eq-label">Qaytiş qonuni</span><span class="eq-body">$\displaystyle \alpha = \beta$</span>

<span class="eq-label">Sindiriş qonuni</span><span class="eq-body">$\displaystyle n_1\sin\alpha = n_2\sin\gamma,\quad n = \frac{c}{\upsilon}$</span>

<span class="eq-label">Töla içki qaytiş</span><span class="eq-body">$\displaystyle \sin\alpha_0 = \frac{n_2}{n_1},\quad n_1 > n_2$</span>

</div>

Optik ziç muhitdan siyrak muhitga ötganda nur perpendikulyardan uzoqlaşadi. Tuşiş burçagi çegaraviy burçakdan katta bölsa, yoruğlik butunlay qaytadi: optik tolalar va olmosning yaltiraşi şunga asoslangan.

“Boşlaş” bosilganda tuşiş burçagi 0° dan tanlangan qiymatgaça ortadi. Grafikda $\gamma$ ning $\alpha$ ga boğliqligi töğri çiziq emasligini, töla içki qaytişda esa singan nur yöqolişini kuzating.

## Sinab köring

1. Tuşiş burçagini 0° qiling: nur sinadimi?
2. Suvdan havoga ötişda çegaraviy burçakni toping.
3. Muhitlarni almaştiring: singan nur qayerga ketadi?

## Masalalar

### 1-masala. Havodan şişaga

Nur havodan şişaga ($n = 1{,}5$) 40° burçak ostida tuşdi. Sindiriş burçagini toping.

<SimExample :values='{"n1":1,"n2":1.5,"a":40}' check="Sindiriş burçagi γ = 25,4°; sin α / sin γ = n₂/n₁ = 1,500.">

::: details Yeçimni körsatiş

1. Sindiriş qonunidan: $\sin\gamma = \dfrac{n_1\sin\alpha}{n_2}$.
2. $\sin\gamma = \dfrac{1 \cdot \sin 40^\circ}{1{,}5} = \dfrac{0{,}643}{1{,}5} = 0{,}429$.
3. $\gamma = \arcsin 0{,}429 = 25{,}4^\circ$: nur perpendikulyarga yaqinlaşdi.

**Javob.** $\gamma \approx 25{,}4^\circ$.

:::

</SimExample>

### 2-masala. Suvdan havoga

Nur suvdan ($n = 1{,}33$) havoga 30° burçak ostida çiqmoqda. Sindiriş burçagi qança?

<SimExample :values='{"n1":1.33,"n2":1,"a":30}' check="Sindiriş burçagi γ = 41,7°; sin α / sin γ = n₂/n₁ = 0,752.">

::: details Yeçimni körsatiş

1. $\sin\gamma = \dfrac{n_1\sin\alpha}{n_2} = \dfrac{1{,}33 \cdot \sin 30^\circ}{1} = 1{,}33 \cdot 0{,}5 = 0{,}665$.
2. $\gamma = \arcsin 0{,}665 = 41{,}7^\circ$: nur perpendikulyardan uzoqlaşdi.

**Javob.** $\gamma \approx 41{,}7^\circ$.

:::

</SimExample>

### 3-masala. Töla içki qaytiş

Şişa uçun ($n = 1{,}5$) çegaraviy burçakni toping. 45° burçak ostida tuşgan nur havoga çiqadimi?

<SimExample :values='{"n1":1.5,"n2":1,"a":45}' check="Töla içki qaytiş: α = 45,0° çegaraviy burçak α₀ = 41,8° dan katta, nur ikkinçi muhitga ötmaydi.">

::: details Yeçimni körsatiş

1. $\sin\alpha_0 = \dfrac{1}{1{,}5} = 0{,}667$, $\alpha_0 = 41{,}8^\circ$.
2. $45^\circ > 41{,}8^\circ$: nur töla qaytadi.

**Javob.** $\alpha_0 \approx 41{,}8^\circ$; çiqmaydi.

:::

</SimExample>

## Manbalar

Bu mavzu 11-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 3-jild, 1-bob](https://openstax.org/books/university-physics-volume-3/pages/1-3-refraction). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
