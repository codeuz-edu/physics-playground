---
title: "Qiya tekislik"
description: "Qiya tekislikdagi brusok. Oğirlik kuçini qiya tekislik böylab va unga tik yönalgan taşkil etuvçilarga ajrating, söng işqalaniş kuçi brusokni uşlab tura olmay qolgunça qiyalik burçagini oşiring."
topic: "Dinamika · Qiya tekislikdagi kuçlar"
examples: 3
---

# Qiya tekislik

<SimLab id="incline" />

## Asosiy ğoya

Qiya tekisliklar har qadamda uçraydi: çanği trassalari, bolalar sirpançiqlari, panduslar, toğga kötariladigan yöllar. Qiya tekislikda ham oğirlik kuçi tik pastga yönalgan, lekin uning faqat bir qismi sirt böylab taʼsir qiladi. Masalani yeçişning kaliti — koordinata öqlarini buriş: bir öqni qiya tekislik böylab, ikkinçisini unga tik yönaltiramiz va oğirlik kuçini şu ikki öq böyiça taşkil etuvçilarga ajratamiz.

Oğirlik kuçining qiya tekislik böylab taşkil etuvçisi $mg\sin\alpha$ jismni pastga sirpantirişga intiladi. Tekislikka tik taşkil etuvçisi $mg\cos\alpha$ esa jismni sirtga bosadi va işqalaniş kuçi qançalik katta böla olişini belgilaydi. Bolalar sirpançiği yetarliça tik qilib quriladi: pastga tortuvçi kuç işqalaniş kuçidan katta böladi, şuning uçun bolalar öz-özidan sirpanib tuşa boşlaydi.

<div class="lesson-photos">

<SimPhoto name="skiers" :width="1000" :height="1504" :display-width="350" alt="Keng, tekislangan qorli qiyalikdan tuşib kelayotgan çanğiçi va snoubordçi" credit="Surat: DimiTalen, &lt;a href=&quot;https://creativecommons.org/publicdomain/zero/1.0/&quot;&gt;CC0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Skier_and_snowboarder_come_down_Aiguille_slope,_Saint-Sorlin-d%27Arves,_2023.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali">

Çanği trassasida oğirlik kuçining qiyalik böylab taşkil etuvçisi $mg\sin\alpha$ qordagi kiçik işqalaniş kuçidan ança katta, şuning uçun çanğiçilarning tezligi ortib boradi.

</SimPhoto>

<SimPhoto name="playground-slide" :width="1000" :height="750" :display-width="350" alt="Narvoni va töğri qiya novi bor metall bolalar sirpançiği" credit="Surat: Curpharar, &lt;a href=&quot;https://creativecommons.org/licenses/by-sa/4.0&quot;&gt;CC BY-SA 4.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Typical_playground_slide_at_a_school.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali">

Bolalar sirpançiği — tayyor qiya tekislik: u şunçalik tik qilinganki, $\operatorname{tg}\alpha$ qiymati $\mu_\text{t}$ dan katta.

</SimPhoto>

</div>

## Nazariya

Qiya tekislikda oğirlik kuçi $mg$ ni ikkita taşkil etuvçiga ajratamiz: qiya tekislik böylab yönalgan $mg\sin\alpha$ brusokni pastga tortadi, tekislikka tik yönalgan $mg\cos\alpha$ esa uni sirtga bosadi va tayançning reaksiya kuçi $N$ bilan muvozanatlanadi.

<div class="eq-block">

<span class="eq-body">$\displaystyle N = m\,g\cos\alpha$</span>

<span class="eq-label">Tinç turiş şarti</span><span class="eq-body">$\displaystyle \operatorname{tg}\alpha \le \mu_\text{t}$</span>

<span class="eq-label">Sirpanişda</span><span class="eq-body">$\displaystyle a = g\,(\sin\alpha - \mu_\text{s}\cos\alpha)$</span>

<span class="eq-label">Tinç holatdan boşlab $S$ yöl bosib ötilgaç</span><span class="eq-body">$\displaystyle t = \sqrt{\frac{2S}{a}}, \qquad \upsilon = \sqrt{2aS}$</span>

</div>

Tinçlikdagi işqalaniş kuçi köpi bilan $\mu_\text{t} N$ ga teng böla oladi, sirpanayotgan brusokka esa $F_\text{iş} = \mu_\text{s} N$ işqalaniş kuçi taʼsir etadi. Sirpaniş işqalaniş koeffitsiyenti tinçlikdagi işqalaniş koeffitsiyentidan katta bölmaydi: $\mu_\text{s}$ ni $\mu_\text{t}$ dan katta qilib qöysangiz, simulyatsiya uni $\mu_\text{t}$ ga tenglaştiradi. Pastga tortuvçi kuç $\sin\alpha$ ga, işqalaniş kuçining eng katta qiymati esa $\cos\alpha$ ga proporsional, şuning uçun brusok massasidan qatʼi nazar $\operatorname{tg}\alpha$ qiymati $\mu_\text{t}$ dan katta bölganda sirpana boşlaydi. Taxtani biror jism sirpana boşlagunça qiyalatiş $\mu_\text{t}$ ni ölçaşning oddiy usulidir. Tezlaniş formulasida ham massa qisqarib ketadi: oğir va yengil brusoklar birga sirpanib tuşadi.

Rasmda barça kuçlar brusokning markazidan çizilgan: brusokni moddiy nuqta deb qaraymiz, şuning uçun unga taʼsir etuvçi kuçlarning hammasi şu bir nuqtaga qöyilgan deb tasvirlanadi. Teng taʼsir etuvçi kuç $\Sigma F$ yangi kuç emas, balki şu kuçlarning yiğindisi; u ham brusokning markazidan boşlab çiziladi.

<div class="lesson-note">

Qiyalik burçagi <span class="param-tag live">darhol</span> belgili: uni harakat davomida ham özgartiriş mumkin — parametr orqali yoki qiya tekislik tepasidagi dumaloq tutqiçni surib. Massa yoki işqalaniş koeffitsiyentlari özgartirilsa, harakat boşidan boşlanadi.

</div>

## Sinab köring

1. “Sirpaniş boşlanadigan burçakni toping” holatini tanlang, Boşlaş tugmasini bosing va qiyalik burçagini asta-sekin oşiring. Brusok qaysi burçakda harakatga keladi? $\operatorname{tg}\alpha = \mu_\text{t}$ şartini tekşiring.
2. Massasi 5 kg bölgan brusokni “Oğirroq brusok, öşa qiyalik” holati bilan taqqoslang. Qaysi biri pastga birinçi bölib yetib boradi?
3. Işqalanişsiz qiya tekislikda tezlaniş $g\sin\alpha$ ga tengmi?
4. Brusok sirpana boşlagaç, qiyalik burçagini biroz kamaytiring. Nima uçun brusok joyidan qözğalmaydigan burçakda ham sirpanişda davom eta oladi?

## Masalalar

### 1-masala. Taxtani qiyalatib $\mu_\text{t}$ ni aniqlaş

Massasi 5,0 kg bölgan brusok taxta ustida yotibdi, taxta esa asta-sekin qiyalatiladi. Brusok $30^\circ$ da tinç turadi va $31^\circ$ da sirpana boşlaydi. Sirpaniş işqalaniş koeffitsiyenti $\mu_\text{s} = 0{,}45$. a) $\mu_\text{t}$ ni taxminan toping. b) $30^\circ$ da brusokni qanday işqalaniş kuçi uşlab turadi? d) $31^\circ$ da brusok 6,8 m yölni qanday tezlaniş bilan sirpanib ötadi, pastga qança vaqtda va qanday tezlik bilan yetadi?

<SimExample :values='{"angle":30,"m":5,"mus":0.6,"muk":0.45}' check="30° da brusok tinç turadi, işqalaniş kuçi −24,5 N ni körsatadi. Harakat davomida qiyalik burçagini 31° ga oşiring (tepadagi tutqiçni suring): brusok 1,27 m/s² tezlaniş bilan sirpana boşlaydi.">

::: details Yeçimni körsatiş

1. a) Brusok $mg\sin\alpha = \mu_\text{t}\,mg\cos\alpha$, yaʼni $\operatorname{tg}\alpha = \mu_\text{t}$ bölgan burçakda sirpana boşlaydi, demak $\mu_\text{t} \approx \operatorname{tg} 31^\circ = 0{,}60$.
2. b) $30^\circ$ da işqalaniş kuçi oğirlik kuçining qiyalik böylab taşkil etuvçisini muvozanatlaydi: $F_\text{iş} = mg\sin 30^\circ = (5{,}0)(9{,}81)(0{,}500) = 24{,}5\ \text{N}$. Bu çegaraviy qiymat $\mu_\text{t}\,mg\cos 30^\circ = 25{,}5\ \text{N}$ dan biroz kiçik.
3. d) $a = g(\sin 31^\circ - \mu_\text{s}\cos 31^\circ) = 9{,}81(0{,}515 - 0{,}386) = 1{,}27\ \text{m/s}^2$.
4. d) Brusok tinç holatdan boşlab 6,8 m yölni bosib ötadi: $t = \sqrt{\dfrac{2S}{a}} = 3{,}27\ \text{s}$ va $\upsilon = \sqrt{2aS} = 4{,}15\ \text{m/s}$.

**Javob.** a) $\mu_\text{t} \approx 0{,}60$. b) $24{,}5\ \text{N}$. d) $a = 1{,}27\ \text{m/s}^2$; brusok $3{,}27\ \text{s}$ dan keyin pastga $4{,}15\ \text{m/s}$ tezlik bilan yetadi.

:::

</SimExample>

### 2-masala. Qorli tepalikdan çanada tuşiş

Plastik çanada ötirgan bola (çana bilan birgalikda massasi 20 kg) qiyalik burçagi $15^\circ$, uzunligi 6,8 m bölgan qorli tepalikda tinç turibdi; $\mu_\text{t} = 0{,}12$, $\mu_\text{s} = 0{,}10$. Çana öz-özidan harakatga keladimi? Agar şunday bölsa, u pastga qança vaqtda yetadi va u yerda tezligi qança böladi?

<SimExample :values='{"angle":15,"m":20,"mus":0.12,"muk":0.1}' check="Jism t = 2,92 s da qiya tekislikning pastiga yetdi, tezligi 4,65 m/s.">

::: details Yeçimni körsatiş

1. $\operatorname{tg} 15^\circ = 0{,}268 > 0{,}12$, demak pastga tortuvçi kuç tinçlikdagi işqalaniş kuçining eng katta qiymatidan katta va çana öz-özidan harakatga keladi.
2. $a = g(\sin 15^\circ - \mu_\text{s}\cos 15^\circ) = 9{,}81(0{,}259 - 0{,}097) = 1{,}59\ \text{m/s}^2$.
3. $t = \sqrt{\dfrac{2(6{,}8)}{1{,}59}} = 2{,}92\ \text{s}$ va $\upsilon = \sqrt{2(1{,}59)(6{,}8)} = 4{,}65\ \text{m/s}$.

**Javob.** Ha, harakatga keladi: çana $2{,}92\ \text{s}$ dan keyin pastga $4{,}65\ \text{m/s}$ tezlik bilan yetadi.

:::

</SimExample>

### 3-masala. Işqalaniş sirpançiqda harakatni qançalik sekinlaştiradi?

Massasi 18 kg bölgan bola qiyalik burçagi $35^\circ$, uzunligi 6,8 m bölgan sirpançiqdan tinç holatdan boşlab sirpanib tuşadi. Tuşiş vaqtini va pastdagi tezlikni taqqoslang: a) işqalaniş bölmaganda; b) $\mu_\text{t} = 0{,}40$, $\mu_\text{s} = 0{,}30$ bölganda.

<SimExample :values='{"angle":35,"m":18,"mus":0.4,"muk":0.3}' check="Jism t = 2,06 s da qiya tekislikning pastiga yetdi, tezligi 6,61 m/s. Ikkala işqalaniş koeffitsiyentini 0 ga tuşiring: 1,55 s va 8,75 m/s.">

::: details Yeçimni körsatiş

1. a) $a = g\sin 35^\circ = 5{,}63\ \text{m/s}^2$, demak $t = \sqrt{\dfrac{2(6{,}8)}{5{,}63}} = 1{,}55\ \text{s}$ va $\upsilon = \sqrt{2(5{,}63)(6{,}8)} = 8{,}75\ \text{m/s}$.
2. b) $\operatorname{tg} 35^\circ = 0{,}70 > 0{,}40$, demak bola sirpanadi va $a = g(\sin 35^\circ - 0{,}30\cos 35^\circ) = 3{,}22\ \text{m/s}^2$.
3. b) $t = \sqrt{\dfrac{2(6{,}8)}{3{,}22}} = 2{,}06\ \text{s}$ va $\upsilon = \sqrt{2(3{,}22)(6{,}8)} = 6{,}61\ \text{m/s}$: işqalaniş tufayli tezlik taxminan çorak qismga kamayadi.

**Javob.** a) $1{,}55\ \text{s}$ va $8{,}75\ \text{m/s}$. b) $2{,}06\ \text{s}$ va $6{,}61\ \text{m/s}$.

:::

</SimExample>

## Manbalar

Bu mavzu maktab fizika darsligining mexanika bölimida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 6-bob](https://openstax.org/books/university-physics-volume-1/pages/6-2-friction). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
