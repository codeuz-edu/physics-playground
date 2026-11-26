---
title: "Gaz qonunlari"
description: "Silindrdagi ideal gazni siqing, kengaytiring, isiting. Boyl–Mariott, Gey-Lyussak va Şarl qonunlari p–V diagrammada çiziladi, termodinamikaning birinçi qonuni esa har lahzada tekşiriladi."
topic: "Molekulyar fizika · Izojarayonlar"
examples: 3
---

# Gaz qonunlari

<SimLab id="gas-laws" />

## Asosiy ğoya

Velosiped nasosining teşigini barmoq bilan berkitib, dastasini bossangiz, havo siqilib, qarşilik kuçayadi. Quyoşda qolgan şar kattalaşadi, qişda esa avtomobil şinasidagi bosim pasayadi. Bu hodisalar gaz bosimi, hajmi va temperaturasi orasidagi boğlanişni körsatadi.

XVII–XIX asrlarda Boyl, Mariott, Gey-Lyussak va Şarl bu boğlanişlarni tajribada topişgan. Keyinroq Klapeyron va Mendeleyev ularni bitta holat tenglamasiga birlaştirgan.

## Nazariya

Ideal gaz holati uçta kattalik bilan beriladi: bosim $p$, hajm $V$ va temperatura $T$. Ular Klapeyron–Mendeleyev tenglamasi bilan boğlangan. Agar ulardan biri özgarmas tursa, qolgan ikkitasi orasida oddiy qonun hosil böladi.

<div class="eq-block">

<span class="eq-label">Holat tenglamasi</span><span class="eq-body">$\displaystyle pV = \nu R T$</span>

<span class="eq-label">Izotermik (Boyl–Mariott)</span><span class="eq-body">$\displaystyle pV = \text{const}$</span>

<span class="eq-label">Izobarik (Gey-Lyussak)</span><span class="eq-body">$\displaystyle \frac{V}{T} = \text{const}$</span>

<span class="eq-label">Izoxorik (Şarl)</span><span class="eq-body">$\displaystyle \frac{p}{T} = \text{const}$</span>

<span class="eq-label">Birinçi qonun</span><span class="eq-body">$\displaystyle Q = \Delta U + A,\quad \Delta U = \tfrac{3}{2}\nu R\,\Delta T$</span>

</div>

Bir atomli ideal gazning içki energiyasi faqat temperaturaga boğliq. Izotermik jarayonda $\Delta U = 0$, şuning uçun gaz olgan butun issiqlik işga sarflanadi. Izoxorik jarayonda porşen qimirlamaydi, $A = 0$ va issiqlik faqat içki energiyani oşiradi.

## Sinab köring

1. Izotermik jarayonda hajmni 3 marta oşiring: bosim neça marta kamayadi?
2. Izobarik jarayonda Q, ΔU va A ni soliştiring: qaysi biri katta?
3. Nega izoxorik jarayonda gaz iş bajarmaydi?

## Masalalar

### 1-masala. Izotermik siqiş

1 mol gaz 300 K da 25 L hajmni egallaydi. U özgarmas temperaturada 12,5 L gaça siqildi. Boşlanğiç va oxirgi bosimni, gaz işini toping.

<SimExample :values='{"proc":0,"nu":1,"T0":300,"V0":25,"k":0.5}' check="Jarayon tugadi: p = 199,5 kPa, V = 12,5 L, T = 300 K. Gaz berdi: Q = 1729 J">

::: details Yeçimni körsatiş

1. $p_1 = \dfrac{\nu R T}{V_1} = \dfrac{8{,}314 \cdot 300}{0{,}025} = 99{,}8\ \text{kPa}$; $p_2 = 2p_1 = 199{,}5\ \text{kPa}$.
2. $A = \nu R T \ln\dfrac{V_2}{V_1} = 2494 \cdot \ln 0{,}5 = -1729\ \text{J}$. $\Delta U = 0$, şuning uçun $Q = A$: gaz 1729 J issiqlik beradi.

**Javob.** $p_1 \approx 99{,}8\ \text{kPa}$, $p_2 \approx 199{,}5\ \text{kPa}$, $A \approx -1729\ \text{J}$.

:::

</SimExample>

### 2-masala. Izobarik isitiş

1 mol bir atomli gaz 300 K da 25 L hajmda. U özgarmas bosimda 450 K gaça isitildi. Oxirgi hajmni, gaz işini, içki energiya özgarişini va olingan issiqlikni toping.

<SimExample :values='{"proc":1,"nu":1,"T0":300,"V0":25,"k":1.5}' check="Jarayon tugadi: p = 99,8 kPa, V = 37,5 L, T = 450 K. Gaz oldi: Q = 3118 J, gaz işi A = 1247 J.">

::: details Yeçimni körsatiş

1. $V_2 = V_1 \dfrac{T_2}{T_1} = 37{,}5\ \text{L}$; $p = 99{,}8\ \text{kPa}$.
2. $A = p\,\Delta V = 99\,768 \cdot 0{,}0125 = 1247\ \text{J}$; $\Delta U = \tfrac32 \nu R \Delta T = 1871\ \text{J}$.
3. $Q = \Delta U + A = 3118\ \text{J}$.

**Javob.** $V_2 = 37{,}5\ \text{L}$, $A \approx 1247\ \text{J}$, $\Delta U \approx 1871\ \text{J}$, $Q \approx 3118\ \text{J}$.

:::

</SimExample>

### 3-masala. Izoxorik isitiş

20 L li yopiq idişdagi 2 mol bir atomli gaz 300 K dan 600 K gaça isitildi. Bosim qança böldi va gazga qança issiqlik berildi?

<SimExample :values='{"proc":2,"nu":2,"T0":300,"V0":20,"k":2}' check="Jarayon tugadi: p = 498,8 kPa, V = 20,0 L, T = 600 K. Gaz oldi: Q = 7483 J, gaz işi A = 0 J.">

::: details Yeçimni körsatiş

1. $p_1 = \dfrac{2 \cdot 8{,}314 \cdot 300}{0{,}02} = 249{,}4\ \text{kPa}$; $T$ ikki marta ortdi, $p_2 = 498{,}8\ \text{kPa}$.
2. $A = 0$, $Q = \Delta U = \tfrac32 \cdot 2 \cdot 8{,}314 \cdot 300 = 7483\ \text{J}$.

**Javob.** $p_2 \approx 498{,}8\ \text{kPa}$, $Q \approx 7483\ \text{J}$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 2-jild, 2-bob](https://openstax.org/books/university-physics-volume-2/pages/2-1-molecular-model-of-an-ideal-gas). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
