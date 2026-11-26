---
title: "Burilişdagi avtomobil"
description: "Avtomobilni burilişda aylana böylab ğildiraklar va yöl orasidagi işqalaniş kuçi olib boradi. Tezlikni, buriliş radiusini va yöl holatini özgartiring: kerakli kuç işqalanişdan katta bölsa, avtomobil yöldan çiqib ketadi."
topic: "Dinamika · Aylana böylab harakat dinamikasi"
examples: 3
---

# Burilişdagi avtomobil

<SimLab id="curve" />

## Asosiy ğoya

Yöldagi “Xavfli buriliş” belgisi va tezlik çeklovi bejiz qöyilmaydi. Avtomobilni aylana böylab harakatlantiriş uçun unga buriliş markaziga yönalgan kuç taʼsir etişi kerak; tekis yölda bu kuç — ğildiraklar va yöl orasidagi işqalaniş kuçi.

Işqalaniş kuçi çeksiz emas: u $\mu m g$ dan oşmaydi. Höl yölda va ayniqsa muzda $\mu$ kiçik, şuning uçun xavfsiz tezlik ham keskin kamayadi. Kerakli kuç bu qiymatdan katta bölsa, avtomobil töğriroq yöl böylab harakatlanadi va buriliş taşqarisiga sirpanib ketadi.

<div class="lesson-photos">

<SimPhoto name="race-corner" :width="1200" :height="797" alt="Poyga trassasining burilişida ketma-ket harakatlanayotgan avtomobillar" caption="Burilişda avtomobilni aylana böylab yuritadigan kuç — ğildiraklarning yöl bilan işqalaniş kuçi. Tezlik qança katta bölsa, kerakli kuç şunça katta, şuning uçun haydovçilar burilişdan oldin tezlikni kamaytiradi." credit="Surat: Morio, &lt;a href=&quot;https://creativecommons.org/licenses/by-sa/3.0/&quot;&gt;CC BY-SA 3.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Safety_Car_2008_Super_GT.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Aylana böylab harakatlanayotgan jismga markazga yönalgan kuç taʼsir etişi kerak. Gorizontal burilişda bu kuçni faqat ğildiraklar va yöl orasidagi tinçlikdagi işqalaniş kuçi beradi.

<div class="eq-block">

<span class="eq-label">Kerakli markazga intilma kuç</span><span class="eq-body">$\displaystyle F = \frac{m\upsilon^2}{R}$</span>

<span class="eq-label">Şart</span><span class="eq-body">$\displaystyle \frac{m\upsilon^2}{R} \le \mu m g$</span>

<span class="eq-label">Eng katta xavfsiz tezlik</span><span class="eq-body">$\displaystyle \upsilon_\text{max} = \sqrt{\mu g R}$</span>

</div>

Massa qisqarib ketadi: yengil va oğir avtomobil uçun xavfsiz tezlik bir xil. U faqat yöl holatiga ($\mu$) va buriliş radiusiga boğliq. Tezlik ikki marta oşsa, kerakli kuç tört marta ortadi.

## Sinab köring

1. Massani 800 kg dan 2500 kg gaça özgartiring. Xavfsiz tezlik özgaradimi? Nima uçun?
2. Tezlikni ikki marta oşiring. Kerakli kuç neça marta ortadi?
3. Muz holatida burilişdan xavfsiz ötiş uçun radius qança bölişi kerak?

## Masalalar

### 1-masala. Quruq asfaltdagi buriliş

Massasi 1200 kg bölgan avtomobil radiusi 50 m bölgan gorizontal burilişga 15 m/s tezlik bilan kirdi, $\mu = 0{,}60$. Kerakli markazga intilma kuçni va xavfsiz tezlikni toping. Avtomobil burilişdan ötadimi?

<SimExample :values='{"v":15,"R":50,"mu":0.6,"m":1200,"g":9.81}' check="Avtomobil burilişdan xavfsiz ötdi: kerakli markazga intilma kuç 5400 N, işqalaniş kuçining eng katta qiymati 7063 N.">

::: details Yeçimni körsatiş

1. $F = \dfrac{m\upsilon^2}{R} = \dfrac{1200 \cdot 15^2}{50} = 5400\ \text{N}$.
2. $\mu m g = 0{,}60 \cdot 1200 \cdot 9{,}81 = 7063\ \text{N}$ — bu kerakli kuçdan katta.
3. $\upsilon_\text{max} = \sqrt{0{,}60 \cdot 9{,}81 \cdot 50} = 17{,}2\ \text{m/s} \approx 62\ \text{km/soat}$.

**Javob.** $F = 5400\ \text{N}$, $\upsilon_\text{max} = 17{,}2\ \text{m/s}$; avtomobil burilişdan ötadi.

:::

</SimExample>

### 2-masala. Xuddi şu buriliş muzda

Xuddi şu burilişda yöl muzlagan, $\mu = 0{,}10$. Avtomobil yana 15 m/s tezlik bilan kirsa nima böladi? Muzda xavfsiz tezlik qança?

<SimExample :values='{"v":15,"R":50,"mu":0.1,"m":1200,"g":9.81}' check="Avtomobil yöldan çiqib ketdi: burilişda 5400 N markazga intilma kuç kerak edi, işqalaniş esa köpi bilan 1177 N bera oladi. Bu burilişda xavfsiz tezlik 7,0 m/s (25 km/soat) dan oşmasligi kerak.">

::: details Yeçimni körsatiş

1. $\mu m g = 0{,}10 \cdot 1200 \cdot 9{,}81 = 1177\ \text{N}$ — kerakli $5400\ \text{N}$ dan ança kiçik.
2. $\upsilon_\text{max} = \sqrt{0{,}10 \cdot 9{,}81 \cdot 50} = 7{,}0\ \text{m/s} \approx 25\ \text{km/soat}$.

**Javob.** Avtomobil yöldan çiqib ketadi; muzda xavfsiz tezlik $7{,}0\ \text{m/s}$.

:::

</SimExample>

### 3-masala. Tezlik çeklovini tanlaş

Radiusi 80 m bölgan burilişda $\mu = 0{,}50$. Bu yerga qanday tezlik çeklovini qöyiş kerak? Avtomobil 20 m/s (72 km/soat) tezlik bilan kirsa nima böladi?

<SimExample :values='{"v":20,"R":80,"mu":0.5,"m":1200,"g":9.81}' check="Avtomobil burilişda 1,5 m taşqariga surildi, lekin yöldan çiqmadi: kerakli kuç 6000 N işqalanişning eng katta qiymatidan (5886 N) bir oz katta edi. Endi tezlikni 22 m/s qilib köring.">

::: details Yeçimni körsatiş

1. $\upsilon_\text{max} = \sqrt{0{,}50 \cdot 9{,}81 \cdot 80} = 19{,}8\ \text{m/s} \approx 71\ \text{km/soat}$.
2. 20 m/s bu qiymatdan oz bölsa ham katta: işqalaniş yetmaydi va avtomobil buriliş taşqarisiga surila boşlaydi. Tezlik bundan ham katta bölsa, u yöldan çiqib ketadi.
3. Çeklov zahira bilan, masalan 60 km/soat qilib qöyiladi.

**Javob.** $\upsilon_\text{max} \approx 19{,}8\ \text{m/s}$ (71 km/soat); 20 m/s da avtomobil taşqariga suriladi.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 6-bob](https://openstax.org/books/university-physics-volume-1/pages/6-3-centripetal-force). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
