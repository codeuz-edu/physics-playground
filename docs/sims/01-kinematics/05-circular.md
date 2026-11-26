---
title: "Aylana böylab tekis harakat"
description: "Şarça aylana böylab tezlik moduli özgarmagan holda harakatlanadi. Tezlik vektori qanday burilişini, tezlaniş doim markazga yönalişini va x, y koordinatalar sinusoida böyiça özgarişini kuzating."
topic: "Kinematika · Aylana böylab harakat"
examples: 3
---

# Aylana böylab tekis harakat

<SimLab id="circular" />

## Asosiy ğoya

Çarxpalak (köngiloçar ğildirak) kabinasi, aylanma çorrahadagi avtomobil, sportçi aylantirayotgan bolğa — ularning har biri aylana böylab harakatlanadi. Tezlik moduli özgarmasa ham, bu harakat tezlanuvçan harakatdir, çunki tezlikning yönalişi uzluksiz özgarib turadi. Tezlaniş aylana markaziga yönalgan, şuning uçun u *markazga intilma* tezlaniş deb ataladi.

Bu tezlanişni jismni markazga tortib turuvçi biror kuç hosil qiladi. Bolğada bu — simning taranglik kuçi, burilişdagi avtomobilda — yölning işqalaniş kuçi, Oyda esa — Yerning tortişiş kuçi. Bu kuçning taʼsiri töxtasa (masalan, sportçi bolğani qöyib yuborsa), jism aylanaga urinma böylab töğri çiziq böyiça uçib ketadi.

<div class="lesson-photos">

<SimPhoto name="ferris-wheel" :width="1000" :height="664" :display-width="350" alt="Katta çarxpalakning uzoq ekspozitsiyada olingan tungi surati: çiroqlarining izi töliq aylanalar çizgan" caption="Uzoq ekspozitsiyada olingan suratda Brisben çarxpalagi (Wheel of Brisbane) çiroqlarining izi aylanalar hosil qiladi. Har bir kabinaning tezlik moduli özgarmaydi, yönalişi esa uzluksiz özgarib turadi." credit="Surat: Jorge Láscar, “Spinning2 – Wheel of Brisbane”, &lt;a href=&quot;https://creativecommons.org/licenses/by/2.0&quot;&gt;CC BY 2.0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:%22Spinning2%22_-_Wheel_of_Brisbane_(6586693905).jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

<SimPhoto name="hammer-throw" :width="640" :height="425" :display-width="350" alt="Uloqtiriş doirasida aylanayotgan sportçi; bolğaning şari tarang sim uçida undan uzoqda turibdi" caption="Bolğa uloqtirişda tarang sim şarni sportçi tomon tortadi: aynan şu taranglik kuçi şarni aylanada uşlab turuvçi, markazga yönalgan kuçdir." credit="Surat: Phil Sussman, U.S. Army, “Hammerthrow wire”, jamoat mulki, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Hammerthrow_wire.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Aylana böylab tezlik moduli özgarmagan holda harakatlaniş ham tezlanuvçan harakatdir, çunki tezlikning yönalişi uzluksiz özgarib turadi. Tezlik har doim aylanaga urinma böylab, tezlaniş esa aylana markaziga yönalgan (u *markazga intilma* tezlaniş deyiladi). Tezlanişning moduli:

<div class="eq-block">

<span class="eq-body">$\displaystyle a = \frac{\upsilon^2}{R} = \omega^2 R, \qquad \omega = \frac{\upsilon}{R}$</span>

<span class="eq-label">Aylaniş davri</span><span class="eq-body">$\displaystyle T = \frac{2\pi R}{\upsilon} = \frac{2\pi}{\omega}$</span>

<span class="eq-body">$\displaystyle x(t) = R\cos\omega t, \qquad y(t) = R\sin\omega t$</span>

</div>

Radius özgarmaganda tezlik ikki marta oşsa, tezlaniş tört marta ortadi. Aylanayotgan jismning barça nuqtalarida burçak tezligi $\omega$ bir xil, şuning uçun markazdan uzoqroqdagi nuqtalar tezroq harakatlanadi va ularning tezlanişi kattaroq böladi.

Öqlardagi rangli nuqtalarni kuzating. Har bir nuqta — şarçaning şu öqqa proyeksiyasi, u oldinga-orqaga tebranadi. Bu nuqtalarning grafiklari kosinusoida va sinusoida bölib, bir-biridan çorak aylanişga siljigan. Tezlik proyeksiyalari ham sinusoida böyiça özgaradi.

<div class="lesson-note">

Tezlik <span class="param-tag live">darhol</span> belgili: uni aylaniş davomida özgartiriş mumkin. Radius özgartirilsa, harakat boşidan boşlanadi.

</div>

## Sinab köring

1. “Radius öşa, tezlik ikki marta katta” holatini tanlang. Aylaniş davri ikki marta qisqaradi. Markazga intilma tezlaniş-çi?
2. “Tezlik öşa, radius ikki marta kiçik” holatini tanlang. Markazga intilma tezlanişni radiusi 3 m bölgan aylanadagi bilan soliştiring. U $\dfrac{\upsilon^2}{R}$ formulaga mos keladimi?
3. Aylananing qaysi nuqtasida $\upsilon_x$ eng katta, qayerida nolga teng? Tezlik proyeksiyalari grafigini sahnadagi rasm bilan soliştiring.
4. Harakat davomida tezlikni 0 qilib qöying. Nima uçun tezlaniş vektori ham yöqoladi?

## Masalalar

### 1-masala. Sekin aylanayotgan çarxpalak

Radiusi 10,0 m bölgan çarxpalak kabinasidagi yölovçi $2{,}0\ \text{m/s}$ tezlik bilan tekis harakatlanadi. Aylaniş davri, burçak tezligi va markazga intilma tezlanişni toping.

<SimExample :values='{"r":10,"v":2}' check="Körsatkiçlarda: aylaniş davri 31,42 s; burçak tezligi 0,20 rad/s; markazga intilma tezlaniş 0,40 m/s². Şarça 62,83 s davomida 2 marta töliq aylanadi (tezroq köriş uçun 2× ni tanlang).">

::: details Yeçimni körsatiş

1. Bir marta aylanişda yölovçi aylana uzunligiga teng yölni bosib ötadi: $T = \dfrac{2\pi R}{\upsilon} = \dfrac{2\pi(10{,}0)}{2{,}0} = 31{,}4\ \text{s}$.
2. $\omega = \dfrac{\upsilon}{R} = \dfrac{2{,}0}{10{,}0} = 0{,}200\ \text{rad/s}$.
3. $a = \dfrac{\upsilon^2}{R} = \dfrac{2{,}0^2}{10{,}0} = 0{,}400\ \text{m/s}^2$, bu $g$ ning taxminan 4 foizi xolos: yölovçi tezlanişni deyarli sezmaydi.

**Javob.** $T = 31{,}4\ \text{s}$; $\omega = 0{,}200\ \text{rad/s}$; $a = 0{,}400\ \text{m/s}^2$.

:::

</SimExample>

### 2-masala. Bolğani aylantiriş

Sportçi bolğani qöyib yuborişidan sal oldin bolğaning şari radiusi 2,0 m bölgan aylana böylab $20{,}0\ \text{m/s}$ tezlik bilan harakatlanadi. $\omega$, aylaniş davri va markazga intilma tezlanişni toping hamda tezlanişni $g$ bilan soliştiring.

<SimExample :values='{"r":2,"v":20}' check="Körsatkiçlarda: aylaniş davri 0,63 s; burçak tezligi 10,00 rad/s; markazga intilma tezlaniş 200,00 m/s².">

::: details Yeçimni körsatiş

1. $\omega = \dfrac{\upsilon}{R} = \dfrac{20{,}0}{2{,}0} = 10{,}0\ \text{rad/s}$.
2. $T = \dfrac{2\pi}{\omega} = \dfrac{2\pi}{10{,}0} = 0{,}628\ \text{s}$.
3. $a = \dfrac{\upsilon^2}{R} = \dfrac{20{,}0^2}{2{,}0} = 200\ \text{m/s}^2$, bu $g$ dan $\dfrac{200}{9{,}81} = 20{,}4$ marta katta.

**Javob.** $\omega = 10{,}0\ \text{rad/s}$; $T = 0{,}628\ \text{s}$; $a = 200\ \text{m/s}^2 \approx 20\,g$.

:::

</SimExample>

### 3-masala. Karuseldagi ikki bola

Ikki bola burçak tezligi $\omega = 1{,}0\ \text{rad/s}$ bölgan bitta karuselda aylanmoqda. Biri markazdan 2,0 m, ikkinçisi 6,0 m uzoqlikda ötiribdi. Ularning çiziqli tezliklari, aylaniş davrlari va markazga intilma tezlanişlarini soliştiring.

<SimExample :values='{"r":6,"v":6}' check="Çetdagi bola uçun: aylaniş davri 6,28 s; burçak tezligi 1,00 rad/s; markazga intilma tezlaniş 6,00 m/s². Içkaridagi bolani köriş uçun radiusni 2 m, tezlikni 2 m/s qiling: davr özgarmaydi, tezlaniş esa uç marta kamayadi.">

::: details Yeçimni körsatiş

1. Ular birga aylanadi, şuning uçun burçak tezligi $\omega$ ham, aylaniş davri $T = \dfrac{2\pi}{\omega} = 6{,}28\ \text{s}$ ham ikkalasida bir xil.
2. Çiziqli tezlik radius bilan ortadi: $\upsilon = \omega R$ formula böyiça $2{,}0\ \text{m/s}$ va $6{,}0\ \text{m/s}$.
3. Tezlaniş ham ortadi: $a = \omega^2 R$ formula böyiça $2{,}0\ \text{m/s}^2$ va $6{,}0\ \text{m/s}^2$, yaʼni çetdagi bolaning tezlanişi uç marta katta.

**Javob.** Aylaniş davri ikkalasida bir xil: $T = 6{,}28\ \text{s}$; tezliklar $2{,}0$ va $6{,}0\ \text{m/s}$; tezlanişlar $2{,}0$ va $6{,}0\ \text{m/s}^2$.

:::

</SimExample>

## Manbalar

Bu mavzu maktab fizika darsligining mexanika bölimida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 4-bob](https://openstax.org/books/university-physics-volume-1/pages/4-4-uniform-circular-motion). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
