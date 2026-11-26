---
title: "Transformator"
description: "Transformator özgaruvçan kuçlanişni öramlar soni nisbatida oşiradi yoki pasaytiradi. Öramlar sonini va yuklamani özgartirib, kuçlaniş, tok va quvvat qanday özgarişini köring."
topic: "Özgaruvçan tok · Transformator va energiya uzatiş"
examples: 3
---

# Transformator

<SimLab id="transformer" />

## Asosiy ğoya

Elektr stansiyasidan çiqqan energiya yuqori kuçlanişli liniyalar orqali uzatiladi, şahar podstansiyalarida 10 kV gaça, keyin uylarimizga kirişda 220 V gaça pasaytiriladi. Telefon zaryadlagiçi içida ham kiçik transformator yoki uning vazifasini bajaruvçi sxema bor.

## Nazariya

Transformator umumiy pölat özakka kiydirilgan ikki çulğamdan iborat. Birlamçi çulğamdagi özgaruvçan tok özakda özgaruvçan magnit oqimini hosil qiladi. Bu oqim ikkilamçi çulğamning har bir öramida bir xil EYK hosil qiladi, şuning uçun kuçlaniş öramlar soniga proporsional. $u_1 = N_1\,\Delta\Phi/\Delta t$ bölgani uçun oqim kuçlanişdan çorak davrga keçikadi: $u_1$ eng katta bölganda oqim nolga teng.

<div class="eq-block">

<span class="eq-label">Transformatsiya koeffitsiyenti</span><span class="eq-body">$\displaystyle k = \frac{U_1}{U_2} = \frac{N_1}{N_2}$</span>

<span class="eq-label">Ideal transformatorda quvvat</span><span class="eq-body">$\displaystyle U_1 I_1 = U_2 I_2\;\Rightarrow\; \frac{I_1}{I_2} = \frac{N_2}{N_1}$</span>

</div>

Kuçlanişni oşirgan transformator tokni xuddi şunça marta kamaytiradi. Elektr energiyasini uzoqqa uzatişda kuçlaniş yuzlab kilovoltgaça oşiriladi: tok kiçik bölgani uçun simlarda kam issiqlik ajraladi ($Q = I^2 R t$).

## Sinab köring

1. N₂ ni N₁ dan katta qiling: transformator qanday işlaydi?
2. Yuklama qarşiligini kamaytiring: birlamçi tok qanday özgaradi?
3. Nega energiya yuqori kuçlanişda uzatiladi?

## Masalalar

### 1-masala. Pasaytiruvçi transformator

Birlamçi çulğamda 1000, ikkilamçida 50 öram bor. Birlamçi çulğam 220 V tarmoqqa ulangan, ikkilamçiga 11 Ω li yuklama ulangan. U₂, I₂, I₁ va quvvatni toping.

<SimExample :values='{"U1":220,"N1":1000,"N2":50,"R":11}' check="U₂ = 11,0 V, I₂ = 1,00 A, I₁ = 0,05 A, k = N₁/N₂ = 20,00; quvvat P₁ = P₂ = 11 W.">

::: details Yeçimni körsatiş

1. $k = 20$, $U_2 = \dfrac{220}{20} = 11\ \text{V}$, $I_2 = \dfrac{11}{11} = 1\ \text{A}$.
2. $I_1 = \dfrac{I_2}{k} = 0{,}05\ \text{A}$, $P = 11\ \text{W}$.

**Javob.** $U_2 = 11\ \text{V}$, $I_2 = 1\ \text{A}$, $I_1 = 0{,}05\ \text{A}$, $P = 11\ \text{W}$.

:::

</SimExample>

### 2-masala. Oşiruvçi transformator

N₁ = 100, N₂ = 1000, U₁ = 220 V, yuklama 2200 Ω. Ikkilamçi kuçlaniş va birlamçi tok qança?

<SimExample :values='{"U1":220,"N1":100,"N2":1000,"R":2200}' check="U₂ = 2200,0 V, I₂ = 1,00 A, I₁ = 10,00 A, k = N₁/N₂ = 0,10; quvvat P₁ = P₂ = 2200 W.">

::: details Yeçimni körsatiş

1. $U_2 = 220 \cdot 10 = 2200\ \text{V}$, $I_2 = 1\ \text{A}$.
2. $I_1 = 10 I_2 = 10\ \text{A}$, $P = 2200\ \text{W}$.

**Javob.** $U_2 = 2200\ \text{V}$, $I_1 = 10\ \text{A}$.

:::

</SimExample>

### 3-masala. 220 V dan 12 V

Birlamçi çulğamda 440 öram bor. 220 V dan 12 V oliş uçun ikkilamçida neçta öram kerak? 6 Ω yuklamada birlamçi tok qança?

<SimExample :values='{"U1":220,"N1":440,"N2":24,"R":6}' check="U₂ = 12,0 V, I₂ = 2,00 A, I₁ = 0,11 A, k = N₁/N₂ = 18,33; quvvat P₁ = P₂ = 24 W.">

::: details Yeçimni körsatiş

1. $N_2 = N_1\dfrac{U_2}{U_1} = 440 \cdot \dfrac{12}{220} = 24$.
2. $I_2 = 2\ \text{A}$, $P = 24\ \text{W}$, $I_1 = \dfrac{24}{220} = 0{,}11\ \text{A}$.

**Javob.** $N_2 = 24$, $I_1 \approx 0{,}11\ \text{A}$.

:::

</SimExample>

## Manbalar

Bu mavzu 11-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 2-jild, 15-bob](https://openstax.org/books/university-physics-volume-2/pages/15-6-transformers). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
