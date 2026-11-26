---
title: "Yung tajribasi"
description: "Ikki tor tirqişdan ötgan yoruğlik tölqinlari ekranda qöşilib, yoruğ va qoronği yöllarni hosil qiladi. Tölqin uzunligini, tirqişlar orasidagi masofani va ekrangaça masofani özgartirib, yöllar kengligini kuzating."
topic: "Tölqin optikasi · Yoruğlik interferensiyasi"
examples: 3
---

# Yung tajribasi

<SimLab id="young" />

## Asosiy ğoya

1801-yilda Tomas Yung ikki tirqişdan ötgan yoruğlik ekranda yoruğ va qoronği yöllar berişini körsatdi. Bu tajriba yoruğlikning tölqin tabiatini isbotladi va uning tölqin uzunligini birinçi marta ölçaş imkonini berdi.

## Nazariya

Ikki tirqiş bitta tölqin frontidan yoritilgani uçun ular kogerent manbalar böladi. Ekranning har bir nuqtasiga ikkala tirqişdan tölqin keladi. Yöllar farqi butun son tölqin uzunligiga teng bölsa, tölqinlar kuçayadi, yarim tölqinlarning toq soniga teng bölsa, söndiradi.

<div class="eq-block">

<span class="eq-label">Maksimum</span><span class="eq-body">$\displaystyle \Delta = k\lambda$</span>

<span class="eq-label">Minimum</span><span class="eq-body">$\displaystyle \Delta = (2k+1)\frac{\lambda}{2}$</span>

<span class="eq-label">Yöllar kengligi</span><span class="eq-body">$\displaystyle \Delta x = \frac{\lambda L}{d}$</span>

</div>

Yöllar kengligini ölçab, yoruğlik tölqin uzunligini topiş mumkin. Rasmda tirqişlar va tölqinlar sxematik. “Boşlaş” bosilganda ekran 0,5 m dan tanlangan $L$ gaça uzoqlaşadi va yöllar kengayadi: grafikda $\Delta x$ ning $L$ ga proporsional ortişini kuzating. Oxirida ekranda yöllar soni doimo bir xil körsatiladi, haqiqiy kenglikni $\Delta x$ körsatadi.

## Sinab köring

1. Tölqin uzunligini kamaytiring: yöllar ziçlaşadimi?
2. Tirqişlarni bir-biriga yaqinlaştiring: nima özgaradi?
3. Qaysi rang uçun yöllar eng keng?

## Masalalar

### 1-masala. Yöllar kengligi

Tölqin uzunligi 600 nm bölgan yoruğlik bir-biridan 0,2 mm uzoqlikdagi ikki tirqişga tuşmoqda. Ekran 1,5 m uzoqlikda. Qöşni yoruğ yöllar orasidagi masofani toping.

<SimExample :values='{"lam":600,"d":0.2,"L":1.5}' check="Ekranda interferension manzara: qöşni yoruğ yöllar orasidagi masofa Δx = λL/d = 4,50 mm.">

::: details Yeçimni körsatiş

1. $\Delta x = \dfrac{\lambda L}{d}$; birliklarni SI ga ötkazamiz: $\lambda = 600\ \text{nm} = 6\cdot10^{-7}\ \text{m}$, $d = 0{,}2\ \text{mm} = 2\cdot10^{-4}\ \text{m}$.
2. $\Delta x = \dfrac{6\cdot10^{-7} \cdot 1{,}5}{2\cdot10^{-4}} = 4{,}5\cdot10^{-3}\ \text{m} = 4{,}5\ \text{mm}$.

**Javob.** $\Delta x = 4{,}5\ \text{mm}$.

:::

</SimExample>

### 2-masala. Yaşil yoruğlik

λ = 500 nm, d = 0,25 mm, L = 2 m. Δx qança?

<SimExample :values='{"lam":500,"d":0.25,"L":2}' check="Ekranda interferension manzara: qöşni yoruğ yöllar orasidagi masofa Δx = λL/d = 4,00 mm.">

::: details Yeçimni körsatiş

1. $\lambda = 500\ \text{nm} = 5\cdot10^{-7}\ \text{m}$, $d = 0{,}25\ \text{mm} = 2{,}5\cdot10^{-4}\ \text{m}$.
2. $\Delta x = \dfrac{\lambda L}{d} = \dfrac{5\cdot10^{-7} \cdot 2}{2{,}5\cdot10^{-4}} = 4\cdot10^{-3}\ \text{m} = 4\ \text{mm}$.

**Javob.** $\Delta x = 4{,}00\ \text{mm}$.

:::

</SimExample>

### 3-masala. Tölqin uzunligini ölçaş

d = 0,3 mm, L = 1,2 m bölgan tajribada yöllar orasidagi masofa 3 mm çiqdi. Yoruğlik tölqin uzunligi qança?

<SimExample :values='{"lam":750,"d":0.3,"L":1.2}' check="Ekranda interferension manzara: qöşni yoruğ yöllar orasidagi masofa Δx = λL/d = 3,00 mm.">

::: details Yeçimni körsatiş

1. $\Delta x = \dfrac{\lambda L}{d}$ dan $\lambda = \dfrac{\Delta x\, d}{L}$.
2. $\lambda = \dfrac{3\cdot10^{-3} \cdot 3\cdot10^{-4}}{1{,}2} = 7{,}5\cdot10^{-7}\ \text{m} = 750\ \text{nm}$.
3. 750 nm — körinadigan spektrning qizil çeti.

**Javob.** $\lambda = 750\ \text{nm}$ (qizil).

:::

</SimExample>

## Manbalar

Bu mavzu 11-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 3-jild, 3-bob](https://openstax.org/books/university-physics-volume-3/pages/3-1-youngs-double-slit-interference). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
