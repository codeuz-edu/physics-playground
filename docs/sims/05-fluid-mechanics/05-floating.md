---
title: "Jismlarning suziş şartlari"
description: "Kubni suyuqlik içida qöyib yuboring: u suzib çiqadimi, çökadimi yoki muallaq turadimi? Natija jism va suyuqlik ziçliklarining nisbatiga boğliq. Suzayotgan jismning qança qismi botişini ham şu nisbat belgilaydi."
topic: "Suyuqliklar mexanikasi · Jismlarning suzişi"
examples: 3
---

# Jismlarning suziş şartlari

<SimLab id="floating" />

## Asosiy ğoya

Pölat kema suvda suzadi, kiçkina mix esa çökadi. Muz suvda suzadi, lekin uning köp qismi suv ostida böladi: aysbergning faqat kiçik qismi körinadi, qolgan katta qismi suv ostida yaşiringan.

Jism suzadimi yoki çökadimi — buni uning massasi emas, ziçligi hal qiladi. Kema uçun bu uning içidagi havo bilan birga hisoblangan örtaça ziçligi: u suvnikidan kiçik, şuning uçun kema suzadi.

<div class="lesson-photos">

<SimPhoto name="iceberg" :width="1200" :height="675" alt="Tinç dengizda suzayotgan aysberg, suv ostidagi qismi ham körinib turibdi" caption="Dengiz tinç bölganda aysbergning suv ostidagi qismini ham körsa böladi. Muz va dengiz suvi ziçliklarining nisbati 0,9 ga yaqin, şuning uçun aysbergning katta qismi suv ostida yaşiringan." credit="Surat: AWeith, &lt;a href=&quot;https://creativecommons.org/licenses/by-sa/4.0&quot;&gt;CC BY-SA 4.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Iceberg_in_the_Arctic_with_its_underside_exposed.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Suyuqlik içidagi jismga ikki kuç taʼsir qiladi: pastga oğirlik kuçi $mg = \rho g V$ va yuqoriga Arximed kuçi $F_A = \rho_\text{s} g V$. Jism töla botganda ularni soliştirsak, faqat ziçliklar qoladi.

<div class="eq-block">

<span class="eq-label">Çökadi</span><span class="eq-body">$\rho > \rho_\text{s}$, $F_A < mg$</span>

<span class="eq-label">Muallaq turadi</span><span class="eq-body">$\rho = \rho_\text{s}$, $F_A = mg$</span>

<span class="eq-label">Suzib çiqadi</span><span class="eq-body">$\rho < \rho_\text{s}$, $F_A > mg$</span>

<span class="eq-label">Suzayotgan jismning botgan qismi</span><span class="eq-body">$\displaystyle \frac{V_\text{b}}{V} = \frac{\rho}{\rho_\text{s}}$</span>

</div>

Suzib çiqayotgan jismning bir qismi suyuqlikdan çiqadi va Arximed kuçi kamayadi. U oğirlik kuçiga tenglaşganda jism suzib yuradi: jism siqib çiqargan suyuqlikning oğirligi jismning oğirligiga teng. Bu nisbat $g$ ga boğliq emas.

## Sinab köring

1. Jism ziçligini asta-sekin oşiring. Qaysi qiymatdan boşlab jism suvda suzmay qoladi?
2. Muzni dengiz suvidan kerosinga ötkazing. Nima böladi va nima uçun?
3. Sayyorani almaştiring. Suzayotgan jismning botgan qismi özgaradimi? Kuçlar-çi?

## Masalalar

### 1-masala. Qarağay kub

Qirrasi 20 sm bölgan qarağay kub (ziçligi 500 kg/m³) suvga tuşirildi. U suzadimi? Kubning qança qismi suvga botadi? Arximed kuçi qança?

<SimExample :values='{"rhoB":500,"liq":0,"a":20,"g":9.81}' check="Jism suzib yuribdi: hajmining 50 % qismi suyuqlikka botgan, bu jism va suyuqlik ziçliklarining nisbatiga teng (0,50). Arximed kuçi oğirlik kuçini muvozanatlaydi: Fₐ = mg = 39,2 N.">

::: details Yeçimni körsatiş

1. $\rho = 500 < \rho_\text{s} = 1000$, şuning uçun kub suzib çiqadi.
2. Suzib yurganda $F_A = mg$: $\rho_\text{s} g V_\text{b} = \rho g V$, $\dfrac{V_\text{b}}{V} = \dfrac{500}{1000} = 0{,}5$ — kub 10 sm botadi.
3. $F_A = mg = 500 \cdot 0{,}008 \cdot 9{,}81 = 39{,}2\ \text{N}$.

**Javob.** Suzadi, hajmining 50 % i (10 sm) botadi, $F_A = 39{,}2\ \text{N}$.

:::

</SimExample>

### 2-masala. Aysberg

Muzning ziçligi 900 kg/m³, dengiz suviniki 1030 kg/m³. Aysberg hajmining qança qismi suv ostida böladi?

<SimExample :values='{"rhoB":900,"liq":1,"a":20,"g":9.81}' check="Jism suzib yuribdi: hajmining 87 % qismi suyuqlikka botgan, bu jism va suyuqlik ziçliklarining nisbatiga teng (0,87). Arximed kuçi oğirlik kuçini muvozanatlaydi: Fₐ = mg = 70,6 N.">

::: details Yeçimni körsatiş

1. $\dfrac{V_\text{b}}{V} = \dfrac{\rho}{\rho_\text{s}} = \dfrac{900}{1030} = 0{,}87$.
2. Demak muzning 87 % i suv ostida, faqat 13 % i suv ustida körinadi.

**Javob.** Taxminan 87 %.

:::

</SimExample>

### 3-masala. Simobdagi temir

Qirrasi 20 sm bölgan temir kub (7800 kg/m³) simobga tuşirildi. U çökadimi? Qança qismi botadi?

<SimExample :values='{"rhoB":7800,"liq":4,"a":20,"g":9.81}' check="Jism suzib yuribdi: hajmining 57 % qismi suyuqlikka botgan, bu jism va suyuqlik ziçliklarining nisbatiga teng (0,57). Arximed kuçi oğirlik kuçini muvozanatlaydi: Fₐ = mg = 612,1 N.">

::: details Yeçimni körsatiş

1. $\rho = 7800 < \rho_\text{s} = 13\,600$: temir simobda suzadi.
2. $\dfrac{V_\text{b}}{V} = \dfrac{7800}{13\,600} = 0{,}574$, botiş çuqurligi $0{,}574 \cdot 20 \approx 11{,}5\ \text{sm}$.
3. $F_A = mg = 7800 \cdot 0{,}008 \cdot 9{,}81 = 612{,}1\ \text{N}$.

**Javob.** Suzadi, hajmining 57 % i botadi, $F_A = 612{,}1\ \text{N}$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 14-bob](https://openstax.org/books/university-physics-volume-1/pages/14-4-archimedes-principle-and-buoyancy). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
