// Shared Sparkclean business facts. Change them here and every page updates.
export const instagramUrl = 'https://www.instagram.com/sparkclean.inc/';

// Google Business Profile link. Left empty on purpose until the site is connected
// to the custom domain and the profile (see the owner checklist).
export const googleReviewsUrl = '';

export const quoteEmail = 'companysparkclean@gmail.com';

// One service-area list for the home page, schema, and contact page.
export const serviceAreas = [
  { name: 'Concord', href: '/service-areas/concord-ca/' },
  { name: 'Pleasant Hill', href: '/service-areas/pleasant-hill-ca/' },
  { name: 'Martinez', href: '/service-areas/martinez-ca/' },
  { name: 'Walnut Creek', href: '/service-areas/walnut-creek-ca/' },
  { name: 'Lafayette', href: '/service-areas/' },
  { name: 'Moraga', href: '/service-areas/' },
  { name: 'Orinda', href: '/service-areas/' },
  { name: 'Berkeley', href: '/service-areas/' },
  { name: 'San Francisco', href: '/service-areas/' },
];

export const areaServedSchema = serviceAreas.map((area) => `${area.name}, CA`);

// Owner-confirmed facts (Adan, via Andy, 2026-11-13).
export const foundingYear = 2021;
export const recurringFrequencies = 'weekly, every two weeks, or every four weeks';

// Owner-confirmed answers shown on the home page, service pages, and contact page.
export const faqPrice = {
  question: 'How is the price of a cleaning set?',
  answer: 'Pricing depends on your home’s size, its current condition, and how extensive the cleaning needs to be. Recurring cleaning covers lighter, regular upkeep, while deep, move, and post-construction cleaning take more time. Share your home size and what you need, and we’ll quote your home.',
};
export const faqInsured = {
  question: 'Are you bonded and insured?',
  answer: 'Yes. Sparkclean is bonded and insured, and everyone on our team goes through a background check.',
};
export const faqSupplies = {
  question: 'Do you bring your own supplies and equipment?',
  answer: 'Yes. We bring our own cleaning supplies and equipment.',
};
export const faqHome = {
  question: 'Do I need to be home during the cleaning?',
  answer: 'No. We can clean while you’re out. Our cleaners are background-checked, and we’ll agree on how we get in when you book.',
};
export const faqPets = {
  question: 'Are pets okay?',
  answer: 'Yes, pets are welcome. Let us know about them when you request a quote.',
};
export const faqCancel = {
  question: 'What if I need to cancel or reschedule?',
  answer: 'Please let us know at least 24 hours before your appointment.',
};
export const faqScope = {
  question: 'Is there anything you won’t clean?',
  answer: 'If it’s cleaning, just ask. We tailor each visit to what you need. We don’t do repairs or home maintenance.',
};

export const goodToKnowFaqs = [faqPrice, faqInsured, faqSupplies, faqHome, faqPets, faqCancel, faqScope];
