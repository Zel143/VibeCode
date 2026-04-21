import {
  Calculator, Hash, Shuffle, PenTool, BookOpen, Search,
  MessageCircle, Grid3X3
} from 'lucide-react';

export const CATEGORIES = [
  { id: 'math', label: 'Math', color: 'var(--cat-math)', icon: '🔢' },
  { id: 'reading', label: 'Reading', color: 'var(--cat-reading)', icon: '📖' },
  { id: 'writing', label: 'Writing', color: 'var(--cat-writing)', icon: '✍️' },
  { id: 'speaking', label: 'Speaking', color: 'var(--cat-speaking)', icon: '🗣️' },
  { id: 'memory', label: 'Memory', color: 'var(--cat-memory)', icon: '🧠' },
];

export const GAMES = [
  {
    id: 'speed-math',
    name: 'Speed Math',
    category: 'math',
    icon: Calculator,
    emoji: '⚡',
    description: 'Solve arithmetic problems against the clock',
    color: '#fbbf24',
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
  },
  {
    id: 'number-memory',
    name: 'Number Memory',
    category: 'math',
    icon: Hash,
    emoji: '🔢',
    description: 'Remember increasingly long number sequences',
    color: '#fb923c',
    gradient: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
  },
  {
    id: 'word-scramble',
    name: 'Word Scramble',
    category: 'writing',
    icon: Shuffle,
    emoji: '🔀',
    description: 'Unscramble letters to form words',
    color: '#a78bfa',
    gradient: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
  },
  {
    id: 'grammar-fix',
    name: 'Grammar Fix',
    category: 'writing',
    icon: PenTool,
    emoji: '✏️',
    description: 'Find and fix grammatical errors',
    color: '#c084fc',
    gradient: 'linear-gradient(135deg, #c084fc 0%, #a855f7 100%)',
  },
  {
    id: 'speed-reader',
    name: 'Speed Reader',
    category: 'reading',
    icon: BookOpen,
    emoji: '📚',
    description: 'Read fast, answer comprehension questions',
    color: '#22d3ee',
    gradient: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
  },
  {
    id: 'word-finder',
    name: 'Word Finder',
    category: 'reading',
    icon: Search,
    emoji: '🔍',
    description: 'Find target words in a grid of text',
    color: '#67e8f9',
    gradient: 'linear-gradient(135deg, #67e8f9 0%, #22d3ee 100%)',
  },
  {
    id: 'articulate',
    name: 'Articulate',
    category: 'speaking',
    icon: MessageCircle,
    emoji: '💬',
    description: 'Explain topics clearly and concisely',
    color: '#f472b6',
    gradient: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
  },
  {
    id: 'sequence-memory',
    name: 'Sequence Memory',
    category: 'memory',
    icon: Grid3X3,
    emoji: '🧩',
    description: 'Remember and reproduce tile sequences',
    color: '#34d399',
    gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
  },
];

export const LEAGUE_TIERS = [
  { id: 'bronze', name: 'Bronze', color: '#cd7f32', icon: '🥉', minXP: 0 },
  { id: 'silver', name: 'Silver', color: '#c0c0c0', icon: '🥈', minXP: 500 },
  { id: 'gold', name: 'Gold', color: '#ffd700', icon: '🥇', minXP: 1500 },
  { id: 'platinum', name: 'Platinum', color: '#e5e4e2', icon: '💎', minXP: 3000 },
  { id: 'diamond', name: 'Diamond', color: '#b9f2ff', icon: '👑', minXP: 5000 },
];

export const ACHIEVEMENTS = [
  { id: 'first-game', name: 'First Step', description: 'Complete your first game', icon: '🎮', condition: (d) => Object.values(d.gameStats).some(s => s.gamesPlayed > 0) },
  { id: 'streak-3', name: 'Getting Started', description: 'Achieve a 3-day streak', icon: '🔥', condition: (d) => d.streak.best >= 3 },
  { id: 'streak-7', name: 'On Fire', description: 'Achieve a 7-day streak', icon: '🔥', condition: (d) => d.streak.best >= 7 },
  { id: 'streak-30', name: 'Unstoppable', description: 'Achieve a 30-day streak', icon: '⚡', condition: (d) => d.streak.best >= 30 },
  { id: 'xp-100', name: 'Century', description: 'Earn 100 total XP', icon: '💯', condition: (d) => d.xp.total >= 100 },
  { id: 'xp-500', name: 'Rising Star', description: 'Earn 500 total XP', icon: '⭐', condition: (d) => d.xp.total >= 500 },
  { id: 'xp-1000', name: 'Brain Power', description: 'Earn 1000 total XP', icon: '🧠', condition: (d) => d.xp.total >= 1000 },
  { id: 'all-games', name: 'Explorer', description: 'Play every game at least once', icon: '🗺️', condition: (d) => GAMES.every(g => d.gameStats[g.id]?.gamesPlayed > 0) },
  { id: 'high-score', name: 'High Achiever', description: 'Score 90%+ in any game', icon: '🏆', condition: () => false },
  { id: 'master-5', name: 'Difficulty Master', description: 'Reach difficulty level 5 in any game', icon: '🎯', condition: (d) => Object.values(d.gameStats).some(s => s.difficulty >= 5) },
  { id: 'silver-league', name: 'Silver League', description: 'Reach Silver league', icon: '🥈', condition: (d) => ['silver','gold','platinum','diamond'].includes(d.league.tier) },
  { id: 'gold-league', name: 'Gold League', description: 'Reach Gold league', icon: '🥇', condition: (d) => ['gold','platinum','diamond'].includes(d.league.tier) },
];

export const GRAMMAR_SENTENCES = [
  { wrong: "Me and him went to the store.", correct: "He and I went to the store.", error: "Subject pronoun" },
  { wrong: "Their going to the park later.", correct: "They're going to the park later.", error: "Their/They're" },
  { wrong: "She don't like coffee.", correct: "She doesn't like coffee.", error: "Subject-verb agreement" },
  { wrong: "I could of done it better.", correct: "I could have done it better.", error: "Could of/Could have" },
  { wrong: "The data shows that results is improving.", correct: "The data shows that results are improving.", error: "Subject-verb agreement" },
  { wrong: "Between you and I, this is wrong.", correct: "Between you and me, this is wrong.", error: "Object pronoun" },
  { wrong: "Everyone should bring their own lunch.", correct: "Everyone should bring his or her own lunch.", error: "Pronoun agreement" },
  { wrong: "He runs more faster than me.", correct: "He runs faster than me.", error: "Double comparative" },
  { wrong: "I seen the movie yesterday.", correct: "I saw the movie yesterday.", error: "Past tense" },
  { wrong: "The reason is because he was late.", correct: "The reason is that he was late.", error: "Redundancy" },
  { wrong: "We was going to the mall.", correct: "We were going to the mall.", error: "Subject-verb agreement" },
  { wrong: "Her and me are best friends.", correct: "She and I are best friends.", error: "Subject pronoun" },
  { wrong: "This is the most unique solution.", correct: "This is a unique solution.", error: "Absolute adjective" },
  { wrong: "I feel badly about what happened.", correct: "I feel bad about what happened.", error: "Linking verb" },
  { wrong: "Lets go to the party tonight.", correct: "Let's go to the party tonight.", error: "Apostrophe" },
  { wrong: "Your the best person for this job.", correct: "You're the best person for this job.", error: "Your/You're" },
  { wrong: "The team have decided to change.", correct: "The team has decided to change.", error: "Collective noun" },
  { wrong: "She gave it to John and I.", correct: "She gave it to John and me.", error: "Object pronoun" },
  { wrong: "Its important to study every day.", correct: "It's important to study every day.", error: "Its/It's" },
  { wrong: "He did good on the exam.", correct: "He did well on the exam.", error: "Good/Well" },
];

export const SPEED_READER_PASSAGES = [
  {
    text: "The human brain is the most complex organ in the body. It contains approximately 86 billion neurons, each connected to thousands of others, creating a vast network of neural pathways. Every thought, memory, and emotion we experience is the result of electrical and chemical signals traveling through this network. The brain consumes about 20% of the body's energy despite being only 2% of its weight.",
    questions: [
      { q: "How many neurons does the brain contain?", options: ["86 million", "86 billion", "8.6 billion", "860 billion"], answer: 1 },
      { q: "What percentage of body energy does the brain use?", options: ["2%", "10%", "20%", "30%"], answer: 2 },
      { q: "What creates neural pathways?", options: ["Blood vessels", "Connected neurons", "Oxygen flow", "Brain cells dividing"], answer: 1 },
    ]
  },
  {
    text: "Deep in the ocean, at depths below 1,000 meters, exists the midnight zone. Here, no sunlight penetrates, and the pressure is crushing. Yet life thrives in extraordinary ways. Bioluminescent creatures produce their own light through chemical reactions, creating an otherworldly glow. Some deep-sea fish have evolved transparent bodies, while others sport enormous eyes to capture every available photon.",
    questions: [
      { q: "At what depth does the midnight zone begin?", options: ["500 meters", "1,000 meters", "2,000 meters", "5,000 meters"], answer: 1 },
      { q: "How do bioluminescent creatures produce light?", options: ["Electrical impulses", "Chemical reactions", "Solar energy storage", "Radioactivity"], answer: 1 },
      { q: "Why do some deep-sea fish have enormous eyes?", options: ["To scare predators", "To capture photons", "To see in infrared", "For echolocation"], answer: 1 },
    ]
  },
  {
    text: "The invention of the printing press by Johannes Gutenberg around 1440 revolutionized the spread of knowledge. Before this invention, books were laboriously copied by hand, making them expensive and rare. A single Bible could take a scribe three years to complete. The printing press could produce pages at an unprecedented rate, dropping the cost of books by roughly 80%. Within 50 years, over 20 million volumes had been printed across Europe.",
    questions: [
      { q: "When was the printing press invented?", options: ["Around 1340", "Around 1440", "Around 1540", "Around 1640"], answer: 1 },
      { q: "How long could it take a scribe to copy a Bible?", options: ["One year", "Two years", "Three years", "Five years"], answer: 2 },
      { q: "By how much did book costs drop?", options: ["50%", "60%", "70%", "80%"], answer: 3 },
    ]
  },
  {
    text: "Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still perfectly edible. This remarkable preservation is due to honey's unique chemistry. Its low moisture content and acidic pH create an inhospitable environment for bacteria. Additionally, bees add an enzyme called glucose oxidase, which produces small amounts of hydrogen peroxide. The sugar concentration is so high that it draws water out of any microorganism through osmosis.",
    questions: [
      { q: "How old was the honey found in Egyptian tombs?", options: ["1,000 years", "2,000 years", "3,000 years", "5,000 years"], answer: 2 },
      { q: "What enzyme do bees add to honey?", options: ["Amylase", "Glucose oxidase", "Lipase", "Catalase"], answer: 1 },
      { q: "What process kills microorganisms in honey?", options: ["Fermentation", "Oxidation", "Osmosis", "Pasteurization"], answer: 2 },
    ]
  },
];

export const WORD_LISTS = {
  easy: ['apple','beach','chair','dance','eagle','flame','grape','heart','ivory','jolly','knife','lemon','music','novel','ocean','piano','queen','river','stone','tiger'],
  medium: ['ancient','balance','capture','delight','embrace','flutter','glimpse','harvest','insight','journal','kinetic','lantern','mystery','nurture','olympia','phantom','quilted','radiant','shuttle','triumph'],
  hard: ['abstract','backbone','catalyst','diligent','eloquent','flourish','gradient','heritage','innovate','jubilant','keystone','luminous','marathon','navigate','obstacle','paradigm','quintile','resonate','spectrum','tenacity'],
};

export const ARTICULATE_TOPICS = {
  simple: [
    "Why is breakfast important?",
    "Describe your favorite hobby.",
    "What makes a good friend?",
    "Explain what rain is to a child.",
    "Why do people exercise?",
    "What is your favorite season and why?",
    "Describe the ideal weekend.",
    "Why is reading important?",
  ],
  moderate: [
    "Explain how the internet works.",
    "Why is biodiversity important?",
    "What are the pros and cons of social media?",
    "Explain the concept of inflation.",
    "Why is sleep important for learning?",
    "What makes a leader effective?",
    "Explain the scientific method.",
    "Why do different cultures have different customs?",
  ],
  complex: [
    "Explain the trolley problem and its implications.",
    "What is the relationship between correlation and causation?",
    "Discuss the impact of AI on employment.",
    "Explain the concept of opportunity cost.",
    "What are the ethical implications of genetic engineering?",
    "How does cognitive bias affect decision making?",
    "Explain the prisoner's dilemma.",
    "What is the difference between equity and equality?",
  ],
};
