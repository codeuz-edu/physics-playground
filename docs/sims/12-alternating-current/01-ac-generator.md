---
title: "Özgaruvçan tok generatori"
description: "Ramka magnit maydonda aylanganda undan ötadigan oqim davriy özgaradi va sinusoidal EYK hosil böladi. Öramlar sonini, induksiyani, yuzani va çastotani özgartirib, amplituda va effektiv qiymatni köring."
topic: "Özgaruvçan tok · EYK va effektiv qiymatlar"
examples: 3
---

# Özgaruvçan tok generatori

<SimLab id="ac-generator" />

## Asosiy ğoya

Elektr stansiyalarida turbina yoki suv oqimi generator rotorini aylantiradi. Bizning uylarimizga keladigan tok yönalişini sekundiga 100 marta özgartiradi: uning çastotasi 50 Hz.

## Nazariya

Ramka bir jinsli magnit maydonda özgarmas burçak tezlik bilan aylanganda undan ötadigan magnit oqimi kosinus qonuni böyiça özgaradi. Faradey qonuniga köra ramkada sinus qonuni böyiça özgaradigan EYK hosil böladi.

<div class="eq-block">

<span class="eq-label">Magnit oqimi</span><span class="eq-body">$\displaystyle \Phi = BS\cos\omega t$</span>

<span class="eq-label">EYK</span><span class="eq-body">$\displaystyle \mathcal{E} = \mathcal{E}_m\sin\omega t,\quad \mathcal{E}_m = NBS\omega,\quad \omega = 2\pi\nu$</span>

<span class="eq-label">Effektiv qiymat</span><span class="eq-body">$\displaystyle \mathcal{E} = \frac{\mathcal{E}_m}{\sqrt{2}},\quad I = \frac{I_m}{\sqrt{2}}$</span>

<span class="eq-label">Örtaça quvvat</span><span class="eq-body">$\displaystyle P = I U = \frac{U_m I_m}{2}$</span>

</div>

Ramka tekisligi kuç çiziqlariga parallel bölganda oqim nolga teng, lekin u eng tez özgaradi va EYK eng katta. Uydagi tarmoqda kuçlanişning effektiv qiymati 220 V, amplitudasi esa taxminan 311 V.

## Sinab köring

1. Ramka qaysi holatda turganda EYK eng katta?
2. Quvvat grafigi nega hamma vaqt musbat?
3. Öramlar sonini ikki marta oşiring: lampa yorqinroq yonadimi?

## Masalalar

### 1-masala. Generator EYK

100 öramli, yuzasi 100 sm² bölgan ramka induksiyasi 0,2 T bölgan maydonda 2 Hz çastota bilan aylanmoqda. EYK amplitudasini, effektiv qiymatini va 5 Ω li yuklamadagi örtaça quvvatni toping.

<SimExample :values='{"N":100,"B":0.2,"S":100,"nu":2,"R":5}' check="3 davr ötdi: ℰ_m = 2,513 V, effektiv qiymat ℰ = ℰ_m/√2 = 1,777 V, örtaça quvvat P = 0,632 W.">

::: details Yeçimni körsatiş

1. $\omega = 2\pi \cdot 2 = 12{,}57\ \text{rad/s}$; $\mathcal{E}_m = 100 \cdot 0{,}2 \cdot 0{,}01 \cdot 12{,}57 = 2{,}513\ \text{V}$.
2. $\mathcal{E} = \dfrac{2{,}513}{\sqrt2} = 1{,}777\ \text{V}$; $P = \dfrac{\mathcal{E}^2}{R} = 0{,}632\ \text{W}$.

**Javob.** $\mathcal{E}_m \approx 2{,}513\ \text{V}$, $\mathcal{E} \approx 1{,}777\ \text{V}$, $P \approx 0{,}632\ \text{W}$.

:::

</SimExample>

### 2-masala. Ikki marta tez aylantiriş

Ramka 4 Hz çastota bilan aylantirildi. EYK amplitudasi va quvvat neça marta özgaradi?

<SimExample :values='{"N":100,"B":0.2,"S":100,"nu":4,"R":5}' check="3 davr ötdi: ℰ_m = 5,027 V, effektiv qiymat ℰ = ℰ_m/√2 = 3,554 V, örtaça quvvat P = 2,527 W.">

::: details Yeçimni körsatiş

1. $\mathcal{E}_m \sim \omega$: 2 marta ortadi, $\mathcal{E}_m = 5{,}027\ \text{V}$.
2. $P \sim \mathcal{E}^2$: 4 marta ortadi, $P = 2{,}527\ \text{W}$.

**Javob.** Amplituda 2 marta, quvvat 4 marta ortadi.

:::

</SimExample>

### 3-masala. Katta ramka

200 öramli, yuzasi 200 sm² ramka 0,5 T maydonda 1 Hz çastota bilan aylanmoqda, yuklama 10 Ω. EYK ning effektiv qiymati va quvvat qança?

<SimExample :values='{"N":200,"B":0.5,"S":200,"nu":1,"R":10}' check="3 davr ötdi: ℰ_m = 12,566 V, effektiv qiymat ℰ = ℰ_m/√2 = 8,886 V, örtaça quvvat P = 7,896 W.">

::: details Yeçimni körsatiş

1. $\mathcal{E}_m = 200 \cdot 0{,}5 \cdot 0{,}02 \cdot 6{,}283 = 12{,}566\ \text{V}$.
2. $\mathcal{E} = 8{,}886\ \text{V}$, $P = \dfrac{8{,}886^2}{10} = 7{,}896\ \text{W}$.

**Javob.** $\mathcal{E} \approx 8{,}886\ \text{V}$, $P \approx 7{,}896\ \text{W}$.

:::

</SimExample>

## Manbalar

Bu mavzu 11-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 2-jild, 13-bob](https://openstax.org/books/university-physics-volume-2/pages/13-6-electric-generators-and-back-emf). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
