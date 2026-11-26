---
title: "Elektr maydon va kuç çiziqlari"
description: "Ikki zaryadning maydoni kuç çiziqlari bilan körsatilgan. Boşlanğiç nuqtani tanlang: kuzatuvçi nuqta şu nuqtadan ötgan kuç çizigi böylab yuradi, panelda esa yöldagi kuçlanganlik va potensial körinadi. Tinç holatdan qöyib yuborilgan haqiqiy zaryad yölini ham köriş mumkin."
topic: "Elektrostatika · Maydon kuçlanganligi va potensial"
examples: 3
---

# Elektr maydon va kuç çiziqlari

<SimLab id="efield" />

## Asosiy ğoya

Zaryadlar bir-biriga tegmasdan taʼsir qiladi. Maykl Faradey bu taʼsirni zaryadlar atrofidagi maydon orqali tuşuntirdi va uni körinadigan qiliş uçun kuç çiziqlarini taklif qildi. Moyga sepilgan mayda zarralar kuçli zaryad atrofida xuddi şu çiziqlar böylab tiziladi.

## Nazariya

Zaryad atrofida elektr maydoni bor: boşqa zaryad bu maydonga kirsa, unga kuç taʼsir qiladi. Maydonning kuç tavsifi — kuçlanganlik $\vec E$, energetik tavsifi — potensial $\varphi$. Bir neçta zaryad maydonlari vektor kabi qöşiladi.

<div class="eq-block">

<span class="eq-label">Kuçlanganlik</span><span class="eq-body">$\displaystyle \vec E = \frac{\vec F}{q}$</span>

<span class="eq-label">Nuqtaviy zaryad</span><span class="eq-body">$\displaystyle E = k\frac{|q|}{r^2},\quad \varphi = k\frac{q}{r}$</span>

<span class="eq-label">Superpozitsiya</span><span class="eq-body">$\displaystyle \vec E = \vec E_1 + \vec E_2,\quad \varphi = \varphi_1 + \varphi_2$</span>

</div>

Kuç çiziqlari musbat zaryaddan boşlanib, manfiy zaryadda tugaydi; zaryaddagi çiziqlar soni uning moduliga proporsional. Çiziqlar ziç joyda maydon kuçli. Har bir nuqtada $\vec E$ kuç çizigiga urinma böylab yönalgan. Şu urinma böylab musbat zaryadga taʼsir etuvçi kuç va tezlaniş yönalgan, tezlik emas: tinç holatdan qöyib yuborilgan zaryad egri çiziqdan çetga çiqib ketadi. Zaryad kuç çizigi böylab faqat juda sekin harakatlansa (masalan, qovuşqoq muhitda) yuradi.

Rasmdagi nuqta zaryad emas, kuç çizigini kuzatuvçi nuqta. “Erkin zaryad yöli” belgisi tinç holatdan qöyib yuborilgan haqiqiy musbat zaryad yölini ($m\vec a = q\vec E$) körsatadi.

## Sinab köring

1. Ikkala zaryadni ham manfiy qiling: kuç çiziqlari yönalişi qanday özgaradi?
2. Dipolda “Erkin zaryad yöli”ni yoqing: tinç holatdan qöyib yuborilgan zaryad kuç çizigi böylab boradimi?
3. Bir xil zaryadlar orasida maydon nolga teng nuqtani toping.

## Masalalar

### 1-masala. Dipol örtasida

2 μC va −2 μC zaryadlar orasidagi masofa 40 sm. Ular örtasidagi nuqtada maydon kuçlanganligi va potensialni toping.

<SimExample :values='{"q1":2,"q2":-2,"d":40,"x0":0,"y0":0}' check="Boşlanğiç nuqtada E = 900,0 kN/C, φ = 0,0 kV.">

::: details Yeçimni körsatiş

1. Har bir zaryaddan 20 sm: $E_1 = E_2 = 9\cdot10^9 \cdot \dfrac{2\cdot10^{-6}}{0{,}2^2} = 450\ \text{kN/C}$, ikkalasi ham manfiy zaryad tomon yönalgan.
2. $E = 900\ \text{kN/C}$; $\varphi = k\dfrac{q}{r} - k\dfrac{q}{r} = 0$.

**Javob.** $E = 900\ \text{kN/C}$, $\varphi = 0$.

:::

</SimExample>

### 2-masala. Bir xil zaryadlar

Endi ikkala zaryad ham 2 μC. Örtadagi nuqtada $E$ va $\varphi$ qança?

<SimExample :values='{"q1":2,"q2":2,"d":40,"x0":0,"y0":0}' check="Boşlanğiç nuqtada E = 0,0 kN/C, φ = 180,0 kV.">

::: details Yeçimni körsatiş

1. Kuçlanganliklar teng va qarama-qarşi: $E = 0$.
2. Potensiallar qöşiladi: $\varphi = 2 \cdot 9\cdot10^9 \cdot \dfrac{2\cdot10^{-6}}{0{,}2} = 180\ \text{kV}$.

**Javob.** $E = 0$, $\varphi = 180\ \text{kV}$.

:::

</SimExample>

### 3-masala. Yakka zaryad

3 μC zaryaddan 30 sm uzoqlikdagi nuqtada maydon kuçlanganligi va potensial qança?

<SimExample :values='{"q1":3,"q2":0,"d":40,"x0":10,"y0":0}' check="Boşlanğiç nuqtada E = 300,0 kN/C, φ = 90,0 kV.">

::: details Yeçimni körsatiş

1. $E = 9\cdot10^9 \cdot \dfrac{3\cdot10^{-6}}{0{,}3^2} = 300\ \text{kN/C}$.
2. $\varphi = 9\cdot10^9 \cdot \dfrac{3\cdot10^{-6}}{0{,}3} = 90\ \text{kV}$.

**Javob.** $E = 300\ \text{kN/C}$, $\varphi = 90\ \text{kV}$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 2-jild, 5-bob](https://openstax.org/books/university-physics-volume-2/pages/5-6-electric-field-lines). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
