---
title: "Issiqlik balansi"
description: "Issiq jismni kalorimetrdagi sovuq suvga soling. Issiq jism bergan issiqlik sovuq suv olgan issiqlikka teng va ikkalasi bir xil temperaturaga keladi. Jism moddasini, massalar va temperaturalarni özgartiring."
topic: "Termodinamika · Issiqlik miqdori"
examples: 3
---

# Issiqlik balansi

<SimLab id="heat-balance" />

## Asosiy ğoya

Çoyga sovuq suv qöşsak, u iliq bölib qoladi; issiq ovqatga temir qoşiq solsak, qoşiq qiziydi, ovqat esa biroz soviydi. Bu jarayonlarda energiya yöqolmaydi, faqat bir jismdan boşqasiga ötadi. Buni issiqlik balansi tenglamasi ifodalaydi.

## Nazariya

Issiqlik issiq jismdan sovuq jismga, ularning temperaturalari tenglaşgunça uzatiladi. Kalorimetr issiqlikni taşqariga çiqarmaydi, şuning uçun issiq jism bergan issiqlik sovuq suv olgan issiqlikka teng.

<div class="eq-block">

<span class="eq-label">Issiqlik miqdori</span><span class="eq-body">$\displaystyle Q = c m \Delta t$</span>

<span class="eq-label">Issiqlik balansi</span><span class="eq-body">$\displaystyle c_1 m_1 (t_1 - \theta) = c_2 m_2 (\theta - t_2)$</span>

<span class="eq-label">Umumiy temperatura</span><span class="eq-body">$\displaystyle \theta = \frac{c_1 m_1 t_1 + c_2 m_2 t_2}{c_1 m_1 + c_2 m_2}$</span>

</div>

Soliştirma issiqlik siğimi katta bölgan modda kiçik temperatura özgarişida köp issiqlik beradi yoki oladi. Suvning soliştirma issiqlik siğimi metallarnikidan bir neça marta katta, şuning uçun qaynoq metall jism suvni ozgina isitadi.

Bu yerda kalorimetr idişining özi olgan issiqlik hisobga olinmagan: idiş juda yengil deb hisoblanadi.

## Sinab köring

1. Issiq va sovuq suv massalarini teng qiling: θ qayerda böladi?
2. Temir va mis jismlarni soliştiring: qaysi biri suvni köproq isitadi?
3. Nega ikkala grafik bir xil vaqtda tenglaşadi?

## Masalalar

### 1-masala. Issiq va sovuq suv

80 °C li 0,5 kg suv 20 °C li 1 kg suvga quyildi. Aralaşmaning temperaturasini va issiq suv bergan issiqlikni toping.

<SimExample :values='{"body":0,"m1":0.5,"T1":80,"m2":1,"T2":20}' check="Issiqlik muvozanati: umumiy temperatura θ = 40,0 °C. Issiq suv Q = 84,00 kJ">

::: details Yeçimni körsatiş

1. $\theta = \dfrac{0{,}5 \cdot 80 + 1 \cdot 20}{1{,}5} = 40\ ^\circ\text{C}$.
2. $Q = 4200 \cdot 0{,}5 \cdot (80 - 40) = 84\,000\ \text{J}$.

**Javob.** $\theta = 40\ ^\circ\text{C}$, $Q = 84\ \text{kJ}$.

:::

</SimExample>

### 2-masala. Mis jism

100 °C gaça qizdirilgan 0,5 kg mis jism 20 °C li 1 kg suvga solindi. Umumiy temperatura qança böladi?

<SimExample :values='{"body":1,"m1":0.5,"T1":100,"m2":1,"T2":20}' check="Issiqlik muvozanati: umumiy temperatura θ = 23,6 °C. Mis jism Q = 15,27 kJ">

::: details Yeçimni körsatiş

1. $c_1 m_1 = 400 \cdot 0{,}5 = 200\ \text{J/K}$, $c_2 m_2 = 4200\ \text{J/K}$.
2. $\theta = \dfrac{200 \cdot 100 + 4200 \cdot 20}{4400} = 23{,}6\ ^\circ\text{C}$; $Q = 200 \cdot 76{,}36 = 15{,}27\ \text{kJ}$.

**Javob.** $\theta \approx 23{,}6\ ^\circ\text{C}$, $Q \approx 15{,}27\ \text{kJ}$.

:::

</SimExample>

### 3-masala. Alyuminiy jism

Xuddi şu tajriba 0,5 kg alyuminiy jism bilan takrorlandi. Suv mis jismdagidan köproq isiydimi?

<SimExample :values='{"body":2,"m1":0.5,"T1":100,"m2":1,"T2":20}' check="Issiqlik muvozanati: umumiy temperatura θ = 27,9 °C. Alyuminiy jism Q = 33,17 kJ">

::: details Yeçimni körsatiş

1. $c_1 m_1 = 920 \cdot 0{,}5 = 460\ \text{J/K}$.
2. $\theta = \dfrac{460 \cdot 100 + 4200 \cdot 20}{4660} = 27{,}9\ ^\circ\text{C}$; $Q = 460 \cdot 72{,}1 = 33{,}17\ \text{kJ}$.

**Javob.** $\theta \approx 27{,}9\ ^\circ\text{C}$: alyuminiyning soliştirma issiqlik siğimi katta, suv köproq isiydi.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 2-jild, 1-bob](https://openstax.org/books/university-physics-volume-2/pages/1-4-heat-transfer-specific-heat-and-calorimetry). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
