---
title: "Gidravlik press"
description: "Kiçik porşenni bir neça marta bosib, ağir yukni kötaring. Bosim suyuqlik orqali özgarişsiz uzatiladi, şuning uçun katta porşenga taʼsir etuvçi kuç yuzalar nisbatiça katta. Iş esa bir xil: kuçdan yutilsa, yöldan yutqaziladi."
topic: "Suyuqliklar mexanikasi · Paskal qonuni"
examples: 3
---

# Gidravlik press

<SimLab id="hydraulic-press" />

## Asosiy ğoya

Avtomobil ustaxonasidagi kötargiç, avtomobil tormozi, ekskavator kovşi, bir qöl bilan yuk maşinasini kötaradigan domkrat — bularning hammasi gidravlik mexanizmlar. Ularda kuç suyuqlik, odatda moy, orqali uzatiladi va kuçayadi.

Bu mexanizmlarning asosida fransuz olimi Blez Paskal XVII asrda kaşf etgan qonun yotadi: yopiq idişdagi suyuqlikka berilgan bosim uning har bir nuqtasiga bir xil uzatiladi.

<div class="lesson-photos">

<SimPhoto name="excavator" :width="1200" :height="800" alt="Tuproq uyumi ustidagi ekskavator; strelasi va kovşini harakatlantiruvçi gidrosilindrlar körinib turibdi" caption="Ekskavatorning strelasi va kovşi gidrosilindrlar bilan harakatlanadi. Nasos moyni silindrga katta bosim bilan haydaydi, bosim esa porşenni katta kuç bilan itaradi." credit="Surat: Matthew T Rader, &lt;a href=&quot;https://creativecommons.org/licenses/by-sa/4.0&quot;&gt;CC BY-SA 4.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Caterpillar_330_excavator_on_a_pile_of_dirt.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Suyuqlikka berilgan taşqi bosim suyuqlikning har bir nuqtasiga özgarişsiz uzatiladi — bu *Paskal qonuni*. Gidravlik pressda kiçik porşenning $S_1$ yuzasiga $F_1$ kuç qöyilsa, suyuqlikda $p = F_1/S_1$ bosim hosil böladi va u katta porşenni $F_2 = pS_2$ kuç bilan itaradi.

<div class="eq-block">

<span class="eq-label">Paskal qonuni</span><span class="eq-body">$\displaystyle p = \frac{F_1}{S_1} = \frac{F_2}{S_2}$</span>

<span class="eq-label">Kuçdan yutiş</span><span class="eq-body">$\displaystyle \frac{F_2}{F_1} = \frac{S_2}{S_1}$</span>

<span class="eq-label">Hajm va iş saqlanadi</span><span class="eq-body">$\displaystyle S_1 l_1 = S_2 h, \quad F_1 l_1 = F_2 h$</span>

</div>

Kuçdan neça marta yutilsa, yöldan şunça marta yutqaziladi: kiçik porşen katta porşenga qaraganda $S_2/S_1$ marta uzun yöl bosadi. Şuning uçun haqiqiy domkratda kiçik porşen köp marta bosiladi, har safar klapanlar suyuqlikni idişdan olib, katta silindrga haydaydi.

## Sinab köring

1. Katta porşen yuzasini ikki marta oşiring. F₁ va bosişlar soni qanday özgaradi?
2. “Kiçik porşenga kuç” grafigiga qarang: kuç qaçon nolga teng böladi va nima uçun?
3. Yuk massasini özgartiring. Moyning bosimi qança özgaradi?

## Masalalar

### 1-masala. Avtomobil kötargiçi

Gidravlik kötargiçning kiçik porşeni yuzasi 10 sm², katta porşeniniki 500 sm². Massasi 1500 kg bölgan avtomobilni kötariş uçun kiçik porşenga qança kuç qöyiş kerak? Kiçik porşenning yöli 20 sm bölsa, avtomobilni 4 sm ga kötariş uçun uni neça marta bosiş kerak?

<SimExample :values='{"M":1500,"S1":10,"S2":500,"H":4,"g":9.81}' check="Yuk 4,0 sm ga kötarildi, buning uçun kiçik porşen 10 marta bosildi. F₁ = 294,3 N kuç yukning 14715 N oğirligidan 50,0 marta kiçik. Bajarilgan iş A = Mgh = 588,6 J.">

::: details Yeçimni körsatiş

1. $F_2 = Mg = 1500 \cdot 9{,}81 = 14\,715\ \text{N}$, $F_1 = F_2 \dfrac{S_1}{S_2} = 14\,715 \cdot \dfrac{10}{500} = 294{,}3\ \text{N}$.
2. Bir bosişda katta porşen $20 \cdot \dfrac{10}{500} = 0{,}4\ \text{sm}$ ga kötariladi, 4 sm uçun $n = 10$ marta bosiş kerak.
3. Iş: $A = Mgh = 14\,715 \cdot 0{,}04 = 588{,}6\ \text{J}$. Kiçik porşen ham şunça iş bajaradi: $294{,}3 \cdot 10 \cdot 0{,}2 = 588{,}6\ \text{J}$.

**Javob.** $F_1 = 294{,}3\ \text{N}$, $n = 10$, $A = 588{,}6\ \text{J}$.

:::

</SimExample>

### 2-masala. Domkrat

Domkrat porşenlarining yuzalari 4 sm² va 800 sm². 1200 kg yukni kötariş uçun kiçik porşenga qança kuç kerak? Kiçik porşen yöli 20 sm. Yukni 2 sm ga kötariş uçun uni neça marta bosiş kerak?

<SimExample :values='{"M":1200,"S1":4,"S2":800,"H":2,"g":9.81}' check="Yuk 2,0 sm ga kötarildi, buning uçun kiçik porşen 20 marta bosildi. F₁ = 58,9 N kuç yukning 11772 N oğirligidan 200,0 marta kiçik. Bajarilgan iş A = Mgh = 235,4 J.">

::: details Yeçimni körsatiş

1. Kuçdan yutiş $S_2/S_1 = 800/4 = 200$ marta.
2. $F_1 = \dfrac{1200 \cdot 9{,}81}{200} = 58{,}9\ \text{N}$ — taxminan 6 kg yukning oğirligi.
3. Bir bosişda yuk $20 / 200 = 0{,}1\ \text{sm}$ ga kötariladi: $n = 2 / 0{,}1 = 20$ marta.

**Javob.** $F_1 \approx 58{,}9\ \text{N}$, $n = 20$.

:::

</SimExample>

### 3-masala. Iş saqlanadi

Porşenlarining yuzalari 20 sm² va 400 sm² bölgan pressda 600 kg yuk 6 sm ga kötarildi. Kiçik porşen jami qança yöl bosdi va qança iş bajarildi?

<SimExample :values='{"M":600,"S1":20,"S2":400,"H":6,"g":9.81}' check="Yuk 6,0 sm ga kötarildi, buning uçun kiçik porşen 6 marta bosildi. F₁ = 294,3 N kuç yukning 5886 N oğirligidan 20,0 marta kiçik. Bajarilgan iş A = Mgh = 353,2 J.">

::: details Yeçimni körsatiş

1. Suyuqlik hajmi saqlanadi: $S_1 l_1 = S_2 h$, $l_1 = 6 \cdot \dfrac{400}{20} = 120\ \text{sm}$ — 20 sm dan 6 marta bosiş.
2. $F_1 = \dfrac{600 \cdot 9{,}81 \cdot 20}{400} = 294{,}3\ \text{N}$.
3. $A = F_1 l_1 = 294{,}3 \cdot 1{,}2 = 353{,}2\ \text{J}$, bu $Mgh = 5886 \cdot 0{,}06$ ga teng.

**Javob.** $l_1 = 1{,}2\ \text{m}$ (6 marta bosiş), $A \approx 353{,}2\ \text{J}$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 14-bob](https://openstax.org/books/university-physics-volume-1/pages/14-3-pascals-principle-and-hydraulics). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
