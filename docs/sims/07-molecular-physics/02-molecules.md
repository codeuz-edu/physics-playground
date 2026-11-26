---
title: "Molekulalar tezligi va gaz bosimi"
description: "Gaz molekulalari tartibsiz harakatda va idiş devorlariga urilib bosim hosil qiladi. Gaz turini va temperaturani tanlang: örtaça tezlik, kinetik energiya va bosim qanday özgarişini kuzating."
topic: "Molekulyar fizika · MKN asoslari"
examples: 3
---

# Molekulalar tezligi va gaz bosimi

<SimLab id="molecules" />

## Asosiy ğoya

Xonadagi havo molekulalari sekundiga yarim kilometrga yaqin tezlikda uçadi, lekin ular bir-biri bilan doimo töqnaşgani uçun hid xona böylab sekin tarqaladi. Har bir sekundda devorning har kvadrat santimetriga taxminan 3·10²³ ta molekula uriladi va şu zarbalar biz sezadigan atmosfera bosimini hosil qiladi.

## Nazariya

Molekulyar-kinetik nazariyaga köra gaz bosimi molekulalarning idiş devorlariga urilişidan hosil böladi. Temperatura esa molekulalar ilgarilanma harakatining örtaça kinetik energiyasi ölçovi.

<div class="eq-block">

<span class="eq-label">MKN asosiy tenglamasi</span><span class="eq-body">$\displaystyle p = \frac{1}{3} m_0 n \overline{\upsilon^2} = \frac{2}{3} n \bar E$</span>

<span class="eq-label">Örtaça kinetik energiya</span><span class="eq-body">$\displaystyle \bar E = \frac{3}{2} k T$</span>

<span class="eq-label">Bosim va temperatura</span><span class="eq-body">$\displaystyle p = n k T$</span>

<span class="eq-label">Örtaça kvadratik tezlik</span><span class="eq-body">$\displaystyle \upsilon = \sqrt{\frac{3RT}{M}}$</span>

</div>

Bir xil temperaturada hamma gaz molekulalarining örtaça kinetik energiyasi bir xil, lekin yengil molekulalar tezroq harakatlanadi. Molekulalar tezligi har xil: rasmda ular turli uzunlikdagi yöllarni bosib ötadi, öngdagi grafik esa tezliklar taqsimotini (Maksvell egri çizigini) körsatadi. Temperatura oşganda egri çiziq öngga siljiydi va yassilanadi: tez molekulalar köpayadi.

Gazni juda sovutsak, u suyuqlikka aylanadi (karbonat angidrid esa quruq muzga): normal bosimda azot 77 K da, kislorod 90 K da, vodorod 20 K da, CO₂ 195 K da. Bundan past temperaturada ideal gaz formulalari yaramaydi, şuning uçun simulyatsiya şu nuqtada töxtaydi.

## Sinab köring

1. Temperaturani 4 marta oşiring: tezlik neça marta ortadi?
2. Qaysi gaz molekulalari eng sekin harakatlanadi va nega?
3. Konsentratsiyani ikki marta kamaytiring: bosim qanday özgaradi?
4. Azotni 200 K dan sovuting: simulyatsiya qayerda töxtaydi va nega?

## Masalalar

### 1-masala. Havodagi azot molekulalari

300 K temperaturada azot molekulalarining örtaça kvadratik tezligini va örtaça kinetik energiyasini toping ($M = 0{,}028$ kg/mol).

<SimExample :values='{"gas":2,"T0":300,"rate":0,"n":2.5}' check="T = 300 K da N₂ molekulalarining örtaça kvadratik tezligi 517 m/s, örtaça kinetik energiyasi 6,21·10⁻²¹ J">

::: details Yeçimni körsatiş

1. $\upsilon = \sqrt{\dfrac{3 \cdot 8{,}314 \cdot 300}{0{,}028}} = 517\ \text{m/s}$.
2. $\bar E = \tfrac32 kT = 1{,}5 \cdot 1{,}38\cdot10^{-23} \cdot 300 = 6{,}21\cdot10^{-21}\ \text{J}$.

**Javob.** $\upsilon \approx 517\ \text{m/s}$, $\bar E \approx 6{,}21\cdot10^{-21}\ \text{J}$.

:::

</SimExample>

### 2-masala. Vodorod qança tez?

Xuddi şu 300 K da vodorod molekulalarining örtaça kvadratik tezligi qança? U azotnikidan neça marta katta?

<SimExample :values='{"gas":0,"T0":300,"rate":0,"n":2.5}' check="T = 300 K da H₂ molekulalarining örtaça kvadratik tezligi 1934 m/s">

::: details Yeçimni körsatiş

1. $\upsilon = \sqrt{\dfrac{3 \cdot 8{,}314 \cdot 300}{0{,}002}} = 1934\ \text{m/s}$.
2. $\dfrac{\upsilon_{H_2}}{\upsilon_{N_2}} = \sqrt{\dfrac{28}{2}} = \sqrt{14} \approx 3{,}74$.

**Javob.** $\upsilon \approx 1934\ \text{m/s}$, taxminan 3,74 marta katta.

:::

</SimExample>

### 3-masala. Isitilgan gazning bosimi

Azot molekulalarining konsentratsiyasi $2{,}5\cdot10^{25}\ \text{m}^{-3}$. 300 K va 600 K da bosim qança? 600 K da molekulalar tezligi qança böladi?

<SimExample :values='{"gas":2,"T0":300,"rate":30,"n":2.5}' check="T = 600 K da N₂ molekulalarining örtaça kvadratik tezligi 731 m/s, örtaça kinetik energiyasi 12,43·10⁻²¹ J, bosim 207,1 kPa.">

::: details Yeçimni körsatiş

1. $p_1 = nkT = 2{,}5\cdot10^{25} \cdot 1{,}380649\cdot10^{-23} \cdot 300 \approx 103{,}549\ \text{kPa}$; $p_2 = 2p_1 \approx 207{,}1\ \text{kPa}$.
2. $\upsilon_2 = \upsilon_1\sqrt{2} = 517 \cdot 1{,}414 = 731\ \text{m/s}$.

**Javob.** $p_1 \approx 103{,}5\ \text{kPa}$, $p_2 \approx 207{,}1\ \text{kPa}$, $\upsilon_2 \approx 731\ \text{m/s}$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 2-jild, 2-bob](https://openstax.org/books/university-physics-volume-2/pages/2-2-pressure-temperature-and-rms-speed). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
