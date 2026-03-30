export const gigs = [
  {
    id: 1,
    title: 'Frontend Landing Page Revamp',
    price: 18000,
    category: 'Development',
    skill: 'HTML & CSS',
    level: 'Beginner',
    hours: '6-8 hrs',
    company: 'PixelMint Labs',
    description: 'Build a responsive landing page section with modern styling and basic animations.',
    requiredSkill: 'HTML & CSS'
  },
  {
    id: 2,
    title: 'Interactive Dashboard Widgets',
    price: 32000,
    category: 'Development',
    skill: 'JavaScript',
    level: 'Intermediate',
    hours: '10-14 hrs',
    company: 'DashForge',
    description: 'Create reusable dashboard widgets with filters, counters, and chart interactions.',
    requiredSkill: 'JavaScript'
  },
  {
    id: 3,
    title: 'React Portfolio Builder',
    price: 42000,
    category: 'Development',
    skill: 'React',
    level: 'Intermediate',
    hours: '14-18 hrs',
    company: 'HirePulse',
    description: 'Develop a modular React portfolio with project cards and contact form validation.',
    requiredSkill: 'React'
  },
  {
    id: 4,
    title: 'Mobile App Wireframe Sprint',
    price: 22000,
    category: 'Design',
    skill: 'UI/UX Design',
    level: 'Beginner',
    hours: '8-10 hrs',
    company: 'SketchRoot',
    description: 'Design mobile-first wireframes and clickable prototype screens for a startup app.',
    requiredSkill: 'UI/UX Design'
  },
  {
    id: 5,
    title: 'Backend Data Cleanup Script',
    price: 27000,
    category: 'Data',
    skill: 'Python',
    level: 'Beginner',
    hours: '8-12 hrs',
    company: 'DataNest',
    description: 'Write simple scripts to clean and validate CSV data records for reporting.',
    requiredSkill: 'Python'
  },
  {
    id: 6,
    title: 'Career Blog Enhancement',
    price: 15000,
    category: 'Writing',
    skill: 'HTML & CSS',
    level: 'Beginner',
    hours: '5-7 hrs',
    company: 'GrowthMemo',
    description: 'Improve article layout with heading structure, links, and media embeds.',
    requiredSkill: 'HTML & CSS'
  },
  {
    id: 7,
    title: 'Component Animation Microtasks',
    price: 24000,
    category: 'Design',
    skill: 'JavaScript',
    level: 'Intermediate',
    hours: '7-9 hrs',
    company: 'MotionDock',
    description: 'Add button ripple effects, reveal transitions, and hover micro-interactions.',
    requiredSkill: 'JavaScript'
  },
  {
    id: 8,
    title: 'Client Analytics Report UI',
    price: 35000,
    category: 'Data',
    skill: 'React',
    level: 'Intermediate',
    hours: '10-13 hrs',
    company: 'MetricThread',
    description: 'Create charts and KPI visualizations with responsive interactions for client reports.',
    requiredSkill: 'React'
  }
];

export const learningTracks = {
  'HTML & CSS': {
    notes: [
      'HTML gives structure to your web page and CSS controls its visual style.',
      'A page usually has a head and body. Keep semantic tags like header, main, and footer.',
      'Use headings, paragraphs, images, and links to present content clearly.',
      'Mini task: Create a page with one heading, one image, and one external link.',
      'Common mistakes: skipping alt text, overusing div tags, and inconsistent spacing.'
    ],
    videos: [
      'https://www.youtube.com/embed/qz0aGYrrlhU',
      'https://www.youtube.com/embed/1Rs2ND1ryYc'
    ],
    practiceTask: 'Create a simple webpage with heading, image, and link. Style it with a card layout and soft shadow.',
    quiz: [
      { q: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Text Model Language', 'Hyperlink and Text Markup Language', 'Home Tool Markup Language'], a: 0 },
      { q: 'Which tag is used for a paragraph?', options: ['<paragraph>', '<text>', '<p>', '<pg>'], a: 2 },
      { q: 'Which CSS property changes text color?', options: ['font-color', 'color', 'text-style', 'background-color'], a: 1 },
      { q: 'Which tag adds an image?', options: ['<img>', '<picture>', '<src>', '<image>'], a: 0 },
      { q: 'What is the correct CSS syntax?', options: ['body: color=red;', 'body { color: red; }', '{body: red}', 'body(color:red)'], a: 1 },
      { q: 'Which attribute is required for accessibility in images?', options: ['title', 'alt', 'srcset', 'width'], a: 1 },
      { q: 'How do you link a stylesheet?', options: ['<style href="style.css">', '<link rel="stylesheet" href="style.css">', '<css src="style.css">', '<script src="style.css">'], a: 1 },
      { q: 'Which is semantic HTML?', options: ['<div>', '<section>', '<span>', '<b>'], a: 1 },
      { q: 'What does display: flex do?', options: ['Adds animation', 'Creates a flex formatting context', 'Hides elements', 'Adds margins'], a: 1 },
      { q: 'Best way to make layouts mobile-friendly?', options: ['Fixed width only', 'Media queries', 'Table layouts', 'Inline styles only'], a: 1 }
    ]
  },
  JavaScript: {
    notes: [
      'JavaScript adds behavior and interactivity to websites.',
      'Use variables to store data and functions to organize logic.',
      'Events like click and input help you react to user actions.',
      'Mini task: Build a button that updates a counter on each click.',
      'Common mistakes: forgetting to handle null elements and global variable leaks.'
    ],
    videos: ['https://www.youtube.com/embed/W6NZfCO5SIk'],
    practiceTask: 'Build a search input with live filtering for a list of tasks.',
    quiz: Array.from({ length: 10 }).map((_, i) => ({
      q: `JavaScript Quick Check ${i + 1}: Which keyword declares a block-scoped variable?`,
      options: ['var', 'let', 'const', 'function'],
      a: i % 2 === 0 ? 1 : 2
    }))
  },
  React: {
    notes: [
      'React is a library for building component-based UIs.',
      'Components receive props and can manage state for dynamic behavior.',
      'Keep components small and reusable for maintainability.',
      'Mini task: Build a profile card component with props for name and role.',
      'Common mistakes: mutating state directly and missing list keys.'
    ],
    videos: ['https://www.youtube.com/embed/bMknfKXIFA8'],
    practiceTask: 'Create a reusable card component and render at least 3 cards from data.',
    quiz: Array.from({ length: 10 }).map((_, i) => ({
      q: `React Check ${i + 1}: State updates should be...`,
      options: ['Mutated directly', 'Immutable', 'Synchronous always', 'Stored in CSS'],
      a: 1
    }))
  },
  'UI/UX Design': {
    notes: [
      'UI focuses on visual design, UX focuses on usability and flow.',
      'Hierarchy, spacing, and contrast improve readability.',
      'Prototype early and test with users to spot friction points.',
      'Mini task: Design a clean sign-up form with clear labels.',
      'Common mistakes: too many colors and inconsistent spacing patterns.'
    ],
    videos: ['https://www.youtube.com/embed/c9Wg6Cb_YlU'],
    practiceTask: 'Design a dashboard card set with consistent spacing and typography scale.',
    quiz: Array.from({ length: 10 }).map((_, i) => ({
      q: `UI/UX Check ${i + 1}: Good UX primarily means...`,
      options: ['Many animations', 'Easy and intuitive tasks', 'Complex navigation', 'High saturation colors'],
      a: 1
    }))
  },
  Python: {
    notes: [
      'Python is beginner-friendly and often used for backend and data tasks.',
      'Indentation defines code blocks, so keep spacing consistent.',
      'Use functions to avoid repetitive code and improve readability.',
      'Mini task: Read a list and print only values greater than 10.',
      'Common mistakes: indentation errors and mixing string/int types.'
    ],
    videos: ['https://www.youtube.com/embed/_uQrJ0TkZlc'],
    practiceTask: 'Write a Python function that validates email format using simple checks.',
    quiz: Array.from({ length: 10 }).map((_, i) => ({
      q: `Python Check ${i + 1}: Which symbol starts a comment line?`,
      options: ['//', '#', '--', '/*'],
      a: 1
    }))
  }
};

export const notifications = [
  'New gig: React dashboard fix posted by DashForge.',
  'Your HTML & CSS badge is now visible to recruiters.',
  'Practice streak unlocked: 3-day consistency.',
  'You have 2 unread messages from clients.'
];

export const chatbotHints = [
  'Suggest a 7-day plan to learn JavaScript basics.',
  'Show gigs I can apply for with HTML & CSS.',
  'How can I improve my profile conversion rate?'
];

export const companyGigs = [
  {
    id: 101,
    title: 'E-commerce Cart Page Development',
    price: 45000,
    category: 'Development',
    skill: 'React',
    level: 'Intermediate',
    hours: '20-24 hrs',
    company: 'ShopFlow',
    description: 'Build a fully functional shopping cart with add/remove items, quantity controls, and checkout flow.',
    requiredSkill: 'React',
    status: 'pending',
    submittedDate: '2026-03-28'
  },
  {
    id: 102,
    title: 'Logo Brand Identity Design',
    price: 18000,
    category: 'Design',
    skill: 'UI/UX Design',
    level: 'Beginner',
    hours: '8-10 hrs',
    company: 'BrandStudio',
    description: 'Design a modern logo and brand color palette for a fintech startup.',
    requiredSkill: 'UI/UX Design',
    status: 'pending',
    submittedDate: '2026-03-29'
  },
  {
    id: 103,
    title: 'API Documentation Writing',
    price: 22000,
    category: 'Writing',
    skill: 'JavaScript',
    level: 'Intermediate',
    hours: '12-15 hrs',
    company: 'CloudAPI Inc',
    description: 'Write comprehensive API documentation with code examples and use cases.',
    requiredSkill: 'JavaScript',
    status: 'approved',
    submittedDate: '2026-03-25',
    approvedDate: '2026-03-27'
  },
  {
    id: 104,
    title: 'Database Schema Design',
    price: 35000,
    category: 'Data',
    skill: 'Python',
    level: 'Intermediate',
    hours: '15-18 hrs',
    company: 'DataVault',
    description: 'Design and optimize database schema for a multi-tenant SaaS application.',
    requiredSkill: 'Python',
    status: 'rejected',
    submittedDate: '2026-03-26',
    rejectionReason: 'Scope too large for freelance project'
  },
  {
    id: 105,
    title: 'Mobile App UI Kit',
    price: 38000,
    category: 'Design',
    skill: 'UI/UX Design',
    level: 'Advanced',
    hours: '25-30 hrs',
    company: 'MobileStudio',
    description: 'Create a comprehensive UI kit with 50+ components for iOS and Android.',
    requiredSkill: 'UI/UX Design',
    status: 'pending',
    submittedDate: '2026-03-29'
  }
];
