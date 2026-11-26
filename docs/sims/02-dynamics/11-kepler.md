---
title: "Kepler qonunlari"
description: "Sayyora Quyoş atrofida ellips böylab aylanadi. Teng vaqt oraliqlarida radius-vektor çizgan yuzlar bir xil: Quyoşga yaqin joyda sayyora tez, uzoqda sekin harakatlanadi. Aylaniş davrining kvadrati katta yarim öqning kubiga proporsional."
topic: "Dinamika · Sayyoralar harakati"
examples: 3
---

# Kepler qonunlari

<SimLab id="kepler" />

## Asosiy ğoya

Qadimda sayyoralar aylanalar böylab harakatlanadi deb hisoblangan. Kepler Marsning harakatini yillar davomida hisoblab, orbita aylana emas, ellips ekanini aniqladi. Bu kaşfiyot osmon mexanikasining boşlanişi böldi.

Ikkinçi qonun sayyora Quyoşga yaqinlaşganda tezlaşişini, uzoqlaşganda sekinlaşişini anglatadi. Uçinçi qonun esa Quyoşdan uzoqdagi sayyoralar nafaqat uzunroq yöl bosişini, balki sekinroq ham harakatlanişini körsatadi.

<div class="lesson-photos">

<SimPhoto name="kepler-portrait" :width="1033" :height="1200" :display-width="380" class="tall" alt="Iogann Keplerning XVII asrda çizilgan portreti" caption="Iogann Kepler (1571–1630). Tixo Brage ölçagan Mars koordinatalarini yillar davomida tahlil qilib, sayyoralar ellips böylab harakatlanişini kaşf etdi." credit="Surat: Nomaʼlum rassom, Uffitsi galereyasi, jamoat mulki, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Johannes_Kepler_Uffizien.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Iogann Kepler Tixo Brage kuzatişlaridan sayyoralar harakatining uç qonunini topdi. Keyinçalik Nyuton ularni Butun olam tortiliş qonunidan keltirib çiqardi.

<div class="eq-block">

<span class="eq-label">1-qonun</span><span class="eq-body">Har bir sayyora ellips böylab harakatlanadi, Quyoş ellipsning fokuslaridan birida</span>

<span class="eq-label">2-qonun</span><span class="eq-body">Radius-vektor teng vaqtlarda teng yuzlar çizadi: $\;r\,\upsilon_\perp = \text{const}$</span>

<span class="eq-label">3-qonun</span><span class="eq-body">$\displaystyle \frac{T^2}{a^3} = \frac{4\pi^2}{GM} = \text{const}, \qquad T\,[\text{yil}] = a^{3/2}\,[\text{a.b.}]$</span>

</div>

Astronomik birlik (a.b.) — Yerdan Quyoşgaça örtaça masofa, $1{,}496 \cdot 10^{8}\ \text{km}$. Ellipsning çözilganligini ekssentrisitet $e$ körsatadi: $e = 0$ — aylana, $e$ birga yaqinlaşgan sari orbita çöziladi.

## Sinab köring

1. e = 0,7 da teng vaqtdagi yuzlarga qarang: Quyoş yaqinidagi va uzoqdagi bölaklar qanday farq qiladi?
2. a ni 1 dan 4 gaça oşiring. T qança marta ortadi?
3. e = 0 qiling. Tezlik grafigi qanday böladi?

## Masalalar

### 1-masala. Yerning aylaniş davri

Yer orbitasining katta yarim öqi 1,00 a.b. Kepler uçinçi qonunidan foydalanib Yerning aylaniş davrini toping.

<SimExample :values='{"a":1,"e":0.017,"n":12}' check="Sayyora Quyoş atrofida bir marta aylandi: T = 1,00 yil. T² / a³ = 1,000.">

::: details Yeçimni körsatiş

1. Uçinçi qonun: $T = 2\pi\sqrt{\dfrac{a^3}{GM}}$, Quyoş uçun $GM = 1{,}327\cdot10^{20}\ \text{m}^3/\text{s}^2$, $a = 1{,}00\ \text{a.b.} = 1{,}496\cdot10^{11}\ \text{m}$.
2. $T = 2\pi\sqrt{\dfrac{(1{,}496\cdot10^{11})^3}{1{,}327\cdot10^{20}}} = 3{,}156\cdot10^{7}\ \text{s} \approx 365\ \text{kun}$.
3. Astronomik birliklarda bu $T = a^{3/2} = 1{,}00^{3/2} = 1{,}00\ \text{yil}$ ga teng.

**Javob.** $T = 1{,}00\ \text{yil}$.

:::

</SimExample>

### 2-masala. Mars

Mars orbitasining katta yarim öqi 1,52 a.b. Mars yili Yer yilidan neça marta uzun?

<SimExample :values='{"a":1.52,"e":0.093,"n":12}' check="Sayyora Quyoş atrofida bir marta aylandi: T = 1,87 yil. T² / a³ = 1,000.">

::: details Yeçimni körsatiş

1. Uçinçi qonun ikkala sayyora uçun: $\dfrac{T_M^2}{T_Y^2} = \dfrac{a_M^3}{a_Y^3}$, yaʼni $T_M = T_Y \left(\dfrac{a_M}{a_Y}\right)^{3/2}$.
2. $T_M = 1{,}00\ \text{yil} \cdot 1{,}52^{3/2} = 1{,}52 \cdot \sqrt{1{,}52} = 1{,}52 \cdot 1{,}233$.
3. $T_M = 1{,}87\ \text{yil}$: Mars yili Yer yilidan 1,87 marta uzun.

**Javob.** $T \approx 1{,}87\ \text{yil}$.

:::

</SimExample>

### 3-masala. Perigeliy va afeliy

Orbitaning katta yarim öqi 2,0 a.b., ekssentrisiteti 0,70. Sayyoraning Quyoşga eng yaqin va eng uzoq masofalarini toping. Bu nuqtalardagi tezliklar nisbati qança?

<SimExample :values='{"a":2,"e":0.7,"n":8}' check="“Quyoşgaça masofa” grafigi 0,600 dan 3,400 a.b. gaça özgaradi, tezlik grafigi esa aksinça: Quyoş yaqinida eng katta.">

::: details Yeçimni körsatiş

1. $r_\text{min} = a(1 - e) = 0{,}60\ \text{a.b.}$, $r_\text{max} = a(1 + e) = 3{,}40\ \text{a.b.}$
2. Ikkinçi qonunga köra $r_\text{min}\,\upsilon_\text{max} = r_\text{max}\,\upsilon_\text{min}$, $\dfrac{\upsilon_\text{max}}{\upsilon_\text{min}} = \dfrac{3{,}40}{0{,}60} = 5{,}7$.

**Javob.** 0,60 a.b. va 3,40 a.b.; tezliklar nisbati 5,7.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 13-bob](https://openstax.org/books/university-physics-volume-1/pages/13-5-keplers-laws-of-planetary-motion). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
