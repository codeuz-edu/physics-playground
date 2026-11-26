---
title: "Tekislikdagi töqnaşuv"
description: "Bilyard şari tinç turgan şarga markazidan siljib uriladi. Siljişni, massalarni va tiklaniş koeffitsiyentini özgartiring: impuls vektori saqlanadi, teng massali şarlar elastik urilişda töğri burçak ostida ajraladi."
topic: "Saqlaniş qonunlari · Impulsning vektor saqlanişi"
examples: 3
---

# Tekislikdagi töqnaşuv

<SimLab id="collision-2d" />

## Asosiy ğoya

Bilyard öyinçisi şarni qayerga urişni impulsning saqlaniş qonuni asosida tanlaydi. Şar markazdan siljib urilsa, ikkala şar ham yangi yönalişlarda ketadi, lekin ularning impulslari yiğindisi urilişdan oldingi impulsga teng.

Impuls — vektor kattalik, şuning uçun tekislikdagi töqnaşuvda uni proyeksiyalarda yozamiz. Uriliş elastik bölsa, kinetik energiya ham saqlanadi; noelastik urilişda uning bir qismi issiqlikka va deformatsiyaga aylanadi.

<div class="lesson-photos">

<SimPhoto name="snooker" :width="1200" :height="706" alt="Snuker stolida oq şar va qizil şar" caption="Bilyardda şar boşqa şarga markazdan siljib urilsa, ikkalasi har xil yönalişlarda ketadi. Massalari teng şarlar elastik urilişdan keyin taxminan 90° burçak ostida tarqaladi." credit="Surat: MichaelMaggs, &lt;a href=&quot;https://creativecommons.org/licenses/by-sa/3.0&quot;&gt;CC BY-SA 3.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:To_pot_the_red.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Şarlar sistemasiga taşqi kuçlar (gorizontal yönalişda) taʼsir etmaydi, şuning uçun töqnaşuvda impuls vektori saqlanadi: uning ikkala proyeksiyasi alohida-alohida saqlanadi. Uriliş kuçi şarlar markazlarini tutaştiruvçi çiziq böylab yönalgan.

<div class="eq-block">

<span class="eq-label">Impuls</span><span class="eq-body">$\displaystyle m_1\vec\upsilon_0 = m_1\vec\upsilon_1 + m_2\vec\upsilon_2$</span>

<span class="eq-label">Proyeksiyalarda</span><span class="eq-body">$\displaystyle m_1\upsilon_0 = m_1\upsilon_{1x} + m_2\upsilon_{2x}, \qquad 0 = m_1\upsilon_{1y} + m_2\upsilon_{2y}$</span>

<span class="eq-label">Teng massalar, elastik</span><span class="eq-body">$\displaystyle \upsilon_0^2 = \upsilon_1^2 + \upsilon_2^2 \;\Rightarrow\; \vec\upsilon_1 \perp \vec\upsilon_2$</span>

</div>

Teng massali şarlar elastik urilganda impulslar uçburçagi töğri burçakli böladi: ular $90^\circ$ ostida ajraladi. Markaziy urilişda esa uriluvçi şar töxtaydi va butun tezligini ikkinçi şarga beradi.

## Sinab köring

1. Siljişni 0 dan 0,9 gaça özgartiring. Teng massalarda burçak özgaradimi?
2. “Impulsning proyeksiyalari” grafigida töqnaşuv paytini topa olasizmi?
3. Yengil şarni oğir şarga uring. U qaysi tomonga qaytadi?

## Masalalar

### 1-masala. Bilyard şarlari

Massasi 0,17 kg bölgan şar 1,5 m/s tezlik bilan xuddi şunday tinç turgan şarga markazdan siljib uriladi, uriliş elastik. Urilişdan keyin şarlar qanday burçak ostida ajraladi?

<SimExample :values='{"m1":0.17,"m2":0.17,"v0":1.5,"b":0.5,"e":1}' check="Töqnaşuvdan keyin υ₁ = 0,75 m/s, υ₂ = 1,30 m/s, ular orasidagi burçak 90,0°.">

::: details Yeçimni körsatiş

1. Impuls: $\vec\upsilon_0 = \vec\upsilon_1 + \vec\upsilon_2$, energiya: $\upsilon_0^2 = \upsilon_1^2 + \upsilon_2^2$.
2. Bu Pifagor teoremasi: $\vec\upsilon_1$ va $\vec\upsilon_2$ orasidagi burçak $90^\circ$.
3. Ikkinçi şar markazlarni tutaştiruvçi çiziq böylab ketadi. Siljiş $b = 0{,}5$ bölsa, bu çiziq $\upsilon_0$ bilan $\varphi$ burçak hosil qiladi: $\sin\varphi = 0{,}5$, $\varphi = 30^\circ$. Demak $\upsilon_2 = \upsilon_0\cos 30^\circ = 1{,}5 \cdot 0{,}866 = 1{,}30\ \text{m/s}$, $\upsilon_1 = \upsilon_0\sin 30^\circ = 0{,}75\ \text{m/s}$.

**Javob.** $90^\circ$.

:::

</SimExample>

### 2-masala. Markaziy uriliş

Xuddi şu şar ikkinçi şarga aynan markazidan uriladi. Urilişdan keyin şarlarning tezliklari qança?

<SimExample :values='{"m1":0.17,"m2":0.17,"v0":1.5,"b":0,"e":1}' check="Töqnaşuvdan keyin υ₁ = 0,00 m/s, υ₂ = 1,50 m/s.">

::: details Yeçimni körsatiş

1. Elastik markaziy urilişda teng massali şarlar tezliklarini almaştiradi.
2. $\upsilon_1 = 0$, $\upsilon_2 = 1{,}5\ \text{m/s}$.

**Javob.** Birinçi şar töxtaydi, ikkinçisi 1,5 m/s bilan ketadi.

:::

</SimExample>

### 3-masala. Noelastik uriliş

1-masaladagi şarlar tiklaniş koeffitsiyenti 0,5 bölgan materialdan yasalgan. Ajraliş burçagi $90^\circ$ dan katta böladimi yoki kiçik? Impuls saqlanadimi?

<SimExample :values='{"m1":0.17,"m2":0.17,"v0":1.5,"b":0.5,"e":0.5}' check="Burçak 90° dan kiçik, impuls 0,255 kg·m/s ga teng bölib qoladi, kinetik energiya kamayadi.">

::: details Yeçimni körsatiş

1. Impuls har doim saqlanadi: $p = 0{,}17 \cdot 1{,}5 = 0{,}255\ \text{kg}\cdot\text{m/s}$.
2. Kinetik energiya kamayadi, $\upsilon_1^2 + \upsilon_2^2 < \upsilon_0^2$, şuning uçun burçak $90^\circ$ dan kiçik böladi.

**Javob.** Burçak $90^\circ$ dan kiçik; impuls saqlanadi.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 9-bob](https://openstax.org/books/university-physics-volume-1/pages/9-4-types-of-collisions). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
