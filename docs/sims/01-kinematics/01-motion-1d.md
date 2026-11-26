---
title: "Töğri çiziqli harakat"
description: "Avtomobilning boşlanğiç koordinatasi, boşlanğiç tezligi va tezlanişini tanlang, söng koordinata, tezlik va tezlaniş grafiklari bir vaqtda qanday çizilişini kuzating."
topic: "Kinematika · Tekis özgaruvçan harakat"
examples: 3
---

# Töğri çiziqli harakat

<SimLab id="motion-1d" />

## Asosiy ğoya

Eng sodda harakat — töğri çiziq böylab harakat: yöldagi avtomobil, relsdagi poyezd, töğri yölakdagi yuguruvçi. Uni tavsiflaş uçun sanoq boşi va musbat yönalişni tanlaymiz, söng vaqt ötişi bilan $x$ koordinata qanday özgarişini kuzatamiz. Harakatni töliq tavsiflaş uçun yana ikki kattalik kerak: koordinata qançalik tez özgarişini körsatadigan *tezlik* va tezlik qançalik tez özgarişini körsatadigan *tezlaniş*.

Tezlaniş özgarmas bölsa (masalan, haydovçi gaz pedalini yoki tormozni bir xil bosib tursa), harakat *tekis özgaruvçan* böladi va bir neçta formula harakat haqida hamma narsani oldindan aytib beradi. Drag-poyga bunga yorqin misol: avtomobil tinç holatdan joyidan qözğalib, töğri trassa böylab katta va deyarli özgarmas tezlaniş bilan tezlik oladi.

<div class="lesson-photos">

<SimPhoto name="dragster" :width="1000" :height="615" alt="Tomoşabinlar oldida töğri trassa böylab poyga qilayotgan Top Fuel dragster avtomobili" caption="Drag-poyga — katta va deyarli özgarmas tezlaniş bilan töğri çiziqli harakat: avtomobil tinç holatdan boşlab trassa oxirigaça tezligini bir maromda oşirib boradi." credit="Surat: Ozzy Delaney, “Top Fuel Dragster”, &lt;a href=&quot;https://creativecommons.org/licenses/by/2.0&quot;&gt;CC BY 2.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Top_Fuel_Dragster_(8128585279).jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Tezlaniş özgarmas bölganda koordinata va tezlik quyidagi formulalar böyiça özgaradi. Bu sahifadagi har bir grafik ulardan biridir.

<div class="eq-block">

<span class="eq-body">$\displaystyle x(t) = x_0 + \upsilon_0\,t + \frac{1}{2}\,a\,t^2$</span>

<span class="eq-body">$\displaystyle \upsilon(t) = \upsilon_0 + a\,t$</span>

<span class="eq-label">Vaqt qatnaşmagan formula</span><span class="eq-body">$\displaystyle \upsilon^2 = \upsilon_0^2 + 2a\,(x - x_0)$</span>

<span class="eq-label">Örtaça tezlik</span><span class="eq-body">$\displaystyle \bar\upsilon = \frac{\Delta x}{\Delta t}$</span>

</div>

*Koordinata* grafigining qiyaligi tezlikka, *tezlik* grafigining qiyaligi esa tezlanişga teng. $\upsilon$ va $a$ bir tomonga yönalgan bölsa, avtomobil tezlaşadi; qarama-qarşi tomonlarga yönalgan bölsa, sekinlaşadi, töxtaydi va orqaga burilişi mumkin. Manfiy tezlanişning özi hali sekinlaşişni bildirmaydi.

Köçiş $\Delta x = x - x_0$ faqat harakat qayerda boşlanib, qayerda tugaganiga boğliq. Yöl esa bosib ötilgan har bir metrni hisobga oladi, şuning uçun avtomobil orqaga burilsa, yöl köçişdan katta böladi.

<div class="lesson-note">

Tezlaniş <span class="param-tag live">darhol</span> belgili: uni avtomobil harakatlanayotganda özgartiriş mumkin. Boşlanğiç koordinata yoki tezlik özgartirilsa, harakat boşidan boşlanadi.

</div>

## Sinab köring

1. “Tormozlanib, orqaga qaytiş” holatini tanlang. Avtomobil qaysi paytda töxtaydi? Aynan şu paytda tezlik grafigi nolni kesib ötişini tekşiring.
2. $a = 0$ qilib qöying. Endi koordinata grafigi qanday şaklda va nima uçun tezlik grafigi gorizontal çiziqqa aylandi?
3. Yöl ostidagi nuqtalarni kuzating: ular har sekundda bittadan qöyiladi. Nima uçun avtomobil tezlaşgan sari ular orasidagi masofa ortib boradi?
4. Harakat davomida tezlanişni özgartiring va tezlik grafigi aynan şu paytda qanday sinişini kuzating.

## Masalalar

### 1-masala. Tinç holatdan joyidan qözğaliş

Avtomobil $x = 0$ nuqtada tinç holatdan joyidan qözğalib, $2{,}0\ \text{m/s}^2$ tezlaniş bilan harakatlanadi. U 100 m belgisiga qança vaqtda yetadi va u yerda tezligi qança böladi?

<SimExample :values='{"x0":0,"v0":0,"a":2}' check="Harakat t = 10,00 s da 100 m belgisida tugaydi, tezlik 20,00 m/s.">

::: details Yeçimni körsatiş

1. Harakat tinç holatdan boşlangani uçun $x - x_0 = \dfrac{1}{2}\,a\,t^2$, demak $t = \sqrt{\dfrac{2(100\ \text{m})}{2{,}0\ \text{m/s}^2}} = 10{,}0\ \text{s}$.
2. $\upsilon = \upsilon_0 + a\,t = 0 + (2{,}0\ \text{m/s}^2)(10{,}0\ \text{s}) = 20{,}0\ \text{m/s}$.
3. Vaqtni işlatmasdan tekşiramiz: $\upsilon^2 = 2a\,\Delta x = 2(2{,}0)(100) = 400$, demak $\upsilon = 20{,}0\ \text{m/s}$.

**Javob.** Avtomobil 100 m belgisiga $10{,}0\ \text{s}$ da yetadi, tezligi $20{,}0\ \text{m/s}$.

:::

</SimExample>

### 2-masala. Belgidan ötib, tezlikni oşiriş

Avtomobil 10 m belgisidan $8{,}0\ \text{m/s}$ tezlik bilan ötadi va $1{,}2\ \text{m/s}^2$ tezlaniş bilan tezligini oşiradi. a) 5,0 s dan keyin u qayerda böladi va tezligi qança böladi? b) U 100 m belgisiga qaçon yetadi?

<SimExample :values='{"x0":10,"v0":8,"a":1.2}' check="Pauza qiling yoki qadamma-qadam t = 5,00 s gaça yuriting: körsatkiçlarda 65,00 m va 14,00 m/s çiqadi. Harakat t = 7,28 s da 100 m belgisida tugaydi, tezlik 16,73 m/s.">

::: details Yeçimni körsatiş

1. a) $x = x_0 + \upsilon_0 t + \dfrac{1}{2} a t^2 = 10 + (8{,}0)(5{,}0) + \dfrac{1}{2}(1{,}2)(5{,}0)^2 = 65\ \text{m}$.
2. a) $\upsilon = \upsilon_0 + a t = 8{,}0 + (1{,}2)(5{,}0) = 14\ \text{m/s}$.
3. b) $x = 100\ \text{m}$ deb olamiz: $0{,}6\,t^2 + 8{,}0\,t - 90 = 0$.
4. b) Musbat ildizni olamiz: $t = \dfrac{-8{,}0 + \sqrt{8{,}0^2 + 4(0{,}6)(90)}}{2(0{,}6)} = 7{,}28\ \text{s}$, u holda $\upsilon = 8{,}0 + (1{,}2)(7{,}28) = 16{,}7\ \text{m/s}$.

**Javob.** a) $65\ \text{m}$ da, tezligi $14\ \text{m/s}$. b) $7{,}28\ \text{s}$ dan keyin, tezligi $16{,}7\ \text{m/s}$.

:::

</SimExample>

### 3-masala. Orqaga buriliş: köçiş va yöl

$x = 90\ \text{m}$ nuqtadagi avtomobil 0 tomon $15\ \text{m/s}$ tezlik bilan harakatlanmoqda (yaʼni $\upsilon_0 = -15\ \text{m/s}$), tezlanişi esa $+1{,}5\ \text{m/s}^2$. U qayerda va qaçon orqaga buriladi? 100 m belgisiga qaçon yetadi? Avtomobilning köçişi va bosib ötgan yölini toping.

<SimExample :values='{"x0":90,"v0":-15,"a":1.5}' check="Tezlik grafigi t = 10,00 s da nolni kesib ötadi, xuddi şu paytda koordinata grafigi eng past nuqtasiga — 15,00 m ga tuşadi. Harakat t = 20,65 s da 100 m belgisida tugaydi, tezlik 15,97 m/s.">

::: details Yeçimni körsatiş

1. Avtomobil $\upsilon = 0$ bölgan paytda orqaga buriladi: $t = \dfrac{0 - (-15)}{1{,}5} = 10{,}0\ \text{s}$, bunda $x = 90 + (-15)(10) + \dfrac{1}{2}(1{,}5)(10)^2 = 15{,}0\ \text{m}$.
2. 100 m belgisida: $0{,}75\,t^2 - 15\,t - 10 = 0$, demak $t = \dfrac{15 + \sqrt{255}}{1{,}5} = 20{,}65\ \text{s}$ va $\upsilon = -15 + (1{,}5)(20{,}65) = 16{,}0\ \text{m/s}$.
3. Köçiş: $\Delta x = 100 - 90 = +10\ \text{m}$. Yöl: $S = (90 - 15) + (100 - 15) = 160\ \text{m}$.
4. Örtaça tezlik $\bar\upsilon = \dfrac{10\ \text{m}}{20{,}65\ \text{s}} = 0{,}48\ \text{m/s}$, yöl böyiça örtaça tezlik esa $\dfrac{160\ \text{m}}{20{,}65\ \text{s}} = 7{,}75\ \text{m/s}$.

**Javob.** Avtomobil $10{,}0\ \text{s}$ dan keyin $15{,}0\ \text{m}$ da orqaga buriladi va $20{,}65\ \text{s}$ da 100 m belgisiga $16{,}0\ \text{m/s}$ tezlik bilan yetadi. Köçiş $+10\ \text{m}$, yöl $160\ \text{m}$.

:::

</SimExample>

## Manbalar

Bu mavzu maktab fizika darsligining mexanika bölimida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 3-bob](https://openstax.org/books/university-physics-volume-1/pages/3-4-motion-with-constant-acceleration). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
