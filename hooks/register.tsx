import { atom, read, update } from 'claude-code'
import type { Register, EngineInterface } from 'claude-code'

import type { PeonState, PeonView, WorkerId } from '../types'

const PANE = 'unit'

type Clip = { file: string; label: string }
type Worker = {
  title: string
  portrait: string
  labels: Record<PeonState, string>
  clips: Record<PeonState, Clip[]>
}

const clip = (worker: WorkerId, name: string, label: string): Clip => ({
  file: `assets/${worker}/sounds/${name}.wav`,
  label,
})

// Voice lines come from the PeonPing peon_ru and peasant_ru packs (see assets/SOURCES.txt).
const WORKERS: Record<WorkerId, Worker> = {
  peon: {
    title: 'Орк-раб',
    portrait: 'assets/peon/portrait.png',
    labels: {
      ready: 'Готов вкалывать',
      working: 'Работаю',
      done: 'Дело сделано',
      attention: 'Жду твоего ответа',
      error: 'Нужна помощь',
      selected: 'Чего хочешь?',
    },
    clips: {
      ready: [clip('peon', 'PeonReady1', 'Готов вкалывать!')],
      working: [
        clip('peon', 'PeonYes1', 'Сделаю.'),
        clip('peon', 'PeonYes2', 'С удовольствием.'),
        clip('peon', 'PeonYes4', 'Хо-ро-шо.'),
        clip('peon', 'PeonYesAttack1', 'Ага.'),
        clip('peon', 'PeonYesAttack3', 'С радостью.'),
        clip('peon', 'PeonWarcry1', 'Почему бы нет?'),
      ],
      done: [clip('peon', 'PeonJobDone', 'Дело сделано!')],
      attention: [
        clip('peon', 'PeonWhat4', 'Чё надо, хозяин?'),
        clip('peon', 'PeonWhat2', 'Да?'),
        clip('peon', 'PeonWhat3', 'Чего хочешь?'),
        clip('peon', 'PeonWhat1', 'Угу.'),
      ],
      error: [clip('peon', 'PeonDeath', 'Угх.')],
      selected: [
        clip('peon', 'PeonWhat1', 'Угу.'),
        clip('peon', 'PeonWhat2', 'Да?'),
        clip('peon', 'PeonWhat3', 'Чего хочешь?'),
        clip('peon', 'PeonWhat4', 'Чё надо, хозяин?'),
        clip('peon', 'PeonPissed1', 'Чегооо?'),
        clip('peon', 'PeonPissed2', 'Не мешай, я занят!'),
        clip('peon', 'PeonPissed3', 'Нет времени.'),
      ],
    },
  },
  peasant: {
    title: 'Крестьянин',
    portrait: 'assets/peasant/portrait.png',
    labels: {
      ready: 'Я готов',
      working: 'Работаю',
      done: 'Дело сделано',
      attention: 'Жду твоего ответа',
      error: 'Нужна помощь',
      selected: 'Да, господин?',
    },
    clips: {
      ready: [clip('peasant', 'PeasantReady1', 'Я готов.')],
      working: [
        clip('peasant', 'PeasantYes1', 'Угу.'),
        clip('peasant', 'PeasantYes2', 'Хорошо.'),
        clip('peasant', 'PeasantWhat3', 'Опять работа?!'),
      ],
      done: [clip('peasant', 'PeasantPissed4', 'Работа не волк, в лес не убежит.')],
      attention: [
        clip('peasant', 'PeasantWhat1', 'Да, господин?'),
        clip('peasant', 'PeasantWhat2', 'Чего?'),
        clip('peasant', 'PeasantWhat3', 'Опять работа?!'),
      ],
      error: [
        clip('peasant', 'PeasantYesAttack1', 'Прощайте.'),
        clip('peasant', 'PeasantYesAttack2', 'Вам меня не жалко?'),
        clip('peasant', 'PeasantYesAttack4', 'Ну вот, меня убьют.'),
      ],
      selected: [
        clip('peasant', 'PeasantWhat1', 'Да, господин?'),
        clip('peasant', 'PeasantPissed1', 'Ты что ли король? А я за тебя не голосовал!'),
        clip('peasant', 'PeasantPissed2', 'Тебя бы так!'),
        clip('peasant', 'PeasantPissed3', 'Помогите! На меня давят!'),
        clip('peasant', 'PeasantPissed4', 'Работа не волк, в лес не убежит.'),
        clip('peasant', 'PeasantPissed5', 'Мы поймали ведьму, можно мы её сожжём?'),
      ],
    },
  },
  acolyte: {
    title: 'Послушник',
    portrait: 'assets/acolyte/portrait.png',
    labels: {
      ready: 'Дела не ждут',
      working: 'Исполняю',
      done: 'Дело сделано',
      attention: 'Жду твоей воли',
      error: 'Нужна помощь',
      selected: 'Что прикажешь, хозяин?',
    },
    clips: {
      ready: [clip('acolyte', 'AcolytePissed8', 'Ступив на путь тьмы, вы обретёте власть над собственной судьбой... страховку и оплаченный отпуск.')],
      working: [
        clip('acolyte', 'AcolyteYes1', 'Исполню с радостью.'),
        clip('acolyte', 'AcolyteYes2', 'Да, повелитель.'),
        clip('acolyte', 'AcolyteYes3', 'Да свершится предначертанное.'),
        clip('acolyte', 'AcolyteYes4', 'Ваша воля исполнится.'),
        clip('acolyte', 'AcolyteWhat1', "Моя жизнь за Нер'зула!"),
        clip('acolyte', 'AcolyteWhat4', 'Где прольётся моя кровь?'),
        clip('acolyte', 'AcolyteYesAttack1', 'Да воцарится смерть!'),
      ],
      done: [clip('acolyte', 'AcolytePissed1', 'Настал час тьмы.')],
      attention: [
        clip('acolyte', 'AcolyteWhat3', 'Чего желает мой повелитель?'),
        clip('acolyte', 'AcolyteWhat2', 'Я жажду служить.'),
        clip('acolyte', 'AcolyteWhat5', 'Склоняюсь перед вашей волей.'),
      ],
      error: [clip('acolyte', 'NecromancerNoGold1', 'Нужно больше золота!')],
      selected: [
        clip('acolyte', 'AcolyteWhat1', "Моя жизнь за Нер'зула!"),
        clip('acolyte', 'AcolyteWhat4', 'Где прольётся моя кровь?'),
        clip('acolyte', 'AcolyteYesAttack1', 'Да воцарится смерть!'),
        clip('acolyte', 'AcolyteYesAttack2', 'Бойтесь тьмы!'),
        clip('acolyte', 'AcolyteYesAttack3', 'Смерть всем живым!'),
        clip('acolyte', 'NecromancerNoFood1', 'Нужно построить зиккурат!'),
        clip('acolyte', 'NecromancerNoGold1', 'Нужно больше золота!'),
        clip('acolyte', 'AcolytePissed1', 'Настал час тьмы.'),
        clip('acolyte', 'AcolytePissed2', 'Смерть очистит этот мир.'),
        clip('acolyte', 'AcolytePissed3', 'Я вижу великую тьму... Тьфу, опять капюшон сполз на глаза.'),
        clip('acolyte', 'AcolytePissed7', 'Откройте страницу 2-4-6.'),
        clip('acolyte', 'AcolytePissed8', 'Ступив на путь тьмы, вы обретёте власть над собственной судьбой... страховку и оплаченный отпуск.'),
      ],
    },
  },
}

const COLORS: Record<PeonState, string> = {
  ready: '#7A9B4B',
  working: '#D6B85A',
  done: '#8FC55D',
  attention: '#EDC66C',
  error: '#DB8D79',
  selected: '#7A9B4B',
}

const isWorker = (value: unknown): value is WorkerId => value === 'peon' || value === 'peasant' || value === 'acolyte'

const view = atom({ plugin: 'unit-war3-claude', key: 'view' } as const, {
  worker: 'peon',
  state: 'ready',
  phrase: 'Нажми «Позвать»',
  muted: false,
  isRandom: false,
  isOff: false,
  isLoaded: false,
} satisfies PeonView)

const WORKER_IDS: readonly WorkerId[] = ['peon', 'peasant', 'acolyte']

// A random worker, preferring one other than the last session's so a new session feels new.
function randomWorker(previous: WorkerId): WorkerId {
  const others = WORKER_IDS.filter(id => id !== previous)
  return others[Math.floor(Math.random() * others.length)] ?? previous
}

// Module-local caches: portraits as base64, the clip last spoken, a serial audio queue.
// They start over on a reload; the view itself lives in $.state and the choice in $.store.
const portraits: Partial<Record<WorkerId, string>> = {}
let lastClip = ''
let audioQueue: Promise<void> = Promise.resolve()
let isWindows: boolean | undefined
type Prefs = { worker: WorkerId; muted: boolean; isRandom: boolean }
let prefs: Promise<Prefs> | undefined

// The saved choice, mute and random flags, read from $.store once per module life: a read only,
// so a render hook may call it (drawing is pure and may not write state).
function loadPrefs($: EngineInterface): Promise<Prefs> {
  if (prefs === undefined) {
    prefs = (async (): Promise<Prefs> => {
      const savedWorker = await $.store.get('worker')
      const savedMuted = await $.store.get('muted')
      const savedRandom = await $.store.get('random')
      return { worker: isWorker(savedWorker) ? savedWorker : 'peon', muted: savedMuted === true, isRandom: savedRandom === true }
    })().catch(error => {
      prefs = undefined
      throw error
    })
  }
  return prefs
}

// Copies the prefs into the view once per session; called from session.start and handlers, never
// while drawing. $.state lives as long as the session, so this is where a new session rolls its
// random worker; a hot reload of the mod keeps the session's pick.
async function ensureLoaded($: EngineInterface): Promise<void> {
  const current = await read($, view)
  if (current.isLoaded) return
  const saved = await loadPrefs($)
  const worker = saved.isRandom ? randomWorker(saved.worker) : saved.worker
  if (saved.isRandom) {
    await $.store.set('worker', worker)
    prefs = Promise.resolve({ ...saved, worker })
  }
  await update($, view, v => ({
    ...v,
    worker,
    muted: saved.muted,
    isRandom: saved.isRandom,
    state: 'ready' as const,
    phrase: WORKERS[worker].labels.ready,
    isLoaded: true,
  }))
}

async function portraitOf($: EngineInterface, worker: WorkerId): Promise<string | undefined> {
  if (portraits[worker] === undefined) {
    try {
      const { base64 } = await $.fs.read(`${$.plugin.root}/${WORKERS[worker].portrait}`, { as: 'bytes' })
      portraits[worker] = base64
    } catch {
      return undefined
    }
  }
  return portraits[worker]
}

async function playClip($: EngineInterface, file: string): Promise<void> {
  if (isWindows === undefined) isWindows = (await $.env.get('OS')) === 'Windows_NT'
  const path = `${$.plugin.root}/${file}`
  if (isWindows) {
    // The desktop app on Windows has no player behind $.audio.play; PowerShell's SoundPlayer does the job.
    try {
      await $.process.run(
        ['powershell.exe', '-NoLogo', '-NoProfile', '-NonInteractive', '-Command',
          `(New-Object System.Media.SoundPlayer -ArgumentList '${path.replace(/'/g, "''")}').PlaySync()`],
        { timeoutMs: 15000 },
      )
      return
    } catch {
      // fall through to the engine's player
    }
  }
  await $.audio.play({ asset: file })
}

async function react($: EngineInterface, state: PeonState, isManual = false): Promise<void> {
  await ensureLoaded($)
  const current = await read($, view)
  if (current.isOff) return
  if (!isManual && current.state === state) return
  const worker = WORKERS[current.worker]
  const all = worker.clips[state]
  const fresh = all.filter(one => one.file !== lastClip)
  const pool = fresh.length ? fresh : all
  const chosen = pool[Math.floor(Math.random() * pool.length)]
  if (chosen === undefined) return
  await update($, view, v => ({ ...v, state, phrase: chosen.label }))
  if (current.muted) return
  lastClip = chosen.file
  audioQueue = audioQueue.then(() => playClip($, chosen.file)).catch(error => {
    $.ui.log(`unit-war3-claude: звук не проигрался: ${error instanceof Error ? error.message : String(error)}`, { to: 'debug' })
  })
}

async function setWorker($: EngineInterface, worker: WorkerId): Promise<void> {
  await ensureLoaded($)
  await update($, view, v => ({ ...v, worker, state: 'ready' as const, phrase: WORKERS[worker].labels.ready, isLoaded: true }))
  await $.store.set('worker', worker)
  prefs = loadPrefs($).then(saved => ({ ...saved, worker }))
  await react($, 'selected', true)
}

async function toggleMute($: EngineInterface): Promise<void> {
  await ensureLoaded($)
  const current = await read($, view)
  const muted = !current.muted
  await update($, view, v => ({ ...v, muted, isLoaded: true }))
  await $.store.set('muted', muted)
  prefs = loadPrefs($).then(saved => ({ ...saved, muted }))
}

// Kept across sessions; takes effect at the next session's start.
async function toggleRandom($: EngineInterface): Promise<void> {
  await ensureLoaded($)
  const current = await read($, view)
  const isRandom = !current.isRandom
  await update($, view, v => ({ ...v, isRandom, isLoaded: true }))
  await $.store.set('random', isRandom)
  prefs = loadPrefs($).then(saved => ({ ...saved, isRandom }))
}

// This session only: lives in $.state, which a new session starts without.
async function setOff($: EngineInterface, isOff: boolean): Promise<void> {
  await ensureLoaded($)
  await update($, view, v => ({
    ...v,
    isOff,
    state: 'ready' as const,
    phrase: isOff ? 'Отключён до конца сессии' : WORKERS[v.worker].labels.ready,
  }))
}

// The content is a 166 px portrait over a column of buttons: ask for a narrow dock.
// A request only: a width the person dragged the pane to wins.
const PANE_COLUMNS = 26

function openPane($: EngineInterface) {
  return $.ui.open({ id: PANE, title: 'Unit War3 Claude', columns: PANE_COLUMNS })
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await ensureLoaded($)
    await $.command.register({
      name: 'unit',
      description: 'Работник Warcraft III: панель, выбор персонажа, звук, случайный при запуске, отключение на сессию',
      argumentHint: '[орк|крестьянин|послушник|звук|случайный|выкл|вкл]',
    })
    void openPane($)
    void portraitOf($, 'peon')
    void portraitOf($, 'peasant')
    return next(e)
  })

  on('command.run', { command: 'unit' }, async ($, e) => {
    const arg = e.args.trim().toLowerCase()
    if (arg === 'орк' || arg === 'peon') {
      await setWorker($, 'peon')
      return { text: 'Работник: орк-раб.' }
    }
    if (arg === 'крестьянин' || arg === 'peasant') {
      await setWorker($, 'peasant')
      return { text: 'Работник: крестьянин.' }
    }
    if (arg === 'послушник' || arg === 'нежить' || arg === 'acolyte') {
      await setWorker($, 'acolyte')
      return { text: 'Работник: послушник.' }
    }
    if (arg === 'звук' || arg === 'mute') {
      await toggleMute($)
      const { muted } = await read($, view)
      return { text: muted ? 'Реплики выключены.' : 'Реплики включены.' }
    }
    if (arg === 'случайный' || arg === 'random') {
      await toggleRandom($)
      const { isRandom } = await read($, view)
      return { text: isRandom ? 'Каждая новая сессия начнётся со случайного работника.' : 'Новые сессии начнутся с последнего выбранного работника.' }
    }
    if (arg === 'выкл' || arg === 'off') {
      await setOff($, true)
      return { text: 'Работник отключён до конца этой сессии. /unit вкл вернёт его.' }
    }
    if (arg === 'вкл' || arg === 'on') {
      await setOff($, false)
      return { text: 'Работник снова на месте.' }
    }
    await openPane($)
    return { text: 'Панель работника открыта. /unit орк | крестьянин | послушник | звук | случайный | выкл | вкл.' }
  })

  // Automatic reactions: the main loop's turn start and end, a permission ask, a question to the person.
  on('turn.start', async ($, e, next) => {
    if (e.agentId === undefined) void react($, 'working')
    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    if (e.agentId === undefined) {
      const state: PeonState = e.reason === 'answer' ? 'done' : e.reason === 'aborted' ? 'ready' : 'error'
      void react($, state)
    }
    return next(e)
  })

  // Observers only: whatever happens in here, the verdict and the call go through unchanged.
  on('tool.check', async ($, e, next) => {
    const verdict = await next(e)
    if (verdict.decision === 'ask' && e.agentId === undefined && e.tool_use_id !== undefined) void react($, 'attention')
    return verdict
  }).catch(($, e, next) => next(e))

  on('tool.call', { tool: 'AskUserQuestion' }, ($, e, next) => {
    void react($, 'attention')
    return next(e)
  }).catch(($, e, next) => next(e))

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    // Drawing is pure: before a handler or session.start copied the prefs in, draw from the store's values.
    const stored = await read($, view)
    const saved = stored.isLoaded ? undefined : await loadPrefs($)
    const current: PeonView = saved === undefined
      ? stored
      : { ...stored, worker: saved.worker, muted: saved.muted, isRandom: saved.isRandom, phrase: WORKERS[saved.worker].labels.ready }
    const worker = WORKERS[current.worker]
    const label = worker.labels[current.state]

    if (current.isOff) {
      const { Box, Text, Button } = $.ui.resolve(e)
      return (
        <Box flexDirection="column" alignItems="flex-start" rowGap="sm">
          <Text dimColor>{worker.title} отключён до конца этой сессии.</Text>
          <Button key="on" label="Включить" onPress={() => setOff($, false)} />
        </Box>
      )
    }

    if (e.surface !== 'desktop') {
      const { Box, Text, Button } = $.ui.resolve(e)
      return (
        <Box flexDirection="column">
          <Text bold>{worker.title}: {label}</Text>
          <Text dimColor>{current.phrase}</Text>
          <Box>
            <Button key="poke" label="Позвать" onPress={() => react($, 'selected', true)} />
            <Button key="mute" label={current.muted ? 'Звук: выкл.' : 'Звук: вкл.'} onPress={() => toggleMute($)} />
            <Button key="off" label="Отключить" onPress={() => setOff($, true)} />
          </Box>
        </Box>
      )
    }

    const { Box, Text, Button, Svg } = $.ui.resolve(e)
    const portrait = await portraitOf($, current.worker)
    const bar = `<rect y="168" width="166" height="6" fill="${COLORS[current.state]}"/>`
    const svg = portrait === undefined
      ? `<svg xmlns="http://www.w3.org/2000/svg" width="166" height="174" viewBox="0 0 166 174"><rect width="166" height="166" fill="#151711"/>${bar}</svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" width="166" height="174" viewBox="0 0 166 174"><image href="data:image/png;base64,${portrait}" width="166" height="166" preserveAspectRatio="xMidYMid meet"/>${bar}</svg>`

    return (
      <Box flexDirection="column">
        <Svg source={svg} alt={`${worker.title}: ${label}`} width={166} height={174} />
        <Text bold size="heading">{label}</Text>
        <Text dimColor>{current.phrase}</Text>
        <Box flexDirection="column" alignItems="flex-start" rowGap="sm">
          <Button key="poke" label="Позвать" onPress={() => react($, 'selected', true)} />
          <Button key="mute" label={current.muted ? 'Звук: выкл.' : 'Звук: вкл.'} onPress={() => toggleMute($)} />
          <Button key="test" label="Проверить" onPress={() => react($, 'done', true)} />
        </Box>
        <Text dimColor size="caption">Персонаж</Text>
        <Box flexDirection="column" alignItems="flex-start" rowGap="sm">
          <Button key="peon" label={current.worker === 'peon' ? '● Орк-раб' : '○ Орк-раб'} onPress={() => setWorker($, 'peon')} />
          <Button key="peasant" label={current.worker === 'peasant' ? '● Крестьянин' : '○ Крестьянин'} onPress={() => setWorker($, 'peasant')} />
          <Button key="acolyte" label={current.worker === 'acolyte' ? '● Послушник' : '○ Послушник'} onPress={() => setWorker($, 'acolyte')} />
        </Box>
        <Text dimColor size="caption">Настройки</Text>
        <Box flexDirection="column" alignItems="flex-start" rowGap="sm">
          <Button key="random" label={current.isRandom ? '☑ Случайный при запуске' : '☐ Случайный при запуске'} onPress={() => toggleRandom($)} />
          <Button key="off" label="Отключить в этой сессии" onPress={() => setOff($, true)} />
        </Box>
      </Box>
    )
  })
}
