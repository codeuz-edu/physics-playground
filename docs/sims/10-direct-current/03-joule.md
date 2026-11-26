---
title: "Tokning issiqlik taʼsiri"
description: "Elektr çoynak spiralidan tok ötganda issiqlik ajraladi. Kuçlaniş, spiral qarşiligi va suv massasini özgartirib, suv qança vaqtda qaynaşini hisoblang va simulyatsiyada tekşiring."
topic: "Özgarmas tok · Joul–Lens qonuni"
examples: 3
---

# Tokning issiqlik taʼsiri

<SimLab id="joule" />

## Asosiy ğoya

Elektr çoynak, dazmol, isitgiç va lampoçka tokning issiqlik taʼsiridan foydalanadi. Bu qonunni 1841-yilda ingliz olimi Jeyms Joul va undan mustaqil ravişda rus olimi Emiliy Lens tajribada aniqlagan.

## Nazariya

Ötkazgiçdan tok ötganda erkin elektronlar kristall panjara ionlari bilan töqnaşib, energiyasini ularga beradi va ötkazgiç qiziydi. Ajralgan issiqlik tok kuçi kvadratiga, qarşilikka va vaqtga proporsional.

<div class="eq-block">

<span class="eq-label">Joul–Lens qonuni</span><span class="eq-body">$\displaystyle Q = I^2 R t$</span>

<span class="eq-label">Quvvat</span><span class="eq-body">$\displaystyle P = U I = I^2 R = \frac{U^2}{R}$</span>

<span class="eq-label">Suvni isitiş</span><span class="eq-body">$\displaystyle \eta\, P t = c m (t_2 - t_1)$</span>

</div>

Kuçlaniş ikki marta kamaysa, özgarmas qarşilikli isitgiç quvvati tört marta kamayadi. Isitgiçning bir qism issiqligi idişni va havoni isitişga ketadi, buni FIK hisobga oladi.

Bu yerda FIK özgarmas deb olingan. Aslida suv qança issiq bölsa, havoga şunça köp issiqlik ketadi, şuning uçun juda kuçsiz isitgiç suvni umuman qaynata olmasligi mumkin. Şu sababli simulyatsiyada isitgiç quvvati kamida 150 W qilib olingan.

## Sinab köring

1. Spiral qarşiligini kamaytiring: suv tezroq qaynaydimi? Nega?
2. FIK ni 100 % qiling: vaqt qança qisqaradi?
3. Temperatura grafigi nega töğri çiziq?

## Masalalar

### 1-masala. Elektr çoynak

Spirali 40 Ω bölgan çoynak 220 V tarmoqqa ulandi. Undagi 20 °C li 1 kg suv qança vaqtda qaynaydi? FIK 80 %.

<SimExample :values='{"U":220,"R":40,"m":1,"T0":20,"eta":80}' check="Suv 5,79 min da qaynadi. Isitgiç Q = I²Rt = 420,0 kJ">

::: details Yeçimni körsatiş

1. $I = \dfrac{220}{40} = 5{,}5\ \text{A}$, $P = \dfrac{220^2}{40} = 1210\ \text{W}$.
2. Suvga kerak: $Q_s = 4200 \cdot 1 \cdot 80 = 336\ \text{kJ}$; spiral ajratişi kerak: $Q = \dfrac{336}{0{,}8} = 420\ \text{kJ}$.
3. $t = \dfrac{420\,000}{1210} = 347\ \text{s} \approx 5{,}79\ \text{min}$.

**Javob.** $t \approx 5{,}79\ \text{min}$.

:::

</SimExample>

### 2-masala. Ikki litr suv

Xuddi şu çoynakda 2 kg suv qizdirilmoqda, issiqlik yöqotilmaydi deb hisoblang (FIK 100 %). Suv qança vaqtda qaynaydi?

<SimExample :values='{"U":220,"R":40,"m":2,"T0":20,"eta":100}' check="Suv 9,26 min da qaynadi.">

::: details Yeçimni körsatiş

1. $Q = 4200 \cdot 2 \cdot 80 = 672\ \text{kJ}$.
2. $t = \dfrac{672\,000}{1210} = 555\ \text{s} \approx 9{,}26\ \text{min}$.

**Javob.** $t \approx 9{,}26\ \text{min}$.

:::

</SimExample>

### 3-masala. Kuçlaniş ikki marta kam

1-masaladagi çoynak 110 V tarmoqqa ulandi. Suv neça minutda qaynaydi?

<SimExample :values='{"U":110,"R":40,"m":1,"T0":20,"eta":80}' check="Suv 23,14 min da qaynadi.">

::: details Yeçimni körsatiş

1. $P = \dfrac{110^2}{40} = 302{,}5\ \text{W}$: quvvat 4 marta kam.
2. $t = \dfrac{420\,000}{302{,}5} = 1388\ \text{s} \approx 23{,}14\ \text{min}$.

**Javob.** $t \approx 23{,}14\ \text{min}$, yaʼni 4 marta uzoq.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 2-jild, 9-bob](https://openstax.org/books/university-physics-volume-2/pages/9-5-electrical-energy-and-power). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
