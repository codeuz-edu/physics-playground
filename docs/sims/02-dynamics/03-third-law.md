---
title: "Nyutonning uçinçi qonuni"
description: "Ikki aravaça orasidagi prujina qöyib yuborilganda ular bir-birini itaradi. Massalarni özgartiring: kuçlar har doim teng va qarama-qarşi, tezliklar esa massalarga teskari proporsional."
topic: "Dinamika · Taʼsir va aks taʼsir"
examples: 3
---

# Nyutonning uçinçi qonuni

<SimLab id="third-law" />

## Asosiy ğoya

Qayiqdan qirğoqqa sakragan odam qayiqni orqaga itaradi, miltiq otilganda orqaga tepadi, raketa gazni orqaga otib, özi oldinga uçadi. Bu hodisalarning hammasi Nyutonning uçinçi qonuni bilan tuşuntiriladi: jismlar bir-biriga har doim juft-juft taʼsir qiladi.

Birinçi jism ikkinçisiga qança kuç bilan taʼsir qilsa, ikkinçisi ham birinçisiga xuddi şunday kuç bilan, lekin qarama-qarşi yönalişda taʼsir qiladi. Bu kuçlar bir xil tabiatli, bir töğri çiziq böylab yönalgan va har xil jismlarga qöyilgan.

<div class="lesson-photos">

<SimPhoto name="rowing-scull" :width="1200" :height="800" alt="Daryoda bir kişilik akademik qayiqda eşkak eşayotgan sportçi" caption="Eşkakçi eşkak bilan suvni orqaga itaradi, suv esa eşkakni — demak, qayiqni ham — xuddi şunday kuç bilan oldinga itaradi. Bu kuçlar ikki xil jismga qöyilgan, şuning uçun bir-birini yöqotmaydi." credit="Surat: TudorTulok, &lt;a href=&quot;https://creativecommons.org/publicdomain/zero/1.0/&quot;&gt;CC0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:SL_Racing_single_scull_with_carbon_rigger_on_river.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Ikki jism bir-biriga moduli teng, yönalişi qarama-qarşi kuçlar bilan taʼsir qiladi. Bu kuçlar har xil jismlarga qöyilgan, şuning uçun ular bir-birini muvozanatlamaydi: har biri öz jismini tezlantiradi.

<div class="eq-block">

<span class="eq-label">Uçinçi qonun</span><span class="eq-body">$\displaystyle \vec F_{12} = -\vec F_{21}$</span>

<span class="eq-label">Tezlanişlar</span><span class="eq-body">$\displaystyle \frac{a_1}{a_2} = \frac{m_2}{m_1}$</span>

<span class="eq-label">Itarişdan keyingi tezliklar</span><span class="eq-body">$\displaystyle \upsilon_1 = \frac{F\tau}{m_1}, \qquad \upsilon_2 = \frac{F\tau}{m_2}, \qquad m_1 \upsilon_1 = m_2 \upsilon_2$</span>

</div>

Grafikda kuçlar bir xil vaqtda paydo böladi va bir xil vaqtda yöqoladi, ularning çiziqlari $t$ öqiga nisbatan simmetrik. Yengil aravaça tezroq harakatlanadi, lekin ikkala aravaçaning impulslari moduli teng: “Impulslar” grafigida $p_1$ va $p_2$ çiziqlari simmetrik, ularning yiğindisi esa doim nolga teng — aravaçalar tinç turgan edi, impuls saqlanadi.

<div class="lesson-note">

Kuç va itariş davomiyligi katta bölsa, aravaça itariş tugamasdan relsning çetiga yetişi mumkin; bunda simulyatsiya töxtaydi va buni aytadi.

</div>

## Sinab köring

1. “Özaro taʼsir kuçlari” grafigiga qarang. F₁₂ va F₂₁ bir lahza bölsa ham farq qiladimi?
2. Bir aravaçani 5 kg, ikkinçisini 0,5 kg qiling. Kuçlar özgaradimi? Tezliklar-çi?
3. p₁ = m₁υ₁ va p₂ = m₂υ₂ körsatkiçlarini taqqoslang. Ular nimaga teng? Ularning yiğindisi-çi?

## Masalalar

### 1-masala. Teng massali aravaçalar

Massasi 1,0 kg dan bölgan ikki aravaça orasidagi siqilgan prujina qöyib yuborildi. Prujina har bir aravaçani 0,20 s davomida 10 N kuç bilan itardi. Aravaçalar qanday tezlik oladi?

<SimExample :values='{"m1":1,"m2":1,"F":10,"tau":0.2}' check="Itarişdan keyin υ₁ = -2,00 m/s, υ₂ = 2,00 m/s. Tezliklar modullarining nisbati 1,00.">

::: details Yeçimni körsatiş

1. Uçinçi qonunga köra ikkala aravaçaga 10 N dan kuç taʼsir etadi, yönalişlari qarama-qarşi.
2. $\upsilon = \dfrac{F\tau}{m} = \dfrac{10 \cdot 0{,}20}{1{,}0} = 2{,}0\ \text{m/s}$: çapdagisi çapga, öngdagisi öngga.

**Javob.** Ikkalasi ham $2{,}0\ \text{m/s}$ tezlik bilan qarama-qarşi tomonga harakatlanadi.

:::

</SimExample>

### 2-masala. Massalar har xil

Aravaçalarning massalari 1,0 kg va 3,0 kg, prujina ularni 0,25 s davomida 12 N kuç bilan itaradi. Har bir aravaçaning tezlanişini va oladigan tezligini toping.

<SimExample :values='{"m1":1,"m2":3,"F":12,"tau":0.25}' check="Itarişdan keyin υ₁ = -3,00 m/s, υ₂ = 1,00 m/s. Tezliklar modullarining nisbati 0,33: u massalar nisbatining teskarisiga teng.">

::: details Yeçimni körsatiş

1. $a_1 = \dfrac{12}{1{,}0} = 12\ \text{m/s}^2$, $a_2 = \dfrac{12}{3{,}0} = 4{,}0\ \text{m/s}^2$.
2. $\upsilon_1 = a_1 \tau = 3{,}0\ \text{m/s}$, $\upsilon_2 = a_2 \tau = 1{,}0\ \text{m/s}$.
3. $\dfrac{\upsilon_1}{\upsilon_2} = 3 = \dfrac{m_2}{m_1}$: yengil aravaça 3 marta tezroq ketadi.

**Javob.** $\upsilon_1 = 3{,}0\ \text{m/s}$, $\upsilon_2 = 1{,}0\ \text{m/s}$.

:::

</SimExample>

### 3-masala. Muz ustidagi konkiçilar

Muz ustida turgan bola (masştabda 2,0 kg) va katta odam (4,0 kg) bir-birini 0,30 s davomida 20 N kuç bilan itaradi. Ular qanday tezlik bilan ajraladi? Qaysi biri uzoqroq ketadi?

<SimExample :values='{"m1":2,"m2":4,"F":20,"tau":0.3}' check="Itarişdan keyin υ₁ = -3,00 m/s, υ₂ = 1,50 m/s. Tezliklar modullarining nisbati 0,50: u massalar nisbatining teskarisiga teng.">

::: details Yeçimni körsatiş

1. $\upsilon_1 = \dfrac{20 \cdot 0{,}30}{2{,}0} = 3{,}0\ \text{m/s}$, $\upsilon_2 = \dfrac{20 \cdot 0{,}30}{4{,}0} = 1{,}5\ \text{m/s}$.
2. Bir xil vaqtda yengil jism ikki marta köp yöl bosadi.

**Javob.** Bola $3{,}0\ \text{m/s}$, katta odam $1{,}5\ \text{m/s}$ tezlik bilan ajraladi; bola uzoqroq ketadi.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 5-bob](https://openstax.org/books/university-physics-volume-1/pages/5-5-newtons-third-law). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
