// src/config/site.js
// SINGLE SOURCE OF TRUTH for Australian Electric Motor Co - Electric Dirt Bikes Australia
import { EBIKES_DATA } from './ebikes.js';
import { ALL_BATTERIES_AND_CHARGERS } from './batteries-chargers.js';
import { RIDING_GEAR_CATEGORIES, RIDING_GEAR_PRODUCTS } from './riding-gear.js';
import { ACCESSORIES_CATEGORIES, ACCESSORIES_PRODUCTS, STARTER_PACK_BUNDLE } from './accessories.js';
import { PARTS_PRODUCTS } from './parts.js';
import { GENERIC_GEAR_PRODUCTS } from './gear-generic.js';

export { STARTER_PACK_BUNDLE };

export const SITE = {
  name: 'Australian Electric Motor Co',
  shortName: 'AEMC',
  tagline: "Australia's Premier Electric Dirt Bike Specialist & High-Voltage Moto Engineering",
  domain: 'australianelectricmotorco.com.au', // Rule 9: ONE place. Single Source of Truth.
  locale: 'en-AU',
  currency: 'AUD',
  target: 'vercel',
  primaryColor: '#8C4A2F',        // Outback Ochre / Terracotta Rust with warm copper & dark titanium
  gscVerification: 'pending',
  indexNowKey: 'aemc-electric-dirt-bikes-2026',
  cartKey: 'mm-cart',
  abn: '97 628 671 689',
  abnRaw: '97628671689',
  abrUrl: 'https://abr.business.gov.au/ABN/View?id=97628671689',
  gstRegistered: true,
  gstNote: 'Registered for GST. All prices are in AUD and inclusive of 10% Australian GST.',
};

export const CONTACT = {
  email: 'riders@australianelectricmotorco.com.au',
  phone: '+61 2 9188 7822',
  whatsapp: '+61480031899',
  address: 'Unit 3, 42 Enterprise Circuit, Prestons, NSW 2170',
  hq: 'Sydney, New South Wales, Australia',
  state: 'NSW',
  country: 'Australia',
  abn: '97 628 671 689',
  abrUrl: 'https://abr.business.gov.au/ABN/View?id=97628671689',
};

export const LEGAL = {
  abn: '97 628 671 689',
  abnRaw: '97628671689',
  abrUrl: 'https://abr.business.gov.au/ABN/View?id=97628671689',
  companyName: 'Australian Electric Motor Co Pty Ltd',
  tradingName: 'Australian Electric Motor Co',
  jurisdiction: 'New South Wales, Australia',
  state: 'NSW',
  gstRegistered: true,
  gstInclusive: true,
  gstNote: 'Australian Electric Motor Co is registered for GST (ABN: 97 628 671 689). All displayed product prices across our store are inclusive of 10% Australian GST.',
};

export const SHOP = {
  minOrder: 0,
  freeShippingThreshold: 150,     // Free shipping on apparel, gear & parts over $150
  shippingFee: 15,
  bikeCrateFreight: 180,          // Nationwide depot / door crate delivery across Australia
  cryptoDiscount: 10,             // 10% instant discount on Bitcoin (BTC) & USDT payments
  paymentMethods: ['crypto-BTC', 'crypto-USDT', 'pay-in-4', 'bank-transfer', 'payid'],
  payId: 'payments@australianelectricmotorco.com.au',
  bankDetails: {
    bankName: 'Commonwealth Bank of Australia (CBA)',
    accountName: 'Australian Electric Motor Co Pty Ltd',
    bsb: '062-000',
    accountNumber: '1098-4421',
  },
};

export const FINANCE = {
  model: 'pay-in-4',
  name: 'Pay in 4',
  tagline: '4 Interest-Free Fortnightly Payments',
  instalments: 4,
  frequency: 'fortnightly',
  interestRate: 0,
  deposit: 0,
  description: 'Spread the cost of your electric dirt bike, performance upgrades, or riding gear into four simple, equal fortnightly instalments. 0% interest, no deposit required, and instant digital approval.',
};

export const FORMS = {
  provider: 'web3forms',
  web3formsKey: 'pending',
  resendFrom: 'orders@australianelectricmotorco.com.au',
  turnstileSiteKey: '',
};

export const CHAT = {
  channels: [
    { type: 'whatsapp', value: '+61480031899' },
    { type: 'email', value: 'riders@australianelectricmotorco.com.au' },
    { type: 'phone', value: '+61 2 9188 7822' },
  ],
};

export const BRAND = {
  foundingYear: '2021',
  foundingLocation: 'Sydney, New South Wales, Australia',
  description: 'Australian Electric Motor Co (AEMC) engineers and supplies competition-grade electric dirt bikes, heavy-duty outback agricultural e-motos, 72V lithium battery architectures, and CNC billet performance parts designed to conquer red bull-dust, creek crossings, and steep Australian singletrack. Registered for GST in NSW with nationwide crate logistics.',
  milestones: [
    { year: '2021', event: 'Founded in New South Wales developing liquid-cooled IP67 high-discharge controllers for competitive electric motocross.' },
    { year: '2023', event: 'Expanded test fleet platforms across NSW, surviving brutal heat and durability testing across the Blue Mountains and Hunter Valley singletrack.' },
    { year: '2025', event: 'Established Australian Electric Motor Co headquarters and central dispatch facility with nationwide crate delivery to every Australian state.' },
  ],
  differentiation: [
    'Engineered specifically for Australian conditions: heat dissipation tested in 40°C+ ambient heat and IP67 dust and creek water sealing.',
    'Instant, relentless torque delivery with silent zero-emission access to private stations, forestry trails, and suburban ride parks.',
    'Heavy-gauge hydroformed aircraft aluminium chassis paired with race-grade FastAce, WP-spec, and Vonkat adjustable suspension.',
    'NSW engineering & warranty support, 2-Year Australian factory warranty, 10% crypto discount, and flexible Pay in 4 terms.',
  ],
  sameAs: [
    'https://www.instagram.com/australianelectricmotorco',
    'https://www.youtube.com/@australianelectricmotorco',
  ],
  awards: [],
};

export const SEO_KEYWORDS = {
  primary: 'electric dirt bike',
  secondary: [
    'electric dirt bike',
    'electric dirt bikes australia',
    'australian electric motor co',
    'pay in 4 electric dirt bike',
    'crypto discount electric dirt bike',
    'surron australia dealer',
    'talaria sting r australia',
    'stark future varg australia',
    'adult electric dirt bike',
    'kids electric dirt bike',
    'road legal electric dirt bike australia',
    'farm electric dirt bike station e moto',
    'high performance electric motocross',
    '72v electric dirt bike nsw',
    'electric trail bike australia',
    'e-ride pro ss 72v',
    'molicel 72v battery pack',
  ],
};

// FULL TAXONOMY STRUCTURE (Categorized as requested by user)
export const TAXONOMY_SECTIONS = [
  {
    slug: 'electric-dirt-bikes',
    name: 'Electric Dirt Bikes',
    icon: '⚡',
    description: 'Full-size motocross, trail enduro, road-legal, and station utility e-dirt bikes.',
  },
  {
    slug: 'brands',
    name: 'Brands',
    icon: '🏷️',
    description: 'Official bikes and parts from Surron, Talaria, Stark Future, E-Ride Pro, KTM & more.',
  },
  {
    slug: 'parts-upgrades',
    name: 'Parts & Upgrades',
    icon: '⚙️',
    description: 'High-output 72V batteries, aftermarket controllers, suspension, oversized rotors & tyres.',
  },
  {
    slug: 'riding-gear',
    name: 'Riding Gear',
    icon: '🛡️',
    description: 'AS/NZS certified helmets, hard-shell body armour, anti-dust goggles & enduro boots.',
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    icon: '🎒',
    description: 'Ute tailgate pads, towbar hauler racks, hydraulic bike stands, tools & graphics kits.',
  },
];

export const CATEGORIES = [
  // 1. Electric Dirt Bikes Root & Sub-branches
  {
    slug: 'electric-dirt-bikes',
    name: 'Electric Dirt Bikes',
    section: 'electric-dirt-bikes',
    parent: null,
    description: 'Explore Australia’s premier collection of competition-spec electric dirt bikes, agile trail weapons, street-legal commuters, and heavy-duty farm workhorses.',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    count: 75,
  },
  {
    slug: 'adult-electric-dirt-bikes',
    name: 'Adult Electric Dirt Bikes',
    section: 'electric-dirt-bikes',
    parent: 'electric-dirt-bikes',
    description: 'High-power 60V, 72V, and 360V machines delivering up to 60kW peak output for adult riders tackling demanding Australian motocross tracks and bush singletrack.',
    image: '/images/home/cat-adult-electric-dirt-bikes.webp',
    count: 29,
  },
  {
    slug: 'full-size-motocross',
    name: 'Full-Size Motocross',
    section: 'electric-dirt-bikes',
    parent: 'electric-dirt-bikes',
    description: 'Competition-level full-size electric motocross bikes matching and exceeding 450cc four-strokes with 21"/18" wheelsets, long-travel suspension, and holeshot-winning torque.',
    image: '/images/home/cat-full-size-motocross.webp',
    count: 10,
  },
  {
    slug: 'trail-mid-weight-enduro',
    name: 'Trail & Mid-Weight Enduro',
    section: 'electric-dirt-bikes',
    parent: 'electric-dirt-bikes',
    description: 'Nimble, high-endurance trail e-dirt bikes built for rocky ridges, mountain singletrack, and outback bush navigation with up to 140km range per charge.',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
    count: 13,
  },
  {
    slug: 'trail-enduro',
    name: 'Trail & Enduro',
    section: 'electric-dirt-bikes',
    parent: 'electric-dirt-bikes',
    description: 'Agile electric trail and enduro dirt bikes for bush singletrack and mountain trails.',
    image: '/images/home/cat-trail-enduro.webp',
    count: 13,
  },
  {
    slug: 'kids-youth-electric-dirt-bikes',
    name: 'Kids & Youth Electric Dirt Bikes',
    section: 'electric-dirt-bikes',
    parent: 'electric-dirt-bikes',
    description: 'Safe, durable, governor-controlled electric dirt bikes that build skill and confidence in young Aussie groms without hot exhaust pipes or loud engine noise.',
    image: '/images/home/cat-kids-youth-electric-dirt-bikes.webp',
    count: 40,
  },
  {
    slug: 'junior-trials-youth-dirt-bikes',
    name: 'Junior Trials & Youth Dirt Bikes',
    section: 'electric-dirt-bikes',
    parent: 'kids-youth-electric-dirt-bikes',
    description: 'Precision electric trials and junior dirt bikes for youth riders mastering throttle control, balance, and technical riding.',
    image: 'https://images.unsplash.com/photo-1547038577-da80abbc4f19?auto=format&fit=crop&w=1200&q=80',
    count: 20,
  },
  {
    slug: 'junior-trials',
    name: 'Junior Trials',
    section: 'electric-dirt-bikes',
    parent: 'kids-youth-electric-dirt-bikes',
    description: 'Precision electric trials bikes for junior riders mastering balance, obstacle hops, and low-speed technical throttle modulation.',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
    count: 20,
  },
  {
    slug: 'balance-mini-bikes',
    name: 'Balance & Mini Bikes',
    section: 'electric-dirt-bikes',
    parent: 'kids-youth-electric-dirt-bikes',
    description: 'Lightweight starter e-balance and mini bikes for youngsters aged 3 to 9 learning throttle control, balance, and braking fundamentals on grass and dirt.',
    image: 'https://images.unsplash.com/photo-1547038577-da80abbc4f19?auto=format&fit=crop&w=1200&q=80',
    count: 20,
  },
  {
    slug: 'adr-road-legal-dirt-bikes',
    name: 'ADR Road-Legal Dirt Bikes',
    section: 'electric-dirt-bikes',
    parent: 'electric-dirt-bikes',
    description: 'ADR-compliant road registerable (rego) electric dirt bikes equipped with high/low beam headlights, blinkers, mirrors, and dual-sport DOT tyres.',
    image: '/images/home/cat-adr-road-legal-dirt-bikes.webp',
    count: 6,
  },
  {
    slug: 'road-legal-electric-dirt-bikes',
    name: 'Road-Legal Electric Dirt Bikes',
    section: 'electric-dirt-bikes',
    parent: 'electric-dirt-bikes',
    description: 'ADR-compliant road registerable (rego) electric dirt bikes equipped with high/low beam headlights, blinkers, mirrors, and dual-sport DOT tyres.',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    count: 6,
  },
  {
    slug: 'utility-farm-e-bikes',
    name: 'Utility & Farm E-Bikes',
    section: 'electric-dirt-bikes',
    parent: 'electric-dirt-bikes',
    description: 'Silent, heavy-duty electric workhorses built for Australian cattle stations, paddock mustering, fence inspections, and property maintenance without scaring livestock.',
    image: '/images/home/cat-utility-farm-e-bikes.webp',
    count: 6,
  },
  {
    slug: 'utility-farm-ebikes',
    name: 'Utility & Farm E-Bikes',
    section: 'electric-dirt-bikes',
    parent: 'electric-dirt-bikes',
    description: 'Silent, heavy-duty electric workhorses built for Australian cattle stations, paddock mustering, fence inspections, and property maintenance without scaring livestock.',
    image: 'https://images.unsplash.com/photo-1547038577-da80abbc4f19?auto=format&fit=crop&w=1200&q=80',
    count: 6,
  },

  // 2. Brands Root & Sub-branches
  {
    slug: 'brands',
    name: 'Brands',
    section: 'brands',
    parent: null,
    description: 'Browse premier electric dirt bike manufacturers and racing brands backed by Australian warranty, local spare parts stock, and Sunshine Coast technical support.',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    count: 15,
  },
  {
    slug: 'surron',
    name: 'Surron',
    section: 'brands',
    parent: 'brands',
    description: 'Pioneers of lightweight electric trail motos including the Light Bee X, Ultra Bee, and Storm Bee with extensive aftermarket Aussie support.',
    image: '/images/brands/surron.webp',
    count: 5,
  },
  {
    slug: 'talaria',
    name: 'Talaria',
    section: 'brands',
    parent: 'brands',
    description: 'Gearbox-driven electric dirt bikes including the Sting R MX4, Sting Pro MX5, and XXX designed for durable bush bashing with zero belt slips.',
    image: '/images/brands/talaria.webp',
    count: 5,
  },
  {
    slug: 'stark-future',
    name: 'Stark Future',
    section: 'brands',
    parent: 'brands',
    description: 'Revolutionary 80 horsepower electric motocross technology setting new lap record standards on pro tracks worldwide.',
    image: '/images/brands/stark-future.webp',
    count: 5,
  },
  {
    slug: 'e-ride-pro',
    name: 'E-Ride Pro',
    section: 'brands',
    parent: 'brands',
    description: 'Factory 72V out-of-the-box high-voltage electric dirt bikes engineered for relentless acceleration and hill-climbing grunt.',
    image: '/images/brands/e-ride-pro.webp',
    count: 5,
  },
  {
    slug: 'ktm',
    name: 'KTM',
    section: 'brands',
    parent: 'brands',
    description: 'Austrian electric motocross heritage with WP suspension and championship-winning junior electric race bikes.',
    image: '/images/brands/ktm.webp',
    count: 5,
  },
  {
    slug: 'husqvarna',
    name: 'Husqvarna',
    section: 'brands',
    parent: 'brands',
    description: 'Pioneering Swedish-styled junior and youth electric dirt bikes featuring WP XACT air suspension and refined power management.',
    image: '/images/brands/husqvarna.webp',
    count: 5,
  },
  {
    slug: 'gasgas',
    name: 'GASGAS',
    section: 'brands',
    parent: 'brands',
    description: 'Dynamic Spanish-inspired electric dirt bikes delivering pure motocross fun and competitive edge for junior racers.',
    image: '/images/brands/gasgas.webp',
    count: 5,
  },
  {
    slug: 'kuberg',
    name: 'Kuberg',
    section: 'brands',
    parent: 'brands',
    description: 'Handcrafted European electric dirt bikes precision-engineered for young riders, freeriders, and utility paddock transport.',
    image: '/images/brands/kuberg.webp',
    count: 5,
  },
  {
    slug: 'oset',
    name: 'OSET',
    section: 'brands',
    parent: 'brands',
    description: 'World champion electric trials and competition balance bikes with micrometer-fine throttle modulation and safety dials.',
    image: '/images/brands/oset.webp',
    count: 5,
  },
  {
    slug: 'rfn-apollo',
    name: 'RFN (Apollo)',
    section: 'brands',
    parent: 'brands',
    description: 'Rugged rally-inspired electric dirt bikes with reinforced chromoly frames and dual-mode riding profiles.',
    image: '/images/brands/rfn-apollo.webp',
    count: 5,
  },
  {
    slug: 'arctic-leopard',
    name: 'Arctic Leopard',
    section: 'brands',
    parent: 'brands',
    description: 'Heavyweight mountain enduro e-motos featuring extreme 80V torque motors and climb-oriented chassis balance.',
    image: '/images/brands/arctic-leopard.webp',
    count: 5,
  },
  {
    slug: 'stacyc',
    name: 'STACYC',
    section: 'brands',
    parent: 'brands',
    description: 'The global benchmark for kids electric balance bikes, empowering young groms to develop riding confidence and balance.',
    image: '/images/brands/stacyc.webp',
    count: 5,
  },
  {
    slug: 'thumpstar',
    name: 'Thumpstar',
    section: 'brands',
    parent: 'brands',
    description: 'Aussie pit-bike heritage meets high-torque electric power for dirt-shredding fun and rugged backyard reliability.',
    image: '/images/brands/thumpstar.webp',
    count: 5,
  },
  {
    slug: 'ubco',
    name: 'UBCO',
    section: 'brands',
    parent: 'brands',
    description: 'All-Wheel Drive (2X2) electric utility workhorses built for Australian cattle stations, farm logistics, and silent exploration.',
    image: '/images/brands/ubco.webp',
    count: 5,
  },

  // 3. Parts & Upgrades Root & Sub-branches
  {
    slug: 'parts-upgrades',
    name: 'Parts & Upgrades',
    section: 'parts-upgrades',
    parent: null,
    description: 'Upgrade your electric dirt bike with race-grade 72V Molicel batteries, programmable controllers, FastAce suspension, oversized braking systems, and heavy-duty drivetrain components.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
    count: 15,
  },
  {
    slug: 'batteries-chargers',
    name: 'Batteries & Chargers',
    section: 'parts-upgrades',
    parent: 'parts-upgrades',
    description: 'High-discharge 60V and 72V lithium powerpacks, pure nickel busbars, Bluetooth Smart BMS, and Australian 240V high-amp fast chargers.',
    image: '/images/products/surron-ultra-bee-oem-battery-74v-55ah.webp',
    count: 2,
  },
  {
    slug: 'high-capacity-batteries',
    name: 'High-Capacity Batteries',
    section: 'parts-upgrades',
    parent: 'batteries-chargers',
    description: 'Hand-assembled Australian high-drain Molicel 21700 battery packs capable of 350A continuous discharge in high-temperature outback riding.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
    count: 1,
  },
  {
    slug: 'fast-chargers',
    name: 'Fast Chargers',
    section: 'parts-upgrades',
    parent: 'batteries-chargers',
    description: '15A and 20A rapid chargers equipped with Australian 240V 10A wall plugs and smart voltage curve monitoring.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
    count: 1,
  },
  {
    slug: 'controllers-electronics',
    name: 'Controllers & Electronics',
    section: 'parts-upgrades',
    parent: 'parts-upgrades',
    description: 'Bluetooth programmable FOC motor controllers, water-sealed bar displays, quick-turn throttles, and reinforced wiring looms.',
    image: '/images/products/ebmx-x-9000-aftermarket-controller.webp',
    count: 3,
  },
  {
    slug: 'aftermarket-controllers',
    name: 'Aftermarket Controllers',
    section: 'parts-upgrades',
    parent: 'controllers-electronics',
    description: 'Plug-and-play high-phase controllers (Torp, ASI, BAC) unlocking up to 25kW output and variable regenerative engine braking.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
    count: 1,
  },
  {
    slug: 'displays-throttles',
    name: 'Displays & Throttles',
    section: 'parts-upgrades',
    parent: 'controllers-electronics',
    description: 'Sunlight-readable color TFT screens, bar thumb switches, and waterproof CNC electronic throttles.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
    count: 1,
  },
  {
    slug: 'wiring-harnesses',
    name: 'Wiring Harnesses',
    section: 'parts-upgrades',
    parent: 'controllers-electronics',
    description: 'IP67 waterproof heat-shrink wiring harnesses designed to resist outback bull-dust, high engine wash, and trail snags.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
    count: 1,
  },
  {
    slug: 'suspension-steering',
    name: 'Suspension & Steering',
    section: 'parts-upgrades',
    parent: 'parts-upgrades',
    description: 'Inverted front forks, heavy-spring piggyback rear shocks, CNC triple clamps, and reinforced progression linkages.',
    image: '/images/products/sur-ron-front-fork-complete-assembly.webp',
    count: 3,
  },
  {
    slug: 'front-forks',
    name: 'Front Forks',
    section: 'parts-upgrades',
    parent: 'suspension-steering',
    description: '48mm inverted hydraulic race forks with 270mm of plush travel tuned for Australian whoops and deep braking ruts.',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
    count: 1,
  },
  {
    slug: 'rear-shocks',
    name: 'Rear Shocks',
    section: 'parts-upgrades',
    parent: 'suspension-steering',
    description: 'High and low speed compression adjustable piggyback rear coil shocks with heavy spring options for aggressive riders.',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
    count: 1,
  },
  {
    slug: 'linkage-triangles',
    name: 'Linkage & Triangles',
    section: 'parts-upgrades',
    parent: 'suspension-steering',
    description: 'Forged 7075-T6 aluminium progression triangles and riser linkages preventing frame cracking under big jump flat-landings.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
    count: 1,
  },
  {
    slug: 'brakes-rotors',
    name: 'Brakes & Rotors',
    section: 'parts-upgrades',
    parent: 'parts-upgrades',
    description: 'Complete 4-piston hydraulic brake sets, 250mm oversized floating stainless discs, steel braided brake lines, and sintered pads.',
    image: '/images/products/sur-ron-front-brake-rotor-203mm.webp',
    count: 3,
  },
  {
    slug: 'complete-brake-sets',
    name: 'Complete Brake Sets',
    section: 'parts-upgrades',
    parent: 'brakes-rotors',
    description: 'Quad-piston hydraulic brake calipers and radial levers providing one-finger stopping power for heavy 72V builds.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
    count: 1,
  },
  {
    slug: 'oversized-rotors',
    name: 'Oversized Rotors',
    section: 'parts-upgrades',
    parent: 'brakes-rotors',
    description: '250mm and 260mm laser-cut heat-treated floating brake rotors with CNC adapter brackets to eliminate brake fade on long descents.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
    count: 1,
  },
  {
    slug: 'pads-lines',
    name: 'Pads & Lines',
    section: 'parts-upgrades',
    parent: 'brakes-rotors',
    description: 'Sintered metallic pads engineered for wet red clay and abrasive bull-dust conditions, paired with braided stainless hydraulic lines.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
    count: 1,
  },
  {
    slug: 'wheels-drivetrain',
    name: 'Wheels & Drivetrain',
    section: 'parts-upgrades',
    parent: 'parts-upgrades',
    description: 'Heavy-duty 21"/18" off-road wheelsets, aggressive knobby tyres, CNC sprockets, gold O-ring chains, and silent belt drive conversion kits.',
    image: '/images/products/sur-ron-wheel-set-upgrade-front-plus-rear.webp',
    count: 3,
  },
  {
    slug: 'wheel-sets-tyres',
    name: 'Wheel Sets & Tyres',
    section: 'parts-upgrades',
    parent: 'wheels-drivetrain',
    description: 'SM Pro Platinum 21" front and 18" rear billet spoke wheels pre-fitted with heavy-duty rim locks and Dunlop Geomax MX tyres.',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    count: 1,
  },
  {
    slug: 'sprockets-chains',
    name: 'Sprockets & Chains',
    section: 'parts-upgrades',
    parent: 'wheels-drivetrain',
    description: 'CNC 7075-T6 54T and 58T rear sprockets paired with Japanese DID 420 gold racing chains for high-torque longevity.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
    count: 1,
  },
  {
    slug: 'belt-drive-kits',
    name: 'Belt Drive Kits',
    section: 'parts-upgrades',
    parent: 'wheels-drivetrain',
    description: 'Carbon-corded Gates GT4 belt conversion kits engineered for silent stealth trail riding and paddock cruising without chain clatter.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
    count: 1,
  },

  // 4. Riding Gear Root & Sub-branches
  {
    slug: 'riding-gear',
    name: 'Riding Gear & Protection',
    section: 'riding-gear',
    parent: null,
    description: 'Rider safety gear certified to Australian Standards (AS/NZS 1698) & ECE 22.06 including full-face MX helmets, CE Level 1 & 2 body armour, anti-dust off-road goggles, and rugged enduro boots.',
    image: 'https://images.unsplash.com/photo-1547038577-da80abbc4f19?auto=format&fit=crop&w=1200&q=80',
    count: 19,
  },
  {
    slug: 'helmets',
    name: 'Full-Face MX & E-Moto Helmets',
    section: 'riding-gear',
    parent: 'riding-gear',
    description: 'ECE 22.06 and Australian AS/NZS 1698 approved full-face motocross and electric dirt bike helmets engineered with MIPS rotational protection, carbon composite shells, and optimal ventilation.',
    image: 'https://images.unsplash.com/photo-1547038577-da80abbc4f19?auto=format&fit=crop&w=1200&q=80',
    count: 5,
  },
  {
    slug: 'body-armour',
    name: 'Body Armour & Chest Protectors',
    section: 'riding-gear',
    parent: 'riding-gear',
    description: 'CE Level 1 & Level 2 certified hard-shell chest roost deflectors, full upper body protection jackets, carbon composite neck braces, and articulated knee/wrist brace systems.',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
    count: 5,
  },
  {
    slug: 'body-armour-protection',
    name: 'Body Armour & Protection',
    section: 'riding-gear',
    parent: 'riding-gear',
    description: 'CE Level 1 & Level 2 certified hard-shell chest roost deflectors, full upper body protection jackets, and joint protection systems.',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
    count: 5,
  },
  {
    slug: 'gloves-goggles',
    name: 'Gloves & Off-Road Goggles',
    section: 'riding-gear',
    parent: 'riding-gear',
    description: 'Ultra-wide vision motocross goggles with HiPER and Prizm MX lenses, anti-fog Lexan coatings, and high-tensile four-way stretch off-road riding gloves.',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    count: 5,
  },
  {
    slug: 'boots',
    name: 'Enduro & Motocross Boots',
    section: 'riding-gear',
    parent: 'riding-gear',
    description: 'Heavy-duty hinged motocross and enduro boots with biomechanical ankle pivots, replaceable sole systems (SRS), and deep-lugged traction soles.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
    count: 4,
  },

  // 5. Accessories Root & Sub-branches
  {
    slug: 'accessories',
    name: 'Accessories & Maintenance',
    section: 'accessories',
    parent: null,
    description: 'Australian outback transportation accessories, heavy-duty ute hitch haulers, foldable pit stands, custom moto graphics kits, and electrical-safe cleaning bundles.',
    image: '/images/home/cat-accessories.webp',
    count: 12,
  },
  {
    slug: 'bike-stands-tools',
    name: 'Bike Stands & Pit Mats',
    section: 'accessories',
    parent: 'accessories',
    description: 'Foldable composite and aircraft-grade aluminum pit stands, heavy-duty lift stands, and FIM-approved environmental absorbent pit mats for electric dirt bikes.',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    count: 3,
  },
  {
    slug: 'storage-transport',
    name: 'Transport & Hitch Carriers',
    section: 'accessories',
    parent: 'accessories',
    description: 'Heavy-duty 2-inch hitch bike carriers, anti-scratch soft-loop tie-down straps, and 420D weatherproof heavy-duty outdoor covers designed for e-moto transport.',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
    count: 3,
  },
  {
    slug: 'graphics-plastics-kits',
    name: 'Custom Graphics & Plastics Kits',
    section: 'accessories',
    parent: 'accessories',
    description: 'Heavy-duty 21 mil ultra-thick vinyl custom graphic decals and durable gloss polypropylene restyle plastics for Surron, Talaria, E-Ride Pro and Stark VARG.',
    image: 'https://images.unsplash.com/photo-1547038577-da80abbc4f19?auto=format&fit=crop&w=1200&q=80',
    count: 3,
  },
  {
    slug: 'maintenance-chemicals',
    name: 'E-Moto Cleaning & Chain Lubes',
    section: 'accessories',
    parent: 'accessories',
    description: 'Waterless bike wash sprays, specialized O-ring/X-ring synthetic PTFE off-road chain lubricants, and waterless electrical contact cleaners safe for high-voltage e-dirt bikes.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
    count: 3,
  },
];

export const PRODUCTS = [
  // Every e-bike model, spread across our brands
  ...EBIKES_DATA.map((bike) => ({
    ...bike,
    isBike: true,
    parentCategories: [
      'electric-dirt-bikes',
      bike.target === 'Kids / Youth'
        ? 'kids-youth-electric-dirt-bikes'
        : bike.target === 'Utility / Farm'
        ? 'utility-farm-e-bikes'
        : 'adult-electric-dirt-bikes',
      bike.category,
      'brands',
      bike.brand,
    ],
  })),

  // Batteries & Fast Chargers (AS/NZS 3112 Australian Standards)
  ...ALL_BATTERIES_AND_CHARGERS,

  // Riding Gear & Protection (AS/NZS 1698 & ECE 22.06 Certified)
  ...RIDING_GEAR_PRODUCTS,

  // Accessories & Maintenance
  ...ACCESSORIES_PRODUCTS,

  // Spare parts, upgrades & accessories from supplied product photography
  ...PARTS_PRODUCTS,

  // Generic (unbranded) riding-gear starter products
  ...GENERIC_GEAR_PRODUCTS,

  // Controllers & Electronics
  {
    slug: 'torp-tc1000-aftermarket-controller',
    name: 'Torp TC1000 Plug-and-Play Controller Kit',
    price: 1690,
    category: 'aftermarket-controllers',
    brand: 'dirt-and-co',
    parentCategories: ['parts-upgrades', 'controllers-electronics', 'aftermarket-controllers'],
    shortDescription: 'State-of-the-art 32kW peak FOC controller with smartphone app tuning, stock display integration, and regenerative braking thumb lever.',
    description: 'The easiest way to unlock massive power from Surron, Talaria, and custom e-motos. Direct plug-and-play installation with no cutting of wires. Manage power profiles, throttle ramps, and thermal limits live from your smartphone via Bluetooth.',
    badge: 'Plug & Play',
    featured: false,
    images: ['/images/products/torp-tc1000-aftermarket-controller.webp'],
    specs: {
      PeakPower: 'Up to 32,000 Watts (32 kW)',
      PhaseCurrent: 'Up to 1000A Phase Current',
      WaterResistance: 'IP67 Sealed Aluminium Housing',
      Connectivity: 'Bluetooth 5.0 iOS & Android App Tuning',
      Warranty: '2-Year Warranty',
    },
  },

  // Suspension & Steering
  {
    slug: 'fastace-inverted-forks-48mm',
    name: 'FastAce 48mm Inverted Hydraulic Motocross Forks',
    price: 1150,
    category: 'front-forks',
    brand: 'dirt-and-co',
    parentCategories: ['parts-upgrades', 'suspension-steering', 'front-forks'],
    shortDescription: 'Heavy-duty 270mm travel inverted fork with custom 50lb springs tuned for Australian whoops and big jump landings.',
    description: 'Transform the handling of your electric dirt bike. Factory tuned with heavy-gauge internal springs and re-valved hydraulic damping to eliminate bottoming out on harsh Australian outback trail landings.',
    badge: 'Heavy Spring',
    featured: false,
    images: ['/images/products/fastace-inverted-forks-48mm.webp'],
    specs: {
      Travel: '270 mm Full Stroke',
      Stanchions: '48mm Hard-Anodised Gold Aluminium',
      Adjustments: 'Rebound & Compression Clickers',
      Compatibility: 'Direct fit for Dirt & Co Apex, Surron, Talaria, E-Ride Pro',
    },
  },

  // Brakes & Rotors
  {
    slug: 'magura-mt7-pro-quad-piston-brake-set',
    name: 'Magura MT7 Pro Quad-Piston Hydraulic Brake Set',
    price: 690,
    category: 'complete-brake-sets',
    brand: 'dirt-and-co',
    parentCategories: ['parts-upgrades', 'brakes-rotors', 'complete-brake-sets'],
    shortDescription: 'Carbotecture SL radial master cylinders with forged 4-piston monobloc calipers for effortless one-finger stopping power.',
    description: 'The definitive brake upgrade for heavyweight high-torque electric dirt bikes. Delivers maximum bite, heat dissipation, and zero lever fade down steep rocky hill descents.',
    badge: 'Quad Piston',
    featured: false,
    images: ['/images/products/magura-mt7-pro-quad-piston-brake-set.webp'],
    specs: {
      Calipers: 'Forged 4-Piston Monobloc Front & Rear',
      Levers: '1-Finger HC Carbon Levers with Reach Adjust',
      HydraulicFluid: 'Royal Blood Mineral Oil',
      HoseLength: '2000mm Trim-to-Fit Reinforced Hose',
    },
  },

  // Wheels & Drivetrain
  {
    slug: 'sm-pro-21-18-wheel-set-dunlop-tyres',
    name: 'SM Pro Platinum 21"/18" Wheel Set with Dunlop MX33 Tyres',
    price: 1390,
    category: 'wheel-sets-tyres',
    brand: 'dirt-and-co',
    parentCategories: ['parts-upgrades', 'wheels-drivetrain', 'wheel-sets-tyres'],
    shortDescription: 'UK-manufactured aircraft alloy 21" front and 18" rear rims laced to CNC billet hubs, pre-shod with Dunlop Geomax MX33 knobby tyres.',
    description: 'Upgrade your e-dirt bike from lightweight bicycle-spec wheels to true motocross-grade 21" front and 18" rear rims. Rolls effortlessly over rocky ledges, fallen gum trees, and deep sandy ruts with immense puncture resistance.',
    badge: 'Full MX Size',
    featured: false,
    images: ['/images/products/sm-pro-21-18-wheel-set-dunlop-tyres.webp'],
    specs: {
      FrontWheel: '21" x 1.60" SM Pro 7050 Alloy Rim with 10-Gauge Stainless Spokes',
      RearWheel: '18" x 2.15" SM Pro 7050 Alloy Rim with Rim Lock',
      Tyres: 'Dunlop Geomax MX33 Competition Knobby Tyres Pre-Fitted with Heavy Tubes',
      Hubs: 'CNC Billet Aluminium Anodised Outback Terracotta / Black',
    },
  },
];

// ---------------------------------------------------------------------------
// Shop category navigation — the single grouped list of shoppable categories
// shown as the "Category" filter on EVERY shop page (/shop, /shop/<cat>,
// /parts-upgrades). Each entry links to its own indexable page.
// ---------------------------------------------------------------------------
export const SHOP_FACET_GROUPS = [
  {
    group: 'Electric Dirt Bikes',
    slugs: [
      'full-size-motocross',
      'trail-mid-weight-enduro',
      'junior-trials-youth-dirt-bikes',
      'balance-mini-bikes',
      'adr-road-legal-dirt-bikes',
      'utility-farm-e-bikes',
    ],
  },
  {
    group: 'Parts & Upgrades',
    slugs: [
      'high-capacity-batteries',
      'fast-chargers',
      'controllers-electronics',
      'suspension-steering',
      'brakes-rotors',
      'wheels-drivetrain',
    ],
  },
  {
    group: 'Riding Gear',
    slugs: ['helmets', 'body-armour', 'body-armour-protection', 'gloves-goggles', 'boots'],
  },
  {
    group: 'Accessories',
    slugs: ['graphics-plastics-kits', 'bike-stands-tools', 'storage-transport', 'maintenance-chemicals'],
  },
];

/** Grouped category list with GLOBAL product counts — pass to <CategoryProductGrid categoryNav>. */
export function getShopCategoryNav() {
  const nameOf = (slug) => CATEGORIES.find((c) => c.slug === slug)?.name || slug;
  const belongs = (p, slug) =>
    p.category === slug || (Array.isArray(p.parentCategories) && p.parentCategories.includes(slug));
  return SHOP_FACET_GROUPS.flatMap((g) =>
    g.slugs
      .filter((slug) => CATEGORIES.some((c) => c.slug === slug))
      .map((slug) => ({
        slug,
        name: nameOf(slug),
        group: g.group,
        count: PRODUCTS.filter((p) => belongs(p, slug)).length,
      }))
      .filter((c) => c.count > 0),
  );
}

export const POSTS = [
  {
    slug: 'electric-dirt-bike-vs-petrol-australia',
    title: 'Electric Dirt Bike vs 250cc Petrol Four-Stroke: The Outback Trail Test',
    excerpt: 'We compared real-world maintenance costs, noise pollution, low-end torque, and outback range between the Apex 72R and modern 250cc motocrossers.',
    category: 'E-Moto Performance',
    date: '2026-06-20',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
    content: `When you first twist the throttle of a high-voltage electric dirt bike from Australian Electric Motor Co, the immediate sensation is unlike any petrol motocross machine you've ever ridden. There is no clutch slip, no engine bogging, and no powerband hesitation—just instant, linear torque that hooks up the rear tyre with astonishing precision.

### 1. Instant Torque from Zero RPM
A standard 250cc four-stroke internal combustion engine produces its peak torque around 8,500 to 11,000 RPM. That requires constant gear shifting and clutch feathering through tight singletrack. Our 72V electric motor delivers full peak torque at 1 RPM, allowing riders to effortlessly climb steep rocky outback creek banks and technical hill ascents that would stall conventional dirt bikes.

### 2. Zero Exhaust Noise & Open Trail Access
Noise complaints have closed down countless dirt bike riding parks and private riding properties across Australia. An electric dirt bike operates at a whisper, with only tyre roost and chain sound audible. This unlocks stealth trail riding opportunities on rural acreage and state forestry roads where petrol bikes are strictly prohibited.

### 3. Radical Maintenance Cost Reductions
Over a 100-hour riding season, a modern high-strung petrol 250cc motocrosser requires 10+ engine oil changes, continuous air filter cleanings, spark plug replacements, and eventually a $1,500 top-end piston rebuild. An electric dirt bike has no engine oil, no oil filters, no spark plugs, and no carburettor jets to clog with red outback dust. Charge it up, check tyre pressures, lube the chain, and ride.`,
  },
  {
    slug: 'charging-electric-dirt-bikes-off-grid',
    title: 'How to Charge Electric Dirt Bikes in Remote Outback Campsites',
    excerpt: 'Setting up portable solar blankets, 240V vehicle inverters, and dual-battery systems for unlimited off-grid e-moto sessions.',
    category: 'Off-Grid Touring',
    date: '2026-07-15',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80',
    content: `Taking an electric dirt bike on an extended overland expedition or camping trip across New South Wales, Queensland, Victoria, or Western Australia is now easier than ever thanks to modern lithium auxiliary vehicle batteries and high-wattage monocrystalline solar setups.

### Fast Charging from a 2000W Inverter
The standard fast charger supplied by Australian Electric Motor Co draws approximately 750W to 1,200W from standard 240V mains AC. If your 4WD touring rig is fitted with a 2000W pure sine-wave inverter and a 200Ah or 300Ah LiFePO4 auxiliary battery, you can recharge your electric dirt bike in 2.5 to 3 hours directly from your ute or 4WD while having lunch at camp.

### Solar Replenishment on Stationary Days
Setting out a 300W or 400W folding solar blanket in direct Australian sunlight yields up to 20 to 25 amps per hour of clean solar power back into your vehicle's auxiliary bank. This creates a completely self-sustaining energy loop: ride in the morning, plug in to recharge off solar during the midday heat, and hit the dunes again for a sunset ride.`,
  },
  {
    slug: 'australian-electric-dirt-bike-laws-guide',
    title: 'Electric Dirt Bike Laws in Australia: Where Can You Legally Ride?',
    excerpt: 'State-by-state breakdown of private property riding, dedicated off-road moto parks, forestry trails, and road registration considerations.',
    category: 'Rider Compliance',
    date: '2026-08-04',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
    content: `With the surge in popularity of electric dirt bikes across Australia, understanding legal jurisdictions and riding guidelines ensures you stay safe and fine-free.

### Private Land & Agricultural Properties
On private freehold land with owner consent, electric dirt bikes operate without registration or road licensing requirements. This makes e-motos exceptionally popular for hobby farms, rural acreages, and cattle stations where low noise and zero fire risk from hot exhaust headers are critical.

### Dedicated MX & Off-Road Moto Parks
Nearly all Australian commercial motocross tracks and ride parks welcome electric dirt bikes in open practice sessions. They recognize the quiet, clean footprint and exhilarating performance of modern e-motos.

### Safety Gear Standards
Regardless of where you ride, wearing an Australian Standards (AS/NZS 1698) certified full-face motocross helmet, robust off-road riding boots, knee guards, and eye protection is essential. Electric dirt bikes accelerate faster than most riders anticipate!`,
  },
];

export const PAGES = {
  about: true,
  brands: true,
  faq: true,
  blog: true,
  wholesale: false,
  tracking: false,
  compare: true,
  finance: true,
  search: true,
};

export const FAQ = [
  {
    question: 'How fast do Australian Electric Motor Co electric dirt bikes go?',
    answer: 'Our flagship 72V electric dirt bikes achieve electronically switchable top speeds of up to 120 km/h, while lightweight youth and trail e-motos reach 50 to 85 km/h. All bikes feature selectable power modes to tailor throttle response and speed for beginner, trail, and race settings.',
  },
  {
    question: 'What is the real-world riding range on a single charge?',
    answer: 'Riding range depends on terrain, rider weight, and throttle aggression. In typical Australian bush and trail conditions, expect 90 to 120 km on high-capacity 72V models. At full competition motocross race pace, you get approximately 45 to 60 minutes of high-intensity riding.',
  },
  {
    question: 'Are all prices inclusive of Australian GST?',
    answer: 'Yes. Australian Electric Motor Co is registered for GST (ABN: 97 628 671 689, NSW). Every price displayed across our website is 100% inclusive of 10% Australian GST with official tax invoices issued for all orders.',
  },
  {
    question: 'How does the 10% cryptocurrency payment discount work?',
    answer: 'Select Bitcoin (BTC) or Tether (USDT) at checkout to automatically apply an instant 10% discount to your entire order total. Payment verification is rapid, on-chain or Lightning, and exempt from card merchant surcharges, saving you hundreds on complete bikes.',
  },
  {
    question: 'Do you offer electric dirt bike finance and Pay in 4 in Australia?',
    answer: 'Yes! We offer flexible Pay in 4 (split your order into four equal fortnightly payments with 0% interest and zero deposit), as well as dedicated Australian powersports asset finance for terms from 12 to 60 months. Use our on-site Finance Calculator to model payments.',
  },
  {
    question: 'How long does it take to recharge an electric dirt bike?',
    answer: 'Using our included 240V Australian smart fast charger, a depleted 72V pack recharges to 80% in approximately 90 minutes, and to 100% full capacity in 2.5 to 3 hours from any standard Australian household 10A power outlet or 2000W 4WD pure sine-wave inverter.',
  },
  {
    question: 'Can I ride electric dirt bikes through water and deep mud?',
    answer: 'Yes. Our motors, battery enclosures, wiring harnesses, and controllers are IP67 sealed to withstand severe Australian conditions, including water splashes, creek crossings, high-pressure washing, and heavy outback dust storms.',
  },
  {
    question: 'What warranty is included with Australian Electric Motor Co bikes?',
    answer: 'All full-size electric dirt bikes are backed by a comprehensive 2-Year Australian Factory Warranty covering the frame, brushless motor, electronic controller, and lithium battery pack, serviced directly with Australian parts stock.',
  },
  {
    question: 'How are bikes shipped across Australia?',
    answer: 'Bikes are delivered in reinforced, fully enclosed steel-framed crates via specialised freight carriers directly to your residential address or nearest regional depot across NSW, QLD, VIC, SA, WA, TAS, and NT with full tracking and transit insurance.',
  },
];

export const TRUSTPILOT_DATA = {
  score: '4.9',
  ratingText: 'Excellent',
  totalReviews: '3,000+',
  totalReviewsCount: 3140,
  sourceBusiness: 'B&B Off Road Engineering',
  sourceDomain: 'bboffroad.com.au',
  fiveStarPercent: 96,
  verifiedPercent: 99,
  heritageNote: 'Verified customer feedback from our Australian off-road engineering heritage & manufacturing profile (bboffroad.com.au), backed by 3,000+ 5-star rider reviews.',
};

export const REVIEWS = [
  {
    id: 'rev-1',
    author: 'Matt Arnold',
    rating: 5,
    date: 'April 2026',
    verified: true,
    location: 'VIC, Australia',
    title: 'Fantastic build quality and precise fitment',
    body: 'Build quality is top tier—thick structural alloy plate, flawless TIG welds, and fitment was dead-on in 10 minutes. Delivered across Australia in two days. Absolutely brilliant engineering.',
    tag: 'Build & Durability',
    badge: 'Verified Buyer',
  },
  {
    id: 'rev-2',
    author: 'Robert Booth',
    rating: 5,
    date: 'December 2025',
    verified: true,
    location: 'NSW, Australia',
    title: 'Long-standing trust in Australian off-road engineering',
    body: 'I have trusted and used their gear for years across multiple off-road machines. The strength, reliability, and precision never waver. True Australian craftsmanship at its absolute finest.',
    tag: 'Long-term Rider',
    badge: 'Verified Buyer',
  },
  {
    id: 'rev-3',
    author: 'David Crombie',
    rating: 5,
    date: 'February 2026',
    verified: true,
    location: 'QLD, Australia',
    title: 'Unbeatable protection on harsh rocky trails',
    body: 'Took some massive hits over granite boulders on the weekend without even a dent. Bulletproof structural strength, clean lines, and super fast dispatch. 100% recommended.',
    tag: 'Trail Tested',
    badge: 'Verified Buyer',
  },
  {
    id: 'rev-4',
    author: 'Chris Walker',
    rating: 5,
    date: 'March 2026',
    verified: true,
    location: 'SA, Australia',
    title: 'Top notch customer service and speedy dispatch',
    body: 'Spoke with their technical support with a couple of questions. Honest, knowledgeable advice and the package arrived in 2 business days. Exceptional Australian customer service.',
    tag: 'Customer Support',
    badge: 'Verified Buyer',
  },
  {
    id: 'rev-5',
    author: 'Mark Stevenson',
    rating: 5,
    date: 'January 2026',
    verified: true,
    location: 'WA, Australia',
    title: 'Built like a tank – Aussie quality at its best',
    body: 'Heavy-duty structural alloy with clean chamfered edges. Everything bolted straight onto the chassis mounts with zero flexing. Gives complete confidence in remote bush terrain.',
    tag: 'Heavy Duty',
    badge: 'Verified Buyer',
  },
  {
    id: 'rev-6',
    author: 'Glenn Murphy',
    rating: 5,
    date: 'April 2026',
    verified: true,
    location: 'NSW, Australia',
    title: 'Super fast shipping and exact fitment',
    body: 'Instructions were clear, high-tensile hardware supplied, and the finish looks awesome. Really appreciate dealing with a genuine Australian team who understand real trail riding.',
    tag: 'Fast Delivery',
    badge: 'Verified Buyer',
  },
  {
    id: 'rev-7',
    author: 'Anthony Hayes',
    rating: 5,
    date: 'November 2025',
    verified: true,
    location: 'VIC, Australia',
    title: 'Best investment for extreme durability',
    body: 'Unmatched ruggedness. You can immediately tell this gear is engineered by people who ride hard on Australian tracks. Solid, durable, and rapid delivery.',
    tag: 'Build & Durability',
    badge: 'Verified Buyer',
  },
  {
    id: 'rev-8',
    author: 'Paul Henderson',
    rating: 5,
    date: 'May 2026',
    verified: true,
    location: 'QLD, Australia',
    title: 'Honest advice, fast delivery, and premium finish',
    body: 'The team went above and beyond when I needed expedited freight before a weekend ride. Everything arrived securely packaged with flawless finish. 10/10 experience.',
    tag: 'Customer Support',
    badge: 'Verified Buyer',
  },
];

export const COMPLIANCE = {
  bannedTerms: [],
  requiredFramings: [],
  prohibitedClaims: [],
  ageGate: false,
  ageMinimum: null,
  gdpr: false,
  disclaimer: 'Australian Electric Motor Co (ABN: 97 628 671 689) supplies high-performance off-road competition and recreational electric dirt bikes. All prices include 10% Australian GST. Always wear approved motorcycle protective equipment. Off-road riding should be conducted on private property or sanctioned riding tracks in accordance with state laws.',
};
