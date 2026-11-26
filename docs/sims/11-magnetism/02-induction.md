---
title: "Elektromagnit induksiya"
description: "Doimiy magnitni ğaltak içidan ötkazing. Ğaltakdan ötadigan magnit oqimi özgarganda unda EYK hosil böladi va galvanometr strelkasi oğadi. Öramlar sonini, magnitni va uning tezligini özgartiring."
topic: "Magnetizm · Faradey qonuni"
examples: 3
---

# Elektromagnit induksiya

<SimLab id="induction" />

## Asosiy ğoya

1831-yilda Maykl Faradey magnitni ğaltak içiga kiritganda galvanometr strelkasi qisqa vaqtga oğişini payqadi. Bu kaşfiyot elektr generatorlari, transformatorlar va induksion plitalarning asosi böldi: bugun elektr energiyasining deyarli hammasi şu hodisa yordamida olinadi.

## Nazariya

Yopiq kontur orqali ötadigan magnit oqimi özgarsa, konturda induksiya EYK va induksion tok hosil böladi. EYK oqimning özgariş tezligiga va öramlar soniga töğri proporsional.

<div class="eq-block">

<span class="eq-label">Magnit oqimi</span><span class="eq-body">$\displaystyle \Phi = BS\cos\alpha$</span>

<span class="eq-label">Faradey qonuni</span><span class="eq-body">$\displaystyle \mathcal{E}_i = -N\frac{\Delta\Phi}{\Delta t}$</span>

</div>

Magnit ğaltakka yaqinlaşganda oqim ortadi, uzoqlaşganda kamayadi, şuning uçun EYK işorasi almaşadi. Minus işora Lens qoidasini ifodalaydi: induksion tok öz magnit maydoni bilan oqim özgarişiga qarşilik qiladi. Magnit ğaltak içida tinç tursa, oqim özgarmaydi va tok yöq. Rasmda ğaltakning induksion qutblari (N, S) va öramlarning old tomonidagi induksion tok yönalişi körsatilgan.

## Sinab köring

1. Magnit ğaltak markazida turganda EYK nimaga teng va nega?
2. Tezlikni ikki marta oşiring: EYK grafigi qanday özgaradi?
3. Kiriş va çiqişda galvanometr strelkasi qaysi tomonga oğadi?

## Masalalar

### 1-masala. Örtaça EYK

200 öramli ğaltak içiga magnit kiritildi. Har bir öramdan ötadigan oqim 0,4 s da 0 dan 1 mWb gaça ortdi. Örtaça induksiya EYK ni toping.

<SimExample :values='{"N":200,"F":1,"v":0.5}' check="Magnit ğaltakdan ötib ketdi. Kirişda örtaça EYK −0,500 V">

::: details Yeçimni körsatiş

1. Bir öramdagi oqim özgarişi $\Delta\Phi = 1\ \text{mWb} = 10^{-3}\ \text{Wb}$, vaqt $\Delta t = 0{,}4\ \text{s}$: simulyatsiyada magnit 0,5 m/s tezlikda 20 sm yölni 0,4 s da bosib ötadi.
2. $\mathcal{E} = -N\dfrac{\Delta\Phi}{\Delta t} = -200 \cdot \dfrac{10^{-3}}{0{,}4} = -0{,}5\ \text{V}$.
3. Minus işora Lens qoidasini bildiradi: oqim ortmoqda, induksion tok bu ortişga qarşilik qiladi. EYK moduli 0,5 V.

**Javob.** $\mathcal{E} = -0{,}5\ \text{V}$ (moduli 0,5 V).

:::

</SimExample>

### 2-masala. Tezroq

Magnit ikki marta tez kiritildi: oqim xuddi şunça özgariş uçun 0,2 s ketdi. EYK qança?

<SimExample :values='{"N":200,"F":1,"v":1}' check="Magnit ğaltakdan ötib ketdi. Kirişda örtaça EYK −1,000 V">

::: details Yeçimni körsatiş

1. Oqim özgarişi öşa: $\Delta\Phi = 10^{-3}\ \text{Wb}$, vaqt ikki marta kam: $\Delta t = \dfrac{0{,}2\ \text{m}}{1\ \text{m/s}} = 0{,}2\ \text{s}$.
2. $\mathcal{E} = -N\dfrac{\Delta\Phi}{\Delta t} = -200 \cdot \dfrac{10^{-3}}{0{,}2} = -1\ \text{V}$: moduli ikki marta katta.

**Javob.** $\mathcal{E} = -1\ \text{V}$ (moduli 1 V).

:::

</SimExample>

### 3-masala. Köp öramli ğaltak

500 öramli ğaltakda har bir öramdagi oqim 0,25 s da 0,4 mWb ga ortdi. Örtaça EYK qança?

<SimExample :values='{"N":500,"F":0.4,"v":0.8}' check="Magnit ğaltakdan ötib ketdi. Kirişda örtaça EYK −0,800 V">

::: details Yeçimni körsatiş

1. $\Delta\Phi = 0{,}4\ \text{mWb} = 0{,}4\cdot10^{-3}\ \text{Wb}$, $\Delta t = 0{,}25\ \text{s}$ (simulyatsiyada magnit 0,8 m/s tezlikda 20 sm yölni bosib ötadi).
2. $\mathcal{E} = -N\dfrac{\Delta\Phi}{\Delta t} = -500 \cdot \dfrac{0{,}4\cdot10^{-3}}{0{,}25} = -0{,}8\ \text{V}$.

**Javob.** $\mathcal{E} = -0{,}8\ \text{V}$ (moduli 0,8 V).

:::

</SimExample>

## Manbalar

Bu mavzu 11-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 2-jild, 13-bob](https://openstax.org/books/university-physics-volume-2/pages/13-1-faradays-law). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
