// Uzbek text of the free-fall simulation. Joined with index.js by sims/load.js.
// The label of `g` comes from the shared dictionary (src/text/uz.js).
export default {
  params: {
    h0: 'Boşlanğiç balandlik',
    v0: 'Boşlanğiç tezlik (+ yuqoriga)',
    k: 'Havoning qarşiligi koeffitsiyenti',
  },
  toggles: {
    vel: 'Tezlik vektori (υ)',
    acc: 'Tezlaniş vektori (a)',
    snap: 'Teng vaqt oraliqlaridagi vaziyati',
  },
  readouts: {
    y: 'Balandlik',
    v: 'Tezlik',
    a: 'Tezlaniş',
  },
  graphs: {
    y: { title: 'Balandlik', yLabel: 'y', series: { y: 'y' } },
    v: { title: 'Tezlik', yLabel: 'υ', series: { v: 'υ' } },
    a: { title: 'Tezlaniş', yLabel: 'a', series: { a: 'a' } },
  },
  presets: [
    'Yerda 20 m balandlikdan',
    'Oyda xuddi şu balandlikdan',
    'Marsda xuddi şu balandlikdan',
    'Yer sirtidan vertikal yuqoriga otiş',
    '30 m baland tomdan yuqoriga otiş',
    '30 m baland tomdan pastga otiş',
    'Havoning qarşiligi bilan 100 m dan tuşiş',
  ],
  dragHint: 'Boşlanğiç balandlikni tanlaş uçun koptokni yuqoriga yoki pastga suring.',
  msg: {
    timeUp: (tMax) => `Simulyatsiya ${tMax} s dan keyin töxtatildi.`,
    onGround: 'Jism yer sirtida turibdi. Boşlanğiç balandlikni oşiring yoki jismni yuqoriga oting.',
    /** `hMax` is the highest point, or null when the ball never rose above its start. */
    landed: (t, speed, hMax) => `Jism t = ${t} s da yerga tuşdi, tezligi ${speed} m/s.${hMax === null ? '' : ` Eng katta balandlik: ${hMax} m.`}`,
  },
  draw: {
    /** Under the snapshots: the time between two of them. */
    snapEvery: (dt) => `har ${dt} s da`,
    highest: (h) => `eng yuqori ${h} m`,
    cue: 'balandlikni tanlaş uçun suring',
  },
};
