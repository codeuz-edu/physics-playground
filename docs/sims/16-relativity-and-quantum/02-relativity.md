---
title: "Vaqtning sekinlaşi va uzunlik qisqarişi"
description: "Yoruğlikka yaqin tezlikda uçayotgan kemadagi soat Yerdagi soatdan sekin yuradi, kemaning özi esa harakat yönalişida qisqaradi. Tezlikni özgartirib, γ koeffitsiyenti qanday ortişini köring."
topic: "Nisbiylik nazariyasi · Lorens almaştirişlari"
examples: 3
---

# Vaqtning sekinlaşi va uzunlik qisqarişi

<SimLab id="relativity" />

## Asosiy ğoya

1905-yilda Albert Eynşteyn vaqt va fazo mutlaq emasligini körsatdi. Yoruğlik tezligiga yaqin harakatlanayotgan kosmonavt Yerga qaytganda, u Yerda qolgan tengdoşidan yoşroq böladi: bu “egizaklar paradoksi” deb ataladi.

## Nazariya

Maxsus nisbiylik nazariyasining asosi: yoruğlik tezligi hamma inersial sanoq sistemalarida bir xil. Bundan vaqt oraliqlari va uzunliklar sanoq sistemasiga boğliq ekani kelib çiqadi.

<div class="eq-block">

<span class="eq-label">Lorens koeffitsiyenti</span><span class="eq-body">$\displaystyle \gamma = \frac{1}{\sqrt{1 - \upsilon^2/c^2}}$</span>

<span class="eq-label">Vaqtning sekinlaşi</span><span class="eq-body">$\displaystyle \Delta t = \gamma\,\Delta t_0$</span>

<span class="eq-label">Uzunlikning qisqarişi</span><span class="eq-body">$\displaystyle l = \frac{l_0}{\gamma}$</span>

</div>

Kundalik tezliklarda $\gamma$ birdan deyarli farq qilmaydi. Lekin GPS yöldoşlaridagi soatlar bu tuzatişlarsiz har kuni bir neça mikrosekund adaşar edi, kosmik nurlardan hosil bölgan myuonlar esa vaqt sekinlaşi tufayli Yer sirtigaça yetib keladi.

## Sinab köring

1. Tezlikni 0,1c qiling: farq sezilarli böladimi?
2. γ = 2 bölişi uçun qanday tezlik kerak?
3. Nega kema hamma vaqt yoruğlik tezligidan sekin?

## Masalalar

### 1-masala. 0,8c tezlik

Kema 0,8c tezlik bilan uçmoqda. Kemadagi soat böyiça 10 yil ötdi. Yerda qança vaqt ötadi? 100 m li kema Yerdan qanday uzunlikda körinadi?

<SimExample :values='{"b":0.8,"t0":10,"l0":100}' check="Kemadagi soat 10,0 yil körsatdi, Yerdagi soat esa Δt = γΔt₀ = 16,67 yil. γ = 1,667, kema uzunligi Yerdan 60,0 m körinadi.">

::: details Yeçimni körsatiş

1. $\gamma = \dfrac{1}{\sqrt{1 - 0{,}64}} = \dfrac{1}{0{,}6} = 1{,}667$.
2. $\Delta t = \gamma\,\Delta t_0 = 1{,}667 \cdot 10 = 16{,}67\ \text{yil}$, $l = \dfrac{l_0}{\gamma} = 100 \cdot 0{,}6 = 60\ \text{m}$.

**Javob.** $\Delta t \approx 16{,}67\ \text{yil}$, $l = 60\ \text{m}$.

:::

</SimExample>

### 2-masala. 0,6c tezlik

υ = 0,6c, kemada 8 yil ötdi. Yerda-çi?

<SimExample :values='{"b":0.6,"t0":8,"l0":100}' check="Kemadagi soat 8,0 yil körsatdi, Yerdagi soat esa Δt = γΔt₀ = 10,00 yil. γ = 1,250, kema uzunligi Yerdan 80,0 m körinadi.">

::: details Yeçimni körsatiş

1. $\gamma = \dfrac{1}{\sqrt{1 - 0{,}6^2}} = \dfrac{1}{\sqrt{0{,}64}} = \dfrac{1}{0{,}8} = 1{,}25$.
2. $\Delta t = \gamma\,\Delta t_0 = 1{,}25 \cdot 8 = 10\ \text{yil}$.
3. $l = \dfrac{l_0}{\gamma} = \dfrac{100}{1{,}25} = 80\ \text{m}$.

**Javob.** $\Delta t = 10\ \text{yil}$.

:::

</SimExample>

### 3-masala. Yoruğlikka juda yaqin

υ = 0,99c, kemada 1 yil ötdi. Yerda qança vaqt ötadi?

<SimExample :values='{"b":0.99,"t0":1,"l0":100}' check="Kemadagi soat 1,0 yil körsatdi, Yerdagi soat esa Δt = γΔt₀ = 7,09 yil. γ = 7,089, kema uzunligi Yerdan 14,1 m körinadi.">

::: details Yeçimni körsatiş

1. $\gamma = \dfrac{1}{\sqrt{1 - 0{,}9801}} = \dfrac{1}{\sqrt{0{,}0199}} = \dfrac{1}{0{,}14107} = 7{,}089$.
2. $\Delta t = \gamma\,\Delta t_0 = 7{,}089 \cdot 1 = 7{,}09\ \text{yil}$, $l = \dfrac{l_0}{\gamma} = \dfrac{100}{7{,}089} = 14{,}1\ \text{m}$.

**Javob.** $\Delta t \approx 7{,}09\ \text{yil}$.

:::

</SimExample>

## Manbalar

Bu mavzu 11-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 3-jild, 5-bob](https://openstax.org/books/university-physics-volume-3/pages/5-4-time-dilation). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
