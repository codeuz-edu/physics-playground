---
title: "Bloklar va polispast"
description: "Bir xil yukni qözğalmas blok, qözğaluvçan blok va polispast bilan kötaring. Kuçdan qança yutilsa, arqonni şunça uzun tortiş kerak: bajarilgan iş özgarmaydi."
topic: "Statika · Oddiy mexanizmlar"
examples: 3
---

# Bloklar va polispast

<SimLab id="pulleys" />

## Asosiy ğoya

Qurilişda yuk kötaruvçi kranlar, qudukdan suv tortadigan çiğir, kemalardagi yelkan arqonlari — hammasida blok işlatiladi. Blok — öq atrofida aylana oladigan, aylanasida arqon uçun ariqçasi bölgan ğildirak.

Qözğalmas blokning öqi mahkamlangan, u faqat kuç yönalişini özgartiradi: yukni pastga tortib, yuqoriga kötariş qulay. Qözğaluvçan blok yuk bilan birga kötariladi va yukni ikki arqon tarmoği uşlab turadi. Bir neça qözğalmas va qözğaluvçan blokdan tuzilgan mexanizm polispast deyiladi.

<div class="lesson-photos">

<SimPhoto name="block-and-tackle" :width="798" :height="1200" :display-width="380" class="tall" alt="Arqon ötkazilgan ikki yoğoç blokdan iborat polispast" caption="Yelkanli kemadagi polispast: arqon bir neça marta bloklar orasidan ötkazilgan. Yukni neça arqon tarmoği uşlab tursa, kuçdan şunça marta yutiladi, lekin arqonni şunça marta uzunroq tortiş kerak." credit="Surat: Ludovic Péron, &lt;a href=&quot;https://creativecommons.org/licenses/by-sa/3.0&quot;&gt;CC BY-SA 3.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Palans.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Blok, arqon va işqalaniş hisobga olinmaydigan darajada yengil deb hisoblaymiz va yuk sekin, tekis kötariladi deymiz. Unda yukni kötarib turgan arqon tarmoqlarining har birida taranglik kuçi bir xil va tortiş kuçiga teng.

<div class="eq-block">

<span class="eq-label">Qözğalmas blok</span><span class="eq-body">$\displaystyle F = mg$: kuç yönalişi özgaradi, kuçdan yutilmaydi</span>

<span class="eq-label">Qözğaluvçan blok</span><span class="eq-body">$\displaystyle F = \frac{mg}{2}$: kuçdan 2 marta yutiladi</span>

<span class="eq-label">Polispast (n tarmoq)</span><span class="eq-body">$\displaystyle F = \frac{mg}{n}, \qquad s = n\,h$</span>

<span class="eq-label">Mexanikaning oltin qoidasi</span><span class="eq-body">$\displaystyle A = F s = mg\,h$</span>

</div>

Hamma mexanizmda bajarilgan iş bir xil: kuçdan neça marta yutilsa, yöldan şunça marta yutqaziladi. Haqiqiy bloklarda işqalaniş va blokning oğirligi tufayli kuç biroz kattaroq böladi, foydali iş koeffitsiyenti 100 % dan kiçik.

## Sinab köring

1. Uçala mexanizmda “Bajarilgan iş” grafigini soliştiring. Iş qaysi birida kam?
2. Polispast bilan 200 kg yukni kötaring. Kuç qança? Buni qözğalmas blok bilan qila olarmidingiz?
3. “Yuk balandligi va tortilgan arqon” grafigidagi ikki çiziqning qiyaliklari nisbati nimaga teng?

## Masalalar

### 1-masala. Qözğalmas blok

Massasi 50 kg bölgan yuk qözğalmas blok yordamida 1,0 m balandlikka tekis kötarildi. Arqonni qanday kuç bilan tortiş kerak? Qança arqon tortiladi va qança iş bajariladi?

<SimExample :values='{"m":50,"mode":0,"u":1,"g":9.81}' check="Yuk 1,0 m kötarildi. Arqon 1,0 m tortildi, kuç F = 490,5 N, bajarilgan iş A = F·s = 490,5 J.">

::: details Yeçimni körsatiş

1. $F = mg = 50 \cdot 9{,}81 = 490{,}5\ \text{N}$.
2. Arqon yuk qança kötarilsa, şunça tortiladi: $s = h = 1{,}0\ \text{m}$.
3. $A = F s = 490{,}5\ \text{J}$.

**Javob.** $F = 490{,}5\ \text{N}$, $s = 1{,}0\ \text{m}$, $A = 490{,}5\ \text{J}$.

:::

</SimExample>

### 2-masala. Qözğaluvçan blok

Xuddi şu yuk qözğaluvçan blok bilan kötarilmoqda. Kuç qança? Yuk 1,0 m kötarilişi uçun arqonni qança tortiş kerak?

<SimExample :values='{"m":50,"mode":1,"u":1,"g":9.81}' check="Yuk 1,0 m kötarildi. Arqon 2,0 m tortildi, kuç F = 245,3 N, bajarilgan iş A = F·s = 490,5 J.">

::: details Yeçimni körsatiş

1. Yukni ikki arqon tarmoği uşlab turadi: $F = \dfrac{mg}{2} = 245{,}3\ \text{N}$.
2. Har ikki tarmoq 1,0 m dan qisqarişi kerak, demak $s = 2h = 2{,}0\ \text{m}$.
3. $A = 245{,}25 \cdot 2{,}0 = 490{,}5\ \text{J}$ — qözğalmas blokdagi bilan bir xil.

**Javob.** $F = 245{,}3\ \text{N}$, $s = 2{,}0\ \text{m}$, $A = 490{,}5\ \text{J}$.

:::

</SimExample>

### 3-masala. Polispast

Yukni tört arqon tarmoği uşlab turadigan polispast bilan 50 kg yuk 1,0 m kötarildi. Kuçni, tortilgan arqon uzunligini va işni toping.

<SimExample :values='{"m":50,"mode":2,"u":1,"g":9.81}' check="Yuk 1,0 m kötarildi. Arqon 4,0 m tortildi, kuç F = 122,6 N, bajarilgan iş A = F·s = 490,5 J.">

::: details Yeçimni körsatiş

1. $F = \dfrac{mg}{4} = 122{,}6\ \text{N}$, $s = 4h = 4{,}0\ \text{m}$.
2. $A = 122{,}625 \cdot 4{,}0 = 490{,}5\ \text{J}$: kuçdan 4 marta yutildi, yöldan 4 marta yutqazildi.

**Javob.** $F = 122{,}6\ \text{N}$, $s = 4{,}0\ \text{m}$, $A = 490{,}5\ \text{J}$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 12-bob](https://openstax.org/books/university-physics-volume-1/pages/12-2-examples-of-static-equilibrium). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
