---
title: "Lorens kuçi"
description: "Magnit maydonga tik uçib kirgan zaryadli zarra aylana böylab harakatlanadi. Zarra turini, tezligini va induksiyani özgartirib, radius va aylaniş davri qanday özgarişini köring. Harakat sekinlaştirib körsatilgan."
topic: "Magnetizm · Zaryadli zarraning magnit maydondagi harakati"
examples: 3
---

# Lorens kuçi

<SimLab id="lorentz" />

## Asosiy ğoya

Qutb yoğdusi Quyoşdan kelgan zaryadli zarralar Yerning magnit maydonida burilib, qutblar yaqinida atmosferaga kirişidan hosil böladi. Eski kineskopli televizorlarda elektron dastasi ham magnit maydon yordamida ekran böylab yurgizilgan.

## Nazariya

Magnit maydon harakatdagi zaryadga Lorens kuçi bilan taʼsir qiladi. Bu kuç tezlikka ham, induksiyaga ham tik, şuning uçun tezlik modulini özgartirmaydi, faqat yönalişini özgartiradi: zarra aylana böylab tekis harakatlanadi.

<div class="eq-block">

<span class="eq-label">Lorens kuçi</span><span class="eq-body">$\displaystyle F = |q|\upsilon B\sin\alpha$</span>

<span class="eq-label">Aylana radiusi</span><span class="eq-body">$\displaystyle |q|\upsilon B = \frac{m\upsilon^2}{r}\;\Rightarrow\; r = \frac{m\upsilon}{|q|B}$</span>

<span class="eq-label">Aylaniş davri</span><span class="eq-body">$\displaystyle T = \frac{2\pi m}{|q|B}$</span>

</div>

Davr tezlikka boğliq emas: tezroq zarra kattaroq aylana çizadi, lekin uni xuddi şunça vaqtda aylanib çiqadi. Siklotron şu xossaga, mass-spektrometr esa radiusning massaga boğliqligiga asoslangan. Musbat va manfiy zarralar qarama-qarşi tomonlarga buriladi.

## Sinab köring

1. Elektronni tanlang: u qaysi tomonga buriladi?
2. Tezlikni oşiring: davr özgaradimi?
3. Proton va alfa-zarra radiuslarini soliştiring.

## Masalalar

### 1-masala. Proton

Proton $10^6$ m/s tezlik bilan induksiyasi 0,1 T bölgan bir jinsli magnit maydonga kuç çiziqlariga tik uçib kirdi. Lorens kuçini, aylana radiusini va aylaniş davrini toping ($m_p = 1{,}673\cdot10^{-27}$ kg, $e = 1{,}602\cdot10^{-19}$ C).

<SimExample :values='{"part":0,"v":1,"B":100}' check="Bir töla aylaniş: radius r = 10,44 sm, davr T = 0,656 μs.">

::: details Yeçimni körsatiş

1. $F = e\upsilon B = 1{,}602\cdot10^{-19} \cdot 10^6 \cdot 0{,}1 = 1{,}602\cdot10^{-14}\ \text{N}$.
2. $r = \dfrac{m_p\upsilon}{eB} = \dfrac{1{,}673\cdot10^{-27} \cdot 10^6}{1{,}602\cdot10^{-19} \cdot 0{,}1} = 0{,}1044\ \text{m}$.
3. $T = \dfrac{2\pi r}{\upsilon} = 6{,}56\cdot10^{-7}\ \text{s}$.

**Javob.** $F \approx 16{,}0\ \text{fN}$, $r \approx 10{,}44\ \text{sm}$, $T \approx 0{,}656\ \mu\text{s}$.

:::

</SimExample>

### 2-masala. Alfa-zarra

Xuddi şunday tezlikdagi alfa-zarra ($m = 6{,}64\cdot10^{-27}$ kg, $q = 2e = 3{,}204\cdot10^{-19}$ C) şu maydonda qanday radiusli aylana çizadi?

<SimExample :values='{"part":1,"v":1,"B":100}' check="Bir töla aylaniş: radius r = 20,72 sm, davr T = 1,302 μs.">

::: details Yeçimni körsatiş

1. $r = \dfrac{m\upsilon}{qB} = \dfrac{6{,}64\cdot10^{-27} \cdot 10^6}{3{,}204\cdot10^{-19} \cdot 0{,}1} = 0{,}2072\ \text{m}$.
2. $T = \dfrac{2\pi m}{qB} = \dfrac{2\pi \cdot 6{,}64\cdot10^{-27}}{3{,}204\cdot10^{-19} \cdot 0{,}1} = 1{,}302\cdot10^{-6}\ \text{s} = 1{,}302\ \mu\text{s}$.

**Javob.** $r \approx 20{,}72\ \text{sm}$, $T \approx 1{,}302\ \mu\text{s}$.

:::

</SimExample>

### 3-masala. Tezlik 2 marta, maydon 2 marta

Proton tezligi $2\cdot10^6$ m/s gaça oşirildi, induksiya esa 0,05 T gaça kamaytirildi. Radius va davr neça marta özgaradi?

<SimExample :values='{"part":0,"v":2,"B":50}' check="Bir töla aylaniş: radius r = 41,77 sm, davr T = 1,312 μs.">

::: details Yeçimni körsatiş

1. $r \sim \dfrac{\upsilon}{B}$: 4 marta ortadi, $r = 41{,}77\ \text{sm}$.
2. $T \sim \dfrac{1}{B}$: 2 marta ortadi, $T = 1{,}312\ \mu\text{s}$.

**Javob.** $r \approx 41{,}77\ \text{sm}$, $T \approx 1{,}312\ \mu\text{s}$.

:::

</SimExample>

## Manbalar

Bu mavzu 11-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 2-jild, 11-bob](https://openstax.org/books/university-physics-volume-2/pages/11-3-motion-of-a-charged-particle-in-a-magnetic-field). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
