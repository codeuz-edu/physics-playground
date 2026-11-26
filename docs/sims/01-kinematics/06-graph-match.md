---
title: "Harakat grafigini takrorlaş"
description: "Avtomobilni qölda boşqaring: koordinata grafigingiz punktir çiziq bilan çizilgan maqsad grafigi böylab borsin. Bu grafikning qiyaligi tezligingizni bildiradi — uni ham moslang."
topic: "Kinematika · Harakat grafiklari"
examples: 3
---

# Harakat grafigini takrorlaş

<SimLab id="graph-match" />

## Asosiy ğoya

Koordinataning vaqtga boğliqlik grafigi töğri çiziq böylab harakatning töliq yozuvidir: undan jism har bir paytda qayerda bölganini bilib oliş mumkin. Bunday grafiklarni bemalol öqiy oliş mexanikadagi eng foydali könikmalardan biri, uni örganişning eng tez yöli esa grafikni öz harakatingiz bilan çizişdir.

1880-yillarda fransuz olimi Etyen-Jyul Marey harakatlanayotgan odamlarni teng vaqt oraliqlarida suratga olgan. Har bir kadr koordinata grafigidagi bitta nuqtaga mos keladi. Kadrlar orasidagi masofalar teng bölsa, jism teng vaqt oraliqlarida teng yöl bosadi: tezlik özgarmas, grafik esa töğri çiziq böladi.

<div class="lesson-photos">

<SimPhoto name="marey-cyclist" :width="1000" :height="589" alt="Etyen-Jyul Mareyning xronofotografiyasi: baland ğildirakli velosipeddagi odam teng vaqt oraliqlari bilan ketma-ket beş paytda tasvirlangan" caption="Suratga olişlar orasidagi vaqt bir xil, velosipedçi tasvirlari orasidagi masofa ham bir xil: tezlik özgarmas, koordinataning vaqtga boğliqlik grafigi esa töğri çiziq." credit="Surat: Étienne-Jules Marey, “Chronophotograph of a Man on a Bicycle” (taxminan 1885–1890), National Gallery of Art, &lt;a href=&quot;https://creativecommons.org/publicdomain/zero/1.0/&quot;&gt;CC0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:%C3%89tienne_Jules_Marey,_Chronophotograph_of_a_Man_on_a_Bicycle,_c._1885-1890,_NGA_125658.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Koordinataning vaqtga boğliqlik grafigi jism har bir paytda qayerda bölganini körsatadi. Uning qiyaligi tezlikka teng: çiziq qançalik tik bölsa, jism şunçalik tez harakatlanadi; gorizontal çiziq jism tinç turganini, pastga oğgan çiziq esa jism 0 tomon qaytayotganini bildiradi. Tezlik grafigining qiyaligi esa tezlanişga teng.

<div class="eq-block">

<span class="eq-label">Tezlik — koordinata grafigining qiyaligi</span><span class="eq-body">$\displaystyle \upsilon = \frac{\Delta x}{\Delta t}$</span>

<span class="eq-label">Tezlaniş — tezlik grafigining qiyaligi</span><span class="eq-body">$\displaystyle a = \frac{\Delta \upsilon}{\Delta t}$</span>

</div>

Koordinata grafigi töğri çiziq bölsa, tezlik özgarmas. Grafik egri çiziq bölsa, tezlik özgarmoqda: grafik yuqoriga qarab egilsa $a > 0$, pastga qarab egilsa $a < 0$.

“Boşlaş” tugmasini bosing va avtomobilni suring yoki “Avtomobil koordinatasi” parametrini özgartiring: grafikdagi çiziğingiz punktir çiziqli maqsad grafigi böylab borsin. Pastdagi tezlik grafigi ikkala çiziqning qiyaligini körsatadi. Natija — 10 s davomida çiziğingiz bilan maqsad grafigi orasidagi örtaça masofa.

<div class="lesson-note">

Avtomobil koordinatasi <span class="param-tag live">darhol</span> belgili: u harakat davomida avtomobilni boşqaradi. Boşqa maqsad grafigi tanlansa, harakat boşidan boşlanadi.

</div>

## Sinab köring

1. “Tekis uzoqlaşiş” maqsadini tanlang. Koordinata grafigi oğma töğri çiziq bölişi uçun tezlik grafigingiz qanday bölişi kerak?
2. “Joyidan tezlaniş” grafigi yuqoriga qarab egiladi. Töğri çiziq emas, egri çiziq hosil bölişi uçun avtomobilni qanday harakatlantiriş kerak?
3. “Borib-qaytiş” maqsadida orqaga buriliş paytida tezlik grafigingizda nima sodir böladi?
4. Qiynalyapsizmi? Avval “Yöldagi maqsad” yoqilgan holda maşq qiling, söng uni öçirib, yana urinib köring.

## Masalalar

### 1-masala. Borib-qaytiş

“Borib-qaytiş” maqsad grafigida koordinata $t = 1\ \text{s}$ gaça 5 m ga teng, söng töğri çiziq böylab ortib, $t = 5{,}5\ \text{s}$ da 32 m ga yetadi, keyin yana töğri çiziq böylab kamayib, $t = 10\ \text{s}$ da 5 m ga qaytadi. Har bir qismdagi tezlikni, butun harakat davomidagi köçiş va yölni, örtaça tezlik va yöl böyiça örtaça tezlikni toping.

<SimExample :values='{"target":4,"xp":5}' check="Maqsadning punktir tezlik grafigi 0 dan +6 m/s ga, söng −6 m/s ga birdan özgaradi. Avtomobilni unga moslab boşqaring: öngga bir tekis yuring, 32 m da orqaga buriling va xuddi şunday tezlik bilan qayting.">

::: details Yeçimni körsatiş

1. Borişda: $\upsilon_1 = \dfrac{32 - 5}{5{,}5 - 1} = +6{,}0\ \text{m/s}$. Qaytişda: $\upsilon_2 = \dfrac{5 - 32}{10 - 5{,}5} = -6{,}0\ \text{m/s}$.
2. Köçiş: $\Delta x = 5 - 5 = 0$. Yöl: $S = 27 + 27 = 54\ \text{m}$.
3. Örtaça tezlik $\bar\upsilon = \dfrac{0}{10\ \text{s}} = 0$, yöl böyiça örtaça tezlik esa $\dfrac{54\ \text{m}}{10\ \text{s}} = 5{,}4\ \text{m/s}$.

**Javob.** Borişda $+6{,}0\ \text{m/s}$, qaytişda $-6{,}0\ \text{m/s}$; köçiş 0, yöl $54\ \text{m}$; örtaça tezlik 0, yöl böyiça örtaça tezlik $5{,}4\ \text{m/s}$.

:::

</SimExample>

### 2-masala. Joyidan tezlaniş

“Joyidan tezlaniş” maqsad grafigida $t = 1\ \text{s}$ gaça $x = 5\ \text{m}$, söng $x = 5 + 0{,}35\,(t - 1)^2$ ($x$ metrlarda, $t$ sekundlarda). Tezlaniş qança? $t = 5\ \text{s}$ dagi tezlik qança? 3 s dan 7 s gaça bölgan oraliqdagi örtaça tezlik ham şunga teng ekanini körsating.

<SimExample :values='{"target":3,"xp":5}' check="Maqsadning punktir tezlik grafigi — qiyaligi 0,70 m/s² bölgan, kötarilib boruvçi töğri çiziq: t = 5 s da u 2,8 m/s ni körsatadi.">

::: details Yeçimni körsatiş

1. Buni $x = x_0 + \dfrac{1}{2} a\,(t - 1)^2$ bilan soliştiramiz: $\dfrac{1}{2} a = 0{,}35$, demak $a = 0{,}70\ \text{m/s}^2$.
2. $t = 5\ \text{s}$ da $\upsilon = a\,(t - 1) = (0{,}70)(4) = 2{,}8\ \text{m/s}$.
3. $x(3) = 6{,}4\ \text{m}$ va $x(7) = 17{,}6\ \text{m}$, demak $\bar\upsilon = \dfrac{17{,}6 - 6{,}4}{7 - 3} = 2{,}8\ \text{m/s}$. Tezlaniş özgarmas bölsa, biror vaqt oraliğidagi örtaça tezlik şu oraliq örtasidagi paytdagi tezlikka teng.

**Javob.** $a = 0{,}70\ \text{m/s}^2$; 5 s da $\upsilon = 2{,}8\ \text{m/s}$, bu 3 s dan 7 s gaça bölgan oraliqdagi örtaça tezlikka teng.

:::

</SimExample>

### 3-masala. Sekinlaşib töxtaş

“Sekinlaşib töxtaş” maqsadida jism $t = 1\ \text{s}$ da 5 m belgisidan $\upsilon = 6{,}0\ \text{m/s}$ tezlik bilan harakatni boşlaydi va $0{,}75\ \text{m/s}^2$ tezlaniş bilan tekis sekinlanuvçan harakatlanadi. U qaçon va qayerda töxtaydi?

<SimExample :values='{"target":5,"xp":5}' check="Punktir maqsad grafigi t = 9,0 s da 29 m da gorizontal bölib qoladi, maqsadning tezlik grafigi ham aynan şu paytda nolga yetadi.">

::: details Yeçimni körsatiş

1. Jism $\upsilon = 0$ bölganda töxtaydi: $0 = 6{,}0 - 0{,}75\,\Delta t$, demak $\Delta t = 8{,}0\ \text{s}$, yaʼni $t = 9{,}0\ \text{s}$ da.
2. Sekinlaşiş davomida bosib ötilgan yöl: $\dfrac{1}{2}(6{,}0 + 0)(8{,}0) = 24\ \text{m}$, demak jism $5 + 24 = 29\ \text{m}$ da töxtaydi.

**Javob.** Jism $t = 9{,}0\ \text{s}$ da $29\ \text{m}$ da töxtaydi; şu paytdan boşlab uning koordinata grafigi gorizontal çiziqqa aylanadi.

:::

</SimExample>

## Manbalar

Bu mavzu maktab fizika darsligining mexanika bölimida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 3-bob](https://openstax.org/books/university-physics-volume-1/pages/3-2-instantaneous-velocity-and-speed). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
