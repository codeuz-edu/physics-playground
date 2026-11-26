---
title: "Matematik mayatnik"
description: "Ipga osilgan şarçani burçakka oğdirib qöyib yuboring. Tebraniş davri ip uzunligiga va g ga boğliq, massaga esa boğliq emasligini tekşiring; katta burçaklarda davr kiçik burçaklar formulasidan qançaga farq qilişini köring."
topic: "Tebranişlar · Matematik mayatnik"
examples: 3
---

# Matematik mayatnik

<SimLab id="pendulum" />

## Asosiy ğoya

Ipga osilgan toş, soat mayatnigi, arğimçoqdagi bola — bularning hammasi bir xil qonun böyiça tebranadi. Galiley yoşligida Piza soborida çayqalayotgan qandilni kuzatib, uning tebraniş davri çayqaliş kattaligiga boğliq emasligini payqagan, deyişadi. Bu kuzatuv keyinçalik birinçi aniq soatlarga asos böldi.

Uzunligi $l$ bölgan vaznsiz ipga osilgan kiçik şarça *matematik mayatnik* deyiladi. Uni muvozanat holatidan oğdirsak, oğirlik kuçining ipga tik taşkil etuvçisi $mg\sin\alpha$ uni orqaga qaytaradi. Kiçik burçaklarda $\sin\alpha \approx \alpha$ va tebraniş garmonik böladi: davri faqat ip uzunligi va $g$ ga boğliq. Şarçaning massasi davrga taʼsir qilmaydi — oğir va yengil şarçalar bir xil tebranadi, xuddi erkin tuşişdagi kabi.

<div class="lesson-photos">

<SimPhoto name="pendulum-clock" :width="900" :height="1231" :display-width="380" class="tall" alt="XVIII asr oxiridagi zarhal devor soati, pastida mayatnigi bilan" caption="Mayatnikli soat: mayatnikning har bir tebranişi soat mexanizmini bir tişga suradi. Davr faqat uzunlikka boğliq bölgani uçun soatni tezlatiş yoki sekinlaştiriş uçun mayatnik uzunligi özgartiriladi." credit="Surat: Christoph Braun, &lt;a href=&quot;https://creativecommons.org/publicdomain/zero/1.0/&quot;&gt;CC0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Pendulum_clock_by_Jacob_Kock,_antique_furniture_photography,_IMG_0931_edit.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

<SimPhoto name="swing" :width="1200" :height="800" :display-width="350" alt="Bolalar maydonçasidagi arğimçoq" caption="Arğimçoq ham mayatnik: uning davri zanjir uzunligi bilan belgilanadi, ötirgan bolaning oğirligi bilan emas." credit="Surat: Brandon Couch, &lt;a href=&quot;https://creativecommons.org/publicdomain/zero/1.0/&quot;&gt;CC0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Swingset_in_playground_(Unsplash).jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Şarçaga oğirlik kuçi $mg$ va ipning taranglik kuçi $T$ taʼsir qiladi. Taranglik kuçi ip böylab yönalgan va şarçani aylana böylab uşlab turadi; oğirlik kuçining aylanaga urinma taşkil etuvçisi $mg\sin\alpha$ esa şarçani muvozanat holatiga qaytaradi.

<div class="eq-block">

<span class="eq-label">Harakat tenglamasi</span><span class="eq-body">$\displaystyle \ddot\alpha = -\frac{g}{l}\sin\alpha - \beta\dot\alpha$</span>

<span class="eq-label">Kiçik burçaklarda ($\sin\alpha \approx \alpha$)</span><span class="eq-body">$\displaystyle T = 2\pi\sqrt{\frac{l}{g}}, \qquad \nu = \frac{1}{T}$</span>

<span class="eq-label">Tebraniş qonuni</span><span class="eq-body">$\displaystyle \alpha = \alpha_0\cos\left(\sqrt{\tfrac{g}{l}}\,t\right)$</span>

<span class="eq-label">Eng past nuqtadagi tezlik</span><span class="eq-body">$\displaystyle \upsilon_\text{max} = \sqrt{2gl(1 - \cos\alpha_0)}$</span>

<span class="eq-label">Tezlanişning taşkil etuvçilari (sönişsiz)</span><span class="eq-body">$\displaystyle a_\tau = g\sin\alpha, \qquad a_n = \frac{\upsilon^2}{l}$</span>

</div>

Katta burçaklarda $\sin\alpha$ burçakning özidan kiçik, qaytaruvçi kuç kutilganidan kuçsizroq va davr uzayadi: $20^\circ$ da taxminan 0,8 % ga, $60^\circ$ da 7 % ga, $90^\circ$ da 18 % ga. Simulyatsiya tenglamani aniq (sonli usulda) yeçadi, şuning uçun grafikdagi α çiziği katta burçaklarda punktir kiçik burçaklar çiziğidan orqada qola boşlaydi; davr esa tebranişning özidan — şarça bir çetki nuqtadan çiqib, öşa tomondagi çetki nuqtaga qaytib kelgunça ötgan vaqtdan — ölçanadi.

Harakat tenglamasidagi $\beta\dot\alpha$ had havoning qarşiligi va öqdagi işqalanişni körsatadi: $\beta$ — söniş koeffitsiyenti. Söniş kiçik bölsa, davr deyarli özgarmaydi; kiçik burçaklarda $T = 2\pi / \sqrt{g/l - \beta^2/4}$, $\beta \ge 2\sqrt{g/l}$ bölganda esa mayatnik umuman tebranmaydi.

<div class="lesson-note">

<span class="param-tag live">darhol</span> belgili $g$ va söniş koeffitsiyentini harakat davomida özgartiriş mumkin. Ip uzunligi, boşlanğiç burçak va massa harakatni boşidan boşlaydi.

</div>

## Sinab köring

1. Ip uzunligini 1 m dan 4 m ga oşiring. Davr neça baravar ortadi? (Javob: 2 baravar, çunki davr uzunlikning kvadrat ildiziga proporsional.)
2. Massani 0,1 kg dan 5 kg ga özgartiring. Davr özgaradimi?
3. Boşlanğiç burçakni 5° dan 90° ga oşirib boring va ölçangan davrni formula bilan taqqoslang. Qaysi burçakdan boşlab farq 1 % dan oşadi?
4. “Kuçlar” ni yoqing va 60° dan qöyib yuboring. Eng past nuqtada ipning tarangligi $mg$ dan qança katta? $T = mg(3 - 2\cos\alpha_0)$ formulasini tekşiring.

## Masalalar

### 1-masala. Mayatnikning davri

Uzunligi 1,00 m bölgan matematik mayatnik kiçik burçakka oğdirilib, qöyib yuborildi. Uning tebraniş davrini va çastotasini toping ($g = 9{,}81\ \text{m/s}^2$).

<SimExample :values='{"L":1,"theta0":5,"g":9.81,"m":1,"b":0}' check="Ölçangan davr T = 2,01 s; formula ham 2,01 s beradi (farq 0,0 %). Massani özgartiring: davr özgarmaydi.">

::: details Yeçimni körsatiş

1. $T = 2\pi\sqrt{\dfrac{l}{g}} = 2 \cdot 3{,}14 \cdot \sqrt{\dfrac{1{,}00}{9{,}81}} = 2{,}01\ \text{s}$.
2. $\nu = \dfrac{1}{T} = 0{,}498\ \text{Hz}$: mayatnik sekundiga yarim tebraniş qiladi.

**Javob.** $T = 2{,}01\ \text{s}$, $\nu \approx 0{,}50\ \text{Hz}$.

:::

</SimExample>

### 2-masala. Sekundli mayatnik

Soat mayatnigining ip uzunligi qança bölganda uning davri aynan 2,00 s böladi ($g = 9{,}81\ \text{m/s}^2$)?

<SimExample :values='{"L":0.99,"theta0":5,"g":9.81,"m":1,"b":0}' check="l = 0,99 m da ölçangan davr T = 2,00 s.">

::: details Yeçimni körsatiş

1. Davr formulasidan uzunlikni ifodalaymiz: $l = \dfrac{gT^2}{4\pi^2}$.
2. $l = \dfrac{9{,}81 \cdot 2{,}00^2}{4 \cdot 9{,}87} = 0{,}994\ \text{m}$.

**Javob.** $l \approx 0{,}99\ \text{m}$.

:::

</SimExample>

### 3-masala. Oydagi mayatnik

Yerda davri 2,01 s bölgan mayatnik (l = 1,00 m) Oyga olib borildi, u yerda $g = 1{,}62\ \text{m/s}^2$. Uning davri qança böladi?

<SimExample :values='{"L":1,"theta0":5,"g":1.62,"m":1,"b":0}' check="Ölçangan davr T = 4,94 s.">

::: details Yeçimni körsatiş

1. $T_\text{Oy} = 2\pi\sqrt{\dfrac{1{,}00}{1{,}62}} = 4{,}94\ \text{s}$.
2. Davrlar nisbati $\dfrac{T_\text{Oy}}{T_\text{Yer}} = \sqrt{\dfrac{g_\text{Yer}}{g_\text{Oy}}} = \sqrt{\dfrac{9{,}81}{1{,}62}} = 2{,}46$: Oyda mayatnik deyarli ikki yarim baravar sekin tebranadi.

**Javob.** $T \approx 4{,}94\ \text{s}$.

:::

</SimExample>

## Manbalar

Bu mavzu maktab fizika darsligining “Mexanik tebranişlar” bölimida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 15-bob](https://openstax.org/books/university-physics-volume-1/pages/15-4-pendulums). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
