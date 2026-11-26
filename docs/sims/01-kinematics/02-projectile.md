---
title: "Gorizontga burçak ostida otilgan jism harakati"
description: "Jismni istalgan tezlik bilan, istalgan burçak ostida va istalgan balandlikdan oting. Otişlarni soliştiring, Oy va Marsda sinab köring, havoning qarşiligini qöşib, jism darslikdagi parabola böyiça uçgandagiga qaraganda qançalik yaqinroqqa tuşişini köring."
topic: "Kinematika · Tekislikdagi harakat"
examples: 3
---

# Gorizontga burçak ostida otilgan jism harakati

<SimLab id="projectile" />

## Asosiy ğoya

Otilgan koptok, tepilgan futbol töpi, favvoradan otilib çiqqan suv: ularning har biri otilgandan keyin faqat oğirlik kuçi taʼsirida harakatlanadi va bir xil egri çiziq — parabola çizadi. Bu harakatni tuşunişning kaliti — uni ikki harakatga ajratiş. Gorizontal yönalişda jismga heç qanday kuç taʼsir etmaydi, şuning uçun u gorizontal böyiça tekis harakatlanadi. Vertikal yönalişda esa jism xuddi tik yuqoriga otilgan jism kabi $g$ tezlaniş bilan harakatlanadi: sekinlaşadi, bir lahza töxtaydi va qaytib pastga tuşadi.

Bu ikki harakat bir vaqtda sodir böladi va ularni faqat vaqt boğlab turadi. Stroboskopik surat buni yaqqol körsatadi: koptokning tasvirlari gorizontal böyiça bir xil oraliqlarda joylaşgan, lekin har bir eng yuqori nuqta yaqinida ziçlaşadi — u yerda tezlikning vertikal proyeksiyasi nolga teng böladi.

<div class="lesson-photos">

<SimPhoto name="bouncing-ball" :width="1000" :height="644" :display-width="350" alt="Qora fonda ikki yoy çizib sakrayotgan basketbol töpining stroboskopik surati" caption="Sakrayotgan basketbol töpi sekundiga 25 marta yoritilgan. Yerga ikki uriliş orasidagi har bir yoy — parabola. Tasvirlar eng yuqori nuqta yaqinida ziçlaşadi: u yerda tezlikning vertikal proyeksiyasi nolga teng." credit="Surat: MichaelMaggs, Richard Bartz tahriri, “Bouncing ball strobe edit”, &lt;a href=&quot;https://creativecommons.org/licenses/by-sa/3.0&quot;&gt;CC BY-SA 3.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Bouncing_ball_strobe_edit.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

<SimPhoto name="fountain" :width="1000" :height="666" :display-width="350" alt="Venadagi Belveder boğida yoy böylab havzaga tuşayotgan favvora oqimlari" caption="Favvora oqimidagi har bir tomçi gorizontga burçak ostida otilgan jism kabi harakatlanadi, şuning uçun suv oqimi parabola şaklida egiladi." credit="Surat: Zátonyi Sándor (ifj.), Fizped, “Belvedere szokokut 3”, &lt;a href=&quot;https://creativecommons.org/licenses/by-sa/3.0&quot;&gt;CC BY-SA 3.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Belvedere_szokokut_3.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Jism otilgandan keyin unga faqat oğirlik kuçi taʼsir etadi (havoning qarşiligi qöşilmagunça). Gorizontal va vertikal harakatlar bir-biridan mustaqil sodir böladi, ularni faqat vaqt boğlab turadi: $\upsilon_x$ özgarmaydi, $\upsilon_y$ esa har sekundda $g$ ga kamayadi.

<div class="eq-block">

<span class="eq-body">$\displaystyle x(t) = \upsilon_0 \cos\alpha \; t$</span>

<span class="eq-body">$\displaystyle y(t) = h_0 + \upsilon_0 \sin\alpha \; t - \frac{1}{2}\,g\,t^2$</span>

<span class="eq-label">Kötarilişning eng katta balandligi</span><span class="eq-body">$\displaystyle h_\text{max} = h_0 + \frac{(\upsilon_0 \sin\alpha)^2}{2g}$</span>

<span class="eq-label">Gorizontal sirtda uçiş uzoqligi</span><span class="eq-body">$\displaystyle L = \frac{\upsilon_0^2 \sin 2\alpha}{g}$</span>

</div>

Eng yuqori nuqtada $\upsilon_y = 0$, lekin jism gorizontal böyiça $\upsilon_x$ tezlik bilan harakatini davom ettiradi. Gorizontal sirtda uçiş uzoqligi $\sin 2\alpha$ ga boğliq, şuning uçun u $45^\circ$ da eng katta böladi. Yiğindisi $90^\circ$ ga teng burçaklar (masalan, $30^\circ$ va $60^\circ$) ostida otilgan jismlar esa bir joyga tuşadi.

Havoning qarşiligi hisobga olinsa, jismga harakatiga qarama-qarşi yönalgan qöşimça kuç taʼsir etadi. U beradigan tezlaniş $\vec a_\text{q} = -k\,\lvert\vec\upsilon\rvert\,\vec\upsilon$. Bu holda sodda formula yöq, şuning uçun simulyatsiya harakatni kiçik vaqt oraliqlarida, sekundiga 240 qadamda hisoblaydi.

<div class="lesson-note">

Erkin tuşiş tezlanişi va havoning qarşiligi <span class="param-tag live">darhol</span> belgili: ularni jism uçayotgan paytda özgartiriş mumkin. Boşlanğiç tezlik, otiş burçagi yoki balandlik özgartirilsa, otiş boşidan boşlanadi.

</div>

## Sinab köring

1. 30° va 60° burçakli tayyor holatlarni birin-ketin tanlang. Nima uçun jism ikkala holda ham bir joyga tuşadi?
2. “Tezlik proyeksiyalari” bandini yoqing. Qaysi strelka butun uçiş davomida uzunligini özgartirmaydi?
3. Jismni 45° burçak ostida oting, söng havoning qarşiligini qöşing. Endi ham eng katta uçiş uzoqligi 45° da böladimi? 35° va 40° burçaklarni ham sinab köring.
4. “Jarlikdan gorizontal otiş” holatida tuşiş vaqtini xuddi şu balandlikdan boşlanğiç tezliksiz ($\upsilon_0 = 0$) taşlab yuborilgan jismning tuşiş vaqti bilan soliştiring.

## Masalalar

### 1-masala. Tekis maydonda tepilgan töp

Futbol töpi yerdan gorizontga $30^\circ$ burçak ostida $20{,}0\ \text{m/s}$ tezlik bilan tepildi. Töpning uçiş vaqtini, kötarilişning eng katta balandligini va uçiş uzoqligini toping. Havoning qarşiligini hisobga olmang.

<SimExample :values='{"v0":20,"angle":30,"h0":0,"g":9.81,"k":0}' check="Jism 2,04 s dan keyin 35,31 m uzoqlikka tuşadi, eng katta balandlik 5,10 m. Endi burçakni 60° qilib köring: uçiş uzoqligi öşanday, lekin töp balandroq kötariladi va havoda köproq vaqt uçadi.">

::: details Yeçimni körsatiş

1. Boşlanğiç tezlikni proyeksiyalarga ajratamiz: $\upsilon_{0x} = 20{,}0\cos 30^\circ = 17{,}32\ \text{m/s}$ va $\upsilon_{0y} = 20{,}0\sin 30^\circ = 10{,}0\ \text{m/s}$.
2. Töp yana $y = 0$ bölganda yerga tuşadi: $t = \dfrac{2\upsilon_{0y}}{g} = \dfrac{2(10{,}0)}{9{,}81} = 2{,}04\ \text{s}$.
3. Kötarilişning eng katta balandligi: $h_\text{max} = \dfrac{\upsilon_{0y}^2}{2g} = \dfrac{10{,}0^2}{2(9{,}81)} = 5{,}10\ \text{m}$.
4. Uçiş uzoqligi: $L = \upsilon_{0x}\,t = (17{,}32)(2{,}039) = 35{,}3\ \text{m}$. Xuddi şu natijani $L = \dfrac{\upsilon_0^2 \sin 2\alpha}{g}$ formula ham beradi.

**Javob.** Uçiş vaqti $2{,}04\ \text{s}$, kötarilişning eng katta balandligi $5{,}10\ \text{m}$, uçiş uzoqligi $35{,}3\ \text{m}$.

:::

</SimExample>

### 2-masala. Jarlikdan gorizontal otilgan toş

Balandligi 45,0 m bölgan jarlik tepasidan toş gorizontal yönalişda $12{,}0\ \text{m/s}$ tezlik bilan otildi. Toş qança vaqt tuşadi, jarlik etagidan qança uzoqlikka borib tuşadi va yerga tuşiş paytida tezligi qança böladi?

<SimExample :values='{"v0":12,"angle":0,"h0":45,"g":9.81,"k":0}' check="Jism 3,03 s dan keyin 36,35 m uzoqlikka tuşadi; “Tezlik moduli” körsatkiçi 32,05 m/s da töxtaydi. Tuşiş vaqti 45 m balandlikdan boşlanğiç tezliksiz taşlab yuborilgan toşning tuşiş vaqti bilan bir xil.">

::: details Yeçimni körsatiş

1. Boşlanğiç tezlikning vertikal proyeksiyasi nolga teng, şuning uçun vertikal böyiça toş erkin tuşadi: $t = \sqrt{\dfrac{2h_0}{g}} = \sqrt{\dfrac{2(45{,}0)}{9{,}81}} = 3{,}03\ \text{s}$.
2. Gorizontal böyiça toş $12{,}0\ \text{m/s}$ tezlik bilan tekis harakatlanadi: $L = \upsilon_0\,t = (12{,}0)(3{,}029) = 36{,}3\ \text{m}$.
3. Yerga tuşiş paytida $\upsilon_y = -g\,t = -29{,}7\ \text{m/s}$, demak $\upsilon = \sqrt{12{,}0^2 + 29{,}7^2} = 32{,}0\ \text{m/s}$. Bu tezlik gorizontga $\operatorname{arctg}\dfrac{29{,}7}{12{,}0} = 68^\circ$ burçak ostida pastga yönalgan.

**Javob.** Toş $3{,}03\ \text{s}$ davomida tuşadi va jarlik etagidan $36{,}3\ \text{m}$ uzoqlikka $32{,}0\ \text{m/s}$ tezlik bilan tuşadi.

:::

</SimExample>

### 3-masala. Balkondan otilgan koptok

Yerdan 25,0 m balandlikdagi balkondan koptok gorizontga $35^\circ$ burçak ostida yuqoriga $18{,}0\ \text{m/s}$ tezlik bilan otildi. Koptok yerdan qanday eng katta balandlikka kötariladi, qança vaqt uçadi va qança uzoqlikka borib tuşadi?

<SimExample :values='{"v0":18,"angle":35,"h0":25,"g":9.81,"k":0}' check="Jism 3,54 s dan keyin 52,25 m uzoqlikka tuşadi, eng katta balandlik 30,43 m.">

::: details Yeçimni körsatiş

1. $\upsilon_{0x} = 18{,}0\cos 35^\circ = 14{,}74\ \text{m/s}$ va $\upsilon_{0y} = 18{,}0\sin 35^\circ = 10{,}32\ \text{m/s}$.
2. Kötarilişning eng katta balandligi: $h_\text{max} = h_0 + \dfrac{\upsilon_{0y}^2}{2g} = 25{,}0 + \dfrac{10{,}32^2}{2(9{,}81)} = 30{,}4\ \text{m}$.
3. Yerga tuşiş paytida $y = 0$: $0 = 25{,}0 + 10{,}32\,t - 4{,}905\,t^2$, demak $t = \dfrac{10{,}32 + \sqrt{10{,}32^2 + 4(4{,}905)(25{,}0)}}{2(4{,}905)} = 3{,}54\ \text{s}$.
4. Uçiş uzoqligi: $L = \upsilon_{0x}\,t = (14{,}74)(3{,}543) = 52{,}2\ \text{m}$.

**Javob.** Kötarilişning eng katta balandligi $30{,}4\ \text{m}$, uçiş vaqti $3{,}54\ \text{s}$, uçiş uzoqligi $52{,}2\ \text{m}$.

:::

</SimExample>

## Manbalar

Bu mavzu maktab fizika darsligining mexanika bölimida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 4-bob](https://openstax.org/books/university-physics-volume-1/pages/4-3-projectile-motion). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
