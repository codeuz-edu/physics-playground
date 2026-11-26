---
title: "Ölim halqasi"
description: "Aravaça qiyalikdan tuşib vertikal halqaga kiradi. Boşlanğiç balandlikni özgartiring: halqa tepasida tayanç kuçi nolga teng bölişi uçun aravaça kamida 2,5R balandlikdan qöyib yuborilişi kerak."
topic: "Saqlaniş qonunlari · Vertikal aylana böylab harakat"
examples: 3
---

# Ölim halqasi

<SimLab id="loop" />

## Asosiy ğoya

Attraksiondagi “ölim halqasi”da aravaça boşi pastga qarab ham relsdan tuşib ketmaydi. Buning sababi — tezlik: halqa tepasida aravaçaga kerakli markazga intilma kuçni oğirlik kuçi va relsning bosimi birgalikda beradi.

Tezlik yetarli bölmasa, oğirlik kuçi kerakli kuçdan katta böladi va aravaça relsdan ajraladi. Qança balanddan boşlaş kerakligini energiyaning saqlaniş qonuni va Nyutonning ikkinçi qonuni birgalikda aytadi.

<div class="lesson-photos">

<SimPhoto name="vertical-loop" :width="900" :height="1200" :display-width="380" class="tall" alt="Attraksion poyezdi vertikal halqadan ötmoqda" credit="Surat: ThrillZing, &lt;a href=&quot;https://creativecommons.org/licenses/by/4.0&quot;&gt;CC BY 4.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:An_Invertigo_train_through_the_vertical_loop_at_Kings_Island,_April_2002_-_ThrillZing.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali">

Poyezd halqa tepasida teskari turadi, lekin tuşib ketmaydi: bu nuqtada oğirlik kuçi va relsning tayanç kuçi birgalikda uni halqa markaziga qarab tortadi. Buning uçun tepadagi tezlik kamida $\sqrt{gR}$ bölişi kerak.

</SimPhoto>

</div>

## Nazariya

Relsda işqalaniş yöq, şuning uçun mexanik energiya saqlanadi va istalgan balandlikda tezlik $\upsilon^2 = 2g(h - y)$. Halqada aravaçaga oğirlik kuçi va relsning tayanç kuçi taʼsir etadi, ularning markazga yönalgan taşkil etuvçilari markazga intilma tezlaniş beradi.

<div class="eq-block">

<span class="eq-label">Halqa tepasida</span><span class="eq-body">$\displaystyle \frac{m\upsilon^2}{R} = N + mg$</span>

<span class="eq-label">Relsdan ajralmaslik şarti (N ≥ 0)</span><span class="eq-body">$\displaystyle \upsilon_\text{tepa}^2 \ge gR$</span>

<span class="eq-label">Energiyadan</span><span class="eq-body">$\displaystyle mgh = mg\,2R + \frac{m\upsilon_\text{tepa}^2}{2} \;\Rightarrow\; h \ge 2{,}5R$</span>

</div>

Halqa pastida tayanç kuçi eng katta, $N = mg + m\upsilon^2/R$: attraksionda odamni örindiqqa bosadigan “ortiqça yuklaniş” şu. $h$ kiçik bölsa, aravaça halqaning yuqori qismida relsdan ajraladi va parabola böylab tuşadi.

## Sinab köring

1. h ni 2,5R ga teng qiling. Halqa tepasida tayanç kuçi nimaga teng?
2. “Tayanç kuçi” grafigida N qayerda eng katta?
3. Massani özgartiring. Aravaça ajraladigan balandlik özgaradimi?

## Masalalar

### 1-masala. Halqa tepasidagi tayanç kuçi

Massasi 1,0 kg bölgan aravaça 3,0 m balandlikdan qöyib yuborildi, halqa radiusi 1,0 m. Halqa tepasida aravaçaning tezligi va relsning tayanç kuçi qança?

<SimExample :values='{"h":3,"R":1,"m":1,"g":9.81}' check="Aravaça halqadan töla aylanib ötdi. Halqa tepasida tayanç kuçi N = 9,8 N.">

::: details Yeçimni körsatiş

1. $\upsilon^2 = 2g(h - 2R) = 2 \cdot 9{,}81 \cdot 1{,}0 = 19{,}62\ \text{m}^2/\text{s}^2$, $\upsilon = 4{,}43\ \text{m/s}$.
2. $N = \dfrac{m\upsilon^2}{R} - mg = 19{,}62 - 9{,}81 = 9{,}8\ \text{N}$.

**Javob.** $\upsilon = 4{,}43\ \text{m/s}$, $N = 9{,}8\ \text{N}$.

:::

</SimExample>

### 2-masala. Eng kiçik balandlik

Radiusi 0,80 m bölgan halqadan aravaça töla aylanib ötişi uçun uni kamida qanday balandlikdan qöyib yuboriş kerak?

<SimExample :values='{"h":2,"R":0.8,"m":1,"g":9.81}' check="Aravaça halqadan töla aylanib ötdi, tepada tayanç kuçi deyarli nolga teng.">

::: details Yeçimni körsatiş

1. Tepada $N = 0$: $\upsilon^2 = gR$.
2. $mgh = 2mgR + \dfrac{mgR}{2}$, $h = 2{,}5R = 2{,}0\ \text{m}$.

**Javob.** $h = 2{,}0\ \text{m}$.

:::

</SimExample>

### 3-masala. Aravaça qayerda ajraladi?

Aravaça 2,0 m balandlikdan radiusi 1,0 m bölgan halqaga kirdi. U qaysi balandlikda relsdan ajraladi?

<SimExample :values='{"h":2,"R":1,"m":1,"g":9.81}' check="Aravaça 1,67 m balandlikda (φ = 132°) relsdan ajraldi va pastga tuşdi.">

::: details Yeçimni körsatiş

1. Ajraliş nuqtasida $N = 0$: $\dfrac{\upsilon^2}{R} = -g\cos\varphi$, energiyadan $\upsilon^2 = 2g\,(h - R + R\cos\varphi)$.
2. $2(2 - 1 + \cos\varphi) = -\cos\varphi$, $\cos\varphi = -\tfrac{2}{3}$, $\varphi = 132^\circ$.
3. Balandlik $y = R(1 - \cos\varphi) = 1{,}67\ \text{m}$.

**Javob.** $y \approx 1{,}67\ \text{m}$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 8-bob](https://openstax.org/books/university-physics-volume-1/pages/8-3-conservation-of-energy). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
