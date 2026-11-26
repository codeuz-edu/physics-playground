---
title: Formulalar
description: "Maktab fizikasining 18 bobi böyiça formulalar va qisqa konspekt, har bir bobning simulyatsiyalariga havola bilan."
prev: false
next: false
---

<!--
Formulas are TeX, typeset with MathJax when the site is built: $…$ inside a line, $$…$$ on lines of their own.
Decimal comma in TeX: 9{,}81. Inside formulas write | as \vert, < as \lt and > as \gt (a bare | would split the table cell).
Each chapter heading keeps the course.json slug as its anchor ({#kinematics}); the glossary and scientists pages link to it.
-->

# Formulalar

## Mexanika

### 1. Kinematika {#kinematics}

[Simulyatsiyalarni oçiş →](/sims/motion-1d)

Kinematika harakatni uning sabablariga töxtalmasdan tavsiflaydi. Asosiy kattaliklar: koordinata, köçiş, tezlik va tezlaniş. Tekis va tekis tezlanuvçan harakat, erkin tuşiş, gorizontga burçak ostida otiş va aylana böylab harakat şu bobda örganiladi.

| Nomi | Formula | Izoh |
| --- | --- | --- |
| Tekis harakat | $x = x_0 + \upsilon t$ | $x_0$ — boşlanğiç koordinata, $\upsilon$ — tezlik, $t$ — vaqt |
| Tekis tezlanuvçan harakat tezligi | $\upsilon = \upsilon_0 + a t$ | $\upsilon_0$ — boşlanğiç tezlik, $a$ — tezlaniş |
| Tekis tezlanuvçan harakat koordinatasi | $x = x_0 + \upsilon_0 t + \dfrac{a t^2}{2}$ | $a$ — tezlaniş |
| Vaqtsiz formula | $\upsilon^2 - \upsilon_0^2 = 2 a s$ | $s$ — köçiş |
| Erkin tuşiş | $h = \dfrac{g t^2}{2},\quad \upsilon = g t$ | $g \approx 9{,}81$ m/s² — erkin tuşiş tezlanişi |
| Uçiş uzoqligi | $L = \dfrac{\upsilon_0^2 \sin 2\alpha}{g}$ | $\alpha$ — otiş burçagi (bir xil balandlikka tuşganda) |
| Kötariliş balandligi | $H = \dfrac{\upsilon_0^2 \sin^2\alpha}{2g}$ | eng katta balandlik |
| Uçiş vaqti | $t = \dfrac{2\upsilon_0 \sin\alpha}{g}$ | bir xil balandlikka tuşganda |
| Aylana böylab tekis harakat | $\upsilon = \omega R = \dfrac{2\pi R}{T}$ | $\omega$ — burçak tezlik, $R$ — radius, $T$ — davr |
| Markazga intilma tezlaniş | $a_c = \dfrac{\upsilon^2}{R} = \omega^2 R$ | markazga yönalgan |
| Tezliklarni qöşiş | $\vec\upsilon = \vec\upsilon_1 + \vec\upsilon_2$ | $\vec\upsilon_1$ — jismning sanoq sistemasiga nisbatan tezligi, $\vec\upsilon_2$ — sistemaning özi |

### 2. Dinamika {#dynamics}

[Simulyatsiyalarni oçiş →](/sims/push-box)

Dinamika harakatning sababini, yaʼni kuçlarni örganadi. Nyutonning uç qonuni, işqalaniş, elastiklik va butun olam tortiş kuçlari, vazn va vaznsizlik, sunʼiy yöldoşlar va sayyoralar harakati şu bobga kiradi.

| Nomi | Formula | Izoh |
| --- | --- | --- |
| Nyutonning birinçi qonuni | $\sum \vec F = 0 \;\Rightarrow\; \vec\upsilon = \text{const}$ | inersiya qonuni |
| Nyutonning ikkinçi qonuni | $\vec F = m\vec a$ | $m$ — massa, $\vec a$ — tezlaniş |
| Nyutonning uçinçi qonuni | $\vec F_{12} = -\vec F_{21}$ | taʼsir aksiltaʼsirga teng |
| Oğirlik kuçi | $F = m g$ | Yer sirti yaqinida |
| Işqalaniş kuçi | $F_{\text{iş}} = \mu N$ | $\mu$ — işqalaniş koeffitsiyenti, $N$ — tayançning reaksiya kuçi |
| Guk qonuni | $F = -k x$ | $k$ — bikrlik, $x$ — deformatsiya |
| Butun olam tortiş qonuni | $F = G\dfrac{m_1 m_2}{r^2}$ | $G$ — gravitatsiya doimiysi |
| Birinçi kosmik tezlik | $\upsilon_1 = \sqrt{\dfrac{GM}{R}} = \sqrt{gR}$ | Yer uçun ≈ 7,9 km/s |
| Tezlanuvçan liftdagi vazn | $P = m(g + a)$ | $a$ yuqoriga yönalganda musbat |
| Qiya tekislikdagi tezlaniş | $a = g(\sin\alpha - \mu\cos\alpha)$ | $\alpha$ — qiyalik burçagi |
| Keplerning uçinçi qonuni | $\dfrac{T_1^2}{T_2^2} = \dfrac{a_1^3}{a_2^3}$ | $a$ — orbitaning katta yarim öqi |
| Aylanma harakat dinamikasi | $M = I\varepsilon$ | $I$ — inersiya momenti, $\varepsilon$ — burçak tezlaniş |

### 3. Statika {#statics}

[Simulyatsiyalarni oçiş →](/sims/lever)

Statika jismlarning muvozanat şartlarini örganadi. Kuçlar yiğindisi va kuç momentlari yiğindisi nolga teng bölsa, jism muvozanatda turadi. Riçag, blok va massa markazi şu qonunlarga asoslanadi.

| Nomi | Formula | Izoh |
| --- | --- | --- |
| Ilgarilanma muvozanat şarti | $\sum \vec F = 0$ | kuçlarning vektor yiğindisi |
| Aylanma muvozanat şarti | $\sum M = 0$ | soat millari böyiça va unga qarşi momentlar teng |
| Kuç momenti | $M = F d$ | $d$ — kuç yelkasi |
| Riçag qoidasi | $F_1 d_1 = F_2 d_2$ | kuçdan yutsak, yöldan yutqazamiz |
| Massa markazi | $x_c = \dfrac{m_1 x_1 + m_2 x_2 + \dots}{m_1 + m_2 + \dots}$ | $x_i$ — har bir jismning koordinatasi |
| Harakatçan blok | $F = \dfrac{m g}{2}$ | kuçdan 2 marta yutuq |
| Polispast | $F = \dfrac{m g}{n}$ | $n$ — yukni tutib turgan arqon tarmoqlari soni |

### 4. Saqlaniş qonunlari {#conservation-laws}

[Simulyatsiyalarni oçiş →](/sims/work-power)

Yopiq sistemada impuls va töla mexanik energiya saqlanadi. Iş, quvvat, FIK, kinetik va potensial energiya, töqnaşuvlar va reaktiv harakat şu qonunlar yordamida hisoblanadi.

| Nomi | Formula | Izoh |
| --- | --- | --- |
| Impuls | $\vec p = m\vec\upsilon$ | kg·m/s |
| Kuç impulsi | $\vec F\,\Delta t = \Delta\vec p$ | Nyuton qonunining impuls körinişi |
| Impulsning saqlaniş qonuni | $m_1\vec\upsilon_1 + m_2\vec\upsilon_2 = m_1\vec\upsilon_1' + m_2\vec\upsilon_2'$ | yopiq sistema uçun |
| Mexanik iş | $A = F s \cos\alpha$ | $\alpha$ — kuç va köçiş orasidagi burçak |
| Quvvat | $N = \dfrac{A}{t} = F\upsilon$ | W (vatt); quvvat $N$ yoki $P$ bilan belgilanadi |
| Foydali iş koeffitsiyenti | $\eta = \dfrac{A_f}{A_t}\cdot 100\%$ | $A_f$ — foydali, $A_t$ — töla iş |
| Kinetik energiya | $E_k = \dfrac{m\upsilon^2}{2}$ | harakat energiyasi |
| Oğirlik kuçi potensial energiyasi | $E_p = m g h$ | $h$ — balandlik |
| Prujina potensial energiyasi | $E_p = \dfrac{k x^2}{2}$ | $x$ — deformatsiya |
| Energiyaning saqlaniş qonuni | $E_k + E_p = \text{const}$ | işqalaniş bölmaganda |
| Kinetik energiya haqidagi teorema | $A = E_{k2} - E_{k1}$ | barça kuçlar işi |
| Reaktiv harakat (Siolkovskiy) | $\upsilon = u \ln\dfrac{m_0}{m}$ | $u$ — gaz oqimi tezligi, $m_0$ — boşlanğiç massa |

### 5. Suyuqliklar mexanikasi {#fluid-mechanics}

[Simulyatsiyalarni oçiş →](/sims/fluid-pressure)

Suyuqlik va gazlarning bosimi, Paskal va Arximed qonunlari, jismlarning suzişi va oqim tezligi bilan bosim orasidagi Bernulli boğlanişi şu bobda örganiladi.

| Nomi | Formula | Izoh |
| --- | --- | --- |
| Bosim | $p = \dfrac{F}{S}$ | Pa = N/m² |
| Gidrostatik bosim | $p = \rho g h$ | $\rho$ — suyuqlik ziçligi, $h$ — çuqurlik |
| Gidravlik press | $\dfrac{F_1}{S_1} = \dfrac{F_2}{S_2}$ | Paskal qonuni |
| Arximed kuçi | $F_A = \rho_s g V$ | $\rho_s$ — suyuqlik ziçligi, $V$ — botgan qism hajmi |
| Suziş şarti | $\rho_j \lt \rho_s$ | jism ziçligi suyuqliknikidan kiçik |
| Uzluksizlik tenglamasi | $S_1\upsilon_1 = S_2\upsilon_2$ | tor joyda oqim tezroq |
| Bernulli tenglamasi | $p + \dfrac{\rho\upsilon^2}{2} + \rho g h = \text{const}$ | ideal suyuqlik oqimi |
| Torriçelli formulasi | $\upsilon = \sqrt{2 g h}$ | teşikdan oqib çiqiş tezligi |

### 6. Tebranişlar {#oscillations}

[Simulyatsiyalarni oçiş →](/sims/pendulum)

Takrorlanuvçi harakatlar: matematik va prujinali mayatniklar, garmonik tebranişlar, ularning davri, çastotasi va energiyasi, söniş va rezonans.

| Nomi | Formula | Izoh |
| --- | --- | --- |
| Garmonik tebraniş | $x = A\cos(\omega t + \varphi_0)$ | $A$ — amplituda, $\varphi_0$ — boşlanğiç faza |
| Çastota va siklik çastota | $\nu = \dfrac{1}{T},\quad \omega = 2\pi\nu$ | Hz |
| Matematik mayatnik davri | $T = 2\pi\sqrt{\dfrac{l}{g}}$ | $l$ — ip uzunligi |
| Prujinali mayatnik davri | $T = 2\pi\sqrt{\dfrac{m}{k}}$ | $k$ — prujina bikrligi |
| Tebraniş energiyasi | $E = \dfrac{k A^2}{2} = \dfrac{m\upsilon_{max}^2}{2}$ | söniş bölmaganda |
| Maksimal tezlik va tezlaniş | $\upsilon_{max} = A\omega,\quad a_{max} = A\omega^2$ | muvozanat nuqtasida tezlik eng katta |

## Molekulyar fizika va termodinamika

### 7. Molekulyar fizika {#molecular-physics}

[Simulyatsiyalarni oçiş →](/sims/gas-laws)

Modda zarralardan tuzilgan va ular uzluksiz tartibsiz harakatda. Molekulyar-kinetik nazariya gaz bosimini molekulalar harakati bilan tuşuntiradi; ideal gaz holat tenglamasi va izojarayonlar, namlik, sirt taranglik va qattiq jismlar xossalari şu bobda.

| Nomi | Formula | Izoh |
| --- | --- | --- |
| Modda miqdori | $\nu = \dfrac{m}{M} = \dfrac{N}{N_A}$ | $M$ — molyar massa, $N_A$ — Avogadro soni |
| Bitta molekula massasi | $m_0 = \dfrac{M}{N_A}$ | kg |
| MKN asosiy tenglamasi | $p = \dfrac{1}{3} m_0 n \overline{\upsilon^2} = \dfrac{2}{3} n \bar E_k$ | $n$ — molekulalar konsentratsiyasi |
| Örtaça kinetik energiya | $\bar E_k = \dfrac{3}{2} k T$ | $k$ — Bolsman doimiysi, $T$ — absolyut temperatura |
| Bosim va temperatura | $p = n k T$ | ideal gaz |
| Örtaça kvadratik tezlik | $\upsilon = \sqrt{\dfrac{3RT}{M}}$ | $R$ — universal gaz doimiysi |
| Klapeyron–Mendeleyev tenglamasi | $pV = \dfrac{m}{M} R T$ | ideal gaz holat tenglamasi |
| Izotermik jarayon (Boyl–Mariott) | $pV = \text{const}$ | $T = \text{const}$ |
| Izobarik jarayon (Gey-Lyussak) | $\dfrac{V}{T} = \text{const}$ | $p = \text{const}$ |
| Izoxorik jarayon (Şarl) | $\dfrac{p}{T} = \text{const}$ | $V = \text{const}$ |
| Absolyut temperatura | $T = t + 273{,}15$ | K va °C; masalalarda köpinça $T = t + 273$ |
| Nisbiy namlik | $\varphi = \dfrac{p}{p_0}\cdot 100\%$ | $p_0$ — töyingan buğ bosimi |
| Sirt taranglik kuçi | $F = \sigma l$ | $\sigma$ — sirt taranglik koeffitsiyenti |
| Kapillyarda kötariliş | $h = \dfrac{2\sigma}{\rho g r}$ | $r$ — kapillyar radiusi |
| Mexanik kuçlaniş (Guk qonuni) | $\sigma = E\,\varepsilon,\quad \varepsilon = \dfrac{\Delta l}{l_0}$ | $E$ — Yung moduli |

### 8. Termodinamika {#thermodynamics}

[Simulyatsiyalarni oçiş →](/sims/heat-balance)

Termodinamika issiqlik va iş orasidagi boğlanişni örganadi. Içki energiya, issiqlik miqdori, agregat holat özgarişlari, termodinamikaning birinçi va ikkinçi qonunlari hamda issiqlik maşinalarining FIK şu bobda.

| Nomi | Formula | Izoh |
| --- | --- | --- |
| Isitiş uçun issiqlik | $Q = c m \Delta t$ | $c$ — soliştirma issiqlik siğimi |
| Eriş issiqligi | $Q = \lambda m$ | $\lambda$ — soliştirma eriş issiqligi |
| Buğlaniş issiqligi | $Q = L m$ | $L$ — soliştirma buğlaniş issiqligi |
| Yoqilği yoniş issiqligi | $Q = q m$ | $q$ — soliştirma yoniş issiqligi |
| Issiqlik balansi tenglamasi | $Q_1 + Q_2 + \dots + Q_n = 0$ | berilgan issiqlik — manfiy, olingani — musbat |
| Bir atomli ideal gaz içki energiyasi | $U = \dfrac{3}{2}\dfrac{m}{M} R T$ | faqat temperaturaga boğliq |
| Gaz işi | $A = p\,\Delta V$ | izobarik kengayişda |
| Termodinamikaning birinçi qonuni | $Q = \Delta U + A$ | gazga berilgan issiqlik |
| Adiabatik jarayon | $Q = 0,\quad A = -\Delta U$ | issiqlik almaşinuvisiz |
| Issiqlik maşinasi FIK | $\eta = \dfrac{Q_1 - Q_2}{Q_1}$ | $Q_1$ — isitkiçdan olingan, $Q_2$ — sovutkiçga berilgan |
| Karno sikli FIK | $\eta_{max} = \dfrac{T_1 - T_2}{T_1}$ | eng katta mumkin bölgan FIK |

## Elektrodinamika

### 9. Elektrostatika {#electrostatics}

[Simulyatsiyalarni oçiş →](/sims/coulomb)

Tinç turgan zaryadlarning özaro taʼsiri va elektr maydoni. Kulon qonuni, maydon kuçlanganligi, potensial, kuçlaniş, ötkazgiç va dielektriklar, kondensatorlar va ularning energiyasi.

| Nomi | Formula | Izoh |
| --- | --- | --- |
| Zaryadning saqlaniş qonuni | $q_1 + q_2 + \dots = \text{const}$ | yopiq sistema |
| Kulon qonuni | $F = k\dfrac{\vert q_1\vert\vert q_2\vert}{\varepsilon r^2}$ | $k = k_e \approx 9\cdot10^9$ N·m²/C², $\varepsilon$ — dielektrik singdiruvçanlik |
| Maydon kuçlanganligi | $\vec E = \dfrac{\vec F}{q}$ | V/m |
| Nuqtaviy zaryad maydoni | $E = k\dfrac{q}{\varepsilon r^2}$ | $r$ — zaryadgaça masofa |
| Nuqtaviy zaryad potensiali | $\varphi = k\dfrac{q}{\varepsilon r}$ | V |
| Kuçlaniş | $U = \varphi_1 - \varphi_2 = \dfrac{A}{q}$ | maydon işi orqali |
| Bir jinsli maydon | $U = E d$ | $d$ — kuç çiziqlari böyiça masofa |
| Elektr siğim | $C = \dfrac{q}{U}$ | F (farad) |
| Yassi kondensator siğimi | $C = \dfrac{\varepsilon\varepsilon_0 S}{d}$ | $S$ — qoplama yuzasi, $d$ — oraliq |
| Parallel ulaş | $C = C_1 + C_2 + \dots$ | siğimlar qöşiladi |
| Ketma-ket ulaş | $\dfrac{1}{C} = \dfrac{1}{C_1} + \dfrac{1}{C_2} + \dots$ | umumiy siğim kamayadi |
| Kondensator energiyasi | $W = \dfrac{C U^2}{2} = \dfrac{q^2}{2C}$ | J |

### 10. Özgarmas tok {#direct-current}

[Simulyatsiyalarni oçiş →](/sims/ohm)

Zaryadlarning tartibli harakati — elektr toki. Om qonuni, ötkazgiçlarni ulaş usullari, EYK va töla zanjir, tokning işi, quvvati va issiqlik taʼsiri, turli muhitlarda elektr toki.

| Nomi | Formula | Izoh |
| --- | --- | --- |
| Tok kuçi | $I = \dfrac{q}{t}$ | A (amper) |
| Zanjir qismi uçun Om qonuni | $I = \dfrac{U}{R}$ | $R$ — qarşilik |
| Ötkazgiç qarşiligi | $R = \rho\dfrac{l}{S}$ | $\rho$ — soliştirma qarşilik |
| Qarşilikning temperaturaga boğliqligi | $R = R_0(1 + \alpha t)$ | $\alpha$ — temperatura koeffitsiyenti |
| Ketma-ket ulaş | $R = R_1 + R_2,\quad I = \text{const}$ | kuçlanişlar qöşiladi |
| Parallel ulaş | $\dfrac{1}{R} = \dfrac{1}{R_1} + \dfrac{1}{R_2},\quad U = \text{const}$ | toklar qöşiladi |
| Töla zanjir uçun Om qonuni | $I = \dfrac{\mathcal{E}}{R + r}$ | $\mathcal{E}$ — EYK, $r$ — içki qarşilik |
| Tokning işi va quvvati | $A = I U t,\quad P = I U = I^2 R$ | J va W; $P$ — quvvat (mexanikada $N$) |
| Joul–Lens qonuni | $Q = I^2 R t$ | ajralgan issiqlik |
| Elektroliz (Faradey qonuni) | $m = k I t$ | $k$ — elektrokimyoviy ekvivalent |

### 11. Magnetizm va elektromagnit induksiya {#magnetism}

[Simulyatsiyalarni oçiş →](/sims/lorentz)

Tok va magnit maydon: Amper va Lorens kuçlari, magnit oqimi, Faradeyning elektromagnit induksiya qonuni, Lens qoidasi, öz-özidan induksiya va magnit maydon energiyasi.

| Nomi | Formula | Izoh |
| --- | --- | --- |
| Amper kuçi | $F = B I l \sin\alpha$ | $B$ — magnit induksiya, $l$ — ötkazgiç uzunligi |
| Lorens kuçi | $F = q B \upsilon \sin\alpha$ | harakatdagi zaryadga |
| Zarraning aylana radiusi | $r = \dfrac{m\upsilon}{qB}$ | bir jinsli maydonda |
| Töğri tokning magnit maydoni | $B = \dfrac{\mu_0 I}{2\pi r}$ | $\mu_0$ — magnit doimiy |
| Solenoid maydoni | $B = \mu_0 \dfrac{N I}{l}$ | $N$ — öramlar soni |
| Magnit oqimi | $\Phi = B S \cos\alpha$ | Wb (veber) |
| Faradey induksiya qonuni | $\mathcal{E}_i = -\dfrac{\Delta\Phi}{\Delta t}$ | minus — Lens qoidasi |
| Harakatlanuvçi ötkazgiçdagi EYK | $\mathcal{E} = B\upsilon l \sin\alpha$ | $\upsilon$ — ötkazgiç tezligi |
| Öz-özidan induksiya EYK | $\mathcal{E}_{\text{ö}} = -L\dfrac{\Delta I}{\Delta t}$ | $L$ — induktivlik |
| Magnit maydon energiyasi | $W = \dfrac{L I^2}{2}$ | ğaltak energiyasi |

### 12. Özgaruvçan tok {#alternating-current}

[Simulyatsiyalarni oçiş →](/sims/ac-generator)

Davriy özgaradigan tok va kuçlaniş. Elektromagnit tebranişlar, tebraniş konturi, aktiv, induktiv va siğim qarşiliklar, effektiv qiymatlar, transformator va elektr energiyasini uzatiş.

| Nomi | Formula | Izoh |
| --- | --- | --- |
| Oniy qiymat | $i = I_m \sin\omega t$ | $I_m$ — amplituda |
| Effektiv qiymat | $I = \dfrac{I_m}{\sqrt{2}},\quad U = \dfrac{U_m}{\sqrt{2}}$ | ampermetr va voltmetr körsatadi |
| Induktiv qarşilik | $X_L = \omega L$ | Ω |
| Siğim qarşilik | $X_C = \dfrac{1}{\omega C}$ | Ω |
| Töla qarşilik | $Z = \sqrt{R^2 + (X_L - X_C)^2}$ | ketma-ket RLC zanjir |
| Tomson formulasi | $T = 2\pi\sqrt{L C}$ | tebraniş konturi davri |
| Özgaruvçan tok quvvati | $P = I U \cos\varphi$ | $\cos\varphi$ — quvvat koeffitsiyenti |
| Transformator | $\dfrac{U_1}{U_2} = \dfrac{N_1}{N_2} = k$ | $k$ — transformatsiya koeffitsiyenti |

## Tölqinlar va optika

### 13. Tölqinlar va tovuş {#waves-and-sound}

[Simulyatsiyalarni oçiş →](/sims/wave)

Tebranişlarning fazoda tarqaliş jarayoni — tölqin. Köndalang va böylama tölqinlar, tölqin uzunligi, tovuş va uning xarakteristikalari, Dopler effekti, turğun tölqinlar va elektromagnit tölqinlar.

| Nomi | Formula | Izoh |
| --- | --- | --- |
| Tölqin uzunligi | $\lambda = \upsilon T = \dfrac{\upsilon}{\nu}$ | $\upsilon$ — tarqaliş tezligi |
| Tölqin tenglamasi | $y = A\cos\omega\left(t - \dfrac{x}{\upsilon}\right)$ | yuguruvçi tölqin |
| Tordagi tölqin tezligi | $\upsilon = \sqrt{\dfrac{F}{\mu}}$ | $F$ — torning taranglik kuçi, $\mu$ — çiziqli ziçlik (bir metr torning massasi) |
| Torli turğun tölqin | $\lambda_n = \dfrac{2l}{n}$ | $l$ — tor uzunligi, $n = 1, 2, 3\dots$ |
| Tovuş intensivligi sathi | $L = 10 \lg\dfrac{I}{I_0}$ | dB, $I_0 = 10^{-12}$ W/m² |
| Dopler effekti | $\nu = \nu_0\dfrac{\upsilon \pm \upsilon_k}{\upsilon \mp \upsilon_m}$ | $\upsilon$ — tovuş tezligi, $\upsilon_k$ — kuzatuvçi, $\upsilon_m$ — manba tezligi; yuqori işoralar yaqinlaşişga, pastkilari uzoqlaşişga tegişli |
| Elektromagnit tölqin | $c = \lambda\nu$ | $c$ — yoruğlik tezligi |

### 14. Geometrik optika {#geometric-optics}

[Simulyatsiyalarni oçiş →](/sims/refraction)

Yoruğlik nuri töğri çiziq böylab tarqaladi. Qaytiş va sindiriş qonunlari, töla içki qaytiş, linzalar, tasvir yasaş, köz va optik asboblar şu bobda.

| Nomi | Formula | Izoh |
| --- | --- | --- |
| Qaytiş qonuni | $\alpha = \beta$ | tuşiş burçagi qaytiş burçagiga teng |
| Sindiriş qonuni | $n_1\sin\alpha = n_2\sin\gamma$ | $\gamma$ — sindiriş burçagi |
| Absolyut sindiriş körsatkiçi | $n = \dfrac{c}{\upsilon}$ | $\upsilon$ — muhitdagi yoruğlik tezligi |
| Töla içki qaytiş | $\sin\alpha_0 = \dfrac{n_2}{n_1}$ | $n_1 \gt n_2$ |
| Yupqa linza formulasi | $\dfrac{1}{F} = \dfrac{1}{d} + \dfrac{1}{f}$ | $d$ — buyumgaça, $f$ — tasvirgaça masofa |
| Optik kuç | $D = \dfrac{1}{F}$ | dptr (dioptriya) |
| Kattalaştiriş | $\Gamma = \dfrac{H}{h} = \dfrac{f}{d}$ | tasvir va buyum ölçamlari nisbati |

### 15. Tölqin optikasi {#wave-optics}

[Simulyatsiyalarni oçiş →](/sims/young)

Yoruğlikning tölqin xossalari: interferensiya, difraksiya, dispersiya va qutblaniş. Yung tajribasi, difraksion panjara va yupqa pardalar şu bobda.

| Nomi | Formula | Izoh |
| --- | --- | --- |
| Interferensiya maksimumi | $\Delta = k\lambda$ | $\Delta$ — yöllar farqi, $k = 0, 1, 2\dots$ |
| Interferensiya minimumi | $\Delta = (2k + 1)\dfrac{\lambda}{2}$ | tölqinlar söndiradi |
| Yung tajribasi | $\Delta x = \dfrac{\lambda L}{d}$ | yoruğ yöllar orasidagi masofa |
| Difraksion panjara | $d\sin\varphi = k\lambda$ | $d$ — panjara davri |
| Malyus qonuni | $I = I_0\cos^2\varphi$ | qutblagiçdan ötgan yoruğlik |
| Bryuster qonuni | $\operatorname{tg}\alpha_B = n$ | qaytgan nur töla qutblanadi |

## Zamonaviy fizika

### 16. Nisbiylik nazariyasi va kvant fizikasi {#relativity-and-quantum}

[Simulyatsiyalarni oçiş →](/sims/photoeffect)

Katta tezliklar va mikroolam fizikasi. Maxsus nisbiylik nazariyasi postulatlari, vaqt sekinlaşi, massa va energiya ekvivalentligi; foton, fotoeffekt, korpuskulyar-tölqin dualizm va noaniqlik prinsipi.

| Nomi | Formula | Izoh |
| --- | --- | --- |
| Vaqtning sekinlaşi | $\Delta t = \dfrac{\Delta t_0}{\sqrt{1 - \upsilon^2/c^2}}$ | $\Delta t_0$ — xususiy vaqt |
| Uzunlikning qisqarişi | $l = l_0\sqrt{1 - \upsilon^2/c^2}$ | harakat yönalişida |
| Massa va energiya | $E = m c^2$ | tinçlikdagi energiya |
| Relyativistik tezliklarni qöşiş | $\upsilon = \dfrac{\upsilon_1 + \upsilon_2}{1 + \upsilon_1\upsilon_2/c^2}$ | $c$ dan oşmaydi |
| Foton energiyasi | $E = h\nu = \dfrac{hc}{\lambda}$ | $h$ — Plank doimiysi |
| Foton impulsi | $p = \dfrac{h}{\lambda}$ | kg·m/s |
| Fotoeffekt uçun Eynşteyn tenglamasi | $h\nu = A_{\text{ç}} + \dfrac{m\upsilon^2}{2}$ | $A_{\text{ç}}$ — çiqiş işi |
| Fotoeffektning qizil çegarasi | $\nu_{min} = \dfrac{A_{\text{ç}}}{h}$ | bundan past çastotada fotoeffekt yöq |
| De Broyl tölqin uzunligi | $\lambda = \dfrac{h}{m\upsilon}$ | zarraning tölqin xossasi |
| Geyzenberg noaniqlik prinsipi | $\Delta x\,\Delta p \ge \dfrac{\hbar}{2}$ | $\hbar = h/2\pi$ |

### 17. Atom va yadro fizikasi {#atomic-and-nuclear}

[Simulyatsiyalarni oçiş →](/sims/rutherford)

Atom tuzilişi va yadro jarayonlari. Rezerford tajribasi, Bor postulatlari, spektrlar, yadro tarkibi, boğlaniş energiyasi, radioaktivlik, yadro reaksiyalari va nurlanişdan himoya.

| Nomi | Formula | Izoh |
| --- | --- | --- |
| Borning ikkinçi postulati | $h\nu = E_k - E_n$ | atom foton çiqaradi yoki yutadi |
| Vodorod atomi energiya sathlari | $E_n = -\dfrac{13{,}6\ \text{eV}}{n^2}$ | $n$ — boş kvant soni |
| Ridberg formulasi | $\dfrac{1}{\lambda} = R_\infty\left(\dfrac{1}{n^2} - \dfrac{1}{k^2}\right)$ | $R_\infty$ — Ridberg doimiysi |
| Yadro tarkibi | $A = Z + N$ | $Z$ — protonlar, $N$ — neytronlar soni |
| Massa defekti | $\Delta m = Z m_p + N m_n - M_{\text{ya}}$ | $M_{\text{ya}}$ — yadro massasi |
| Boğlaniş energiyasi | $E_b = \Delta m\, c^2$ | 1 a.m.b. ≈ 931,5 MeV |
| Radioaktiv yemiriliş qonuni | $N = N_0\, 2^{-t/T}$ | $T$ — yarim yemiriliş davri |
| Aktivlik | $A = \lambda N,\quad \lambda = \dfrac{\ln 2}{T}$ | Bq (bekkerel) |
| Yutilgan doza | $D = \dfrac{E}{m}$ | Gy (grey) |

### 18. Astrofizika {#astrophysics}

[Simulyatsiyalarni oçiş →](/sims/cosmic)

Osmon jismlarining fizikasi. Quyoş sistemasi, yulduzlarning yorqinligi, temperaturasi va evolyutsiyasi, galaktikalar, koinotning kengayişi va qora tuynuklar.

| Nomi | Formula | Izoh |
| --- | --- | --- |
| Keplerning uçinçi qonuni (umumiy) | $\dfrac{T^2}{a^3} = \dfrac{4\pi^2}{G M}$ | $M$ — markaziy jism massasi |
| Ikkinçi kosmik tezlik | $\upsilon_2 = \sqrt{\dfrac{2GM}{R}}$ | Yer uçun ≈ 11,2 km/s |
| Vin siljiş qonuni | $\lambda_{max} T = b$ | yulduz rangi temperaturasini körsatadi |
| Stefan–Bolsman qonuni | $L = 4\pi R^2 \sigma T^4$ | $L$ — yulduz yorqinligi (quvvati) |
| Parallaks orqali masofa | $r = \dfrac{1}{p}$ | $r$ — parsekda, $p$ — yoy sekundlarida |
| Habbl qonuni | $\upsilon = H_0\, r$ | galaktikalar uzoqlaşiş tezligi |
| Gravitatsion radius | $R_g = \dfrac{2 G M}{c^2}$ | qora tuynuk çegarasi |
