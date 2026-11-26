---
title: "Iş, quvvat va FIK"
description: "Çiğir yukni qiya tekislik böylab özgarmas tezlik bilan tortib çiqaradi. Burçakni, işqalanişni va tezlikni özgartiring: bajarilgan iş, quvvat va foydali iş koeffitsiyenti qanday özgarişini köring."
topic: "Saqlaniş qonunlari · Mexanik iş va quvvat"
examples: 3
---

# Iş, quvvat va FIK

<SimLab id="work-power" />

## Asosiy ğoya

Kundalik hayotda “iş” deb har qanday mehnatni aytamiz, fizikada esa iş aniq kattalik: kuç jismni harakatlantirgandagina iş bajaradi. Devorni qança itarsangiz ham, u joyidan siljimasa, mexanik iş nolga teng.

Bir xil işni har xil vaqtda bajariş mumkin: yukni zinadan sekin olib çiqsak ham, yugurib çiqsak ham iş bir xil, lekin yugurganda quvvat katta. Mexanizmlarda töla işning bir qismi işqalanişni yengişga sarflanadi; foydali işning töla işga nisbati foydali iş koeffitsiyenti (FIK) deyiladi.

<div class="lesson-photos">

<SimPhoto name="derrick-crane" :width="1200" :height="591" alt="Kema qurilişi korxonasidagi eski sariq derrik kran" caption="Kranning quvvati yukni qança tez kötara olişini belgilaydi: bir xil yukni ikki marta tezroq kötariş uçun ikki marta katta quvvat kerak, bajarilgan iş esa bir xil." credit="Surat: Steve Knight, &lt;a href=&quot;https://creativecommons.org/licenses/by/4.0&quot;&gt;CC BY 4.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Scotch_Derrick_Crane_(55154509842).jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Kuç jismni kuç yönalişida $s$ masofaga köçirsa, u iş bajaradi. Kuç harakat yönalişiga $\alpha$ burçak ostida bölsa, işni faqat harakat yönalişidagi taşkil etuvçi bajaradi. Quvvat — vaqt birligida bajarilgan iş.

<div class="eq-block">

<span class="eq-label">Mexanik iş</span><span class="eq-body">$\displaystyle A = F s \cos\alpha$</span>

<span class="eq-label">Quvvat</span><span class="eq-body">$\displaystyle P = \frac{A}{t} = F\upsilon$</span>

<span class="eq-label">Qiya tekislikda tekis tortiş</span><span class="eq-body">$\displaystyle F = mg\,(\sin\alpha + \mu\cos\alpha)$</span>

<span class="eq-label">Foydali iş koeffitsiyenti</span><span class="eq-body">$\displaystyle \eta = \frac{A_\text{f}}{A_\text{t}} = \frac{mgh}{F\,l} \cdot 100\,\%$</span>

</div>

Işning birligi — joul (1 J = 1 N·m), quvvatning birligi — vatt (1 W = 1 J/s). Işqalaniş bölmaganda qiya tekislik kuçdan yutiş beradi, lekin iş özgarmaydi: $F l = mgh$. Işqalaniş bölsa, töla işning bir qismi issiqlikka aylanadi va FIK 100 % dan kiçik böladi.

## Sinab köring

1. μ = 0 da burçakni özgartiring. Töla iş özgaradimi? Tortiş kuçi-çi?
2. Işqalanişni qöşing va burçakni kiçraytiring. Nima uçun yotiq qiyalikda FIK pasayadi?
3. Tezlikni ikki marta oşiring. Iş, vaqt va quvvat qanday özgaradi?

## Masalalar

### 1-masala. Işqalanişsiz qiya tekislik

Massasi 20 kg bölgan yuk qiyalik burçagi $30^\circ$ bölgan silliq qiya tekislik böylab 3,0 m ga 0,5 m/s özgarmas tezlik bilan tortib çiqarildi. Tortiş kuçini, bajarilgan işni, quvvatni va FIK ni toping.

<SimExample :values='{"m":20,"angle":30,"mu":0,"u":0.5,"g":9.81}' check="Yuk 6,0 s da qiya tekislik böylab 3,0 m tortildi (h = 1,50 m ga kötarildi). Töla iş A = 294,3 J, foydali iş 294,3 J, FIK η = 100,0 %, quvvat P = 49,0 W.">

::: details Yeçimni körsatiş

1. $F = mg\sin 30^\circ = 20 \cdot 9{,}81 \cdot 0{,}5 = 98{,}1\ \text{N}$.
2. $A = F l = 98{,}1 \cdot 3{,}0 = 294{,}3\ \text{J}$. Yuk $h = l\sin 30^\circ = 1{,}5\ \text{m}$ ga kötarildi: $mgh = 294{,}3\ \text{J}$.
3. $\eta = \dfrac{mgh}{Fl} = 100\,\%$, $P = F\upsilon = 98{,}1 \cdot 0{,}5 \approx 49\ \text{W}$.

**Javob.** $F = 98{,}1\ \text{N}$, $A = 294{,}3\ \text{J}$, $P \approx 49\ \text{W}$, $\eta = 100\,\%$.

:::

</SimExample>

### 2-masala. Işqalaniş bilan

Xuddi şu yuk xuddi şu qiyalikda tortiladi, lekin işqalaniş koeffitsiyenti 0,20. Tortiş kuçi, töla iş va FIK qança böladi?

<SimExample :values='{"m":20,"angle":30,"mu":0.2,"u":0.5,"g":9.81}' check="Yuk 6,0 s da qiya tekislik böylab 3,0 m tortildi (h = 1,50 m ga kötarildi). Töla iş A = 396,2 J, foydali iş 294,3 J, FIK η = 74,3 %, quvvat P = 66,0 W.">

::: details Yeçimni körsatiş

1. $F = mg(\sin 30^\circ + \mu\cos 30^\circ) = 196{,}2\,(0{,}500 + 0{,}173) = 132{,}1\ \text{N}$.
2. $A_\text{t} = F l = 396{,}2\ \text{J}$, foydali iş özgarmaydi: $A_\text{f} = mgh = 294{,}3\ \text{J}$.
3. $\eta = \dfrac{294{,}3}{396{,}2} \cdot 100\,\% = 74{,}3\,\%$; qolgan 101,9 J işqalanişga sarflanadi.

**Javob.** $F = 132{,}1\ \text{N}$, $A = 396{,}2\ \text{J}$, $\eta = 74{,}3\,\%$.

:::

</SimExample>

### 3-masala. Çiğirning quvvati

Elektr çiğir 50 kg yukni qiyalik burçagi $20^\circ$, işqalaniş koeffitsiyenti 0,10 bölgan qiya tekislik böylab 1,2 m/s tezlik bilan tortadi. Çiğirning quvvati va qurilmaning FIK qança?

<SimExample :values='{"m":50,"angle":20,"mu":0.1,"u":1.2,"g":9.81}' check="Yuk 2,5 s da qiya tekislik böylab 3,0 m tortildi (h = 1,03 m ga kötarildi). Töla iş A = 641,6 J, foydali iş 503,3 J, FIK η = 78,4 %, quvvat P = 256,6 W.">

::: details Yeçimni körsatiş

1. $F = 490{,}5\,(\sin 20^\circ + 0{,}10\cos 20^\circ) = 490{,}5 \cdot 0{,}436 = 213{,}9\ \text{N}$.
2. $P = F\upsilon = 213{,}9 \cdot 1{,}2 = 256{,}6\ \text{W}$.
3. $\eta = \dfrac{\sin 20^\circ}{\sin 20^\circ + 0{,}10\cos 20^\circ} = \dfrac{0{,}342}{0{,}436} = 78{,}4\,\%$.

**Javob.** $P = 256{,}6\ \text{W}$, $\eta = 78{,}4\,\%$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 7-bob](https://openstax.org/books/university-physics-volume-1/pages/7-1-work). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
