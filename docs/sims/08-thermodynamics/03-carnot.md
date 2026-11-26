---
title: "Issiqlik maşinasi va Karno sikli"
description: "Ideal issiqlik maşinasi bir siklda isitkiçdan issiqlik oladi, uning bir qismini işga aylantiradi, qolganini sovutkiçga beradi. Isitkiç va sovutkiç temperaturalarini özgartirib, FIK qanday özgarişini köring."
topic: "Termodinamika · Issiqlik maşinalari"
examples: 3
---

# Issiqlik maşinasi va Karno sikli

<SimLab id="carnot" />

## Asosiy ğoya

Avtomobil dvigateli, issiqlik elektr stansiyasining buğ turbinasi va reaktiv dvigatel — bularning barçasi issiqlik maşinalari. Ular yoqilği içki energiyasini mexanik işga aylantiradi. 1824-yilda fransuz muhandisi Sadi Karno har qanday issiqlik maşinasining FIK faqat isitkiç va sovutkiç temperaturalari bilan çegaralanişini körsatdi.

## Nazariya

Issiqlik maşinasi isitkiçdan $Q_1$ issiqlik oladi, uning bir qismini mexanik iş $A$ ga aylantiradi va qolgan $Q_2$ ni sovutkiçga beradi. Hamma issiqlikni işga aylantirib bölmaydi: bu termodinamikaning ikkinçi qonuni.

<div class="eq-block">

<span class="eq-label">Foydali iş</span><span class="eq-body">$\displaystyle A = Q_1 - Q_2$</span>

<span class="eq-label">FIK</span><span class="eq-body">$\displaystyle \eta = \frac{Q_1 - Q_2}{Q_1}$</span>

<span class="eq-label">Karno sikli (eng katta FIK)</span><span class="eq-body">$\displaystyle \eta_{max} = \frac{T_1 - T_2}{T_1}$</span>

</div>

Karno sikli ikki izotermik va ikki adiabatik jarayondan iborat. p–V diagrammadagi yopiq çiziq ölçagan yuza bir siklda bajarilgan foydali işga teng. Isitkiç qança issiq va sovutkiç qança sovuq bölsa, FIK şunça katta.

## Sinab köring

1. Sovutkiç temperaturasini pasaytiring: diagrammadagi yuza qanday özgaradi?
2. Q₁ ni oşiring: FIK özgaradimi?
3. Qaysi bosqiçlarda gaz iş bajaradi, qaysilarida unga iş bajariladi?

## Masalalar

### 1-masala. Ideal maşina

Ideal issiqlik maşinasining isitkiçi 600 K, sovutkiçi 300 K. Bir siklda isitkiçdan 1000 J issiqlik olinadi. FIK, foydali iş va sovutkiçga berilgan issiqlikni toping.

<SimExample :values='{"T1":600,"T2":300,"Q1":1000}' check="Sikl tugadi: gaz Q₁ = 1000 J oldi, Q₂ = 500 J berdi, foydali iş A = 500 J, η = 50,0 %.">

::: details Yeçimni körsatiş

1. $\eta = 1 - \dfrac{300}{600} = 0{,}5 = 50\ \%$.
2. $A = \eta Q_1 = 500\ \text{J}$, $Q_2 = Q_1 - A = 500\ \text{J}$.

**Javob.** $\eta = 50\ \%$, $A = 500\ \text{J}$, $Q_2 = 500\ \text{J}$.

:::

</SimExample>

### 2-masala. Issiqroq isitkiç

Isitkiç temperaturasi 800 K gaça oşirildi, sovutkiç 300 K, $Q_1 = 1200$ J. FIK va foydali iş qança?

<SimExample :values='{"T1":800,"T2":300,"Q1":1200}' check="Sikl tugadi: gaz Q₁ = 1200 J oldi, Q₂ = 450 J berdi, foydali iş A = 750 J, η = 62,5 %.">

::: details Yeçimni körsatiş

1. $\eta = 1 - \dfrac{300}{800} = 0{,}625$.
2. $A = 0{,}625 \cdot 1200 = 750\ \text{J}$, $Q_2 = 450\ \text{J}$.

**Javob.** $\eta = 62{,}5\ \%$, $A = 750\ \text{J}$.

:::

</SimExample>

### 3-masala. Temperaturalar yaqin bölsa

Isitkiç 500 K, sovutkiç 350 K, $Q_1 = 800$ J. Maşina sovutkiçga qança issiqlik beradi?

<SimExample :values='{"T1":500,"T2":350,"Q1":800}' check="Sikl tugadi: gaz Q₁ = 800 J oldi, Q₂ = 560 J berdi, foydali iş A = 240 J, η = 30,0 %.">

::: details Yeçimni körsatiş

1. $\eta = 1 - \dfrac{350}{500} = 0{,}3$.
2. $A = 240\ \text{J}$, $Q_2 = 800 - 240 = 560\ \text{J}$.

**Javob.** $Q_2 = 560\ \text{J}$, $\eta = 30\ \%$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 2-jild, 4-bob](https://openstax.org/books/university-physics-volume-2/pages/4-5-the-carnot-cycle). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
