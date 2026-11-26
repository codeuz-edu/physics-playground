---
title: "Liftdagi jismning vazni"
description: "Lift içidagi odam tarozida turibdi. Lift yuqoriga yoki pastga tezlaniş bilan harakatlanganda tarozi körsatişi özgaradi, arqon uzilganda esa nolga tuşadi: oğirlik kuçi özgarmaydi, vazn özgaradi."
topic: "Dinamika · Vazn, ortiqça yuklaniş va vaznsizlik"
examples: 3
---

# Liftdagi jismning vazni

<SimLab id="lift" />

## Asosiy ğoya

Lift joyidan qözğalayotganda oyoqlarimizga özimizni oğirroq his qilamiz, töxtayotganda esa yengil tortamiz. Kosmonavtlar raketa uçirilganda bir neça barobar ortiqça yuklanişni boşdan keçiradi, orbitada esa vaznsizlik holatida böladi. Bu hodisalarning hammasida oğirlik kuçi deyarli özgarmaydi, özgaradigani — vazn.

Tarozi bizning oğirlik kuçimizni emas, uni qança kuç bilan bosayotganimizni ölçaydi. Lift tezlaniş bilan harakatlansa, bu kuç $mg$ dan farq qiladi. Lift erkin tuşsa, odam va tarozi bir xil tezlaniş bilan tuşadi, odam taroziga bosmaydi va u nolni körsatadi.

<div class="lesson-photos">

<SimPhoto name="weightless-kc135" :width="1200" :height="746" alt="Maxsus samolyot salonida vaznsizlik holatida suzib yurgan ayol" caption="Maxsus samolyot parabola böylab uçganda uning içidagi hamma narsa samolyot bilan birga erkin tuşadi: tarozi nolni körsatadi, odam vaznsizlikni his qiladi. Suratda öqituvçi va astronavt Krista Makoliff maşğulot paytida." credit="Surat: NASA, jamoat mulki, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Christa_McAuliffe_Experiences_Weightlessness_During_KC-135_Flight_-_GPN-2002-000149.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Jismning vazni $P$ — jismning tayanç yoki osmaga taʼsir qiladigan kuçi. Nyutonning uçinçi qonuniga köra u tayançning reaksiya kuçiga teng: $P = N$. Oğirlik kuçi esa Yer tomonidan taʼsir qiladi va $mg$ ga teng; lift qanday harakatlanmasin, u özgarmaydi.

<div class="eq-block">

<span class="eq-label">Nyutonning ikkinçi qonuni (yuqori musbat)</span><span class="eq-body">$\displaystyle m a_y = N - mg$</span>

<span class="eq-label">Vazn</span><span class="eq-body">$\displaystyle P = N = m\,(g + a_y)$</span>

<span class="eq-label">Ortiqça yuklaniş</span><span class="eq-body">$\displaystyle a_y > 0: \quad P > mg$</span>

<span class="eq-label">Vaznsizlik</span><span class="eq-body">$\displaystyle a_y = -g: \quad P = 0$</span>

</div>

Lift qaysi tomonga harakatlanayotgani emas, tezlanişi qaysi tomonga yönalgani muhim. Yuqoriga ketayotgan lift töxtayotganda tezlaniş pastga yönalgan va vazn kamayadi; pastga ketayotgan lift töxtayotganda esa vazn ortadi.

## Sinab köring

1. “Vazn” grafigiga qarang. Tekis harakat paytida tarozi nimani körsatadi?
2. Lift yuqoriga ketayotib töxtaganda va pastga ketayotib töxtaganda vazn qanday farq qiladi?
3. Tezlanişni 5 m/s² qiling. Odam özini neça marta oğir his qiladi?

## Masalalar

### 1-masala. Yuqoriga ketayotgan lift

Massasi 60 kg bölgan odam liftda tarozida turibdi. Lift $2{,}0\ \text{m/s}^2$ tezlaniş bilan yuqoriga harakatlana boşladi, söng tekis harakatlandi va xuddi şunday tezlaniş bilan töxtadi. Har bir qismda tarozi qança körsatadi?

<SimExample :values='{"m":60,"a":2,"mode":0,"g":9.81}' check="Tezlanişli qismda tarozi 708,6 N, tekis harakatda 588,6 N, töxtaş paytida 468,6 N körsatdi.">

::: details Yeçimni körsatiş

1. Tezlaniş yuqoriga: $P = m(g + a) = 60\,(9{,}81 + 2{,}0) = 708{,}6\ \text{N}$.
2. Tekis harakat, $a = 0$: $P = mg = 588{,}6\ \text{N}$.
3. Töxtaş: tezlaniş pastga, $P = m(g - a) = 60\,(9{,}81 - 2{,}0) = 468{,}6\ \text{N}$.

**Javob.** $708{,}6\ \text{N}$, $588{,}6\ \text{N}$ va $468{,}6\ \text{N}$.

:::

</SimExample>

### 2-masala. Pastga ketayotgan lift

Massasi 50 kg bölgan qiz pastga ketayotgan liftda turibdi. Lift $1{,}5\ \text{m/s}^2$ tezlaniş bilan harakatga keldi va xuddi şunday tezlaniş bilan töxtadi. Qaysi paytda uning vazni katta böladi?

<SimExample :values='{"m":50,"a":1.5,"mode":1,"g":9.81}' check="Tezlanişli qismda tarozi 415,5 N, tekis harakatda 490,5 N, töxtaş paytida 565,5 N körsatdi.">

::: details Yeçimni körsatiş

1. Harakatga kelişda tezlaniş pastga: $P = m(g - a) = 50 \cdot 8{,}31 = 415{,}5\ \text{N}$.
2. Töxtaşda tezlaniş yuqoriga: $P = m(g + a) = 50 \cdot 11{,}31 = 565{,}5\ \text{N}$.

**Javob.** Lift töxtayotganda: $565{,}5\ \text{N}$ (harakatga kelişda $415{,}5\ \text{N}$).

:::

</SimExample>

### 3-masala. Erkin tuşayotgan lift

Lift arqoni uzildi va kabina erkin tuşa boşladi. Massasi 60 kg bölgan odamning vazni qança? Unga taʼsir etuvçi oğirlik kuçi-çi?

<SimExample :values='{"m":60,"a":2,"mode":2,"g":9.81}' check="Arqon uzilgan lift erkin tuşadi: tarozi nolni körsatadi, odamning vazni P = 0. Bu vaznsizlik holati.">

::: details Yeçimni körsatiş

1. Kabina va odam $a_y = -g$ tezlaniş bilan tuşadi: $P = m(g - g) = 0$.
2. Oğirlik kuçi özgarmaydi: $mg = 588{,}6\ \text{N}$. Aynan şu kuç odamni $g$ tezlaniş bilan tuşiradi.

**Javob.** Vazn $P = 0$ (vaznsizlik), oğirlik kuçi $588{,}6\ \text{N}$.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 6-bob](https://openstax.org/books/university-physics-volume-1/pages/6-1-solving-problems-with-newtons-laws). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
