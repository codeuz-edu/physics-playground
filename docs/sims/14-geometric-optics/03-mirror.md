---
title: "Sferik közgu"
description: "Botiq közgu nurlarni fokusda yiğadi, qavariq közgu esa soçadi. Közgu turini, egrilik radiusini va buyumgaça masofani özgartirib, tasvir qayerda va qanday hosil bölişini köring."
topic: "Geometrik optika · Közgularda tasvir"
examples: 3
---

# Sferik közgu

<SimLab id="mirror" />

## Asosiy ğoya

Fara va projektorlarda lampa botiq közgu fokusiga qöyiladi va közgu parallel nurlar dastasini hosil qiladi. Teleskoplarning eng kattalarida linza emas, ulkan botiq közgu işlatiladi.

## Nazariya

Sferik közguning fokus masofasi egrilik radiusining yarmiga teng. Boş optik öqqa parallel nur botiq közgudan qaytib fokusdan ötadi, közgu qutbiga tuşgan nur esa öqqa nisbatan simmetrik qaytadi. Rasmda uçinçi nur ham bor: fokus orqali tuşgan nur öqqa parallel qaytadi.

<div class="eq-block">

<span class="eq-label">Fokus masofasi</span><span class="eq-body">$\displaystyle F = \frac{R}{2}$</span>

<span class="eq-label">Közgu formulasi</span><span class="eq-body">$\displaystyle \frac{1}{F} = \frac{1}{d} + \frac{1}{f}$</span>

<span class="eq-label">Kattalaştiriş</span><span class="eq-body">$\displaystyle \Gamma = \frac{|f|}{d}$</span>

</div>

Qavariq közgu uçun $F$ manfiy: u hamma vaqt kiçraytirilgan mavhum tasvir beradi, lekin keng körinişni qamraydi. Şuning uçun u avtomobillarda va köça burilişlarida işlatiladi.

“Boşlaş” bosilganda buyum uzoqdan (fokus içidagi holatda esa közgu yonidan) tanlangan masofagaça siljiydi va tasvir unga ergaşadi: grafikda $d$ va $f$ qanday özgarişini kuzating. Rasmda balandliklar masofalarga nisbatan 3 marta kattalaştirilgan.

## Sinab köring

1. Buyumni markaz C ga qöying: tasvir qanday böladi?
2. Qavariq közguda buyumni yaqinlaştiring: tasvir kattalaşadimi?
3. Buyumni fokusga qöying: nima böladi?

## Masalalar

### 1-masala. Botiq közgu

Egrilik radiusi 20 sm bölgan botiq közgudan 15 sm uzoqlikda 2 sm li buyum turibdi. Tasvirni toping.

<SimExample :values='{"type":0,"R":20,"d":15,"h":2}' check="Tasvir haqiqiy, teskari, közgu oldida: f = 30,0 sm, Γ = 2,00, H = 4,00 sm.">

::: details Yeçimni körsatiş

1. $F = \dfrac{R}{2} = 10\ \text{sm}$, $\dfrac{1}{f} = \dfrac{1}{10} - \dfrac{1}{15} = \dfrac{1}{30}$, $f = 30\ \text{sm}$.
2. $\Gamma = \dfrac{30}{15} = 2$, $H = 2 \cdot 2 = 4\ \text{sm}$: haqiqiy, teskari, kattalaştirilgan.

**Javob.** $f = 30\ \text{sm}$, $\Gamma = 2$.

:::

</SimExample>

### 2-masala. Fokus içida

Buyum xuddi şu közgudan 6 sm uzoqlikka qöyildi. Tasvirni toping.

<SimExample :values='{"type":0,"R":20,"d":6,"h":2}' check="Tasvir mavhum, töğri, közgu ortida: |f| = 15,0 sm, Γ = 2,50, H = 5,00 sm.">

::: details Yeçimni körsatiş

1. $\dfrac{1}{f} = \dfrac{1}{10} - \dfrac{1}{6} = -\dfrac{1}{15}$, $f = -15\ \text{sm}$.
2. $\Gamma = \dfrac{15}{6} = 2{,}5$, $H = 2{,}5 \cdot 2 = 5\ \text{sm}$: mavhum, töğri.

**Javob.** Mavhum tasvir közgu ortida 15 sm da, $\Gamma = 2{,}5$.

:::

</SimExample>

### 3-masala. Qavariq közgu

Egrilik radiusi 40 sm bölgan qavariq közgudan 20 sm uzoqlikda 2 sm li buyum bor. Tasvir qayerda?

<SimExample :values='{"type":1,"R":40,"d":20,"h":2}' check="Tasvir mavhum, töğri, közgu ortida: |f| = 10,0 sm, Γ = 0,50, H = 1,00 sm.">

::: details Yeçimni körsatiş

1. $F = -\dfrac{R}{2} = -20\ \text{sm}$, $\dfrac{1}{f} = -\dfrac{1}{20} - \dfrac{1}{20} = -\dfrac{1}{10}$, $f = -10\ \text{sm}$.
2. $\Gamma = \dfrac{10}{20} = 0{,}5$, $H = 0{,}5 \cdot 2 = 1\ \text{sm}$.

**Javob.** Mavhum, töğri, kiçraytirilgan: közgu ortida 10 sm da.

:::

</SimExample>

## Manbalar

Bu mavzu 11-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 3-jild, 2-bob](https://openstax.org/books/university-physics-volume-3/pages/2-3-spherical-mirrors). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
