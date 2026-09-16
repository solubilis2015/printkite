/* =========================================================
   Printkite India — site content data
   Everything here comes from the company brochure.
   Edit this file to add/remove services, clients or portfolio items.

   Each service has:
     cover  — the single static image shown on the home "What we do" card
     images — the gallery used by the service accordion on services.html
   ========================================================= */

const PK_SERVICES = [
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    cover: 'assets/images/services/graphic-design.jpeg',
    images: ['assets/images/services/graphic-design/1.jpg', 'assets/images/services/graphic-design/2.jpg', 'assets/images/services/graphic-design/3.jpg'],
    blurb: 'Identity, print and motion design that makes a brand look the part.',
    intro: 'Create a strong visual identity with professional graphic design solutions for businesses, brands, and marketing campaigns. From creative layouts and promotional materials to business communication designs, we develop visuals that communicate your brand clearly and professionally.',
    items: [
      'Logo',
      'Brochures',
      '2D & 3D Animation Design',
      'Audio & Video Editing',
      'Social Media Posters Designs',
      'Road show Vehicle Designs'
    ]
  },
  {
    id: 'website-design',
    title: 'Website Design & Development',
    cover: 'assets/images/services/web-design.jpeg',
    images: ['assets/images/services/website-design/1.jpg', 'assets/images/services/website-design/2.jpg', 'assets/images/services/website-design/3.jpg'],
    blurb: 'Websites built to sell, from simple static pages to full ecommerce.',
    intro: 'Build a professional online presence with responsive website design and development. We create user-friendly websites that present your business, services, and brand effectively across desktop, tablet, and mobile devices.',
    items: ['Static Website', 'Dynamic Website', 'Ecommerce website']
  },
  {
    id: 'branding-advertising',
    title: 'Branding & Advertising',
    cover: 'assets/images/services/branding-advertising.jpeg',
    images: ['assets/images/services/branding-advertising/1.jpg', 'assets/images/services/branding-advertising/2.jpg', 'assets/images/services/branding-advertising/3.jpg', 'assets/images/services/branding-advertising/4.jpg'],
    blurb: 'Everything that carries your logo — gifts, signage, print and more.',
    intro: 'Build a consistent and memorable brand with complete branding and advertising solutions. From brand identity and creative communication to advertising materials, we help businesses present a clear and professional image across different platforms.',
    items: [
      'Designs',
      'Corporate Gifts',
      'Personalized Gifts',
      'Laser Printing',
      'Digital Printing',
      'Offset Printing',
      'Signages'
    ]
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    cover: 'assets/images/services/digital-marketing.jpeg',
    images: ['assets/images/services/digital-marketing/1.jpg', 'assets/images/services/digital-marketing/2.jpg', 'assets/images/services/digital-marketing/3.jpg'],
    blurb: 'Reach the right audience on the channels your customers already use.',
    intro: 'Reach your target audience and grow your online presence with digital marketing solutions. We support businesses with online promotional strategies and digital communication designed to improve visibility, engagement, and enquiries.',
    items: [
      'Facebook Marketing',
      'Instagram Marketing',
      'Whatsapp Marketing',
      'Digital Invitations'
    ]
  },
  {
    id: 'printing',
    title: 'Printing',
    cover: 'assets/images/services/printing.jpeg',
    images: ['assets/images/services/printing/1.jpg', 'assets/images/services/printing/2.jpg', 'assets/images/services/printing/3.jpg', 'assets/images/services/printing/4.jpg'],
    blurb: 'Digital and offset printing for every business document and display.',
    intro: 'Bring your designs and brand materials to life with complete printing solutions. From business stationery and promotional materials to customized print requirements, we provide professional printing support for businesses and organizations.',
    items: [
      'Visiting Cards', 'Brochures', 'Envelopes', 'Letterheads (Pads/Sheets)', 'Certificates',
      'Scribbling Pads', 'Note Pads', 'Flyers/Pamplets', 'Bill Books', 'ID Cards', 'Lanyards',
      'Books, Diaries & Magazines', 'Invitations', 'Office Files', 'Calenders',
      'Menu Cards', 'Name Boards', 'Standee', 'Mementos', 'Wallpapers', 'Hang Tags',
      'Cloths & T-Shirts Printing', 'Stickers Printing & Cutting', 'Sun Pack Sheets',
      'Paper Bags', 'CD Stickers & Pouches', 'Sun Shade Caps Printing', 'Meeting Badges',
      'Passport Size Photo Envelopes', 'Rigid Boxes'
    ],
    note: 'Employee Kit: Customized Mugs, Water Bottles, Notepads, Pen, Laptop Bags & Much More..'
  }
];

const PK_WHY = [
  'Complete Business Solutions Under One Roof',
  'Quality That Speaks for Your Brand',
  'Creative & Strategic Approach',
  'Affordable & Transparent Pricing',
  'Experienced & Dedicated Team',
  'On-Time Delivery',
  'Customer-Centric Service',
  'Domestic & International Reach'
];

const PK_FRANCHISE = [
  { name: 'Printkite MINI',  area: '300 sq.ft' },
  { name: 'Printkite MAXI',  area: '600 sq.ft' },
  { name: 'Printkite FLEXI', area: '1000 sq.ft' },
  { name: 'Printkite MAIN',  area: '1500 sq.ft' }
];
const PK_FRANCHISE_NOTE = ['Preferably Ground floor', 'High visibility area with high returns'];

/* Clients shown in the looping logo carousel on the home page.
   Order follows the "Our Happy Clients" page of the company brochure.
   An entry is either a plain name or { name, logo }; a logo that is missing or
   fails to load falls back to the name, so entries can be added one at a time.
   The logo files were taken from the brochure — re-export any of them at a
   higher resolution by dropping a replacement at the same path. */
const pkClient = (name, file) => ({ name, logo: 'assets/images/clients/' + file + '.png' });

const PK_CLIENTS = [
  pkClient('naturals', 'naturals'),
  pkClient('green trends', 'green-trends'),
  pkClient('Yamaha', 'yamaha'),
  pkClient('Hero', 'hero'),
  pkClient('STAR Health Insurance', 'star-health-insurance'),
  pkClient('RCK Techiees', 'rck-techiees'),
  pkClient('SUPERGAS', 'supergas'),
  pkClient('AluniQ', 'aluniq'),
  pkClient('Aura Lune', 'aura-lune'),
  pkClient('Tnext', 'tnext'),
  pkClient('Shiny Boutique', 'shiny-boutique'),
  pkClient('Gen Solaris', 'gen-solaris'),
  pkClient('CHO Music World', 'cho-music-world'),
  pkClient('STEMix Academy', 'stemix-academy'),
  pkClient('iV Educational Institutions', 'iv-educational-institutions'),
  pkClient('D House', 'd-house'),
  pkClient('Aathi', 'aathi'),
  pkClient('Dr.G.Clinic', 'dr-g-clinic'),
  pkClient('BR Thalir', 'br-thalir'),
  pkClient('Swethika Collections', 'swethika-collections'),
  pkClient('Cerybee', 'cerybee'),
  pkClient('The Plant Doctor', 'the-plant-doctor'),
  pkClient('Trusted Walls', 'trusted-walls'),
  pkClient('Ganesh Travel Service', 'ganesh-travel-service'),
  pkClient('Ayoka', 'ayoka'),
  pkClient("Victor's Clinic", 'victor-s-clinic'),
  pkClient('Nihanvi Impex', 'nihanvi-impex'),
  pkClient('Karthikai Selvam & Co', 'karthikai-selvam-and-co'),
  pkClient('Intel Vidyalaya', 'intel-vidyalaya'),
  pkClient('Shades', 'shades'),
  pkClient('Laptop Surgeon', 'laptop-surgeon'),
  pkClient('NS AutoHub', 'ns-autohub'),
  pkClient('Sandy Luxe Studio', 'sandy-luxe-studio'),
  pkClient('Riverlite', 'riverlite'),
  pkClient('LangGo', 'langgo'),
  pkClient('SelSun Casita', 'selsun-casita'),
  pkClient('Keeranur Kitchen', 'keeranur-kitchen'),
  pkClient('Rollex Law Firm', 'rollex-law-firm'),
  pkClient('Delta Cancer & Gastro Care', 'delta-cancer-and-gastro-care'),
  pkClient('ImaginExtra', 'imaginextra'),
  pkClient('Euphoria', 'euphoria'),
  pkClient('Onelink Freight', 'onelink-freight')
];

/* ---------- Portfolio ----------
   To add a mockup: drop the image in the matching folder and add a line here.
   category must be one of the PK_PORTFOLIO_CATEGORIES ids.                       */
const PK_PORTFOLIO_CATEGORIES = [
  { id: 'all',            label: 'All Work' },
  { id: 'logos',          label: 'Logo Design' },
  { id: 'business-cards', label: 'Business Cards' },
  { id: 'id-cards',       label: 'ID Cards' },
  { id: 'branding',       label: 'Branding Mockups' }
];

/* eslint-disable no-unused-vars */
const PK_PORTFOLIO = [
  // Logos
  { category: 'logos', src: 'assets/images/portfolio/logos/brandmark-1.jpg',  title: 'iV Educational Institutions' },
  { category: 'logos', src: 'assets/images/portfolio/logos/brandmark-2.jpg',  title: 'AluniQ' },
  { category: 'logos', src: 'assets/images/portfolio/logos/brandmark-3.jpg',  title: 'Aura Lune' },
  { category: 'logos', src: 'assets/images/portfolio/logos/brandmark-4.jpg',  title: 'SelSun Casita' },
  { category: 'logos', src: 'assets/images/portfolio/logos/brandmark-5.jpg',  title: 'Shiny Boutique' },
  { category: 'logos', src: 'assets/images/portfolio/logos/brandmark-6.jpg',  title: 'Aathi' },
  { category: 'logos', src: 'assets/images/portfolio/logos/brandmark-7.jpg',  title: 'Riverlite' },
  { category: 'logos', src: 'assets/images/portfolio/logos/brandmark-8.jpg',  title: 'Nihanvi Impex' },
  { category: 'logos', src: 'assets/images/portfolio/logos/brandmark-9.jpg',  title: 'Ayoka' },
  { category: 'logos', src: 'assets/images/portfolio/logos/brandmark-10.jpg', title: 'Onelink Freight Solutions' },
  { category: 'logos', src: 'assets/images/portfolio/logos/brandmark-11.jpg', title: 'Tnext' },
  { category: 'logos', src: 'assets/images/portfolio/logos/brandmark-12.jpg', title: 'Swethika Collections' },
  { category: 'logos', src: 'assets/images/portfolio/logos/brandmark-13.jpg', title: 'D House' },
  { category: 'logos', src: 'assets/images/portfolio/logos/brandmark-14.jpg', title: 'Shades' },
  { category: 'logos', src: 'assets/images/portfolio/logos/brandmark-15.jpg', title: 'The Plant Doctor' },
  { category: 'logos', src: 'assets/images/portfolio/logos/brandmark-16.jpg', title: 'LangGo' },

  // Business cards
  { category: 'business-cards', src: 'assets/images/portfolio/business-cards/card-1.jpg',  title: 'Business Card' },
  { category: 'business-cards', src: 'assets/images/portfolio/business-cards/card-2.jpg',  title: 'Business Card' },
  { category: 'business-cards', src: 'assets/images/portfolio/business-cards/card-3.jpg',  title: 'Business Card' },
  { category: 'business-cards', src: 'assets/images/portfolio/business-cards/card-4.jpg',  title: 'Business Card' },
  { category: 'business-cards', src: 'assets/images/portfolio/business-cards/card-5.jpg',  title: 'Business Card' },
  { category: 'business-cards', src: 'assets/images/portfolio/business-cards/card-6.jpg',  title: 'Business Card' },
  { category: 'business-cards', src: 'assets/images/portfolio/business-cards/card-7.jpg',  title: 'Business Card' },
  { category: 'business-cards', src: 'assets/images/portfolio/business-cards/card-8.jpg',  title: 'Business Card' },
  { category: 'business-cards', src: 'assets/images/portfolio/business-cards/card-9.jpg',  title: 'Business Card' },
  { category: 'business-cards', src: 'assets/images/portfolio/business-cards/card-10.jpg', title: 'Business Card' },
  { category: 'business-cards', src: 'assets/images/portfolio/business-cards/card-11.jpg', title: 'Business Card' },
  { category: 'business-cards', src: 'assets/images/portfolio/business-cards/card-12.jpg', title: 'Business Card' },

  // ID cards
  { category: 'id-cards', src: 'assets/images/portfolio/id-cards/idcard-1.jpg', title: 'ID Card' },
  { category: 'id-cards', src: 'assets/images/portfolio/id-cards/idcard-2.jpg', title: 'ID Card' },
  { category: 'id-cards', src: 'assets/images/portfolio/id-cards/idcard-3.jpg', title: 'ID Card' },
  { category: 'id-cards', src: 'assets/images/portfolio/id-cards/idcard-4.jpg', title: 'ID Card' },
  { category: 'id-cards', src: 'assets/images/portfolio/id-cards/idcard-5.jpg', title: 'ID Card' },
  { category: 'id-cards', src: 'assets/images/portfolio/id-cards/idcard-6.jpg', title: 'ID Card' },
  { category: 'id-cards', src: 'assets/images/portfolio/id-cards/idcard-7.jpg', title: 'ID Card' },
  { category: 'id-cards', src: 'assets/images/portfolio/id-cards/idcard-8.jpg', title: 'ID Card' },


  // Branding mockups
  { category: 'branding', src: 'assets/images/portfolio/branding/branding-1.jpg', title: 'Café Brand Identity Kit' },
  { category: 'branding', src: 'assets/images/portfolio/branding/branding-2.jpg', title: 'Café Packaging & Collateral' }
];

/* expose to the global scope (const declarations are script-scoped, not window props) */
window.PK_SERVICES = PK_SERVICES;
window.PK_WHY = PK_WHY;
window.PK_FRANCHISE = PK_FRANCHISE;
window.PK_FRANCHISE_NOTE = PK_FRANCHISE_NOTE;
window.PK_CLIENTS = PK_CLIENTS;
window.PK_PORTFOLIO = PK_PORTFOLIO;
window.PK_PORTFOLIO_CATEGORIES = PK_PORTFOLIO_CATEGORIES;

