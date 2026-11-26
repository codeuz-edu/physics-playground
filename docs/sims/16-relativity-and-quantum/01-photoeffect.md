---
title: "Fotoeffekt"
description: "Yoruğlik metall sirtidan elektronlarni urib çiqaradi, lekin faqat foton energiyasi çiqiş işidan katta bölsa. Katod moddasini, tölqin uzunligini va intensivlikni özgartiring: elektronlar tezligi intensivlikka emas, çastotaga boğliq."
topic: "Kvant fizikasi · Eynşteyn tenglamasi"
examples: 3
---

# Fotoeffekt

<SimLab id="photoeffect" />

## Asosiy ğoya

Quyoş panellari, fotoapparat sensorlari va avtomatik eşiklar fotoeffektga asoslangan. 1905-yilda Albert Eynşteyn bu hodisani yoruğlik kvantlari yordamida tuşuntirdi va şu iş uçun Nobel mukofotini oldi.

## Nazariya

Yoruğlik energiyasi portsiyalar — fotonlar bilan yutiladi. Bitta foton bitta elektronga butun energiyasini beradi. Uning bir qismi elektronni metalldan çiqariş işiga, qolgani elektronning kinetik energiyasiga sarflanadi.

<div class="eq-block">

<span class="eq-label">Foton energiyasi</span><span class="eq-body">$\displaystyle E = h\nu = \frac{hc}{\lambda}$</span>

<span class="eq-label">Eynşteyn tenglamasi</span><span class="eq-body">$\displaystyle h\nu = A_{\text{ç}} + \frac{m\upsilon^2}{2}$</span>

<span class="eq-label">Qizil çegara</span><span class="eq-body">$\displaystyle \lambda_{max} = \frac{hc}{A_{\text{ç}}}$</span>

<span class="eq-label">Tutib qoluvçi kuçlaniş</span><span class="eq-body">$\displaystyle eU_z = \frac{m\upsilon^2}{2}$</span>

</div>

Intensivlik ortsa, fotonlar köpayadi va çiqqan elektronlar soni ortadi, lekin ularning tezligi özgarmaydi. Tölqin uzunligi qizil çegaradan katta bölsa, yoruğlik qança kuçli bölmasin, fotoeffekt kuzatilmaydi.

Anodga teskari kuçlaniş berilsa, elektronlar tormozlanadi. Eng tez elektronlarni ham töxtatadigan kuçlaniş $U_z$ tutib qoluvçi kuçlaniş deyiladi: elektronvoltlarda ifodalangan kinetik energiya son jihatdan voltlardagi $U_z$ ga teng.

## Sinab köring

1. Intensivlikni oşiring: elektronlar tezroq uçadimi?
2. Seziy uçun qizil çegarani toping.
3. Qaysi metall körinadigan yoruğlikda işlamaydi?

## Masalalar

### 1-masala. Seziy katod

Çiqiş işi 1,9 eV bölgan seziy 400 nm li yoruğlik bilan yoritildi. Foton energiyasi, elektronlarning eng katta kinetik energiyasi va tezligini toping ($hc = 1240$ eV·nm).

<SimExample :values='{"metal":0,"lam":400,"I":60}' check="Foton energiyasi hν = 3,10 eV, elektronlarning eng katta kinetik energiyasi 1,20 eV, tezligi 650 km/s, tutib qoluvçi kuçlaniş 1,20 V.">

::: details Yeçimni körsatiş

1. $E = \dfrac{1240}{400} = 3{,}10\ \text{eV}$, $E_k = 3{,}10 - 1{,}9 = 1{,}20\ \text{eV}$.
2. $\upsilon = \sqrt{\dfrac{2 \cdot 1{,}2 \cdot 1{,}602\cdot10^{-19}}{9{,}109\cdot10^{-31}}} = 6{,}50\cdot10^5\ \text{m/s}$.

**Javob.** $E_k = 1{,}20\ \text{eV}$, $\upsilon \approx 650\ \text{km/s}$.

:::

</SimExample>

### 2-masala. Rux katod

Rux (A = 4,2 eV) xuddi şu 400 nm li yoruğlik bilan yoritildi. Fotoeffekt böladimi? Rux uçun qizil çegarani toping.

<SimExample :values='{"metal":3,"lam":400,"I":100}' check="Foton energiyasi hν = 3,10 eV çiqiş işidan kiçik: fotoeffekt yöq. Qizil çegara λ_max = 295 nm.">

::: details Yeçimni körsatiş

1. $3{,}10\ \text{eV} < 4{,}2\ \text{eV}$: fotoeffekt yöq.
2. $\lambda_{max} = \dfrac{1240}{4{,}2} = 295\ \text{nm}$.

**Javob.** Yöq; $\lambda_{max} \approx 295\ \text{nm}$.

:::

</SimExample>

### 3-masala. Ultrabinafşa yoruğlik

Rux 200 nm li ultrabinafşa yoruğlik bilan yoritildi. Elektronlar energiyasi va tezligi qança?

<SimExample :values='{"metal":3,"lam":200,"I":60}' check="Foton energiyasi hν = 6,20 eV, elektronlarning eng katta kinetik energiyasi 2,00 eV, tezligi 839 km/s">

::: details Yeçimni körsatiş

1. $E = \dfrac{1240}{200} = 6{,}20\ \text{eV}$, $E_k = 6{,}20 - 4{,}2 = 2{,}00\ \text{eV}$.
2. $\upsilon = \sqrt{\dfrac{2 \cdot 2 \cdot 1{,}602\cdot10^{-19}}{9{,}109\cdot10^{-31}}} = 8{,}39\cdot10^5\ \text{m/s}$.

**Javob.** $E_k = 2\ \text{eV}$, $\upsilon \approx 839\ \text{km/s}$.

:::

</SimExample>

## Manbalar

Bu mavzu 11-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 3-jild, 6-bob](https://openstax.org/books/university-physics-volume-3/pages/6-2-photoelectric-effect). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
