---
title: "De Broyl tölqinlari"
description: "Har qanday harakatlanayotgan zarraning tölqin xossasi bor. Elektron yoki protonni tezlatib, uning de Broyl tölqin uzunligi kuçlanişga qanday boğliqligini köring. Bu tölqin uzunligi atomlar orasidagi masofaga yaqin, şuning uçun elektronlar kristallda difraksiyaga uçraydi."
topic: "Kvant fizikasi · Korpuskulyar-tölqin dualizm"
examples: 3
---

# De Broyl tölqinlari

<SimLab id="debroglie" />

## Asosiy ğoya

1927-yilda Devisson va Jermer nikel kristaliga elektronlar dastasini yönaltirib, rentgen nurlari beradigan difraksion manzarani oldilar. Bu elektronning tölqin xossasini isbotladi.

## Nazariya

1924-yilda Lui de Broyl yoruğlik kabi zarralarning ham tölqin xossasi bor degan gipotezani ilgari surdi. Impulsi $p$ bölgan zarraga tölqin uzunligi $\lambda = h/p$ bölgan tölqin mos keladi.

<div class="eq-block">

<span class="eq-label">De Broyl formulasi</span><span class="eq-body">$\displaystyle \lambda = \frac{h}{p} = \frac{h}{m\upsilon}$</span>

<span class="eq-label">Kuçlanişda tezlangan zarra</span><span class="eq-body">$\displaystyle eU = \frac{m\upsilon^2}{2}\;\Rightarrow\; \lambda = \frac{h}{\sqrt{2meU}}$</span>

</div>

Bu formulada $\upsilon \ll c$ deb olingan (nisbiylik nazariyasi hisobga olinmagan): 5 kV gaça kuçlanişda elektron uçun xato 1 % dan kam. Plastinkalar orasidagi bir jinsli maydonda zarra tekis tezlanadi, grafikda tezlik çiziqli ortib, söng özgarmay qoladi.

Elektron uçun 100 V da $\lambda \approx 0{,}12$ nm, bu kristalldagi atomlar orasidagi masofaga teng. Elektron mikroskoplari şu qisqa tölqin uzunligi tufayli yoruğlik mikroskopidan minglab marta mayda detallarni körsatadi. Tennis töpi kabi katta jismlarning tölqin uzunligi juda kiçik va sezilmaydi.

## Sinab köring

1. Elektron va proton uçun bir xil kuçlanişda λ ni soliştiring.
2. Kuçlanişni 4 marta oşiring: λ qanday özgaradi?
3. Nega katta jismlarning tölqin xossasi sezilmaydi?

## Masalalar

### 1-masala. Elektron, 100 V

Elektron 100 V kuçlanişda tezlatildi. Uning tezligi va de Broyl tölqin uzunligini toping.

<SimExample :values='{"part":0,"U":100}' check="Zarra U = 100 V kuçlanişda tezlandi: υ = 5931 km/s, de Broyl tölqin uzunligi λ = h/(mυ) = 0,1227 nm.">

::: details Yeçimni körsatiş

1. $\upsilon = \sqrt{\dfrac{2eU}{m}} = \sqrt{\dfrac{2 \cdot 1{,}602\cdot10^{-19} \cdot 100}{9{,}109\cdot10^{-31}}} = 5{,}93\cdot10^6\ \text{m/s}$.
2. $\lambda = \dfrac{6{,}626\cdot10^{-34}}{9{,}109\cdot10^{-31} \cdot 5{,}93\cdot10^6} = 1{,}227\cdot10^{-10}\ \text{m}$.

**Javob.** $\upsilon \approx 5931\ \text{km/s}$, $\lambda \approx 0{,}1227\ \text{nm}$.

:::

</SimExample>

### 2-masala. Elektron, 1000 V

Kuçlaniş 10 marta oşirildi. Tölqin uzunligi neça marta kamayadi?

<SimExample :values='{"part":0,"U":1000}' check="Zarra U = 1000 V kuçlanişda tezlandi: υ = 18755 km/s, de Broyl tölqin uzunligi λ = h/(mυ) = 0,0388 nm.">

::: details Yeçimni körsatiş

1. $\lambda = \dfrac{h}{\sqrt{2meU}}$, demak $\lambda \sim \dfrac{1}{\sqrt U}$.
2. $U$ 10 marta ortsa, $\lambda$ $\sqrt{10} = 3{,}16$ marta kamayadi.
3. $\lambda = \dfrac{0{,}1227}{3{,}16} = 0{,}0388\ \text{nm}$.

**Javob.** $\lambda \approx 0{,}0388\ \text{nm}$.

:::

</SimExample>

### 3-masala. Proton

Proton 100 V da tezlatildi. Uning de Broyl tölqin uzunligi elektronnikidan neça marta kiçik?

<SimExample :values='{"part":1,"U":100}' check="Zarra U = 100 V kuçlanişda tezlandi: υ = 138 km/s, de Broyl tölqin uzunligi λ = h/(mυ) = 0,0029 nm.">

::: details Yeçimni körsatiş

1. $\lambda \sim \dfrac{1}{\sqrt m}$: $\sqrt{\dfrac{1{,}673\cdot10^{-27}}{9{,}109\cdot10^{-31}}} = 42{,}9$ marta kiçik.
2. $\lambda = \dfrac{0{,}1227}{42{,}9} = 0{,}0029\ \text{nm}$, $\upsilon = 138\ \text{km/s}$.

**Javob.** $\lambda \approx 0{,}0029\ \text{nm}$, 43 marta kiçik.

:::

</SimExample>

## Manbalar

Bu mavzu 11-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 3-jild, 6-bob](https://openstax.org/books/university-physics-volume-3/pages/6-5-de-broglies-matter-waves). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
