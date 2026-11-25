// Art of Pairing defaults — shared by the admin manager and the /api/pairing route
export type Side = { productId: string; name: string; bio: string; image: string; tags: string[] }
export type Weight = { label: string; price: number; mrp: number; aVariantId: string; bVariantId: string }
export type Couple = { id: string; name: string; tag: string; mealIcon: string; mealName: string; lovedText: string; tip: string; enabled: boolean; a: Side; b: Side; weights: Weight[] }
export type Settings = { enabled: boolean; eyebrow: string; title: string; titleAccent: string; subtitle: string; explainText: string; matchText: string; buttonText: string; moreText: string }


const side = (name: string, bio: string, file: string, tags: string[]): Side => ({ productId: '', name, bio, image: `assets/images/${file}`, tags })
const w = (p250: number, m250: number): Weight[] => [
  { label: '250 g each', price: p250, mrp: m250, aVariantId: '250g', bVariantId: '250g' },
  { label: '500 g each', price: Math.round(p250 * 1.85), mrp: Math.round(m250 * 1.85), aVariantId: '500g', bVariantId: '500g' },
]

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  eyebrow: 'CURATED COMBOS',
  title: 'The Art of',
  titleAccent: 'Pairing',
  subtitle: 'Flavors meant to be experienced together',
  explainText: '2 jars Amma pairs together · one combo price',
  matchText: 'Made for each other',
  buttonText: "Meet Amma's perfect couples",
  moreText: 'MORE PERFECT COUPLES',
}

export const DEFAULT_COUPLES: Couple[] = [
  { id: 'c1', name: 'Bellam Avakaya + Idli Karam Podi', tag: 'PICKLE & PODI', mealIcon: '🌅', mealName: 'BREAKFAST', lovedText: 'Sweet & fiery', tip: 'Mix the podi with ghee, add a spoon of avakaya on the side of hot idlis.', enabled: true,
    a: side('Bellam Avakaya', 'Raw mango in jaggery-chilli masala', 'pair_bellam_avakaya.png', ['SWEET', 'TANGY']), b: side('Idli Karam Podi', 'Roasted urad dal & red chilli', 'pair_idli_karam_podi.png', ['SPICY', 'CRUNCHY']), weights: w(379, 419) },
  { id: 'c2', name: 'Gongura Pickle + Karivepaku Podi', tag: 'ANDHRA CLASSICS', mealIcon: '🍚', mealName: 'LUNCH', lovedText: 'The Andhra classic', tip: 'Hot rice, ghee, karivepaku podi first — gongura to finish.', enabled: true,
    a: side('Gongura Pickle', 'Sorrel leaves, garlic & sesame oil', 'pair_gongura_pickle.png', ['TANGY', 'SPICY']), b: side('Karivepaku Podi', 'Curry-leaf spice powder', 'pair_karivepaku_podi.png', ['HERBY', 'AROMATIC']), weights: w(349, 399) },
  { id: 'c3', name: 'Kara Murukku + Sunnunda Laddu', tag: 'SNACK & SWEET', mealIcon: '☕', mealName: 'EVENING TEA', lovedText: 'The ultimate tea-time combo', tip: 'Crunchy murukku with chai, sunnunda to finish.', enabled: true,
    a: side('Kara Murukku', 'Crispy spiral festive snack', 'pair_kara_murukku.png', ['CRISPY', 'SPICY']), b: side('Sunnunda Laddu', 'Roasted urad dal & pure ghee', 'pair_sunnunda_laddu.png', ['PURE GHEE', 'TRADITIONAL']), weights: w(319, 395) },
  { id: 'c4', name: 'Allam Velluli Pickle + Munagaku Podi', tag: 'HEALTHY HEAT', mealIcon: '🍛', mealName: 'LUNCH', lovedText: 'Good for you, full of flavour', tip: 'Moringa podi with rice and ghee, ginger-garlic pickle on the side.', enabled: true,
    a: side('Allam Velluli Pickle', 'Ginger & garlic in chilli oil', 'pair_allam_velluli_pickle.png', ['ZESTY', 'SPICY']), b: side('Munagaku Podi', 'Moringa-leaf spice powder', 'pair_munagaku_podi.png', ['HEALTHY', 'IRON-RICH']), weights: w(369, 419) },
  { id: 'c5', name: 'Chakinalu + Palli Patti', tag: 'FESTIVE PAIR', mealIcon: '🪔', mealName: 'SANKRANTI', lovedText: 'A Sankranti tradition', tip: 'Share a box with family during the festival.', enabled: true,
    a: side('Chakinalu', 'Rice-flour sesame spirals', 'pair_chakinalu.png', ['CRISPY', 'SESAME']), b: side('Palli Patti', 'Peanut & jaggery chikki', 'pair_palli_patti.png', ['SWEET', 'CRUNCHY']), weights: w(299, 349) },
  { id: 'c6', name: 'Lemon Pickle + Putnala Podi', tag: 'CURD-RICE PARTNERS', mealIcon: '🥣', mealName: 'DINNER', lovedText: 'Light, tangy, comforting', tip: 'Perfect with curd rice on a hot evening.', enabled: true,
    a: side('Lemon Pickle', 'Lemons in chilli masala', 'pair_lemon_pickle.png', ['TANGY', 'ZESTY']), b: side('Putnala Podi', 'Roasted-gram spice powder', 'pair_putnala_podi.png', ['MILD', 'NUTTY']), weights: w(299, 339) },
]

