---
title: "Bernulli qonuni"
description: "Suv quvurning keng qismidan tor qismiga oqib ötadi. Tor joyda suv tezroq oqadi, bosim esa kamayadi — buni manometr naylaridagi suv sathlari körsatadi. Belgilangan zarraning tezligi va bosimini grafiklarda kuzating."
topic: "Suyuqliklar mexanikasi · Uzluksizlik tenglamasi va Bernulli qonuni"
examples: 3
---

# Bernulli qonuni

<SimLab id="bernoulli" />

## Asosiy ğoya

Boğdagi şlangning uçini barmoq bilan qisib qöysangiz, suv ança uzoqqa otiladi: tor teşikdan suv tezroq oqib çiqadi. Daryoning tor joylarida ham oqim tezlaşadi.

1738-yilda Daniil Bernulli oqayotgan suyuqlikning tezligi bilan bosimi orasidagi boğlanişni aniqladi. Bu qonun purkagiçlar, samolyot qanoti va kuçli şamolda tomlarning kötarilib ketişini tuşuntiradi.

<div class="lesson-photos">

<SimPhoto name="smoke-tunnel" :width="1200" :height="947" alt="NASA laboratoriyasidagi tutunli aerodinamik quvur" caption="Tutunli aerodinamik quvurda havo oqimiga ingiçka tutun izlari qöşiladi va oqim çiziqlari körinadigan böladi. Oqim çiziqlari ziçlaşgan joyda havo tezroq oqadi va bosim kamayadi." credit="Surat: NASA, Roger Brimmer va Tom Trower, jamoat mulki, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Ames_Smoke_Tunnel_-_GPN-2000-001815.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Siqilmaydigan suyuqlik quvurda uzluksiz oqadi: har sekundda quvurning istalgan kesimidan bir xil hajm ötadi. Şuning uçun kesim yuzasi kiçik joyda suyuqlik tezroq oqadi.

<div class="eq-block">

<span class="eq-label">Uzluksizlik tenglamasi</span><span class="eq-body">$\displaystyle S_1\upsilon_1 = S_2\upsilon_2$</span>

<span class="eq-label">Bernulli tenglamasi (gorizontal quvur)</span><span class="eq-body">$\displaystyle p_1 + \frac{\rho\upsilon_1^2}{2} = p_2 + \frac{\rho\upsilon_2^2}{2}$</span>

<span class="eq-label">Manometrdagi ustun</span><span class="eq-body">$\displaystyle h = \frac{p}{\rho g}$</span>

</div>

Tezlik ortgan joyda bosim kamayadi: suyuqlik tezlanişi uçun orqadagi bosim oldindagidan katta bölişi kerak. Bu yerda $p$ — manometrik bosim, yaʼni bosimning atmosfera bosimidan ortiqça qismi. Absolut bosim esa suvning töyingan buğ bosimidan (20 °C da 2,34 kPa) kiçik bölmaydi: tor joyda tezlik juda katta bölsa, suv qaynab, buğ pufakçalari hosil böladi (kavitatsiya). Simulyatsiyada quvur körinarli bölişi uçun kattalaştirib çizilgan, manometrlardagi suv ustunlari esa haqiqiy balandlikda.

## Sinab köring

1. Tor qism yuzasini kiçraytiring. Qaysi manometrda suv sathi tuşadi va nima uçun?
2. Tezlikni ikki marta oşiring. Bosimlar farqi qança marta ortadi?
3. S₂ ni S₁ dan katta qiling. Endi kengaygan joyda bosim qanday özgaradi?

## Masalalar

### 1-masala. Quvurning tor joyi

Kesim yuzasi 20 sm² bölgan quvurda suv 0,6 m/s tezlik bilan oqmoqda, bosim 5 kPa. Kesim yuzasi 5 sm² bölgan tor joyda suvning tezligi va bosimi qança? Manometrlardagi suv sathlari qançaga farq qiladi?

<SimExample :values='{"v1":0.6,"S1":20,"S2":5,"p1":5}' check="Zarra quvurdan ötdi. Tor qismda tezlik 4,0 marta ortdi (υ₂ = 2,40 m/s), bosim esa 5,00 kPa dan 2,30 kPa gaça kamaydi. Manometrlardagi suv sathlari farqi Δh = 27,5 sm.">

::: details Yeçimni körsatiş

1. $\upsilon_2 = \upsilon_1 \dfrac{S_1}{S_2} = 0{,}6 \cdot \dfrac{20}{5} = 2{,}4\ \text{m/s}$.
2. $p_2 = p_1 - \dfrac{\rho(\upsilon_2^2 - \upsilon_1^2)}{2} = 5000 - \dfrac{1000\,(5{,}76 - 0{,}36)}{2} = 2300\ \text{Pa}$.
3. $\Delta h = \dfrac{p_1 - p_2}{\rho g} = \dfrac{2700}{9810} = 0{,}275\ \text{m}$.

**Javob.** $\upsilon_2 = 2{,}4\ \text{m/s}$, $p_2 = 2{,}3\ \text{kPa}$, $\Delta h \approx 27{,}5\ \text{sm}$.

:::

</SimExample>

### 2-masala. Suv sarfi

Suv yuzasi 30 sm² bölgan quvurdan 1 m/s tezlik va 10 kPa bosim bilan yuzasi 10 sm² bölgan qismga ötadi. Tor qismdagi tezlik va bosimni toping. Quvurdan har sekundda qança suv oqib ötadi?

<SimExample :values='{"v1":1,"S1":30,"S2":10,"p1":10}' check="Zarra quvurdan ötdi. Tor qismda tezlik 3,0 marta ortdi (υ₂ = 3,00 m/s), bosim esa 10,00 kPa dan 6,00 kPa gaça kamaydi. Manometrlardagi suv sathlari farqi Δh = 40,8 sm.">

::: details Yeçimni körsatiş

1. $\upsilon_2 = 1 \cdot \dfrac{30}{10} = 3\ \text{m/s}$.
2. $p_2 = 10\,000 - \dfrac{1000\,(9 - 1)}{2} = 6000\ \text{Pa} = 6\ \text{kPa}$.
3. Suv sarfi $Q = S_1\upsilon_1 = 30 \cdot 10^{-4} \cdot 1 = 3 \cdot 10^{-3}\ \text{m}^3/\text{s} = 3\ \text{l/s}$.

**Javob.** $\upsilon_2 = 3\ \text{m/s}$, $p_2 = 6\ \text{kPa}$, $Q = 3\ \text{l/s}$.

:::

</SimExample>

### 3-masala. Venturi suv ölçagiçi

Venturi suv ölçagiçining manometr naylarida suv sathlari farqi 22 sm. Quvurning keng qismi yuzasi 20 sm², tor qismi 10 sm². Suvning keng qismdagi tezligini va suv sarfini toping.

<SimExample :values='{"v1":1.2,"S1":20,"S2":10,"p1":8}' check="Zarra quvurdan ötdi. Tor qismda tezlik 2,0 marta ortdi (υ₂ = 2,40 m/s), bosim esa 8,00 kPa dan 5,84 kPa gaça kamaydi. Manometrlardagi suv sathlari farqi Δh = 22,0 sm.">

::: details Yeçimni körsatiş

1. $\Delta p = \rho g \Delta h = 1000 \cdot 9{,}81 \cdot 0{,}22 = 2158\ \text{Pa}$.
2. $\upsilon_2 = 2\upsilon_1$, şuning uçun $\Delta p = \dfrac{\rho(4\upsilon_1^2 - \upsilon_1^2)}{2} = 1{,}5\,\rho\upsilon_1^2$.
3. $\upsilon_1 = \sqrt{\dfrac{2158}{1500}} = 1{,}2\ \text{m/s}$, $Q = 20 \cdot 10^{-4} \cdot 1{,}2 = 2{,}4 \cdot 10^{-3}\ \text{m}^3/\text{s} = 2{,}4\ \text{l/s}$.

**Javob.** $\upsilon_1 \approx 1{,}2\ \text{m/s}$, $Q \approx 2{,}4\ \text{l/s}$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 14-bob](https://openstax.org/books/university-physics-volume-1/pages/14-6-bernoullis-equation). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
