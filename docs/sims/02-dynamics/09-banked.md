---
title: "Qiya buriliş"
description: "Tez yöllar va trekdagi burilişlar içkariga qiyalatib quriladi. Qiyalik burçagini va tezlikni özgartiring: ideal tezlikda avtomobilni burilişda işqalanişsiz ham yöl reaksiyasining özi olib boradi."
topic: "Dinamika · Qiya yöldagi buriliş"
examples: 3
---

# Qiya buriliş

<SimLab id="banked" />

## Asosiy ğoya

Velotrek va avtomobil poyga trassalarining burilişlari kuçli qiyalatib quriladi, temir yöl relslarida esa taşqi rels içkisidan biroz baland qöyiladi. Bunday buriliş tekis burilişga qaraganda ança katta tezlikda ham xavfsiz böladi.

Sababi şunda: qiya yölda tayanç kuçi burilişning markaziga qarab “egilgan”. Uning gorizontal taşkil etuvçisi markazga intilma kuçni beradi, işqalaniş esa faqat qöşimça zahira vazifasini bajaradi.

<div class="lesson-photos">

<SimPhoto name="velodrome" :width="1200" :height="900" alt="Velotrekning qiya burilişida poyga qilayotgan velosipedçilar" caption="Velotrek burilişlari kuçli qiyalatib qurilgan: tayanç kuçining gorizontal taşkil etuvçisi velosipedçini burilişning markaziga qarab yönaltiradi, şuning uçun katta tezlikda ham u sirpanib ketmaydi." credit="Surat: Rundvald, &lt;a href=&quot;https://creativecommons.org/licenses/by-sa/4.0&quot;&gt;CC BY-SA 4.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Velodrome-de-Bretagne-piste-Henri-Caresmel-Loudeac-03-byRundvald.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Qiya yölda yöl reaksiyasi $N$ vertikal emas: uning gorizontal taşkil etuvçisi buriliş markaziga yönalgan. Ideal tezlikda markazga intilma kuçni faqat şu taşkil etuvçi beradi va işqalaniş kerak bölmaydi.

<div class="eq-block">

<span class="eq-label">Ideal tezlik</span><span class="eq-body">$\displaystyle N\sin\theta = \frac{m\upsilon_0^2}{R},\quad N\cos\theta = mg \;\Rightarrow\; \upsilon_0 = \sqrt{gR\,\text{tg}\,\theta}$</span>

<span class="eq-label">Eng katta tezlik</span><span class="eq-body">$\displaystyle \upsilon_\text{max} = \sqrt{gR\,\frac{\sin\theta + \mu\cos\theta}{\cos\theta - \mu\sin\theta} }$</span>

<span class="eq-label">Eng kiçik tezlik</span><span class="eq-body">$\displaystyle \upsilon_\text{min} = \sqrt{gR\,\frac{\sin\theta - \mu\cos\theta}{\cos\theta + \mu\sin\theta} }$</span>

</div>

Tezlik ideal tezlikdan katta bölsa, işqalaniş qiyalik böylab pastga (markazga) yönaladi; kiçik bölsa — yuqoriga, avtomobil içkariga sirpanib tuşmasligi uçun.

Simulyatsiyada avtomobil 90° li burilişni özgarmas tezlik bilan ötadi. Kerakli işqalaniş kuçi $\mu N$ dan katta bölsa, avtomobil qiyalik böylab sirpanadi: tez ketayotgani taşqariga (yuqoriga), sekin ketayotgani içkariga (pastga) suriladi. Sirpaniş paytida unga $\mu N$ ga teng işqalaniş kuçi taʼsir etadi.

## Sinab köring

1. θ = 0 qiling: bu tekis buriliş. Eng katta tezlik qanday özgaradi?
2. Muzli yölda (μ = 0,05) qaysi tezliklar xavfsiz?
3. Ideal tezlikda F\_iş strelkasi nega yöqoladi?

## Masalalar

### 1-masala. Ideal tezlik

Radiusi 100 m bölgan buriliş $15^\circ$ qiyalatib qurilgan. Qanday tezlikda avtomobil burilişdan işqalanişsiz ötadi?

<SimExample :values='{"v":16.2,"R":100,"th":15,"mu":0.3,"g":9.81}' check="Ideal tezlik 16,2 m/s: kerakli μ deyarli nol.">

::: details Yeçimni körsatiş

1. Ideal tezlikda işqalaniş kerak emas: $N\sin\theta = \dfrac{m\upsilon_0^2}{R}$ va $N\cos\theta = mg$, bulardan $\upsilon_0 = \sqrt{gR\,\text{tg}\,\theta}$.
2. $\text{tg}\,15^\circ = 0{,}268$, $gR\,\text{tg}\,\theta = 9{,}81 \cdot 100 \cdot 0{,}268 = 262{,}9\ \text{m}^2/\text{s}^2$.
3. $\upsilon_0 = \sqrt{262{,}9} = 16{,}2\ \text{m/s} \approx 58\ \text{km/soat}$.

**Javob.** $\upsilon_0 \approx 16{,}2\ \text{m/s}$.

:::

</SimExample>

### 2-masala. Eng katta tezlik

Xuddi şu burilişda işqalaniş koeffitsiyenti 0,30. Avtomobil eng köpi bilan qanday tezlikda ötişi mumkin?

<SimExample :values='{"v":24,"R":100,"th":15,"mu":0.3,"g":9.81}' check="Ruxsat etilgan tezliklar: 0,0 … 24,6 m/s.">

::: details Yeçimni körsatiş

1. $\upsilon_\text{max} = \sqrt{981 \cdot \dfrac{0{,}259 + 0{,}290}{0{,}966 - 0{,}078} } = \sqrt{606} = 24{,}6\ \text{m/s}$.
2. Tekis burilişda bu $\sqrt{\mu g R} = 17{,}2\ \text{m/s}$ bölar edi.

**Javob.** $\upsilon_\text{max} \approx 24{,}6\ \text{m/s} \approx 89\ \text{km/soat}$.

:::

</SimExample>

### 3-masala. Sekin ketayotgan avtomobil

Avtomobil şu burilişdan 10 m/s tezlik bilan ötmoqda. Işqalaniş kuçi qayerga yönalgan va qanday eng kiçik $\mu$ kerak?

<SimExample :values='{"v":10,"R":100,"th":15,"mu":0.3,"g":9.81}' check="Avtomobil burilişdan ötdi: işqalaniş kuçi qiyalik böylab yuqoriga yönalgan, kerakli μ = 0,16 ≤ 0,30.">

::: details Yeçimni körsatiş

1. $\dfrac{\upsilon^2}{R} = 1{,}0\ \text{m/s}^2$. Qiyalik böylab: $f = g\sin\theta - \dfrac{\upsilon^2}{R}\cos\theta = 2{,}54 - 0{,}97 = 1{,}57\ \text{N/kg}$, yuqoriga.
2. $N = g\cos\theta + \dfrac{\upsilon^2}{R}\sin\theta = 9{,}73\ \text{N/kg}$, $\mu \ge \dfrac{1{,}57}{9{,}73} = 0{,}16$.

**Javob.** Yuqoriga; $\mu \ge 0{,}16$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 6-bob](https://openstax.org/books/university-physics-volume-1/pages/6-3-centripetal-force). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
