---
title: "Bor modeli va vodorod spektri"
description: "Vodorod atomida elektron faqat maʼlum orbitalarda tura oladi. U yuqori orbitadan pastkisiga ötganda energiyalar farqiga teng foton çiqaradi. Orbitalarni tanlab, spektral çiziqning tölqin uzunligi va rangini toping."
topic: "Atom fizikasi · Bor postulatlari"
examples: 3
---

# Bor modeli va vodorod spektri

<SimLab id="bohr" />

## Asosiy ğoya

Qizdirilgan vodorod yoruğligi prizmadan ötkazilsa, tutaş spektr emas, bir neça rangli çiziq körinadi. Har bir kimyoviy element öziga xos çiziqli spektrga ega: astronomlar yulduzlar tarkibini şu çiziqlar böyiça aniqlaydi.

## Nazariya

Nils Bor 1913-yilda Rezerford modelini kvant ğoyasi bilan töldirdi. Elektron faqat ruxsat etilgan orbitalarda nurlanmasdan harakatlanadi. Bir orbitadan boşqasiga ötganda atom energiyalar farqiga teng foton çiqaradi yoki yutadi.

<div class="eq-block">

<span class="eq-label">Energiya sathlari</span><span class="eq-body">$\displaystyle E_n = -\frac{13{,}6\ \text{eV}}{n^2}$</span>

<span class="eq-label">Foton energiyasi</span><span class="eq-body">$\displaystyle h\nu = E_n - E_k$</span>

<span class="eq-label">Ridberg formulasi</span><span class="eq-body">$\displaystyle \frac{1}{\lambda} = R\left(\frac{1}{k^2} - \frac{1}{n^2}\right),\quad R = 1{,}097\cdot10^7\ \text{m}^{-1}$</span>

</div>

Pastki orbitasi 1 bölgan ötişlar ultrabinafşa Layman seriyasini, 2 bölganlari körinadigan Balmer seriyasini, 3 bölganlari infraqizil Paşen seriyasini beradi. Aslida orbita radiusi $n^2$ ga proporsional: $r_n = 0{,}053\ \text{nm}\cdot n^2$. Rasmdagi orbitalar masştabsiz ($r_7 = 49\,r_1$ ekranga siğmaydi), elektron esa bir orbitadan ikkinçisiga oraliq holatlarsiz “sakraydi”: grafikda energiya bir onda $h\nu$ ga kamayadi.

## Sinab köring

1. Balmer seriyasida qaysi ötiş eng qisqa tölqin beradi?
2. Ionlaş energiyasi nimaga teng (n = ∞ dan 1 ga)?
3. Nega Paşen seriyasi körinmaydi?

## Masalalar

### 1-masala. Qizil Hα çizigi

Vodorod atomida elektron 3-orbitadan 2-orbitaga ötdi. Çiqarilgan foton energiyasi va tölqin uzunligini toping.

<SimExample :values='{"n":3,"k":1}' check="Elektron 3-orbitadan 2-orbitaga ötdi: foton energiyasi 1,89 eV, tölqin uzunligi λ = 656 nm (qizil).">

::: details Yeçimni körsatiş

1. $h\nu = 13{,}6\left(\dfrac14 - \dfrac19\right) = 1{,}89\ \text{eV}$.
2. $\dfrac1\lambda = 1{,}097\cdot10^7 \cdot 0{,}1389$, $\lambda = 656\ \text{nm}$.

**Javob.** $h\nu \approx 1{,}89\ \text{eV}$, $\lambda \approx 656\ \text{nm}$ (qizil).

:::

</SimExample>

### 2-masala. Layman seriyasi

Elektron 2-orbitadan 1-orbitaga ötdi. Foton qaysi sohaga tegişli?

<SimExample :values='{"n":2,"k":0}' check="Elektron 2-orbitadan 1-orbitaga ötdi: foton energiyasi 10,20 eV, tölqin uzunligi λ = 122 nm (ultrabinafşa).">

::: details Yeçimni körsatiş

1. $h\nu = 13{,}6\left(\dfrac{1}{1^2} - \dfrac{1}{2^2}\right) = 13{,}6 \cdot \dfrac34 = 10{,}20\ \text{eV}$.
2. $\dfrac1\lambda = 1{,}097\cdot10^7 \cdot \dfrac34$, $\lambda = 122\ \text{nm}$.
3. $122\ \text{nm} < 380\ \text{nm}$: foton ultrabinafşa sohada, közga körinmaydi.

**Javob.** $\lambda \approx 122\ \text{nm}$ — ultrabinafşa.

:::

</SimExample>

### 3-masala. Kök Hβ çizigi

Elektron 4-orbitadan 2-orbitaga ötganda qanday rangli çiziq hosil böladi?

<SimExample :values='{"n":4,"k":1}' check="Elektron 4-orbitadan 2-orbitaga ötdi: foton energiyasi 2,55 eV, tölqin uzunligi λ = 486 nm (kök).">

::: details Yeçimni körsatiş

1. $h\nu = 13{,}6\left(\dfrac14 - \dfrac1{16}\right) = 13{,}6 \cdot 0{,}1875 = 2{,}55\ \text{eV}$.
2. $\dfrac1\lambda = 1{,}097\cdot10^7 \cdot 0{,}1875$, $\lambda = 486\ \text{nm}$.
3. 486 nm — spektrning kök qismi (Hβ çizigi).

**Javob.** $\lambda \approx 486\ \text{nm}$ — kök.

:::

</SimExample>

## Manbalar

Bu mavzu 11-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 3-jild, 6-bob](https://openstax.org/books/university-physics-volume-3/pages/6-4-bohrs-model-of-the-hydrogen-atom). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
