---
title: "Ip bilan boğlangan jismlar"
description: "Stol ustidagi brusok blok orqali ötgan ip bilan osilgan yukka boğlangan. Massalarni va işqalanişni özgartiring: tezlaniş va ipning taranglik kuçi qanday özgarişini köring."
topic: "Dinamika · Boğlangan jismlar harakati"
examples: 3
---

# Ip bilan boğlangan jismlar

<SimLab id="connected" />

## Asosiy ğoya

Yuk kötaruvçi kran, tortib ketilayotgan tirkama, blok orqali ötkazilgan ipga osilgan yuk: bularning hammasida bir neçta jism ip yoki arqon bilan boğlangan. Bunday jismlar birgalikda harakatlanadi, ularning tezlanişlari moduli bir xil böladi.

Masalani yeçişning kaliti — har bir jismni alohida köriş. Har bir jismga taʼsir etuvçi kuçlarni çizamiz va Nyutonning ikkinçi qonunini yozamiz. Ipning taranglik kuçi $T$ ikkala tenglamada ham qatnaşadi, tenglamalarni qöşsak, u qisqarib ketadi va tezlaniş topiladi.

<div class="lesson-photos">

<SimPhoto name="tugboat-tow" :width="1200" :height="901" alt="Antverpen portida yuk kemasini tortib ketayotgan buksir" caption="Buksir katta kemani arqon orqali tortadi. Arqon tarang bölganda buksir va kema birgalikda bir xil tezlaniş bilan harakatlanadi, arqondagi taranglik kuçi esa kemani tezlatişga sarflanadi." credit="Surat: Alf van Beem, &lt;a href=&quot;https://creativecommons.org/publicdomain/zero/1.0/&quot;&gt;CC0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:42_(tugboat,_2012)_towing_Genius_Star_through_the_Port_of_Antwerp_pic2.JPG&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Ip çözilmaydi, şuning uçun ikkala jism bir xil tezlaniş bilan harakatlanadi. Ip va blok yengil, blok öqi işqalanişsiz deb hisoblansa, ipning taranglik kuçi $T$ uning hamma nuqtasida bir xil. Har bir jism uçun Nyutonning ikkinçi qonunini alohida yozamiz:

<div class="eq-block">

<span class="eq-label">Stoldagi brusok</span><span class="eq-body">$\displaystyle m_1 a = T - \mu m_1 g$</span>

<span class="eq-label">Osilgan yuk</span><span class="eq-body">$\displaystyle m_2 a = m_2 g - T$</span>

<span class="eq-label">Tezlaniş</span><span class="eq-body">$\displaystyle a = \frac{(m_2 - \mu m_1)\,g}{m_1 + m_2}$</span>

<span class="eq-label">Taranglik kuçi</span><span class="eq-body">$\displaystyle T = m_2\,(g - a)$</span>

</div>

Yuk tezlaniş bilan tuşadi, şuning uçun ipning taranglik kuçi yukning oğirlik kuçidan kiçik: $T < m_2 g$. Agar $m_2 g \le \mu m_1 g$ bölsa, tinçlikdagi işqalaniş kuçi sistemani uşlab turadi va jismlar qözğalmaydi.

## Sinab köring

1. μ = 0 da m₁ ni kattalaştiring. Tezlaniş va taranglik kuçi qanday özgaradi?
2. m₂ ni m₁ dan ança katta qiling. Tezlaniş qaysi qiymatga yaqinlaşadi va nima uçun g dan oşmaydi?
3. Oyni tanlang. Tezlaniş kamayadi, lekin T / m₂g nisbati özgaradimi?

## Masalalar

### 1-masala. Işqalanişsiz stoldagi brusok

Massasi 2,0 kg bölgan brusok silliq gorizontal stolda yotibdi. U stol çetidagi blok orqali ötgan ip bilan massasi 1,0 kg bölgan yukka boğlangan. Sistemaning tezlanişini va ipning taranglik kuçini toping. Yuk 1,0 m balandlikdan qança vaqtda polga tuşadi?

<SimExample :values='{"m1":2,"m2":1,"mu":0,"g":9.81}' check="Yuk 0,78 s dan keyin polga tegdi, tezligi 2,56 m/s. Ipning taranglik kuçi T = 6,54 N.">

::: details Yeçimni körsatiş

1. Ikkala tenglamani qöşamiz: $(m_1 + m_2)\,a = m_2 g$, demak $a = \dfrac{1{,}0 \cdot 9{,}81}{3{,}0} = 3{,}27\ \text{m/s}^2$.
2. Taranglik kuçi: $T = m_2 (g - a) = 1{,}0\,(9{,}81 - 3{,}27) = 6{,}54\ \text{N}$.
3. Tinç holatdan $h = \dfrac{a t^2}{2}$, demak $t = \sqrt{\dfrac{2h}{a} } = \sqrt{\dfrac{2 \cdot 1{,}0}{3{,}27} } = 0{,}78\ \text{s}$, tezlik $\upsilon = a t = 2{,}56\ \text{m/s}$.

**Javob.** $a = 3{,}27\ \text{m/s}^2$, $T = 6{,}54\ \text{N}$, $t = 0{,}78\ \text{s}$.

:::

</SimExample>

### 2-masala. Işqalaniş bilan

Stoldagi brusokning massasi 4,0 kg, osilgan yukning massasi 1,5 kg, brusok va stol orasidagi işqalaniş koeffitsiyenti 0,20. Tezlanişni, taranglik kuçini va yuk 1,0 m tuşgandagi tezlikni toping.

<SimExample :values='{"m1":4,"m2":1.5,"mu":0.2,"g":9.81}' check="Yuk 1,27 s dan keyin polga tegdi, tezligi 1,58 m/s. Ipning taranglik kuçi T = 12,84 N.">

::: details Yeçimni körsatiş

1. $a = \dfrac{(m_2 - \mu m_1)\,g}{m_1 + m_2} = \dfrac{(1{,}5 - 0{,}20 \cdot 4{,}0) \cdot 9{,}81}{5{,}5} = 1{,}25\ \text{m/s}^2$.
2. $T = m_2 (g - a) = 1{,}5\,(9{,}81 - 1{,}25) = 12{,}84\ \text{N}$.
3. $\upsilon = \sqrt{2 a h} = \sqrt{2 \cdot 1{,}25 \cdot 1{,}0} = 1{,}58\ \text{m/s}$.

**Javob.** $a = 1{,}25\ \text{m/s}^2$, $T = 12{,}84\ \text{N}$, $\upsilon = 1{,}58\ \text{m/s}$.

:::

</SimExample>

### 3-masala. Sistema qözğaladimi?

Massasi 5,0 kg bölgan brusok 1,0 kg li yukka boğlangan, işqalaniş koeffitsiyenti 0,30. Sistema harakatga keladimi? Brusokni joyidan qözğatiş uçun yukning massasi kamida qança bölişi kerak?

<SimExample :values='{"m1":5,"m2":1,"mu":0.3,"g":9.81}' check="Sistema qözğalmadi: m₂g = 9,8 N tinçlikdagi işqalaniş kuçining eng katta qiymati μm₁g = 14,7 N dan oşmaydi. Endi m₂ = 1,6 kg qilib köring.">

::: details Yeçimni körsatiş

1. Yukni pastga tortuvçi kuç $m_2 g = 9{,}81\ \text{N}$, tinçlikdagi işqalaniş kuçining eng katta qiymati $\mu m_1 g = 0{,}30 \cdot 5{,}0 \cdot 9{,}81 = 14{,}7\ \text{N}$.
2. $9{,}81\ \text{N} < 14{,}7\ \text{N}$, demak sistema qözğalmaydi, işqalaniş kuçi $9{,}81\ \text{N}$ ga teng.
3. Harakat $m_2 g > \mu m_1 g$, yaʼni $m_2 > \mu m_1 = 1{,}5\ \text{kg}$ bölganda boşlanadi.

**Javob.** Qözğalmaydi; yukning massasi $1{,}5\ \text{kg}$ dan katta bölişi kerak.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 6-bob](https://openstax.org/books/university-physics-volume-1/pages/6-1-solving-problems-with-newtons-laws). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
