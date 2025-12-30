export interface Preset {
  name: string
  desc: string
  code: string
}

export const PRESETS: Preset[] = [
  {
    name: 'Basic Beat',
    desc: 'Simple kick & snare',
    code: `sound("bd sd bd sd")`,
  },
  {
    name: 'Hi-Hat Groove',
    desc: 'Classic drum pattern',
    code: `sound("bd hh sd hh").fast(2)`,
  },
  {
    name: 'Four on Floor',
    desc: 'Dance beat',
    code: `stack(
  sound("bd*4"),
  sound("~ sd").slow(2),
  sound("hh*8").gain(.6)
)`,
  },
  {
    name: 'Melodic',
    desc: 'Simple melody',
    code: `note("c3 e3 g3 b3")
  .sound("sawtooth")
  .lpf(800)
  .decay(.2)`,
  },
  {
    name: 'Bass Line',
    desc: 'Deep bass groove',
    code: `note("c2 ~ e2 ~ g2 ~ e2 ~")
  .sound("sawtooth")
  .lpf(400)
  .gain(.8)`,
  },
  {
    name: 'Ambient Pad',
    desc: 'Dreamy chords',
    code: `note("<c3 e3 g3> <e3 g3 b3>")
  .sound("sine")
  .room(.8)
  .delay(.5)
  .slow(4)`,
  },
  {
    name: 'Breakbeat',
    desc: 'Chopped drums',
    code: `sound("bd hh sd hh bd bd sd hh")
  .fast(2)
  .sometimes(rev)`,
  },
  {
    name: 'Acid Bass',
    desc: '303-style bass',
    code: `note("c2 c2 c3 c2 eb2 c2 c3 c2")
  .sound("sawtooth")
  .lpf(sine.range(200,2000).slow(4))
  .resonance(15)`,
  },
  {
    name: 'Polyrhythm',
    desc: 'Complex rhythms',
    code: `stack(
  sound("bd").slow(3),
  sound("sd").slow(4),
  sound("hh").slow(5)
)`,
  },
  {
    name: 'Glitch',
    desc: 'Random chaos',
    code: `sound("bd sd hh cp")
  .fast(2)
  .sometimes(fast(2))
  .rarely(rev)
  .room(.3)`,
  },
]
