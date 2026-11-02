export type CategorySlug =
  | 'birthday'
  | 'anniversary'
  | 'designer'
  | 'chocolate'
  | 'photo'
  | 'pastries'
  | 'brownies-desserts'

export type CollectionSlug = 'pink-city' | 'midnight-chocolate' | 'little-indulgences' | 'celebrate-love'

export type Category = {
  slug: CategorySlug
  name: string
  blurb: string
  image: string
}

export type Collection = {
  slug: CollectionSlug
  name: string
  description: string
  image: string
}

export type SizeOption = {
  label: string
  detail: string
  multiplier: number
}

export type Flavour = {
  name: string
  extra: number
}

export type EgglessPolicy = 'optional' | 'always' | 'none'

export type Product = {
  id: string
  slug: string
  name: string
  category: CategorySlug
  collections: CollectionSlug[]
  image: string
  shortDescription: string
  description: string
  highlights: string[]
  basePrice: number
  rating: number
  reviews: number
  isBestseller?: boolean
  isNew?: boolean
  sizes: SizeOption[]
  flavours: Flavour[]
  eggless: EgglessPolicy
  allowsMessage: boolean
  addedOrder: number
}

export const CATEGORIES: Category[] = [
  {
    slug: 'birthday',
    name: 'Birthday Cakes',
    blurb: 'Joyful layers for every candle',
    image: '/images/products/funfetti-vanilla-cake.png',
  },
  {
    slug: 'anniversary',
    name: 'Anniversary Cakes',
    blurb: 'Romance, baked with care',
    image: '/images/products/red-velvet-heart-cake.png',
  },
  {
    slug: 'designer',
    name: 'Designer Cakes',
    blurb: 'Showpieces, hand-finished',
    image: '/images/products/gold-drip-macaron-cake.png',
  },
  {
    slug: 'chocolate',
    name: 'Chocolate Cakes',
    blurb: 'Deep, dark, decadent',
    image: '/images/products/belgian-chocolate-truffle-cake.png',
  },
  {
    slug: 'photo',
    name: 'Photo Cakes',
    blurb: 'Your memories, edible',
    image: '/images/products/classic-photo-cake.png',
  },
  {
    slug: 'pastries',
    name: 'Pastries',
    blurb: 'Little luxuries by the box',
    image: '/images/products/mango-mousse-pastry.png',
  },
  {
    slug: 'brownies-desserts',
    name: 'Brownies & Desserts',
    blurb: 'Fudgy, creamy, irresistible',
    image: '/images/products/fudge-walnut-brownies.png',
  },
]

export const COLLECTIONS: Collection[] = [
  {
    slug: 'pink-city',
    name: 'Pink City Signatures',
    description: 'Saffron, rose and pistachio — Jaipur’s flavours, reimagined as patisserie.',
    image: '/images/products/rasmalai-saffron-cake.png',
  },
  {
    slug: 'midnight-chocolate',
    name: 'Midnight Chocolate',
    description: 'Single-origin cocoa, Belgian couverture and glossy ganache.',
    image: '/images/products/dark-chocolate-mirror-cake.png',
  },
  {
    slug: 'little-indulgences',
    name: 'Little Indulgences',
    description: 'Pastries, jars and brownies for everyday celebrations.',
    image: '/images/products/assorted-pastry-box.png',
  },
  {
    slug: 'celebrate-love',
    name: 'Celebrate Love',
    description: 'Hearts, roses and romance for anniversaries and proposals.',
    image: '/images/products/midnight-rose-anniversary-cake.png',
  },
]

const CAKE_SIZES: SizeOption[] = [
  { label: '0.5 kg', detail: 'Serves 4–6', multiplier: 1 },
  { label: '1 kg', detail: 'Serves 8–10', multiplier: 1.9 },
  { label: '1.5 kg', detail: 'Serves 12–15', multiplier: 2.75 },
  { label: '2 kg', detail: 'Serves 16–20', multiplier: 3.6 },
]

const DESIGNER_SIZES: SizeOption[] = [
  { label: '1 kg', detail: 'Serves 8–10', multiplier: 1 },
  { label: '1.5 kg', detail: 'Serves 12–15', multiplier: 1.45 },
  { label: '2 kg', detail: 'Serves 16–20', multiplier: 1.9 },
  { label: '3 kg', detail: 'Serves 25–30', multiplier: 2.8 },
]

const PASTRY_SIZES: SizeOption[] = [
  { label: 'Box of 2', detail: '2 pieces', multiplier: 1 },
  { label: 'Box of 4', detail: '4 pieces', multiplier: 1.85 },
  { label: 'Box of 6', detail: '6 pieces', multiplier: 2.6 },
]

const BROWNIE_SIZES: SizeOption[] = [
  { label: 'Box of 4', detail: '4 brownies', multiplier: 1 },
  { label: 'Box of 8', detail: '8 brownies', multiplier: 1.85 },
  { label: 'Box of 12', detail: '12 brownies', multiplier: 2.6 },
]

const SINGLE_FLAVOUR = (name: string): Flavour[] => [{ name, extra: 0 }]

export const PRODUCTS: Product[] = [
  {
    id: 'p01',
    slug: 'rose-pistachio-celebration-cake',
    name: 'Rose Pistachio Celebration Cake',
    category: 'birthday',
    collections: ['pink-city'],
    image: '/images/products/rose-pistachio-celebration-cake.png',
    shortDescription: 'Rose-scented sponge, pistachio praline and blush buttercream.',
    description:
      'Our most-loved birthday cake: layers of delicate rose-infused vanilla sponge, Iranian pistachio praline and silky blush buttercream, finished with dried rose petals and crushed pistachios.',
    highlights: ['Signature house recipe', 'Natural rose essence', 'Topper included'],
    basePrice: 649,
    rating: 4.9,
    reviews: 412,
    isBestseller: true,
    sizes: CAKE_SIZES,
    flavours: [
      { name: 'Rose Pistachio', extra: 0 },
      { name: 'Rose Vanilla', extra: 0 },
      { name: 'Pistachio Saffron', extra: 60 },
    ],
    eggless: 'optional',
    allowsMessage: true,
    addedOrder: 14,
  },
  {
    id: 'p02',
    slug: 'funfetti-vanilla-cake',
    name: 'Funfetti Vanilla Dream',
    category: 'birthday',
    collections: [],
    image: '/images/products/funfetti-vanilla-cake.png',
    shortDescription: 'Madagascar vanilla sponge packed with rainbow sprinkles.',
    description:
      'A party in every slice. Fluffy Madagascar vanilla sponge folded with pastel sprinkles, layered with whipped vanilla bean cream and finished with more sprinkles on top.',
    highlights: ['Kid favourite', 'Light whipped cream', 'Candles on request'],
    basePrice: 549,
    rating: 4.7,
    reviews: 268,
    sizes: CAKE_SIZES,
    flavours: [
      { name: 'Vanilla Bean', extra: 0 },
      { name: 'Strawberry Vanilla', extra: 40 },
      { name: 'Chocolate Chip Vanilla', extra: 40 },
    ],
    eggless: 'optional',
    allowsMessage: true,
    addedOrder: 6,
  },
  {
    id: 'p03',
    slug: 'strawberry-cream-cake',
    name: 'Fresh Strawberry Cream Cake',
    category: 'birthday',
    collections: ['little-indulgences'],
    image: '/images/products/strawberry-cream-cake.png',
    shortDescription: 'Mahabaleshwar strawberries, chantilly cream and genoise.',
    description:
      'Seasonal Mahabaleshwar strawberries layered between airy genoise sponge and vanilla chantilly. Light, fresh and perfect for afternoon celebrations.',
    highlights: ['Seasonal fresh fruit', 'Light & airy', 'Low sugar cream'],
    basePrice: 599,
    rating: 4.8,
    reviews: 189,
    sizes: CAKE_SIZES,
    flavours: [
      { name: 'Strawberry Vanilla', extra: 0 },
      { name: 'Strawberry Chocolate', extra: 50 },
    ],
    eggless: 'optional',
    allowsMessage: true,
    addedOrder: 9,
  },
  {
    id: 'p04',
    slug: 'butterscotch-crunch-cake',
    name: 'Butterscotch Praline Crunch',
    category: 'birthday',
    collections: [],
    image: '/images/products/butterscotch-crunch-cake.png',
    shortDescription: 'Salted caramel drip over golden praline and butterscotch cream.',
    description:
      'A nostalgic classic, elevated. Butterscotch sponge soaked in caramel syrup, layered with butterscotch cream and house-made praline crunch, then crowned with a salted caramel drip.',
    highlights: ['House-made praline', 'Salted caramel drip', 'All-time classic'],
    basePrice: 529,
    rating: 4.7,
    reviews: 351,
    isBestseller: true,
    sizes: CAKE_SIZES,
    flavours: SINGLE_FLAVOUR('Butterscotch Caramel'),
    eggless: 'optional',
    allowsMessage: true,
    addedOrder: 3,
  },
  {
    id: 'p05',
    slug: 'red-velvet-heart-cake',
    name: 'Red Velvet Heart',
    category: 'anniversary',
    collections: ['celebrate-love'],
    image: '/images/products/red-velvet-heart-cake.png',
    shortDescription: 'Heart-shaped red velvet with tangy cream cheese frosting.',
    description:
      'Velvety cocoa-buttermilk sponge shaped into a heart, layered with whipped cream cheese frosting and dusted with red velvet crumbs and rose petals.',
    highlights: ['Heart-shaped', 'Real cream cheese', 'Rose petal finish'],
    basePrice: 749,
    rating: 4.9,
    reviews: 527,
    isBestseller: true,
    sizes: CAKE_SIZES,
    flavours: SINGLE_FLAVOUR('Red Velvet Cream Cheese'),
    eggless: 'optional',
    allowsMessage: true,
    addedOrder: 8,
  },
  {
    id: 'p06',
    slug: 'rasmalai-saffron-cake',
    name: 'Rasmalai Saffron Cake',
    category: 'anniversary',
    collections: ['pink-city', 'celebrate-love'],
    image: '/images/products/rasmalai-saffron-cake.png',
    shortDescription: 'Saffron milk-soaked sponge, rasmalai cream and pistachios.',
    description:
      'Where mithai meets patisserie. Cardamom sponge soaked in saffron rabri, layered with rasmalai cream and real rasmalai pieces, finished with pistachio slivers and edible silver.',
    highlights: ['Indian fusion', 'Kashmiri saffron', 'Real rasmalai inside'],
    basePrice: 699,
    rating: 4.9,
    reviews: 384,
    isBestseller: true,
    sizes: CAKE_SIZES,
    flavours: [
      { name: 'Classic Rasmalai', extra: 0 },
      { name: 'Rasmalai Rose', extra: 40 },
    ],
    eggless: 'always',
    allowsMessage: true,
    addedOrder: 12,
  },
  {
    id: 'p07',
    slug: 'midnight-rose-anniversary-cake',
    name: 'Midnight Rose Ganache',
    category: 'anniversary',
    collections: ['celebrate-love', 'midnight-chocolate'],
    image: '/images/products/midnight-rose-anniversary-cake.png',
    shortDescription: '64% dark ganache crowned with hand-crafted sugar roses.',
    description:
      'A dramatic, romantic centrepiece. Moist dark chocolate sponge with 64% couverture ganache, crowned with a bouquet of hand-crafted sugar roses and 24k edible gold leaf.',
    highlights: ['Hand-made sugar roses', 'Edible gold leaf', 'Belgian couverture'],
    basePrice: 899,
    rating: 4.8,
    reviews: 143,
    isNew: true,
    sizes: CAKE_SIZES,
    flavours: [
      { name: 'Dark Chocolate', extra: 0 },
      { name: 'Chocolate Raspberry', extra: 80 },
    ],
    eggless: 'optional',
    allowsMessage: true,
    addedOrder: 20,
  },
  {
    id: 'p08',
    slug: 'two-tier-floral-cake',
    name: 'Blooming Garden Two-Tier',
    category: 'designer',
    collections: ['celebrate-love'],
    image: '/images/products/two-tier-floral-cake.png',
    shortDescription: 'Two tiers of ivory buttercream with cascading piped florals.',
    description:
      'A wedding-worthy two-tier showpiece with cascading hand-piped buttercream peonies and roses in blush and ivory. Ideal for engagements, milestone anniversaries and roka ceremonies.',
    highlights: ['Hand-piped florals', '48-hour advance order', 'Free cake stand rental'],
    basePrice: 2299,
    rating: 5,
    reviews: 64,
    sizes: DESIGNER_SIZES.slice(1),
    flavours: [
      { name: 'Vanilla Raspberry', extra: 0 },
      { name: 'Lemon Elderflower', extra: 150 },
      { name: 'Chocolate Hazelnut', extra: 150 },
    ],
    eggless: 'optional',
    allowsMessage: true,
    addedOrder: 18,
  },
  {
    id: 'p09',
    slug: 'gold-drip-macaron-cake',
    name: 'Gold Drip Macaron Tower',
    category: 'designer',
    collections: [],
    image: '/images/products/gold-drip-macaron-cake.png',
    shortDescription: 'Tall blush cake with gold drip, macarons and meringue kisses.',
    description:
      'Our most photographed creation. A tall blush buttercream cake with a metallic gold drip, topped with French macarons, meringue kisses and chocolate spheres.',
    highlights: ['French macarons on top', 'Metallic gold drip', 'Extra-tall 6" height'],
    basePrice: 1199,
    rating: 4.9,
    reviews: 221,
    isBestseller: true,
    sizes: DESIGNER_SIZES,
    flavours: [
      { name: 'Vanilla Strawberry', extra: 0 },
      { name: 'Chocolate Truffle', extra: 0 },
      { name: 'Rose Lychee', extra: 120 },
    ],
    eggless: 'optional',
    allowsMessage: true,
    addedOrder: 16,
  },
  {
    id: 'p10',
    slug: 'pink-city-palace-cake',
    name: 'Pink City Palace Cake',
    category: 'designer',
    collections: ['pink-city'],
    image: '/images/products/pink-city-palace-cake.png',
    shortDescription: 'Hawa Mahal-inspired fondant artistry in terracotta pink.',
    description:
      'An ode to Jaipur. Hand-sculpted fondant inspired by the jharokhas of Hawa Mahal, painted in terracotta pink with gold detailing. Filled with saffron-pistachio cream.',
    highlights: ['Hand-sculpted fondant', '72-hour advance order', 'Gift-ready box'],
    basePrice: 2499,
    rating: 5,
    reviews: 38,
    isNew: true,
    sizes: DESIGNER_SIZES,
    flavours: [
      { name: 'Saffron Pistachio', extra: 0 },
      { name: 'Rose Cardamom', extra: 0 },
      { name: 'Dark Chocolate', extra: 0 },
    ],
    eggless: 'optional',
    allowsMessage: true,
    addedOrder: 22,
  },
  {
    id: 'p11',
    slug: 'belgian-chocolate-truffle-cake',
    name: 'Belgian Chocolate Truffle',
    category: 'chocolate',
    collections: ['midnight-chocolate'],
    image: '/images/products/belgian-chocolate-truffle-cake.png',
    shortDescription: 'Rich chocolate sponge with silky Callebaut truffle ganache.',
    description:
      'Our bestselling chocolate cake. Three layers of moist chocolate sponge, Callebaut truffle ganache and chocolate curls, with a whisper of sea salt.',
    highlights: ['Callebaut chocolate', 'Bestseller since 2016', 'Rich, not too sweet'],
    basePrice: 649,
    rating: 4.9,
    reviews: 896,
    isBestseller: true,
    sizes: CAKE_SIZES,
    flavours: [
      { name: 'Classic Truffle', extra: 0 },
      { name: 'Truffle Orange', extra: 50 },
      { name: 'Truffle Coffee', extra: 50 },
    ],
    eggless: 'optional',
    allowsMessage: true,
    addedOrder: 1,
  },
  {
    id: 'p12',
    slug: 'hazelnut-praline-cake',
    name: 'Hazelnut Praline Rocher',
    category: 'chocolate',
    collections: ['midnight-chocolate'],
    image: '/images/products/hazelnut-praline-cake.png',
    shortDescription: 'Gianduja mousse, hazelnut crunch and golden truffles.',
    description:
      'Inspired by everyone’s favourite gold-wrapped chocolate. Hazelnut sponge, gianduja mousse and feuilletine crunch, topped with roasted hazelnuts and praline truffles.',
    highlights: ['Roasted hazelnuts', 'Crunchy feuilletine', 'Truffle topping'],
    basePrice: 729,
    rating: 4.8,
    reviews: 302,
    sizes: CAKE_SIZES,
    flavours: SINGLE_FLAVOUR('Hazelnut Praline'),
    eggless: 'optional',
    allowsMessage: true,
    addedOrder: 10,
  },
  {
    id: 'p13',
    slug: 'dark-chocolate-mirror-cake',
    name: 'Dark Mirror Entremet',
    category: 'chocolate',
    collections: ['midnight-chocolate'],
    image: '/images/products/dark-chocolate-mirror-cake.png',
    shortDescription: 'Glossy mirror glaze over 70% mousse and almond dacquoise.',
    description:
      'A French-style entremet: 70% dark chocolate mousse over almond dacquoise and a crémeux centre, sealed under a flawless mirror glaze with a touch of gold.',
    highlights: ['French entremet', '70% dark chocolate', 'Chef’s special'],
    basePrice: 849,
    rating: 4.8,
    reviews: 97,
    isNew: true,
    sizes: CAKE_SIZES.slice(0, 3),
    flavours: [
      { name: 'Dark Chocolate', extra: 0 },
      { name: 'Dark Chocolate Passionfruit', extra: 90 },
    ],
    eggless: 'none',
    allowsMessage: true,
    addedOrder: 21,
  },
  {
    id: 'p14',
    slug: 'classic-photo-cake',
    name: 'Classic Memories Photo Cake',
    category: 'photo',
    collections: [],
    image: '/images/products/classic-photo-cake.png',
    shortDescription: 'Your favourite photo printed on a vanilla cream cake.',
    description:
      'Turn a favourite memory into a centrepiece. We print your photo on edible sugar sheet with food-safe inks and frame it with piped cream and sugar blossoms. Share your photo with us on WhatsApp after ordering.',
    highlights: ['Food-safe edible print', 'Photo via WhatsApp', 'Square shape'],
    basePrice: 799,
    rating: 4.7,
    reviews: 238,
    sizes: CAKE_SIZES,
    flavours: [
      { name: 'Vanilla', extra: 0 },
      { name: 'Pineapple', extra: 0 },
      { name: 'Chocolate', extra: 50 },
    ],
    eggless: 'optional',
    allowsMessage: true,
    addedOrder: 5,
  },
  {
    id: 'p15',
    slug: 'heart-photo-cake',
    name: 'Forever Us Heart Photo Cake',
    category: 'photo',
    collections: ['celebrate-love'],
    image: '/images/products/heart-photo-cake.png',
    shortDescription: 'Heart-shaped photo cake framed with blush rosettes.',
    description:
      'A heart-shaped cake topped with your photo printed on edible sheet and framed with blush buttercream rosettes. A sweet surprise for anniversaries and Valentine’s.',
    highlights: ['Heart shape', 'Edible photo print', 'Blush rosettes'],
    basePrice: 849,
    rating: 4.8,
    reviews: 176,
    sizes: CAKE_SIZES,
    flavours: [
      { name: 'Strawberry', extra: 0 },
      { name: 'Red Velvet', extra: 60 },
      { name: 'Chocolate', extra: 40 },
    ],
    eggless: 'optional',
    allowsMessage: true,
    addedOrder: 13,
  },
  {
    id: 'p16',
    slug: 'blueberry-cheesecake-pastry',
    name: 'Blueberry Cheesecake Slice',
    category: 'pastries',
    collections: ['little-indulgences'],
    image: '/images/products/blueberry-cheesecake-pastry.png',
    shortDescription: 'Baked New York cheesecake with wild blueberry compote.',
    description:
      'Dense, creamy baked New York-style cheesecake on a buttery biscuit base, topped with glossy wild blueberry compote.',
    highlights: ['Baked, not set', 'Wild blueberries', 'Buttery biscuit base'],
    basePrice: 279,
    rating: 4.8,
    reviews: 445,
    isBestseller: true,
    sizes: PASTRY_SIZES,
    flavours: [
      { name: 'Blueberry', extra: 0 },
      { name: 'Strawberry', extra: 0 },
      { name: 'Lotus Biscoff', extra: 30 },
    ],
    eggless: 'none',
    allowsMessage: false,
    addedOrder: 4,
  },
  {
    id: 'p17',
    slug: 'mango-mousse-pastry',
    name: 'Alphonso Mango Mousse',
    category: 'pastries',
    collections: ['little-indulgences'],
    image: '/images/products/mango-mousse-pastry.png',
    shortDescription: 'Ratnagiri Alphonso mango mousse with a glossy mango glaze.',
    description:
      'Light-as-air mousse made with Ratnagiri Alphonso pulp over vanilla sponge, glazed with mango gelée and topped with fresh mango cubes.',
    highlights: ['Real Alphonso pulp', 'Seasonal favourite', '100% eggless'],
    basePrice: 229,
    rating: 4.7,
    reviews: 210,
    isNew: true,
    sizes: PASTRY_SIZES,
    flavours: SINGLE_FLAVOUR('Alphonso Mango'),
    eggless: 'always',
    allowsMessage: false,
    addedOrder: 19,
  },
  {
    id: 'p18',
    slug: 'assorted-pastry-box',
    name: 'Patisserie Tasting Box',
    category: 'pastries',
    collections: ['little-indulgences'],
    image: '/images/products/assorted-pastry-box.png',
    shortDescription: 'Six of our best pastries in one beautiful gift box.',
    description:
      'Can’t choose? Our chef selects six bestselling pastries — chocolate truffle, red velvet, mango, blueberry cheesecake, pistachio and black forest — packed in a keepsake box.',
    highlights: ['Six flavours', 'Gift-ready keepsake box', 'Great for sharing'],
    basePrice: 899,
    rating: 4.9,
    reviews: 167,
    sizes: [
      { label: 'Box of 6', detail: '6 assorted pastries', multiplier: 1 },
      { label: 'Box of 12', detail: '12 assorted pastries', multiplier: 1.9 },
    ],
    flavours: [
      { name: 'Chef’s Assortment', extra: 0 },
      { name: 'All Chocolate', extra: 0 },
      { name: 'Fruit & Cream', extra: 0 },
    ],
    eggless: 'optional',
    allowsMessage: true,
    addedOrder: 11,
  },
  {
    id: 'p19',
    slug: 'fudge-walnut-brownies',
    name: 'Fudge Walnut Brownies',
    category: 'brownies-desserts',
    collections: ['little-indulgences', 'midnight-chocolate'],
    image: '/images/products/fudge-walnut-brownies.png',
    shortDescription: 'Crackle-top, gooey-centre brownies with toasted walnuts.',
    description:
      'Our cult brownie: crackly shiny top, dense fudgy centre and generous toasted California walnuts, made with Belgian dark chocolate and brown butter.',
    highlights: ['Brown butter', 'Belgian dark chocolate', 'Ships well'],
    basePrice: 349,
    rating: 4.9,
    reviews: 732,
    isBestseller: true,
    sizes: BROWNIE_SIZES,
    flavours: [
      { name: 'Walnut', extra: 0 },
      { name: 'Triple Chocolate', extra: 0 },
      { name: 'Nutella Swirl', extra: 50 },
    ],
    eggless: 'optional',
    allowsMessage: false,
    addedOrder: 2,
  },
  {
    id: 'p20',
    slug: 'biscoff-cheesecake-jars',
    name: 'Lotus Biscoff Cheesecake Jars',
    category: 'brownies-desserts',
    collections: ['little-indulgences'],
    image: '/images/products/biscoff-cheesecake-jars.png',
    shortDescription: 'Layered no-bake cheesecake with caramelised Biscoff.',
    description:
      'Biscoff crumb, whipped vanilla cheesecake and molten Biscoff spread, layered in reusable glass jars and topped with a whole Lotus biscuit.',
    highlights: ['Reusable glass jars', 'No-bake', '100% eggless'],
    basePrice: 399,
    rating: 4.8,
    reviews: 298,
    sizes: [
      { label: 'Pair of jars', detail: '2 × 150 ml', multiplier: 1 },
      { label: 'Set of 4', detail: '4 × 150 ml', multiplier: 1.85 },
    ],
    flavours: SINGLE_FLAVOUR('Lotus Biscoff'),
    eggless: 'always',
    allowsMessage: false,
    addedOrder: 15,
  },
  {
    id: 'p21',
    slug: 'gulab-jamun-tres-leches',
    name: 'Gulab Jamun Tres Leches',
    category: 'brownies-desserts',
    collections: ['pink-city'],
    image: '/images/products/gulab-jamun-tres-leches.png',
    shortDescription: 'Three-milk sponge with mini gulab jamuns and rose.',
    description:
      'Our festive fusion favourite. Sponge soaked in three milks and cardamom, topped with whipped cream, mini gulab jamuns, pistachio and rose petals.',
    highlights: ['Indian fusion', 'Festive favourite', '100% eggless'],
    basePrice: 449,
    rating: 4.9,
    reviews: 256,
    sizes: [
      { label: 'Serves 2', detail: 'Ceramic dish', multiplier: 1 },
      { label: 'Serves 4–6', detail: 'Family tray', multiplier: 2.1 },
    ],
    flavours: SINGLE_FLAVOUR('Cardamom Rose'),
    eggless: 'always',
    allowsMessage: false,
    addedOrder: 17,
  },
  {
    id: 'p22',
    slug: 'black-forest-classic-cake',
    name: 'Black Forest Kirsch Cake',
    category: 'chocolate',
    collections: ['midnight-chocolate'],
    image: '/images/products/black-forest-classic-cake.png',
    shortDescription: 'Chocolate sponge, cherries, chantilly and dark shavings.',
    description:
      'The classic, done properly. Chocolate genoise soaked in cherry syrup, layered with chantilly and sour cherries, covered in dark chocolate shavings.',
    highlights: ['Sour cherries', 'Light chantilly', 'Classic recipe'],
    basePrice: 579,
    rating: 4.6,
    reviews: 341,
    sizes: CAKE_SIZES,
    flavours: SINGLE_FLAVOUR('Black Forest'),
    eggless: 'optional',
    allowsMessage: true,
    addedOrder: 7,
  },
]

export const EGGLESS_FEE_PER_UNIT = 50

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug)
}

export function getCategory(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getCollection(slug: string) {
  return COLLECTIONS.find((c) => c.slug === slug)
}

export function calculateUnitPrice(
  product: Product,
  sizeLabel: string,
  flavourName: string,
  eggless: boolean,
) {
  const size = product.sizes.find((s) => s.label === sizeLabel) ?? product.sizes[0]
  const flavour = product.flavours.find((f) => f.name === flavourName) ?? product.flavours[0]
  const egglessFee =
    eggless && product.eggless === 'optional' ? EGGLESS_FEE_PER_UNIT * size.multiplier : 0
  return Math.round((product.basePrice + flavour.extra) * size.multiplier + egglessFee)
}

export function getRelatedProducts(product: Product, limit = 4) {
  const sameCategory = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id)
  const others = PRODUCTS.filter(
    (p) => p.category !== product.category && p.collections.some((c) => product.collections.includes(c)),
  )
  const fallback = PRODUCTS.filter((p) => p.isBestseller && p.id !== product.id)
  const unique = Array.from(new Map([...sameCategory, ...others, ...fallback].map((p) => [p.id, p])).values())
  return unique.slice(0, limit)
}

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'bestselling', label: 'Bestselling' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
] as const

export type SortValue = (typeof SORT_OPTIONS)[number]['value']
