---
title: "Arximed kuçi"
description: "Dinamometrga osilgan jismni suyuqlikka sekin tuşiring. Jism botgan sari dinamometr körsatişi kamayadi: suyuqlik jismni botgan qism hajmidagi suyuqlikning oğirligiça kuç bilan yuqoriga itaradi."
topic: "Suyuqliklar mexanikasi · Arximed qonuni"
examples: 3
---

# Arximed kuçi

<SimLab id="archimedes" />

## Asosiy ğoya

Suvda ağir toşni kötariş havodagiga qaraganda oson: suv toşni yuqoriga itarib turadi. Bu kuçni miloddan avvalgi III asrda yunon olimi Arximed aniqlagan. Rivoyatga köra, u şoh tojining sof oltindan yasalganini tekşiriş uçun tojning havodagi va suvdagi oğirligini soliştirgan.

Laboratoriyada Arximed kuçini dinamometr bilan ölçaymiz: jismning havodagi va suyuqlikdagi oğirliklari farqi Arximed kuçiga teng.

<div class="lesson-photos">

<SimPhoto name="archimedes-bath" :width="945" :height="668" alt="Vannadagi Arximed tasvirlangan eski gravyura" caption="Rivoyatga köra, Arximed vannaga tuşganda suv sathi kötarilganini köradi va jism siqib çiqargan suv hajmi jismning hajmiga tengligini tuşunadi. XVI asr gravyurasi." credit="Surat: Nomaʼlum muallif, jamoat mulki, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Archimedes_bath.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Suyuqlikka botirilgan jismning pastki asosiga yuqori asosiga qaraganda kattaroq bosim taʼsir qiladi, çunki u çuqurroqda turibdi. Bu bosimlar farqi jismni yuqoriga itaruvçi kuç hosil qiladi. U *Arximed kuçi* deyiladi.

<div class="eq-block">

<span class="eq-label">Arximed kuçi</span><span class="eq-body">$\displaystyle F_A = \rho_\text{s}\, g\, V_\text{b}$</span>

<span class="eq-label">Suyuqlikdagi oğirlik</span><span class="eq-body">$\displaystyle P = mg - F_A$</span>

<span class="eq-label">Ikki ölçaşdan hajm</span><span class="eq-body">$\displaystyle V = \frac{P_\text{havo} - P_\text{s}}{\rho_\text{s}\, g}$</span>

</div>

Bu yerda $\rho_\text{s}$ — suyuqlik ziçligi, $V_\text{b}$ — jismning botgan qismi hajmi. Arximed kuçi jismning massasiga, moddasiga va qança çuqurda turganiga boğliq emas. Jism töla botgandan keyin uni qança çuqur tuşirmaylik, dinamometr körsatişi özgarmaydi.

Jism botgan sari idişdagi suyuqlik sathi ham kötariladi: jism siqib çiqargan suyuqlik hajmi uning botgan qismi hajmiga teng.

## Sinab köring

1. Temirni misga almaştiring, hajm özgarmasin. Arximed kuçi özgaradimi? Dinamometr körsatişi-çi?
2. Jism töla botgandan keyin “Kuçlar” grafigiga qarang. Nima uçun çiziqlar gorizontal bölib qoladi?
3. Hajmni ikki marta oşiring. Arximed kuçi va dinamometr körsatişi qança özgaradi?

## Masalalar

### 1-masala. Temir silindr suvda

Hajmi 200 sm³ bölgan temir silindr dinamometrga osilgan. Havoda va suvga töla botirilganda dinamometr nimani körsatadi? Temirning ziçligi 7800 kg/m³.

<SimExample :values='{"mat":1,"V":200,"liq":0,"u":2,"g":9.81}' check="Jism suyuqlikka töla botdi. Dinamometr körsatişi 15,30 N dan 13,34 N gaça kamaydi: suyuqlik jismni Fₐ = ρgV = 1,96 N kuç bilan yuqoriga itarmoqda.">

::: details Yeçimni körsatiş

1. $m = \rho V = 7800 \cdot 2 \cdot 10^{-4} = 1{,}56\ \text{kg}$, havoda $P_0 = mg = 15{,}30\ \text{N}$.
2. $F_A = \rho_\text{s} g V = 1000 \cdot 9{,}81 \cdot 2 \cdot 10^{-4} = 1{,}96\ \text{N}$.
3. Suvda $P = mg - F_A = 15{,}30 - 1{,}96 = 13{,}34\ \text{N}$.

**Javob.** Havoda 15,30 N, suvda 13,34 N.

:::

</SimExample>

### 2-masala. Xuddi şu silindr kerosinda

Öşa temir silindr kerosinga töla botirildi. Arximed kuçi va dinamometr körsatişi qança böladi?

<SimExample :values='{"mat":1,"V":200,"liq":2,"u":2,"g":9.81}' check="Jism suyuqlikka töla botdi. Dinamometr körsatişi 15,30 N dan 13,73 N gaça kamaydi: suyuqlik jismni Fₐ = ρgV = 1,57 N kuç bilan yuqoriga itarmoqda.">

::: details Yeçimni körsatiş

1. $F_A = 800 \cdot 9{,}81 \cdot 2 \cdot 10^{-4} = 1{,}57\ \text{N}$ — suvdagidan 0,8 marta kiçik.
2. $P = 15{,}30 - 1{,}57 = 13{,}73\ \text{N}$.

**Javob.** $F_A \approx 1{,}57\ \text{N}$, $P \approx 13{,}73\ \text{N}$.

:::

</SimExample>

### 3-masala. Jism nimadan yasalgan?

Jism dinamometrga osilganda havoda 2,65 N, suvga töla botirilganda esa 1,67 N körsatdi. Jismning hajmini va ziçligini toping. U qaysi moddadan yasalgan?

<SimExample :values='{"mat":0,"V":100,"liq":0,"u":2,"g":9.81}' check="Jism suyuqlikka töla botdi. Dinamometr körsatişi 2,65 N dan 1,67 N gaça kamaydi: suyuqlik jismni Fₐ = ρgV = 0,98 N kuç bilan yuqoriga itarmoqda.">

::: details Yeçimni körsatiş

1. $F_A = 2{,}65 - 1{,}67 = 0{,}98\ \text{N}$.
2. $V = \dfrac{F_A}{\rho_\text{s} g} = \dfrac{0{,}98}{1000 \cdot 9{,}81} \approx 1{,}0 \cdot 10^{-4}\ \text{m}^3 = 100\ \text{sm}^3$.
3. $m = \dfrac{2{,}65}{9{,}81} = 0{,}27\ \text{kg}$, $\rho = \dfrac{m}{V} = 2700\ \text{kg/m}^3$ — bu alyuminiy.

**Javob.** $V = 100\ \text{sm}^3$, $\rho = 2700\ \text{kg/m}^3$, alyuminiy.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 14-bob](https://openstax.org/books/university-physics-volume-1/pages/14-4-archimedes-principle-and-buoyancy). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
