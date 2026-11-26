---
title: "Prujinali mayatnik"
description: "Silliq stol ustidagi yuk prujinaga biriktirilgan. Yukni tortib qöyib yuboring: Guk qonuni böyiça qaytaruvçi kuç garmonik tebraniş hosil qiladi. Davr massa va bikrlikka qanday boğliqligini, amplitudaga esa boğliq emasligini tekşiring."
topic: "Tebranişlar · Prujinali mayatnik"
examples: 3
---

# Prujinali mayatnik

<SimLab id="spring" />

## Asosiy ğoya

Avtomobil ğildiragi çuqurçaga tuşganda kuzov bir neça marta çayqalib, söng tinçlanadi; tarozi pallasiga yuk qöyilganda strelka bir oz tebranib turadi. Bunday tebranişlarning manbai — elastik kuç: deformatsiyalangan prujina özining dastlabki holatiga qaytişga intiladi va qaytaruvçi kuç Guk qonuni böyiça siljişga proporsional: $F = -kx$.

Silliq sirtdagi yukni muvozanatdan $x_0$ ga tortib qöyib yuborsak, u muvozanat nuqtasidan ötib ketadi, qarşi tomonda töxtaydi va orqaga qaytadi. Siljiş vaqt böyiça kosinus böyiça özgaradi — bu *garmonik tebraniş*. Uning davri amplitudaga boğliq emas: yukni ikki baravar uzoqroq tortsangiz, u ikki baravar tezroq harakatlanadi va davr özgarmaydi.

<div class="lesson-photos">

<SimPhoto name="suspension" :width="1200" :height="857" :display-width="350" alt="Eski temir yöl vagoni aravaçasidagi spiral prujinalar" caption="Vagon aravaçasidagi spiral prujinalar vagon massasi bilan birga prujinali mayatnik hosil qiladi; amortizatorlar söniş kuçini beradi, aks holda vagon uzoq çayqalib turardi." credit="Surat: Agnes Monkelbaan, &lt;a href=&quot;https://creativecommons.org/licenses/by-sa/4.0&quot;&gt;CC BY-SA 4.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Harlingen._Spiraalveren_oude_treinwagon_12-07-2021._(actm.).jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

<SimPhoto name="bungee" :width="1200" :height="798" :display-width="350" alt="Köprikdan elastik arqonda sakragan bandji-sakrovçi dara ustida" caption="Bandji arqoni — ulkan prujina: sakrovçi eng past nuqtadan keyin bir neça marta yuqoriga-pastga tebranadi, har safar amplituda kamayib boradi." credit="Surat: Lyngenfjord Bungee, &lt;a href=&quot;https://creativecommons.org/licenses/by-sa/4.0&quot;&gt;CC BY-SA 4.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Bungee_Jumping_from_Gorsabrua_(Gorsa_Bridge).JPG&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Yukka faqat prujinaning elastiklik kuçi $F = -kx$ taʼsir qiladi (oğirlik kuçi va sirtning reaksiya kuçi bir-birini muvozanatlaydi). Nyutonning ikkinçi qonunidan $ma = -kx$: tezlaniş siljişga proporsional va unga qarama-qarşi yönalgan — bu garmonik tebranişning belgisi.

<div class="eq-block">

<span class="eq-label">Guk qonuni</span><span class="eq-body">$\displaystyle F = -kx$</span>

<span class="eq-label">Davr va siklik çastota</span><span class="eq-body">$\displaystyle T = 2\pi\sqrt{\frac{m}{k}}, \qquad \omega = \sqrt{\frac{k}{m}}$</span>

<span class="eq-label">Tebraniş qonuni</span><span class="eq-body">$\displaystyle x = A\cos(\omega t + \varphi_0), \qquad \upsilon_\text{max} = A\omega, \qquad a_\text{max} = A\omega^2$</span>

<span class="eq-label">Töliq energiya</span><span class="eq-body">$\displaystyle E = \frac{kx^2}{2} + \frac{m\upsilon^2}{2} = \frac{kA^2}{2}$</span>

</div>

Tebraniş davomida energiya potensial va kinetik şakllar orasida qayta-qayta aylanadi: çetki nuqtalarda prujina eng köp deformatsiyalangan va yuk bir lahza töxtaydi, muvozanat nuqtasida prujina erkin, tezlik esa eng katta. Grafikda $x$ va $\upsilon$ çiziqlari çorak davrga siljigan: biri nolga teng bölganda ikkinçisi eng katta.

Qarşilik kuçi $-b\upsilon$ yoqilganda har bir tebranişda energiyaning bir qismi yöqoladi va amplituda eksponensial kamayadi. Qarşilik kiçik bölsa, davr deyarli özgarmaydi; kuçli qarşilikda u uzayadi:

<div class="eq-block">

<span class="eq-label">Qarşilik bilan</span><span class="eq-body">$\displaystyle ma = -kx - b\upsilon, \qquad T = \frac{2\pi}{\sqrt{k/m - (b/2m)^2}}$</span>

</div>

$b \ge 2\sqrt{km}$ bölganda yuk umuman tebranmaydi — u sekin muvozanat holatiga qaytadi. Davr tebranişning özidan — yuk bir çetki nuqtadan çiqib, öşa tomondagi çetki nuqtaga qaytib kelgunça ötgan vaqtdan — ölçanadi.

Prujina çeksiz siqila yoki çözila olmaydi: simulyatsiyada yuk muvozanatdan 0,70 m dan uzoqqa ketsa, harakat töxtatiladi.

<div class="lesson-note">

Qarşilik koeffitsiyenti <span class="param-tag live">darhol</span> belgili. Massa, bikrlik, boşlanğiç siljiş va tezlik harakatni boşidan boşlaydi.

</div>

## Sinab köring

1. Massani 4 baravar oşiring (0,5 → 2 kg). Davr neça baravar ortadi? Bikrlikni 4 baravar oşirsangiz-çi?
2. Boşlanğiç siljişni 0,1 dan 0,5 m ga özgartiring. Davr özgaradimi? Eng katta tezlik-çi?
3. Yukni muvozanatda qoldirib (x₀ = 0) boşlanğiç tezlik bering. Amplituda tezlikka qanday boğliq?
4. Qarşilik koeffitsiyentini 0,5 kg/s ga qöying va tebraniş neça davrdan keyin sezilmas bölib qolişini sanang. Qarşilik davrni özgartiradimi?

## Masalalar

### 1-masala. Tebraniş davri va çastotasi

Bikrligi 20 N/m bölgan prujinaga massasi 0,50 kg bölgan yuk biriktirilgan. Yuk silliq gorizontal sirtda tebranmoqda. Tebraniş davrini va çastotasini toping.

<SimExample :values='{"m":0.5,"k":20,"x0":0.2,"v0":0,"b":0}' check="Ölçangan davr T = 0,99 s. Siljişni 0,05 m yoki 0,5 m qiling: davr özgarmaydi.">

::: details Yeçimni körsatiş

1. $T = 2\pi\sqrt{\dfrac{m}{k}} = 2 \cdot 3{,}14 \cdot \sqrt{\dfrac{0{,}50}{20}} = 0{,}993\ \text{s}$.
2. $\nu = \dfrac{1}{T} = 1{,}01\ \text{Hz}$.

**Javob.** $T \approx 0{,}99\ \text{s}$, $\nu \approx 1{,}0\ \text{Hz}$.

:::

</SimExample>

### 2-masala. Eng katta tezlik va tezlaniş

Massasi 2,0 kg bölgan yuk bikrligi 200 N/m bölgan prujinaga biriktirilgan va muvozanatdan 10 sm ga tortib qöyib yuborilgan. Yukning eng katta tezligini, eng katta tezlanişini va elastiklik kuçining eng katta qiymatini toping.

<SimExample :values='{"m":2,"k":200,"x0":0.1,"v0":0,"b":0}' check="Tezlik grafigining çöqqilari ±1,00 m/s, elastiklik kuçi körsatkiçi ±20,00 N orasida özgaradi; davr 0,63 s.">

::: details Yeçimni körsatiş

1. Siklik çastota $\omega = \sqrt{\dfrac{k}{m}} = \sqrt{\dfrac{200}{2{,}0}} = 10\ \text{rad/s}$.
2. Garmonik tebranişda $\upsilon_\text{max} = A\omega = 0{,}10 \cdot 10 = 1{,}0\ \text{m/s}$ (muvozanat nuqtasida), $a_\text{max} = A\omega^2 = 0{,}10 \cdot 100 = 10\ \text{m/s}^2$ (çetki nuqtalarda).
3. $F_\text{max} = kA = 200 \cdot 0{,}10 = 20\ \text{N}$. Tekşiriş: $F_\text{max} = ma_\text{max} = 2{,}0 \cdot 10 = 20\ \text{N}$.

**Javob.** $\upsilon_\text{max} = 1{,}0\ \text{m/s}$, $a_\text{max} = 10\ \text{m/s}^2$, $F_\text{max} = 20\ \text{N}$.

:::

</SimExample>

### 3-masala. Tebraniş energiyasi

Bikrligi 20 N/m bölgan prujinadagi massasi 0,50 kg bölgan yukka muvozanat holatida 1,0 m/s tezlik berildi. Tebraniş amplitudasini va töliq energiyasini toping.

<SimExample :values='{"m":0.5,"k":20,"x0":0,"v0":1,"b":0}' check="Töliq energiya 0,25 J da özgarmaydi; siljiş ±0,158 m orasida tebranadi (A çiziqlari).">

::: details Yeçimni körsatiş

1. Muvozanat nuqtasida butun energiya kinetik: $E = \dfrac{m\upsilon_0^2}{2} = \dfrac{0{,}50 \cdot 1{,}0^2}{2} = 0{,}25\ \text{J}$.
2. Çetki nuqtada butun energiya potensial: $E = \dfrac{kA^2}{2}$, demak $A = \sqrt{\dfrac{2E}{k}} = \sqrt{\dfrac{0{,}50}{20}} = 0{,}158\ \text{m}$.
3. Boşqaça: $A = \dfrac{\upsilon_0}{\omega} = \dfrac{1{,}0}{\sqrt{20/0{,}50}} = \dfrac{1{,}0}{6{,}32} = 0{,}158\ \text{m}$.

**Javob.** $A \approx 0{,}16\ \text{m}$, $E = 0{,}25\ \text{J}$.

:::

</SimExample>

## Manbalar

Bu mavzu maktab fizika darsligining “Mexanik tebranişlar” bölimida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 15-bob](https://openstax.org/books/university-physics-volume-1/pages/15-1-simple-harmonic-motion). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
