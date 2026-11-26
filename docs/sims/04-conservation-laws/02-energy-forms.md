---
title: "Kinetik va potensial energiya"
description: "Siqilgan prujina şarni tik yuqoriga uloqtiradi. Energiya ustunlarida prujinaning elastik energiyasi qanday qilib kinetik energiyaga, u esa potensial energiyaga aylanişini va qaytişini köring."
topic: "Saqlaniş qonunlari · Energiya turlari"
examples: 3
---

# Kinetik va potensial energiya

<SimLab id="energy-forms" />

## Asosiy ğoya

Kamondan otilgan ök, batutda sakrayotgan bola, soat prujinasi — hammasida energiya bir turdan boşqa turga aylanadi. Taranglangan kamon iplari va siqilgan prujina energiya jamğaradi, qöyib yuborilganda bu energiya jismning harakat energiyasiga aylanadi.

Energiya — jismning iş bajara oliş qobiliyati, uning birligi işniki kabi joul. Mexanik energiya ikki xil böladi: harakat energiyasi (kinetik) va özaro taʼsir energiyasi (potensial). Ularning yiğindisi töla mexanik energiya deyiladi.

<div class="lesson-photos">

<SimPhoto name="archer" :width="1200" :height="800" alt="Kamonni tortib, nişonga möljallayotgan kamonçi" caption="Kamonçi ipni tortganda kamon yelkalari egiladi va elastik potensial energiya jamğaradi. Ip qöyib yuborilganda bu energiya ökning kinetik energiyasiga aylanadi." credit="Surat: DoD News Features, &lt;a href=&quot;https://creativecommons.org/licenses/by/2.0&quot;&gt;CC BY 2.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:U.S._Invictus_team_archer_Chasity_Kuczer_takes_aim_during_an_archery_gold_medal_round_at_the_2016_Invictus_Games_(26925974655).jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Harakatlanayotgan jism kinetik energiyaga, Yerdan balandga kötarilgan jism potensial energiyaga, deformatsiyalangan prujina esa elastik deformatsiya potensial energiyasiga ega. Işqalaniş bölmasa, bu energiyalar bir-biriga aylanadi, ularning yiğindisi özgarmaydi.

<div class="eq-block">

<span class="eq-label">Kinetik energiya</span><span class="eq-body">$\displaystyle E_k = \frac{m\upsilon^2}{2}$</span>

<span class="eq-label">Potensial energiya</span><span class="eq-body">$\displaystyle E_p = m g h$</span>

<span class="eq-label">Prujina energiyasi</span><span class="eq-body">$\displaystyle E_\text{pr} = \frac{k x^2}{2}$</span>

<span class="eq-label">Saqlaniş</span><span class="eq-body">$\displaystyle \frac{k x^2}{2} = m g H, \qquad H = \frac{k x^2}{2 m g}$</span>

</div>

Prujina energiyasi siqilişning kvadratiga proporsional: siqilişni ikki marta oşirsak, şar tört marta balandroq uçadi. Prujinadan ajralayotganda şarning tezligi $\upsilon = \sqrt{k x^2/m - 2 g x}$.

Bu ildiz faqat $x > 2mg/k$ bölganda maʼnoga ega: prujina erkin uçigaça çiqqanda şarni kötariş uçun $mgx$ energiya sarflanadi va u $kx^2/2$ dan kiçik bölişi kerak. Siqiliş bundan kiçik bölsa, şar prujinadan ajralmaydi va u bilan birga tebranib, boşlanğiç joyiga qaytadi.

## Sinab köring

1. Siqilişni 0,1 m dan 0,2 m ga oşiring. Kötariliş balandligi neça marta ortadi?
2. “Energiya” grafigida töla energiya çiziğiga qarang: u özgaradimi?
3. Şar eng yuqori nuqtada bölganda qaysi energiya nolga teng? Prujinadan ajralayotganda-çi?

## Masalalar

### 1-masala. Prujinali uloqtirgiç

Bikrligi 500 N/m bölgan prujina 10 sm siqilgan, uning ustida massasi 100 g bölgan şar turibdi. Prujina qöyib yuborilgandan keyin şar boşlanğiç joyidan qanday balandlikka kötariladi?

<SimExample :values='{"k":500,"x":0.1,"m":0.1,"g":9.81}' check="Şar boşlanğiç joyidan 2,55 m balandlikka kötarildi va qaytib prujinaga tuşdi. Prujinadan 6,93 m/s tezlik bilan ajraldi. Töla energiya 2,50 J butun harakat davomida özgarmadi.">

::: details Yeçimni körsatiş

1. Prujina energiyasi: $E = \dfrac{kx^2}{2} = \dfrac{500 \cdot 0{,}10^2}{2} = 2{,}50\ \text{J}$.
2. Eng yuqori nuqtada hammasi potensial energiya: $mgH = E$, $H = \dfrac{2{,}50}{0{,}10 \cdot 9{,}81} = 2{,}55\ \text{m}$.
3. Prujinadan ajralişda: $\upsilon = \sqrt{\dfrac{kx^2}{m} - 2gx} = \sqrt{50 - 1{,}96} = 6{,}93\ \text{m/s}$.

**Javob.** $H = 2{,}55\ \text{m}$, $\upsilon = 6{,}93\ \text{m/s}$.

:::

</SimExample>

### 2-masala. Siqilişni ikki marta oşiriş

Xuddi şu prujina endi 20 sm siqildi. Şar neça marta balandroq kötariladi?

<SimExample :values='{"k":500,"x":0.2,"m":0.1,"g":9.81}' check="Şar boşlanğiç joyidan 10,19 m balandlikka kötarildi va qaytib prujinaga tuşdi. Prujinadan 14,00 m/s tezlik bilan ajraldi. Töla energiya 10,00 J butun harakat davomida özgarmadi.">

::: details Yeçimni körsatiş

1. $E = \dfrac{500 \cdot 0{,}20^2}{2} = 10{,}0\ \text{J}$ — tört marta köp.
2. $H = \dfrac{10{,}0}{0{,}981} = 10{,}19\ \text{m}$: balandlik ham tört marta ortdi, çunki $H \sim x^2$.

**Javob.** $H = 10{,}19\ \text{m}$, tört marta balandroq.

:::

</SimExample>

### 3-masala. Oğir şar

Bikrligi 1000 N/m bölgan prujina 15 sm siqilgan, uning ustida 0,50 kg li şar. Şarning kötariliş balandligini va prujinadan ajralişdagi tezligini toping.

<SimExample :values='{"k":1000,"x":0.15,"m":0.5,"g":9.81}' check="Şar boşlanğiç joyidan 2,29 m balandlikka kötarildi va qaytib prujinaga tuşdi. Prujinadan 6,49 m/s tezlik bilan ajraldi. Töla energiya 11,25 J butun harakat davomida özgarmadi.">

::: details Yeçimni körsatiş

1. $E = \dfrac{1000 \cdot 0{,}15^2}{2} = 11{,}25\ \text{J}$, $H = \dfrac{11{,}25}{0{,}50 \cdot 9{,}81} = 2{,}29\ \text{m}$.
2. $\upsilon = \sqrt{\dfrac{1000 \cdot 0{,}15^2}{0{,}50} - 2 \cdot 9{,}81 \cdot 0{,}15} = \sqrt{45{,}0 - 2{,}94} = 6{,}49\ \text{m/s}$.

**Javob.** $H = 2{,}29\ \text{m}$, $\upsilon = 6{,}49\ \text{m/s}$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 8-bob](https://openstax.org/books/university-physics-volume-1/pages/8-3-conservation-of-energy). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
