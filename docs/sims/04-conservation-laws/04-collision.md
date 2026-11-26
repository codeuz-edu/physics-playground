---
title: "Töqnaşuvlar va impulsning saqlanişi"
description: "Ikkita aravaça işqalanişsiz relsda töqnaşadi. Massalar va tezliklarni tanlang, töqnaşuvni absolyut elastikdan absolyut noelastikgaça özgartiring va impuls har doim saqlanişini, kinetik energiya esa faqat elastik töqnaşuvda saqlanişini kuzating."
topic: "Saqlaniş qonunlari · Impuls"
examples: 3
---

# Töqnaşuvlar va impulsning saqlanişi

<SimLab id="collision" />

## Asosiy ğoya

Bilyard şarlari urilişi, avtomobillar töqnaşuvi, raketadan ajralayotgan boşqiç — bularning hammasida jismlar bir-biriga qisqa vaqt juda katta kuç bilan taʼsir qiladi. Bu kuçlarni ölçaş qiyin, lekin ular kerak ham emas: ikkala jismga faqat özaro taʼsir kuçlari taʼsir etsa, ularning umumiy impulsi $\vec p = m\vec\upsilon$ töqnaşuvdan oldin va keyin bir xil böladi. Nyutonning uçinçi qonuni şuni kafolatlaydi.

Kinetik energiya esa har doim ham saqlanmaydi. Pölat şarlar urilganda energiya deyarli saqlanadi — bunday töqnaşuv *absolyut elastik* deyiladi. Plastilin böläklari birikib qolsa, kinetik energiyaning bir qismi deformatsiya va issiqlikka ketadi — bu *absolyut noelastik* töqnaşuv. Haqiqiy töqnaşuvlar şu ikki çegara orasida böladi; simulyatsiyada buni tiklaniş koeffitsiyenti $e$ belgilaydi.

<div class="lesson-photos">

<SimPhoto name="newtons-cradle" :width="1200" :height="809" :display-width="350" alt="Nyuton beşigi: ipga osilgan beşta pölat şar qatori" caption="Nyuton beşigi: çetdagi şar urilganda impuls va kinetik energiya şarlar zanjiri orqali ötib, qarşi çetdagi bitta şarni öşa tezlik bilan uçirib yuboradi." credit="Surat: Sheila Sund, &lt;a href=&quot;https://creativecommons.org/licenses/by/2.0&quot;&gt;CC BY 2.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Newton%27s_Cradle_(15221366308).jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

<SimPhoto name="bumper-cars" :width="1200" :height="795" :display-width="350" alt="Attraksiondagi töqnaşuvçi avtomobilçalar" caption="Attraksion avtomobilçalari rezina bamper bilan öralgan: töqnaşuv qisman elastik böladi va impulsning bir qismi bir avtomobilçadan ikkinçisiga ötadi." credit="Surat: Ethan2038, &lt;a href=&quot;https://creativecommons.org/licenses/by-sa/4.0&quot;&gt;CC BY-SA 4.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Bumper_Cars.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Yopiq sistemada — taşqi kuçlar yöq yoki ularning yiğindisi nolga teng bölganda — jismlar impulslarining vektor yiğindisi saqlanadi. Töqnaşuv paytida aravaçalar bir-biriga teng va qarama-qarşi kuçlar bilan taʼsir qiladi, şuning uçun biri yöqotgan impulsni ikkinçisi oladi.

<div class="eq-block">

<span class="eq-label">Impulsning saqlaniş qonuni</span><span class="eq-body">$\displaystyle m_1\upsilon_1 + m_2\upsilon_2 = m_1\upsilon_1' + m_2\upsilon_2'$</span>

<span class="eq-label">Absolyut noelastik (birikib ketadi)</span><span class="eq-body">$\displaystyle \upsilon = \frac{m_1\upsilon_1 + m_2\upsilon_2}{m_1 + m_2}$</span>

<span class="eq-label">Absolyut elastik, ikkinçisi tinç</span><span class="eq-body">$\displaystyle \upsilon_1' = \frac{m_1 - m_2}{m_1 + m_2}\upsilon_1, \qquad \upsilon_2' = \frac{2m_1}{m_1 + m_2}\upsilon_1$</span>

<span class="eq-label">Tiklaniş koeffitsiyenti</span><span class="eq-body">$\displaystyle e = \frac{\upsilon_2' - \upsilon_1'}{\upsilon_1 - \upsilon_2}$</span>

</div>

Tiklaniş koeffitsiyenti töqnaşuvdan keyingi uzoqlaşiş tezligining töqnaşuvdan oldingi yaqinlaşiş tezligiga nisbati: $e = 1$ absolyut elastik, $e = 0$ absolyut noelastik töqnaşuv. Impuls har qanday $e$ da saqlanadi; kinetik energiya esa faqat $e = 1$ da, qolgan hollarda uning bir qismi yöqoladi: $\Delta E_\text{k} = \dfrac{m_1 m_2}{2(m_1 + m_2)}(1 - e^2)(\upsilon_1 - \upsilon_2)^2$.

Grafiklarga qarang: töqnaşuv paytida tezliklar sakrab özgaradi, lekin töliq impuls çiziği tekis qoladi. Kinetik energiya çiziği esa $e < 1$ bölganda pastga sakraydi.

<div class="lesson-note">

Barça parametrlar harakatni boşidan boşlaydi: töqnaşuv şartlari töqnaşuvdan oldin belgilanadi.

</div>

## Sinab köring

1. Teng massalar bilan e ni 1 dan 0 gaça kamaytirib boring. Impuls grafigi özgaradimi? Kinetik energiya-çi?
2. Oğir aravaçani (10 kg) yengilining (0,5 kg) ustiga yuboring. Oğir aravaçaning tezligi deyarli özgarmasligini, yengili esa ikki baravar tezlik olişini tekşiring.
3. Yengil aravaçani oğiriga uring: u orqaga qaytadi. Massalar nisbati qança bölganda u töxtab qoladi?
4. Qarama-qarşi yönalgan teng impulslar uçun $e = 0$ tanlang: töqnaşuvdan keyin ikkala aravaça töxtaydi va butun kinetik energiya yöqoladi. Bu impulsning saqlaniş qonuniga zid emasmi?

## Masalalar

### 1-masala. Teng massalar, elastik töqnaşuv

Massasi 2,0 kg bölgan aravaça 3,0 m/s tezlik bilan harakatlanib, tinç turgan öşa massadagi aravaçaga uriladi. Töqnaşuv absolyut elastik. Töqnaşuvdan keyin aravaçalarning tezligi qança?

<SimExample :values='{"m1":2,"v1":3,"m2":2,"v2":0,"e":1}' check="Töqnaşuvdan (t = 1,27 s) keyin υ₁ = 0,00 m/s, υ₂ = 3,00 m/s; kinetik energiya saqlandi.">

::: details Yeçimni körsatiş

1. Impulsning saqlaniş qonuni: $m\upsilon_1 = m\upsilon_1' + m\upsilon_2'$, yaʼni $\upsilon_1' + \upsilon_2' = 3{,}0\ \text{m/s}$.
2. Elastik töqnaşuvda kinetik energiya ham saqlanadi: $\upsilon_1^2 = \upsilon_1'^2 + \upsilon_2'^2$.
3. Ikki tenglamadan $\upsilon_1' = 0$, $\upsilon_2' = 3{,}0\ \text{m/s}$: teng massali jismlar elastik töqnaşuvda tezliklarini almaşadi.

**Javob.** Birinçi aravaça töxtaydi, ikkinçisi $3{,}0\ \text{m/s}$ tezlik bilan ketadi.

:::

</SimExample>

### 2-masala. Absolyut noelastik töqnaşuv

Massasi 3,0 kg bölgan aravaça 4,0 m/s tezlik bilan öngga, massasi 1,0 kg bölgan aravaça 2,0 m/s tezlik bilan çapga harakatlanmoqda. Töqnaşuvdan keyin ular birikib ketadi. Ularning umumiy tezligini va töqnaşuvda yöqolgan kinetik energiyani toping.

<SimExample :values='{"m1":3,"v1":4,"m2":1,"v2":-2,"e":0}' check="Töqnaşuvdan keyin υ₁ = υ₂ = 2,50 m/s; kinetik energiyaning 13,5 J qismi yöqoldi. Grafikda impuls 10 kg·m/s da özgarmay qoladi.">

::: details Yeçimni körsatiş

1. Öngni musbat yönaliş deb olamiz: $m_1\upsilon_1 + m_2\upsilon_2 = (m_1 + m_2)\upsilon$, demak $\upsilon = \dfrac{3{,}0 \cdot 4{,}0 + 1{,}0 \cdot (-2{,}0)}{4{,}0} = 2{,}5\ \text{m/s}$.
2. Töqnaşuvdan oldin $E_\text{k} = \dfrac{3{,}0 \cdot 4{,}0^2}{2} + \dfrac{1{,}0 \cdot 2{,}0^2}{2} = 26\ \text{J}$, keyin $E_\text{k}' = \dfrac{4{,}0 \cdot 2{,}5^2}{2} = 12{,}5\ \text{J}$.
3. Yöqolgan energiya $26 - 12{,}5 = 13{,}5\ \text{J}$ — u deformatsiya va issiqlikka aylandi.

**Javob.** $\upsilon = 2{,}5\ \text{m/s}$ öngga; $13{,}5\ \text{J}$ yöqoladi.

:::

</SimExample>

### 3-masala. Yengil aravaça oğiriga uriladi

Massasi 1,0 kg bölgan aravaça 6,0 m/s tezlik bilan tinç turgan massasi 3,0 kg bölgan aravaçaga absolyut elastik uriladi. Töqnaşuvdan keyingi tezliklarni toping.

<SimExample :values='{"m1":1,"v1":6,"m2":3,"v2":0,"e":1}' check="Töqnaşuvdan (t = 0,64 s) keyin υ₁ = -3,00 m/s, υ₂ = 3,00 m/s; kinetik energiya saqlandi.">

::: details Yeçimni körsatiş

1. Absolyut elastik töqnaşuv uçun umumiy formulalar: $\upsilon_1' = \dfrac{m_1 - m_2}{m_1 + m_2}\upsilon_1$, $\upsilon_2' = \dfrac{2m_1}{m_1 + m_2}\upsilon_1$.
2. $\upsilon_1' = \dfrac{1{,}0 - 3{,}0}{4{,}0} \cdot 6{,}0 = -3{,}0\ \text{m/s}$: yengil aravaça orqaga qaytadi.
3. $\upsilon_2' = \dfrac{2 \cdot 1{,}0}{4{,}0} \cdot 6{,}0 = 3{,}0\ \text{m/s}$. Tekşiriş: $1{,}0 \cdot (-3{,}0) + 3{,}0 \cdot 3{,}0 = 6{,}0 = m_1\upsilon_1$.

**Javob.** $\upsilon_1' = -3{,}0\ \text{m/s}$ (orqaga), $\upsilon_2' = 3{,}0\ \text{m/s}$.

:::

</SimExample>

## Manbalar

Bu mavzu maktab fizika darsligining “Saqlaniş qonunlari” bölimida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 9-bob](https://openstax.org/books/university-physics-volume-1/pages/9-4-types-of-collisions). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
