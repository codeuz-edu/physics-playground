---
title: "Suyuqlikning bosimi"
description: "Manometr datçigini suyuqlikka sekin tuşiring. Bosim çuqurlikka töğri proporsional ravişda ortadi va hamma tomonga bir xil taʼsir qiladi. Suyuqlikni almaştirib, ziçlik bosimni qanday özgartirişini köring."
topic: "Suyuqliklar mexanikasi · Gidrostatik bosim"
examples: 3
---

# Suyuqlikning bosimi

<SimLab id="fluid-pressure" />

## Asosiy ğoya

Suvga şönğiganda quloqlarimiz bosimni darhol sezadi: bir neça metr çuqurlikda ham bosim sezilarli ortadi. Şuning uçun suv omborlarining töğonlari pastga tomon qalinlaşib boradi, okean tubiga tuşadigan batiskaflar esa qalin pölatdan yasaladi.

Suyuqlik bosimi manometr bilan ölçanadi. Uning datçigi — yupqa membrana: suyuqlik uni qança kuçli bosayotganini körsatadi. Datçikni qaysi tomonga burmaylik, bir xil çuqurlikda körsatiş bir xil böladi.

<div class="lesson-photos">

<SimPhoto name="charvak-dam" :width="1200" :height="900" alt="Toşkent viloyatidagi Çorvoq suv omborining töğoni" caption="Çorvoq suv ombori töğoni (Toşkent viloyati). Suv bosimi çuqurlik bilan ortib boradi, şuning uçun töğonning pastki qismi eng katta yuklamani köradi va töğon pastga qarab kengayib quriladi." credit="Surat: Man77, &lt;a href=&quot;https://creativecommons.org/licenses/by-sa/3.0&quot;&gt;CC BY-SA 3.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Chorvoq_Staumauer.JPG&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Suyuqlik öz oğirligi bilan pastdagi qatlamlarni va idiş tubini bosadi. Çuqurlik qança katta bölsa, ustidagi suyuqlik ustuni şunça baland va bosim şunça katta. Bosim — sirtga tik taʼsir etuvçi kuçning şu sirt yuzasiga nisbati.

<div class="eq-block">

<span class="eq-label">Bosim</span><span class="eq-body">$\displaystyle p = \frac{F}{S}$</span>

<span class="eq-label">Gidrostatik bosim</span><span class="eq-body">$\displaystyle p_h = \rho g h$</span>

<span class="eq-label">Çuqurlikdagi töla bosim</span><span class="eq-body">$\displaystyle p = p_0 + \rho g h$</span>

</div>

Bosimning birligi — paskal (1 Pa = 1 N/m²). Bir xil çuqurlikdagi hamma nuqtalarda bosim bir xil va u hamma yönalişda bir xil taʼsir qiladi. Gidrostatik bosim idişning şakliga va kengligiga boğliq emas: tor naydagi suv ham, keng hovuzdagi suv ham bir xil çuqurlikda bir xil bosim beradi. Bu *gidrostatik paradoks* deyiladi.

## Sinab köring

1. Çuqurlikni ikki marta oşiring. Gidrostatik bosim qança özgaradi? Töla bosim-çi?
2. Suvni kerosin va simob bilan almaştiring. Bir xil çuqurlikda bosim qança marta farq qiladi?
3. Atmosfera bosimini nolga tuşiring. “Bosim” grafigidagi qaysi çiziq özgarmay qoladi?

## Masalalar

### 1-masala. Havza tubidagi bosim

Çuqurligi 10 m bölgan suv havzasi tubidagi gidrostatik bosimni va töla bosimni toping. Atmosfera bosimi 101,3 kPa.

<SimExample :values='{"liq":0,"H":10,"u":1,"p0":101.3,"g":9.81}' check="Datçik idiş tubiga, 10,00 m çuqurlikka yetdi. Gidrostatik bosim ρgh = 98,1 kPa, atmosfera bosimi bilan birga p = 199,4 kPa.">

::: details Yeçimni körsatiş

1. $p_h = \rho g h = 1000 \cdot 9{,}81 \cdot 10 = 98\,100\ \text{Pa} = 98{,}1\ \text{kPa}$.
2. $p = p_0 + \rho g h = 101{,}3 + 98{,}1 = 199{,}4\ \text{kPa}$: har 10 m suv bosimni taxminan bir atmosferaga oşiradi.

**Javob.** $p_h = 98{,}1\ \text{kPa}$, $p = 199{,}4\ \text{kPa}$ — atmosfera bosimidan qariyb ikki marta katta.

:::

</SimExample>

### 2-masala. Kerosinli bak

Bakka 2,5 m balandlikda kerosin quyilgan. Kerosin bak tubiga qança bosim beradi? Xuddi şunça suv qança bosim berar edi?

<SimExample :values='{"liq":2,"H":2.5,"u":0.5,"p0":101.3,"g":9.81}' check="Datçik idiş tubiga, 2,50 m çuqurlikka yetdi. Gidrostatik bosim ρgh = 19,6 kPa, atmosfera bosimi bilan birga p = 120,9 kPa.">

::: details Yeçimni körsatiş

1. $p_h = \rho g h = 800 \cdot 9{,}81 \cdot 2{,}5 = 19\,620\ \text{Pa} \approx 19{,}6\ \text{kPa}$.
2. Suv uçun $1000 \cdot 9{,}81 \cdot 2{,}5 \approx 24{,}5\ \text{kPa}$: kerosinning ziçligi 0,8 marta kiçik, bosimi ham 0,8 marta kiçik.
3. Atmosfera bosimi bilan: $p = 101{,}3 + 19{,}6 = 120{,}9\ \text{kPa}$.

**Javob.** $p_h \approx 19{,}6\ \text{kPa}$, töla bosim $120{,}9\ \text{kPa}$.

:::

</SimExample>

### 3-masala. 760 mm simob ustuni

Balandligi 760 mm bölgan simob ustuni idiş tubiga qança bosim beradi? Uni normal atmosfera bosimi bilan soliştiring.

<SimExample :values='{"liq":4,"H":0.76,"u":0.1,"p0":101.3,"g":9.81}' check="Datçik idiş tubiga, 0,76 m çuqurlikka yetdi. Gidrostatik bosim ρgh = 101,4 kPa, atmosfera bosimi bilan birga p = 202,7 kPa.">

::: details Yeçimni körsatiş

1. $p_h = \rho g h = 13\,600 \cdot 9{,}81 \cdot 0{,}76 = 101\,396\ \text{Pa} \approx 101{,}4\ \text{kPa}$.
2. Bu normal atmosfera bosimiga teng. Torriçelli tajribasida havo bosimi aynan şunday simob ustunini uşlab turadi, şuning uçun 760 mm sim. ust. = 1 atm deb olinadi.

**Javob.** $p_h \approx 101{,}4\ \text{kPa}$ — normal atmosfera bosimiga teng.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 14-bob](https://openstax.org/books/university-physics-volume-1/pages/14-1-fluids-density-and-pressure). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
