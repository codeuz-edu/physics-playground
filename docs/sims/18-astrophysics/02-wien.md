---
title: "Yulduz rangi va yorqinligi"
description: "Yulduzlar qizdirilgan jism kabi nurlanadi. Temperatura ortganda spektr maksimumi qisqa tölqinlar tomon siljiydi va yulduz qizildan oq-kökiş rangga ötadi. Temperatura va radiusni özgartirib, yulduz yorqinligini Quyoşniki bilan soliştiring."
topic: "Astrofizika · Vin va Stefan–Bolsman qonunlari"
examples: 3
---

# Yulduz rangi va yorqinligi

<SimLab id="wien" />

## Asosiy ğoya

Tunda osmonga diqqat bilan qarasak, yulduzlar har xil rangda ekanini köramiz: Betelgeyze qizğiş, Sirius esa oq-kökiş. Temirni qizdirganda ham u avval qizil, keyin sariq va oxiri oq bölib nur soça boşlaydi.

## Nazariya

Qizdirilgan jism hamma tölqin uzunliklarida nurlanadi, lekin nurlaniş eng kuçli bölgan tölqin uzunligi temperaturaga teskari proporsional. Yulduz rangi uning sirti temperaturasini körsatadi.

<div class="eq-block">

<span class="eq-label">Vin siljiş qonuni</span><span class="eq-body">$\displaystyle \lambda_{max} T = b,\quad b = 2{,}898\cdot10^{-3}\ \text{m}\cdot\text{K}$</span>

<span class="eq-label">Stefan–Bolsman qonuni</span><span class="eq-body">$\displaystyle L = 4\pi R^2 \sigma T^4,\quad \sigma = 5{,}67\cdot10^{-8}\ \text{W}/(\text{m}^2\cdot\text{K}^4)$</span>

<span class="eq-label">Quyoş bilan soliştiriş</span><span class="eq-body">$\displaystyle \frac{L}{L_\odot} = \left(\frac{R}{R_\odot}\right)^2\left(\frac{T}{T_\odot}\right)^4,\quad T_\odot = 5772\ \text{K}$</span>

</div>

Qizil gigantlar sovuq, lekin ulkan bölgani uçun Quyoşdan yuzlab marta yorqin. Oq-kökiş yulduzlar issiq: temperatura ikki marta ortsa, har kvadrat metr sirt 16 marta köp energiya nurlantiradi. Grafik 1 m² sirt animatsiya davomida nurlantirgan energiyani $E = \sigma T^4 t$ körsatadi: uning qiyaligi $\sigma T^4$ ga teng.

## Sinab köring

1. Temperaturani ikki marta oşiring: yorqinlik neça marta ortadi?
2. Qaysi temperaturada maksimum qizil rangga töğri keladi?
3. Radiusni 10 marta kamaytiring: yulduz yorqinligi neça marta kamayadi?

## Masalalar

### 1-masala. Quyoş

Quyoş sirti temperaturasi 5772 K. Uning nurlanişi qaysi tölqin uzunligida eng kuçli?

<SimExample :values='{"T":5772,"R":1}' check="λ_max = b/T = 502 nm (yaşil), yorqinlik L = 1,00 L☉.">

::: details Yeçimni körsatiş

1. Vin siljiş qonuni: $\lambda_{max} = \dfrac{b}{T}$, $b = 2{,}898\cdot10^{-3}\ \text{m}\cdot\text{K}$.
2. $\lambda_{max} = \dfrac{2{,}898\cdot10^{-3}}{5772} = 5{,}02\cdot10^{-7}\ \text{m} = 502\ \text{nm}$.
3. Bu körinadigan spektrning yaşil qismi, kök nur bilan çegaraga yaqin.

**Javob.** $\lambda_{max} \approx 502\ \text{nm}$ (yaşil-kök çegaraga yaqin).

:::

</SimExample>

### 2-masala. Qizil gigant

Temperaturasi 3000 K, radiusi 100 Quyoş radiusi bölgan yulduzning nurlaniş maksimumi va yorqinligini toping.

<SimExample :values='{"T":3000,"R":100}' check="λ_max = b/T = 966 nm (infraqizil), yorqinlik L = 730 L☉.">

::: details Yeçimni körsatiş

1. $\lambda_{max} = \dfrac{2{,}898\cdot10^{-3}}{3000} = 966\ \text{nm}$ — infraqizil.
2. $\dfrac{L}{L_\odot} = 100^2 \cdot \left(\dfrac{3000}{5772}\right)^4 = 10^4 \cdot 0{,}073 = 730$.

**Javob.** $\lambda_{max} \approx 966\ \text{nm}$, $L \approx 730\,L_\odot$.

:::

</SimExample>

### 3-masala. Issiq yulduz

Temperaturasi 10 000 K, radiusi 2 R☉ bölgan yulduz uçun λ\_max va yorqinlikni toping.

<SimExample :values='{"T":10000,"R":2}' check="λ_max = b/T = 290 nm (ultrabinafşa), yorqinlik L = 36,04 L☉.">

::: details Yeçimni körsatiş

1. $\lambda_{max} = 290\ \text{nm}$ — ultrabinafşa.
2. $\dfrac{L}{L_\odot} = 4 \cdot 1{,}7325^4 = 4 \cdot 9{,}01 = 36{,}04$.

**Javob.** $\lambda_{max} \approx 290\ \text{nm}$, $L \approx 36\,L_\odot$.

:::

</SimExample>

## Manbalar

Bu mavzu 11-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 3-jild, 6-bob](https://openstax.org/books/university-physics-volume-3/pages/6-1-blackbody-radiation). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
