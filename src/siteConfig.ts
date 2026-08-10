export const siteConfig = {
  brand: {
    name: 'Clarke & Hale',
    short: 'C&H',
    tag: 'Attorneys at law',
  },

  nav: [
    { label: 'Practice', target: 'practices' },
    { label: 'Approach', target: 'strategy' },
    { label: 'Results', target: 'evidence' },
    { label: 'Contact', target: 'verdict' },
  ] as const,

  caseMeta: {
    no: '24/07',
    status: 'Confidential',
    opened: 'Opened — 08.2026',
  },

  hero: {
    kicker: 'Independent law firm — London',
    titleLines: ['Legal strategy', 'for decisions', 'that matter.'],
    sub: 'Corporate, disputes, real estate and private capital — handled as one case: yours.',
    cta: 'Request consultation',
    hint: 'Scroll — the file opens',
  },

  practices: {
    kicker: '02 — Practice files',
    items: [
      {
        title: 'Corporate & M&A',
        ref: 'REF 24/07-C',
        desc: 'Company structures, transactions and governance — built to hold under pressure.',
        tags: ['Transactions', 'Governance'],
        image: 'images/practice-corporate.jpg',
      },
      {
        title: 'Dispute Resolution',
        ref: 'REF 24/07-D',
        desc: 'Commercial disputes prepared from day one as if they will be tried.',
        tags: ['Litigation', 'Arbitration'],
        image: 'images/practice-disputes.jpg',
      },
      {
        title: 'Real Estate',
        ref: 'REF 24/07-R',
        desc: 'Acquisitions, development and leasing — documented to the last clause.',
        tags: ['Acquisitions', 'Development'],
        image: 'images/practice-realestate.jpg',
      },
      {
        title: 'Private Clients',
        ref: 'REF 24/07-P',
        desc: 'Wealth, succession and family matters. Discreet by design.',
        tags: ['Succession', 'Wealth'],
        image: 'images/practice-private.jpg',
      },
    ],
  },

  strategy: {
    kicker: '03 — Strategy map',
    steps: [
      {
        title: 'Assess',
        desc: 'We map the matter: facts, exposure, leverage.',
        meta: 'Week 1',
      },
      {
        title: 'Build strategy',
        desc: 'Options become a plan — sequenced, costed, argued.',
        meta: 'Weeks 2–3',
      },
      {
        title: 'Act',
        desc: 'Negotiation, drafting, filing. Every move documented.',
        meta: 'Weeks 3–10',
      },
      {
        title: 'Resolve',
        desc: 'Settlement or judgment — closed on your terms.',
        meta: 'To close',
      },
    ],
  },

  evidence: {
    kicker: '04 — Evidence',
    heading: 'Proof, not promises.',
    quote:
      '“They treated our acquisition like their own case file — nothing left unread.”',
    cite: '— Managing partner, Nordic industrials',
    stats: [
      { value: 15, prefix: '', suffix: '+', label: 'Years of practice' },
      { value: 120, prefix: '€', suffix: 'M+', label: 'Transactions advised' },
      { value: 94, prefix: '', suffix: '%', label: 'Matters resolved before trial' },
      { value: 24, prefix: '', suffix: 'h', label: 'Critical response time' },
    ],
  },

  verdict: {
    kicker: '05 — Verdict',
    titleA: 'Your',
    titleEm: 'next move',
    titleB: 'starts here.',
    sub: 'One conversation is enough to know whether we are the right firm for the matter.',
    cta: 'Request consultation',
  },

  contact: {
    phone: '+44 20 7946 0100',
    email: 'counsel@clarkehale.com',
    office: '14 Inkerman Row, London EC4',
    matters: ['Corporate & M&A', 'Dispute Resolution', 'Real Estate', 'Private Clients', 'Other'],
    successTitle: 'Request received.',
    successRef: 'Reference CH-24/071',
    successNote: 'The file is open. We reply within one business day.',
  },

  images: {
    cover: 'images/cover.jpg',
    evidenceA: 'images/evidence-portrait.jpg',
    evidenceB: 'images/evidence-detail.jpg',
  },

  footer: {
    note: '© 2026 Clarke & Hale LLP. Demonstration website.',
  },
};

export type NavTarget = 'opening' | 'practices' | 'strategy' | 'evidence' | 'verdict';
