---
title: "Qutini itariş"
description: "Qutini pol böylab itaring. Itariş kuçi yengmagunça tinçlikdagi işqalaniş kuçi qutini uşlab turadi; söng sirpaniş işqalanişi taʼsir qila boşlaydi va tezlanişni teng taʼsir etuvçi kuç belgilaydi."
topic: "Dinamika · Nyutonning ikkinçi qonuni"
examples: 3
---

# Qutini itariş

<SimLab id="push-box" />

## Asosiy ğoya

Nima uçun oğir qutini joyidan qözğatiş uçun qattiq itariş kerak, harakatlanayotgan qutini esa kamroq kuç bilan itarib boriş mumkin? Nyutonning ikkinçi qonuniga köra, tezlanişni *teng taʼsir etuvçi* kuç belgilaydi: bu itariş kuçidan unga qarşi yönalgan kuçlarni ayirganda qoladigan kuç. Pol ustida harakatga işqalaniş kuçi qarşilik qiladi.

Işqalanişning ikki turi bor. Quti tinç turganda *tinçlikdagi işqalaniş* kuçi itariş kuçiga son jihatdan aynan teng böladi, lekin faqat maʼlum çegaragaça, şuning uçun quti qözğalmaydi. Itariş kuçi şu çegaradan oşsa, quti joyidan qözğaladi va şundan keyin kiçikroq *sirpaniş işqalanişi* kuçi taʼsir qiladi. Buni yukli çanani itarayotgan yoki bobsley çanasini turtib yuborayotgan sportçilar har safar his qiladi: eng qiyini — joyidan qözğatiş.

<div class="lesson-photos">

<SimPhoto name="sled-push" :width="1000" :height="666" :display-width="350" alt="Harbiy formadagi dengiz piyodasi past egilib, sport zali poli böylab yukli çanani itarmoqda" caption="Yukli çanani itariş: avval itariş kuçi tinçlikdagi işqalaniş kuçining eng katta qiymatidan oşişi kerak, söng çanani sirpantirib boriş uçun faqat sirpaniş işqalanişini yengiş yetarli." credit="Surat: Kaitlin Kelly, Marine Corps Systems Command, jamoat mulki, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Marine_sled_push.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

<SimPhoto name="bobsled-start" :width="1000" :height="1400" :display-width="350" alt="Ikki sportçi muzli trassada start çiziğidan bobsley çanasini itarmoqda" caption="Bobsleyda start: sportçilar çanani itarib tezlik oldiradi, söng çana muz ustida sirpanadi. Muzda sirpaniş işqalanişi juda kiçik, şuning uçun çana tezligini deyarli yöqotmaydi." credit="Surat: Jack Gillund, U.S. Army, jamoat mulki, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Torino_2006_USA-1_2women_bobsled_start.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Nyutonning ikkinçi qonuniga köra, qutining tezlanişini teng taʼsir etuvçi kuç belgilaydi: $a = \dfrac{\Sigma F}{m}$. Pol böylab qutiga ikki kuç taʼsir qiladi: itariş kuçi $F$ va pol tomonidan işqalaniş kuçi $F_\text{iş}$.

<div class="eq-block">

<span class="eq-body">$\displaystyle m\,a = F + F_\text{iş}$</span>

<span class="eq-label">Tinç turganda: tinçlikdagi işqalaniş</span><span class="eq-body">$\displaystyle \lvert F_\text{iş}\rvert \le \mu_\text{t}\,m\,g$</span>

<span class="eq-label">Sirpanganda: sirpaniş işqalanişi</span><span class="eq-body">$\displaystyle F_\text{iş} = -\mu_\text{s}\,m\,g$</span>

<span class="eq-label">Itariş bölmaganda töxtaş yöli</span><span class="eq-body">$\displaystyle S = \frac{\upsilon_0^2}{2\mu_\text{s}\,g}$</span>

</div>

Vertikal yönalişda tayançning reaksiya kuçi $N = mg$ yuqoriga yönalgan va oğirlik kuçini muvozanatlaydi. Tinçlikdagi işqalaniş kuçi qança kerak bölsa, şunça böladi: qutini 20 N bilan itarsangiz, u ham 20 N bilan qarşilik körsatadi. Itariş kuçi $\mu_\text{t} N$ çegaradan oşgandagina quti joyidan qözğaladi. Şundan söng kiçikroq sirpaniş işqalanişi taʼsir qila boşlaydi, $F_\text{iş} = \mu_\text{s} N$. Şuning uçun qutini harakatlantirib turiş uni joyidan qözğatişdan osonroq. Sirpaniş işqalaniş koeffitsiyenti tinçlikdagi işqalaniş koeffitsiyentidan katta bölmaydi: $\mu_\text{s}$ ni $\mu_\text{t}$ dan katta qilib qöysangiz, simulyatsiya uni $\mu_\text{t}$ ga tenglaştiradi.

Rasmda barça kuçlar qutining markazidan çizilgan: qutini moddiy nuqta deb qaraymiz, şuning uçun unga taʼsir etuvçi kuçlarning hammasi şu bir nuqtaga qöyilgan deb tasvirlanadi. Teng taʼsir etuvçi kuç $\Sigma F$ yangi kuç emas, balki şu kuçlarning yiğindisi, şuning uçun u qutining ustida alohida körsatilgan.

<div class="lesson-note">

Itariş kuçi <span class="param-tag live">darhol</span> belgili: uni quti sirpanayotganda özgartiriş yoki yaşil tutqiçni suriş mumkin. Massa, işqalaniş koeffitsiyentlari yoki boşlanğiç tezlik özgartirilsa, harakat boşidan boşlanadi.

</div>

## Sinab köring

1. “Qözğatişga kuç yetmaydi” holatini tanlang, “Boşlaş” tugmasini bosing va itariş kuçini asta-sekin oşiring. Quti qanday kuçda joyidan qözğaladi? Uni $\mu_\text{t}\,m\,g$ bilan soliştiring.
2. Quti sirpana boşlagan paytda kuçlar grafigini kuzating. Nima uçun işqalaniş kuçi birdan kamayadi?
3. “Turtib, qöyib yuboriş” holatini tanlang. Quti $\dfrac{\upsilon_0^2}{2\mu_\text{s}\,g}$ ga teng yölni bosib ötib töxtaydimi?
4. “Oğirroq quti, xuddi şu kuç” holatini tanlang. Nima uçun endi quti umuman qözğalmaydi?

## Masalalar

### 1-masala. Quti qözğaladimi?

Massasi 20,0 kg bölgan yoğoç quti polda tinç turibdi. Quti bilan pol orasidagi işqalaniş koeffitsiyentlari $\mu_\text{t} = 0{,}40$ va $\mu_\text{s} = 0{,}30$. Qutini gorizontal yönalişda a) 60 N, söng b) 80 N kuç bilan itaramiz. Quti qözğaladimi? Har bir holda işqalaniş kuçini va tezlanişni toping.

<SimExample :values='{"F":60,"m":20,"mus":0.4,"muk":0.3,"v0":0}' check="60 N da quti joyida turadi, körsatkiçlarda işqalaniş kuçi −60,0 N. Harakat davomida itariş kuçini 80 N ga oşiring (yaşil tutqiçni suring): işqalaniş kuçining moduli kamayib, −58,9 N böladi, tezlaniş esa 1,06 m/s².">

::: details Yeçimni körsatiş

1. Gorizontal polda $N = mg = (20{,}0)(9{,}81) = 196{,}2\ \text{N}$, şuning uçun tinçlikdagi işqalaniş kuçining eng katta qiymati $\mu_\text{t} N = (0{,}40)(196{,}2) = 78{,}5\ \text{N}$.
2. a) $60\ \text{N} < 78{,}5\ \text{N}$: quti joyida qoladi. Tinçlikdagi işqalaniş kuçi itariş kuçini muvozanatlaydi: $F_\text{iş} = 60\ \text{N}$, $a = 0$.
3. b) $80\ \text{N} > 78{,}5\ \text{N}$: quti joyidan qözğaladi va endi sirpaniş işqalanişi taʼsir qiladi: $F_\text{iş} = \mu_\text{s} N = (0{,}30)(196{,}2) = 58{,}9\ \text{N}$.
4. b) $a = \dfrac{F - F_\text{iş}}{m} = \dfrac{80 - 58{,}9}{20{,}0} = 1{,}06\ \text{m/s}^2$. Quti sirpana boşlagaç, uni tekis harakatlantirib turiş uçun taxminan 59 N kuç yetarli.

**Javob.** a) Quti qözğalmaydi, işqalaniş kuçi $60\ \text{N}$. b) Quti sirpanadi, işqalaniş kuçi $58{,}9\ \text{N}$, $a = 1{,}06\ \text{m/s}^2$.

:::

</SimExample>

### 2-masala. Işqalaniş tezlanişni qançaga kamaytiradi?

Massasi 15,0 kg bölgan qutini 45 N özgarmas gorizontal kuç bilan itaramiz. Qutining tezlanişini toping: a) işqalanişsiz polda; b) $\mu_\text{t} = \mu_\text{s} = 0{,}10$ bölgan polda.

<SimExample :values='{"F":45,"m":15,"mus":0.1,"muk":0.1,"v0":0}' check="Körsatkiçlarda işqalaniş kuçi −14,7 N, tezlaniş 2,02 m/s²; quti marraga t = 4,88 s da yetadi. Ikkala işqalaniş koeffitsiyentini 0 qilsangiz, tezlaniş 3,00 m/s² böladi.">

::: details Yeçimni körsatiş

1. a) Işqalaniş bölmasa: $a = \dfrac{F}{m} = \dfrac{45}{15{,}0} = 3{,}00\ \text{m/s}^2$.
2. b) Tinçlikdagi işqalaniş kuçining eng katta qiymati $(0{,}10)(15{,}0)(9{,}81) = 14{,}7\ \text{N} < 45\ \text{N}$, demak quti sirpanadi va $F_\text{iş} = 14{,}7\ \text{N}$.
3. b) $a = \dfrac{45 - 14{,}7}{15{,}0} = 2{,}02\ \text{m/s}^2$: işqalaniş tezlanişni taxminan uçdan bir qismga kamaytiradi.

**Javob.** a) $3{,}00\ \text{m/s}^2$; b) $2{,}02\ \text{m/s}^2$, işqalaniş kuçi $14{,}7\ \text{N}$.

:::

</SimExample>

### 3-masala. Turtib yuborilgan quti

Massasi 8,0 kg bölgan qutini şunday turtib yuboramizki, u qöldan $4{,}0\ \text{m/s}$ tezlik bilan ajraladi, söng uni heç narsa itarmaydi. Polning sirpaniş işqalaniş koeffitsiyenti $\mu_\text{s} = 0{,}25$. Quti qança masofa sirpanadi va bunga qança vaqt ketadi? Natija massaga boğliqmi?

<SimExample :values='{"F":0,"m":8,"mus":0.35,"muk":0.25,"v0":4}' check="“Quti 3,26 m sirpanib, işqalaniş tufayli töxtadi.” Bu t = 1,63 s da röy beradi. Massani 40 kg qilib qöying: natija yana öşa 3,26 m.">

::: details Yeçimni körsatiş

1. Gorizontal yönalişda faqat sirpaniş işqalaniş kuçi taʼsir qiladi: $F_\text{iş} = \mu_\text{s} m g = (0{,}25)(8{,}0)(9{,}81) = 19{,}6\ \text{N}$, demak $a = -\dfrac{F_\text{iş}}{m} = -\mu_\text{s} g = -2{,}45\ \text{m/s}^2$.
2. Quti $\upsilon = 0$ bölganda töxtaydi: $S = \dfrac{\upsilon_0^2}{2\mu_\text{s} g} = \dfrac{4{,}0^2}{2(0{,}25)(9{,}81)} = 3{,}26\ \text{m}$.
3. $t = \dfrac{\upsilon_0}{\mu_\text{s} g} = \dfrac{4{,}0}{2{,}45} = 1{,}63\ \text{s}$. Massa qisqarib ketadi: xuddi şu tezlik bilan yuborilgan, massasi 40 kg bölgan quti ham aynan 3,26 m dan keyin töxtaydi.

**Javob.** Quti massasidan qatʼi nazar $1{,}63\ \text{s}$ davomida $3{,}26\ \text{m}$ sirpanadi.

:::

</SimExample>

## Manbalar

Bu mavzu maktab fizika darsligining mexanika bölimida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 6-bob](https://openstax.org/books/university-physics-volume-1/pages/6-2-friction). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
