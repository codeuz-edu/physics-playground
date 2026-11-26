---
title: "Yoruğlikning qutblanişi"
description: "Tabiiy yoruğlik qutblagiçdan ötib, bir tekislikda tebranadigan bölib qoladi. Analizatorni burang: ötgan yoruğlik intensivligi cos²φ qonuni böyiça kamayadi. Uç qutblagiç tajribasida örtadagi plyonka yoruğlikni qaytadan ötkaza boşlaydi."
topic: "Tölqin optikasi · Malyus qonuni"
examples: 3
---

# Yoruğlikning qutblanişi

<SimLab id="polarization" />

## Asosiy ğoya

Qutblovçi quyoş közoynaklari suv va yöl sirtidan qaytgan yaltiroq nurni söndiradi, çunki qaytgan yoruğlik qisman qutblangan. Suyuq kristalli ekranlar (LCD) ham qutblagiçlar orasida yoruğlikni boşqarib işlaydi.

## Nazariya

Yoruğlik köndalang tölqin: elektr maydon vektori tarqaliş yönalişiga tik tebranadi. Tabiiy yoruğlikda tebranişlar hamma yönalişda böladi, qutblagiç esa faqat bitta yönalişdagi tebranişlarni ötkazadi va intensivlik ikki marta kamayadi.

<div class="eq-block">

<span class="eq-label">Birinçi qutblagiçdan keyin</span><span class="eq-body">$\displaystyle I_1 = \frac{I_0}{2}$</span>

<span class="eq-label">Malyus qonuni</span><span class="eq-body">$\displaystyle I = I_1\cos^2\varphi$</span>

</div>

Analizator qutblagiçga tik ($90^\circ$) bölsa, yoruğlik ötmaydi. Lekin ular orasiga $45^\circ$ burilgan uçinçi plyonka qöyilsa, yoruğlik yana ötadi: har bir plyonka tebranişning yangi yönalişini tanlab oladi.

## Sinab köring

1. Analizatorni 90° ga burang: qança yoruğlik ötadi?
2. Uç qutblagiç tajribasida qaysi burçakda intensivlik eng katta?
3. Grafik nega töğri çiziq emas?

## Masalalar

### 1-masala. Malyus qonuni

Intensivligi 100 W/m² bölgan tabiiy yoruğlik qutblagiç va unga nisbatan 60° burilgan analizatordan ötdi. Oxirgi intensivlikni toping.

<SimExample :values='{"mode":0,"I0":100,"phi":60}' check="Analizator 60° ga burildi: I = (I₀/2)·cos²φ = 12,5 W/m².">

::: details Yeçimni körsatiş

1. Qutblagiçdan keyin intensivlik ikki marta kamayadi: $I_1 = \dfrac{I_0}{2} = \dfrac{100}{2} = 50\ \text{W/m}^2$.
2. Malyus qonuni: $I = I_1\cos^2\varphi$, $\cos 60^\circ = 0{,}5$, $\cos^2 60^\circ = 0{,}25$.
3. $I = 50 \cdot 0{,}25 = 12{,}5\ \text{W/m}^2$.

**Javob.** $I = 12{,}5\ \text{W/m}^2$.

:::

</SimExample>

### 2-masala. Kiçik burçak

Analizator 30° ga burilgan bölsa, intensivlik qança?

<SimExample :values='{"mode":0,"I0":100,"phi":30}' check="Analizator 30° ga burildi: I = (I₀/2)·cos²φ = 37,5 W/m².">

::: details Yeçimni körsatiş

1. Birinçi qutblagiçdan keyin, avvalgidek, $I_1 = \dfrac{100}{2} = 50\ \text{W/m}^2$.
2. $\cos 30^\circ = 0{,}866$, $\cos^2 30^\circ = 0{,}75$.
3. $I = I_1\cos^2 30^\circ = 50 \cdot 0{,}75 = 37{,}5\ \text{W/m}^2$.

**Javob.** $I = 37{,}5\ \text{W/m}^2$.

:::

</SimExample>

### 3-masala. Uç qutblagiç

Bir-biriga tik ikki qutblagiç orasiga 45° burilgan uçinçisi qöyildi. 100 W/m² li tabiiy yoruğlikdan qança ötadi?

<SimExample :values='{"mode":1,"I0":100,"phi":45}' check="Örtadagi qutblagiç 45° da: I = (I₀/2)·cos²φ·cos²(90° − φ) = 12,5 W/m².">

::: details Yeçimni körsatiş

1. Birinçi qutblagiçdan keyin $I_1 = \dfrac{I_0}{2} = 50\ \text{W/m}^2$.
2. Örtadagi plyonka birinçisiga nisbatan $45^\circ$ burilgan: $I_2 = I_1\cos^2 45^\circ = 50 \cdot 0{,}5 = 25\ \text{W/m}^2$.
3. Oxirgisi örtadagiga nisbatan $90^\circ - 45^\circ = 45^\circ$ burilgan: $I = I_2\cos^2 45^\circ = 25 \cdot 0{,}5 = 12{,}5\ \text{W/m}^2$.

**Javob.** $I = 12{,}5\ \text{W/m}^2$ (örtadagisisiz nol bölar edi).

:::

</SimExample>

## Manbalar

Bu mavzu 11-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 3-jild, 1-bob](https://openstax.org/books/university-physics-volume-3/pages/1-8-polarization). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
