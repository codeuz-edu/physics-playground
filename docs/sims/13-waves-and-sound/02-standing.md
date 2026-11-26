---
title: "Torda turğun tölqin"
description: "Ikki uçi mahkamlangan torda faqat butun son yarim tölqin siğadigan tebranişlar turğun böladi. Garmonika raqamini, tor uzunligini, tarangligini va çiziqli ziçligini özgartirib, tugunlar va çastotani kuzating. Harakat sekinlaştirib körsatilgan."
topic: "Tölqinlar va tovuş · Turğun tölqinlar va garmonikalar"
examples: 3
---

# Torda turğun tölqin

<SimLab id="standing" />

## Asosiy ğoya

Gitara, dutor yoki ğijjak torini çertsak, tor faqat maʼlum çastotalarda tebranadi. Bu çastotalar tor uzunligi, tarangligi va massasiga boğliq: musiqa asboblari şunday sozlanadi.

## Nazariya

Torning uçlaridan qaytgan tölqinlar bir-biri bilan qöşilib, turğun tölqin hosil qiladi. Tugun nuqtalarda tor doimo tinç turadi, döngliklarda esa eng katta amplituda bilan tebranadi. Tor uçlari tugun bölişi kerak, şuning uçun tor uzunligiga butun son yarim tölqin siğadi.

<div class="eq-block">

<span class="eq-label">Turğunlik şarti</span><span class="eq-body">$\displaystyle l = n\frac{\lambda}{2},\quad \lambda_n = \frac{2l}{n}$</span>

<span class="eq-label">Tordagi tölqin tezligi</span><span class="eq-body">$\displaystyle \upsilon = \sqrt{\frac{F}{\mu}}$</span>

<span class="eq-label">Xususiy çastotalar</span><span class="eq-body">$\displaystyle \nu_n = \frac{n\upsilon}{2l} = \frac{n}{2l}\sqrt{\frac{F}{\mu}}$</span>

</div>

Bu yerda $F$ — torning taranglik kuçi, $\mu$ — torning çiziqli ziçligi, yaʼni bir metr torning massasi ($1\ \text{g/m} = 0{,}001\ \text{kg/m}$). $n = 1$ — asosiy ton, qolganlari obertonlar. Gitaristlar torni barmoq bilan qisqartirib, asosiy ton çastotasini oşiradi, torni taranglaştirib esa asbobni sozlaydi. Yöğon (oğir) torlar past tovuş beradi.

## Sinab köring

1. Torni ikki marta qisqartiring: çastota qanday özgaradi?
2. Qaysi nuqtalar hamma vaqt tinç turadi?
3. n ni oşirganda tugunlar orasidagi masofa qanday özgaradi?
4. Taranglik kuçini 4 marta oşiring: çastota neça marta ortadi?

## Masalalar

### 1-masala. Asosiy ton

Uzunligi 1 m bölgan tor 40 N kuç bilan taranglangan, uning çiziqli ziçligi 1 g/m. Asosiy tonning tölqin uzunligi va çastotasini toping.

<SimExample :values='{"n":1,"L":1,"F":40,"mu":1}' check="1-garmonika: λ = 2l/n = 2,00 m, ν = nυ/(2l) = 100,0 Hz, tugunlar soni 2, döngliklar soni 1.">

::: details Yeçimni körsatiş

1. $\upsilon = \sqrt{\dfrac{F}{\mu}} = \sqrt{\dfrac{40}{0{,}001}} = 200\ \text{m/s}$.
2. $\lambda_1 = 2l = 2\ \text{m}$.
3. $\nu_1 = \dfrac{\upsilon}{2l} = \dfrac{200}{2} = 100\ \text{Hz}$.

**Javob.** $\lambda_1 = 2\ \text{m}$, $\nu_1 = 100\ \text{Hz}$.

:::

</SimExample>

### 2-masala. Uçinçi garmonika

Xuddi şu torda uçinçi garmonikaning çastotasi va tugunlar soni qança?

<SimExample :values='{"n":3,"L":1,"F":40,"mu":1}' check="3-garmonika: λ = 2l/n = 0,67 m, ν = nυ/(2l) = 300,0 Hz, tugunlar soni 4, döngliklar soni 3.">

::: details Yeçimni körsatiş

1. $\lambda_3 = \dfrac{2}{3} = 0{,}67\ \text{m}$, $\nu_3 = 3\nu_1 = 300\ \text{Hz}$.
2. Tugunlar: $n + 1 = 4$ (uçlari bilan).

**Javob.** $\nu_3 = 300\ \text{Hz}$, 4 tugun.

:::

</SimExample>

### 3-masala. Gitara tori

Gitara torining işçi uzunligi 0,65 m, taranglik kuçi 81,8 N, çiziqli ziçligi 1 g/m. Tor qanday çastotada tovuş beradi?

<SimExample :values='{"n":1,"L":0.65,"F":81.8,"mu":1}' check="1-garmonika: λ = 2l/n = 1,30 m, ν = nυ/(2l) = 220,0 Hz">

::: details Yeçimni körsatiş

1. $\upsilon = \sqrt{\dfrac{F}{\mu}} = \sqrt{\dfrac{81{,}8}{0{,}001}} \approx 286\ \text{m/s}$.
2. $\nu_1 = \dfrac{\upsilon}{2l} = \dfrac{286}{2 \cdot 0{,}65} = 220\ \text{Hz}$ (lya notasi, kiçik oktava).

**Javob.** $\nu_1 = 220\ \text{Hz}$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 16-bob](https://openstax.org/books/university-physics-volume-1/pages/16-6-standing-waves-and-resonance). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
