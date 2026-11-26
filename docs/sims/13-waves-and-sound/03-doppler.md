---
title: "Dopler effekti"
description: "Harakatlanayotgan manba oldida tölqinlar ziçlaşadi, orqasida siyraklaşadi. Manba kuzatuvçiga yaqinlaşganda tovuş baland, uzoqlaşganda past eşitiladi. Manba çastotasi va tezligini, kuzatuvçi tezligini özgartiring."
topic: "Tölqinlar va tovuş · Dopler effekti"
examples: 3
---

# Dopler effekti

<SimLab id="doppler" />

## Asosiy ğoya

Yonimizdan siren çalib ötgan tez yordam maşinasining ovozi birdan pastlaşadi. 1842-yilda avstriyalik olim Kristian Dopler bu hodisani tuşuntirib berdi. Bugun undan radarlarda, tibbiyotda (UTT) va astronomiyada foydalaniladi.

## Nazariya

Manba harakatlanganda u har bir navbatdagi tölqinni avvalgisidan boşqa nuqtada çiqaradi. Oldinga qarab tölqinlar orasidagi masofa qisqaradi, orqaga qarab esa uzayadi. Kuzatuvçi qabul qiladigan çastota tölqin uzunligiga teskari proporsional. Kuzatuvçi manba tomon harakatlansa, tölqin frontlari unga tezroq uriladi va çastota yana ortadi.

<div class="eq-block">

<span class="eq-label">Yaqinlaşayotgan manba</span><span class="eq-body">$\displaystyle \nu = \nu_0\frac{\upsilon}{\upsilon - \upsilon_m}$</span>

<span class="eq-label">Uzoqlaşayotgan manba</span><span class="eq-body">$\displaystyle \nu = \nu_0\frac{\upsilon}{\upsilon + \upsilon_m}$</span>

<span class="eq-label">Harakatlanayotgan kuzatuvçi</span><span class="eq-body">$\displaystyle \nu = \nu_0\frac{\upsilon \pm \upsilon_k}{\upsilon}$</span>

<span class="eq-label">Ikkalasi ham harakatlansa</span><span class="eq-body">$\displaystyle \nu = \nu_0\frac{\upsilon \pm \upsilon_k}{\upsilon \mp \upsilon_m}$</span>

</div>

Bu yerda $\upsilon = 340$ m/s — havodagi tovuş tezligi; yuqori işoralar yaqinlaşişga, pastkilari uzoqlaşişga tegişli. Formulalar manba tovuşdan sekin harakatlanganda ($\upsilon_m < \upsilon$) töğri. Kuzatuvçi tovuşni birinçi tölqin fronti unga yetib kelgandagina eşita boşlaydi. Xuddi şu hodisa yoruğlikda ham bor: uzoqlaşayotgan yulduzlar spektri qizil tomonga siljiydi.

## Sinab köring

1. Manba tezligini 0 qiling: doiralar qanday joylaşadi?
2. Tezlikni 100 m/s gaça oşiring: manba oldidagi tölqinlar qanday körinadi?
3. Yaqinlaşiş va uzoqlaşişda çastota özgarişlarini soliştiring.
4. Manbani töxtatib, kuzatuvçini 25 m/s tezlik bilan yaqinlaştiring: çastota 1-masaladagidan farq qiladimi?

## Masalalar

### 1-masala. Yaqinlaşayotgan manba

500 Hz çastotali manba tinç turgan kuzatuvçiga 25 m/s tezlik bilan yaqinlaşmoqda. Kuzatuvçi qanday çastotani eşitadi?

<SimExample :values='{"f0":500,"vs":25,"vo":0,"dir":0}' check="Kuzatuvçi 539,7 Hz çastotani eşitadi (manba 500 Hz). Unga yetib kelayotgan tölqin uzunligi λ = 0,630 m.">

::: details Yeçimni körsatiş

1. $\nu = 500 \cdot \dfrac{340}{340 - 25} = 539{,}7\ \text{Hz}$.
2. $\lambda = \dfrac{315}{500} = 0{,}630\ \text{m}$.

**Javob.** $\nu \approx 539{,}7\ \text{Hz}$.

:::

</SimExample>

### 2-masala. Uzoqlaşayotgan manba

Xuddi şu manba kuzatuvçidan 25 m/s tezlik bilan uzoqlaşmoqda. Eşitiladigan çastota qança?

<SimExample :values='{"f0":500,"vs":25,"vo":0,"dir":1}' check="Kuzatuvçi 465,8 Hz çastotani eşitadi (manba 500 Hz). Unga yetib kelayotgan tölqin uzunligi λ = 0,730 m.">

::: details Yeçimni körsatiş

1. Manba uzoqlaşmoqda: $\nu = \nu_0\dfrac{\upsilon}{\upsilon + \upsilon_m}$.
2. $\nu = 500 \cdot \dfrac{340}{340 + 25} = \dfrac{170\,000}{365} = 465{,}8\ \text{Hz}$, $\lambda = \dfrac{365}{500} = 0{,}730\ \text{m}$.

**Javob.** $\nu \approx 465{,}8\ \text{Hz}$.

:::

</SimExample>

### 3-masala. Siren

Tez yordam maşinasi sireni 700 Hz çastotada çaladi, maşina 30 m/s (108 km/soat) tezlik bilan yaqinlaşmoqda. Piyoda qanday çastotani eşitadi?

<SimExample :values='{"f0":700,"vs":30,"vo":0,"dir":0}' check="Kuzatuvçi 767,7 Hz çastotani eşitadi (manba 700 Hz).">

::: details Yeçimni körsatiş

1. Manba yaqinlaşmoqda, piyoda tinç turibdi: $\nu = \nu_0\dfrac{\upsilon}{\upsilon - \upsilon_m}$.
2. $\nu = 700 \cdot \dfrac{340}{340 - 30} = \dfrac{238\,000}{310} = 767{,}7\ \text{Hz}$.

**Javob.** $\nu \approx 767{,}7\ \text{Hz}$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 17-bob](https://openstax.org/books/university-physics-volume-1/pages/17-7-the-doppler-effect). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
