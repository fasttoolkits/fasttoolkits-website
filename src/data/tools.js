// Static initial ordering, broad everyday usefulness and simplicity first.
// Not based on real usage data yet. Once actual tool usage analytics
// builds up, this order can be revisited using real numbers instead of judgment.
const tools = [
  {
    name: 'BMI Calculator',
    description: 'Enter your height and weight to calculate your BMI and see your weight category.',
    path: '/bmi-calculator',
    category: 'Health',
    keywords: ['bmi', 'body mass index', 'health', 'weight'],
  },
  {
    name: 'Percentage Calculator',
    description: 'Enter two numbers to calculate a percentage, increase, or decrease.',
    path: '/percentage-calculator',
    category: 'Math',
    keywords: ['percentage', 'percent', 'math'],
  },
  {
    name: 'Password Generator',
    description: 'Create a strong, random password instantly by choosing your own options.',
    path: '/password-generator',
    category: 'Security',
    keywords: ['password', 'generator', 'security'],
  },
  {
    name: 'Tip Calculator',
    description: 'Enter your bill amount to calculate the tip and total, then split it between any number of people.',
    path: '/tip-calculator',
    category: 'Everyday',
    keywords: ['tip', 'gratuity', 'bill split'],
  },
  {
    name: 'Unit Converter',
    description: 'Convert between common units of measurement.',
    path: '/unit-converter',
    category: 'Everyday',
    keywords: ['unit', 'conversion', 'measurement'],
  },
  {
    name: 'QR Code Generator',
    description: 'Create a scannable QR code from any text or link.',
    path: '/qr-code-generator',
    category: 'Utility',
    keywords: ['qr code', 'generator', 'scan'],
  },
  {
    name: 'Word Counter',
    description: 'Count words, characters, and sentences in your text.',
    path: '/word-counter',
    category: 'Writing',
    keywords: ['word count', 'character count', 'text'],
  },
  {
    name: 'Age Calculator',
    description: 'Enter your date of birth to find your exact age.',
    path: '/age-calculator',
    category: 'Everyday',
    keywords: ['age', 'birthday', 'date calculator'],
  },
  {
    name: 'Loan Calculator',
    description: 'Estimate monthly payments and total interest on a loan.',
    path: '/loan-calculator',
    category: 'Finance',
    keywords: ['loan', 'interest', 'payment', 'finance'],
  },
  {
    name: 'Color Picker',
    description: 'Pick colors and get their HEX, RGB, and HSL values.',
    path: '/color-picker',
    category: 'Design',
    keywords: ['color', 'picker', 'hex', 'rgb'],
  },
]

export default tools
