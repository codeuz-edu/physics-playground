---
title: "Sirt taranglik va kapillyarlik"
description: "Ingiçka nayda suv kötariladi, simob esa pasayadi. Suyuqlikni va nay radiusini tanlang: ustun balandligi sirt taranglik kuçi bilan oğirlik kuçi tenglaşgan joyda töxtaydi."
topic: "Molekulyar fizika · Suyuqliklarning xossalari"
examples: 3
---

# Sirt taranglik va kapillyarlik

<SimLab id="capillary" />

## Asosiy ğoya

Suv yuzasida igna va suv qandalalari bemalol turadi, tomçilar esa dumaloq şaklga kiradi. Buning sababi sirt taranglik: suyuqlik sirtidagi molekulalarni içkaridagi qöşnilari tortib turadi va sirt imkon qadar kiçrayişga intiladi.

## Nazariya

Suyuqlik sirti taranglangan parda kabi qisqarişga intiladi. Sirt çegarasining har bir uzunlik birligiga $\sigma$ kuç taʼsir qiladi. Suyuqlik nay devorini höllasa ($\theta < 90^\circ$), bu kuç ustunni yuqoriga tortadi; höllamasa, pastga itaradi.

<div class="eq-block">

<span class="eq-label">Sirt taranglik kuçi</span><span class="eq-body">$\displaystyle F = \sigma \cdot 2\pi r \cos\theta$</span>

<span class="eq-label">Muvozanat</span><span class="eq-body">$\displaystyle \sigma \cdot 2\pi r \cos\theta = \rho g \pi r^2 h$</span>

<span class="eq-label">Kötariliş balandligi</span><span class="eq-body">$\displaystyle h = \frac{2\sigma\cos\theta}{\rho g r}$</span>

</div>

Nay qança ingiçka bölsa, suyuqlik şunça baland kötariladi. Sulgining suvni şimişi va tuproqda namlikning yuqoriga çiqişi şu hodisaga asoslangan. Ösimliklarda suvning ildizdan barglargaça kötarilişiga kapillyarlik qisman yordam beradi: baland daraxtlarda suvni asosan barglardan buğlanayotgan suv tortib çiqaradi.

## Sinab köring

1. Nay radiusini ikki marta kamaytiring: ustun neça marta baland böladi?
2. Oyda (g = 1,62 m/s²) suv qança kötarilar edi?
3. Nega simob nayda pasayadi?

## Masalalar

### 1-masala. Suv ingiçka nayda

Radiusi 0,5 mm bölgan şişa nayda suv qança balandlikka kötariladi? $\sigma = 0{,}073$ N/m, suv şişani töla höllaydi.

<SimExample :values='{"liq":0,"r":0.5,"g":9.81}' check="Suv kapillyarda kötarilib, h = 29,8 mm da töxtadi">

::: details Yeçimni körsatiş

1. Muvozanatda sirt taranglik kuçi ustun oğirligiga teng: $\sigma \cdot 2\pi r = \rho g \pi r^2 h$ (töla höllaşda $\cos\theta = 1$), bundan $h = \dfrac{2\sigma}{\rho g r}$.
2. $h = \dfrac{2 \cdot 0{,}073}{1000 \cdot 9{,}81 \cdot 0{,}0005} = 0{,}0298\ \text{m} \approx 29{,}8\ \text{mm}$.
3. Sirt taranglik kuçi $F = \sigma \cdot 2\pi r = 0{,}073 \cdot 2\pi \cdot 0{,}0005 = 2{,}29 \cdot 10^{-4}\ \text{N} = 0{,}229\ \text{mN}$: kötarilgan ustunning oğirligi ham şunça.

**Javob.** $h \approx 29{,}8\ \text{mm}$.

:::

</SimExample>

### 2-masala. Spirt

Xuddi şu nayda spirt qança kötariladi? $\sigma = 0{,}022$ N/m, $\rho = 790$ kg/m³.

<SimExample :values='{"liq":1,"r":0.5,"g":9.81}' check="Spirt kapillyarda kötarilib, h = 11,4 mm da töxtadi">

::: details Yeçimni körsatiş

1. Spirt ham şişani töla höllaydi, şuning uçun $h = \dfrac{2\sigma}{\rho g r}$.
2. $h = \dfrac{2 \cdot 0{,}022}{790 \cdot 9{,}81 \cdot 0{,}0005} = 0{,}0114\ \text{m} \approx 11{,}4\ \text{mm}$.
3. Bu suvdagidan $29{,}8 / 11{,}4 \approx 2{,}6$ marta past: spirtning sirt tarangligi suvnikidan ança kiçik.

**Javob.** $h \approx 11{,}4\ \text{mm}$.

:::

</SimExample>

### 3-masala. Simob pasayadi

Simob şişani höllamaydi, çegaraviy burçak $140^\circ$. Radiusi 0,5 mm bölgan nayda simob sathi idişdagidan qança past böladi? $\sigma = 0{,}47$ N/m, $\rho = 13\,600$ kg/m³.

<SimExample :values='{"liq":2,"r":0.5,"g":9.81}' check="Simob kapillyarda pasayib, h = 10,8 mm da töxtadi">

::: details Yeçimni körsatiş

1. $\cos 140^\circ = -0{,}766$.
2. $h = \dfrac{2 \cdot 0{,}47 \cdot (-0{,}766)}{13\,600 \cdot 9{,}81 \cdot 0{,}0005} = -0{,}0108\ \text{m}$.

**Javob.** Taxminan 10,8 mm pastda.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax College Physics 2e, 11-bob](https://openstax.org/books/college-physics-2e/pages/11-8-cohesion-and-adhesion-in-liquids-surface-tension-and-capillary-action). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
