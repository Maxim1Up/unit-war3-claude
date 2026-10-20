import { expect, mock, test } from 'claude-code/testing'

const PANE = {
  component: 'Pane',
  requestId: 'unit',
  props: {
    title: 'Unit War3 Claude',
    isFocused: false,
    bodyColumns: 60,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 30 },
    view: {},
  },
} as const

test('the pane shows the saved worker and switching it is kept in the store', async ($, on) => {
  mock.store(on, { worker: 'peasant', muted: true })

  const texts = async (ui: { findAll: (q: { type?: string }) => Promise<{ text: string }[]> }) =>
    (await ui.findAll({ type: 'Text' })).map(one => one.text).join(' | ')

  for (const surface of ['desktop', 'terminal'] as const) {
    const ui = await $.ui.mount({ plugin: 'unit-war3-claude', surface, ...PANE })
    expect(await texts(ui)).toMatch(/Я готов/)
    expect((await ui.find({ key: 'mute' }))?.text).toContain('выкл')
    await ui.unmount()
  }

  const ui = await $.ui.mount({ plugin: 'unit-war3-claude', surface: 'desktop', ...PANE })
  expect((await ui.find({ key: 'peasant' }))?.text).toContain('●')
  await ui.press({ key: 'peon' })
  expect((await ui.find({ key: 'peon' }))?.text).toContain('●')
  expect((await ui.find({ key: 'peasant' }))?.text).toContain('○')
  expect(await texts(ui)).toMatch(/Готов вкалывать|Чего хочешь|Угу|Да\?|Чё надо|Чегооо|Не мешай|Нет времени/)
  await ui.unmount()
})

test('the undead acolyte is a third choice with its own labels', async ($, on) => {
  mock.store(on, { worker: 'acolyte' })
  const ui = await $.ui.mount({ plugin: 'unit-war3-claude', surface: 'desktop', ...PANE })
  expect((await ui.findAll({ type: 'Text' })).map(one => one.text).join(' | ')).toMatch(/Дела не ждут/)
  expect((await ui.find({ key: 'acolyte' }))?.text).toContain('●')
  await ui.press({ key: 'peasant' })
  expect((await ui.find({ key: 'acolyte' }))?.text).toContain('○')
  expect((await ui.find({ key: 'peasant' }))?.text).toContain('●')
  await ui.unmount()
})

test('with random on, a new session starts with a worker other than the last one', async ($, on) => {
  mock.store(on, { worker: 'peon', random: true })
  const ui = await $.ui.mount({ plugin: 'unit-war3-claude', surface: 'desktop', ...PANE })
  expect((await ui.find({ key: 'random' }))?.text).toContain('☑')
  await ui.press({ key: 'poke' })
  expect((await ui.find({ key: 'peon' }))?.text).toContain('○')
  const picked = [(await ui.find({ key: 'peasant' }))?.text, (await ui.find({ key: 'acolyte' }))?.text].join(' ')
  expect(picked).toContain('●')
  await ui.press({ key: 'random' })
  expect((await ui.find({ key: 'random' }))?.text).toContain('☐')
  await ui.unmount()
})

test('switching off for the session leaves only a way back, and switching on restores the pane', async ($, on) => {
  mock.store(on, {})
  for (const surface of ['desktop', 'terminal'] as const) {
    const ui = await $.ui.mount({ plugin: 'unit-war3-claude', surface, ...PANE })
    await ui.press({ key: 'off' })
    expect(await ui.find({ key: 'on' })).toBeDefined()
    expect(await ui.find({ key: 'poke' })).toBeUndefined()
    await ui.press({ key: 'on' })
    expect(await ui.find({ key: 'poke' })).toBeDefined()
    await ui.unmount()
  }
})

test('a pane on the desktop carries the portrait as an Svg and the mute button toggles', async ($, on) => {
  mock.store(on, {})
  const ui = await $.ui.mount({ plugin: 'unit-war3-claude', surface: 'desktop', ...PANE })
  expect(await ui.find({ type: 'Svg' })).toBeDefined()
  expect((await ui.find({ key: 'mute' }))?.text).toContain('вкл.')
  await ui.press({ key: 'mute' })
  expect((await ui.find({ key: 'mute' }))?.text).toContain('выкл')
  await ui.unmount()
})
