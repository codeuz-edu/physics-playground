---
title: "Sunʼiy yöldoş"
description: "Yöldoşni Yer sirtidan istalgan balandlikdan gorizontal yönalişda uçiring. Tezlik kiçik bölsa u qaytib tuşadi, birinçi kosmik tezlikda aylana orbita böylab aylanadi, ikkinçi kosmik tezlikdan katta bölsa Yerni tark etadi."
topic: "Dinamika · Butun olam tortiliş qonuni"
examples: 3
---

# Sunʼiy yöldoş

<SimLab id="satellite" />

## Asosiy ğoya

Nyuton toğ çöqqisidan otilgan töp haqida fikr yuritgan: töp qança tez otilsa, şunça uzoqqa tuşadi. Tezlik yetarliça katta bölsa, töp tuşişga ulgurmaydi — Yer sirti undan “uzoqlaşib” boradi va töp Yer atrofida aylana boşlaydi. Sunʼiy yöldoş ana şunday doimiy “tuşib turuvçi” jism.

1957-yilda birinçi sunʼiy yöldoş uçirildi, bugun esa yuzlab yöldoşlar aloqa, ob-havo va navigatsiya uçun işlaydi. Ularning hammasi Butun olam tortiliş qonuniga böysunadi: orbitaning şakli va davri faqat balandlik va tezlikka boğliq, yöldoşning massasiga emas.

<div class="lesson-photos">

<SimPhoto name="iss-earth-limb" :width="1200" :height="800" alt="Xalqaro kosmik stansiyadan olingan surat: Yer ufqi va atmosferaning yupqa qatlami" caption="Xalqaro kosmik stansiyadan Yer ufqining körinişi. Stansiya taxminan 400 km balandlikda 7,7 km/s tezlik bilan uçadi va Yerni har 92 daqiqada bir marta aylanib çiqadi." credit="Surat: NASA Johnson Space Center, jamoat mulki, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Iss064e006316_(Nov_21,_2020)_---_Earth%27s_limb,_or_horizon,_is_pictured_from_the_International_Space_Station_as_it_orbited_above_the_Pacific_Ocean_off_the_coast_of_Chile.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Ikki jism massalari köpaytmasiga töğri va ular orasidagi masofaning kvadratiga teskari proporsional kuç bilan tortişadi. Yöldoşni aylana orbitada aynan şu kuç uşlab turadi: u markazga intilma kuç vazifasini bajaradi.

<div class="eq-block">

<span class="eq-label">Butun olam tortiliş qonuni</span><span class="eq-body">$\displaystyle F = G\,\frac{m M}{r^2}$</span>

<span class="eq-label">Aylana orbita şarti</span><span class="eq-body">$\displaystyle \frac{m\upsilon^2}{r} = G\,\frac{mM}{r^2}$</span>

<span class="eq-label">Birinçi kosmik tezlik</span><span class="eq-body">$\displaystyle \upsilon_1 = \sqrt{\frac{GM}{R + h} }$</span>

<span class="eq-label">Aylaniş davri</span><span class="eq-body">$\displaystyle T = \frac{2\pi (R + h)}{\upsilon_1}$</span>

<span class="eq-label">Ikkinçi kosmik tezlik</span><span class="eq-body">$\displaystyle \upsilon_2 = \sqrt 2\,\upsilon_1$</span>

</div>

Yer uçun $GM = 3{,}986 \cdot 10^{14}\ \text{m}^3/\text{s}^2$, radiusi $R = 6371\ \text{km}$. Yer sirti yaqinida $\upsilon_1 \approx 7{,}9\ \text{km/s}$, $\upsilon_2 \approx 11{,}2\ \text{km/s}$. Tezlik $\upsilon_1$ va $\upsilon_2$ orasida bölsa, orbita ellips böladi.

Simulyatsiyada havo qarşiligi hisobga olinmagan: 100 km dan yuqorida havo juda siyrak. Agar yöldoş 100 km dan pastga tuşsa, atmosfera uni tormozlab Yerga tuşiradi, şuning uçun simulyatsiya şu yerda töxtaydi.

## Sinab köring

1. 400 km balandlikda tezlikni 7,0 dan 8,5 km/s gaça özgartiring. Orbita şakli qanday özgaradi?
2. Elliptik orbitada yöldoş Yerga yaqinlaşganda tezlik grafigi nimani körsatadi?
3. Balandlikni oşiring. Birinçi kosmik tezlik kamayadimi yoki ortadimi?

## Masalalar

### 1-masala. Xalqaro kosmik stansiya

Xalqaro kosmik stansiya Yer sirtidan 400 km balandlikda aylana orbita böylab harakatlanadi. Uning tezligini va aylaniş davrini toping.

<SimExample :values='{"h":400,"v":7.67}' check="Yöldoş Yer atrofida bir marta aylanib çiqdi: aylaniş davri 1,54 soat (taxminan 92 min).">

::: details Yeçimni körsatiş

1. $r = R + h = 6771\ \text{km}$, $\upsilon_1 = \sqrt{\dfrac{3{,}986 \cdot 10^{14} }{6{,}771 \cdot 10^{6} } } = 7{,}67\ \text{km/s}$.
2. $T = \dfrac{2\pi r}{\upsilon_1} = \dfrac{2\pi \cdot 6771}{7{,}67} = 5545\ \text{s} \approx 92\ \text{min}$.

**Javob.** $\upsilon \approx 7{,}67\ \text{km/s}$, $T \approx 92\ \text{min}$: stansiya bir kunda 15 martadan köp aylanadi.

:::

</SimExample>

### 2-masala. Geostatsionar yöldoş

Aloqa yöldoşi Yer sirtidan 35 800 km balandlikda aylanadi. Uning tezligini va aylaniş davrini toping. Nima uçun bunday yöldoş osmonda bir joyda “turib qolganday” köringadi?

<SimExample :values='{"h":35800,"v":3.07}' check="Simulyatsiya davrni 24 soatga yaqin körsatadi. Aniq aylana orbita uçun tezlik 3,074 km/s bölişi kerak, 3,07 km/s da orbita juda oz çözilgan ellips.">

::: details Yeçimni körsatiş

1. $r = 42\,171\ \text{km}$, $\upsilon_1 = \sqrt{\dfrac{3{,}986 \cdot 10^{14} }{4{,}217 \cdot 10^{7} } } = 3{,}07\ \text{km/s}$.
2. $T = \dfrac{2\pi \cdot 42\,171}{3{,}07} \approx 86\,300\ \text{s} \approx 24\ \text{soat}$.
3. Davr Yerning öz öqi atrofida aylaniş davriga teng, şuning uçun yöldoş ekvator ustida bir joyda turganday köringadi.

**Javob.** $\upsilon \approx 3{,}07\ \text{km/s}$, $T \approx 24\ \text{soat}$.

:::

</SimExample>

### 3-masala. Ikkinçi kosmik tezlik

400 km balandlikdagi jismga qanday eng kiçik tezlik berilsa, u Yerning tortişini yengib, qaytib kelmaydi? Jismga 11,0 km/s tezlik berilsa nima böladi?

<SimExample :values='{"h":400,"v":11}' check="Yöldoş Yerning tortişini yengib, uzoqlaşib ketmoqda: tezlik ikkinçi kosmik tezlikdan katta.">

::: details Yeçimni körsatiş

1. $\upsilon_2 = \sqrt 2\,\upsilon_1 = 1{,}414 \cdot 7{,}67 = 10{,}85\ \text{km/s}$.
2. $11{,}0\ \text{km/s} > 10{,}85\ \text{km/s}$: jism Yerdan uzoqlaşib ketadi.

**Javob.** $\upsilon_2 \approx 10{,}85\ \text{km/s}$; 11,0 km/s da jism Yerni tark etadi.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 13-bob](https://openstax.org/books/university-physics-volume-1/pages/13-4-satellite-orbits-and-energy). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
