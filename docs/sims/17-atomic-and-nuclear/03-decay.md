---
title: "Radioaktiv yemiriliş"
description: "Radioaktiv yadrolar tasodifiy paytlarda yemiriladi, lekin har bir yarim yemiriliş davrida ularning yarmi qoladi. Izotopni va kuzatiş vaqtini tanlang: qolgan yadrolar soni eksponensial qonun böyiça kamayadi."
topic: "Yadro fizikasi · Yarim yemiriliş davri"
examples: 3
---

# Radioaktiv yemiriliş

<SimLab id="decay" />

## Asosiy ğoya

1896-yilda Anri Bekkerel uran tuzlari qoronğida ham fotoplastinkani qoraytirişini kaşf etdi. Mariya va Pyer Kyurilar bu hodisani radioaktivlik deb atadilar va yangi radioaktiv elementlar — poloniy va radiyni topdilar.

## Nazariya

Har bir radioaktiv yadroning qaçon yemirilişini oldindan aytib bölmaydi, lekin köp yadrolar uçun qonuniyat aniq: teng vaqt oraliqlarida yadrolarning bir xil ulişi yemiriladi. Yadrolarning yarmi yemiriladigan vaqt yarim yemiriliş davri deyiladi.

<div class="eq-block">

<span class="eq-label">Yemiriliş qonuni</span><span class="eq-body">$\displaystyle N = N_0\cdot 2^{-t/T}$</span>

<span class="eq-label">Aktivlik</span><span class="eq-body">$\displaystyle A = \lambda N,\quad \lambda = \frac{\ln 2}{T}$</span>

</div>

Yod-131 tibbiyotda qalqonsimon bez kasalliklarini davolaşda işlatiladi, kobalt-60 — nurlaş terapiyasida, uglerod-14 esa qadimiy buyumlar yoşini aniqlaşda (radiouglerod usuli).

## Sinab köring

1. Nega panjaradagi sanoq formula bilan aniq mos kelmaydi?
2. 6 davrdan keyin neça foiz qoladi?
3. Grafikning har bir davrdagi qiymatlarini soliştiring.

## Masalalar

### 1-masala. Yod-131

Yod-131 ning yarim yemiriliş davri 8,02 sutka. 1000 ta yadrodan 24,06 sutkadan keyin neçtasi qoladi?

<SimExample :values='{"iso":0,"N0":1000,"nT":3}' check="3 yarim yemiriliş davri (24,06 sutka) ötdi: N = N₀·2^(−t/T) = 125 ta yadro qoldi (12,5 %).">

::: details Yeçimni körsatiş

1. Ötgan davrlar soni: $\dfrac tT = \dfrac{24{,}06}{8{,}02} = 3$.
2. $N = N_0\cdot 2^{-t/T} = 1000 \cdot 2^{-3} = \dfrac{1000}{8} = 125$.

**Javob.** $N = 125$ (12,5 %).

:::

</SimExample>

### 2-masala. Kobalt-60

Kobalt-60 manbaining aktivligi qança vaqtda 4 marta kamayadi?

<SimExample :values='{"iso":1,"N0":1000,"nT":2}' check="2 yarim yemiriliş davri (10,54 yil) ötdi: N = N₀·2^(−t/T) = 250 ta yadro qoldi (25,0 %).">

::: details Yeçimni körsatiş

1. Aktivlik yadrolar soniga proporsional ($A = \lambda N$), şuning uçun $\dfrac{A}{A_0} = 2^{-t/T} = \dfrac14 = 2^{-2}$.
2. $\dfrac tT = 2$, $t = 2T = 2 \cdot 5{,}27 = 10{,}54\ \text{yil}$.

**Javob.** $t = 10{,}54\ \text{yil}$.

:::

</SimExample>

### 3-masala. Radiouglerod usuli

Qadimiy yoğoç buyumda uglerod-14 miqdori tirik daraxtdagidan 2 marta kam. Buyum yoşi qança?

<SimExample :values='{"iso":3,"N0":1000,"nT":1}' check="1 yarim yemiriliş davri (5730,00 yil) ötdi: N = N₀·2^(−t/T) = 500 ta yadro qoldi (50,0 %).">

::: details Yeçimni körsatiş

1. $\dfrac{N}{N_0} = \dfrac12 = 2^{-t/T}$, demak $\dfrac tT = 1$: bitta yarim yemiriliş davri ötgan.
2. $t = T = 5730\ \text{yil}$.

**Javob.** Taxminan 5730 yil.

:::

</SimExample>

## Manbalar

Bu mavzu 11-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 3-jild, 10-bob](https://openstax.org/books/university-physics-volume-3/pages/10-3-radioactive-decay). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
