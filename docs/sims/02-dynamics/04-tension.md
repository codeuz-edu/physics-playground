---
title: "Ipning taranglik kuçi"
description: "Yuk ikki arqonga osilgan. Arqonlarning burçaklarini özgartiring: arqonlar gorizontalga yaqinlaşgan sari ulardagi taranglik kuçi yukning oğirligidan ham ança katta böladi."
topic: "Dinamika · Taranglik kuçi"
examples: 3
---

# Ipning taranglik kuçi

<SimLab id="tension" />

## Asosiy ğoya

Köça çiroği ikki sim orasiga osilgan, kir yoyiladigan arqon örtasida salqi, köprik arqonlari qiya tortilgan. Har bir ip yoki arqon jismni özi böylab tortadi; bu kuç ipning taranglik kuçi deyiladi va u ip böylab, jismdan taşqariga yönalgan böladi.

Jism tinç turgan bölsa, unga taʼsir etuvçi barça kuçlarning teng taʼsir etuvçisi nolga teng. Kuçlarni ketma-ket ulab çizsak, ular yopiq köpburçak hosil qiladi. Uç kuç uçun bu kuçlar uçburçagi: uning tomonlari arqonlar böylab yönalgan.

<div class="lesson-photos">

<SimPhoto name="tightrope" :width="1200" :height="674" alt="Daraxtlar ustida tortilgan arqonda yurayotgan dorboz" caption="Dorboz turgan joyda arqon biroz egiladi. Arqonning ikki qismidagi taranglik kuçlari birgalikda dorbozning oğirligini muvozanatlaydi; arqon qança tarang tortilsa, egilişi şunça kiçik." credit="Surat: Armineaghayan, &lt;a href=&quot;https://creativecommons.org/licenses/by-sa/4.0&quot;&gt;CC BY-SA 4.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Tightrope_walker_in_Hnaberd_(2).jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Tugun tinç turibdi, demak unga taʼsir etuvçi uçta kuçning yiğindisi nolga teng: $\vec T_1 + \vec T_2 + m\vec g = 0$. Burçaklar gorizontaldan ölçanadi. Kuçlarni gorizontal va vertikal öqlarga proyeksiyalaymiz:

<div class="eq-block">

<span class="eq-label">Gorizontal öq</span><span class="eq-body">$\displaystyle T_1 \cos\alpha = T_2 \cos\beta$</span>

<span class="eq-label">Vertikal öq</span><span class="eq-body">$\displaystyle T_1 \sin\alpha + T_2 \sin\beta = mg$</span>

<span class="eq-label">Yeçim</span><span class="eq-body">$\displaystyle T_1 = \frac{mg\cos\beta}{\sin(\alpha + \beta)}, \qquad T_2 = \frac{mg\cos\alpha}{\sin(\alpha + \beta)}$</span>

<span class="eq-label">Burçaklar teng bölsa</span><span class="eq-body">$\displaystyle T = \frac{mg}{2\sin\alpha}$</span>

</div>

Burçak kiçrayganda $\sin\alpha$ nolga yaqinlaşadi va taranglik kuçi çeksiz ortadi. Şuning uçun arqonni butunlay töğri taranglab, uning örtasiga yuk osib bölmaydi: arqon uziladi yoki salqi böladi.

Simulyatsiyada arqonlarning yuqori uçlari asta-sekin bir-biridan uzoqlaştiriladi va burçaklar 85° dan tanlangan $\alpha$, $\beta$ qiymatlargaça kamayadi. Bu juda sekin bajariladi, şuning uçun tugun har bir paytda muvozanatda turadi: “Taranglik kuçlari” grafigida kuçlar burçaklar bilan birga qanday özgarişi körinadi.

## Sinab köring

1. Ikkala burçakni 5° gaça kiçraytiring. Taranglik kuçi yukning oğirligidan neça marta katta böladi?
2. Burçaklarni 90° ga yaqinlaştiring. Har bir arqon yukning qança qismini kötaradi?
3. “Kuçlar uçburçagi”ga qarang: burçaklar özgarganda uçburçak qanday özgaradi?

## Masalalar

### 1-masala. Köça çiroği

Massasi 10 kg bölgan çiroq ikki bir xil simga osilgan, har bir sim gorizont bilan $30^\circ$ burçak taşkil qiladi. Simlardagi taranglik kuçini toping.

<SimExample :values='{"m":10,"al":30,"be":30,"g":9.81}' check="Muvozanat: T₁ = 98,1 N, T₂ = 98,1 N, yukning oğirligi mg = 98,1 N.">

::: details Yeçimni körsatiş

1. Burçaklar teng, şuning uçun $T_1 = T_2 = T$ va $2T\sin 30^\circ = mg$.
2. $T = \dfrac{mg}{2\sin 30^\circ} = \dfrac{10 \cdot 9{,}81}{2 \cdot 0{,}5} = 98{,}1\ \text{N}$.

**Javob.** Har bir simda $98{,}1\ \text{N}$: bu çiroqning oğirligiga teng.

:::

</SimExample>

### 2-masala. Deyarli taranglangan arqon

Xuddi şu çiroq simlar gorizontga $10^\circ$ burçak ostida bölganda osilib turibdi. Taranglik kuçi oldingi holga qaraganda neça marta katta?

<SimExample :values='{"m":10,"al":10,"be":10,"g":9.81}' check="Muvozanat: T₁ = 282,5 N, T₂ = 282,5 N, yukning oğirligi mg = 98,1 N.">

::: details Yeçimni körsatiş

1. $T = \dfrac{98{,}1}{2\sin 10^\circ} = \dfrac{98{,}1}{0{,}347} = 282{,}5\ \text{N}$.
2. $\dfrac{282{,}5}{98{,}1} = 2{,}9$: kuç deyarli uç marta katta, garçi yuk özgarmagan bölsa ham.

**Javob.** $T = 282{,}5\ \text{N}$, taxminan 2,9 marta katta.

:::

</SimExample>

### 3-masala. Har xil burçakli arqonlar

Massasi 5,0 kg bölgan yuk ikki arqonga osilgan: çapdagisi gorizont bilan $30^\circ$, öngdagisi $60^\circ$ burçak taşkil qiladi. Har bir arqondagi taranglik kuçini toping.

<SimExample :values='{"m":5,"al":30,"be":60,"g":9.81}' check="Muvozanat: T₁ = 24,5 N, T₂ = 42,5 N: ikkala kuçning vertikal proyeksiyalari yiğindisi yukning oğirligiga teng.">

::: details Yeçimni körsatiş

1. $\alpha + \beta = 90^\circ$, şuning uçun $\sin(\alpha + \beta) = 1$.
2. $T_1 = mg\cos 60^\circ = 49{,}05 \cdot 0{,}5 = 24{,}5\ \text{N}$, $T_2 = mg\cos 30^\circ = 49{,}05 \cdot 0{,}866 = 42{,}5\ \text{N}$.
3. Tikroq arqon (öngdagi) yukning köproq qismini kötaradi.

**Javob.** $T_1 = 24{,}5\ \text{N}$, $T_2 = 42{,}5\ \text{N}$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 5-bob](https://openstax.org/books/university-physics-volume-1/pages/5-7-drawing-free-body-diagrams). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
