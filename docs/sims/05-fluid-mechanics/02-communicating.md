---
title: "Tutaş idişlar"
description: "U şaklidagi nayning bir tirsagiga boşqa suyuqlik quying. Bir jinsli suyuqlik tutaş idişlarda bir xil sathda turadi, ziçligi har xil suyuqliklarning ustunlari esa ziçliklarga teskari proporsional böladi."
topic: "Suyuqliklar mexanikasi · Tutaş idişlar"
examples: 3
---

# Tutaş idişlar

<SimLab id="communicating" />

## Asosiy ğoya

Çoynakning jömragi, suv minorasi va uylardagi suv quvurlari, kanallardagi şlyuzlar — hammasi tutaş idişlar. Suv minorasi baland qurilgani uçun undagi suv quvurlar orqali uylarning yuqori qavatlarigaça kötariladi.

Tutaş idişlarga özaro aralaşmaydigan ikki xil suyuqlik quyilsa, sirtlar bir xil sathda turmaydi. Bu hodisadan nomaʼlum suyuqlikning ziçligini ölçaşda foydalaniladi.

<div class="lesson-photos">

<SimPhoto name="water-tower" :width="1200" :height="772" alt="Qişloqdagi gişt suv minorasi" caption="Suv minorasi va uylarga borgan quvurlar — tutaş idişlar. Minoradagi suv sathi qança baland bölsa, quvurlarda suv şunça baland qavatgaça kötariladi." credit="Surat: Marat Safarov, &lt;a href=&quot;https://creativecommons.org/licenses/by-sa/4.0&quot;&gt;CC BY-SA 4.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:%D0%92%D0%BE%D0%B4%D0%BE%D0%BD%D0%B0%D0%BF%D0%BE%D1%80%D0%BD%D0%B0%D1%8F_%D0%B1%D0%B0%D1%88%D0%BD%D1%8F_%D0%B2_%D1%81%D0%B5%D0%BB%D0%B5_%D0%94%D1%83%D0%B1%D1%8A%D1%8F%D0%B7%D1%8B_(3).JPG&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Tubi orqali özaro tutaşgan idişlar *tutaş idişlar* deyiladi. Ularga bir jinsli suyuqlik quyilsa, idişlarning şakli va kengligidan qatʼi nazar, suyuqlik sirtlari bir xil sathda turadi. Aks holda bir xil çuqurlikdagi bosimlar har xil bölib, suyuqlik oqa boşlar edi.

<div class="eq-block">

<span class="eq-label">Bir jinsli suyuqlik</span><span class="eq-body">$\displaystyle h_1 = h_2$</span>

<span class="eq-label">Ajraliş sathida bosimlar teng</span><span class="eq-body">$\displaystyle \rho_1 g h_1 = \rho_2 g h_2$</span>

<span class="eq-label">Ustunlar nisbati</span><span class="eq-body">$\displaystyle \frac{h_1}{h_2} = \frac{\rho_2}{\rho_1}$</span>

</div>

Balandliklar ikki suyuqlikning ajraliş sathidan ölçanadi. Ziçligi kiçik suyuqlikning ustuni baland böladi. Bu nisbat $g$ ga boğliq emas: Oyda ham ustunlar xuddi şunday nisbatda turadi.

## Sinab köring

1. Kerosin ustunini ikki marta oşiring. h₁ qança özgaradi?
2. Naydagi suvni simob bilan almaştiring. Nima uçun simob deyarli kötarilmaydi?
3. Sayyorani Oyga almaştiring. Ustunlar balandligi özgaradimi? Bosim-çi?

## Masalalar

### 1-masala. Suv va kerosin

U şaklidagi nayda suv bor. Öng tirsakka 20 sm balandlikda kerosin quyildi. Çap tirsakdagi suv ajraliş sathidan qança balandlikda turadi? Suyuqliklarning sirtlari orasidagi farq qança?

<SimExample :values='{"liq1":0,"liq2":0,"H2":20,"q":4,"g":9.81}' check="Öng tirsakka 20,0 sm kerosin quyildi. Ajraliş sathidan hisoblaganda suv ustuni h₁ = 16,0 sm, kerosin ustuni h₂ = 20,0 sm: h₁/h₂ = ρ₂/ρ₁ = 0,800.">

::: details Yeçimni körsatiş

1. Ajraliş sathida ikkala tirsakdagi bosim teng: $\rho_\text{s} g h_1 = \rho_\text{k} g h_2$.
2. $h_1 = h_2 \dfrac{\rho_\text{k}}{\rho_\text{s}} = 20 \cdot \dfrac{800}{1000} = 16\ \text{sm}$.
3. Sirtlar farqi $20 - 16 = 4\ \text{sm}$: kerosin sirti balandroq.

**Javob.** $h_1 = 16\ \text{sm}$, sirtlar farqi 4 sm.

:::

</SimExample>

### 2-masala. Simob ustiga suv

U şaklidagi nayda simob bor. Bir tirsakka 27,2 sm suv quyildi. Ikkinçi tirsakdagi simob ajraliş sathidan qança balandlikda turadi?

<SimExample :values='{"liq1":1,"liq2":2,"H2":27.2,"q":4,"g":9.81}' check="Öng tirsakka 27,2 sm suv quyildi. Ajraliş sathidan hisoblaganda simob ustuni h₁ = 2,0 sm, suv ustuni h₂ = 27,2 sm: h₁/h₂ = ρ₂/ρ₁ = 0,074.">

::: details Yeçimni körsatiş

1. $h_1 = h_2 \dfrac{\rho_\text{suv}}{\rho_\text{simob}} = 27{,}2 \cdot \dfrac{1000}{13\,600} = 2{,}0\ \text{sm}$.
2. Simobning ziçligi suvnikidan 13,6 marta katta, şuning uçun uning ustuni 13,6 marta past.

**Javob.** $h_1 = 2{,}0\ \text{sm}$.

:::

</SimExample>

### 3-masala. Moyning ziçligi

Suvli U şaklidagi nayning bir tirsagiga 25 sm ösimlik moyi quyilganda, ikkinçi tirsakdagi suv ajraliş sathidan 23 sm balandlikda turdi. Moyning ziçligini toping.

<SimExample :values='{"liq1":0,"liq2":1,"H2":25,"q":4,"g":9.81}' check="Öng tirsakka 25,0 sm ösimlik moyi quyildi. Ajraliş sathidan hisoblaganda suv ustuni h₁ = 23,0 sm, ösimlik moyi ustuni h₂ = 25,0 sm: h₁/h₂ = ρ₂/ρ₁ = 0,920.">

::: details Yeçimni körsatiş

1. Ajraliş sathida: $\rho_\text{m} g h_2 = \rho_\text{s} g h_1$.
2. $\rho_\text{m} = \rho_\text{s} \dfrac{h_1}{h_2} = 1000 \cdot \dfrac{23}{25} = 920\ \text{kg/m}^3$.

**Javob.** $\rho_\text{m} = 920\ \text{kg/m}^3$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 14-bob](https://openstax.org/books/university-physics-volume-1/pages/14-2-measuring-pressure). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
