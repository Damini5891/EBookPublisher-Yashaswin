export const APP_NAME = 'PageCraft';
export const APP_TAGLINE = 'Transform Your Words Into Published Masterpieces';

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/pagecraft',
  twitter: 'https://twitter.com/pagecraft',
  instagram: 'https://instagram.com/pagecraft',
  linkedin: 'https://linkedin.com/company/pagecraft',
};

export const CONTACT_INFO = {
  email: 'support@pagecraft.com',
  phone: '+1 (555) 123-4567',
  address: '123 Publishing Lane, Suite 101, San Francisco, CA 94107',
};

export const BUSINESS_HOURS = [
  { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
  { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
  { day: 'Sunday', hours: 'Closed' },
];

export const BOOK_GENRES = [
  'Fiction',
  'Fantasy', 
  'Science Fiction',
  'Romance',
  'Mystery', 
  'Non-Fiction',
  'Business',
  'Biography',
  'Self-Help',
  'History',
];

export const PUBLISHING_PLANS = [
  {
    name: 'Basic',
    description: 'Perfect for new authors',
    price: 99,
    priceUnit: 'book',
    features: [
      { name: 'Basic formatting & conversion', included: true },
      { name: 'Standard cover design', included: true },
      { name: 'Distribution to major stores', included: true },
      { name: '70% royalty rate', included: true },
      { name: 'Marketing assistance', included: false },
      { name: 'Professional editing', included: false }
    ],
    popular: false,
  },
  {
    name: 'Premium',
    description: 'For serious authors',
    price: 249,
    priceUnit: 'book',
    features: [
      { name: 'Advanced formatting & conversion', included: true },
      { name: 'Custom cover design', included: true },
      { name: 'Distribution to major stores', included: true },
      { name: '80% royalty rate', included: true },
      { name: 'Basic marketing assistance', included: true },
      { name: 'Professional editing', included: false }
    ],
    popular: true,
  },
  {
    name: 'Professional',
    description: 'Complete publishing solution',
    price: 499,
    priceUnit: 'book',
    features: [
      { name: 'Premium formatting & conversion', included: true },
      { name: 'Professional cover design', included: true },
      { name: 'Global distribution', included: true },
      { name: '85% royalty rate', included: true },
      { name: 'Comprehensive marketing', included: true },
      { name: 'Professional editing', included: true }
    ],
    popular: false,
  }
];

export const PUBLISHING_STEPS = [
  {
    number: 1,
    title: 'Upload Manuscript',
    description: 'Register and upload your manuscript in various formats including DOC, DOCX, or PDF.'
  },
  {
    number: 2,
    title: 'Edit & Format',
    description: 'Use our editing tools or hire our professional editors to perfect your manuscript.'
  },
  {
    number: 3,
    title: 'Design Cover',
    description: 'Create an eye-catching cover with our design tools or work with our designers.'
  },
  {
    number: 4,
    title: 'Publish & Sell',
    description: 'Publish your e-book and start selling through our bookstore and partner platforms.'
  }
];

export const FEATURES = [
  {
    icon: 'ri-edit-line',
    title: 'Manuscript Editing',
    description: 'Professional editing tools including AI-driven suggestions to polish your manuscript.'
  },
  {
    icon: 'ri-book-open-line',
    title: 'Professional Publishing',
    description: 'Convert your manuscript into various e-book formats compatible with all devices.'
  },
  {
    icon: 'ri-store-line',
    title: 'Global Distribution',
    description: 'Distribute your e-book to major online bookstores and reach readers worldwide.'
  },
  {
    icon: 'ri-line-chart-line',
    title: 'Sales Tracking',
    description: 'Real-time analytics dashboard to monitor your book\'s performance and sales.'
  },
  {
    icon: 'ri-palette-line',
    title: 'Cover Design',
    description: 'Professional cover design tools and templates to make your book stand out.'
  },
  {
    icon: 'ri-money-dollar-circle-line',
    title: 'Royalty Management',
    description: 'Transparent royalty calculations and timely payments directly to your account.'
  }
];

export const TESTIMONIALS = [
  {
    name: 'Robert Thompson',
    role: 'Fantasy Author',
    rating: 5,
    text: 'PageCraft made my publishing dreams a reality. The platform is intuitive, the support team is responsive, and the results exceeded my expectations. I\'ve now published three books through them!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Jennifer Williams',
    role: 'Memoir Writer',
    rating: 5,
    text: 'As a first-time author, I was intimidated by the publishing process. PageCraft guided me every step of the way. Their tools for formatting and cover design made everything simple.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'David Rodriguez',
    role: 'Business Author',
    rating: 4.5,
    text: 'The marketing tools and analytics that PageCraft offers have helped me understand my readers better and grow my audience. My sales have increased by 40% since using their platform.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80'
  }
];

export const FEATURED_AUTHOR = {
  name: 'Michelle Davies',
  role: 'Bestselling Author',
  bio: 'Michelle Davies is a bestselling author of contemporary fiction with over 500,000 copies sold worldwide. Her latest novel "Echoes of Tomorrow" was published through PageCraft and reached #1 on multiple bestseller lists.',
  quote: 'PageCraft\'s platform made my publishing journey seamless. From manuscript formatting to distribution, their tools and support team exceeded my expectations. I couldn\'t be happier with the results.',
  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
  stats: [
    { label: 'Books Published', value: '12' },
    { label: 'Copies Sold', value: '500k+' },
    { label: 'Average Rating', value: '4.8' }
  ]
};
