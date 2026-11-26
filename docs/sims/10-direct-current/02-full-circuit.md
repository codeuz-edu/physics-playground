---
title: "Töla zanjir uçun Om qonuni"
description: "Haqiqiy manbaning içki qarşiligi bor, şuning uçun yuklama ortganda qisqiçlardagi kuçlaniş kamayadi. Reostatni surib, taşqi quvvat R = r bölganda eng katta bölişini köring."
topic: "Özgarmas tok · EYK va içki qarşilik"
examples: 3
---

# Töla zanjir uçun Om qonuni

<SimLab id="full-circuit" />

## Asosiy ğoya

Avtomobil starteri işlaganda faralar xiralaşadi: starter katta tok oladi, akkumulyatorning içki qarşiligida kuçlaniş tuşadi va lampalarga kamroq kuçlaniş qoladi. Buni töla zanjir uçun Om qonuni tuşuntiradi.

## Nazariya

Manba içida ham tokka qarşilik bor — bu içki qarşilik $r$. EYK manbaning taşqi va içki qismlarida bajariladigan işni hisobga oladi, voltmetr esa faqat taşqi qismdagi kuçlanişni körsatadi.

<div class="eq-block">

<span class="eq-label">Töla zanjir uçun Om qonuni</span><span class="eq-body">$\displaystyle I = \frac{\mathcal{E}}{R + r}$</span>

<span class="eq-label">Qisqiçlardagi kuçlaniş</span><span class="eq-body">$\displaystyle U = IR = \mathcal{E} - Ir$</span>

<span class="eq-label">Taşqi quvvat va FIK</span><span class="eq-body">$\displaystyle P = I^2 R,\quad \eta = \frac{R}{R + r}$</span>

<span class="eq-label">Eng katta quvvat</span><span class="eq-body">$\displaystyle R = r:\quad P_{max} = \frac{\mathcal{E}^2}{4r}$</span>

</div>

Taşqi qarşilik juda kiçik bölsa (qisqa tutaşuv), tok $\mathcal{E}/r$ gaça ortadi va manba qiziydi. Eng katta foydali quvvat $R = r$ da olinadi, lekin bunda FIK atigi 50 %.

## Sinab köring

1. Taşqi qarşilikni oşiring: voltmetr körsatişi EYK ga qanday yaqinlaşadi?
2. Reostat tajribasida quvvat grafigining eng baland nuqtasi qayerda?
3. Nega qisqa tutaşuv xavfli?

## Masalalar

### 1-masala. Oddiy zanjir

EYK 12 V, içki qarşiligi 1 Ω bölgan manbaga 5 Ω li rezistor ulandi. Tok kuçi, qisqiçlardagi kuçlaniş, taşqi quvvat va FIK ni toping.

<SimExample :values='{"mode":0,"E":12,"r":1,"R":5}' check="I = 2,00 A, U = 10,00 V, taşqi quvvat P = 20,00 W, FIK η = 83,3 %.">

::: details Yeçimni körsatiş

1. $I = \dfrac{12}{5 + 1} = 2\ \text{A}$, $U = 2 \cdot 5 = 10\ \text{V}$.
2. $P = 4 \cdot 5 = 20\ \text{W}$, $\eta = \dfrac{5}{6} = 83{,}3\ \%$.

**Javob.** $I = 2\ \text{A}$, $U = 10\ \text{V}$, $P = 20\ \text{W}$, $\eta \approx 83{,}3\ \%$.

:::

</SimExample>

### 2-masala. Qisqa tutaşuvga yaqin

EYK 6 V, içki qarşiligi 0,4 Ω bölgan manba qisqiçlari 0,1 Ω li ötkazgiç bilan tutaştirildi. Tok, qisqiçlardagi kuçlaniş va FIK qança?

<SimExample :values='{"mode":0,"E":6,"r":0.4,"R":0.1}' check="I = 12,00 A, U = 1,20 V, taşqi quvvat P = 14,40 W, FIK η = 20,0 %.">

::: details Yeçimni körsatiş

1. $I = \dfrac{6}{0{,}1 + 0{,}4} = 12\ \text{A}$, $U = 12 \cdot 0{,}1 = 1{,}2\ \text{V}$.
2. $\eta = \dfrac{0{,}1}{0{,}5} = 20\ \%$: energiyaning köp qismi manba içida issiqlikka aylanadi.

**Javob.** $I = 12\ \text{A}$, $U = 1{,}2\ \text{V}$, $\eta = 20\ \%$.

:::

</SimExample>

### 3-masala. Eng katta quvvat

EYK 12 V, içki qarşiligi 2 Ω bölgan manbaga reostat ulangan. Reostat qarşiligi qança bölganda taşqi quvvat eng katta böladi va u nimaga teng?

<SimExample :values='{"mode":1,"E":12,"r":2,"R":10}' check="Reostat suriliş tugadi. Taşqi quvvat R = r = 2,0 Ω da eng katta böldi: P_max = ℰ²/(4r) = 18,00 W.">

::: details Yeçimni körsatiş

1. $R = r = 2\ \Omega$ da $I = \dfrac{12}{4} = 3\ \text{A}$.
2. $P_{max} = 3^2 \cdot 2 = \dfrac{\mathcal{E}^2}{4r} = 18\ \text{W}$.

**Javob.** $R = 2\ \Omega$, $P_{max} = 18\ \text{W}$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 2-jild, 10-bob](https://openstax.org/books/university-physics-volume-2/pages/10-1-electromotive-force). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
