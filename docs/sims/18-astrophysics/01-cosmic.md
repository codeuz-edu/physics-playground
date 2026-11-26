---
title: "Kosmik tezliklar"
description: "Jismni planeta sirtidan yoki baland “Nyuton toği”dan gorizontal otamiz (havo qarşiligi yöq). Kiçik tezlikda u qaytib tuşadi, birinçi kosmik tezlikda aylana orbita çizadi, kattaroq tezlikda ellips, ikkinçi kosmik tezlikda esa butunlay uzoqlaşadi."
topic: "Astrofizika · Sunʼiy yöldoşlar va orbitalar"
examples: 3
---

# Kosmik tezliklar

<SimLab id="cosmic" />

## Asosiy ğoya

1957-yil 4-oktabrda birinçi sunʼiy yöldoş orbitaga çiqarildi, 1961-yil 12-aprelda esa Yuriy Gagarin Yer atrofini 108 minutda aylanib çiqdi. Oyga va boşqa sayyoralarga uçiş uçun ikkinçi kosmik tezlikka yaqin tezlik kerak.

## Nazariya

Gorizontal otilgan jism tuşayotganda planeta sirti ham uning ostidan “qoçib” boradi. Tezlik yetarli bölsa, jism sirtga heç qaçon yetib kelmaydi — u orbitaga çiqadi. Bunda tortiş kuçi markazga intilma kuç vazifasini bajaradi.

<div class="eq-block">

<span class="eq-label">Birinçi kosmik tezlik</span><span class="eq-body">$\displaystyle \upsilon_1 = \sqrt{\frac{GM}{R}} = \sqrt{gR}$</span>

<span class="eq-label">Ikkinçi kosmik tezlik</span><span class="eq-body">$\displaystyle \upsilon_2 = \sqrt{\frac{2GM}{R}} = \sqrt2\,\upsilon_1$</span>

<span class="eq-label">Orbita davri</span><span class="eq-body">$\displaystyle T = 2\pi\sqrt{\frac{a^3}{GM}}$</span>

</div>

Yer uçun $\upsilon_1 \approx 7{,}9$ km/s, $\upsilon_2 \approx 11{,}2$ km/s. Ellips orbitada $a$ — katta yarim öq. Haqiqiy raketalar havo qarşiligidan qutuliş uçun avval balandlikka kötariladi.

Jismni $h_0$ balandlikdagi “Nyuton toği”dan otsak, formulalarda $R$ örniga $R + h_0$ olinadi. Sirtdan gorizontal otilgan jism $\upsilon_0 < \upsilon_1$ bölsa darhol sirtga tegadi; toğdan otilganda esa u egri yöl böylab uçib, sirtga qaytib tuşadi yoki (tezlik $\upsilon_1$ ga yaqin bölsa) sirtga yetmay ellips çizadi.

## Sinab köring

1. Oy uçun birinçi kosmik tezlik qança?
2. Tezlikni 10 km/s qiling: orbita qanday özgaradi?
3. Nega ellips orbitada tezlik doimiy emas?

## Masalalar

### 1-masala. Birinçi kosmik tezlik

Yer uçun birinçi kosmik tezlikni va Yer sirti yaqinidagi orbita davrini toping ($GM = 3{,}986\cdot10^{14}$ m³/s², $R = 6371$ km).

<SimExample :values='{"pl":0,"v":7.91,"h0":0}' check="υ₀ ≈ υ₁ = √(GM/R) = 7,91 km/s: jism aylana orbita böylab harakatlanadi, davri 84 min.">

::: details Yeçimni körsatiş

1. $\upsilon_1 = \sqrt{\dfrac{3{,}986\cdot10^{14}}{6{,}371\cdot10^6}} = 7{,}91\ \text{km/s}$.
2. $T = \dfrac{2\pi R}{\upsilon_1} = 5061\ \text{s} \approx 84\ \text{min}$.

**Javob.** $\upsilon_1 \approx 7{,}91\ \text{km/s}$, $T \approx 84\ \text{min}$.

:::

</SimExample>

### 2-masala. Ellips orbita

Jism 9 km/s tezlik bilan gorizontal otildi. Orbitaning eng uzoq nuqtasi Yer markazidan qança uzoqda va davri qança?

<SimExample :values='{"pl":0,"v":9,"h0":0}' check="Orbita ellips: eng uzoq nuqtasi markazdan 1,84 R masofada, davri 142 min.">

::: details Yeçimni körsatiş

1. $r_a = R\dfrac{\upsilon^2}{\upsilon_2^2 - \upsilon^2} = R\dfrac{81}{125{,}13 - 81} = 1{,}84R$.
2. $a = \dfrac{R + r_a}{2} = 1{,}42R$, $T = 84{,}3 \cdot 1{,}42^{1{,}5} = 142\ \text{min}$.

**Javob.** $r_a \approx 1{,}84R$, $T \approx 142\ \text{min}$.

:::

</SimExample>

### 3-masala. Ikkinçi kosmik tezlik

Jism 11,2 km/s tezlik bilan otildi. U Yerga qaytadimi?

<SimExample :values='{"pl":0,"v":11.2,"h0":0}' check="υ₀ ≥ υ₂ = √(2GM/R) = 11,19 km/s: jism tortişni yengib, uzoqlaşib ketadi.">

::: details Yeçimni körsatiş

1. Ikkinçi kosmik tezlik: $\upsilon_2 = \sqrt{\dfrac{2GM}{R}} = \sqrt2\,\upsilon_1$.
2. $\upsilon_2 = 1{,}414 \cdot 7{,}91 = 11{,}19\ \text{km/s}$.
3. $11{,}2\ \text{km/s} > 11{,}19\ \text{km/s}$: tezlik ikkinçi kosmik tezlikdan katta.

**Javob.** Qaytmaydi: jism Yer tortişidan çiqib ketadi.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 13-bob](https://openstax.org/books/university-physics-volume-1/pages/13-3-gravitational-potential-energy-and-total-energy). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
