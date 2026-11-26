---
title: "Agregat holat özgarişlari"
description: "Muzni özgarmas quvvatli isitgiçda qizdiring: u isiydi, eriydi, suv qaynaydi va buğga aylanadi. Grafikdagi gorizontal qismlarda issiqlik temperaturani emas, agregat holatni özgartiradi."
topic: "Termodinamika · Eriş va buğlaniş"
examples: 3
---

# Agregat holat özgarişlari

<SimLab id="phase" />

## Asosiy ğoya

Muzlatkiçdan olingan muz avval xona havosida isiydi, keyin eriydi; çoynakdagi suv qaynab, buğga aylanadi. Modda qattiq, suyuq va gaz holatlardan biriga ötganda issiqlik yutiladi yoki ajraladi, temperatura esa özgarmaydi.

## Nazariya

Isitgiç har minutda bir xil issiqlik beradi. Muz yoki suv isiganda bu issiqlik temperaturani oşiradi. Eriş va qaynaş paytida esa temperatura özgarmaydi: issiqlik molekulalar orasidagi boğlanişlarni uziş uçun sarflanadi.

<div class="eq-block">

<span class="eq-label">Isitiş</span><span class="eq-body">$\displaystyle Q = c m \Delta t$</span>

<span class="eq-label">Eriş</span><span class="eq-body">$\displaystyle Q = \lambda m,\quad \lambda = 330\ \text{kJ/kg}$</span>

<span class="eq-label">Buğlaniş</span><span class="eq-body">$\displaystyle Q = L m,\quad L = 2{,}3\ \text{MJ/kg}$</span>

<span class="eq-label">Isitgiç</span><span class="eq-body">$\displaystyle Q = P t$</span>

</div>

Grafikdagi eng uzun gorizontal qism qaynaşga töğri keladi: suvni buğga aylantiriş uçun uni 0 °C dan 100 °C gaça isitişdan taxminan beş yarim marta köp issiqlik kerak. Muzning soliştirma issiqlik siğimi suvnikidan ikki marta kiçik, şuning uçun muz tezroq isiydi.

## Sinab köring

1. Grafikdagi qaysi gorizontal qism uzunroq va nega?
2. Quvvatni ikki marta oşiring: grafik şakli özgaradimi?
3. Muzning boşlanğiç temperaturasini 0 °C qiling: birinçi qism nima böladi?

## Masalalar

### 1-masala. Muzdan buğgaça

−20 °C li 0,5 kg muzni töla buğga aylantiriş uçun qança issiqlik kerak? Quvvati 1 kW bölgan isitgiç buni qança vaqtda bajaradi?

<SimExample :values='{"m":0.5,"P":1,"T0":-20}' check="Hamma suv buğga aylandi: jami Q = 1546 kJ, vaqt 25,77 min.">

::: details Yeçimni körsatiş

1. $Q_1 = 2100 \cdot 0{,}5 \cdot 20 = 21\ \text{kJ}$, $Q_2 = 330\,000 \cdot 0{,}5 = 165\ \text{kJ}$.
2. $Q_3 = 4200 \cdot 0{,}5 \cdot 100 = 210\ \text{kJ}$, $Q_4 = 2{,}3\cdot10^6 \cdot 0{,}5 = 1150\ \text{kJ}$.
3. $Q = 1546\ \text{kJ}$, $t = \dfrac{Q}{P} = 1546\ \text{s} \approx 25{,}77\ \text{min}$.

**Javob.** $Q = 1546\ \text{kJ}$, $t \approx 25{,}77\ \text{min}$.

:::

</SimExample>

### 2-masala. Qaçon erib bitadi?

−10 °C li 1 kg muz 2 kW li isitgiçga qöyildi. Muz neça minutda töla eriydi? Hamma suv neça minutda buğlanadi?

<SimExample :values='{"m":1,"P":2,"T0":-10}' check="Hamma suv buğga aylandi: jami Q = 3071 kJ, vaqt 25,59 min.">

::: details Yeçimni körsatiş

1. Erib bitgunça: $Q = 2100 \cdot 10 + 330\,000 = 351\ \text{kJ}$, $t = 175{,}5\ \text{s} \approx 2{,}93\ \text{min}$.
2. Jami: $Q = 351 + 420 + 2300 = 3071\ \text{kJ}$, $t = 1535{,}5\ \text{s} \approx 25{,}59\ \text{min}$.

**Javob.** $\approx 2{,}93\ \text{min}$ va $\approx 25{,}59\ \text{min}$.

:::

</SimExample>

### 3-masala. Qaynaş qança davom etadi?

0 °C li 0,2 kg muz 1,5 kW li isitgiçda qizdirilmoqda. Qaynaş neça minut davom etadi? Jarayon jami neça minut?

<SimExample :values='{"m":0.2,"P":1.5,"T0":0}' check="Hamma suv buğga aylandi: jami Q = 610 kJ, vaqt 6,78 min.">

::: details Yeçimni körsatiş

1. Qaynaş: $t = \dfrac{Lm}{P} = \dfrac{460\,000}{1500} = 306{,}7\ \text{s} \approx 5{,}11\ \text{min}$.
2. Jami: $Q = 66 + 84 + 460 = 610\ \text{kJ}$, $t = 406{,}7\ \text{s} \approx 6{,}78\ \text{min}$.

**Javob.** $\approx 5{,}11\ \text{min}$, jami $\approx 6{,}78\ \text{min}$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 2-jild, 1-bob](https://openstax.org/books/university-physics-volume-2/pages/1-5-phase-changes). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
