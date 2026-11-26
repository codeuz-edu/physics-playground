---
title: "Atvud maşinasi"
description: "Qözğalmas blok orqali ötgan ipning uçlariga ikki yuk osilgan. Massalar farqini özgartirib, tezlanişni g dan bir neça marta kiçik qiling va uni vaqt böyiça ölçang: Atvud şu usulda erkin tuşiş tezlanişini aniqlagan."
topic: "Dinamika · Blok orqali boğlangan yuklar"
examples: 3
---

# Atvud maşinasi

<SimLab id="atwood" />

## Asosiy ğoya

1784-yilda ingliz olimi Jorj Atvud erkin tuşiş qonunlarini tekşiriş uçun oddiy asbob yasadi: qözğalmas blok orqali ötgan ipning ikki uçiga deyarli teng massali yuklar osiladi. Erkin tuşayotgan jism bir sekundda 5 m ga yaqin yöl bosadi va uni u davrda ölçaş qiyin edi. Atvud maşinasida esa yuklar bir neça marta sekin harakatlanadi.

Bu asbobda ikki jism bitta ip bilan boğlangan, şuning uçun ularning tezlanişlari moduli bir xil. Har bir yukka ikki kuç taʼsir etadi: oğirlik kuçi pastga va ipning taranglik kuçi yuqoriga. Taranglik kuçi oğir yukning oğirligidan kiçik, yengil yukning oğirligidan esa katta.

<div class="lesson-photos">

<SimPhoto name="atwood-machine" :width="900" :height="1200" :display-width="380" class="tall" alt="Lissabon Fanlar akademiyasi muzeyidagi yoğoç Atvud maşinasi" caption="Lissabondagi muzeyda saqlanayotgan Atvud maşinasi. Tepadagi yengil blok orqali ötgan ipning uçlariga deyarli teng yuklar osiladi; yuklar sekin harakatlangani uçun tuşiş vaqtini oddiy soat bilan ölçaş mumkin bölgan." credit="Surat: GualdimG, &lt;a href=&quot;https://creativecommons.org/licenses/by-sa/4.0&quot;&gt;CC BY-SA 4.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:M%C3%A1quina_de_Atwood_Museu_Maynense,_Academia_das_Ci%C3%AAncias_de_Lisboa_01.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Ip va blok yengil, blok öqida işqalaniş yöq deb hisoblaymiz. Unda ipning ikkala uçida taranglik kuçi bir xil va yuklar bir xil tezlaniş bilan harakatlanadi: oğiri pastga, yengili yuqoriga. Oğir yuk $m_2$ uçun $m_2 a = m_2 g - T$, yengil yuk $m_1$ uçun $m_1 a = T - m_1 g$.

<div class="eq-block">

<span class="eq-label">Tezlaniş</span><span class="eq-body">$\displaystyle a = \frac{m_2 - m_1}{m_1 + m_2}\,g$</span>

<span class="eq-label">Taranglik kuçi</span><span class="eq-body">$\displaystyle T = \frac{2 m_1 m_2}{m_1 + m_2}\,g$</span>

<span class="eq-label">Tinç holatdan h yöl</span><span class="eq-body">$\displaystyle h = \frac{a t^2}{2}, \qquad g = \frac{2h\,(m_1 + m_2)}{(m_2 - m_1)\,t^2}$</span>

</div>

Massalar farqi kiçik bölsa, tezlaniş $g$ dan ança kiçik böladi va yuklarning harakatini oddiy sekundomer bilan ölçaş mumkin. Atvud maşinasining maqsadi ham şu: sekin harakatdan $g$ ni hisoblab topiş.

## Sinab köring

1. m₁ va m₂ ni teng qiling. Ipning taranglik kuçi nimaga teng böladi?
2. Massalar farqini 0,05 kg qiling. Tuşiş vaqtini ölçab, g ni hisoblang.
3. Bitta yukni juda oğir qiling. Tezlaniş qaysi qiymatga yaqinlaşadi, taranglik kuçi-çi?

## Masalalar

### 1-masala. Tezlaniş va taranglik kuçi

Atvud maşinasidagi yuklarning massalari 1,0 kg va 1,5 kg. Oğir yuk poldan 1,0 m balandlikda turibdi. Yuklarning tezlanişini, ipning taranglik kuçini va oğir yukning polga tuşiş vaqtini toping.

<SimExample :values='{"m1":1,"m2":1.5,"h":1,"g":9.81}' check="Oğir yuk 1,01 s dan keyin polga tegdi, tezligi 1,98 m/s. Tezlaniş 1,962 m/s², ipning taranglik kuçi 11,77 N.">

::: details Yeçimni körsatiş

1. $a = \dfrac{1{,}5 - 1{,}0}{2{,}5} \cdot 9{,}81 = 1{,}962\ \text{m/s}^2$.
2. $T = \dfrac{2 \cdot 1{,}0 \cdot 1{,}5}{2{,}5} \cdot 9{,}81 = 11{,}77\ \text{N}$.
3. $t = \sqrt{\dfrac{2h}{a} } = \sqrt{\dfrac{2{,}0}{1{,}962} } = 1{,}01\ \text{s}$, tezlik $\upsilon = a t = 1{,}98\ \text{m/s}$.

**Javob.** $a = 1{,}962\ \text{m/s}^2$, $T = 11{,}77\ \text{N}$, $t = 1{,}01\ \text{s}$.

:::

</SimExample>

### 2-masala. Atvud maşinasida g ni ölçaş

Massalari 0,95 kg va 1,05 kg bölgan yuklar tinç holatdan qöyib yuborildi. Oğir yuk 1,6 m balandlikdan 2,55 s da polga tuşdi. Şu tajribadan erkin tuşiş tezlanişini toping.

<SimExample :values='{"m1":0.95,"m2":1.05,"h":1.6,"g":9.81}' check="Oğir yuk 2,55 s dan keyin polga tegdi, tezligi 1,25 m/s. Tezlaniş 0,491 m/s², ipning taranglik kuçi 9,79 N.">

::: details Yeçimni körsatiş

1. Tezlaniş: $a = \dfrac{2h}{t^2} = \dfrac{3{,}2}{2{,}55^2} = 0{,}492\ \text{m/s}^2$.
2. $a = \dfrac{m_2 - m_1}{m_1 + m_2}\,g$ dan $g = a\,\dfrac{m_1 + m_2}{m_2 - m_1} = 0{,}492 \cdot \dfrac{2{,}00}{0{,}10} = 9{,}84\ \text{m/s}^2$.
3. Vaqt 0,01 s aniqlikda ölçangani uçun natija $9{,}81\ \text{m/s}^2$ dan juda kam farq qiladi.

**Javob.** $g \approx 9{,}8\ \text{m/s}^2$.

:::

</SimExample>

### 3-masala. Atvud maşinasi Oyda

Massalari 1,0 kg va 3,0 kg bölgan yuklar Oyda ($g = 1{,}62\ \text{m/s}^2$) Atvud maşinasiga osildi. Oğir yuk 1,0 m tuşgunça qança vaqt ötadi? Ipning taranglik kuçi qança?

<SimExample :values='{"m1":1,"m2":3,"h":1,"g":1.62}' check="Oğir yuk 1,57 s dan keyin polga tegdi, tezligi 1,27 m/s. Tezlaniş 0,810 m/s², ipning taranglik kuçi 2,43 N.">

::: details Yeçimni körsatiş

1. $a = \dfrac{3{,}0 - 1{,}0}{4{,}0} \cdot 1{,}62 = 0{,}810\ \text{m/s}^2$.
2. $t = \sqrt{\dfrac{2 \cdot 1{,}0}{0{,}810} } = 1{,}57\ \text{s}$.
3. $T = \dfrac{2 \cdot 1{,}0 \cdot 3{,}0}{4{,}0} \cdot 1{,}62 = 2{,}43\ \text{N}$.

**Javob.** $t = 1{,}57\ \text{s}$, $T = 2{,}43\ \text{N}$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 6-bob](https://openstax.org/books/university-physics-volume-1/pages/6-1-solving-problems-with-newtons-laws). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
