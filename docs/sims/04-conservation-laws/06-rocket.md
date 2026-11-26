---
title: "Reaktiv harakat"
description: "Raketa gazni orqaga otib, özi oldinga harakatlanadi: bu impulsning saqlaniş qonuni. Yoqilği massasini, gaz tezligini va sarfini özgartiring, kosmosda va Yerdan uçişni soliştiring."
topic: "Saqlaniş qonunlari · Reaktiv harakat"
examples: 3
---

# Reaktiv harakat

<SimLab id="rocket" />

## Asosiy ğoya

Havosi çiqarib yuborilgan şar xona böylab uçib ketadi, kalmar suvni otib, oldinga suzadi, raketa esa havo bölmagan kosmosda ham tezlanadi. Bularning hammasi reaktiv harakat: jism özining bir qismini bir tomonga otib, özi qarama-qarşi tomonga harakatlanadi.

Reaktiv harakat nazariyasini Konstantin Siolkovskiy yaratgan. U raketa tezligi gaz tezligi va massalar nisbati bilan qanday boğliqligini körsatdi. Bu formula hozir ham kosmik uçişlarni hisoblaşning asosi.

<div class="lesson-photos">

<SimPhoto name="apollo11-launch" :width="960" :height="1200" :display-width="380" class="tall" alt="“Saturn-5” raketasi “Apollon-11” ekipaji bilan startdan kötarilmoqda" caption="1969-yil 16-iyul: “Saturn-5” raketasi “Apollon-11” ekipajini Oyga olib ketmoqda. Birinçi bosqiç dvigatellari har sekundda 13 tonnaga yaqin yoqilği yondirib, gazni pastga otadi, gaz esa raketani yuqoriga itaradi." credit="Surat: NASA, jamoat mulki, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Apollo_11_Launch_-_GPN-2000-000630.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Raketa va undan otilib çiqayotgan gaz yopiq sistema hosil qiladi. Gaz orqaga impuls olib ketadi, raketa esa xuddi şunça impulsni oldinga oladi. Har sekundda $\mu$ kg gaz raketaga nisbatan $u$ tezlik bilan otilsa, raketaga reaktiv kuç taʼsir qiladi.

<div class="eq-block">

<span class="eq-label">Impulsning saqlanişi</span><span class="eq-body">$\displaystyle m\,\Delta\upsilon = u\,\Delta m$</span>

<span class="eq-label">Reaktiv kuç</span><span class="eq-body">$\displaystyle F = \mu u$</span>

<span class="eq-label">Siolkovskiy formulasi</span><span class="eq-body">$\displaystyle \upsilon = u \ln\frac{m_0}{m}$</span>

<span class="eq-label">Yerdan tik uçişda</span><span class="eq-body">$\displaystyle \upsilon = u \ln\frac{m_0}{m} - g t$</span>

</div>

Yerdan raketa faqat reaktiv kuç oğirlikdan katta bölganda kötariladi: $\mu u > m g$. Aks holda u massa $m_1 = \mu u/g$ gaça kamaygunça startda turadi, söng $\upsilon = u \ln\dfrac{m_1}{m} - g(t - t_1)$.

Kosmosda (tortişsiz) raketaning oxirgi tezligi yoqilği qança tez yonişiga emas, gaz tezligiga va massalar nisbati $m_0/M$ ga boğliq. Yerdan uçişda esa yoqilği qança tez yonsa, $g t$ yöqotiş şunça kam böladi. Birinçi kosmik tezlikka erişiş uçun odatda bitta bosqiç yetmaydi, şuning uçun köp bosqiçli raketalar işlatiladi.

## Sinab köring

1. Yoqilği sarfini ikki marta oşiring. Oxirgi tezlik özgaradimi? Vaqt-çi? Kosmosda va Yerdan soliştiring.
2. Gaz tezligini oşiring: tezlik qanday özgaradi?
3. “Massa” grafigi nega töğri çiziq?

## Masalalar

### 1-masala. Kosmosdagi raketa

Quruq massasi 500 kg bölgan raketada 1500 kg yoqilği bor. Gaz 2500 m/s tezlik bilan otiladi, yoqilği sarfi 50 kg/s. Reaktiv kuçni, yoniş vaqtini va raketaning oxirgi tezligini toping (tortiş kuçlari yöq).

<SimExample :values='{"M":500,"mf":1500,"u":2500,"q":50,"mode":0,"g":9.81}' check="Yoqilği 30,0 s da tugadi. Raketaning tezligi 3465,7 m/s.">

::: details Yeçimni körsatiş

1. $F = \mu u = 50 \cdot 2500 = 125\ \text{kN}$, $t = \dfrac{1500}{50} = 30\ \text{s}$.
2. $\upsilon = 2500 \ln\dfrac{2000}{500} = 2500 \cdot 1{,}386 = 3466\ \text{m/s}$.

**Javob.** $F = 125\ \text{kN}$, $t = 30\ \text{s}$, $\upsilon \approx 3466\ \text{m/s}$.

:::

</SimExample>

### 2-masala. Xuddi şu raketa Yerdan

Xuddi şu raketa Yerdan tik yuqoriga uçirildi. Uçiş boşidagi tezlaniş va yoqilği tugagandagi tezlik qança (havo qarşiligini va $g$ ning özgarişini hisobga olmang)?

<SimExample :values='{"M":500,"mf":1500,"u":2500,"q":50,"mode":1,"g":9.81}' check="Yoqilği 30,0 s da tugadi. Raketaning tezligi 3171,4 m/s.">

::: details Yeçimni körsatiş

1. Boşida $a = \dfrac{F}{m_0} - g = \dfrac{125\,000}{2000} - 9{,}81 = 52{,}7\ \text{m/s}^2$.
2. $\upsilon = 3466 - 9{,}81 \cdot 30 = 3171\ \text{m/s}$.

**Javob.** $a_0 \approx 52{,}7\ \text{m/s}^2$, $\upsilon \approx 3171\ \text{m/s}$.

:::

</SimExample>

### 3-masala. Massalar nisbati 10

Raketaning töla massasi quruq massasidan 10 marta katta (200 kg + 1800 kg yoqilği), gaz tezligi 3000 m/s. Kosmosda u qanday tezlikka erişadi? Bu birinçi kosmik tezlikka yetadimi?

<SimExample :values='{"M":200,"mf":1800,"u":3000,"q":60,"mode":0,"g":9.81}' check="Yoqilği 30,0 s da tugadi. Raketaning tezligi 6907,8 m/s.">

::: details Yeçimni körsatiş

1. $\upsilon = 3000 \ln 10 = 3000 \cdot 2{,}303 = 6908\ \text{m/s}$.
2. Bu 7,9 km/s dan kiçik: bitta bosqiç yetmaydi.

**Javob.** $\upsilon \approx 6908\ \text{m/s}$; yetmaydi.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 9-bob](https://openstax.org/books/university-physics-volume-1/pages/9-7-rocket-propulsion). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
