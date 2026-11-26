---
title: "Muvozanat turlari"
description: "Şarni çuqurlik tubida, dönglik çöqqisida va tekis sirtda muvozanatdan biroz çiqaring. Turğun muvozanatda u qaytadi, turğunmas muvozanatda uzoqlaşadi, befarq muvozanatda yangi joyda qoladi."
topic: "Statika · Turğun, turğunmas va befarq muvozanat"
examples: 3
---

# Muvozanat turlari

<SimLab id="equilibrium-types" />

## Asosiy ğoya

Stol ustida yotgan kitob, tik turgan qalam va osilgan çiroq — hammasi muvozanatda. Lekin qalamni biroz turtsak yiqiladi, çiroqni turtsak tebranib qaytadi, yumaloq qalamni stol böylab yumalatsak — yangi joyda ham tinç qoladi.

Muvozanat turini jismning potensial energiyasi aniqlaydi. Jism har doim potensial energiyasi kamayadigan tomonga intiladi: energiya minimal bölgan holat turğun, maksimal bölgan holat turğunmas.

<div class="lesson-photos">

<SimPhoto name="balancing-rocks" :width="1200" :height="800" alt="Bir-birining ustida muvozanatda turgan ulkan granit toşlar" caption="Zimbabvedagi Çiremba toşlari: ulkan granit bölaklari ming yillar davomida bir-birining ustida turibdi. Ularning har biri turğun muvozanatda — biroz qimirlatilsa, oğirlik kuçi uni yana joyiga qaytaradi." credit="Surat: lumoplank, &lt;a href=&quot;https://creativecommons.org/publicdomain/zero/1.0/&quot;&gt;CC0&lt;/a&gt;, &lt;a href=&quot;https://commons.wikimedia.org/wiki/File:Chiremba_Balancing_Rocks_-_Harare3500.jpg&quot;&gt;Wikimedia Commons&lt;/a&gt; orqali" />

</div>

## Nazariya

Jism muvozanatda bölişi uçun unga taʼsir etuvçi kuçlarning teng taʼsir etuvçisi va kuç momentlari yiğindisi nolga teng bölişi kerak. Lekin muvozanat har xil böladi: jism biroz çiqarilganda nima bölişiga qarab uç turga ajratiladi.

<div class="eq-block">

<span class="eq-label">Turğun</span><span class="eq-body">Çiqarilgan jism muvozanat holatiga qaytadi; potensial energiya minimal</span>

<span class="eq-label">Turğunmas</span><span class="eq-body">Jism muvozanat holatidan uzoqlaşadi; potensial energiya maksimal</span>

<span class="eq-label">Befarq</span><span class="eq-body">Jism yangi holatda ham muvozanatda qoladi; potensial energiya özgarmaydi</span>

</div>

Çuqurlikda oğirlik kuçi va tayanç kuçining teng taʼsir etuvçisi şarni pastga, muvozanat holatiga qaytaradi; dönglikda esa undan uzoqlaştiradi. Tayançli jism turğun bölişi uçun oğirlik markazidan tuşirilgan tik çiziq tayanç yuzasidan çiqmasligi kerak.

## Sinab köring

1. Çuqurlikda “Potensial energiya” grafigiga qarang: şar qaysi holatda töxtaydi?
2. Dönglikda siljişni juda kiçik qiling. Şar baribir ketadimi?
3. Kuçlar strelkalariga qarang: N va mg qaysi holatda bir töğri çiziqda yotadi?

## Masalalar

### 1-masala. Çuqurlikdagi şar

Şar çuqurlik tubidan 0,20 m çetga siljitib qöyib yuborildi. U qanday harakatlanadi va qayerda töxtaydi?

<SimExample :values='{"mode":0,"x0":0.2,"m":0.5,"g":9.81}' check="Turğun muvozanat: şar muvozanat holati atrofida tebranib, unga qaytmoqda.">

::: details Yeçimni körsatiş

1. Oğirlik kuçi va tayanç kuçining teng taʼsir etuvçisi şarni tub tomonga yönaltiradi.
2. Şar tub atrofida tebranadi, işqalaniş tufayli tebranişlar sönadi va u muvozanat holatida töxtaydi.

**Javob.** Tub atrofida tebranib, tubda töxtaydi: turğun muvozanat.

:::

</SimExample>

### 2-masala. Dönglikdagi şar

Şar dönglik çöqqisida turibdi. U 2 sm ga siljitilsa nima böladi?

<SimExample :values='{"mode":1,"x0":0.02,"m":0.5,"g":9.81}' check="Turğunmas muvozanat: şar muvozanat holatidan çiqarilgandan keyin undan uzoqlaşib ketdi.">

::: details Yeçimni körsatiş

1. Endi teng taʼsir etuvçi kuç şarni çöqqidan uzoqqa yönaltiradi.
2. Siljiş qança kiçik bölmasin, şar yumalab ketadi.

**Javob.** Şar uzoqlaşib ketadi: turğunmas muvozanat.

:::

</SimExample>

### 3-masala. Tekislikdagi şar

Şar gorizontal tekislikda 0,20 m surib qöyildi. U qayerda töxtaydi?

<SimExample :values='{"mode":2,"x0":0.2,"m":0.5,"g":9.81}' check="Befarq muvozanat: şar yangi joyda ham tinç turibdi.">

::: details Yeçimni körsatiş

1. Tekislikda tayanç kuçi tik yuqoriga yönalgan va $N = mg$: u oğirlik kuçini hamma joyda muvozanatlaydi, teng taʼsir etuvçi nolga teng.
2. Potensial energiya $E_p = mgh$ hamma joyda bir xil, şuning uçun şar heç qaysi tomonga intilmaydi.
3. Şar 0,20 m surilgan joyda tinç qoladi.

**Javob.** Qayerga qöyilsa, şu yerda qoladi: befarq muvozanat.

:::

</SimExample>

## Manbalar

Bu mavzu 10-sinf fizika darsligida ötiladi. Ingliz tilidagi bepul darslik: [OpenStax University Physics, 1-jild, 12-bob](https://openstax.org/books/university-physics-volume-1/pages/12-1-conditions-for-static-equilibrium). Bu sahifadagi masalalar Fizika maydonçasi uçun tuzilgan va har bir javob simulyatsiyada tekşirilgan.
