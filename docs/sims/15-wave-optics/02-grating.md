---
title: "Difraksion panjara"
description: "Köp sonli ingiçka tirqişlardan iborat panjara yoruğlikni aniq burçaklarga yönaltiradi. Panjara ziçligini va tölqin uzunligini özgartirib, maksimumlar burçagi va soni qanday özgarişini köring."
topic: "Tölqin optikasi · Yoruğlik difraksiyasi"
examples: 3
---

# Difraksion panjara

<SimLab id="grating" />

## Asosiy ğoya

Kompakt disk yoki DVD sirtiga qarasak, kamalak ranglarini köramiz: uning izlari difraksion panjara kabi işlaydi. Astronomlar yulduz yoruğligini panjara orqali spektrga ajratib, yulduz tarkibini aniqlaydi.

## Nazariya

Panjaraning har bir tirqişi yangi tölqin manbai böladi. Qöşni tirqişlardan kelgan tölqinlar yöllar farqi $d\sin\varphi$ butun son tölqin uzunligiga teng bölgan yönalişlarda kuçayadi. Tirqişlar köp bölgani uçun maksimumlar juda tor va yorqin.

<div class="eq-block">

<span class="eq-label">Panjara davri</span><span class="eq-body">$\displaystyle d = \frac{1}{N}$</span>

<span class="eq-label">Maksimumlar</span><span class="eq-body">$\displaystyle d\sin\varphi = k\lambda,\quad k = 0, \pm1, \pm2\dots$</span>

<span class="eq-label">Eng katta tartib</span><span class="eq-body">$\displaystyle k_{max} < \frac{d}{\lambda},\quad \text{maksimumlar soni } 2k_{max} + 1$</span>

</div>

Har xil ranglar har xil burçakka buriladi, şuning uçun oq yoruğlik panjaradan spektrga ajraladi. Spektroskoplar şu xossadan foydalanadi; kompakt disk sirtidagi kamalak ham difraksiya natijasi.

“Boşlaş” bosilganda tölqin uzunligi 380 nm dan tanlangan $\lambda$ gaça ortadi: maksimumlar yoyiladi va ekranda har bir tartibning spektri hosil böladi. Grafikda katta tartibli maksimum 90° ga yetganda yöqolişini kuzating.

## Sinab köring

1. Binafşa va qizil yoruğlikni soliştiring: qaysi biri köproq buriladi?
2. Panjara ziçligini oşiring: maksimumlar soni qanday özgaradi?
3. Nega oq yoruğlik panjaradan spektrga ajraladi?

## Masalalar

### 1-masala. Birinçi maksimum

1 mm da 500 çiziq bölgan panjaraga 600 nm li yoruğlik tuşmoqda. Birinçi tartibli maksimum burçagini va eng katta tartibni toping.

<SimExample :values='{"N":500,"lam":600}' check="Panjara davri d = 2,00 μm. Birinçi tartibli maksimum φ₁ = 17,5°, eng katta tartib k_max = 3, jami 7 ta maksimum.">

::: details Yeçimni körsatiş

1. $d = \dfrac{1}{500}\ \text{mm} = 2\ \mu\text{m}$, $\sin\varphi_1 = \dfrac{0{,}6}{2} = 0{,}3$, $\varphi_1 = 17{,}5^\circ$.
2. $\dfrac{d}{\lambda} = 3{,}33$, $k_{max} = 3$.

**Javob.** $\varphi_1 \approx 17{,}5^\circ$, $k_{max} = 3$.

:::

</SimExample>

### 2-masala. Siyrak panjara

1 mm da 300 çiziq, λ = 500 nm. Birinçi maksimum burçagi va maksimumlar soni qança?

<SimExample :values='{"N":300,"lam":500}' check="Panjara davri d = 3,33 μm. Birinçi tartibli maksimum φ₁ = 8,6°, eng katta tartib k_max = 6, jami 13 ta maksimum.">

::: details Yeçimni körsatiş

1. $d = \dfrac{1}{300}\ \text{mm} = 3{,}33\ \mu\text{m}$, $\sin\varphi_1 = \dfrac{0{,}5}{3{,}33} = 0{,}15$, $\varphi_1 = 8{,}6^\circ$.
2. $\dfrac{d}{\lambda} = 6{,}67$, $k_{max} = 6$.
3. Markaziy maksimum va uning ikki tomonida 6 tadan: $2k_{max} + 1 = 13$ ta maksimum.

**Javob.** $\varphi_1 \approx 8{,}6^\circ$; 13 ta maksimum ($k_{max} = 6$).

:::

</SimExample>

### 3-masala. Ziç panjara

1 mm da 1000 çiziq, λ = 700 nm. Neçta maksimum körinadi?

<SimExample :values='{"N":1000,"lam":700}' check="Panjara davri d = 1,00 μm. Birinçi tartibli maksimum φ₁ = 44,4°, eng katta tartib k_max = 1, jami 3 ta maksimum.">

::: details Yeçimni körsatiş

1. $d = \dfrac{1}{1000}\ \text{mm} = 1\ \mu\text{m}$, $\sin\varphi_1 = \dfrac{0{,}7}{1} = 0{,}7$, $\varphi_1 = 44{,}4^\circ$.
2. $\dfrac{d}{\lambda} = 1{,}43$: $k_{max} = 1$, faqat $k = 0$ va $k = \pm1$, jami 3 ta maksimum.

**Javob.** $\varphi_1 \approx 44{,}4^\circ$; 3 ta maksimum ($k_{max} = 1$).

:::

</SimExample>

## Manbalar

Bu mavzu 11-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 3-jild, 4-bob](https://openstax.org/books/university-physics-volume-3/pages/4-4-diffraction-gratings). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
