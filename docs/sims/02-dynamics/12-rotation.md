---
title: "Qattiq jismning aylanma harakati"
description: "Öqqa örnatilgan ğildirakka ip öralgan, ip uçida yuk. Yuk tuşganda ğildirak burçak tezlaniş bilan aylanadi. Massasi bir xil disk va halqani soliştiring: massa öqdan uzoqda joylaşgan sari jismni aylantiriş qiyinroq."
topic: "Dinamika · Kuç momenti va inersiya momenti"
examples: 3
---

# Qattiq jismning aylanma harakati

<SimLab id="rotation" />

## Asosiy ğoya

Eşikni tutqiçidan itarsak oson oçiladi, gayka kalitining dastasi qança uzun bölsa, gaykani buraş şunça oson. Aylanma harakatda kuçning qayerga qöyilgani, jismda esa massaning qanday taqsimlangani hal qiladi.

Figurali uçuvçi qöllarini tanasiga yaqinlaştirib tezroq aylanadi: u inersiya momentini kamaytiradi. Oğir ğildirak esa bir marta aylantirilsa, uzoq vaqt töxtamaydi — u katta inersiya momentiga ega.

<div class="lesson-photos">

<SimPhoto name="biellmann-spin" :width="1200" :height="900" alt="Muz ustida bir oyoqda aylanayotgan figurali uçuvçi" caption="Figurali uçuvçi aylanişni qöllari va oyoğini yoyib boşlaydi, söng ularni aylaniş öqiga yaqinlaştiradi: inersiya momenti kamayadi, burçak tezlik esa ortadi." credit="Surat: Kevin Rushforth, &lt;a href=&quot;https://creativecommons.org/licenses/by/3.0&quot;&gt;CC BY 3.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Eliot_Halverson-Biellmann_Spin_2008_Nationals.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Aylanma harakatda kuç örnini kuç momenti $M$, massa örnini inersiya momenti $I$, tezlaniş örnini burçak tezlaniş $\varepsilon$ egallaydi. Nyutonning ikkinçi qonuni aylanma harakat uçun xuddi şunday körinişga ega.

<div class="eq-block">

<span class="eq-label">Aylanma harakat dinamikasi</span><span class="eq-body">$\displaystyle M = I\varepsilon$</span>

<span class="eq-label">Inersiya momenti</span><span class="eq-body">$\displaystyle I_\text{disk} = \frac{MR^2}{2}, \qquad I_\text{halqa} = MR^2$</span>

<span class="eq-label">Yuk va ğildirak</span><span class="eq-body">$\displaystyle ma = mg - T, \quad TR = I\varepsilon, \quad a = \varepsilon R \;\Rightarrow\; a = \frac{mg}{m + I/R^2}$</span>

</div>

Massasi va radiusi bir xil bölsa ham, halqaning inersiya momenti diskdan ikki marta katta: uning butun massasi öqdan $R$ masofada joylaşgan. Şuning uçun yuk halqani sekinroq aylantiradi.

<div class="eq-block">

<span class="eq-label">Energiyaning saqlanişi</span><span class="eq-body">$\displaystyle mgh = \frac{m\upsilon^2}{2} + \frac{I\omega^2}{2}, \qquad \omega = \frac{\upsilon}{R}$</span>

</div>

Tuşayotgan yukning potensial energiyasi ikki qismga bölinadi: bir qismi yukning özining kinetik energiyasiga, qolgani aylanayotgan ğildirakning kinetik energiyasiga aylanadi. “Energiya” grafigida bu ikki çiziqning yiğindisi $mgh$ çiziğiga teng; halqada ğildirakning ulişi diskdagidan katta.

## Sinab köring

1. Disk va halqani bir xil M va R da soliştiring. Qaysi biri tezroq aylanadi?
2. Radiusni ikki marta oşiring. Inersiya momenti neça marta ortadi?
3. Ğildirak massasini kiçraytirib boring. Yukning tezlanişi qaysi qiymatga yaqinlaşadi?

## Masalalar

### 1-masala. Disk

Massasi 2,0 kg, radiusi 0,10 m bölgan bir jinsli diskka ip öralgan, ip uçida 0,50 kg yuk. Yukning tezlanişini va diskning burçak tezlanişini toping.

<SimExample :values='{"shape":0,"M":2,"R":0.1,"m":0.5,"g":9.81}' check="Burçak tezlanişi ε = 32,7 rad/s², inersiya momenti I = 0,0100 kg·m².">

::: details Yeçimni körsatiş

1. $I = \dfrac{MR^2}{2} = 0{,}010\ \text{kg}\cdot\text{m}^2$, $\dfrac{I}{R^2} = 1{,}0\ \text{kg}$.
2. $a = \dfrac{0{,}50 \cdot 9{,}81}{0{,}50 + 1{,}0} = 3{,}27\ \text{m/s}^2$, $\varepsilon = \dfrac{a}{R} = 32{,}7\ \text{rad/s}^2$.

**Javob.** $a = 3{,}27\ \text{m/s}^2$, $\varepsilon = 32{,}7\ \text{rad/s}^2$.

:::

</SimExample>

### 2-masala. Xuddi şunday halqa

Disk örniga massasi va radiusi xuddi şunday yupqa halqa olindi. Yukning tezlanişi qança böladi?

<SimExample :values='{"shape":1,"M":2,"R":0.1,"m":0.5,"g":9.81}' check="Burçak tezlanişi ε = 19,6 rad/s², inersiya momenti I = 0,0200 kg·m².">

::: details Yeçimni körsatiş

1. $I = MR^2 = 0{,}020\ \text{kg}\cdot\text{m}^2$, $\dfrac{I}{R^2} = 2{,}0\ \text{kg}$.
2. $a = \dfrac{4{,}905}{2{,}5} = 1{,}96\ \text{m/s}^2$, $\varepsilon = 19{,}6\ \text{rad/s}^2$.

**Javob.** $a = 1{,}96\ \text{m/s}^2$: halqa sekinroq aylanadi.

:::

</SimExample>

### 3-masala. Inersiya momentini ölçaş

0,50 kg yuk 1,0 m balandlikdan 0,78 s da tuşdi, ğildirak radiusi 0,10 m. Ğildirakning inersiya momentini toping.

<SimExample :values='{"shape":0,"M":2,"R":0.1,"m":0.5,"g":9.81}' check="Yuk 0,78 s da 1,0 m tuşdi.">

::: details Yeçimni körsatiş

1. $a = \dfrac{2h}{t^2} = \dfrac{2{,}0}{0{,}78^2} = 3{,}29\ \text{m/s}^2$.
2. $I = mR^2\left(\dfrac{g}{a} - 1\right) = 0{,}50 \cdot 0{,}010 \cdot (2{,}98 - 1) = 0{,}0099\ \text{kg}\cdot\text{m}^2$ — bu 2 kg li disk.

**Javob.** $I \approx 0{,}010\ \text{kg}\cdot\text{m}^2$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 10-bob](https://openstax.org/books/university-physics-volume-1/pages/10-7-newtons-second-law-for-rotation). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
