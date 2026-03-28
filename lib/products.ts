export interface ForgeScore {
  revenuePotential: number
  deployTime: number
  complexity: number
}

export interface Product {
  id: string
  name: string
  category: 'ready' | 'custom' | 'idea'
  emoji: string
  description: string
  price: number
  priceLabel: string
  telegramDemoLink: string
  forgeScore: ForgeScore
  borderColor: 'accent' | 'blue' | 'gold'
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Coach AI Assistant',
    category: 'custom',
    emoji: '🤖',
    description: 'Ai mentor trained on your content and methodology that guides your students 24/7 through your programs.',
    price: 1500,
    priceLabel: '$1,500',
    telegramDemoLink: 'https://t.me/yourforgeai',
    forgeScore: {
      revenuePotential: 85,
      deployTime: 90,
      complexity: 45,
    },
    borderColor: 'accent',
  },
  {
    id: '2',
    name: 'Sports Prediction Telegram Bot',
    category: 'ready',
    emoji: '⚽',
    description: 'AI-powered sports prediction engine with real-time analysis and accuracy tracking.',
    price: 800,
    priceLabel: '$800',
    telegramDemoLink: 'https://t.me/yourforgeai',
    forgeScore: {
      revenuePotential: 75,
      deployTime: 85,
      complexity: 55,
    },
    borderColor: 'blue',
  },
  {
    id: '3',
    name: 'AI Agent for Law Firms',
    category: 'custom',
    emoji: '⚖️',
    description: 'Custom-built AI agent for document review, legal research, and case analysis.',
    price: 1500,
    priceLabel: 'From $1,500',
    telegramDemoLink: 'https://t.me/yourforgeai/4',
    forgeScore: {
      revenuePotential: 95,
      deployTime: 60,
      complexity: 85,
    },
    borderColor: 'gold',
  },
  {
    id: '4',
    name: 'Web Scraping Tool',
    category: 'ready',
    emoji: '🕷️',
    description: 'High-performance web scraping solution with proxy rotation and data extraction.',
    price: 500,
    priceLabel: '$500',
    telegramDemoLink: 'https://t.me/yourforgeai',
    forgeScore: {
      revenuePotential: 65,
      deployTime: 95,
      complexity: 35,
    },
    borderColor: 'accent',
  },
  {
    id: '5',
    name: 'AI Personal Assistant SaaS',
    category: 'idea',
    emoji: '🤖',
    description: 'Innovative SaaS platform for personal AI assistant with multi-modal capabilities.',
    price: 300,
    priceLabel: '$300',
    telegramDemoLink: 'https://t.me/yourforgeai',
    forgeScore: {
      revenuePotential: 92,
      deployTime: 40,
      complexity: 72,
    },
    borderColor: 'blue',
  },
  {
    id: '6',
    name: 'Email Outreach Automation',
    category: 'custom',
    emoji: '📧',
    description: 'Custom automation framework for targeted email campaigns with AI personalization.',
    price: 500,
    priceLabel: 'From $500',
    telegramDemoLink: 'https://t.me/yourforgeai',
    forgeScore: {
      revenuePotential: 80,
      deployTime: 75,
      complexity: 50,
    },
    borderColor: 'gold',
  },
]

export const productCategories = [
  { id: 'all', label: 'All' },
  { id: 'ready', label: 'Ready to Buy' },
  { id: 'custom', label: 'Custom Builds' },
  { id: 'idea', label: 'Ideas for Sale' },
]
