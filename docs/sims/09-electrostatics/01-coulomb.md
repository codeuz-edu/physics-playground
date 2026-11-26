---
title: "Kulon qonuni"
description: "Bir xil işorali zaryadlar itariladi, har xil işoralilar tortiladi. Zaryadlar va masofani tanlang: ikkinçi şarça qanday tezlanişini va kuç masofa kvadratiga teskari proporsional kamayişini kuzating."
topic: "Elektrostatika · Zaryadlarning özaro taʼsiri"
examples: 3
---

# Kulon qonuni

<SimLab id="coulomb" />

## Asosiy ğoya

Soçga işqalangan şar qoğoz parçalarini tortadi, quruq havoda kiyim yeçganda çirsillaş eşitiladi. Bular elektr zaryadlarining özaro taʼsiri. 1785-yilda Şarl Kulon burama tarozi yordamida bu kuç masofaga qanday boğliqligini aniq ölçadi.

## Nazariya

Ikki nuqtaviy zaryadning özaro taʼsir kuçi zaryadlar köpaytmasiga töğri, ular orasidagi masofa kvadratiga teskari proporsional. Kuç zaryadlarni tutaştiruvçi töğri çiziq böylab yönalgan.

<div class="eq-block">

<span class="eq-label">Kulon qonuni</span><span class="eq-body">$\displaystyle F = k\frac{|q_1||q_2|}{r^2},\quad k = 9\cdot10^9\ \frac{\text{N}\cdot\text{m}^2}{\text{C}^2}$</span>

<span class="eq-label">Özaro taʼsir energiyasi</span><span class="eq-body">$\displaystyle W = k\frac{q_1 q_2}{r}$</span>

<span class="eq-label">Energiyaning saqlanişi</span><span class="eq-body">$\displaystyle \frac{m\upsilon^2}{2} = k q_1 q_2\left(\frac{1}{r_0} - \frac{1}{r}\right)$</span>

</div>

Nyutonning uçinçi qonuniga köra ikkala şarçaga teng va qarama-qarşi kuçlar taʼsir qiladi. Masofa ikki marta ortsa, kuç tört marta kamayadi, şuning uçun şarça avval tez tezlanadi, keyin deyarli tekis harakatlanadi.

## Sinab köring

1. Ikkinçi zaryad işorasini almaştiring: nima özgaradi?
2. Massani oşiring: oxirgi tezlik qanday özgaradi?
3. Grafikda kuç nega boşida juda tez kamayadi?

## Masalalar

### 1-masala. Itariliş

Har biri 2 μC zaryadli ikki şarça 10 sm masofada turibdi. Ular orasidagi kuçni toping. Massasi 50 g bölgan ikkinçi şarça qöyib yuborilsa, 60 sm masofada uning tezligi qança böladi?

<SimExample :values='{"q1":2,"q2":2,"m":50,"r0":10}' check="Masofa 60 sm böldi: ikkinçi şarça tezligi υ = 3,46 m/s, kuç F = 0,100 N">

::: details Yeçimni körsatiş

1. $F = 9\cdot10^9 \cdot \dfrac{(2\cdot10^{-6})^2}{0{,}1^2} = 3{,}6\ \text{N}$.
2. $\upsilon = \sqrt{\dfrac{2kq_1q_2}{m}\left(\dfrac{1}{r_0} - \dfrac{1}{r}\right)} = \sqrt{\dfrac{2 \cdot 0{,}036}{0{,}05}\left(10 - 1{,}667\right)} = 3{,}46\ \text{m/s}$.

**Javob.** $F = 3{,}6\ \text{N}$, $\upsilon \approx 3{,}46\ \text{m/s}$.

:::

</SimExample>

### 2-masala. Tortiliş

2 μC va −2 μC zaryadli şarçalar 30 sm masofada. Ikkinçi şarça (50 g) qöyib yuborildi. Boşlanğiç kuç qança? Şarçalar markazlari orasidagi masofa 3 sm bölganda (ular urilganda) tezlik qança?

<SimExample :values='{"q1":2,"q2":-2,"m":50,"r0":30}' check="Şarçalar urildi: urilişdan oldin tezlik υ = 6,57 m/s.">

::: details Yeçimni körsatiş

1. $F_0 = \dfrac{0{,}036}{0{,}3^2} = 0{,}4\ \text{N}$.
2. $\upsilon = \sqrt{\dfrac{2 \cdot 0{,}036}{0{,}05}\left(\dfrac{1}{0{,}03} - \dfrac{1}{0{,}3}\right)} = \sqrt{1{,}44 \cdot 30} = 6{,}57\ \text{m/s}$.

**Javob.** $F_0 = 0{,}4\ \text{N}$, $\upsilon \approx 6{,}57\ \text{m/s}$.

:::

</SimExample>

### 3-masala. Masofa 3 marta katta

1-masaladagi şarçalar 30 sm masofadan qöyib yuborildi. Kuç neça marta kiçik? 60 sm da tezlik qança böladi?

<SimExample :values='{"q1":2,"q2":2,"m":50,"r0":30}' check="Masofa 60 sm böldi: ikkinçi şarça tezligi υ = 1,55 m/s">

::: details Yeçimni körsatiş

1. Masofa 3 marta katta, kuç $3^2 = 9$ marta kiçik: $F_0 = 0{,}4\ \text{N}$.
2. $\upsilon = \sqrt{1{,}44\left(3{,}333 - 1{,}667\right)} = 1{,}55\ \text{m/s}$.

**Javob.** 9 marta kiçik, $\upsilon \approx 1{,}55\ \text{m/s}$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 2-jild, 5-bob](https://openstax.org/books/university-physics-volume-2/pages/5-3-coulombs-law). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
