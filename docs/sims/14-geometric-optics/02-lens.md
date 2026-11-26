---
title: "Yupqa linza: tasvir yasaş"
description: "Buyumdan çiqqan uç xarakterli nur linzadan ötib, tasvirni hosil qiladi. Linza turini, fokus masofasini va buyumgaça masofani özgartirib, tasvir qaçon haqiqiy, qaçon mavhum bölişini köring."
topic: "Geometrik optika · Linza formulasi"
examples: 3
---

# Yupqa linza: tasvir yasaş

<SimLab id="lens" />

## Asosiy ğoya

Köz gavhari, fotoapparat obyektivi, közoynak va mikroskop — barçasida linzalar bor. Linza formulasi tasvir qayerda hosil bölişini va qança kattalaşişini oldindan hisoblaş imkonini beradi.

## Nazariya

Tasvir yasaş uçun buyum uçidan çiqqan ikki nur yetarli: boş optik öqqa parallel nur linzadan keyin fokusdan ötadi (soçuvçida — fokusdan çiqqanday körinadi), optik markazdan ötgan nur esa sinmaydi. Rasmda uçinçi nur ham bor: fokus orqali ötgan (soçuvçida — linza ortidagi fokusga yönalgan) nur linzadan keyin öqqa parallel ketadi.

<div class="eq-block">

<span class="eq-label">Yupqa linza formulasi</span><span class="eq-body">$\displaystyle \frac{1}{F} = \frac{1}{d} + \frac{1}{f}$</span>

<span class="eq-label">Kattalaştiriş</span><span class="eq-body">$\displaystyle \Gamma = \frac{H}{h} = \frac{|f|}{d}$</span>

<span class="eq-label">Optik kuç</span><span class="eq-body">$\displaystyle D = \frac{1}{F}$</span>

</div>

Soçuvçi linza uçun $F$ manfiy olinadi. $f$ musbat çiqsa tasvir haqiqiy (ekranda olinadi), manfiy çiqsa mavhum. Yiğuvçi linzada buyum fokus içida bölsa, kattalaştirilgan mavhum tasvir hosil böladi — lupa şunday işlaydi.

“Boşlaş” bosilganda buyum uzoqdan (lupa holatida esa linza yonidan) tanlangan masofagaça siljiydi va tasvir unga ergaşadi. Grafikda buyum fokusga yaqinlaşganda tasvir qanday tez uzoqlaşişini kuzating. Rasmda balandliklar masofalarga nisbatan 3 marta kattalaştirilgan.

## Sinab köring

1. Buyumni 2F nuqtaga qöying: tasvir qanday böladi?
2. Buyumni fokusga yaqinlaştiring: tasvir qayerga ketadi?
3. Soçuvçi linza haqiqiy tasvir bera oladimi?

## Masalalar

### 1-masala. Haqiqiy tasvir

Fokus masofasi 10 sm bölgan yiğuvçi linzadan 30 sm uzoqlikda balandligi 2 sm buyum turibdi. Tasvir qayerda va qanday?

<SimExample :values='{"type":0,"F":10,"d":30,"h":2}' check="Tasvir haqiqiy, teskari: f = 15,0 sm, kattalaştiriş Γ = 0,50, tasvir balandligi H = 1,00 sm.">

::: details Yeçimni körsatiş

1. $\dfrac{1}{f} = \dfrac{1}{10} - \dfrac{1}{30} = \dfrac{1}{15}$, $f = 15\ \text{sm}$.
2. $\Gamma = \dfrac{15}{30} = 0{,}5$, $H = 1\ \text{sm}$: haqiqiy, teskari, kiçraytirilgan.

**Javob.** $f = 15\ \text{sm}$, $\Gamma = 0{,}5$, $H = 1\ \text{sm}$.

:::

</SimExample>

### 2-masala. Lupa

Buyum xuddi şu linzadan 5 sm uzoqlikka qöyildi. Tasvirni toping.

<SimExample :values='{"type":0,"F":10,"d":5,"h":2}' check="Tasvir mavhum, töğri: f = 10,0 sm (buyum tomonida), kattalaştiriş Γ = 2,00, tasvir balandligi H = 4,00 sm.">

::: details Yeçimni körsatiş

1. $\dfrac{1}{f} = \dfrac{1}{10} - \dfrac{1}{5} = -\dfrac{1}{10}$, $f = -10\ \text{sm}$.
2. $\Gamma = \dfrac{10}{5} = 2$, $H = 4\ \text{sm}$: mavhum, töğri, kattalaştirilgan.

**Javob.** Mavhum tasvir buyum tomonida 10 sm da, $\Gamma = 2$.

:::

</SimExample>

### 3-masala. Soçuvçi linza

Fokus masofasi 10 sm bölgan soçuvçi linzadan 30 sm uzoqlikda 2 sm li buyum turibdi. Tasvir qayerda?

<SimExample :values='{"type":1,"F":10,"d":30,"h":2}' check="Tasvir mavhum, töğri: f = 7,5 sm (buyum tomonida), kattalaştiriş Γ = 0,25, tasvir balandligi H = 0,50 sm.">

::: details Yeçimni körsatiş

1. $\dfrac{1}{f} = -\dfrac{1}{10} - \dfrac{1}{30} = -\dfrac{4}{30}$, $f = -7{,}5\ \text{sm}$.
2. $\Gamma = \dfrac{7{,}5}{30} = 0{,}25$, $H = 0{,}5\ \text{sm}$.

**Javob.** Mavhum, töğri, kiçraytirilgan: $|f| = 7{,}5\ \text{sm}$.

:::

</SimExample>

## Manbalar

Bu mavzu 11-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 3-jild, 2-bob](https://openstax.org/books/university-physics-volume-3/pages/2-4-thin-lenses). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
