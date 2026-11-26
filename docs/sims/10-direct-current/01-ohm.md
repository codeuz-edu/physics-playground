---
title: "Om qonuni va rezistorlarni ulaş"
description: "Ikki rezistorni ketma-ket yoki parallel ulang. Tok kuçi, har bir rezistordagi kuçlaniş va tok qanday taqsimlanişini köring; zaryadlar harakati tezligi tok kuçiga mos."
topic: "Özgarmas tok · Zanjir qismi uçun Om qonuni"
examples: 3
---

# Om qonuni va rezistorlarni ulaş

<SimLab id="ohm" />

## Asosiy ğoya

Yangi yil arçasi gulçambaridagi lampoçkalar ketma-ket ulangan: bittasi kuysa, hammasi öçadi. Uydagi lampa va rozetkalar esa parallel ulangan, ular bir-biridan mustaqil işlaydi. Bu farqni Om qonuni tuşuntiradi.

## Nazariya

Zanjir qismidagi tok kuçi şu qismdagi kuçlanişga töğri, qarşilikka teskari proporsional. Ketma-ket ulanganda hamma rezistordan bir xil tok ötadi, kuçlaniş esa ular orasida taqsimlanadi. Parallel ulanganda kuçlaniş bir xil, tok esa tarmoqlarga bölinadi.

<div class="eq-block">

<span class="eq-label">Om qonuni</span><span class="eq-body">$\displaystyle I = \frac{U}{R}$</span>

<span class="eq-label">Ketma-ket</span><span class="eq-body">$\displaystyle R = R_1 + R_2,\quad U = U_1 + U_2$</span>

<span class="eq-label">Parallel</span><span class="eq-body">$\displaystyle \frac{1}{R} = \frac{1}{R_1} + \frac{1}{R_2},\quad I = I_1 + I_2$</span>

<span class="eq-label">Zaryad va iş</span><span class="eq-body">$\displaystyle q = I t,\quad A = U I t$</span>

</div>

Parallel ulangan rezistorlarning umumiy qarşiligi eng kiçik qarşilikdan ham kiçik. Kvartiradagi asboblar parallel ulanadi, şuning uçun har biri bir xil 220 V kuçlanişda işlaydi.

## Sinab köring

1. Ketma-ket ulaşda R₂ ni oşiring: U₁ qanday özgaradi?
2. Parallel ulaşda qaysi tarmoqdan katta tok ötadi?
3. Bir xil rezistorlarni avval ketma-ket, keyin parallel ulang: umumiy tok neça marta özgaradi?

## Masalalar

### 1-masala. Ketma-ket ulaş

4 Ω va 8 Ω li rezistorlar ketma-ket ulanib, 12 V manbaga ulandi. Umumiy qarşilik, tok kuçi va har bir rezistordagi kuçlanişni toping.

<SimExample :values='{"conn":0,"U":12,"R1":4,"R2":8}' check="Ketma-ket: R = 12,0 Ω, I = 1,00 A, U₁ = 4,00 V, U₂ = 8,00 V.">

::: details Yeçimni körsatiş

1. $R = 4 + 8 = 12\ \Omega$, $I = \dfrac{12}{12} = 1\ \text{A}$.
2. $U_1 = 1 \cdot 4 = 4\ \text{V}$, $U_2 = 1 \cdot 8 = 8\ \text{V}$.

**Javob.** $R = 12\ \Omega$, $I = 1\ \text{A}$, $U_1 = 4\ \text{V}$, $U_2 = 8\ \text{V}$.

:::

</SimExample>

### 2-masala. Parallel ulaş

4 Ω va 12 Ω li rezistorlar parallel ulanib, 12 V manbaga ulandi. Umumiy qarşilik, umumiy tok va tarmoqlardagi toklarni toping.

<SimExample :values='{"conn":1,"U":12,"R1":4,"R2":12}' check="Parallel: R = 3,0 Ω, I = 4,00 A, I₁ = 3,00 A, I₂ = 1,00 A.">

::: details Yeçimni körsatiş

1. $R = \dfrac{4 \cdot 12}{4 + 12} = 3\ \Omega$, $I = \dfrac{12}{3} = 4\ \text{A}$.
2. $I_1 = \dfrac{12}{4} = 3\ \text{A}$, $I_2 = \dfrac{12}{12} = 1\ \text{A}$.

**Javob.** $R = 3\ \Omega$, $I = 4\ \text{A}$, $I_1 = 3\ \text{A}$, $I_2 = 1\ \text{A}$.

:::

</SimExample>

### 3-masala. Bir xil rezistorlar

Ikkita 10 Ω li rezistor parallel ulanib, 6 V manbaga ulandi. Umumiy qarşilik va toklarni toping.

<SimExample :values='{"conn":1,"U":6,"R1":10,"R2":10}' check="Parallel: R = 5,0 Ω, I = 1,20 A, I₁ = 0,60 A, I₂ = 0,60 A.">

::: details Yeçimni körsatiş

1. $R = \dfrac{10}{2} = 5\ \Omega$, $I = \dfrac{6}{5} = 1{,}2\ \text{A}$.
2. Tok teng bölinadi: $I_1 = I_2 = 0{,}6\ \text{A}$.

**Javob.** $R = 5\ \Omega$, $I = 1{,}2\ \text{A}$, $I_1 = I_2 = 0{,}6\ \text{A}$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 2-jild, 10-bob](https://openstax.org/books/university-physics-volume-2/pages/10-2-resistors-in-series-and-parallel). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
