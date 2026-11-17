import { useEffect, useRef, useState } from 'react'
import './App.css'
// --------------------------------------------------
// ACTIVITIES
// --------------------------------------------------

const activities = [
  {
    icon: '🧩',
    name: 'Memory Garden',
    category: 'Memory & focus',
    time: '10 min',
    color: 'lavender',
  },
  {
    icon: '🔤',
    name: 'Word Builder',
    category: 'Reading & language',
    time: '8 min',
    color: 'peach',
  },
  {
    icon: '💭',
    name: 'Understanding Emotions',
    category: 'Explore feelings',
    time: '5 min',
    color: 'mint',
  },
]


type RewardHistoryItem = {
  key: string
  title: string
  description: string
  type: 'badge' | 'milestone'
  createdAt: string
}

const rewardMilestones = [
  {
    key: 'milestone-50',
    points: 50,
    title: 'Rising Star',
    icon: '⭐',
    description: 'Reach 50 Star Points',
  },
  {
    key: 'milestone-100',
    points: 100,
    title: 'Bright Mind',
    icon: '🌟',
    description: 'Reach 100 Star Points',
  },
  {
    key: 'milestone-250',
    points: 250,
    title: 'Super Explorer',
    icon: '🏆',
    description: 'Reach 250 Star Points',
  },
  {
    key: 'milestone-500',
    points: 500,
    title: 'MINDCRAFT Master',
    icon: '👑',
    description: 'Reach 500 Star Points',
  },
]

const achievementBadges = [
  {
    key: 'first-steps',
    title: 'First Steps',
    icon: '🌱',
    description: 'Complete your first activity',
    activity: null,
  },
  {
    key: 'memory-master',
    title: 'Memory Master',
    icon: '🧩',
    description: 'Complete Memory Garden',
    activity: 'Memory Garden',
  },
  {
    key: 'word-explorer',
    title: 'Word Explorer',
    icon: '🔤',
    description: 'Complete Word Builder',
    activity: 'Word Builder',
  },
  {
    key: 'emotion-explorer',
    title: 'Emotion Explorer',
    icon: '💭',
    description: 'Complete Understanding Emotions',
    activity: 'Understanding Emotions',
  },
]


// --------------------------------------------------
// SHARED TYPES
// --------------------------------------------------

type Level = 'Easy' | 'Medium' | 'Hard'

type BestMoves = {
  Easy: number | null
  Medium: number | null
  Hard: number | null
}

type MemoryCard = {
  id: number
  emoji: string
}

type WorldZone =
  | 'home'
  | 'garden'
  | 'water'
  | 'adventure'
  | 'creative'

type WorldTheme = 'green' | 'sunset' | 'snow'
type WorldTime =
  | 'morning'
  | 'afternoon'
  | 'evening'
  | 'night'

type WorldCategory =
  | 'Nature'
  | 'Building'
  | 'Water'
  | 'Decorations'
  | 'Furniture'
  | 'Special'

type WorldItem = {
  id: string
  name: string
  icon: string
  category: WorldCategory
  cost: number
  unlockAt?: number
  rotatable?: boolean
}

type PlacedObject = {
  id: string
  itemId: string
  row: number
  col: number
  zone: WorldZone
  rotation: number
}

type WorldHistory = {
  objects: PlacedObject[]
  blocks: number
}

const WORLD_STORAGE_KEY = 'mindcraft-world-v1'

// --------------------------------------------------
// WORLD INVENTORY
// --------------------------------------------------

const worldItems: WorldItem[] = [
  {
    id: 'flower',
    name: 'Flower',
    icon: '🌷',
    category: 'Nature',
    cost: 2,
  },
  {
    id: 'tree',
    name: 'Small tree',
    icon: '🌳',
    category: 'Nature',
    cost: 4,
  },
  {
    id: 'bush',
    name: 'Bush',
    icon: '🌿',
    category: 'Nature',
    cost: 2,
  },
  {
    id: 'mushroom',
    name: 'Mushroom',
    icon: '🍄',
    category: 'Nature',
    cost: 3,
  },
  {
    id: 'wood',
    name: 'Wood block',
    icon: '🪵',
    category: 'Building',
    cost: 2,
  },
  {
    id: 'stone',
    name: 'Stone block',
    icon: '🪨',
    category: 'Building',
    cost: 2,
  },
  {
    id: 'brick',
    name: 'Brick',
    icon: '🧱',
    category: 'Building',
    cost: 3,
  },
  {
    id: 'glass',
    name: 'Glass',
    icon: '🔷',
    category: 'Building',
    cost: 4,
  },
  {
    id: 'pond',
    name: 'Pond',
    icon: '💧',
    category: 'Water',
    cost: 5,
  },
  {
    id: 'bridge',
    name: 'Bridge',
    icon: '🌉',
    category: 'Water',
    cost: 8,
    rotatable: true,
  },
  {
    id: 'fence',
    name: 'Fence',
    icon: '🪵',
    category: 'Decorations',
    cost: 3,
    rotatable: true,
  },
  {
    id: 'lamp',
    name: 'Garden lamp',
    icon: '🏮',
    category: 'Decorations',
    cost: 5,
  },
  {
    id: 'bench',
    name: 'Bench',
    icon: '🪑',
    category: 'Furniture',
    cost: 5,
    rotatable: true,
  },
  {
    id: 'house',
    name: 'Little house',
    icon: '🏡',
    category: 'Furniture',
    cost: 15,
    rotatable: true,
  },
  {
    id: 'fountain',
    name: 'Fountain',
    icon: '⛲',
    category: 'Special',
    cost: 20,
    unlockAt: 2,
  },
  {
    id: 'rare-plant',
    name: 'Rare plant',
    icon: '🪴',
    category: 'Special',
    cost: 12,
    unlockAt: 3,
  },
]

const worldCategories: WorldCategory[] = [
  'Nature',
  'Building',
  'Water',
  'Decorations',
  'Furniture',
  'Special',
]

const worldZones: {
  id: WorldZone
  name: string
  icon: string
  unlockAt: number
}[] = [
    {
      id: 'home',
      name: 'Home Island',
      icon: '🏡',
      unlockAt: 0,
    },
    {
      id: 'garden',
      name: 'Green Garden',
      icon: '🌳',
      unlockAt: 0,
    },
    {
      id: 'water',
      name: 'Water Zone',
      icon: '🌊',
      unlockAt: 1,
    },
    {
      id: 'adventure',
      name: 'Adventure Zone',
      icon: '⛰️',
      unlockAt: 2,
    },
    {
      id: 'creative',
      name: 'Creative Zone',
      icon: '✨',
      unlockAt: 3,
    },
  ]

// --------------------------------------------------
// WORLD STORAGE
// --------------------------------------------------

function loadWorld(): {
  objects: PlacedObject[]
  name: string
  theme: WorldTheme
  activeZone: WorldZone
  timeOfDay: WorldTime
  ambientDecorations: boolean
} {
  const defaults = {
    objects: [] as PlacedObject[],
    name: 'Little Haven',
    theme: 'green' as WorldTheme,
    activeZone: 'home' as WorldZone,
    timeOfDay: 'morning' as WorldTime,
    ambientDecorations: true,
  }

  try {
    const saved = localStorage.getItem(WORLD_STORAGE_KEY)

    if (!saved) return defaults

    const parsed = JSON.parse(saved)

    const validZones: WorldZone[] = [
      'home',
      'garden',
      'water',
      'adventure',
      'creative',
    ]

    const validTimes: WorldTime[] = [
      'morning',
      'afternoon',
      'evening',
      'night',
    ]

    return {
      objects: Array.isArray(parsed.objects)
        ? parsed.objects.filter((object: any) =>
          object &&
          typeof object.id === 'string' &&
          typeof object.itemId === 'string' &&
          Number.isInteger(object.row) &&
          Number.isInteger(object.col) &&
          object.row >= 0 &&
          object.row < 7 &&
          object.col >= 0 &&
          object.col < 7 &&
          validZones.includes(object.zone)
        )
        : defaults.objects,

      name:
        typeof parsed.name === 'string'
          ? parsed.name.slice(0, 30)
          : defaults.name,

      theme:
        parsed.theme === 'sunset' || parsed.theme === 'snow'
          ? parsed.theme
          : 'green',

      activeZone: validZones.includes(parsed.activeZone)
        ? parsed.activeZone
        : defaults.activeZone,

      timeOfDay: validTimes.includes(parsed.timeOfDay)
        ? parsed.timeOfDay
        : defaults.timeOfDay,

      ambientDecorations:
        typeof parsed.ambientDecorations === 'boolean'
          ? parsed.ambientDecorations
          : true,
    }
  } catch {
    console.warn('Could not load saved world.')
    return defaults
  }
}

// --------------------------------------------------
// MAIN APP
// --------------------------------------------------
type AccessibilitySettings = {
  textSize: 'normal' | 'large' | 'extra-large'
  calmMode: boolean
  reducedMotion: boolean
  highContrast: boolean
  darkMode: boolean
  soundEnabled: boolean
  soundVolume: number
}


type MiniGameProps = {
  onComplete: () => void
  onExit: () => void
}


function WordBuilder({ onComplete, onExit }: MiniGameProps) {
  const levels = {
    Easy: [
      { word: 'SUN', letters: ['N', 'S', 'U'], hint: 'It shines in the sky.' },
      { word: 'CAT', letters: ['T', 'A', 'C'], hint: 'A furry pet that says meow.' },
      { word: 'TREE', letters: ['R', 'E', 'T', 'E'], hint: 'A tall plant with branches.' },
    ],
    Medium: [
      { word: 'PLANT', letters: ['T', 'A', 'P', 'N', 'L'], hint: 'Something that grows in soil.' },
      { word: 'SMILE', letters: ['L', 'M', 'S', 'E', 'I'], hint: 'A happy expression.' },
      { word: 'BRAVE', letters: ['E', 'B', 'A', 'V', 'R'], hint: 'Being courageous.' },
    ],
    Hard: [
      { word: 'RAINBOW', letters: ['W', 'A', 'B', 'R', 'O', 'I', 'N'], hint: 'A colourful arc in the sky.' },
      { word: 'JOURNEY', letters: ['Y', 'O', 'J', 'U', 'R', 'N', 'E'], hint: 'A trip from one place to another.' },
      { word: 'CREATIVE', letters: ['V', 'C', 'E', 'A', 'T', 'R', 'I', 'E'], hint: 'Using imagination to make something new.' },
    ],
  }

  type Level = keyof typeof levels

  const [level, setLevel] = useState<Level | null>(null)
  const [round, setRound] = useState(0)
  const [chosen, setChosen] = useState<number[]>([])
  const [feedback, setFeedback] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [finished, setFinished] = useState(false)

  const puzzles = level ? levels[level] : []
  const puzzle = puzzles[round]
  const answer = puzzle
    ? chosen.map(index => puzzle.letters[index]).join('')
    : ''

  function chooseLetter(index: number) {
    if (chosen.includes(index) || feedback) return
    setChosen(previous => [...previous, index])
  }

  function checkAnswer() {
    if (!puzzle || answer.length !== puzzle.word.length) return

    if (answer === puzzle.word) {
      setFeedback('Wonderful! You built the word.')
    } else {
      setFeedback('Not quite. Rearrange the letters and try again.')
    }
  }

  function resetLetters() {
    setChosen([])
    setFeedback('')
  }

  function nextRound() {
    if (round === puzzles.length - 1) {
      if (level === 'Easy') {
        setLevel('Medium')
      } else if (level === 'Medium') {
        setLevel('Hard')
      } else {
        setFinished(true)
        onComplete()
        return
      }

      setRound(0)
    } else {
      setRound(previous => previous + 1)
    }

    setChosen([])
    setFeedback('')
    setShowHint(false)
  }

  function startLevel(selectedLevel: Level) {
    setLevel(selectedLevel)
    setRound(0)
    setChosen([])
    setFeedback('')
    setShowHint(false)
    setFinished(false)
  }

  if (finished) {
    return (
      <div className="mini-game">
        <p className="eyebrow">WORD BUILDER · ALL LEVELS COMPLETE</p>
        <div className="mini-game-finish-icon">🏆</div>
        <h2>Word Master!</h2>
        <p>You completed Easy, Medium and Hard. Fantastic progress!</p>
        <div className="mini-game-reward">
          ✨ +10 Star Points · 🧱 +1 Building Block
        </div>
        <button className="primary-button" onClick={onExit}>
          Back to activities
        </button>
      </div>
    )
  }

  if (!level) {
    return (
      <div className="mini-game">
        <p className="eyebrow">WORD BUILDER</p>
        <div className="mini-game-finish-icon">🔤</div>
        <h2>Choose your level</h2>
        <p>Start where you feel comfortable. You can progress at your own pace.</p>

        <div className="word-level-grid">
          <button type="button" onClick={() => startLevel('Easy')}>
            <strong>🌱 Easy</strong>
            <span>Short and simple words</span>
          </button>

          <button type="button" onClick={() => startLevel('Medium')}>
            <strong>🌿 Medium</strong>
            <span>Longer word puzzles</span>
          </button>

          <button type="button" onClick={() => startLevel('Hard')}>
            <strong>🌳 Hard</strong>
            <span>Challenge yourself</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mini-game">
      <p className="eyebrow">
        WORD BUILDER · {level.toUpperCase()} · ROUND {round + 1} OF {puzzles.length}
      </p>

      <h2>Build the word</h2>
      <p>Tap the letters in the correct order to make a word.</p>

      <div className="mini-game-progress">
        {puzzles.map((_, index) => (
          <span key={index} className={index <= round ? 'is-active' : ''} />
        ))}
      </div>

      <div className="word-answer" aria-live="polite">
        {Array.from({ length: puzzle.word.length }).map((_, index) => (
          <span key={index}>{answer[index] || ' '}</span>
        ))}
      </div>

      <div className="word-letter-grid">
        {puzzle.letters.map((letter, index) => (
          <button
            key={`${level}-${round}-${index}`}
            type="button"
            className="word-letter"
            disabled={chosen.includes(index) || Boolean(feedback)}
            onClick={() => chooseLetter(index)}
          >
            {letter}
          </button>
        ))}
      </div>

      {showHint && (
        <p className="mini-game-hint">Hint: {puzzle.hint}</p>
      )}

      {feedback && (
        <p className="mini-game-feedback" role="status">{feedback}</p>
      )}

      <div className="mini-game-actions">
        <button
          type="button"
          className="mini-game-secondary"
          onClick={() => setShowHint(true)}
        >
          Show hint
        </button>

        <button
          type="button"
          className="mini-game-secondary"
          onClick={resetLetters}
        >
          Rearrange
        </button>
      </div>

      {!feedback.includes('Wonderful') ? (
        <button
          type="button"
          className="primary-button"
          onClick={checkAnswer}
          disabled={chosen.length !== puzzle.word.length}
        >
          Check word
        </button>
      ) : (
        <button type="button" className="primary-button" onClick={nextRound}>
          {round === puzzles.length - 1
            ? level === 'Hard'
              ? 'Finish game'
              : 'Next level →'
            : 'Next word →'}
        </button>
      )}

      <button
        type="button"
        className="mini-game-secondary"
        onClick={() => {
          setLevel(null)
          setRound(0)
          setChosen([])
          setFeedback('')
          setShowHint(false)
        }}
      >
        Change level
      </button>
    </div>
  )
}



function UnderstandingEmotions({ onComplete, onExit }: MiniGameProps) {
  const scenarios = [
    {
      title: 'A changed plan',
      story: 'You were looking forward to a picnic, but it starts raining and the plan changes.',
      feelings: ['Disappointed', 'Frustrated', 'Relieved', 'Okay', 'Surprised'],
      note: 'A changed plan can bring different feelings. It is okay if your reaction is different from someone else’s.',
    },
    {
      title: 'A kind surprise',
      story: 'Someone gives you a thoughtful note to let you know they appreciate you.',
      feelings: ['Happy', 'Shy', 'Proud', 'Surprised', 'Unsure'],
      note: 'Kind moments can feel exciting, comforting or even a little overwhelming.',
    },
    {
      title: 'A new challenge',
      story: 'You are about to try an activity you have never done before.',
      feelings: ['Curious', 'Excited', 'Nervous', 'Worried', 'Confident'],
      note: 'New experiences can bring more than one feeling at the same time.',
    },
    {
      title: 'The group project',
      story: 'Your group is presenting a project, but one teammate forgets their part.',
      feelings: ['Frustrated', 'Worried', 'Embarrassed', 'Helpful', 'Calm'],
      note: 'Team situations can be tricky. You might feel concerned about the project and still want to help.',
    },
    {
      title: 'A new classmate',
      story: 'A new student joins your class and sits beside you.',
      feelings: ['Curious', 'Friendly', 'Shy', 'Excited', 'Unsure'],
      note: 'Meeting someone new can feel different for everyone. You do not have to know exactly what to say immediately.',
    },
    {
      title: 'The unexpected compliment',
      story: 'Your teacher praises your effort on something you worked hard on.',
      feelings: ['Proud', 'Happy', 'Surprised', 'Shy', 'Motivated'],
      note: 'Receiving appreciation can feel wonderful, but it is also okay to feel shy or unsure.',
    },
    {
      title: 'A cancelled game',
      story: 'Your friends planned to play a game together, but everyone becomes busy.',
      feelings: ['Disappointed', 'Lonely', 'Understanding', 'Frustrated', 'Okay'],
      note: 'It is possible to miss spending time with someone while also understanding that plans change.',
    },
    {
      title: 'Trying again',
      story: 'You find a difficult puzzle and do not solve it on your first attempt.',
      feelings: ['Frustrated', 'Determined', 'Confused', 'Curious', 'Tired'],
      note: 'A challenge can bring several feelings. Taking a short break or trying a different approach can help.',
    },
    {
      title: 'The birthday invitation',
      story: 'You receive an invitation to a birthday party where you will not know many people.',
      feelings: ['Excited', 'Nervous', 'Curious', 'Shy', 'Unsure'],
      note: 'You can look forward to something and feel nervous about it at the same time.',
    },
    {
      title: 'A shared achievement',
      story: 'Your team wins a school competition after working together for weeks.',
      feelings: ['Proud', 'Excited', 'Happy', 'Relieved', 'Grateful'],
      note: 'Shared achievements can bring excitement, pride and appreciation for everyone who helped.',
    },
    {
      title: 'A noisy afternoon',
      story: 'You are trying to concentrate, but the room around you becomes very noisy.',
      feelings: ['Overwhelmed', 'Irritated', 'Distracted', 'Worried', 'Calm'],
      note: 'Different environments affect people differently. It is okay to need a quieter space.',
    },
    {
      title: 'A thoughtful gesture',
      story: 'A friend notices you are having a quiet day and asks if you would like company.',
      feelings: ['Comforted', 'Grateful', 'Shy', 'Happy', 'Unsure'],
      note: 'Kindness can feel comforting. You can appreciate someone checking in even if you are not ready to talk.',
    },
    {
      title: 'The last-minute change',
      story: 'You prepared for one classroom activity, but your teacher announces a different activity instead.',
      feelings: ['Surprised', 'Confused', 'Disappointed', 'Curious', 'Flexible'],
      note: 'Unexpected changes can take time to process. You can give yourself a moment to adjust.',
    },
    {
      title: 'A creative idea',
      story: 'You share an unusual idea during an art activity, and your classmates want to try it.',
      feelings: ['Proud', 'Excited', 'Surprised', 'Confident', 'Shy'],
      note: 'Sharing ideas can feel exciting. It is okay to feel a little nervous when others notice your work.',
    },
    {
      title: 'A helpful moment',
      story: 'You notice someone struggling to carry their books and decide to help.',
      feelings: ['Kind', 'Helpful', 'Happy', 'Confident', 'Calm'],
      note: 'Helping someone can create a sense of connection. Small actions can matter.',
    },
  ]

  function createRound() {
    const shuffled = [...scenarios]

    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[randomIndex]] = [
        shuffled[randomIndex],
        shuffled[i],
      ]
    }

    return shuffled.slice(0, 5)
  }

  const [roundScenarios] = useState(() => createRound())
  const [round, setRound] = useState(0)
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([])
  const [showReflection, setShowReflection] = useState(false)
  const [finished, setFinished] = useState(false)

  const scenario = roundScenarios[round]

  function toggleFeeling(feeling: string) {
    setSelectedFeelings(previous =>
      previous.includes(feeling)
        ? previous.filter(item => item !== feeling)
        : [...previous, feeling]
    )
  }

  function nextScenario() {
    if (round === roundScenarios.length - 1) {
      setFinished(true)
      onComplete()
      return
    }

    setRound(previous => previous + 1)
    setSelectedFeelings([])
    setShowReflection(false)
  }

  if (finished) {
    return (
      <div className="mini-game">
        <p className="eyebrow">UNDERSTANDING EMOTIONS</p>
        <div className="mini-game-finish-icon">💭</div>
        <h2>You explored every scenario!</h2>
        <p>
          You explored 5 different situations. Remember: feelings are personal,
          and there is no single correct way to feel.
        </p>
        <div className="mini-game-reward">
          ✨ +10 Star Points · 🧱 +1 Building Block
        </div>
        <button className="primary-button" onClick={onExit}>
          Back to activities
        </button>
      </div>
    )
  }

  return (
    <div className="mini-game">
      <p className="eyebrow">
        UNDERSTANDING EMOTIONS · ROUND {round + 1} OF {roundScenarios.length}
      </p>

      <h2>{scenario.title}</h2>
      <p>{scenario.story}</p>

      <div className="mini-game-progress">
        {roundScenarios.map((_, index) => (
          <span
            key={index}
            className={index <= round ? 'is-active' : ''}
          />
        ))}
      </div>

      <h3>What might someone feel?</h3>
      <p>You can choose more than one. There are no wrong answers here.</p>

      <div className="emotion-choice-grid">
        {scenario.feelings.map(feeling => (
          <button
            key={feeling}
            type="button"
            className={`emotion-choice ${
              selectedFeelings.includes(feeling) ? 'selected' : ''
            }`}
            aria-pressed={selectedFeelings.includes(feeling)}
            onClick={() => toggleFeeling(feeling)}
          >
            {selectedFeelings.includes(feeling) ? '✓ ' : ''}
            {feeling}
          </button>
        ))}
      </div>

      {showReflection && (
        <div className="mini-game-hint" role="status">
          {scenario.note}
        </div>
      )}

      <button
        type="button"
        className="mini-game-secondary"
        onClick={() => setShowReflection(true)}
      >
        {showReflection ? 'Reflection shown' : 'Explore this situation'}
      </button>

      <button
        type="button"
        className="primary-button"
        disabled={selectedFeelings.length === 0}
        onClick={nextScenario}
      >
        {round === roundScenarios.length - 1
          ? 'Finish activity'
          : 'Continue →'}
      </button>
    </div>
  )
}

function App() {
  const [selectedActivity, setSelectedActivity] =
    useState<(typeof activities)[number] | null>(null)

    const [showParentDashboard, setShowParentDashboard] = useState(false)
const [parentUnlocked, setParentUnlocked] = useState(false)
const [parentPin, setParentPin] = useState('')
const [parentPinError, setParentPinError] = useState('')
const [showParentPin, setShowParentPin] = useState(false)

const [savedParentPin, setSavedParentPin] = useState(
  () => localStorage.getItem('mindcraft-parent-pin-v1') || ''
)

const [confirmParentPin, setConfirmParentPin] = useState('')
const [currentPinForChange, setCurrentPinForChange] = useState('')
const [newPinForChange, setNewPinForChange] = useState('')
const [confirmNewPinForChange, setConfirmNewPinForChange] = useState('')
const [parentChangePinError, setParentChangePinError] = useState('')
const [parentChangePinSuccess, setParentChangePinSuccess] = useState('')


type ParentTask = {
  title: string
  completed: boolean
}

const [parentTab, setParentTab] = useState('Overview')

const [parentProfile, setParentProfile] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem('mindcraft-parent-profile') || '{"nickname":""}'
    )
  } catch {
    return { nickname: '' }
  }
})

const [parentGameLimit, setParentGameLimit] = useState(() => {
  return localStorage.getItem('mindcraft-parent-game-limit') || '30'
})

const [parentPreferences, setParentPreferences] = useState(() => {
  try {
    return JSON.parse(
      localStorage.getItem('mindcraft-parent-preferences') ||
      '{"reminders":false,"timerReminder":false,"weeklySummary":false,"updates":true}'
    )
  } catch {
    return {
      reminders: false,
      timerReminder: false,
      weeklySummary: false,
      updates: true,
    }
  }
})

useEffect(() => {
  localStorage.setItem(
    'mindcraft-parent-profile',
    JSON.stringify(parentProfile)
  )
}, [parentProfile])

useEffect(() => {
  localStorage.setItem('mindcraft-parent-game-limit', parentGameLimit)
}, [parentGameLimit])

useEffect(() => {
  localStorage.setItem(
    'mindcraft-parent-preferences',
    JSON.stringify(parentPreferences)
  )
}, [parentPreferences])

const parentTaskGroups: { period: string; tasks: ParentTask[] }[] = (() => {
  try {
    const raw: unknown = JSON.parse(
      localStorage.getItem('mindcraft-day-tasks') || '[]'
    )

    const convertTasks = (items: unknown[]): ParentTask[] =>
      items.map((entry, index) => {
        const item =
          entry && typeof entry === 'object'
            ? (entry as Record<string, unknown>)
            : {}

        return {
          title: String(
            item.title ?? item.text ?? item.name ?? `Task ${index + 1}`
          ),
          completed:
            item.completed === true ||
            item.done === true ||
            item.isCompleted === true,
        }
      })

    if (Array.isArray(raw)) {
      return [{ period: 'Your routine', tasks: convertTasks(raw) }]
    }

    if (raw && typeof raw === 'object') {
      const data = raw as Record<string, unknown>

      if (Array.isArray(data.tasks)) {
        return [{ period: 'Your routine', tasks: convertTasks(data.tasks) }]
      }

      return Object.entries(data)
        .filter(([, value]) => Array.isArray(value))
        .map(([period, value]) => ({
          period: period.charAt(0).toUpperCase() + period.slice(1),
          tasks: convertTasks(value as unknown[]),
        }))
    }

    return []
  } catch {
    return []
  }
})()

const parentAllTasks = parentTaskGroups.flatMap(group => group.tasks)
const parentCompletedTasks = parentAllTasks.filter(task => task.completed).length
const parentTaskPercentage = parentAllTasks.length
  ? Math.round((parentCompletedTasks / parentAllTasks.length) * 100)
  : 0

const parentTabs = [
  'Overview',
  'Child Profile',
  'Activity Summary',
  'Routine Overview',
  'Games & Screen Time',
  'Accessibility',
  'Reports',
  'Settings',
]

const parentTabIcons: Record<string, string> = {
  Overview: '⌂',
  'Child Profile': '◎',
  'Activity Summary': '◷',
  'Routine Overview': '☷',
  'Games & Screen Time': '◫',
  Accessibility: '◉',
  Reports: '▤',
  Settings: '⚙',
}



const updateParentPreference = (key: string, value: boolean) => {
  setParentPreferences((previous: Record<string, boolean>) => ({
    ...previous,
    [key]: value,
  }))
}


  const [activeGame, setActiveGame] = useState(false)
  const [wordBuilderStarted, setWordBuilderStarted] = useState(false)
const [emotionsGameStarted, setEmotionsGameStarted] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  // ACCESSIBILITY SETTINGS



  const [starPoints, setStarPoints] = useState(() => {
    const saved = localStorage.getItem('mindcraft-star-points')
    return saved ? Number(saved) || 120 : 120
  })

  const [blocks, setBlocks] = useState(() => {
    const saved = localStorage.getItem('mindcraft-building-blocks')
    return saved ? Number(saved) || 0 : 18
  })

  const [completedActivities, setCompletedActivities] =
    useState<string[]>(() => {
      try {
        const saved = localStorage.getItem(
          'mindcraft-completed-activities'
        )

        return saved ? JSON.parse(saved) : []
      } catch {
        return []
      }
    })


const [rewardHistory, setRewardHistory] = useState<RewardHistoryItem[]>(() => {
  try {
    const saved = localStorage.getItem('mindcraft-reward-history-v1')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
})


  const defaultAccessibility: AccessibilitySettings = {
    textSize: 'normal',
    calmMode: false,
    reducedMotion: false,
    highContrast: false,
    darkMode: false,
    soundEnabled: true,
    soundVolume: 50,
  }

  const [accessibility, setAccessibility] =
    useState<AccessibilitySettings>(() => {
      try {
        const saved = localStorage.getItem(
          'mindcraft-accessibility'
        )

        return saved
          ? { ...defaultAccessibility, ...JSON.parse(saved) }
          : defaultAccessibility
      } catch {
        return defaultAccessibility
      }
    })
    const parentAccessibilityRows: [string, string][] = [
  ['Text size', String(accessibility.textSize)],
  ['Calm Mode', accessibility.calmMode ? 'On' : 'Off'],
  ['Reduced Motion', accessibility.reducedMotion ? 'On' : 'Off'],
  ['High Contrast', accessibility.highContrast ? 'On' : 'Off'],
  ['Dark Mode', accessibility.darkMode ? 'On' : 'Off'],
  ['Sound', accessibility.soundEnabled ? 'Enabled' : 'Disabled'],
  ['Sound volume', `${accessibility.soundVolume}%`],
]

  useEffect(() => {
    localStorage.setItem(
      'mindcraft-accessibility',
      JSON.stringify(accessibility)
    )
  }, [accessibility])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = accessibility.darkMode ? 'dark' : 'light'
    root.dataset.contrast = accessibility.highContrast ? 'more' : 'normal'
    root.dataset.motion =
      accessibility.reducedMotion || accessibility.calmMode ? 'reduced' : 'normal'
    root.dataset.textSize = accessibility.textSize
  }, [
    accessibility.darkMode,
    accessibility.highContrast,
    accessibility.reducedMotion,
    accessibility.calmMode,
    accessibility.textSize,
  ])

  useEffect(() => {
    const sectionIds = [
      'home',
      'world',
      'games',
      'day',
      'journal',
      'settings',
    ]

    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    const observer = new IntersectionObserver(
      entries => {
        const visibleSections = entries
          .filter(entry => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.boundingClientRect.top - b.boundingClientRect.top
          )

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id)
        }
      },
      {
        rootMargin: '-15% 0px -70% 0px',
        threshold: 0,
      }
    )

    sections.forEach(section => observer.observe(section))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    localStorage.setItem(
      'mindcraft-star-points',
      String(starPoints)
    )

    localStorage.setItem(
      'mindcraft-building-blocks',
      String(blocks)
    )

    localStorage.setItem(
      'mindcraft-completed-activities',
      JSON.stringify(completedActivities)
    )
  }, [starPoints, blocks, completedActivities])


useEffect(() => {
  const unlockedRewards: RewardHistoryItem[] = []

  // Achievement badges
  achievementBadges.forEach(badge => {
    const earned =
      badge.key === 'first-steps'
        ? completedActivities.length > 0
        : completedActivities.includes(badge.activity as string)

    if (earned) {
      unlockedRewards.push({
        key: `badge-${badge.key}`,
        title: badge.title,
        description: badge.description,
        type: 'badge',
        createdAt: new Date().toISOString(),
      })
    }
  })

  // Star Point milestones
  rewardMilestones.forEach(milestone => {
    if (starPoints >= milestone.points) {
      unlockedRewards.push({
        key: milestone.key,
        title: milestone.title,
        description: milestone.description,
        type: 'milestone',
        createdAt: new Date().toISOString(),
      })
    }
  })

  setRewardHistory(previous => {
    const existingKeys = new Set(previous.map(item => item.key))

    const newRewards = unlockedRewards.filter(
      item => !existingKeys.has(item.key)
    )

    if (newRewards.length === 0) return previous

    return [...newRewards, ...previous]
  })
}, [completedActivities, starPoints])

useEffect(() => {
  localStorage.setItem(
    'mindcraft-reward-history-v1',
    JSON.stringify(rewardHistory)
  )
}, [rewardHistory])


  function completeActivity(keepModalOpen = false): boolean {
  if (!selectedActivity) return false

  const isNewCompletion = !completedActivities.includes(
    selectedActivity.name
  )

  if (isNewCompletion) {
    setCompletedActivities(previous => [
      ...previous,
      selectedActivity.name,
    ])

    setStarPoints(points => points + 10)
    setBlocks(count => count + 1)
  }

  if (!keepModalOpen) {
    setSelectedActivity(null)
  }

  return isNewCompletion
}

  function updateAccessibility(
    key: keyof AccessibilitySettings,
    value: boolean | number | string
  ) {
    setAccessibility(previous => ({
      ...previous,
      [key]: value,
    }))
  }


function handleParentPinSubmit(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault()

  if (!savedParentPin) {
    if (parentPin !== confirmParentPin) {
      setParentPinError('The PINs do not match. Please try again.')
      setConfirmParentPin('')
      return
    }

    localStorage.setItem('mindcraft-parent-pin-v1', parentPin)
    setSavedParentPin(parentPin)
    setParentUnlocked(true)
    setParentPin('')
    setConfirmParentPin('')
    setParentPinError('')
    return
  }

  if (parentPin === savedParentPin) {
    setParentUnlocked(true)
    setParentPin('')
    setParentPinError('')
  } else {
    setParentPinError('Incorrect PIN. Please try again.')
    setParentPin('')
  }
}

function handleParentPinChange() {
  setParentChangePinError('')
  setParentChangePinSuccess('')

  if (currentPinForChange !== savedParentPin) {
    setParentChangePinError('Your current PIN is incorrect.')
    return
  }

  if (newPinForChange.length !== 4) {
    setParentChangePinError('Your new PIN must contain 4 digits.')
    return
  }

  if (newPinForChange !== confirmNewPinForChange) {
    setParentChangePinError('Your new PINs do not match.')
    return
  }

  if (newPinForChange === currentPinForChange) {
    setParentChangePinError('Choose a different PIN from your current one.')
    return
  }

  localStorage.setItem('mindcraft-parent-pin-v1', newPinForChange)
  setSavedParentPin(newPinForChange)

  setCurrentPinForChange('')
  setNewPinForChange('')
  setConfirmNewPinForChange('')

  setParentChangePinSuccess('Your Parent Space PIN has been updated.')
}

function exitParentDashboard() {
  setParentUnlocked(false)
  setShowParentDashboard(false)
  setParentPin('')
  setConfirmParentPin('')
  setParentPinError('')
}

  if (showParentDashboard && !parentUnlocked) {
    return (
     <main
  className={`app-shell parent-access-shell ${
    accessibility.darkMode ? 'dark-mode' : ''
  }`}
>
        <section className="parent-pin-card">
          <p className="eyebrow">MINDCRAFT · PARENT SPACE</p>
          <h1>{savedParentPin ? 'Welcome, Parent' : 'Set up Parent Space'}</h1>

<p>
  {savedParentPin
    ? 'Enter your PIN to continue.'
    : 'Create a 4-digit PIN to set up your Parent Space.'}
</p>

          
<form onSubmit={handleParentPinSubmit}>
  <label htmlFor="parent-pin">
    {savedParentPin ? 'Parent PIN' : 'Create your PIN'}
  </label>

  <input
    id="parent-pin"
    type={showParentPin ? 'text' : 'password'}
    inputMode="numeric"
    autoComplete="off"
    maxLength={4}
    value={parentPin}
    onChange={event => {
      setParentPin(
        event.target.value.replace(/\D/g, '').slice(0, 4)
      )
      setParentPinError('')
    }}
    placeholder={
      savedParentPin
        ? 'Enter your 4-digit PIN'
        : 'Create a 4-digit PIN'
    }
  />

  {!savedParentPin && (
    <>
      <label htmlFor="confirm-parent-pin">
        Confirm your PIN
      </label>

      <input
        id="confirm-parent-pin"
        type={showParentPin ? 'text' : 'password'}
        inputMode="numeric"
        autoComplete="off"
        maxLength={4}
        value={confirmParentPin}
        onChange={event => {
          setConfirmParentPin(
            event.target.value.replace(/\D/g, '').slice(0, 4)
          )
          setParentPinError('')
        }}
        placeholder="Re-enter your 4-digit PIN"
      />
    </>
  )}

  <button
    type="button"
    onClick={() => setShowParentPin(previous => !previous)}
  >
    {showParentPin ? 'Hide PIN' : 'Show PIN'}
  </button>

  {parentPinError && (
    <p role="alert" className="parent-pin-error">
      {parentPinError}
    </p>
  )}

  <button
    type="submit"
    className="primary-button"
    disabled={
      parentPin.length !== 4 ||
      (!savedParentPin && confirmParentPin.length !== 4)
    }
  >
    {savedParentPin
      ? 'Unlock Parent Space'
      : 'Create PIN & Continue'}
  </button>

  <button
    type="button"
    className="parent-back-button"
    onClick={exitParentDashboard}
  >
    Back to MINDCRAFT
  </button>
</form>

        </section>
      </main>
    )
  }

 
if (showParentDashboard && parentUnlocked) {
  return (
    <main
  className={`mc-parent ${
    accessibility.reducedMotion ? 'mc-parent-reduced-motion' : ''
  } ${accessibility.darkMode ? 'dark-mode' : ''}`}
>
      <aside className="mc-parent-sidebar">
        <div className="mc-parent-brand">
          <span className="mc-parent-brand-icon">✳</span>
          <div>
            <strong>MINDCRAFT</strong>
            <small>PARENT SPACE</small>
          </div>
        </div>

        <p className="mc-parent-nav-label">DASHBOARD</p>

        <nav className="mc-parent-nav">
          {parentTabs.map(tab => (
            <button
              key={tab}
              type="button"
              className={parentTab === tab ? 'selected' : ''}
              onClick={() => setParentTab(tab)}
            >
              <span>
                {parentTabIcons[tab]}
              </span>
              {tab}
            </button>
          ))}
        </nav>

        <div className="mc-parent-sidebar-bottom">
          <p>Supporting growth, one day at a time.</p>
          <button
            type="button"
            onClick={exitParentDashboard}
          >
            ← Back to MINDCRAFT
          </button>
        </div>
      </aside>

      <section className="mc-parent-main">
        <header className="mc-parent-topbar">
          <div>
            <p className="mc-parent-eyebrow">MINDCRAFT / PARENT SPACE</p>
            <h1>{parentTab}</h1>
          </div>
          <button
            className="mc-parent-exit"
            type="button"
            onClick={exitParentDashboard}
          >
            Exit Parent Space ↗
          </button>
        </header>

        {parentTab === 'Overview' && (
          <>
            <section className="mc-parent-welcome">
              <div>
                <p className="mc-parent-eyebrow">YOUR CHILD'S SPACE</p>
                <h2>
                  Welcome{parentProfile.nickname
                    ? `, ${parentProfile.nickname}'s parent`
                    : ', Parent'}.
                </h2>
                <p>
                  A simple overview of activities, routines and
                  accessibility preferences.
                </p>
              </div>
              <div className="mc-parent-voxel-scene" aria-hidden="true">
  <div className="mc-voxel-cloud mc-voxel-cloud-one" />
  <div className="mc-voxel-cloud mc-voxel-cloud-two" />

  <div className="mc-voxel-island">
    <div className="mc-voxel-island-side" />

    <div className="mc-voxel-ground">
      <div className="mc-voxel-path" />

      <div className="mc-voxel-house">
        <div className="mc-voxel-roof" />
        <div className="mc-voxel-house-body">
          <div className="mc-voxel-window" />
          <div className="mc-voxel-door" />
        </div>
      </div>

      <div className="mc-voxel-tree mc-voxel-tree-one">
        <span />
        <i />
      </div>

      <div className="mc-voxel-tree mc-voxel-tree-two">
        <span />
        <i />
      </div>

      <div className="mc-voxel-flower">✿</div>
      <div className="mc-voxel-character">🦊</div>
    </div>
  </div>

  <div className="mc-voxel-floating-block mc-voxel-block-one" />
  <div className="mc-voxel-floating-block mc-voxel-block-two" />
</div>
            </section>

            <div className="mc-parent-stats">
              <article className="mc-parent-stat">
                <span>Activities explored</span>
                <strong>{completedActivities.length}</strong>
                <small>Recorded completed activities</small>
              </article>

              <article className="mc-parent-stat">
                <span>Routine tasks completed</span>
                <strong>{parentCompletedTasks}/{parentAllTasks.length}</strong>
                <small>Based on the saved routine</small>
              </article>

              <article className="mc-parent-stat">
                <span>Routine progress</span>
                <strong>{parentTaskPercentage}%</strong>
                <div className="mc-parent-progress">
                  <span style={{ width: `${parentTaskPercentage}%` }} />
                </div>
              </article>

              <article className="mc-parent-stat">
                <span>Star points</span>
                <strong>{starPoints}</strong>
                <small>Current app reward balance</small>
              </article>
            </div>

            <div className="mc-parent-content-grid">
              <section className="mc-parent-panel">
                <div className="mc-parent-panel-heading">
                  <div>
                    <p className="mc-parent-eyebrow">DAILY STRUCTURE</p>
                    <h3>Routine overview</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setParentTab('Routine Overview')}
                  >
                    View all →
                  </button>
                </div>

                {parentTaskGroups.length ? (
                  parentTaskGroups.map(group => (
                    <div className="mc-parent-routine-group" key={group.period}>
                      <strong>{group.period}</strong>
                      <span>
                        {group.tasks.filter(task => task.completed).length}
                        {' / '}
                        {group.tasks.length} completed
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="mc-parent-empty">
                    No saved routine tasks are available yet.
                  </p>
                )}
              </section>

              <section className="mc-parent-panel">
                <p className="mc-parent-eyebrow">APP SETTINGS</p>
                <h3>Accessibility at a glance</h3>
                <div className="mc-parent-setting-row">
                  <span>Calm Mode</span>
                  <strong>{accessibility.calmMode ? 'On' : 'Off'}</strong>
                </div>
                <div className="mc-parent-setting-row">
                  <span>Reduced Motion</span>
                  <strong>{accessibility.reducedMotion ? 'On' : 'Off'}</strong>
                </div>
                <div className="mc-parent-setting-row">
                  <span>High Contrast</span>
                  <strong>{accessibility.highContrast ? 'On' : 'Off'}</strong>
                </div>
                <button
                  className="mc-parent-text-link"
                  type="button"
                  onClick={() => setParentTab('Accessibility')}
                >
                  View preferences →
                </button>
              </section>
            </div>

            <div className="mc-parent-privacy-note">
              <span>🔒</span>
              <p>
                <strong>Privacy matters.</strong> Journal entries, drawings
                and individual emotion check-ins are not displayed in Parent
                Space.
              </p>
            </div>
          </>
        )}

        {parentTab === 'Child Profile' && (
          <section className="mc-parent-panel mc-parent-wide-panel">
            <p className="mc-parent-eyebrow">PERSONALISATION</p>
            <h2>Child profile</h2>
            <p>Set a nickname to personalise the Parent Space overview.</p>

            <label className="mc-parent-field-label" htmlFor="parent-nickname">
              Preferred nickname
            </label>
            <input
              id="parent-nickname"
              className="mc-parent-input"
              value={parentProfile.nickname || ''}
              maxLength={30}
              placeholder="Enter a nickname"
              onChange={event =>
                setParentProfile({
                  ...parentProfile,
                  nickname: event.target.value,
                })
              }
            />

            <p className="mc-parent-help">
              This is a display preference, not a verified identity or
              account-linking system.
            </p>
          </section>
        )}

        {parentTab === 'Activity Summary' && (
          <section className="mc-parent-panel mc-parent-wide-panel">
            <p className="mc-parent-eyebrow">LEARNING & EXPLORATION</p>
            <h2>Completed activities</h2>
            <p>
              This list shows activity names recorded by the app.
              It does not include timestamps or performance assessments.
            </p>

            <div className="mc-parent-activity-count">
              <strong>{completedActivities.length}</strong>
              <span>activities recorded as completed</span>
            </div>

            {completedActivities.length ? (
              <ul className="mc-parent-activity-list">
                {completedActivities.map((activity, index) => (
                  <li key={`${activity}-${index}`}>
                    <span>✳</span>
                    {activity}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mc-parent-empty">
                No completed activities have been recorded yet.
              </p>
            )}
          </section>
        )}

        {parentTab === 'Routine Overview' && (
          <section className="mc-parent-panel mc-parent-wide-panel">
            <p className="mc-parent-eyebrow">DAILY ROUTINE</p>
            <h2>Routine overview</h2>
            <p>
              A read-only summary of tasks saved in Build Your Day.
            </p>

            <div className="mc-parent-routine-summary">
              <strong>{parentTaskPercentage}%</strong>
              <span>
                {parentCompletedTasks} of {parentAllTasks.length} tasks completed
              </span>
              <div className="mc-parent-progress">
                <span style={{ width: `${parentTaskPercentage}%` }} />
              </div>
            </div>

            {parentTaskGroups.length ? (
              parentTaskGroups.map(group => (
                <div className="mc-parent-routine-card" key={group.period}>
                  <div className="mc-parent-panel-heading">
                    <h3>{group.period}</h3>
                    <span>
                      {group.tasks.filter(task => task.completed).length}/
                      {group.tasks.length}
                    </span>
                  </div>
                  {group.tasks.map((task, index) => (
                    <div className="mc-parent-task-row" key={`${task.title}-${index}`}>
                      <span className={task.completed ? 'task-done' : ''}>
                        {task.completed ? '✓' : '○'}
                      </span>
                      <span>{task.title}</span>
                      <small>{task.completed ? 'Completed' : 'Not completed'}</small>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p className="mc-parent-empty">
                No routine tasks could be read from the saved routine.
              </p>
            )}
          </section>
        )}

        {parentTab === 'Games & Screen Time' && (
          <section className="mc-parent-panel mc-parent-wide-panel">
            <p className="mc-parent-eyebrow">BALANCED DIGITAL HABITS</p>
            <h2>Games & screen time</h2>
            <p>
              Choose a suggested daily games allowance for family
              discussions and planning.
            </p>

            <label className="mc-parent-field-label" htmlFor="parent-game-limit">
              Suggested daily games allowance
            </label>
            <select
              id="parent-game-limit"
              className="mc-parent-input"
              value={parentGameLimit}
              onChange={event => setParentGameLimit(event.target.value)}
            >
              <option value="15">15 minutes</option>
              <option value="20">20 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="75">75 minutes</option>
              <option value="90">90 minutes</option>
              <option value="120">120 minutes</option>
            </select>

            <div className="mc-parent-info-note">
              <strong>Important:</strong> This is a saved planning preference
              only. It does not track device usage, enforce a time limit,
              lock games or monitor activity outside MINDCRAFT.
            </div>
          </section>
        )}

        {parentTab === 'Accessibility' && (
          <section className="mc-parent-panel mc-parent-wide-panel">
            <p className="mc-parent-eyebrow">INCLUSIVE EXPERIENCE</p>
            <h2>Accessibility preferences</h2>
            <p>
              A read-only view of the accessibility settings currently
              selected in MINDCRAFT.
            </p>

            {parentAccessibilityRows.map(([label, value]) => (
  <div className="mc-parent-setting-row" key={label}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
))}

            <p className="mc-parent-help">
              Change these preferences from the child's Accessibility Centre.
            </p>
          </section>
        )}

        {parentTab === 'Reports' && (
          <section className="mc-parent-panel mc-parent-wide-panel">
            <p className="mc-parent-eyebrow">APP SUMMARY</p>
            <h2>Reports</h2>
            <p>
              A summary of information currently available on this device.
            </p>

            <div className="mc-parent-report-grid">
              <div>
                <span>Completed activities</span>
                <strong>{completedActivities.length}</strong>
              </div>
              <div>
                <span>Routine tasks</span>
                <strong>{parentAllTasks.length}</strong>
              </div>
              <div>
                <span>Tasks completed</span>
                <strong>{parentCompletedTasks}</strong>
              </div>
              <div>
                <span>Star points</span>
                <strong>{starPoints}</strong>
              </div>
            </div>

            <div className="mc-parent-info-note">
              Reports are limited to currently stored information. MINDCRAFT
              does not currently have the historical timestamps needed to
              generate reliable weekly or monthly trends.
            </div>
          </section>
        )}

        {parentTab === 'Settings' && (
          <section className="mc-parent-panel mc-parent-wide-panel">
            <p className="mc-parent-eyebrow">PARENT PREFERENCES</p>
            <h2>Settings</h2>
            <p>
              Manage local preferences for the Parent Space.
            </p>

            {[
              ['reminders', 'Routine reminders'],
              ['timerReminder', 'Games timer reminder'],
              ['weeklySummary', 'Weekly summary preference'],
              ['updates', 'App and privacy update preference'],
            ].map(([key, label]) => (
              <label className="mc-parent-toggle-row" key={key}>
                <span>{label}</span>
                <input
                  type="checkbox"
                  checked={Boolean(parentPreferences[key])}
                  onChange={event =>
                    updateParentPreference(key, event.target.checked)
                  }
                />
              </label>
            ))}

            <div className="mc-parent-info-note">
              These preferences are saved on this device. They do not
              currently send notifications, emails or reports.
            </div>


<div className="mc-parent-security-section">
  <p className="mc-parent-eyebrow">ACCOUNT SECURITY</p>
  <h3>Change Parent PIN</h3>
  <p>
    Update the 4-digit PIN used to access Parent Space.
  </p>

  <label className="mc-parent-field-label">
    Current PIN
  </label>
  <input
    className="mc-parent-input"
    type="password"
    inputMode="numeric"
    maxLength={4}
    value={currentPinForChange}
    onChange={event => {
      setCurrentPinForChange(
        event.target.value.replace(/\D/g, '').slice(0, 4)
      )
      setParentChangePinError('')
      setParentChangePinSuccess('')
    }}
    placeholder="Enter current PIN"
  />

  <label className="mc-parent-field-label">
    New PIN
  </label>
  <input
    className="mc-parent-input"
    type="password"
    inputMode="numeric"
    maxLength={4}
    value={newPinForChange}
    onChange={event => {
      setNewPinForChange(
        event.target.value.replace(/\D/g, '').slice(0, 4)
      )
      setParentChangePinError('')
      setParentChangePinSuccess('')
    }}
    placeholder="Enter new 4-digit PIN"
  />

  <label className="mc-parent-field-label">
    Confirm new PIN
  </label>
  <input
    className="mc-parent-input"
    type="password"
    inputMode="numeric"
    maxLength={4}
    value={confirmNewPinForChange}
    onChange={event => {
      setConfirmNewPinForChange(
        event.target.value.replace(/\D/g, '').slice(0, 4)
      )
      setParentChangePinError('')
      setParentChangePinSuccess('')
    }}
    placeholder="Confirm new PIN"
  />

  {parentChangePinError && (
    <p className="parent-pin-error" role="alert">
      {parentChangePinError}
    </p>
  )}

  {parentChangePinSuccess && (
    <p role="status" className="parent-pin-success">
      {parentChangePinSuccess}
    </p>
  )}

  <button
    type="button"
    className="primary-button"
    disabled={
      currentPinForChange.length !== 4 ||
      newPinForChange.length !== 4 ||
      confirmNewPinForChange.length !== 4
    }
    onClick={handleParentPinChange}
  >
    Update PIN
  </button>
</div>


            <button
              type="button"
              className="mc-parent-logout"
              onClick={exitParentDashboard}
            >
              Lock Parent Space and return
            </button>
          </section>
        )}

        <footer className="mc-parent-footer">
          MINDCRAFT · PARENT SPACE
          <span>Designed to support, not pressure.</span>
        </footer>
      </section>
    </main>
  )
}


  return (
    <main
      className={[
        'app-shell',
        accessibility.textSize === 'large' ? 'text-large' : '',
        accessibility.textSize === 'extra-large'
          ? 'text-extra-large'
          : '',
        accessibility.calmMode ? 'calm-mode' : '',
        accessibility.reducedMotion ? 'reduced-motion' : '',
        accessibility.highContrast ? 'high-contrast' : '',
        accessibility.darkMode ? 'dark-mode' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">✳</div>
          <span>MINDCRAFT</span>
        </div>

        <p className="nav-heading">YOUR SPACE</p>

        <nav className="navigation">
          <a
            className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
            href="#home"
          >
            ⌂ <span>Home</span>
          </a>

          <a
            className={`nav-link ${activeSection === 'world' ? 'active' : ''}`}
            href="#world"
          >
            🌍 <span>My World</span>
          </a>

          <a
            className={`nav-link ${activeSection === 'games' ? 'active' : ''}`}
            href="#games"
          >
            ✧ <span>Explore Games</span>
          </a>

          <a
            className={`nav-link ${activeSection === 'day' ? 'active' : ''}`}
            href="#day"
          >
            ☷ <span>Build Your Day</span>
          </a>

          <a
            className={`nav-link ${activeSection === 'journal' ? 'active' : ''}`}
            href="#journal"
          >
            ▤ <span>My Journal</span>
          </a>
          <a
  className={`nav-link ${activeSection === 'audio' ? 'active' : ''}`}
  href="#audio"
>
  🎧 <span>Audio Library</span>
  <span className="premium-tag">PRO</span>
</a>

<a
  className={`nav-link ${activeSection === 'rewards' ? 'active' : ''}`}
  href="#rewards"
  onClick={() => setActiveSection('rewards')}
>
  ☆ <span>My Rewards</span>
</a>


          <button
  type="button"
  className={`nav-link ${showParentDashboard ? 'active' : ''}`}
  onClick={() => {
    setShowParentDashboard(true)
    setParentUnlocked(false)
    setParentPin('')
    setParentPinError('')
  }}
>
  ♙ <span>Parent Space</span>
</button>
<a className="nav-link" href="#settings">
  ⚙ <span>Settings</span>
</a>
        </nav>

        <div className="sidebar-bottom">
          <div className="calm-card">
            <span>☁️</span>
            <p>A little progress is still progress.</p>
          </div>

          
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar" id="home">
          <div>
            <p className="eyebrow">YOUR PERSONAL SPACE</p>
            <p className="date">A new day, a new adventure.</p>
          </div>

          <div className="profile">
            <div className="avatar">🦊</div>
            <div>
              <strong>Little Explorer</strong>
              <span>My profile</span>
            </div>
          </div>
        </header>

        <section className="welcome">
          <div className="welcome-copy">
            <span className="welcome-tag">
              ✦ YOUR WORLD AWAITS
            </span>

            <h1>Hello, Explorer!</h1>

            <p>
              Take your time, discover something new and make today
              your own.
            </p>

            <a className="primary-button" href="#games">
              Explore activities <span>→</span>
            </a>
          </div>

          <div
            className="welcome-art"
            aria-label="Illustration of a floating island"
          >
            <div className="sun"></div>
            <div className="cloud cloud-one"></div>
            <div className="cloud cloud-two"></div>

            <div className="island">
              <div className="island-tree">🌳</div>
              <div className="island-house">🏡</div>
              <div className="island-rock">🌱</div>
            </div>

            <div className="island-caption">
              MY LITTLE WORLD
            </div>
          </div>
        </section>

        <section className="stats">
          <article className="stat-card">
            <span className="stat-icon">✨</span>
            <div>
              <strong>{starPoints}</strong>
              <span>Star points</span>
            </div>
          </article>

          <article className="stat-card">
            <span className="stat-icon">🧱</span>
            <div>
              <strong>{blocks}</strong>
              <span>Building blocks</span>
            </div>
          </article>

          <article className="stat-card">
            <span className="stat-icon">🌱</span>
            <div>
              <strong>{completedActivities.length}</strong>
              <span>Activities today</span>
            </div>
          </article>
                </section>

        {/* EXPLORE GAMES */}
        <section className="section" id="games">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR NEXT ADVENTURE</p>
              <h2>Explore something new</h2>
            </div>

            <a href="#games" className="text-link">
              See all →
            </a>
          </div>

          <div className="activity-grid">
            {activities.map(activity => (
              <article
                className={`activity-card ${activity.color}`}
                key={activity.name}
                onClick={() => setSelectedActivity(activity)}
                role="button"
                tabIndex={0}
                onKeyDown={event => {
                  if (
                    event.key === 'Enter' ||
                    event.key === ' '
                  ) {
                    event.preventDefault()
                    setSelectedActivity(activity)
                  }
                }}
              >
                <div className="activity-icon">
                  {activity.icon}
                </div>

                <span className="activity-category">
                  {activity.category}
                </span>

                <h3>{activity.name}</h3>

                <div className="activity-footer">
                  <span>◷ {activity.time}</span>

                  <span className="play-icon">
                    {completedActivities.includes(activity.name)
                      ? '✓'
                      : '→'}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bottom-grid">
  <BuildYourDay />
  <MyJournal />
</section>


{/* AUDIO LIBRARY - PREMIUM */}
<section className="section audio-premium" id="audio">
  <div className="section-heading">
    <div>
      <p className="eyebrow">THE MINDFUL LISTENING SPACE</p>
      <h2>🎧 Audio Library</h2>
      <p>
        Stories, discoveries and calming sounds, all in one place.
      </p>
    </div>

    <span className="premium-tag">✦ PREMIUM</span>
  </div>

  <div className="audio-lock-banner">
    <span className="audio-lock-icon">🔒</span>
    <div>
      <h3>Unlock the world of listening</h3>
      <p>
        Audio Library is a MINDCRAFT Premium feature.
        This feature is only available to members after
        upgrading to a MINDCRAFT Premium plan.
        Upgrade to Premium to access the complete audio
        collection and listening experience.
      </p>
      <span className="audio-coming-soon">
        Premium access coming soon
      </span>
    </div>
  </div>

  <div className="audio-feature-grid">
    <article className="audio-feature-card">
      <span>📚</span>
      <h3>Stories & Audiobooks</h3>
      <p>
        Explore imaginative stories, adventures and
        carefully selected audiobook collections.
      </p>
      <small>Premium feature</small>
    </article>

    <article className="audio-feature-card">
      <span>🚀</span>
      <h3>Learn & Discover</h3>
      <p>
        Discover educational audio, fascinating facts
        and interesting topics to explore.
      </p>
      <small>Premium feature</small>
    </article>

    <article className="audio-feature-card">
      <span>🌙</span>
      <h3>Bedtime & Calm</h3>
      <p>
        Find gentle stories, relaxing sounds and
        peaceful listening suggestions.
      </p>
      <small>Premium feature</small>
    </article>

    <article className="audio-feature-card">
      <span>📖</span>
      <h3>Read Along</h3>
      <p>
        Follow along with text while listening to
        selected stories and learning content.
      </p>
      <small>Premium feature</small>
    </article>

    <article className="audio-feature-card">
      <span>⭐</span>
      <h3>Saved Favourites</h3>
      <p>
        Keep your favourite stories and audio
        recommendations together.
      </p>
      <small>Premium feature</small>
    </article>

    <article className="audio-feature-card">
      <span>🔎</span>
      <h3>Curated Suggestions</h3>
      <p>
        Discover age-appropriate listening
        recommendations and selected external resources.
      </p>
      <small>Premium feature</small>
    </article>
  </div>

  <p className="audio-premium-note">
    You're getting a preview of what's planned.
    Audio playback and premium content are not available yet.
  </p>
</section>

        {/* MY WORLD */}
        <MyWorld
          blocks={blocks}
          setBlocks={setBlocks}
          completedCount={completedActivities.length}
        />
<section className="rewards-section" id="rewards">
  <div className="rewards-heading">
    <div>
      <p className="eyebrow">YOUR ACHIEVEMENTS</p>
      <h2>🏆 My Rewards</h2>
      <p>Every little step deserves recognition.</p>
    </div>
    <div className="rewards-balance">
      ✨ {starPoints} points
    </div>
  </div>

  <div className="rewards-grid">
    {rewardMilestones.map(reward => {
      const unlocked = starPoints >= reward.points

      return (
        <article
          key={reward.key}
          className={`reward-card ${unlocked ? 'unlocked' : 'locked'}`}
        >
          <span className="reward-icon">{reward.icon}</span>
          <div>
            <h3>{reward.title}</h3>
            <p>{reward.description}</p>
            <small>
              {unlocked ? '✓ Unlocked' : `${reward.points - starPoints} more points to go`}
            </small>
          </div>
        </article>
      )
    })}

    {achievementBadges.map(badge => {
      const unlocked = rewardHistory.some(
        reward => reward.key === `badge-${badge.key}`
      )

      return (
        <article
          key={badge.key}
          className={`reward-card ${unlocked ? 'unlocked' : 'locked'}`}
        >
          <span className="reward-icon">{badge.icon}</span>
          <div>
            <h3>{badge.title}</h3>
            <p>{badge.description}</p>
            <small>
              {unlocked ? '✓ Unlocked' : 'Complete an activity to earn this'}
            </small>
          </div>
        </article>
      )
    })}
  </div>

  <div className="reward-history">
    <h3>Recent achievements</h3>

    {rewardHistory.length === 0 ? (
      <p>Your achievements will appear here as you explore MINDCRAFT.</p>
    ) : (
      <div className="reward-history-list">
        {rewardHistory.slice(0, 5).map(reward => (
          <div className="reward-history-item" key={reward.key}>
            <span>{reward.type === 'badge' ? '🏅' : '⭐'}</span>
            <div>
              <strong>{reward.title}</strong>
              <small>
                {new Date(reward.createdAt).toLocaleDateString()}
              </small>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</section>

        {/* ACCESSIBILITY CENTRE */}
        <section className="section accessibility-section" id="settings">
          <div className="section-heading">
            <div>
              <p className="eyebrow">MAKE IT YOUR OWN</p>
              <h2>Accessibility Centre</h2>
              <p>Choose the settings that make MINDCRAFT comfortable for you.</p>
            </div>
            <span className="accessibility-icon">⚙️</span>
          </div>

          <div className="accessibility-grid">

            <article className="accessibility-card">
              <h3>🔠 Text size</h3>
              <p>Choose a comfortable reading size.</p>

              <select
                value={accessibility.textSize}
                onChange={event =>
                  updateAccessibility('textSize', event.target.value)
                }
              >
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra large</option>
              </select>
            </article>

            <article className="accessibility-card">
              <h3>☁️ Calm Mode</h3>
              <p>Make the interface feel simpler and less busy.</p>

              <label className="accessibility-toggle">
                <input
                  type="checkbox"
                  checked={accessibility.calmMode}
                  onChange={event =>
                    updateAccessibility('calmMode', event.target.checked)
                  }
                />
                <span>Enable Calm Mode</span>
              </label>
            </article>

            <article className="accessibility-card">
              <h3>🌊 Reduced Motion</h3>
              <p>Reduce animations and visual movement.</p>

              <label className="accessibility-toggle">
                <input
                  type="checkbox"
                  checked={accessibility.reducedMotion}
                  onChange={event =>
                    updateAccessibility(
                      'reducedMotion',
                      event.target.checked
                    )
                  }
                />
                <span>Enable Reduced Motion</span>
              </label>
            </article>

            <article className="accessibility-card">
              <h3>◐ Display preferences</h3>
              <p>Adjust the display to suit your needs.</p>

              <label className="accessibility-toggle">
                <input
                  type="checkbox"
                  checked={accessibility.highContrast}
                  onChange={event =>
                    updateAccessibility(
                      'highContrast',
                      event.target.checked
                    )
                  }
                />
                <span>High Contrast</span>
              </label>

              <label className="accessibility-toggle">
                <input
                  type="checkbox"
                  checked={accessibility.darkMode}
                  onChange={event =>
                    updateAccessibility('darkMode', event.target.checked)
                  }
                />
                <span>Dark Mode</span>
              </label>
            </article>

            <article className="accessibility-card">
              <h3>🔊 Sound preferences</h3>
              <p>Choose your preferred sound settings.</p>

              <label className="accessibility-toggle">
                <input
                  type="checkbox"
                  checked={accessibility.soundEnabled}
                  onChange={event =>
                    updateAccessibility(
                      'soundEnabled',
                      event.target.checked
                    )
                  }
                />
                <span>Enable sounds</span>
              </label>

              <label className="accessibility-volume">
                Volume: {accessibility.soundVolume}%
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={accessibility.soundVolume}
                  disabled={!accessibility.soundEnabled}
                  onChange={event =>
                    updateAccessibility(
                      'soundVolume',
                      Number(event.target.value)
                    )
                  }
                />
              </label>
            </article>

          </div>
        </section>

        

{/* ACTIVITY MODALS */}
{activeGame ? (
  <div className="modal-overlay">
    <div className="activity-modal">
      <button
        className="close-button"
        aria-label="Close Memory Garden"
        onClick={() => {
          setActiveGame(false)
          setSelectedActivity(null)
        }}
      >
        ×
      </button>

      <MemoryGarden
        onComplete={completeActivity}
        onExit={() => {
          setActiveGame(false)
          setSelectedActivity(null)
        }}
      />
    </div>
  </div>
) : wordBuilderStarted ? (
  <div className="modal-overlay">
    <div className="activity-modal">
      <button
        className="close-button"
        aria-label="Close Word Builder"
        onClick={() => {
          setWordBuilderStarted(false)
          setSelectedActivity(null)
        }}
      >
        ×
      </button>
      <WordBuilder
        onComplete={() => {
          completeActivity(true)
        }}
        onExit={() => {
          setWordBuilderStarted(false)
          setSelectedActivity(null)
        }}
      />
    </div>
  </div>
) : emotionsGameStarted ? (
  <div className="modal-overlay">
    <div className="activity-modal">
      <button
        className="close-button"
        aria-label="Close Understanding Emotions"
        onClick={() => {
          setEmotionsGameStarted(false)
          setSelectedActivity(null)
        }}
      >
        ×
      </button>
      <UnderstandingEmotions
        onComplete={() => {
          completeActivity(true)
        }}
        onExit={() => {
          setEmotionsGameStarted(false)
          setSelectedActivity(null)
        }}
      />
    </div>
  </div>
) : selectedActivity ? (
  <div className="modal-overlay">
    <div className="activity-modal">
      <button
        className="close-button"
        aria-label="Close activity"
        onClick={() => setSelectedActivity(null)}
      >
        ×
      </button>

      <div className="modal-icon">
        {selectedActivity.icon}
      </div>

      <p className="eyebrow">YOUR NEXT ADVENTURE</p>
      <h2>{selectedActivity.name}</h2>
      <p>{selectedActivity.category}</p>
      <p>Take your time. Every little step counts.</p>

      {completedActivities.includes(selectedActivity.name) ? (
        <p>
          You've already collected your reward for this activity!
        </p>
      ) : selectedActivity.name === 'Memory Garden' ? (
        <button
          className="primary-button"
          onClick={() => setActiveGame(true)}
        >
          Start Memory Garden
        </button>
      ) : selectedActivity.name === 'Word Builder' ? (
        <button
          className="primary-button"
          onClick={() => setWordBuilderStarted(true)}
        >
          Start Word Builder
        </button>
      ) : selectedActivity.name === 'Understanding Emotions' ? (
        <button
          className="primary-button"
          onClick={() => setEmotionsGameStarted(true)}
        >
          Start Understanding Emotions
        </button>
      ) : null}
    </div>
  </div>
  
 ) : null}
      </section>
    </main>
  )
}

// --------------------------------------------------
// MY WORLD
// --------------------------------------------------
function BuildYourDay() {
  type DaySection = 'Morning' | 'Afternoon' | 'Evening'

  type DayTask = {
    id: number
    title: string
    time: string
    section: DaySection
    completed: boolean
  }
  type DayTemplate = {
    id: string
    name: string
    tasks: Omit<DayTask, 'id' | 'completed'>[]
  }

  const [tasks, setTasks] = useState<DayTask[]>(() => {
    try {
      const saved = localStorage.getItem('mindcraft-day-tasks')
      return saved ? JSON.parse(saved) as DayTask[] : []
    } catch {
      return []
    }
  })
  const [customTemplates, setCustomTemplates] =
    useState<DayTemplate[]>(() => {
      try {
        const saved = localStorage.getItem(
          'mindcraft-custom-templates'
        )
        return saved ? JSON.parse(saved) as DayTemplate[] : []
      } catch {
        return []
      }
    })

  const [templateName, setTemplateName] = useState('')

  const [taskTitle, setTaskTitle] = useState('')
  const [taskTime, setTaskTime] = useState('')
  const [taskSection, setTaskSection] =
    useState<DaySection>('Morning')
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(
        'mindcraft-day-tasks',
        JSON.stringify(tasks)
      )
    } catch {
      console.warn('Could not save your daily tasks.')
    }
  }, [tasks])
  useEffect(() => {
    try {
      localStorage.setItem(
        'mindcraft-custom-templates',
        JSON.stringify(customTemplates)
      )
    } catch {
      console.warn('Could not save your templates.')
    }
  }, [customTemplates])

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedTitle = taskTitle.trim()
    if (!trimmedTitle) return

    if (editingId !== null) {
      setTasks(current =>
        current.map(task =>
          task.id === editingId
            ? {
              ...task,
              title: trimmedTitle,
              time: taskTime,
              section: taskSection,
            }
            : task
        )
      )
    } else {
      setTasks(current => [
        ...current,
        {
          id: Date.now(),
          title: trimmedTitle,
          time: taskTime,
          section: taskSection,
          completed: false,
        },
      ])
    }

    setTaskTitle('')
    setTaskTime('')
    setTaskSection('Morning')
    setEditingId(null)
  }

  function startEditing(task: DayTask) {
    setEditingId(task.id)
    setTaskTitle(task.title)
    setTaskTime(task.time)
    setTaskSection(task.section)
  }

  function cancelEditing() {
    setEditingId(null)
    setTaskTitle('')
    setTaskTime('')
    setTaskSection('Morning')
  }

  function toggleTask(id: number) {
    setTasks(current =>
      current.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    )
  }

  function deleteTask(id: number) {
    setTasks(current => current.filter(task => task.id !== id))

    if (editingId === id) {
      cancelEditing()
    }
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100)

  const sections: DaySection[] = [
    'Morning',
    'Afternoon',
    'Evening',
  ]
  const builtInTemplates: DayTemplate[] = [
    {
      id: 'school',
      name: 'School Day',
      tasks: [
        { title: 'Get ready for school', time: '06:30', section: 'Morning' },
        { title: 'Have breakfast', time: '06:45', section: 'Morning' },
        { title: 'Take a little rest', time: '14:30', section: 'Afternoon' },
        { title: 'Complete homework', time: '16:00', section: 'Afternoon' },
        { title: 'Prepare for tomorrow', time: '20:30', section: 'Evening' },
      ],
    },
    {
      id: 'weekend',
      name: 'Weekend',
      tasks: [
        { title: 'Morning walk or exercise', time: '07:00', section: 'Morning' },
        { title: 'Enjoy a hobby', time: '10:00', section: 'Morning' },
        { title: 'Finish important tasks', time: '14:00', section: 'Afternoon' },
        { title: 'Spend time with family', time: '17:00', section: 'Afternoon' },
        { title: 'Relax and unwind', time: '20:00', section: 'Evening' },
      ],
    },
    {
      id: 'relaxed',
      name: 'Relaxed Day',
      tasks: [
        { title: 'Wake up and freshen up', time: '', section: 'Morning' },
        { title: 'Do something creative', time: '', section: 'Afternoon' },
        { title: 'Take some time for yourself', time: '', section: 'Evening' },
      ],
    },
  ]

  function applyTemplate(template: DayTemplate) {
    if (
      tasks.length > 0 &&
      !window.confirm(
        `Apply "${template.name}"? This will replace your current tasks.`
      )
    ) {
      return
    }

    setTasks(
      template.tasks.map((task, index) => ({
        ...task,
        id: Date.now() + index,
        completed: false,
      }))
    )

    cancelEditing()
  }

  function saveCurrentTemplate() {
    const name = templateName.trim()

    if (!name) {
      window.alert('Please enter a name for your template.')
      return
    }

    if (tasks.length === 0) {
      window.alert('Add at least one task before saving a template.')
      return
    }

    const newTemplate: DayTemplate = {
      id: `custom-${Date.now()}`,
      name,
      tasks: tasks.map(({ title, time, section }) => ({
        title,
        time,
        section,
      })),
    }

    setCustomTemplates(current => [...current, newTemplate])
    setTemplateName('')
  }

  function deleteCustomTemplate(id: string) {
    if (!window.confirm('Delete this saved template?')) return

    setCustomTemplates(current =>
      current.filter(template => template.id !== id)
    )
  }

  return (
    <section className="planner-card" id="day">
      <div className="planner-header">
        <div>
          <p className="eyebrow">ONE STEP AT A TIME</p>
          <h2>Build Your Day</h2>
          <p>Make a little plan that works for you.</p>
        </div>
        <div className="planner-icon">📒</div>
      </div>

      <div className="planner-progress">
        <div className="planner-progress-label">
          <span>Your progress</span>
          <strong>{completedTasks} / {tasks.length} completed</strong>
        </div>
        <div className="planner-progress-track">
          <div
            className="planner-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p>{progress === 100 && tasks.length > 0
          ? 'You did it! Every step counts. ✨'
          : 'Go at your own pace. There is no rush.'}
        </p>
      </div>
      <div className="planner-templates">
        <div className="planner-template-heading">
          <div>
            <h3>Quick-start templates</h3>
            <p>Choose a starting point for your day.</p>
          </div>
        </div>

        <div className="planner-template-grid">
          {builtInTemplates.map(template => (
            <button
              type="button"
              className="planner-template-button"
              key={template.id}
              onClick={() => applyTemplate(template)}
            >
              <span>
                {template.id === 'school' && '🎒'}
                {template.id === 'weekend' && '🌻'}
                {template.id === 'relaxed' && '☁️'}
              </span>
              <strong>{template.name}</strong>
              <small>{template.tasks.length} suggested tasks</small>
            </button>
          ))}
        </div>

        {customTemplates.length > 0 && (
          <div className="planner-saved-templates">
            <h4>My templates</h4>

            {customTemplates.map(template => (
              <div className="planner-saved-template" key={template.id}>
                <div>
                  <strong>{template.name}</strong>
                  <small>{template.tasks.length} saved tasks</small>
                </div>

                <button
                  type="button"
                  onClick={() => applyTemplate(template)}
                >
                  Use
                </button>

                <button
                  type="button"
                  className="planner-delete-button"
                  onClick={() => deleteCustomTemplate(template.id)}
                  aria-label={`Delete ${template.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <form className="planner-form" onSubmit={handleSubmit}>
        <h3>{editingId !== null ? 'Edit your task' : 'Add a task'}</h3>

        <label htmlFor="planner-task">What would you like to do?</label>
        <input
          id="planner-task"
          type="text"
          placeholder="e.g. Read a book"
          value={taskTitle}
          onChange={event => setTaskTitle(event.target.value)}
          maxLength={80}
          required
        />

        <div className="planner-form-row">
          <div>
            <label htmlFor="planner-time">Time (optional)</label>
            <input
              id="planner-time"
              type="time"
              value={taskTime}
              onChange={event => setTaskTime(event.target.value)}
            />
          </div>

          <div>
            <label htmlFor="planner-section">Part of the day</label>
            <select
              id="planner-section"
              value={taskSection}
              onChange={event =>
                setTaskSection(event.target.value as DaySection)
              }
            >
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
            </select>
          </div>
        </div>

        <div className="planner-form-actions">
          <button className="planner-add-button" type="submit">
            {editingId !== null ? 'Save changes' : '+ Add task'}
          </button>

          {editingId !== null && (
            <button
              className="planner-cancel-button"
              type="button"
              onClick={cancelEditing}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="planner-sections">
        {sections.map(section => {
          const sectionTasks = tasks.filter(
            task => task.section === section
          )

          return (
            <div className="planner-section" key={section}>
              <div className="planner-section-heading">
                <h3>
                  {section === 'Morning' && '🌅 '}
                  {section === 'Afternoon' && '☀️ '}
                  {section === 'Evening' && '🌙 '}
                  {section}
                </h3>
                <span>{sectionTasks.length} tasks</span>
              </div>

              {sectionTasks.length === 0 ? (
                <p className="planner-empty">
                  Nothing planned here yet.
                </p>
              ) : (
                sectionTasks.map(task => (
                  <div
                    className={`planner-task ${task.completed ? 'is-completed' : ''}`}
                    key={task.id}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      aria-label={`Mark ${task.title} as ${task.completed ? 'not completed' : 'completed'}`}
                    />

                    <div className="planner-task-info">
                      <span className="planner-task-title">
                        {task.title}
                      </span>
                      <span className="planner-task-time">
                        {task.time
                          ? new Date(`2000-01-01T${task.time}`).toLocaleTimeString([], {
                            hour: 'numeric',
                            minute: '2-digit',
                          })
                          : 'Any time'}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="planner-edit-button"
                      onClick={() => startEditing(task)}
                      aria-label={`Edit ${task.title}`}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="planner-delete-button"
                      onClick={() => deleteTask(task.id)}
                      aria-label={`Delete ${task.title}`}
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          )
        })}
      </div>
      <div className="planner-save-template">
        <div>
          <h3>Save your own routine</h3>
          <p>Keep a favourite daily plan for another time.</p>
        </div>

        <div className="planner-save-row">
          <input
            type="text"
            placeholder="Name your template..."
            value={templateName}
            onChange={event => setTemplateName(event.target.value)}
            maxLength={35}
          />

          <button
            type="button"
            onClick={saveCurrentTemplate}
          >
            Save template
          </button>
        </div>
      </div>

      <p className="planner-footer">
        Remember: unfinished tasks can always wait for another day. 💚
      </p>
    </section>
  )
}

// --------------------------------------------------
// MY JOURNAL
// --------------------------------------------------

function MyJournal() {
  type JournalEntry = {
    id: string
    title: string
    content: string
    mood: string
    mode: 'write' | 'draw'
    drawing: string
    createdAt: string
    updatedAt: string
  }

  type JournalFilter = 'all' | 'write' | 'draw'

  const STORAGE_KEY = 'mindcraft-journal-entries-v1'
  const DRAFT_KEY = 'mindcraft-journal-draft-v1'

  const prompts = [
    'What is one thing that made today memorable?',
    'What is something new you discovered about yourself?',
    'Describe a moment when you felt proud of yourself.',
    'If today had a title, what would it be?',
    'What is something you want to remember?',
    'What would you tell your future self?',
    'What is one thing you are looking forward to?',
    'Describe your perfect peaceful afternoon.',
  ]

  const moods = [
    { label: 'Happy', icon: '😊' },
    { label: 'Calm', icon: '😌' },
    { label: 'Excited', icon: '🤩' },
    { label: 'Tired', icon: '😴' },
    { label: 'Unsure', icon: '🤔' },
    { label: 'Other', icon: '✨' },
  ]

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const undoStack = useRef<string[]>([])

  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('')
  const [mode, setMode] = useState<'write' | 'draw'>('write')
  const [drawing, setDrawing] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<JournalFilter>('all')
  const [showPrompts, setShowPrompts] = useState(false)
  const [selectedPrompt, setSelectedPrompt] = useState('')
  const [brushColor, setBrushColor] = useState('#456d50')
  const [brushSize, setBrushSize] = useState(5)
  const [status, setStatus] = useState('')

  // Save entries whenever the collection changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    } catch {
      setStatus('Storage is full. Try removing an older drawing.')
    }
  }, [entries])

  // Restore an unfinished writing draft.
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY)

      if (savedDraft) {
        const draft = JSON.parse(savedDraft)
        setTitle(draft.title || '')
        setContent(draft.content || '')
        setMood(draft.mood || '')
        setSelectedPrompt(draft.selectedPrompt || '')
      }
    } catch {
      // Ignore an unreadable draft.
    }
  }, [])

  // Autosave the current writing draft.
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({
            title,
            content,
            mood,
            selectedPrompt,
          }),
        )
      } catch {
        setStatus('Could not autosave this draft.')
      }
    }, 500)

    return () => window.clearTimeout(timeout)
  }, [title, content, mood, selectedPrompt])

  // Restore a saved drawing when opening a drawing entry.
  useEffect(() => {
    if (mode !== 'draw' || !canvasRef.current || !drawing) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return

    const image = new Image()

    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
    }

    image.src = drawing
  }, [mode, drawing])

  const resetEditor = () => {
    setTitle('')
    setContent('')
    setMood('')
    setMode('write')
    setDrawing('')
    setActiveId(null)
    setSelectedPrompt('')
    setStatus('')
    undoStack.current = []

    if (canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      context?.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      )
    }
  }

  const saveEntry = () => {
    if (!title.trim() && !content.trim() && !drawing) {
      setStatus('Add a title, some writing or a drawing first.')
      return
    }

    const now = new Date().toISOString()

    if (activeId) {
      setEntries((previous) =>
        previous.map((entry) =>
          entry.id === activeId
            ? {
                ...entry,
                title: title.trim() || 'Untitled entry',
                content,
                mood,
                mode,
                drawing,
                updatedAt: now,
              }
            : entry,
        ),
      )
      setStatus('Your entry has been updated.')
    } else {
      const newEntry: JournalEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: title.trim() || 'Untitled entry',
        content,
        mood,
        mode,
        drawing,
        createdAt: now,
        updatedAt: now,
      }

      setEntries((previous) => [newEntry, ...previous])
      setStatus('Your entry has been saved.')
    }

    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      // Saving the entry is still successful if draft cleanup fails.
    }

    resetEditor()
  }

  const openEntry = (entry: JournalEntry) => {
    setActiveId(entry.id)
    setTitle(entry.title)
    setContent(entry.content)
    setMood(entry.mood)
    setMode(entry.mode)
    setDrawing(entry.drawing)
    setSelectedPrompt('')
    setStatus('')
    undoStack.current = []
  }

  const deleteEntry = (id: string) => {
    const confirmed = window.confirm(
      'Delete this journal entry? This cannot be undone.',
    )

    if (!confirmed) return

    setEntries((previous) => previous.filter((entry) => entry.id !== id))

    if (activeId === id) {
      resetEditor()
    }

    setStatus('Entry deleted.')
  }

  const choosePrompt = (prompt: string) => {
    setSelectedPrompt(prompt)
    setContent((previous) =>
      previous ? `${previous}\n\n${prompt}\n` : `${prompt}\n`,
    )
    setShowPrompts(false)
    setMode('write')
  }

  const getCanvasPosition = (
    event: React.PointerEvent<HTMLCanvasElement>,
  ) => {
    const canvas = event.currentTarget
    const rect = canvas.getBoundingClientRect()

    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  const startDrawing = (
    event: React.PointerEvent<HTMLCanvasElement>,
  ) => {
    const canvas = event.currentTarget
    const context = canvas.getContext('2d')
    if (!context) return

    event.preventDefault()

    try {
      undoStack.current.push(canvas.toDataURL())
      if (undoStack.current.length > 15) {
        undoStack.current.shift()
      }
    } catch {
      // Continue drawing even if undo history cannot be captured.
    }

    isDrawing.current = true
    canvas.setPointerCapture(event.pointerId)

    const position = getCanvasPosition(event)

    context.beginPath()
    context.moveTo(position.x, position.y)
    context.lineWidth = brushSize
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.strokeStyle = brushColor
    context.lineTo(position.x + 0.1, position.y + 0.1)
    context.stroke()
  }

  const continueDrawing = (
    event: React.PointerEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing.current) return

    const canvas = event.currentTarget
    const context = canvas.getContext('2d')
    if (!context) return

    event.preventDefault()

    const position = getCanvasPosition(event)

    context.lineTo(position.x, position.y)
    context.stroke()
  }

  const finishDrawing = () => {
    if (!isDrawing.current) return

    isDrawing.current = false

    const canvas = canvasRef.current
    if (!canvas) return

    try {
      setDrawing(canvas.toDataURL('image/png'))
    } catch {
      setStatus('Could not save this drawing.')
    }
  }

  const undoDrawing = () => {
    const canvas = canvasRef.current
    const previousImage = undoStack.current.pop()

    if (!canvas || !previousImage) return

    const context = canvas.getContext('2d')
    if (!context) return

    const image = new Image()

    image.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0)
      setDrawing(canvas.toDataURL('image/png'))
    }

    image.src = previousImage
  }

  const clearDrawing = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    context?.clearRect(0, 0, canvas.width, canvas.height)
    undoStack.current = []
    setDrawing('')
  }

  const filteredEntries = entries
    .filter((entry) => {
      const matchesSearch =
        entry.title.toLowerCase().includes(search.toLowerCase()) ||
        entry.content.toLowerCase().includes(search.toLowerCase())

      const matchesFilter =
        filter === 'all' ||
        (filter === 'write' && entry.mode === 'write') ||
        (filter === 'draw' && entry.mode === 'draw')

      return matchesSearch && matchesFilter
    })
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime(),
    )

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

  return (
    <section className="journal-workspace" id="journal">
      <div className="journal-heading">
        <div>
          <p className="eyebrow">A SPACE JUST FOR YOU</p>
          <h2>My Journal ✍️</h2>
          <p>
            Write, draw, reflect or simply put your thoughts somewhere.
          </p>
        </div>

        <div className="journal-entry-count">
          <span>{entries.length}</span>
          <small>saved entries</small>
        </div>
      </div>

      <div className="journal-privacy-note">
        <span>🔒</span>
        <p>
          Your journal is not shown in the Parent Dashboard. Entries are
          stored in this browser on this device. They are not encrypted,
          so this is not a secure private vault. Avoid entering passwords
          or highly sensitive information.
        </p>
      </div>

      <div className="journal-layout">
        <div className="journal-editor">
          <div className="journal-editor-top">
            <div>
              <p className="eyebrow">
                {activeId ? 'EDIT YOUR ENTRY' : 'CREATE SOMETHING'}
              </p>
              <h3>{activeId ? 'Edit entry' : 'A fresh page'}</h3>
            </div>

            {activeId && (
              <button
                className="journal-text-button"
                onClick={resetEditor}
                type="button"
              >
                New entry
              </button>
            )}
          </div>

          <div className="journal-mode-switch">
            <button
              type="button"
              className={mode === 'write' ? 'active' : ''}
              onClick={() => setMode('write')}
            >
              ✍️ Write
            </button>

            <button
              type="button"
              className={mode === 'draw' ? 'active' : ''}
              onClick={() => setMode('draw')}
            >
              🎨 Draw
            </button>
          </div>

          <label className="journal-field-label" htmlFor="journal-title">
            Entry title
          </label>

          <input
            id="journal-title"
            className="journal-title-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Give this page a name..."
            maxLength={90}
          />

          {mode === 'write' ? (
            <>
              <label className="journal-field-label" htmlFor="journal-content">
                Your thoughts
              </label>

              <textarea
                id="journal-content"
                className="journal-writing-area"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Start wherever you like. There is no right or wrong way to journal..."
                rows={12}
              />

              <div className="journal-writing-footer">
                <span>{content.length} characters</span>
                <span>Draft autosaves in this browser</span>
              </div>
            </>
          ) : (
            <div className="journal-drawing-area">
              <div className="journal-drawing-toolbar">
                <label>
                  Brush size
                  <input
                    type="range"
                    min="2"
                    max="22"
                    value={brushSize}
                    onChange={(event) =>
                      setBrushSize(Number(event.target.value))
                    }
                  />
                </label>

                <label>
                  Colour
                  <input
                    type="color"
                    value={brushColor}
                    onChange={(event) => setBrushColor(event.target.value)}
                  />
                </label>

                <button
                  type="button"
                  onClick={undoDrawing}
                  disabled={undoStack.current.length === 0}
                >
                  ↶ Undo
                </button>

                <button type="button" onClick={clearDrawing}>
                  Clear
                </button>
              </div>

              <canvas
                ref={canvasRef}
                className="journal-canvas"
                width={900}
                height={440}
                onPointerDown={startDrawing}
                onPointerMove={continueDrawing}
                onPointerUp={finishDrawing}
                onPointerCancel={finishDrawing}
                onPointerLeave={finishDrawing}
              />

              <p className="journal-canvas-hint">
                Use your mouse, touchscreen or stylus to draw.
              </p>
            </div>
          )}

          <div className="journal-mood-section">
            <p className="journal-field-label">
              Add an optional mood tag
            </p>

            <div className="journal-mood-options">
              {moods.map((item) => (
                <button
                  type="button"
                  key={item.label}
                  className={mood === item.label ? 'selected' : ''}
                  onClick={() =>
                    setMood((previous) =>
                      previous === item.label ? '' : item.label,
                    )
                  }
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>

            <p className="journal-optional-hint">
              You can skip this. You do not have to label how you feel.
            </p>
          </div>

          <div className="journal-editor-actions">
            <button
              type="button"
              className="journal-save-button"
              onClick={saveEntry}
            >
              {activeId ? 'Save changes' : 'Save entry'}
            </button>

            <button
              type="button"
              className="journal-clear-button"
              onClick={resetEditor}
            >
              Clear page
            </button>
          </div>

          {status && (
            <p className="journal-status" role="status">
              {status}
            </p>
          )}
        </div>

        <aside className="journal-side-panel">
          <div className="journal-prompt-card">
            <p className="eyebrow">NEED AN IDEA?</p>
            <h3>Writing prompts</h3>
            <p>Pick a prompt if you are not sure what to write.</p>

            <button
              type="button"
              className="journal-prompt-button"
              onClick={() => setShowPrompts((previous) => !previous)}
            >
              {showPrompts ? 'Hide prompts' : 'Explore prompts'} →
            </button>

            {showPrompts && (
              <div className="journal-prompt-list">
                {prompts.map((prompt) => (
                  <button
                    type="button"
                    key={prompt}
                    onClick={() => choosePrompt(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="journal-tips-card">
            <p className="eyebrow">A LITTLE REMINDER</p>
            <h3>Your page, your rules.</h3>
            <ul>
              <li>There is no minimum word count.</li>
              <li>You can write or draw.</li>
              <li>You can skip prompts and mood tags.</li>
              <li>You do not need to write every day.</li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="journal-library">
        <div className="journal-library-heading">
          <div>
            <p className="eyebrow">YOUR COLLECTION</p>
            <h3>Saved entries</h3>
          </div>

          <span>{filteredEntries.length} shown</span>
        </div>

        <div className="journal-library-controls">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search your entries..."
            aria-label="Search journal entries"
          />

          <div className="journal-filter-buttons">
            {(
              [
                ['all', 'All'],
                ['write', 'Writing'],
                ['draw', 'Drawings'],
              ] as [JournalFilter, string][]
            ).map(([value, label]) => (
              <button
                type="button"
                key={value}
                className={filter === value ? 'active' : ''}
                onClick={() => setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="journal-empty-state">
            <span>📖</span>
            <h4>
              {entries.length === 0
                ? 'Your collection starts here.'
                : 'No matching entries found.'}
            </h4>
            <p>
              {entries.length === 0
                ? 'Your saved writing and drawings will appear here.'
                : 'Try another search or change the filter.'}
            </p>
          </div>
        ) : (
          <div className="journal-entry-grid">
            {filteredEntries.map((entry) => (
              <article className="journal-entry-card" key={entry.id}>
                <div className="journal-entry-card-top">
                  <span>
                    {entry.mode === 'draw' ? '🎨 Drawing' : '✍️ Writing'}
                  </span>
                  {entry.mood && <span>{entry.mood}</span>}
                </div>

                <h4>{entry.title}</h4>

                {entry.mode === 'draw' && entry.drawing ? (
                  <img
                    className="journal-entry-thumbnail"
                    src={entry.drawing}
                    alt={`Drawing saved in ${entry.title}`}
                  />
                ) : (
                  <p className="journal-entry-preview">
                    {entry.content || 'No written description.'}
                  </p>
                )}

                <small>Last updated: {formatDate(entry.updatedAt)}</small>

                <div className="journal-entry-actions">
                  <button
                    type="button"
                    onClick={() => openEntry(entry)}
                  >
                    Edit entry
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteEntry(entry.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function MyWorld({
  blocks,
  setBlocks,
  completedCount,
}: {
  blocks: number
  setBlocks: React.Dispatch<React.SetStateAction<number>>
  completedCount: number
}) {
  const initialWorld = loadWorld()

  const [worldName, setWorldName] = useState(initialWorld.name)
  const [theme, setTheme] = useState<WorldTheme>(
    initialWorld.theme
  )
  const [timeOfDay, setTimeOfDay] =
    useState<WorldTime>(initialWorld.timeOfDay)

  const [ambientDecorations, setAmbientDecorations] =
    useState(initialWorld.ambientDecorations)

  const [objects, setObjects] = useState<PlacedObject[]>(
    initialWorld.objects
  )

  const [activeZone, setActiveZone] =
    useState<WorldZone>(initialWorld.activeZone)

  const [mode, setMode] = useState<'build' | 'explore'>('build')

  const [category, setCategory] =
    useState<WorldCategory>('Nature')

  const [selectedItem, setSelectedItem] =
    useState<string | null>(null)

  const [tool, setTool] = useState<
    'place' | 'remove' | 'move' | 'rotate'
  >('place')

  const [movingObjectId, setMovingObjectId] =
    useState<string | null>(null)

  const [calmWorld, setCalmWorld] = useState(false)

  const [message, setMessage] = useState(
    'Choose an item and select a tile to place it!'
  )

  const [history, setHistory] = useState<WorldHistory[]>([])

  useEffect(() => {
    try {
      localStorage.setItem(
        WORLD_STORAGE_KEY,
        JSON.stringify({
          name: worldName,
          theme,
          objects,
          activeZone,
          timeOfDay,
          ambientDecorations,
        })
      )
    } catch {
      console.warn('Could not save your world.')
    }
  }, [
    worldName,
    theme,
    objects,
    activeZone,
    timeOfDay,
    ambientDecorations,
  ])

  const visibleObjects = objects.filter(
    object => object.zone === activeZone
  )

  const currentItems = worldItems.filter(
    item => item.category === category
  )

  function getItem(itemId: string) {
    return worldItems.find(item => item.id === itemId)
  }

  function saveHistory() {
    setHistory(previous => [
      ...previous.slice(-29),
      {
        objects: [...objects],
        blocks,
      },
    ])
  }

  function selectZone(zone: WorldZone) {
    const zoneInfo = worldZones.find(item => item.id === zone)

    if (!zoneInfo) return

    if (completedCount < zoneInfo.unlockAt) {
      setMessage(
        `Complete ${zoneInfo.unlockAt - completedCount} more activities to unlock ${zoneInfo.name}!`
      )
      return
    }

    setActiveZone(zone)
    setSelectedItem(null)
    setMovingObjectId(null)
    setTool('place')
    setMessage(`Welcome to ${zoneInfo.name}!`)
  }

  function clickTile(row: number, col: number) {
    if (mode === 'explore') {
      const object = visibleObjects.find(
        item => item.row === row && item.col === col
      )

      setMessage(
        object
          ? `You found ${getItem(object.itemId)?.name ?? 'an object'}!`
          : 'Explore your beautiful world!'
      )

      return
    }

    const existingObject = visibleObjects.find(
      item => item.row === row && item.col === col
    )

    if (tool === 'remove') {
      if (!existingObject) {
        setMessage('There is nothing to remove here.')
        return
      }

      const item = getItem(existingObject.itemId)

      saveHistory()

      setObjects(previous =>
        previous.filter(item => item.id !== existingObject.id)
      )

      if (item) {
        setBlocks(previous => previous + item.cost)
      }

      setMessage('Object removed. Its blocks have been returned!')
      return
    }

    if (tool === 'rotate') {
      if (!existingObject) {
        setMessage('Select an object to rotate.')
        return
      }

      const item = getItem(existingObject.itemId)

      if (!item?.rotatable) {
        setMessage('This object cannot be rotated.')
        return
      }

      saveHistory()

      setObjects(previous =>
        previous.map(object =>
          object.id === existingObject.id
            ? {
              ...object,
              rotation: (object.rotation + 90) % 360,
            }
            : object
        )
      )

      setMessage('Object rotated!')
      return
    }

    if (tool === 'move') {
      if (!movingObjectId) {
        if (!existingObject) {
          setMessage('First select an object to move.')
          return
        }

        setMovingObjectId(existingObject.id)
        setMessage('Now select an empty tile for your object.')
        return
      }

      if (existingObject) {
        setMessage('Choose an empty tile to move the object.')
        return
      }

      saveHistory()

      setObjects(previous =>
        previous.map(object =>
          object.id === movingObjectId
            ? { ...object, row, col }
            : object
        )
      )

      setMovingObjectId(null)
      setMessage('Object moved successfully!')
      return
    }

    // PLACE TOOL
    if (existingObject) {
      setMessage('This tile is occupied. Choose another tile.')
      return
    }

    if (!selectedItem) {
      setMessage('Choose an item from your inventory first.')
      return
    }

    const item = getItem(selectedItem)

    if (!item) return

    if (
      item.unlockAt !== undefined &&
      completedCount < item.unlockAt
    ) {
      setMessage(
        `Complete ${item.unlockAt - completedCount} more activities to unlock this item.`
      )
      return
    }

    if (blocks < item.cost) {
      setMessage(
        `You need ${item.cost - blocks} more blocks for ${item.name}.`
      )
      return
    }

    saveHistory()

    const newObject: PlacedObject = {
      id: `${Date.now()}-${row}-${col}`,
      itemId: item.id,
      row,
      col,
      zone: activeZone,
      rotation: 0,
    }

    setObjects(previous => [...previous, newObject])
    setBlocks(previous => previous - item.cost)

    setMessage(`${item.name} placed! Great building!`)
  }

  function undoAction() {
    if (history.length === 0) {
      setMessage('There is nothing to undo yet.')
      return
    }

    const previous = history[history.length - 1]

    setObjects(previous.objects)
    setBlocks(previous.blocks)

    setHistory(items => items.slice(0, -1))

    setMessage('Your last action has been undone.')
  }

  function resetWorld() {
    const confirmed = window.confirm(
      'Reset your entire world? All placed objects will be removed and their blocks returned.'
    )

    if (!confirmed) return

    saveHistory()

    const refund = objects.reduce((total, object) => {
      return total + (getItem(object.itemId)?.cost ?? 0)
    }, 0)

    setBlocks(previous => previous + refund)
    setObjects([])
    setSelectedItem(null)
    setMovingObjectId(null)
    setTool('place')

    setMessage('Your world has been reset. You can start again!')
  }

  function changeMode(nextMode: 'build' | 'explore') {
    setMode(nextMode)
    setMovingObjectId(null)
    setSelectedItem(null)
    setTool('place')

    setMessage(
      nextMode === 'build'
        ? 'Build mode: create something wonderful!'
        : 'Explore mode: enjoy your world!'
    )
  }

  function changeTool(
    nextTool: 'place' | 'remove' | 'move' | 'rotate'
  ) {
    setTool(nextTool)
    setSelectedItem(null)
    setMovingObjectId(null)

    const messages = {
      place: 'Choose an item and select a tile.',
      remove: 'Select an object to remove.',
      move: 'Select an object, then choose an empty tile.',
      rotate: 'Select an object to rotate.',
    }

    setMessage(messages[nextTool])
  }
  function changeTime(nextTime: WorldTime) {
    setTimeOfDay(nextTime)

    const messages: Record<WorldTime, string> = {
      morning: 'A fresh morning begins in your world! 🌅',
      afternoon: 'The afternoon sun lights up your world! ☀️',
      evening: 'Your world is glowing in the evening light! 🌇',
      night: 'A peaceful night settles over your world! 🌙',
    }

    setMessage(messages[nextTime])
  }
  const themeClass = `world-theme-${theme}`
  const timeClass = `world-time-${timeOfDay}`
  const zoneClass = `world-zone-${activeZone}`
  return (
    <section
      className={`my-world-section ${themeClass} ${timeClass} ${zoneClass} ${calmWorld ? 'calm-world' : ''
        }`}
      id="world"
    >
      <div className="world-heading">
        <div>
          <p className="eyebrow">YOUR CREATIVE UNIVERSE</p>
          <h2>🌍 My World</h2>
          <p>
            Build, decorate and explore a world that belongs to you.
          </p>
        </div>

        <div className="world-block-counter">
          <span>🧱</span>
          <div>
            <strong>{blocks}</strong>
            <small>Building blocks</small>
          </div>
        </div>
      </div>

      <div className="world-name-bar">
        <label htmlFor="world-name">My world is called</label>

        <input
          id="world-name"
          value={worldName}
          maxLength={30}
          onChange={event => setWorldName(event.target.value)}
          aria-label="World name"
        />

        <span className="autosave-label">
          <span className="save-dot"></span>
          Auto-saved
        </span>
      </div>

      <div className="world-zone-list">
        {worldZones.map(zone => {
          const unlocked = completedCount >= zone.unlockAt

          return (
            <button
              key={zone.id}
              className={`world-zone-button ${activeZone === zone.id ? 'active' : ''
                } ${!unlocked ? 'locked' : ''}`}
              onClick={() => selectZone(zone.id)}
              aria-pressed={activeZone === zone.id}
              title={
                unlocked
                  ? zone.name
                  : `Complete ${zone.unlockAt} activities to unlock`
              }
            >
              <span>{unlocked ? zone.icon : '🔒'}</span>
              <small>{zone.name}</small>
            </button>
          )
        })}
      </div>

      <div className="world-mode-bar">
        <div className="world-mode-switch">
          <button
            className={mode === 'build' ? 'active' : ''}
            onClick={() => changeMode('build')}
          >
            🧱 Build Mode
          </button>

          <button
            className={mode === 'explore' ? 'active' : ''}
            onClick={() => changeMode('explore')}
          >
            🔍 Explore Mode
          </button>
        </div>

        <button
          className={`calm-toggle ${calmWorld ? 'active' : ''}`}
          onClick={() => setCalmWorld(value => !value)}
          aria-pressed={calmWorld}
        >
          ☁️ {calmWorld ? 'Calm On' : 'Calm World'}
        </button>
      </div>
      {/* WORLD ENVIRONMENT CONTROLS */}

      <div className="world-environment-panel">
        <div className="environment-heading">
          <div>
            <p className="eyebrow">SET THE ATMOSPHERE</p>
            <h3>Time of day</h3>
          </div>

          <span className="environment-current">
            {timeOfDay === 'morning' && '🌅 Morning'}
            {timeOfDay === 'afternoon' && '☀️ Afternoon'}
            {timeOfDay === 'evening' && '🌇 Evening'}
            {timeOfDay === 'night' && '🌙 Night'}
          </span>
        </div>

        <div className="time-options">
          <button
            className={timeOfDay === 'morning' ? 'selected' : ''}
            onClick={() => changeTime('morning')}
            aria-pressed={timeOfDay === 'morning'}
          >
            🌅 Morning
          </button>

          <button
            className={timeOfDay === 'afternoon' ? 'selected' : ''}
            onClick={() => changeTime('afternoon')}
            aria-pressed={timeOfDay === 'afternoon'}
          >
            ☀️ Afternoon
          </button>

          <button
            className={timeOfDay === 'evening' ? 'selected' : ''}
            onClick={() => changeTime('evening')}
            aria-pressed={timeOfDay === 'evening'}
          >
            🌇 Evening
          </button>

          <button
            className={timeOfDay === 'night' ? 'selected' : ''}
            onClick={() => changeTime('night')}
            aria-pressed={timeOfDay === 'night'}
          >
            🌙 Night
          </button>
        </div>

        <button
          className={`ambient-toggle ${ambientDecorations ? 'active' : ''
            }`}
          onClick={() =>
            setAmbientDecorations(value => !value)
          }
          aria-pressed={ambientDecorations}
        >
          {ambientDecorations
            ? '✨ Ambient decorations: On'
            : '✨ Ambient decorations: Off'}
        </button>
      </div>
      <div className="world-game-layout">
        <div className="world-board-panel">
          <div className="world-board-top">
            <div>
              <strong>
                {worldZones.find(zone => zone.id === activeZone)?.name}
              </strong>
              <span>
                {mode === 'build' ? 'Your building space' : 'Look around'}
              </span>
            </div>

            <span className="world-weather">☀️</span>
          </div>

          <div className="world-scene">
            <div className="world-sun-decoration">
              {timeOfDay === 'night'
                ? '🌙'
                : timeOfDay === 'evening'
                  ? '🌇'
                  : '☀️'}
            </div>

            <div className="world-cloud-decoration cloud-a">☁️</div>
            <div className="world-cloud-decoration cloud-b">☁️</div>

            {ambientDecorations && !calmWorld && (
              <div className="world-ambient" aria-hidden="true">
                <span className="ambient-bird bird-one">🐦</span>
                <span className="ambient-bird bird-two">🐦</span>
                <span className="ambient-butterfly">🦋</span>
                <span className="ambient-sparkle sparkle-one">✦</span>
                <span className="ambient-sparkle sparkle-two">✧</span>
                <span className="ambient-leaf">🍃</span>
              </div>
            )}
            <div
              className="world-grid"
              role="group"
              aria-label="Isometric building grid"
            >
              {Array.from({ length: 7 }, (_, row) => (
                <div
                  className={`world-grid-row ${row % 2 === 1 ? 'offset' : ''
                    }`}
                  key={row}
                >
                  {Array.from({ length: 7 }, (_, col) => {
                    const object = visibleObjects.find(
                      item =>
                        item.row === row && item.col === col
                    )

                    const item = object
                      ? getItem(object.itemId)
                      : null

                    const isMoving =
                      object?.id === movingObjectId

                    return (
                      <button
                        key={`${row}-${col}`}
                        className={`world-tile ${object ? 'occupied' : ''
                          } ${isMoving ? 'moving' : ''}`}
                        onClick={() => clickTile(row, col)}
                        aria-label={
                          object
                            ? `${item?.name ?? 'Object'} at row ${row + 1}, column ${col + 1}`
                            : `Empty tile, row ${row + 1}, column ${col + 1}`
                        }
                      >
                        {object && item && (
                          <span
                            className={`world-object object-${object.itemId}`}
                            style={{
                              transform: `translate(-50%, -50%) rotate(${object.rotation}deg)`,
                            }}
                          >
                            {item.icon}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>

            <div className="world-island-caption">
              ✦ {worldName || 'Little Haven'} ✦
            </div>
          </div>

          <div className="world-message" role="status">
            <span>💡</span>
            {message}
          </div>

          <div className="world-tools">
            <button
              className={tool === 'place' ? 'selected' : ''}
              onClick={() => changeTool('place')}
              disabled={mode === 'explore'}
            >
              <span>🧱</span>
              Place
            </button>

            <button
              className={tool === 'remove' ? 'selected' : ''}
              onClick={() => changeTool('remove')}
              disabled={mode === 'explore'}
            >
              <span>🗑️</span>
              Remove
            </button>

            <button
              className={tool === 'move' ? 'selected' : ''}
              onClick={() => changeTool('move')}
              disabled={mode === 'explore'}
            >
              <span>✥</span>
              Move
            </button>

            <button
              className={tool === 'rotate' ? 'selected' : ''}
              onClick={() => changeTool('rotate')}
              disabled={mode === 'explore'}
            >
              <span>↻</span>
              Rotate
            </button>

            <button
              onClick={undoAction}
              disabled={history.length === 0 || mode === 'explore'}
            >
              <span>↶</span>
              Undo
            </button>
          </div>
        </div>

        <aside className="world-inventory">
          <div className="inventory-heading">
            <div>
              <p className="eyebrow">YOUR COLLECTION</p>
              <h3>Inventory</h3>
            </div>
            <span>🎒</span>
          </div>

          <div className="inventory-categories">
            {worldCategories.map(itemCategory => (
              <button
                key={itemCategory}
                className={
                  category === itemCategory ? 'active' : ''
                }
                onClick={() => {
                  setCategory(itemCategory)
                  setSelectedItem(null)
                  setTool('place')
                }}
              >
                {itemCategory}
              </button>
            ))}
          </div>

          <div className="inventory-items">
            {currentItems.map(item => {
              const locked =
                item.unlockAt !== undefined &&
                completedCount < item.unlockAt

              const canAfford = blocks >= item.cost

              return (
                <button
                  key={item.id}
                  className={`inventory-item ${selectedItem === item.id ? 'selected' : ''
                    } ${locked ? 'locked' : ''}`}
                  disabled={locked || !canAfford || mode === 'explore'}
                  onClick={() => {
                    setSelectedItem(item.id)
                    setTool('place')
                    setMessage(
                      `${item.name} selected. Now click an empty tile!`
                    )
                  }}
                >
                  <span className="inventory-item-icon">
                    {locked ? '🔒' : item.icon}
                  </span>

                  <span className="inventory-item-name">
                    {item.name}
                  </span>

                  <span className="inventory-item-cost">
                    {locked
                      ? `Unlock at ${item.unlockAt}`
                      : `🧱 ${item.cost}`}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="inventory-tip">
            <strong>💡 Building tip</strong>
            <p>
              Choose an item, then click an empty tile on your
              island. You can move or remove objects whenever
              you like.
            </p>
          </div>
        </aside>
      </div>

      <div className="world-customisation">
        <div>
          <p className="eyebrow">MAKE IT YOURS</p>
          <h3>Island themes</h3>
          <p>Choose the atmosphere of your world.</p>
        </div>

        <div className="theme-options">
          <button
            className={theme === 'green' ? 'selected' : ''}
            onClick={() => setTheme('green')}
          >
            🌿 Green Meadow
          </button>

          <button
            className={theme === 'sunset' ? 'selected' : ''}
            onClick={() => setTheme('sunset')}
          >
            🌅 Sunset Island
          </button>

          <button
            className={theme === 'snow' ? 'selected' : ''}
            onClick={() => setTheme('snow')}
          >
            ❄️ Snowy World
          </button>
        </div>
      </div>

      <div className="world-progress">
        <div>
          <p className="eyebrow">YOUR JOURNEY</p>
          <h3>World progress</h3>
        </div>

        <div className="world-progress-stats">
          <span>🌱 {completedCount} activities completed</span>
          <span>🏗️ {objects.length} objects placed</span>
          <span>
            🗺️{' '}
            {worldZones.filter(
              zone => completedCount >= zone.unlockAt
            ).length}{' '}
            / 5 areas unlocked
          </span>
        </div>
      </div>

      <div className="world-footer-actions">
        <span>Progress is saved automatically ✨</span>

        <button
          className="world-reset-button"
          onClick={resetWorld}
        >
          Reset entire world
        </button>
      </div>
    </section>
  )
}

// --------------------------------------------------
// MEMORY GARDEN
// --------------------------------------------------

function MemoryGarden({
  onComplete,
  onExit,
}: {
  onComplete: () => boolean
  onExit: () => void
}) {
  const gardenEmojis = [
    '🌻', '🌳', '🦋', '🌷', '🐝',
    '🍄', '🌈', '🐞', '🌿',
  ]

  const pairCounts: Record<Level, number> = {
    Easy: 3,
    Medium: 6,
    Hard: 9,
  }

  function createCards(level: Level): MemoryCard[] {
    const selected = gardenEmojis.slice(
      0,
      pairCounts[level]
    )

    return [...selected, ...selected]
      .map((emoji, index) => ({
        id: index,
        emoji,
      }))
      .sort(() => Math.random() - 0.5)
  }

  function loadBestMoves(): BestMoves {
    try {
      const saved = localStorage.getItem(
        'mindcraft-best-moves'
      )

      if (saved) {
        return {
          Easy: null,
          Medium: null,
          Hard: null,
          ...JSON.parse(saved),
        }
      }
    } catch {
      console.warn('Could not load saved best moves.')
    }

    return {
      Easy: null,
      Medium: null,
      Hard: null,
    }
  }

  function loadNumber(key: string): number {
    try {
      const saved = localStorage.getItem(key)
      return saved ? Number(saved) || 0 : 0
    } catch {
      return 0
    }
  }

  const [difficulty, setDifficulty] =
    useState<Level>('Easy')

  const [cards, setCards] = useState<MemoryCard[]>(
    () => createCards('Easy')
  )

  const [flippedCards, setFlippedCards] =
    useState<number[]>([])

  const [matchedCards, setMatchedCards] =
    useState<number[]>([])

  const [moves, setMoves] = useState(0)
  const [checking, setChecking] = useState(false)

  const [rewardCollected, setRewardCollected] =
    useState(false)

  const [rewardEarned, setRewardEarned] =
    useState(false)

  const [bestMoves, setBestMoves] =
    useState<BestMoves>(loadBestMoves)

  const [gamesCompleted, setGamesCompleted] =
    useState(() =>
      loadNumber('mindcraft-games-completed')
    )

  const [totalMoves, setTotalMoves] =
    useState(() =>
      loadNumber('mindcraft-total-moves')
    )

  function startGame(level: Level) {
    setDifficulty(level)
    setCards(createCards(level))
    setFlippedCards([])
    setMatchedCards([])
    setMoves(0)
    setChecking(false)
    setRewardCollected(false)
    setRewardEarned(false)
  }

  function collectReward() {
    if (rewardCollected) return

    const updatedBest: BestMoves = {
      ...bestMoves,
      [difficulty]:
        bestMoves[difficulty] === null ||
          moves < bestMoves[difficulty]!
          ? moves
          : bestMoves[difficulty],
    }

    const updatedGames = gamesCompleted + 1
    const updatedTotalMoves = totalMoves + moves

    setBestMoves(updatedBest)
    setGamesCompleted(updatedGames)
    setTotalMoves(updatedTotalMoves)

    try {
      localStorage.setItem(
        'mindcraft-best-moves',
        JSON.stringify(updatedBest)
      )

      localStorage.setItem(
        'mindcraft-games-completed',
        String(updatedGames)
      )

      localStorage.setItem(
        'mindcraft-total-moves',
        String(updatedTotalMoves)
      )
    } catch {
      console.warn('Could not save game statistics.')
    }

    const earned = onComplete()

    setRewardEarned(earned)
    setRewardCollected(true)
  }

  function flipCard(id: number) {
    if (
      checking ||
      flippedCards.includes(id) ||
      matchedCards.includes(id) ||
      rewardCollected
    ) {
      return
    }

    const nextFlipped = [...flippedCards, id]

    setFlippedCards(nextFlipped)

    if (nextFlipped.length === 2) {
      setMoves(previous => previous + 1)
      setChecking(true)

      const first = cards.find(
        card => card.id === nextFlipped[0]
      )

      const second = cards.find(
        card => card.id === nextFlipped[1]
      )

      if (first?.emoji === second?.emoji) {
        setMatchedCards(previous => [
          ...previous,
          ...nextFlipped,
        ])

        setFlippedCards([])
        setChecking(false)
      } else {
        window.setTimeout(() => {
          setFlippedCards([])
          setChecking(false)
        }, 900)
      }
    }
  }

  const totalPairs = pairCounts[difficulty]

  const gameFinished =
    matchedCards.length === cards.length

  return (
    <div className="memory-game">
      <h2>🌱 Memory Garden</h2>

      <p>
        Choose your challenge and grow your garden!
      </p>

      <div className="game-stats-strip">
        <div>
          <strong>{gamesCompleted}</strong>
          <span>Games completed</span>
        </div>

        <div>
          <strong>{totalMoves}</strong>
          <span>Total moves</span>
        </div>

        <div>
          <strong>{bestMoves[difficulty] ?? '—'}</strong>
          <span>{difficulty} best</span>
        </div>
      </div>

      <div className="difficulty-options">
        {(['Easy', 'Medium', 'Hard'] as Level[]).map(
          level => (
            <button
              key={level}
              className={`difficulty-button ${difficulty === level ? 'selected' : ''
                }`}
              onClick={() => startGame(level)}
              aria-pressed={difficulty === level}
            >
              {level}
              <span>{pairCounts[level]} pairs</span>
            </button>
          )
        )}
      </div>

      <div className="memory-info">
        <span>Moves: {moves}</span>

        <span>
          Pairs: {matchedCards.length / 2} / {totalPairs}
        </span>

        <span>
          Best: {bestMoves[difficulty] ?? '—'}
        </span>
      </div>

      <div className="memory-grid">
        {cards.map(card => {
          const isRevealed =
            flippedCards.includes(card.id) ||
            matchedCards.includes(card.id)

          const isMatched =
            matchedCards.includes(card.id)

          return (
            <button
              key={card.id}
              className={`memory-card ${isRevealed ? 'revealed' : ''
                } ${isMatched ? 'matched' : ''}`}
              onClick={() => flipCard(card.id)}
              disabled={
                checking ||
                isMatched ||
                rewardCollected
              }
              aria-label={
                isRevealed
                  ? `Card showing ${card.emoji}`
                  : 'Hidden memory card'
              }
            >
              {isRevealed ? card.emoji : '?'}
            </button>
          )
        })}
      </div>

      {gameFinished && (
        <div className="game-complete celebration">
          {!rewardCollected ? (
            <>
              <h3>🎉 Garden completed!</h3>

              <p>
                You found all {totalPairs} pairs in {moves} moves!
              </p>

              <p>
                Every completed challenge is a little achievement.
              </p>

              <button
                className="primary-button"
                onClick={collectReward}
              >
                Collect my reward ✨
              </button>
            </>
          ) : (
            <div className="reward-summary">
              <div className="reward-star">⭐</div>

              <h3>Wonderful work, Explorer!</h3>

              <p>
                You completed the {difficulty} Memory Garden!
              </p>

              {rewardEarned ? (
                <>
                  <p>Your new rewards:</p>

                  <div className="reward-values">
                    <div>
                      <strong>+10</strong>
                      <span>Star points</span>
                    </div>

                    <div>
                      <strong>+1</strong>
                      <span>Building block</span>
                    </div>
                  </div>
                </>
              ) : (
                <p>
                  You've already collected the reward for this
                  activity. Your game statistics have still
                  been updated!
                </p>
              )}

              <p>
                Your best score: {bestMoves[difficulty]} moves
              </p>

              <div className="reward-actions">
                <button
                  className="primary-button"
                  onClick={() => startGame(difficulty)}
                >
                  Play again ↻
                </button>

                <button
                  className="restart-button"
                  onClick={onExit}
                >
                  Back to dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {!gameFinished && (
        <button
          className="restart-button"
          onClick={() => startGame(difficulty)}
        >
          ↻ Restart game
        </button>
      )}
    </div>
  )
}

export default App
