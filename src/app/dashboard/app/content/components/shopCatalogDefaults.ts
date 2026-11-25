// Shop catalogue (Shop tab: lazy susan + category decks) defaults — used by the admin board
export type ShVariant = { id: string; label: string; price: number; mrp: number; inStock: boolean }
export type ShIngredient = { name: string; image: string }
export type ShProduct = { id: string; name: string; image: string; description: string; tag: string; cureNote: string; spice: number; rating: number; color1: string; color2: string; enabled: boolean; variants: ShVariant[]; ingredients: ShIngredient[]; process: string; processText: string; origin: string; shelfLife: string; storage: string; highlight: string; features: string[] }
export type ShCategory = { id: string; slug: string; name: string; label: string; subtitle: string; deckTitle: string; image: string; color1: string; color2: string; color3: string; enabled: boolean; products: ShProduct[] }
export type ShSettings = { enabled: boolean; eyebrow: string; titleStart: string; titleAccent: string; hint: string; products: boolean; artisanName: string; artisanSince: string; artisanPhoto: string; artisanQuote: string }

export const DEFAULT_SH_SETTINGS: ShSettings = {"enabled": true, "eyebrow": "SHOP BY CATEGORY", "titleStart": "Spin Amma's", "titleAccent": "lazy susan", "hint": "👆 Tap a bowl, a name or swipe to choose", "products": true, "artisanName": "Ambhujakshi Amma", "artisanSince": "Cooking since 1982", "artisanPhoto": "assets/images/ing_amma.png", "artisanQuote": "Made with the same love as I make for my family."}

export const DEFAULT_SH_CATEGORIES: ShCategory[] = [
 {
  "id": "pickles",
  "slug": "pickle",
  "name": "Pickles",
  "label": "BESTSELLERS",
  "subtitle": "Sun-cured in jaadis",
  "image": "assets/images/pickle_bellam_avakaya.png",
  "color1": "#E8432B",
  "color2": "#9E1424",
  "color3": "#4A0A0E",
  "enabled": true,
  "deckTitle": "Traditional Pickles",
  "products": [
   {
    "id": "bellam_avakaya",
    "name": "Bellam Avakaya",
    "image": "assets/images/pickle_bellam_avakaya.png",
    "description": "Sweet jaggery meets fiery Guntur chilli in wood-pressed sesame oil.",
    "tag": "Bestseller",
    "cureNote": "☀ 21 days sun-cured",
    "spice": 3,
    "rating": 4.9,
    "color1": "#8A1A10",
    "color2": "#2A0806",
    "enabled": true,
    "variants": [
     {
      "id": "bellam_avakaya_250g",
      "label": "250g",
      "price": 219,
      "mrp": 252,
      "inStock": true
     },
     {
      "id": "bellam_avakaya_500g",
      "label": "500g",
      "price": 416,
      "mrp": 478,
      "inStock": true
     },
     {
      "id": "bellam_avakaya_1kg",
      "label": "1kg",
      "price": 788,
      "mrp": 906,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Raw mango",
      "image": "assets/images/ing_raw_mango.png"
     },
     {
      "name": "Jaggery",
      "image": "assets/images/jaggery_0.png"
     },
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Mustard",
      "image": "assets/images/mustard_0.png"
     },
     {
      "name": "Fenugreek",
      "image": "assets/images/fenugreek_0.png"
     },
     {
      "name": "Sesame oil",
      "image": "assets/images/ing_sesame_oil.png"
     }
    ],
    "process": "Sun-cured",
    "processText": "Cut by hand, mixed with stone-ground spice and cured in ceramic jaadis under the sun.",
    "origin": "Coastal Andhra",
    "shelfLife": "12 months",
    "storage": "Use a dry spoon. Keep the oil layer on top.",
    "highlight": "cold-pressed sesame oil & Guntur chilli",
    "features": [
     "No preservatives",
     "Sun-cured",
     "Cold-pressed oil"
    ]
   },
   {
    "id": "gongura_pickle",
    "name": "Gongura Pickle",
    "image": "assets/images/pickle_gongura.png",
    "description": "Tangy sorrel leaves slow-cooked with red chilli and garlic.",
    "tag": "Andhra classic",
    "cureNote": "☀ Sun-cured in jaadis",
    "spice": 4,
    "rating": 4.8,
    "color1": "#5A2A12",
    "color2": "#1E0A04",
    "enabled": true,
    "variants": [
     {
      "id": "gongura_pickle_250g",
      "label": "250g",
      "price": 189,
      "mrp": 217,
      "inStock": true
     },
     {
      "id": "gongura_pickle_500g",
      "label": "500g",
      "price": 359,
      "mrp": 413,
      "inStock": true
     },
     {
      "id": "gongura_pickle_1kg",
      "label": "1kg",
      "price": 680,
      "mrp": 782,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Gongura leaves",
      "image": "assets/images/ing_gongura.png"
     },
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Garlic",
      "image": "assets/images/ing_garlic.png"
     },
     {
      "name": "Mustard",
      "image": "assets/images/mustard_0.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     },
     {
      "name": "Sesame oil",
      "image": "assets/images/ing_sesame_oil.png"
     }
    ],
    "process": "Sun-cured",
    "processText": "Cut by hand, mixed with stone-ground spice and cured in ceramic jaadis under the sun.",
    "origin": "Coastal Andhra",
    "shelfLife": "12 months",
    "storage": "Use a dry spoon. Keep the oil layer on top.",
    "highlight": "cold-pressed sesame oil & Guntur chilli",
    "features": [
     "No preservatives",
     "Sun-cured",
     "Cold-pressed oil"
    ]
   },
   {
    "id": "allam_velluli_pickle",
    "name": "Allam Velluli Pickle",
    "image": "assets/images/pickle_allam_velluli.png",
    "description": "Ginger and garlic pounded with chilli and tamarind.",
    "tag": "Gut friendly",
    "cureNote": "☀ 14 days sun-cured",
    "spice": 3,
    "rating": 4.8,
    "color1": "#8A3A10",
    "color2": "#2A1006",
    "enabled": true,
    "variants": [
     {
      "id": "allam_velluli_pickle_250g",
      "label": "250g",
      "price": 199,
      "mrp": 229,
      "inStock": true
     },
     {
      "id": "allam_velluli_pickle_500g",
      "label": "500g",
      "price": 378,
      "mrp": 435,
      "inStock": true
     },
     {
      "id": "allam_velluli_pickle_1kg",
      "label": "1kg",
      "price": 716,
      "mrp": 823,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Ginger",
      "image": "assets/images/ginger_0.png"
     },
     {
      "name": "Garlic",
      "image": "assets/images/ing_garlic.png"
     },
     {
      "name": "Tamarind",
      "image": "assets/images/tamarind_0.png"
     },
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Jaggery",
      "image": "assets/images/jaggery_0.png"
     },
     {
      "name": "Sesame oil",
      "image": "assets/images/ing_sesame_oil.png"
     }
    ],
    "process": "Sun-cured",
    "processText": "Cut by hand, mixed with stone-ground spice and cured in ceramic jaadis under the sun.",
    "origin": "Coastal Andhra",
    "shelfLife": "12 months",
    "storage": "Use a dry spoon. Keep the oil layer on top.",
    "highlight": "cold-pressed sesame oil & Guntur chilli",
    "features": [
     "No preservatives",
     "Sun-cured",
     "Cold-pressed oil"
    ]
   },
   {
    "id": "usiri_pickle",
    "name": "Usirikaya Pickle",
    "image": "assets/images/pickle_usirikaya.png",
    "description": "Whole amla in spiced sesame oil — tangy and rich in vitamin C.",
    "tag": "Vitamin C",
    "cureNote": "☀ Sun-cured in jaadis",
    "spice": 2,
    "rating": 4.8,
    "color1": "#5A5A14",
    "color2": "#1E1E06",
    "enabled": true,
    "variants": [
     {
      "id": "usiri_pickle_250g",
      "label": "250g",
      "price": 189,
      "mrp": 217,
      "inStock": true
     },
     {
      "id": "usiri_pickle_500g",
      "label": "500g",
      "price": 359,
      "mrp": 413,
      "inStock": true
     },
     {
      "id": "usiri_pickle_1kg",
      "label": "1kg",
      "price": 680,
      "mrp": 782,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Amla",
      "image": "assets/images/ing_amla.png"
     },
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Mustard",
      "image": "assets/images/mustard_0.png"
     },
     {
      "name": "Fenugreek",
      "image": "assets/images/fenugreek_0.png"
     },
     {
      "name": "Turmeric",
      "image": "assets/images/turmeric_0.png"
     },
     {
      "name": "Sesame oil",
      "image": "assets/images/ing_sesame_oil.png"
     }
    ],
    "process": "Sun-cured",
    "processText": "Cut by hand, mixed with stone-ground spice and cured in ceramic jaadis under the sun.",
    "origin": "Coastal Andhra",
    "shelfLife": "12 months",
    "storage": "Use a dry spoon. Keep the oil layer on top.",
    "highlight": "cold-pressed sesame oil & Guntur chilli",
    "features": [
     "No preservatives",
     "Sun-cured",
     "Cold-pressed oil"
    ]
   },
   {
    "id": "maagaya_pickle",
    "name": "Maagaya Pickle",
    "image": "assets/images/pickle_maagaya.png",
    "description": "Sun-dried raw mango pieces in a deep red chilli masala.",
    "tag": "Summer special",
    "cureNote": "☀ 30 days sun-dried",
    "spice": 4,
    "rating": 4.8,
    "color1": "#9A1E10",
    "color2": "#2E0806",
    "enabled": true,
    "variants": [
     {
      "id": "maagaya_pickle_250g",
      "label": "250g",
      "price": 229,
      "mrp": 263,
      "inStock": true
     },
     {
      "id": "maagaya_pickle_500g",
      "label": "500g",
      "price": 435,
      "mrp": 500,
      "inStock": true
     },
     {
      "id": "maagaya_pickle_1kg",
      "label": "1kg",
      "price": 824,
      "mrp": 948,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Raw mango",
      "image": "assets/images/ing_raw_mango.png"
     },
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Mustard",
      "image": "assets/images/mustard_0.png"
     },
     {
      "name": "Fenugreek",
      "image": "assets/images/fenugreek_0.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     },
     {
      "name": "Sesame oil",
      "image": "assets/images/ing_sesame_oil.png"
     }
    ],
    "process": "Sun-cured",
    "processText": "Cut by hand, mixed with stone-ground spice and cured in ceramic jaadis under the sun.",
    "origin": "Coastal Andhra",
    "shelfLife": "12 months",
    "storage": "Use a dry spoon. Keep the oil layer on top.",
    "highlight": "cold-pressed sesame oil & Guntur chilli",
    "features": [
     "No preservatives",
     "Sun-cured",
     "Cold-pressed oil"
    ]
   },
   {
    "id": "lemon_pickle",
    "name": "Lemon Pickle",
    "image": "assets/images/pickle_lemon.png",
    "description": "Juicy lemons softened in salt and spices, tangy and bright.",
    "tag": "Tangy",
    "cureNote": "☀ 21 days sun-cured",
    "spice": 2,
    "rating": 4.8,
    "color1": "#9A7A10",
    "color2": "#2E2406",
    "enabled": true,
    "variants": [
     {
      "id": "lemon_pickle_250g",
      "label": "250g",
      "price": 159,
      "mrp": 183,
      "inStock": true
     },
     {
      "id": "lemon_pickle_500g",
      "label": "500g",
      "price": 302,
      "mrp": 347,
      "inStock": true
     },
     {
      "id": "lemon_pickle_1kg",
      "label": "1kg",
      "price": 572,
      "mrp": 658,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Lemon",
      "image": "assets/images/ing_lemon.png"
     },
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Turmeric",
      "image": "assets/images/turmeric_0.png"
     },
     {
      "name": "Fenugreek",
      "image": "assets/images/fenugreek_0.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     },
     {
      "name": "Sesame oil",
      "image": "assets/images/ing_sesame_oil.png"
     }
    ],
    "process": "Sun-cured",
    "processText": "Cut by hand, mixed with stone-ground spice and cured in ceramic jaadis under the sun.",
    "origin": "Coastal Andhra",
    "shelfLife": "12 months",
    "storage": "Use a dry spoon. Keep the oil layer on top.",
    "highlight": "cold-pressed sesame oil & Guntur chilli",
    "features": [
     "No preservatives",
     "Sun-cured",
     "Cold-pressed oil"
    ]
   },
   {
    "id": "pandu_mirapakaya",
    "name": "Pandu Mirapakaya",
    "image": "assets/images/pickle_pandu_mirapakaya.png",
    "description": "Ripe red chillies ground with tamarind — bold and fiery.",
    "tag": "Extra hot",
    "cureNote": "☀ Sun-cured in jaadis",
    "spice": 5,
    "rating": 4.8,
    "color1": "#A01010",
    "color2": "#300404",
    "enabled": true,
    "variants": [
     {
      "id": "pandu_mirapakaya_250g",
      "label": "250g",
      "price": 179,
      "mrp": 206,
      "inStock": true
     },
     {
      "id": "pandu_mirapakaya_500g",
      "label": "500g",
      "price": 340,
      "mrp": 391,
      "inStock": true
     },
     {
      "id": "pandu_mirapakaya_1kg",
      "label": "1kg",
      "price": 644,
      "mrp": 741,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Tamarind",
      "image": "assets/images/tamarind_0.png"
     },
     {
      "name": "Garlic",
      "image": "assets/images/ing_garlic.png"
     },
     {
      "name": "Fenugreek",
      "image": "assets/images/fenugreek_0.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     },
     {
      "name": "Sesame oil",
      "image": "assets/images/ing_sesame_oil.png"
     }
    ],
    "process": "Sun-cured",
    "processText": "Cut by hand, mixed with stone-ground spice and cured in ceramic jaadis under the sun.",
    "origin": "Coastal Andhra",
    "shelfLife": "12 months",
    "storage": "Use a dry spoon. Keep the oil layer on top.",
    "highlight": "cold-pressed sesame oil & Guntur chilli",
    "features": [
     "No preservatives",
     "Sun-cured",
     "Cold-pressed oil"
    ]
   },
   {
    "id": "tomato_pickle",
    "name": "Tomato Pickle",
    "image": "assets/images/pickle_tomato.png",
    "description": "Country tomatoes cooked down with chilli and mustard.",
    "tag": "Kids favourite",
    "cureNote": "✨ Slow-cooked",
    "spice": 2,
    "rating": 4.8,
    "color1": "#A0281A",
    "color2": "#300A06",
    "enabled": true,
    "variants": [
     {
      "id": "tomato_pickle_250g",
      "label": "250g",
      "price": 169,
      "mrp": 194,
      "inStock": true
     },
     {
      "id": "tomato_pickle_500g",
      "label": "500g",
      "price": 321,
      "mrp": 369,
      "inStock": true
     },
     {
      "id": "tomato_pickle_1kg",
      "label": "1kg",
      "price": 608,
      "mrp": 699,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Tomato",
      "image": "assets/images/ing_tomato.png"
     },
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Garlic",
      "image": "assets/images/ing_garlic.png"
     },
     {
      "name": "Mustard",
      "image": "assets/images/mustard_0.png"
     },
     {
      "name": "Tamarind",
      "image": "assets/images/tamarind_0.png"
     },
     {
      "name": "Sesame oil",
      "image": "assets/images/ing_sesame_oil.png"
     }
    ],
    "process": "Sun-cured",
    "processText": "Cut by hand, mixed with stone-ground spice and cured in ceramic jaadis under the sun.",
    "origin": "Coastal Andhra",
    "shelfLife": "12 months",
    "storage": "Use a dry spoon. Keep the oil layer on top.",
    "highlight": "cold-pressed sesame oil & Guntur chilli",
    "features": [
     "No preservatives",
     "Sun-cured",
     "Cold-pressed oil"
    ]
   },
   {
    "id": "uppava",
    "name": "Uppava",
    "image": "assets/images/cb_uppava.png",
    "description": "Traditional salted pickle, simple and timeless.",
    "tag": "Traditional",
    "cureNote": "☀ Sun-cured",
    "spice": 2,
    "rating": 4.8,
    "color1": "#7A4A1A",
    "color2": "#241406",
    "enabled": true,
    "variants": [
     {
      "id": "uppava_250g",
      "label": "250g",
      "price": 159,
      "mrp": 183,
      "inStock": true
     },
     {
      "id": "uppava_500g",
      "label": "500g",
      "price": 302,
      "mrp": 348,
      "inStock": true
     },
     {
      "id": "uppava_1kg",
      "label": "1kg",
      "price": 572,
      "mrp": 659,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Raw mango",
      "image": "assets/images/ing_raw_mango.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     },
     {
      "name": "Turmeric",
      "image": "assets/images/turmeric_0.png"
     },
     {
      "name": "Mustard",
      "image": "assets/images/mustard_0.png"
     }
    ],
    "process": "Sun-cured",
    "processText": "Cut by hand, mixed with stone-ground spice and cured in ceramic jaadis under the sun.",
    "origin": "Coastal Andhra",
    "shelfLife": "12 months",
    "storage": "Use a dry spoon. Keep the oil layer on top.",
    "highlight": "cold-pressed sesame oil & Guntur chilli",
    "features": [
     "No preservatives",
     "Sun-cured",
     "Cold-pressed oil"
    ]
   }
  ]
 },
 {
  "id": "snacks",
  "slug": "snack",
  "name": "Snacks",
  "label": "CRISPY",
  "subtitle": "Crunchy, tea-time ready",
  "image": "assets/images/loved_kara_murukku.png",
  "color1": "#F59E2B",
  "color2": "#C2410C",
  "color3": "#5A1E04",
  "enabled": true,
  "deckTitle": "Crunchy Snacks",
  "products": [
   {
    "id": "chakinalu",
    "name": "Chakinalu",
    "image": "assets/images/best_chakinalu.png",
    "description": "Sankranti rice-flour spirals with sesame and ajwain.",
    "tag": "Bestseller",
    "cureNote": "✨ Fried in cold-pressed oil",
    "spice": 2,
    "rating": 4.9,
    "color1": "#8A5A14",
    "color2": "#2A1A06",
    "enabled": true,
    "variants": [
     {
      "id": "chakinalu_250g",
      "label": "250g",
      "price": 139,
      "mrp": 160,
      "inStock": true
     },
     {
      "id": "chakinalu_500g",
      "label": "500g",
      "price": 264,
      "mrp": 304,
      "inStock": true
     },
     {
      "id": "chakinalu_1kg",
      "label": "1kg",
      "price": 500,
      "mrp": 576,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Rice flour",
      "image": "assets/images/ing_rice_flour.png"
     },
     {
      "name": "Sesame",
      "image": "assets/images/sesame_0.png"
     },
     {
      "name": "Ajwain",
      "image": "assets/images/ajwain_0.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     }
    ],
    "process": "Fried fresh",
    "processText": "Made in small batches and fried in cold-pressed oil, then packed the same day.",
    "origin": "Amma's kitchen",
    "shelfLife": "2 months",
    "storage": "Keep the pack closed tightly to stay crisp.",
    "highlight": "cold-pressed oil, made fresh",
    "features": [
     "No preservatives",
     "Cold-pressed oil",
     "Packed fresh"
    ]
   },
   {
    "id": "khara_mixture",
    "name": "Khara Mixture",
    "image": "assets/images/best_khara_mixture.png",
    "description": "Crunchy sev, boondi, peanuts and curry leaves.",
    "tag": "Tea-time",
    "cureNote": "✨ Fried in cold-pressed oil",
    "spice": 2,
    "rating": 4.8,
    "color1": "#8A4A14",
    "color2": "#2A1606",
    "enabled": true,
    "variants": [
     {
      "id": "khara_mixture_250g",
      "label": "250g",
      "price": 149,
      "mrp": 171,
      "inStock": true
     },
     {
      "id": "khara_mixture_500g",
      "label": "500g",
      "price": 283,
      "mrp": 325,
      "inStock": true
     },
     {
      "id": "khara_mixture_1kg",
      "label": "1kg",
      "price": 536,
      "mrp": 616,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Gram flour",
      "image": "assets/images/ing_gram_flour.png"
     },
     {
      "name": "Peanuts",
      "image": "assets/images/peanut_0.png"
     },
     {
      "name": "Curry leaves",
      "image": "assets/images/curryleaf_0.png"
     },
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Roasted gram",
      "image": "assets/images/roastedgram_0.png"
     }
    ],
    "process": "Fried fresh",
    "processText": "Made in small batches and fried in cold-pressed oil, then packed the same day.",
    "origin": "Amma's kitchen",
    "shelfLife": "2 months",
    "storage": "Keep the pack closed tightly to stay crisp.",
    "highlight": "cold-pressed oil, made fresh",
    "features": [
     "No preservatives",
     "Cold-pressed oil",
     "Packed fresh"
    ]
   },
   {
    "id": "karam_janthukalu",
    "name": "Karam Janthukalu",
    "image": "assets/images/cb_karam_janthukalu.png",
    "description": "Crispy golden strings spiced with red chilli.",
    "tag": "Crispy",
    "cureNote": "✨ Fried in cold-pressed oil",
    "spice": 3,
    "rating": 4.8,
    "color1": "#9A4A10",
    "color2": "#2E1606",
    "enabled": true,
    "variants": [
     {
      "id": "karam_janthukalu_250g",
      "label": "250g",
      "price": 129,
      "mrp": 148,
      "inStock": true
     },
     {
      "id": "karam_janthukalu_500g",
      "label": "500g",
      "price": 245,
      "mrp": 281,
      "inStock": true
     },
     {
      "id": "karam_janthukalu_1kg",
      "label": "1kg",
      "price": 464,
      "mrp": 533,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Rice flour",
      "image": "assets/images/ing_rice_flour.png"
     },
     {
      "name": "Gram flour",
      "image": "assets/images/ing_gram_flour.png"
     },
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Ajwain",
      "image": "assets/images/ajwain_0.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     }
    ],
    "process": "Fried fresh",
    "processText": "Made in small batches and fried in cold-pressed oil, then packed the same day.",
    "origin": "Amma's kitchen",
    "shelfLife": "2 months",
    "storage": "Keep the pack closed tightly to stay crisp.",
    "highlight": "cold-pressed oil, made fresh",
    "features": [
     "No preservatives",
     "Cold-pressed oil",
     "Packed fresh"
    ]
   },
   {
    "id": "allu_chips",
    "name": "Allu Chips",
    "image": "assets/images/cb_allu_chips.png",
    "description": "Thin potato chips, salted just right.",
    "tag": "Crispy",
    "cureNote": "✨ Fried in cold-pressed oil",
    "spice": 1,
    "rating": 4.8,
    "color1": "#9A7A1A",
    "color2": "#2E2406",
    "enabled": true,
    "variants": [
     {
      "id": "allu_chips_250g",
      "label": "250g",
      "price": 119,
      "mrp": 137,
      "inStock": true
     },
     {
      "id": "allu_chips_500g",
      "label": "500g",
      "price": 226,
      "mrp": 260,
      "inStock": true
     },
     {
      "id": "allu_chips_1kg",
      "label": "1kg",
      "price": 428,
      "mrp": 493,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Potato",
      "image": "assets/images/ing_potato.png"
     },
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     }
    ],
    "process": "Fried fresh",
    "processText": "Made in small batches and fried in cold-pressed oil, then packed the same day.",
    "origin": "Amma's kitchen",
    "shelfLife": "2 months",
    "storage": "Keep the pack closed tightly to stay crisp.",
    "highlight": "cold-pressed oil, made fresh",
    "features": [
     "No preservatives",
     "Cold-pressed oil",
     "Packed fresh"
    ]
   },
   {
    "id": "bundhi",
    "name": "Bundhi",
    "image": "assets/images/cb_bundhi.png",
    "description": "Crispy spiced gram-flour droplets.",
    "tag": "Crunchy",
    "cureNote": "✨ Fried in cold-pressed oil",
    "spice": 2,
    "rating": 4.8,
    "color1": "#9A5A10",
    "color2": "#2E1A06",
    "enabled": true,
    "variants": [
     {
      "id": "bundhi_250g",
      "label": "250g",
      "price": 119,
      "mrp": 137,
      "inStock": true
     },
     {
      "id": "bundhi_500g",
      "label": "500g",
      "price": 226,
      "mrp": 260,
      "inStock": true
     },
     {
      "id": "bundhi_1kg",
      "label": "1kg",
      "price": 428,
      "mrp": 493,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Gram flour",
      "image": "assets/images/ing_gram_flour.png"
     },
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Curry leaves",
      "image": "assets/images/curryleaf_0.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     }
    ],
    "process": "Fried fresh",
    "processText": "Made in small batches and fried in cold-pressed oil, then packed the same day.",
    "origin": "Amma's kitchen",
    "shelfLife": "2 months",
    "storage": "Keep the pack closed tightly to stay crisp.",
    "highlight": "cold-pressed oil, made fresh",
    "features": [
     "No preservatives",
     "Cold-pressed oil",
     "Packed fresh"
    ]
   },
   {
    "id": "onion_whills",
    "name": "Onion Whills",
    "image": "assets/images/cb_onion_whills.png",
    "description": "Onion-flavoured crisp wheels.",
    "tag": "Kids favourite",
    "cureNote": "✨ Fried in cold-pressed oil",
    "spice": 1,
    "rating": 4.8,
    "color1": "#8A6A1A",
    "color2": "#2A2006",
    "enabled": true,
    "variants": [
     {
      "id": "onion_whills_250g",
      "label": "250g",
      "price": 119,
      "mrp": 137,
      "inStock": true
     },
     {
      "id": "onion_whills_500g",
      "label": "500g",
      "price": 226,
      "mrp": 260,
      "inStock": true
     },
     {
      "id": "onion_whills_1kg",
      "label": "1kg",
      "price": 428,
      "mrp": 493,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Onion",
      "image": "assets/images/ing_onion.png"
     },
     {
      "name": "Rice flour",
      "image": "assets/images/ing_rice_flour.png"
     },
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     }
    ],
    "process": "Fried fresh",
    "processText": "Made in small batches and fried in cold-pressed oil, then packed the same day.",
    "origin": "Amma's kitchen",
    "shelfLife": "2 months",
    "storage": "Keep the pack closed tightly to stay crisp.",
    "highlight": "cold-pressed oil, made fresh",
    "features": [
     "No preservatives",
     "Cold-pressed oil",
     "Packed fresh"
    ]
   },
   {
    "id": "nuvvula_papad",
    "name": "Nuvvula Papad",
    "image": "assets/images/cb_nuvvula_papad.png",
    "description": "Sesame-coated crispy papads.",
    "tag": "Roast or fry",
    "cureNote": "☀ Sun-dried",
    "spice": 1,
    "rating": 4.8,
    "color1": "#7A6A3A",
    "color2": "#241E10",
    "enabled": true,
    "variants": [
     {
      "id": "nuvvula_papad_250g",
      "label": "250g",
      "price": 109,
      "mrp": 125,
      "inStock": true
     },
     {
      "id": "nuvvula_papad_500g",
      "label": "500g",
      "price": 207,
      "mrp": 238,
      "inStock": true
     },
     {
      "id": "nuvvula_papad_1kg",
      "label": "1kg",
      "price": 392,
      "mrp": 450,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Urad dal",
      "image": "assets/images/urad_0.png"
     },
     {
      "name": "Sesame",
      "image": "assets/images/sesame_0.png"
     },
     {
      "name": "Black pepper",
      "image": "assets/images/blackpepper_0.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     }
    ],
    "process": "Fried fresh",
    "processText": "Made in small batches and fried in cold-pressed oil, then packed the same day.",
    "origin": "Amma's kitchen",
    "shelfLife": "2 months",
    "storage": "Keep the pack closed tightly to stay crisp.",
    "highlight": "cold-pressed oil, made fresh",
    "features": [
     "No preservatives",
     "Cold-pressed oil",
     "Packed fresh"
    ]
   },
   {
    "id": "rice_papad",
    "name": "Rice Papad",
    "image": "assets/images/cb_rice_papad.png",
    "description": "Crispy rice-flour papadums.",
    "tag": "Roast or fry",
    "cureNote": "☀ Sun-dried",
    "spice": 1,
    "rating": 4.8,
    "color1": "#8A7A4A",
    "color2": "#2A2414",
    "enabled": true,
    "variants": [
     {
      "id": "rice_papad_250g",
      "label": "250g",
      "price": 99,
      "mrp": 114,
      "inStock": true
     },
     {
      "id": "rice_papad_500g",
      "label": "500g",
      "price": 188,
      "mrp": 217,
      "inStock": true
     },
     {
      "id": "rice_papad_1kg",
      "label": "1kg",
      "price": 356,
      "mrp": 410,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Rice flour",
      "image": "assets/images/ing_rice_flour.png"
     },
     {
      "name": "Cumin",
      "image": "assets/images/cumin_0.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     }
    ],
    "process": "Fried fresh",
    "processText": "Made in small batches and fried in cold-pressed oil, then packed the same day.",
    "origin": "Amma's kitchen",
    "shelfLife": "2 months",
    "storage": "Keep the pack closed tightly to stay crisp.",
    "highlight": "cold-pressed oil, made fresh",
    "features": [
     "No preservatives",
     "Cold-pressed oil",
     "Packed fresh"
    ]
   },
   {
    "id": "tomato_chilli_papad",
    "name": "Tomato Chilli Papad",
    "image": "assets/images/cb_tomato_chilli_papad.png",
    "description": "Tangy and spicy papads.",
    "tag": "Tangy",
    "cureNote": "☀ Sun-dried",
    "spice": 2,
    "rating": 4.8,
    "color1": "#9A3A1A",
    "color2": "#2E1006",
    "enabled": true,
    "variants": [
     {
      "id": "tomato_chilli_papad_250g",
      "label": "250g",
      "price": 109,
      "mrp": 125,
      "inStock": true
     },
     {
      "id": "tomato_chilli_papad_500g",
      "label": "500g",
      "price": 207,
      "mrp": 238,
      "inStock": true
     },
     {
      "id": "tomato_chilli_papad_1kg",
      "label": "1kg",
      "price": 392,
      "mrp": 450,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Tomato",
      "image": "assets/images/ing_tomato.png"
     },
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Urad dal",
      "image": "assets/images/urad_0.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     }
    ],
    "process": "Fried fresh",
    "processText": "Made in small batches and fried in cold-pressed oil, then packed the same day.",
    "origin": "Amma's kitchen",
    "shelfLife": "2 months",
    "storage": "Keep the pack closed tightly to stay crisp.",
    "highlight": "cold-pressed oil, made fresh",
    "features": [
     "No preservatives",
     "Cold-pressed oil",
     "Packed fresh"
    ]
   }
  ]
 },
 {
  "id": "podis",
  "slug": "podi",
  "name": "Powders",
  "label": "MADE DAILY",
  "subtitle": "Stone-ground fresh",
  "image": "assets/images/sp_kura_karam_podi.png",
  "color1": "#3FA34D",
  "color2": "#1D6B33",
  "color3": "#0A2E16",
  "enabled": true,
  "deckTitle": "Podis & Masalas",
  "products": [
   {
    "id": "special_idli_karam_podi",
    "name": "Idli Karam Podi",
    "image": "assets/images/sp_idli_karam_podi.png",
    "description": "Gun powder for idli and dosa with roasted dals and chilli.",
    "tag": "Bestseller",
    "cureNote": "🪨 Stone-ground fresh",
    "spice": 3,
    "rating": 4.9,
    "color1": "#9A3A10",
    "color2": "#2E1006",
    "enabled": true,
    "variants": [
     {
      "id": "special_idli_karam_podi_250g",
      "label": "250g",
      "price": 139,
      "mrp": 160,
      "inStock": true
     },
     {
      "id": "special_idli_karam_podi_500g",
      "label": "500g",
      "price": 264,
      "mrp": 304,
      "inStock": true
     },
     {
      "id": "special_idli_karam_podi_1kg",
      "label": "1kg",
      "price": 500,
      "mrp": 576,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Urad dal",
      "image": "assets/images/urad_0.png"
     },
     {
      "name": "Chana dal",
      "image": "assets/images/chanadal_0.png"
     },
     {
      "name": "Sesame",
      "image": "assets/images/sesame_0.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     }
    ],
    "process": "Stone-ground",
    "processText": "Each spice is roasted separately on a low flame, then ground in small batches.",
    "origin": "Andhra farms",
    "shelfLife": "6 months",
    "storage": "Store airtight, away from moisture.",
    "highlight": "slow-roasted whole spices",
    "features": [
     "No colour added",
     "Stone-ground",
     "Small batches"
    ]
   },
   {
    "id": "allam_velluli_karam_podi",
    "name": "Allam Velluli Karam Podi",
    "image": "assets/images/sp_allam_velluli_podi.png",
    "description": "Ginger-garlic spice powder for rice and ghee.",
    "tag": "Spicy",
    "cureNote": "🪨 Stone-ground fresh",
    "spice": 3,
    "rating": 4.8,
    "color1": "#9A3A10",
    "color2": "#2E1006",
    "enabled": true,
    "variants": [
     {
      "id": "allam_velluli_karam_podi_250g",
      "label": "250g",
      "price": 145,
      "mrp": 167,
      "inStock": true
     },
     {
      "id": "allam_velluli_karam_podi_500g",
      "label": "500g",
      "price": 276,
      "mrp": 317,
      "inStock": true
     },
     {
      "id": "allam_velluli_karam_podi_1kg",
      "label": "1kg",
      "price": 522,
      "mrp": 601,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Ginger",
      "image": "assets/images/ginger_0.png"
     },
     {
      "name": "Garlic",
      "image": "assets/images/ing_garlic.png"
     },
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Cumin",
      "image": "assets/images/cumin_0.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     }
    ],
    "process": "Stone-ground",
    "processText": "Each spice is roasted separately on a low flame, then ground in small batches.",
    "origin": "Andhra farms",
    "shelfLife": "6 months",
    "storage": "Store airtight, away from moisture.",
    "highlight": "slow-roasted whole spices",
    "features": [
     "No colour added",
     "Stone-ground",
     "Small batches"
    ]
   },
   {
    "id": "karvepaku_karam_podi",
    "name": "Karvepaku Karam Podi",
    "image": "assets/images/sp_karvepaku_podi.png",
    "description": "Curry leaves roasted with dals and chilli.",
    "tag": "Iron rich",
    "cureNote": "🪨 Stone-ground fresh",
    "spice": 2,
    "rating": 4.8,
    "color1": "#3A4A14",
    "color2": "#121806",
    "enabled": true,
    "variants": [
     {
      "id": "karvepaku_karam_podi_250g",
      "label": "250g",
      "price": 135,
      "mrp": 155,
      "inStock": true
     },
     {
      "id": "karvepaku_karam_podi_500g",
      "label": "500g",
      "price": 256,
      "mrp": 294,
      "inStock": true
     },
     {
      "id": "karvepaku_karam_podi_1kg",
      "label": "1kg",
      "price": 486,
      "mrp": 558,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Curry leaves",
      "image": "assets/images/curryleaf_0.png"
     },
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Urad dal",
      "image": "assets/images/urad_0.png"
     },
     {
      "name": "Chana dal",
      "image": "assets/images/chanadal_0.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     }
    ],
    "process": "Stone-ground",
    "processText": "Each spice is roasted separately on a low flame, then ground in small batches.",
    "origin": "Andhra farms",
    "shelfLife": "6 months",
    "storage": "Store airtight, away from moisture.",
    "highlight": "slow-roasted whole spices",
    "features": [
     "No colour added",
     "Stone-ground",
     "Small batches"
    ]
   },
   {
    "id": "munagaku_karam_podi",
    "name": "Munagaku Karam Podi",
    "image": "assets/images/sp_munagaku_podi.png",
    "description": "Drumstick-leaf powder — a superfood with a kick.",
    "tag": "Superfood",
    "cureNote": "🪨 Stone-ground fresh",
    "spice": 2,
    "rating": 4.8,
    "color1": "#4A5A14",
    "color2": "#161E06",
    "enabled": true,
    "variants": [
     {
      "id": "munagaku_karam_podi_250g",
      "label": "250g",
      "price": 149,
      "mrp": 171,
      "inStock": true
     },
     {
      "id": "munagaku_karam_podi_500g",
      "label": "500g",
      "price": 283,
      "mrp": 325,
      "inStock": true
     },
     {
      "id": "munagaku_karam_podi_1kg",
      "label": "1kg",
      "price": 536,
      "mrp": 616,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Moringa leaves",
      "image": "assets/images/moringa_0.png"
     },
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Cumin",
      "image": "assets/images/cumin_0.png"
     },
     {
      "name": "Garlic",
      "image": "assets/images/ing_garlic.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     }
    ],
    "process": "Stone-ground",
    "processText": "Each spice is roasted separately on a low flame, then ground in small batches.",
    "origin": "Andhra farms",
    "shelfLife": "6 months",
    "storage": "Store airtight, away from moisture.",
    "highlight": "slow-roasted whole spices",
    "features": [
     "No colour added",
     "Stone-ground",
     "Small batches"
    ]
   },
   {
    "id": "special_kura_karam_podi",
    "name": "Kura Karam Podi",
    "image": "assets/images/sp_kura_karam_podi.png",
    "description": "All-purpose curry powder for everyday cooking.",
    "tag": "Everyday",
    "cureNote": "🪨 Stone-ground fresh",
    "spice": 3,
    "rating": 4.8,
    "color1": "#9A1A10",
    "color2": "#2E0806",
    "enabled": true,
    "variants": [
     {
      "id": "special_kura_karam_podi_250g",
      "label": "250g",
      "price": 139,
      "mrp": 160,
      "inStock": true
     },
     {
      "id": "special_kura_karam_podi_500g",
      "label": "500g",
      "price": 264,
      "mrp": 304,
      "inStock": true
     },
     {
      "id": "special_kura_karam_podi_1kg",
      "label": "1kg",
      "price": 500,
      "mrp": 576,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Coriander",
      "image": "assets/images/coriander_0.png"
     },
     {
      "name": "Cumin",
      "image": "assets/images/cumin_0.png"
     },
     {
      "name": "Garlic",
      "image": "assets/images/ing_garlic.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     }
    ],
    "process": "Stone-ground",
    "processText": "Each spice is roasted separately on a low flame, then ground in small batches.",
    "origin": "Andhra farms",
    "shelfLife": "6 months",
    "storage": "Store airtight, away from moisture.",
    "highlight": "slow-roasted whole spices",
    "features": [
     "No colour added",
     "Stone-ground",
     "Small batches"
    ]
   },
   {
    "id": "putnala_karam_podi",
    "name": "Putnala Karam Podi",
    "image": "assets/images/sp_putnala_podi.png",
    "description": "Roasted gram powder, mild and nutty.",
    "tag": "Mild",
    "cureNote": "🪨 Stone-ground fresh",
    "spice": 1,
    "rating": 4.8,
    "color1": "#8A6A1A",
    "color2": "#2A2006",
    "enabled": true,
    "variants": [
     {
      "id": "putnala_karam_podi_250g",
      "label": "250g",
      "price": 129,
      "mrp": 148,
      "inStock": true
     },
     {
      "id": "putnala_karam_podi_500g",
      "label": "500g",
      "price": 245,
      "mrp": 281,
      "inStock": true
     },
     {
      "id": "putnala_karam_podi_1kg",
      "label": "1kg",
      "price": 464,
      "mrp": 533,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Roasted gram",
      "image": "assets/images/roastedgram_0.png"
     },
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Cumin",
      "image": "assets/images/cumin_0.png"
     },
     {
      "name": "Garlic",
      "image": "assets/images/ing_garlic.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     }
    ],
    "process": "Stone-ground",
    "processText": "Each spice is roasted separately on a low flame, then ground in small batches.",
    "origin": "Andhra farms",
    "shelfLife": "6 months",
    "storage": "Store airtight, away from moisture.",
    "highlight": "slow-roasted whole spices",
    "features": [
     "No colour added",
     "Stone-ground",
     "Small batches"
    ]
   },
   {
    "id": "menthi_podi",
    "name": "Menthi Podi",
    "image": "assets/images/sp_menthi_podi.png",
    "description": "Fenugreek spice powder for curd rice and pickles.",
    "tag": "Healthy",
    "cureNote": "🪨 Stone-ground fresh",
    "spice": 2,
    "rating": 4.8,
    "color1": "#8A6A10",
    "color2": "#2A2006",
    "enabled": true,
    "variants": [
     {
      "id": "menthi_podi_250g",
      "label": "250g",
      "price": 129,
      "mrp": 148,
      "inStock": true
     },
     {
      "id": "menthi_podi_500g",
      "label": "500g",
      "price": 245,
      "mrp": 281,
      "inStock": true
     },
     {
      "id": "menthi_podi_1kg",
      "label": "1kg",
      "price": 464,
      "mrp": 533,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Fenugreek",
      "image": "assets/images/fenugreek_0.png"
     },
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Mustard",
      "image": "assets/images/mustard_0.png"
     },
     {
      "name": "Rock salt",
      "image": "assets/images/rocksalt_0.png"
     }
    ],
    "process": "Stone-ground",
    "processText": "Each spice is roasted separately on a low flame, then ground in small batches.",
    "origin": "Andhra farms",
    "shelfLife": "6 months",
    "storage": "Store airtight, away from moisture.",
    "highlight": "slow-roasted whole spices",
    "features": [
     "No colour added",
     "Stone-ground",
     "Small batches"
    ]
   },
   {
    "id": "sambhar_masala_powder",
    "name": "Sambhar Masala",
    "image": "assets/images/sp_sambhar_masala.png",
    "description": "Roasted spices for a perfect everyday sambar.",
    "tag": "Masala",
    "cureNote": "🪨 Stone-ground fresh",
    "spice": 2,
    "rating": 4.8,
    "color1": "#8A3A14",
    "color2": "#2A1006",
    "enabled": true,
    "variants": [
     {
      "id": "sambhar_masala_powder_250g",
      "label": "250g",
      "price": 139,
      "mrp": 160,
      "inStock": true
     },
     {
      "id": "sambhar_masala_powder_500g",
      "label": "500g",
      "price": 264,
      "mrp": 304,
      "inStock": true
     },
     {
      "id": "sambhar_masala_powder_1kg",
      "label": "1kg",
      "price": 500,
      "mrp": 576,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Coriander",
      "image": "assets/images/coriander_0.png"
     },
     {
      "name": "Chana dal",
      "image": "assets/images/chanadal_0.png"
     },
     {
      "name": "Fenugreek",
      "image": "assets/images/fenugreek_0.png"
     },
     {
      "name": "Curry leaves",
      "image": "assets/images/curryleaf_0.png"
     },
     {
      "name": "Cumin",
      "image": "assets/images/cumin_0.png"
     }
    ],
    "process": "Stone-ground",
    "processText": "Each spice is roasted separately on a low flame, then ground in small batches.",
    "origin": "Andhra farms",
    "shelfLife": "6 months",
    "storage": "Store airtight, away from moisture.",
    "highlight": "slow-roasted whole spices",
    "features": [
     "No colour added",
     "Stone-ground",
     "Small batches"
    ]
   },
   {
    "id": "garam_masala_powder",
    "name": "Garam Masala",
    "image": "assets/images/sp_garam_masala.png",
    "description": "Warm whole-spice blend — cinnamon, cloves, star anise.",
    "tag": "Masala",
    "cureNote": "🪨 Stone-ground fresh",
    "spice": 2,
    "rating": 4.8,
    "color1": "#5A2A12",
    "color2": "#1E0A04",
    "enabled": true,
    "variants": [
     {
      "id": "garam_masala_powder_250g",
      "label": "250g",
      "price": 159,
      "mrp": 183,
      "inStock": true
     },
     {
      "id": "garam_masala_powder_500g",
      "label": "500g",
      "price": 302,
      "mrp": 348,
      "inStock": true
     },
     {
      "id": "garam_masala_powder_1kg",
      "label": "1kg",
      "price": 572,
      "mrp": 659,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Cinnamon",
      "image": "assets/images/cinnamon_0.png"
     },
     {
      "name": "Cloves",
      "image": "assets/images/cloves_0.png"
     },
     {
      "name": "Star anise",
      "image": "assets/images/staranise_0.png"
     },
     {
      "name": "Cardamom",
      "image": "assets/images/cardamom_0.png"
     },
     {
      "name": "Black pepper",
      "image": "assets/images/blackpepper_0.png"
     },
     {
      "name": "Bay leaf",
      "image": "assets/images/bayleaf_0.png"
     }
    ],
    "process": "Stone-ground",
    "processText": "Each spice is roasted separately on a low flame, then ground in small batches.",
    "origin": "Andhra farms",
    "shelfLife": "6 months",
    "storage": "Store airtight, away from moisture.",
    "highlight": "slow-roasted whole spices",
    "features": [
     "No colour added",
     "Stone-ground",
     "Small batches"
    ]
   },
   {
    "id": "chicken_masala_powder",
    "name": "Chicken Masala",
    "image": "assets/images/sp_chicken_masala.png",
    "description": "Rich chicken curry blend.",
    "tag": "Masala",
    "cureNote": "🪨 Stone-ground fresh",
    "spice": 3,
    "rating": 4.8,
    "color1": "#8A2410",
    "color2": "#2A0A06",
    "enabled": true,
    "variants": [
     {
      "id": "chicken_masala_powder_250g",
      "label": "250g",
      "price": 149,
      "mrp": 171,
      "inStock": true
     },
     {
      "id": "chicken_masala_powder_500g",
      "label": "500g",
      "price": 283,
      "mrp": 325,
      "inStock": true
     },
     {
      "id": "chicken_masala_powder_1kg",
      "label": "1kg",
      "price": 536,
      "mrp": 616,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Coriander",
      "image": "assets/images/coriander_0.png"
     },
     {
      "name": "Cardamom",
      "image": "assets/images/cardamom_0.png"
     },
     {
      "name": "Bay leaf",
      "image": "assets/images/bayleaf_0.png"
     },
     {
      "name": "Cloves",
      "image": "assets/images/cloves_0.png"
     },
     {
      "name": "Cinnamon",
      "image": "assets/images/cinnamon_0.png"
     }
    ],
    "process": "Stone-ground",
    "processText": "Each spice is roasted separately on a low flame, then ground in small batches.",
    "origin": "Andhra farms",
    "shelfLife": "6 months",
    "storage": "Store airtight, away from moisture.",
    "highlight": "slow-roasted whole spices",
    "features": [
     "No colour added",
     "Stone-ground",
     "Small batches"
    ]
   },
   {
    "id": "mutton_masala_powder",
    "name": "Mutton Masala",
    "image": "assets/images/sp_mutton_masala.png",
    "description": "Bold mutton curry blend with black pepper.",
    "tag": "Masala",
    "cureNote": "🪨 Stone-ground fresh",
    "spice": 3,
    "rating": 4.8,
    "color1": "#6A1A0E",
    "color2": "#200804",
    "enabled": true,
    "variants": [
     {
      "id": "mutton_masala_powder_250g",
      "label": "250g",
      "price": 159,
      "mrp": 183,
      "inStock": true
     },
     {
      "id": "mutton_masala_powder_500g",
      "label": "500g",
      "price": 302,
      "mrp": 348,
      "inStock": true
     },
     {
      "id": "mutton_masala_powder_1kg",
      "label": "1kg",
      "price": 572,
      "mrp": 659,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Black pepper",
      "image": "assets/images/blackpepper_0.png"
     },
     {
      "name": "Cloves",
      "image": "assets/images/cloves_0.png"
     },
     {
      "name": "Cinnamon",
      "image": "assets/images/cinnamon_0.png"
     },
     {
      "name": "Red chilli",
      "image": "assets/images/redchilli_0.png"
     },
     {
      "name": "Coriander",
      "image": "assets/images/coriander_0.png"
     },
     {
      "name": "Bay leaf",
      "image": "assets/images/bayleaf_0.png"
     }
    ],
    "process": "Stone-ground",
    "processText": "Each spice is roasted separately on a low flame, then ground in small batches.",
    "origin": "Andhra farms",
    "shelfLife": "6 months",
    "storage": "Store airtight, away from moisture.",
    "highlight": "slow-roasted whole spices",
    "features": [
     "No colour added",
     "Stone-ground",
     "Small batches"
    ]
   },
   {
    "id": "daniya_powder",
    "name": "Daniya Powder",
    "image": "assets/images/sp_daniya_powder.png",
    "description": "Freshly ground coriander seeds.",
    "tag": "Pure",
    "cureNote": "🪨 Stone-ground fresh",
    "spice": 1,
    "rating": 4.8,
    "color1": "#7A5A2A",
    "color2": "#241A0A",
    "enabled": true,
    "variants": [
     {
      "id": "daniya_powder_250g",
      "label": "250g",
      "price": 99,
      "mrp": 114,
      "inStock": true
     },
     {
      "id": "daniya_powder_500g",
      "label": "500g",
      "price": 188,
      "mrp": 217,
      "inStock": true
     },
     {
      "id": "daniya_powder_1kg",
      "label": "1kg",
      "price": 356,
      "mrp": 410,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Coriander",
      "image": "assets/images/coriander_0.png"
     }
    ],
    "process": "Stone-ground",
    "processText": "Each spice is roasted separately on a low flame, then ground in small batches.",
    "origin": "Andhra farms",
    "shelfLife": "6 months",
    "storage": "Store airtight, away from moisture.",
    "highlight": "slow-roasted whole spices",
    "features": [
     "No colour added",
     "Stone-ground",
     "Small batches"
    ]
   },
   {
    "id": "haldi_powder",
    "name": "Haldi Powder",
    "image": "assets/images/sp_haldi_powder.png",
    "description": "Pure turmeric powder, bright and earthy.",
    "tag": "Pure",
    "cureNote": "🪨 Stone-ground fresh",
    "spice": 1,
    "rating": 4.8,
    "color1": "#9A6A0A",
    "color2": "#2E2004",
    "enabled": true,
    "variants": [
     {
      "id": "haldi_powder_250g",
      "label": "250g",
      "price": 99,
      "mrp": 114,
      "inStock": true
     },
     {
      "id": "haldi_powder_500g",
      "label": "500g",
      "price": 188,
      "mrp": 217,
      "inStock": true
     },
     {
      "id": "haldi_powder_1kg",
      "label": "1kg",
      "price": 356,
      "mrp": 410,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Turmeric",
      "image": "assets/images/turmeric_0.png"
     }
    ],
    "process": "Stone-ground",
    "processText": "Each spice is roasted separately on a low flame, then ground in small batches.",
    "origin": "Andhra farms",
    "shelfLife": "6 months",
    "storage": "Store airtight, away from moisture.",
    "highlight": "slow-roasted whole spices",
    "features": [
     "No colour added",
     "Stone-ground",
     "Small batches"
    ]
   }
  ]
 },
 {
  "id": "sweets",
  "slug": "sweet",
  "name": "Sweets",
  "label": "FESTIVE",
  "subtitle": "Pure ghee & jaggery",
  "image": "assets/images/loved_sunnunda_laddu.png",
  "color1": "#E0579A",
  "color2": "#9D174D",
  "color3": "#4A0A26",
  "enabled": true,
  "deckTitle": "Traditional Sweets",
  "products": [
   {
    "id": "sunnunda_laddu",
    "name": "Sunnunda Laddu",
    "image": "assets/images/loved_sunnunda_laddu.png",
    "description": "Roasted urad dal and jaggery bound with pure ghee.",
    "tag": "Bestseller",
    "cureNote": "🧈 Pure desi ghee",
    "spice": 0,
    "rating": 4.9,
    "color1": "#8A5A1A",
    "color2": "#2A1A06",
    "enabled": true,
    "variants": [
     {
      "id": "sunnunda_laddu_250g",
      "label": "250g",
      "price": 199,
      "mrp": 229,
      "inStock": true
     },
     {
      "id": "sunnunda_laddu_500g",
      "label": "500g",
      "price": 378,
      "mrp": 435,
      "inStock": true
     },
     {
      "id": "sunnunda_laddu_1kg",
      "label": "1kg",
      "price": 716,
      "mrp": 824,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Urad dal",
      "image": "assets/images/urad_0.png"
     },
     {
      "name": "Jaggery",
      "image": "assets/images/jaggery_0.png"
     },
     {
      "name": "Pure ghee",
      "image": "assets/images/ing_ghee.png"
     },
     {
      "name": "Cardamom",
      "image": "assets/images/cardamom_0.png"
     }
    ],
    "process": "Handmade",
    "processText": "Rolled by hand with pure desi ghee and jaggery, in small batches.",
    "origin": "Amma's kitchen",
    "shelfLife": "1 month",
    "storage": "Store in a cool, dry place. Refrigerate after opening.",
    "highlight": "pure desi ghee & jaggery",
    "features": [
     "Pure desi ghee",
     "No refined sugar",
     "Handmade"
    ]
   },
   {
    "id": "dry_fruits_laddu",
    "name": "Dry Fruits Laddu",
    "image": "assets/images/best_dry_fruits_laddu.png",
    "description": "Dates, almonds, cashews and pistachios — no sugar.",
    "tag": "No sugar",
    "cureNote": "✨ Handmade",
    "spice": 0,
    "rating": 4.8,
    "color1": "#6A3A1A",
    "color2": "#200E06",
    "enabled": true,
    "variants": [
     {
      "id": "dry_fruits_laddu_250g",
      "label": "250g",
      "price": 299,
      "mrp": 344,
      "inStock": true
     },
     {
      "id": "dry_fruits_laddu_500g",
      "label": "500g",
      "price": 568,
      "mrp": 654,
      "inStock": true
     },
     {
      "id": "dry_fruits_laddu_1kg",
      "label": "1kg",
      "price": 1076,
      "mrp": 1238,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Dates",
      "image": "assets/images/ing_dates.png"
     },
     {
      "name": "Dry fruits",
      "image": "assets/images/ing_dry_fruits.png"
     },
     {
      "name": "Pure ghee",
      "image": "assets/images/ing_ghee.png"
     },
     {
      "name": "Cardamom",
      "image": "assets/images/cardamom_0.png"
     }
    ],
    "process": "Handmade",
    "processText": "Rolled by hand with pure desi ghee and jaggery, in small batches.",
    "origin": "Amma's kitchen",
    "shelfLife": "1 month",
    "storage": "Store in a cool, dry place. Refrigerate after opening.",
    "highlight": "pure desi ghee & jaggery",
    "features": [
     "Pure desi ghee",
     "No refined sugar",
     "Handmade"
    ]
   },
   {
    "id": "gondh_laddu",
    "name": "Gondh Laddu",
    "image": "assets/images/shop_gondh_laddu.png",
    "description": "Edible gum laddu with wheat and ghee.",
    "tag": "Winter special",
    "cureNote": "🧈 Pure desi ghee",
    "spice": 0,
    "rating": 4.8,
    "color1": "#7A5A2A",
    "color2": "#241A0A",
    "enabled": true,
    "variants": [
     {
      "id": "gondh_laddu_250g",
      "label": "250g",
      "price": 249,
      "mrp": 286,
      "inStock": true
     },
     {
      "id": "gondh_laddu_500g",
      "label": "500g",
      "price": 473,
      "mrp": 543,
      "inStock": true
     },
     {
      "id": "gondh_laddu_1kg",
      "label": "1kg",
      "price": 896,
      "mrp": 1030,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Edible gum",
      "image": "assets/images/ing_edible_gum.png"
     },
     {
      "name": "Wheat flour",
      "image": "assets/images/ing_wheat_flour.png"
     },
     {
      "name": "Pure ghee",
      "image": "assets/images/ing_ghee.png"
     },
     {
      "name": "Jaggery",
      "image": "assets/images/jaggery_0.png"
     },
     {
      "name": "Dry fruits",
      "image": "assets/images/ing_dry_fruits.png"
     }
    ],
    "process": "Handmade",
    "processText": "Rolled by hand with pure desi ghee and jaggery, in small batches.",
    "origin": "Amma's kitchen",
    "shelfLife": "1 month",
    "storage": "Store in a cool, dry place. Refrigerate after opening.",
    "highlight": "pure desi ghee & jaggery",
    "features": [
     "Pure desi ghee",
     "No refined sugar",
     "Handmade"
    ]
   },
   {
    "id": "kova_gulab_jamun",
    "name": "Kova Gulab Jamun",
    "image": "assets/images/shop_gulab_jamun.png",
    "description": "Soft khoa jamuns soaked in cardamom syrup.",
    "tag": "Festive",
    "cureNote": "✨ Handmade",
    "spice": 0,
    "rating": 4.8,
    "color1": "#7A2A14",
    "color2": "#240A06",
    "enabled": true,
    "variants": [
     {
      "id": "kova_gulab_jamun_250g",
      "label": "250g",
      "price": 229,
      "mrp": 263,
      "inStock": true
     },
     {
      "id": "kova_gulab_jamun_500g",
      "label": "500g",
      "price": 435,
      "mrp": 500,
      "inStock": true
     },
     {
      "id": "kova_gulab_jamun_1kg",
      "label": "1kg",
      "price": 824,
      "mrp": 947,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Khoa",
      "image": "assets/images/ing_khoa.png"
     },
     {
      "name": "Cardamom",
      "image": "assets/images/cardamom_0.png"
     },
     {
      "name": "Pure ghee",
      "image": "assets/images/ing_ghee.png"
     }
    ],
    "process": "Handmade",
    "processText": "Rolled by hand with pure desi ghee and jaggery, in small batches.",
    "origin": "Amma's kitchen",
    "shelfLife": "1 month",
    "storage": "Store in a cool, dry place. Refrigerate after opening.",
    "highlight": "pure desi ghee & jaggery",
    "features": [
     "Pure desi ghee",
     "No refined sugar",
     "Handmade"
    ]
   },
   {
    "id": "millets_laddu",
    "name": "Millets Laddu",
    "image": "assets/images/cb_millets_laddu.png",
    "description": "Wholesome multi-millet laddu with jaggery.",
    "tag": "Healthy",
    "cureNote": "✨ Handmade",
    "spice": 0,
    "rating": 4.8,
    "color1": "#7A5A2A",
    "color2": "#241A0A",
    "enabled": true,
    "variants": [
     {
      "id": "millets_laddu_250g",
      "label": "250g",
      "price": 219,
      "mrp": 252,
      "inStock": true
     },
     {
      "id": "millets_laddu_500g",
      "label": "500g",
      "price": 416,
      "mrp": 479,
      "inStock": true
     },
     {
      "id": "millets_laddu_1kg",
      "label": "1kg",
      "price": 788,
      "mrp": 907,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Millets",
      "image": "assets/images/ing_millets.png"
     },
     {
      "name": "Jaggery",
      "image": "assets/images/jaggery_0.png"
     },
     {
      "name": "Pure ghee",
      "image": "assets/images/ing_ghee.png"
     },
     {
      "name": "Peanuts",
      "image": "assets/images/peanut_0.png"
     }
    ],
    "process": "Handmade",
    "processText": "Rolled by hand with pure desi ghee and jaggery, in small batches.",
    "origin": "Amma's kitchen",
    "shelfLife": "1 month",
    "storage": "Store in a cool, dry place. Refrigerate after opening.",
    "highlight": "pure desi ghee & jaggery",
    "features": [
     "Pure desi ghee",
     "No refined sugar",
     "Handmade"
    ]
   },
   {
    "id": "palli_patti",
    "name": "Palli Patti",
    "image": "assets/images/cb_palli_patti.png",
    "description": "Peanut and jaggery chikki.",
    "tag": "Crunchy",
    "cureNote": "✨ Handmade",
    "spice": 0,
    "rating": 4.8,
    "color1": "#8A5A1A",
    "color2": "#2A1A06",
    "enabled": true,
    "variants": [
     {
      "id": "palli_patti_250g",
      "label": "250g",
      "price": 149,
      "mrp": 171,
      "inStock": true
     },
     {
      "id": "palli_patti_500g",
      "label": "500g",
      "price": 283,
      "mrp": 325,
      "inStock": true
     },
     {
      "id": "palli_patti_1kg",
      "label": "1kg",
      "price": 536,
      "mrp": 616,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Peanuts",
      "image": "assets/images/peanut_0.png"
     },
     {
      "name": "Jaggery",
      "image": "assets/images/jaggery_0.png"
     },
     {
      "name": "Cardamom",
      "image": "assets/images/cardamom_0.png"
     }
    ],
    "process": "Handmade",
    "processText": "Rolled by hand with pure desi ghee and jaggery, in small batches.",
    "origin": "Amma's kitchen",
    "shelfLife": "1 month",
    "storage": "Store in a cool, dry place. Refrigerate after opening.",
    "highlight": "pure desi ghee & jaggery",
    "features": [
     "Pure desi ghee",
     "No refined sugar",
     "Handmade"
    ]
   },
   {
    "id": "thill_patti",
    "name": "Thill Patti",
    "image": "assets/images/cb_thill_patti.png",
    "description": "Sesame and jaggery sweet.",
    "tag": "Crunchy",
    "cureNote": "✨ Handmade",
    "spice": 0,
    "rating": 4.8,
    "color1": "#7A5A2A",
    "color2": "#241A0A",
    "enabled": true,
    "variants": [
     {
      "id": "thill_patti_250g",
      "label": "250g",
      "price": 149,
      "mrp": 171,
      "inStock": true
     },
     {
      "id": "thill_patti_500g",
      "label": "500g",
      "price": 283,
      "mrp": 325,
      "inStock": true
     },
     {
      "id": "thill_patti_1kg",
      "label": "1kg",
      "price": 536,
      "mrp": 616,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Sesame",
      "image": "assets/images/sesame_0.png"
     },
     {
      "name": "Jaggery",
      "image": "assets/images/jaggery_0.png"
     },
     {
      "name": "Cardamom",
      "image": "assets/images/cardamom_0.png"
     }
    ],
    "process": "Handmade",
    "processText": "Rolled by hand with pure desi ghee and jaggery, in small batches.",
    "origin": "Amma's kitchen",
    "shelfLife": "1 month",
    "storage": "Store in a cool, dry place. Refrigerate after opening.",
    "highlight": "pure desi ghee & jaggery",
    "features": [
     "Pure desi ghee",
     "No refined sugar",
     "Handmade"
    ]
   },
   {
    "id": "sweet_chekki",
    "name": "Sweet Chekki",
    "image": "assets/images/cb_sweet_chekki.png",
    "description": "Traditional sweet brittle.",
    "tag": "Traditional",
    "cureNote": "✨ Handmade",
    "spice": 0,
    "rating": 4.8,
    "color1": "#8A6A2A",
    "color2": "#2A200A",
    "enabled": true,
    "variants": [
     {
      "id": "sweet_chekki_250g",
      "label": "250g",
      "price": 149,
      "mrp": 171,
      "inStock": true
     },
     {
      "id": "sweet_chekki_500g",
      "label": "500g",
      "price": 283,
      "mrp": 325,
      "inStock": true
     },
     {
      "id": "sweet_chekki_1kg",
      "label": "1kg",
      "price": 536,
      "mrp": 616,
      "inStock": true
     }
    ],
    "ingredients": [
     {
      "name": "Peanuts",
      "image": "assets/images/peanut_0.png"
     },
     {
      "name": "Jaggery",
      "image": "assets/images/jaggery_0.png"
     },
     {
      "name": "Coconut",
      "image": "assets/images/ing_coconut.png"
     }
    ],
    "process": "Handmade",
    "processText": "Rolled by hand with pure desi ghee and jaggery, in small batches.",
    "origin": "Amma's kitchen",
    "shelfLife": "1 month",
    "storage": "Store in a cool, dry place. Refrigerate after opening.",
    "highlight": "pure desi ghee & jaggery",
    "features": [
     "Pure desi ghee",
     "No refined sugar",
     "Handmade"
    ]
   }
  ]
 }
]

// ingredient pictures built into the app
export const INGREDIENT_PALETTE: ShIngredient[] = [{"name": "Red chilli", "image": "assets/images/redchilli_0.png"}, {"name": "Cumin", "image": "assets/images/cumin_0.png"}, {"name": "Urad dal", "image": "assets/images/urad_0.png"}, {"name": "Chana dal", "image": "assets/images/chanadal_0.png"}, {"name": "Curry leaves", "image": "assets/images/curryleaf_0.png"}, {"name": "Ginger", "image": "assets/images/ginger_0.png"}, {"name": "Moringa leaves", "image": "assets/images/moringa_0.png"}, {"name": "Coriander", "image": "assets/images/coriander_0.png"}, {"name": "Turmeric", "image": "assets/images/turmeric_0.png"}, {"name": "Bay leaf", "image": "assets/images/bayleaf_0.png"}, {"name": "Sesame", "image": "assets/images/sesame_0.png"}, {"name": "Black pepper", "image": "assets/images/blackpepper_0.png"}, {"name": "Peanuts", "image": "assets/images/peanut_0.png"}, {"name": "Jaggery", "image": "assets/images/jaggery_0.png"}, {"name": "Rock salt", "image": "assets/images/rocksalt_0.png"}, {"name": "Mustard", "image": "assets/images/mustard_0.png"}, {"name": "Fenugreek", "image": "assets/images/fenugreek_0.png"}, {"name": "Cloves", "image": "assets/images/cloves_0.png"}, {"name": "Cinnamon", "image": "assets/images/cinnamon_0.png"}, {"name": "Cardamom", "image": "assets/images/cardamom_0.png"}, {"name": "Star anise", "image": "assets/images/staranise_0.png"}, {"name": "Roasted gram", "image": "assets/images/roastedgram_0.png"}, {"name": "Tamarind", "image": "assets/images/tamarind_0.png"}, {"name": "Ajwain", "image": "assets/images/ajwain_0.png"}, {"name": "Coconut", "image": "assets/images/ing_coconut.png"}, {"name": "Garlic", "image": "assets/images/ing_garlic.png"}, {"name": "Raw mango", "image": "assets/images/ing_raw_mango.png"}, {"name": "Lemon", "image": "assets/images/ing_lemon.png"}, {"name": "Amla", "image": "assets/images/ing_amla.png"}, {"name": "Tomato", "image": "assets/images/ing_tomato.png"}, {"name": "Gongura leaves", "image": "assets/images/ing_gongura.png"}, {"name": "Sesame oil", "image": "assets/images/ing_sesame_oil.png"}, {"name": "Rice flour", "image": "assets/images/ing_rice_flour.png"}, {"name": "Gram flour", "image": "assets/images/ing_gram_flour.png"}, {"name": "Pure ghee", "image": "assets/images/ing_ghee.png"}, {"name": "Dry fruits", "image": "assets/images/ing_dry_fruits.png"}, {"name": "Dates", "image": "assets/images/ing_dates.png"}, {"name": "Wheat flour", "image": "assets/images/ing_wheat_flour.png"}, {"name": "Edible gum", "image": "assets/images/ing_edible_gum.png"}, {"name": "Khoa", "image": "assets/images/ing_khoa.png"}, {"name": "Millets", "image": "assets/images/ing_millets.png"}, {"name": "Potato", "image": "assets/images/ing_potato.png"}, {"name": "Onion", "image": "assets/images/ing_onion.png"}]

export const BOWL_FIX: Record<string, string> = {"assets/images/snack_kara_murukku.png": "assets/images/loved_kara_murukku.png", "assets/images/snack_khara_mixture.png": "assets/images/best_khara_mixture.png", "assets/images/sweet_sunnunda_laddu.png": "assets/images/loved_sunnunda_laddu.png", "assets/images/sweet_dryfruit_laddu.png": "assets/images/best_dry_fruits_laddu.png", "assets/images/sweet_gondh_laddu.png": "assets/images/shop_gondh_laddu.png", "assets/images/sweet_gulab_jamun.png": "assets/images/shop_gulab_jamun.png"}

export const SHOP_PREVIEWS: Record<string, string> = {
 "best_chakinalu.png": "data:image/webp;base64,UklGRg4WAABXRUJQVlA4WAoAAAAQAAAAnwAAnwAAQUxQSCIEAAABoIZt29lIe9qO7Zm1bdu2bdve7dq2bdve7cysbdveMZI8u99XJG/e5/27ETEB8K/WJhEJdnP2alW2ZKeuM/t0HLatmLtzygzikDGDa8FNz65cuCElxKP1qGuRLx62rlUyZRB5vgV8s115HvkTVY5992hSp3TgQpchbH/M/feo9avtEf1MRPU4dQ8ZTTpYNsCfnuDa75Hh6MePRxBjSnVQQsaljVNLUjLivYw6PO9KR/43qEt5awFfIoxHUK9RZ/1oSPlQNyjV414YZBoz9bKiH3yUnmseqcc+PfQcdX62tAenfDOWWn/jFfIwYTiXfIof/haLvNzJn4DGk27HIEdPh/DFO22TSOSsfCmAI6ayVz8ifxMaOPHCkOfAd+RyzMG8XPBeceIDcvuReXA2vRk9BiPnb5ZJq6uap68l8Q7jPjTWkecuJPHl4PaB+jCMuBVPAyKuN+jCdAXplBaUDdJBxheEICbvd2bO+TDSKg/yYsytVyIxiMfTsJR2/hkZ6T2fhhljtjlI87lQVkLuI9Xn2hnZKBxFFr7wY6FK3wikO7YBC4uQ9O+ltfPYTBt21K63QtxRV83qJxP3NFCzrN+Ji8mv2XSFOMWskVu/GKQ+cWlqLfIcQBG830i9Zi9RDBNn+qvULR6F8XCIKt3iUCBP5FShexwK5fNCDnWJR8G0hDpQ6jsK5xE/u4KvoYDOMNkzBkU0obIdaV4JCUZ42xqLYqq0txHyRFDwoqe1KpKoxJe2ZkZhHWnFdFhcthj+5xIpLpEuohNhxbBZXM44/w8mistssFpPEhWprrXgx6LyJNgaTBOVJWCztiQmvwrbCnoqJpEutmCmmEwAO7N8FJGPWe2B6SIyHewOvSEeN0Ptg0LvRSOqBjjaKlowRoHjbaOEYr6bCtBfEYiFLqBmyAtxuOEL6k4Wh26gcoZ3ovA2rVowSRQmgeo5fojB2wzqGTeKwSTQsHKSCLzNoIXHORFYAZo2kuiLLq6N+zn6Nhq0gUYSddHFQGO3vdStMGgFRX7Q9jYDaD+Ztl7AYOhdys75sACtk+n6WRKYdF5F1yxgNOQKVWd9WYHiX2h6nAXYrR9D0deawLJZpiexMTBtHCtTI48Bxo3jZFqUcUbWwDhOpuT3CCOwbzTH0PG1HuizwXsqXtYFvebZT0LCjDSgX88xP/n3oRPou7SFd8eKgd59x3zi2dtersDBPPsVa5Gz78bx5eu0zMBH12YW5X/h1XOU6Lpb5kbsliLAT49mFgUR5Sfbe5klTihnKwBfPZrsjEGOygebeAB/S8x6xgt5R10X4HNoj/BEDiiWpibgt2ul6Zbf+vp9qpk7cN41b/sNr+N18vvskPzOQGJYmYXXvkqMRd3ZNSi/MxDqnqn6wA2f2dneMZ83UFyqRXM2WzRwhX+XBlZQOCDGEQAAEEMAnQEqoACgAD6NNpZHpSKiITBbmsCgEYloANV55lv/ZXr4775u/M/eh6y1ALVLvnof0H+iXzCf1m6XnmE/br1xvSV/qvUA/uXUl+gB5zXq5f3H/wfuB7YHqAaw7+AG8v5NvoWf7ibtT+5iQxlB8zdQj2t54D9HTj0C8EPA/SiaAfjJ6GFQ/pd+hh+sbcGh9u+iv2V9MUA4XKuw07LFZmY81rzh7ZHLgstzyI83CUP8sTEsN7O82GWWGcUrHsMdXnicscUD9JhudzIbOu+eU87fi9mQ/kpEyogOtTvRmtEEv0tTk4c2DHaCOTESv2f1YglT7JQMKDTbSvZ7BkR6CyTkTWaUMMlwhJJAr9Axn3h+t7DmpdP7Uh+FJsUiC1GPUE+NcjsUzUgV1diN1BWj6/P2yDB+a6qv2uASmZL4nLmZvOAkUdYlpcC0gAeXywZAiKidW9ysgIWOEJH8VpMJIMZrFRUQ0ndq2PIsQHU6xtJitvPJ/FGnONyI6qumzafRuMd6uUkOvO9rAyBUMpsF9BCDIZ/ryAPL4lUO22KgrB7r+9/pvyeNgezXARmxHcwmqBe8f/fJ2mwuDV33IgGa8vozrfkm4XVxIX0UqrUIawBjzwd/ZENnr6sCd/N8cXeceboqpPd1AttIbV5oq74s1LxPvIjr7Rk8bnetr6BviF8O/C234EVz4GQck/0K3BrI5yNGIOkB2piZX8tlOdb2xgAA/v4G0AABD8U671ushcoAUSrdyR9ZloZqfeylQzXD+T4nyn6EOUZBVTCwiGiS0/SrsLX0sY8xaMESuOz+59n0/xUemrYxSz9QLRVgzMpsEU2Z1aSgKl3saW/7hnMcBNFf5LRH6Lva8OflybA4V6R/zAPhMS6s3M3J2PhB/y0TUKjxeGt3+JdJmxtuigdSCKhMaMARjU4H7Ivf7EeL0I5Q1QxGOTuuvMN4fhAPLzrOj38SVlY94XO12ChMRcpm8f1f9R0s9grq9k/GC5G+PAAAh+bfXuuRKTPBr6hHs70b8OpitI4jVcdvW7/+GkzgyINdjPduaSYfchbaRO9yBSeuDlmp987lJ0nb+NpP4f6EEwGSa7228w9kxgDzjKIT1GUpuBjELYviIgq6TrfE24rMHg2PhBhIgJTkKueORDHBWb4/k7WPI8uMV6h/2X1iUkmSlHFC5vyqrKNdF/Zv6X6HqdA2IWB2XIUJz7XpLhNlZWZn4i6F+PFP+8vs16zmveHs8dT0Wc6W6cmb82badjX3Ses8UTcBiFXV+GfUuJ6yUUBKKzfYyRvglxTG713ZrFPAwNsBDa7d0BT0Jy9P5QPTP5ZwJmAHJCmFMVmnbL3L8jOFsfqmP9TXwNAtjGs6LaRDHGRi/enCzkd2ugn+gPfcUsuoNfZP0Cc+f4obH5fz3bc6peS1IEQxSQK6Dzfoc/le96kh6zNUs1/bQXlsXiVNQhEKUrWSu+RvFzBY99xRFszVGZ4bM/8cYi0OhfQEc6KbvbtpRVxydh4lqfJwqrXYqyFYoV3y8ctQwxHpzPTmfglQ/qY/WWGCbT+TigLn5d6NjF9++xFu4E7M3mSYicqfAJv0CWQX0xIXuC7giQyIx9hmlEVKEigPjR5pJP0l1qdC7eoYx3RD+NCvqbP/691/6dOdFHxFciVvHHNFma0C/lzNIomttKe4M7xaxE1+7FZFtkZ+E11illbIkJjO1Z9w6JChopiR3XaamdQet7fsGcYnqAGihaMrTAQe+M4upvdCb3D4ACLaLmVP6ZpbhL+U6Wz/jCqZGn48dAH+yLFmMPGlDoYjjc2Ldem87LS32ex0jJbO45g/AtFEzGoM7qE3GncRuxJuxSfhFf9RGljbyZa+PfQxeakBKLdW9Ccq1ccAfwmyrixrZ29T7Ky91IHil4FNFYy26yJQjhnsBAgWL2uXhBJIF7pTzaBeYKMUmMXMNJb//LcNbYdxCrYmWruUossKYYJee0Q+8axIPAAU2mN2hptLwRxCYS+47l5XyIc+kP/jwot8Iiy0l+jaWI7Otkb+0ruYZ3nH9dNBC63rqb1wWEtYEIKj9aDqJtkAQHHk6aUpie+/sXTjp7L72VQe6a67z3nl4UZcY6/DR9jjcYUwuV+kPoO8UNhWqVZ1Kuzbdafee5Z5/waLC/sOkRs9AlykGfbX72EEYHh9Fw3XNzmakJUmbkHysnS/MxyNVUMQLdfhQuDRvG1Qk8AG/4SMETJ6LGca7BxjfVJcAJ4a/l/shKPIo8Xoa9LDcIkNFi4+m68W8Ke57oafQ9NI7JcGwOuQRSS7ePrbJecopsQmrEGZRQJVbGQ/yPcxyPrisAi6x+gOm3YbI/HSO1bO4/0AUuer1+Yqc5VIF9Lyg2WKsHjKKwu8+bVuD3xxNNkSNWqTYXljFtRWxzx5HgK3BT4tXGQF+oDorvJRzQn65eo3jineHwFwETQD6gmYMcTgKIbbHLGehIVk/P5uQAqRiVhDatEXKvLiYouZREhRVeguCmjatBLt65rc/0hLY86WW6ezI68GRUV5h+YTlZ3543zcYXkOPaa37TLkbL/xrtuASbLk0t5Itcm2I2/0uWlQnjJAKHw6nG6xkJAWvvSkjbu1aX85384DoRl2vQqPDsK1/O4whfXIEuP5ip1I2LBBjmuZeBaKTHSA2GqDtxyOjznh1VTj4W13Zr/rLu2EnrSmxLaXXBUQdxJQcwOqHE2vbpocNWLvvCJcpCuDzHgisfZQ8s4tVDnqqFTcJ1yuO5jkMBQPrQHAaSqSxpvrWqH6qh9XRfLiwo5zM9+e8M1nLraSJ8TAhkDEvlYfzPDjE6N79omu2g/3V7fcw4qd8PO4FLly//joH6uOTX3830CsCGpfWPYhh3vLGxjR+fJ+Z4jSRNOe9XOtuMlzw8zZL9nnK29ILhZ59pSeh4jeG+aDrTACXJdR6uYDoh12P+KrtFZN8rNd2oeAct1rrNqTrcf/vzPl/lj2N4/FO4KfObWXLl5d0pokaDZ4tiLZcYJWnTJS+YUE5ci2WTm+21IJG2rIAfoo1hVstVa81fLbJWyMRvatl3A2ZP6HKsVZuPkUjISRJfukNRKbk6hdYlWnDExYAXIh53BCIAeYLqn9H6wCJ/bMTemHM4VywZNU94XBIpwSmPZyFshCpCHdfDr4DXJTemL6rXTez9Kllgr78QuA6kAJ/duklI1/nw2ll8GniHlwiN7szL8MYMNVPkD7ElYJxAi8Jo9E9otJ0+Ksqi99LP8i3gCcHGyewb3g/o3ZVDVviVWGh3OMDn/M5Vyg9pdPvLPKgRhTBLqV8w/In/sBuEPiTL13ZzgSYGeAmgMq1P1YkkXXmWn6ksf/XEfpl8soh2rP+6nwjRmkIBGGgngiaKUR5Fjpj8/mgHM01dnyX9qMqpjrRqPwHIRIpj1aal2xL7mDfN9HZDMaamQgNUikt1jjYlrk4jZf42dt3LroPM44E+i9y+h/J0dNvoVkAj6L+mj7PJPxY54eth25+e+vh2I1hrVj7z6wDI8vC8poQVkuf9osFyvyj8bkQbH11iBx/70xLyWD6bY76JEcghqr7b8X4AsR4ajkeLRf8ChRoFTcWcfrjwJCu7TmvWYi4iEbaEX8l8e4ST6XZmO9XFgOadVHlTGNvHa+I2JvctY/rNSv4VfAEf91RDoF4w88qWjKFwbXHmztN9PpE3RzP5DTHQd3ujNJRWUXsGdZqQB2YaZJ2tA0Ia8T4S9jSiqaD8GAZVKPEUZOdeHRJTwHJnJVheq9zYF6nkpIsI2AT2HbofOa0hgADmIlm8fhdK6FrsFPbn25Md9HrvERHmKIMr6WLS91w9V988qsMOx8uLeYIFsqCI/vpeDjsABYLGvpAveKdWnbxnmOimwMRIK5apWaHl1vrVd/xADwht/g/PqBIna+bMxDR7kcLc9xWccHQrreFpKgjWVBGAbnF/93qpzAXuRtWYNzCJfoZaygra7be5XCnYkIkRHfsYdRyXohFU8BzZKjFvpuL0w5avMwtjsd+R7de9pRjMnPqHhNeizJ26hSc3N+JkPf9Pf1GWadUhAA9mROSvZhOlXdjfClnUUe336tyCpiINSJ8TJHgTQGT4wH03k0jmFefY4xUqy67GTfW4GnknXVHqr19PYJ6TAFXSyYMy8KtESIJU9Jd7krm5if2TnB+iTp2tEf4fMGWlCfsfKkj7BFz587BgdYGbZtT3Kg4E3+BiQQpGlnffjQq2zurfpwkZMRuAP/oyExMG/q2oGs4NLySYat9C76Dfo/Vbq0ify8iLxNxG1zs0XdftUoF2blBs1almhWGgilUiEf1cf1OTXie1qmXpy2MYLns2LMBFqXxUVFvPr3qUBkHpq1knCibuxv+/NKH1FtrGRmLbH19S7Nh9w9sVDVDjJCQOyT68ri052ywOvsXv++LDzVgcvckc1QdTyNZU669v/7zdltf92I1WapuRFxaNdK8Qtr/+V7MQZrcSMdQvn5EKTElKkeTGyUc0t3rvwmfv0cFxHqf2A4iCVRiOJtBUUAylua/JyKzl558Qa2MuN1X57GjWREkZhjNztt2RImu5hGd19v+uwfsgoGuGsR+tD8hB2k8QoNd+1Qdsyh/pWN0YY9v6j1FSdfyt20I8avNF5fJ/iibgBO1T4phrFsZ1q0V4M75UzD7WFbtjBikuiSWFni73iqNQZFra7WsV+tMEwk8vQljlqTNPXZHX42W3oxuibkRK7yj3/107JnLia9DWBVWDAufHgm6TjNrkdlcj6eg5Bq2rN1tQrgV3gQXjywN8VjX6ucF0SUabRuIq90Pz8361KlBC7o1b51lJwuYRecTRs6rV7Fyc/OaMPYu1fGQH4X6bC2F4RJ0gjmRPfdH/CiIV3d6KJ6AQh2qhvUeELLPtctJmx3aXFD1u7fvtQdSMQH/a/VLiOIvOP7BYQ69QlnUKanNwJFjm4oZ1rC45rKk0xbLOulRUTonYJ8f1916D9LtPgqYPVmzCEq+oGuVgYVH2rS7Nutgi2Do88VX63F7VaIwouJ6roblVUCj67Iq1dkMBAxPkiCC69Yor56acsG2v7HFuJvVdsF0MyTx0BbbT5ambdIr7h3Kwwp1P8RY2i4nO+XuaOVqXTL7jhXNurodU9ieSu1CSPUWNXjBLTq0qcn+wNpTKf4NFzL2P0b+lGU8VAGhClJPpsWsE1LIpgqp2mHnMEpQubpkVVX0ra5uNRnozxT1N5/oK8D0p1bDWQkJsxEFpSZr5jRbn/qjwnlf5E9hPdz79SmdxONIzhlit9fsEqeIXbJePpoeWjai8FbP7cLrW1/ghcmwW/RRJk1dgDN9uVCPiIL3XlEEtFqJqZZbcM4mx5GCL/pC4UbTAxas4yHNmewBm6KnQuvEpo2GAL5MaOfER1CYEw1SUKQsDb2+CBw6X+znT2iuG4+gFOT0jorthsO+viYW4Mr9A6O0ypHi0AFOl41H1ot4K38HxZJYqCq208TqEHfgo3JRReYsEvEWquL2/h7iypD6r+mHjLTDAZosHvrm5C+tX194R66xgVtDfF9TmooVRiQ2/WQV8Jjjc47vw224A+Ii7drD+sx3+xXBoHBQFYApsxp39Eqv1hVaEL0hYna4/uQ6CDpi02BW0lWckdGz9rRlhrcPxTYFCxFqClyNUIZqgxMGbHxWzCHf3wK6KW1Xcj/ooQ1wEL9EFFluJIK32Q6cfeWDvprsx1qf8MCWDH9196m67EURQIqhTyLcGJjlgTQ/8geAI5gWfD0M5uhkvEm9XCwwuhXYrKw+ebpzuEC+N6mEn5qsJki2946H0TScLR602Nviaho2i+q5WmsMGxpV2LBUQJxfaoGq5Pghj3lTE/mVF7WJHvpm7Hu7shdJ+KJiHDn/FjEvErrurvBA8F+QowKxgul2ByXCZlP+39RktSxaQZKTXjq72Yw10XQlU12EtUTcNGjhUnJLe94QCusXhThuteOTb6n58nybg5s/Df2tGYKsLKnja0Xn25y3ECNva+i+i30jT2k8zmsOaCivEz7yv56lj3gzQqzXyUPesbLNaIqwTJDyvkS1QP050AAAAArQAAAAAA=",
 "best_dry_fruits_laddu.png": "data:image/webp;base64,UklGRjoXAABXRUJQVlA4WAoAAAAQAAAAnwAAnwAAQUxQSKIEAAABoIZt2/FGepIGdce2bds2ilmzXO8WY9u2baMYWzXH9mS2SDvJlzw/og/v+/zcjYgJgP8o70madit277qxug1N9L0mB874hLZvopp4kUM3JNaEzv57e2J9Umj7xwro8qutU+tRocOyiwUo7us/aTDgI4pfFEKB0ikopSnMnXve81Bay87ivFuFkq9X8S3SJJ05xo1j6kgTytAcwrHvzSjLix7c0p5DeVoWqHiluSwTzG3Bq5H5csEJ3NBXr1e33bed6tavaFPuHsp2Ixc01b/aff31J4MRCw2fHofqAHoL8rnjBeBVrnXf0VP8e1ZVs0kzIv4NOi1cnNJ6Mcq36JvWIeef5lkRUXhx/M/2Huypud2ErhvNMsLPBei08WKAO1uKR79E5h5tzpLuScjiD1O8mdHoKTL6jL+GDSUSkNmWGUyodBIZXhSuVV7Fc8h0y4+KU69HxqeUVlrdD6zDSIX5HkDmx6mUFYHsz+2nKL9kDuDtUkoaZuYBBihIdxJ5WNRZQbXecuFzDwV5xHIBIxQES/gwR6Uc9QE+5B9atfbvwBaK8Ejmg33DLK289FXDNm3fn8sTxMiKMiq94toD5K/1Xn/ZNEtATuf+pZGFZ8RT5LZlo590lQMTkOszJWuWipx/31WiZpnI/buVJSl5Gwl4vpwU3yIJp0vgGUeDp5XEC7HSAL8Wrd1jJOJWkXz+eYFUTC8hSs14pKPgL8aATKTkGtdU0XlIygsaV1TjBKTlDZ0LbuMEJGbROJVzPwlITiFG5Uz9Z0hQYz8n3A8gSRPLOAqy0ASjHXhcRKJmlLDX3kgV8wB70UjWufZW0CVBY6O9SJcrOhtNAl3iNTawiC6LwO43dPnGXsUHVHlQ0R4socoScNg2nybGdo68kmhyRucIZpPE+gM42TKXIknFnVHNI4jwDThdOYUeu7TOQY+P1MioAa6ONtDCMABcH/WREoZRIGaIhQ4fR4OoPol0+AdEnkCGx+XFqvKYCotB9IlEyG0mXu13NDikFU+9nQSFPUHCQSYKHNJI4R5HgMKeIOkQM/8OaaTRx3KvsAdIPMTEu0MaqfSxnHvfFiQfYubbEpBef4hrD6rLAFp85Jg1DGQ5gWPHPOThe4FbrxqDTDsYeBUBsv3DxKfVevmo1nLpYimQcbG9HMqoBrIul8idlz1B5o1TOfOyN8i+8V2uvOwNCiy/hyNXWoMi/XZzY2tFUKj3ZCMXzMv0oNwhz3kwXgNKbnaCfallQNkevz+39/qRhUXPEhODQPF1tgo2G+r1jDmfx5iPU6t6egED3fwvI6LxxswBNVoPX/fexIz8dS2AmT5/XrMiovXx3u+7RvovszKhaFM3YKpX0OkCtC18fmwvC8ynBgJz3foezEdWWk8P0gGLVR0XPWLD02AdMLu8/9H3ins2pxYwXVU37MQ7BT0/HFYZ2K+uF7wkMV8BQtbOr6sCN31b/nMo0ygj4cmJiX1KAm/9Ov2x8epzo2SWtxk7/+lbUQ2c9qjYwX/GotgbGbm5git5uXmvb11cGdmvZgngv5u+RKMG/YN/Clu3e+fuFcE//fxz8BdNGzau4a6F/0EIVlA4IHISAACwRgCdASqgAKAAPo04lkelIyIhL70KqKARiWwA1T3pfqvXEZ68z5pXIvb3w+3vfx9FvmDc8jzL+c96T/9TvuO88f4HBAP6T24d6Pji+PaCuLvsY1L+8/0H6M97vyO1Bfyj+p+YZ9r2tVtfQOv+/svNT7T9InfJUCfGK0IfY/sIdML0R/07bS+zNnrzJ6Q9NWpryBCZWf3XBsNxOGk4UbrLxqnfElLo+y6v0jx+8xJpGGLzo4qadFQHnJQoZbSbp89D9qTXqpS+gdkP6zR+UZJHVrZrwctfgag6VSbxGQ4BKw1TzGDgrTARoCIVB7Y+3lFQC0eNN6zNmE8/DICWXU0bpschiqUeBxmH+wy/a0Ybfu3d0sVJxrrKcnSvtIXKiedAuK8mTbLjpQtAjv2m9I6OkZLMxYAVhca0tqTuXCmYmG8kMt51UYMo0AmJGstjTTq3Q9GoELHfS8ip84hB27jgozFSZRy5nMmPgRJgcJSD0eD1Wl/tZvJnsetHZZQc2gbw5yTLKlkg0ot4TRr/jex4trrTDjzelwZc5k5JYQSDGTCxXtyGAq7R++JOXoYLsDb8Yb4SvhBwm8x+JlSQB7362JQUBzIvVo+pzXW8myjeRRs8cjuovOS4tl/9DiVqmcM0b35sXJrcV3lIbgFm0xr/q1YU2S/CrTopW76GjMuo50A5zNNSChYLiBpU3z0OKCZvyzJc/M+jGBi3NQQlHqPwS+LAOfopp6yaPRa2J1PMqrf+kb+pZNiM+quUkmYAAP7+BtAAA2BOT9LWZQFlJ1hN/HXHbqt6DgId6nLueLsEv8GupWGFuInsbm5N4i72rWVwt7si9zVqTBfPKgGWPU892QP2Q24/Nje5NxwbsbciXSzGuMvjx3UhmMcr4YiSvhFiz6SHoyKYN+WLr5Th7fsSodXZw2FgdoCvMJifhwnxOK4aSdXmV3EfZTDXxLU14EZNhVpr0XIfoUcBBrvGPHmT3VlWOgBV2EA4XrvoO9MVyxkkCBTeY220Xf3jeASWMRXjam3VJep6jQJElunTUMPpNPv6JUJ6kkDR+cuLY17WII6D1sBF/HMawoOlzZ3oqD86z/O7psZhm23DFmNKs0W1Qc7DeQ2rTmaAvgGaQT/2H0USxZTzl29D7wFoYgstsiD0G1LwQk46mBUOo8+waVxdQs3VKv7DxADTretMmrGtbiGrBDPmc9YlQL8nFq0+9htFFt9v2StF9CWQI7ipnEjvEIWUKItHgd+wKN7RsXE9WtfU4oAXYwq1KWngXnejFSHbU7WiA9IV7wjB1bt20BXsHgGERjbnGwPfyWpe/wYEG9k2kQcZNDmURjUROg9VSgOz5vPwph45e065Slkz9MlrklGgJG2c0t+cCY0601wQF6ArbfWZ/OEnv5bkRyDeVXrNLP3fvATqFltyzFicbcPPByEthRTByJ3IOje1ODUbDAnu4s7c+4hZnSHUPdboKxAZj0hoLPznmgTCJnT2+CYrrEi58McYWSQCQIGVPqxTetCWnis9J0gbZ/vCFq6GaBUFOo9OO8cydlVtKPaef57If8VDGolZyAW42QADwRaQ3karO/gbXHtMD3EfOvzJAWaBuX/7GnzENgBSTyiC173Bw8KQhYnBrUYZfvTM7oLyi8adn/6qH5BvkMKgiXO99Rrfys8CoAhT67KVpz8uKjcNUDUl/XUKsOtO3MKBbYeScoN2QYhp9qlmNIsSrvw0VVY7buC6KRRH6Hos+gs3a8vtKNmcFl/r3hSSaZgufeRvipO3n6KwtjuAh4OdNJ/WOhqR8Ryf97KOj+jKr4wOq3MaAVhJ8yJRkWtGJZXpi4IDgYAiFnVeCFpmZUtqsrI1qwBYapdWDs8TIp2jrota3WGor3hc+NTSgslzSdVTLch6fM8yrsEOcs08Jcbfc2GSwhfyAsCIYDPyjWmLXuUgQ/CyoePUUXD0EbyYKJGpdapJAMFKDP0zy6uyILrYEClcZu7rr0tD0Yt5BwZjT+8QmtcGfj5IP/kHaB/2NalQgbatcABnk7vG+SFGQsOPzw/BCyh4VVQL6lSnRRmNib5JA8YVZ1d2ztgxHLVU+2uYYGjcMjnu09zb/9/BsHmYCf2EYETc19rtJXu7xS3p4EnfR+7Cfi+EJh87TzNxZiUJQ9aUBd/f+3jvWhRY8U3XGL+SWtCJirD8qjrBzBGKbUq91IE+Mmz9fEbBI3B6k4v+3qhHMm/fsB6WpZUPB3mhUjb/HWRhc4Naj6iA+nNQD8tbssP+Y79c+J2toIsFX1dsOaI2JBrYy+z2hhJIg+a7ueX8aNX8IcvREUgJSRIVm6zb51bZxZi32PnqhDIqZgiTNVx1YpIjB3ZQkUt5gKnPTnBQ6vbGJclEt2e76FQn8oVNmSO7uKz2ghVW46KpuznH7uQUP/tXiZA/mnUdxfd3C7U3J2/lg3RuCscaPe6TxgDHFeLdilMUWtXjgEf1i4xOWVyMclEnhvLV6AjIgmLuZaePmdB4vVT7IIlT7gRkayQq12oB5xWw/vBCCbAPe/eKPFdvnZ2p5hLXK0aGirEZkmaATsPLIZWDCiRSGivOFOlBAlt7En8N3epnBcI40aJeJTa23PaTNLvximOSurpk4xDJEo1czs1OMi/e8nUv1M05ShjgBhWrkUw7DH9+URvte+kf/58ujd4gu2a+qpN+vn+xMVATFeMH6Ku/v4D+7fXuoq1XisxFZ5H0r/vlyuggJOal4wXPHK/R/5s+gTv+ewIpYcj2vBPN59BQD0h3i/k5pws7ipgyWQ+85ERY0xqJRCw9vLOAoslXX7XGLYLkY9SDSdFoBiVSz+942LC0mrwX2Y9iwPr+PUHC1EvvelLYW4BB1h45KNiIRWEGHyP1wYIVy5zZ6LjTVx5iWAAHBK3DnoDy5xuR04scbQEQDX6OBGLF5SRvlNPp2Md7iIbo7FLqQaG3FrsbsQ5A+tVy4AZDM84gpTlJEfUNL5mUc07DXPSHzhkYK0x/Q4jkUCi/ENm+mFBY8bBTDlKxHcB+cTEIVCxI+Z803Zo/B8X9u1WKmtdbxi0DQwEr3kW3aRsS0Qkee9qtV56EG9mUJ7LbAv7OklHbnZSSKqaw0qlXAe8QXcDohv+ihmECMbB5zV+wY7iZ8sVnBW20PTjg8RbRk+fPebnPQpzSc12zrjYp/60BK0retZdMSLvpKnd/YxMgyjTHm/4ANAg+gNY93aTdhPweAP1hlet2dR3ItnrwwxsXPXc5P4eOXy7rV1jvWn6LHCLVVe/4DSb2yZVZJjB/M+cZy0AsRC3LALweiKY0fCT6w1a3lkf2unCbYvDE/bRKzxfGIMp8ZcXxCupf4NZ/8QYEaFb4Nn8BwKoljbQyaMw3euxy9l8eIadCTGTFVdPqlk/GE2CRya+UMnXojbeX3nU8I57JRJK5ahy2UrEB3MzLm7jcvTaGwn85gLkiOuv07LKGj+39HtktktIMoerJojjLwNMBhbaIqnH9Vi1Kamp3yZycgSDobGY5KOhyagZtwV3fwsEVXSKv5agZ64Teav+8nobeMuy+k8eIKMIG4cQ2RnsB3SB28OM3K0oeOAZZaYLTYkTfvl74kf4597VufS2+x4arOYNFRhldMoFnHDHcOxXumuzFnY5wrPa9+RWHiei72Csi9TAxwp6KYXeZzCU/Qh4ZTX/E/AD6GGE4Sau9XY37HvVHAKS1cHPZvk3MMNbgEVjF8/RT4EjxoU0LFZxULi4Ycr08/9v2HE9a1HVX16E4wzMWJsY3g/oOn7wEN0S1fFkJxruV4EYmm59HnEYPKJcKVy5J163dB+YfzLA6gmuHoPIiZaVY6x1sfScLg6wXkBrw4DWPcCVcy01PWKuXcKeKrW5IwQzIPDOURecFJJCKp08CvIakyzcSGdLA7aazjK0k6gsAGLBlNfep50HHFWZIWg2Q6ArYJdhYubjO5h0DhWj31ZseCwn1LnNd7e/9E449wdZ0tyBCdzUh1j1TdK5yili792r+nGdE5Oayl3ePPChDXIHx3en1F8X30BX98T3zbXxhVToaSVLy0CrZFh+MNsyUa49m+qfK1WsKsuzsZODWQ2aKnV0zmkn/eiEpmA3XYVaLVFEaor+7+hqbysI3LELNSh/J9M7Pkl0mwdi9UwxI0jWZCOjlGCljwYU/yxHrESVQtcxWDXm0lDUkkKrce6u0epfzt6dt31NAghdijhYun6fsV/S7cd1hE153d8rbMRP1ZFddnA3eenVryADIWYYnS3il9ebHgfvZQXaG0g7WLaa2KHT9KIErbVFxHi/k1AKBlYBAfEFhikvJz5RzcRNn2tkzJFNW9aUa7lPEgUTWu6kthDp1uUuZW3eVn24Wv/CiDvlVYbxcObHifcKlc7d6Dud6KfB0fiwtdVLJmIn/ouudXk5jUyJncXa6+Jpt9LVzkg1sASQ13II1NKAgH8hWURwK04STztNLrN1EKvOuhLIAHIPkHwYHYD0lYGDmLPJ/72V1dNGHiB8ECl2cVSvwjyHQFnB8hOczUvOwdmxNwVpzkA7e8gpPHmm+BK7e95LoJg+kWbd/a6dWrWTHolrX8xwbb2ioQgbdpJ8kKwcxJpg7QJUe6kLMdreuG29EtibzgLOItTy3YIMXWsH4nVQZtyBTjxhPeYqaveSo40tgYL4GS4eDH63RIgmYn3N7K6uoLqda126cxSe47nisrPnQBPG47S4qUDGKGYHXhVgYibFoyhl+MOmPsZW10B04zn0ewOBipiNGH6cb+r7qyeQ1PW1WcauU04w/Zd4x1bBCbtMUZZmxKRDt4k6tfDJB0y4MLO91+Owom4RAZ6s51yRGVN8KNtFhFJfL7KwUCaG5fRj7SXrDGi00QitFTnH3LpWVYcPlVnEl9WJZRtXj1wm/cZHBNgUw9ZA5D7Xue1wgDUGGzFz6oxMTs0x63h1uPuOU02oq72PoB2/R7MosryDXzXnZhTbO5K3DemWWeft+d0eqYyjryOdlX0tYcNgGZwKQQwyNZHGTKbnBBdaPA4q14lpbnQ0FxE1Fx4YvHSnzrjvmeH9nJtC0I/PXdlyQ7Fs1KGysZxuB7Rics0gmXr85/4ev8f9OEJ/EhHBYZqD+eoJnQPSToZ8mTMuYBB/Te1slsc9YlgCUqJEhYjH+yMgnJ4lUWxkhFiHse0TvAkyBDCSJ2Sd6Li2RgnC/6Nt0axod2A7C6KobNKgZUA7kVRNFxAbG1tZWWvaXzZ7qJZhZKmuToI/kF3U82QfGg3b08LkODSchNEpN/hgKHsjbI2byXT7PMXYQI5WvYmeT/sBqV0FJ/T1MpakYqdAxFoN1pXiFJ5ENsxaob+cit4R1y+w8ERfGvnPKUFADLuhPS/psOzJ/+LzISDRWt7lxF9ZP7F2P8f3d6g/NhMwRH3SsjYarFHAzVJeAwPEGAuzLsEFRs0/fRFrMcVwc5gv8ayYae7DmqV1oXkPBdrmX0FrzUPFuMpwmuiE+G02xodHSsjyuA21cGz1/imfZUOyrcrsSQDBb3U80u9k9g/vwfdB/S6ero6foO9kXvkN/Siglhm8WXkJgCeQKeea9AFyaOWRNuEMUVFY6g3oG5Tahhz3u9s+UJvhGAybmiQJIbEQfRFbKFe3BvLed3+1E/PtDjCKEHgZvjIWPL94J2ERm9k7UPry8Fu9iHvBiNQeXokXRB1yllPIQsHyQg0S4u+XInoSs4kelE+teevOi1O6QajAKuRLaypgFZ+yIUT2JxiPQF6INsoIozaGY/jVUzTSLi0Xka0m+0ow+KRRVIe1YPjDnI5jciGIthn4s6zxAKFpGda7l59vYrVeAp5sVxl/VICb63SRNmrjXbio4wDuUSgo3pBCZs6UtfFAcpUKPY/Zq0iVkPE8TyGwLSushF/6QI9/5ewFcaql5SwDxm3OOwZ8o7B0BuiI0Zuf+YhBETugKllfQ6fWY1exK+l6Hi3IykJYbd0Uc4VGOjPKCcACQ10uV9X4oa1JFXqROhsru+wns5+/IbIGhwsfJHMdvTZ6rP6xXxuUfupyBqfnCZCPKUS4eSOURXcvN1ZL8j/4KHVhV0BlYDNYlYNZ9v2w3s00SXHCky6+ZhlOM/wBpHuxEWR//hCWI3pDZRPMfowcb6QbRZY4yCIXcNArNmDM64c3vCAqhqmrjeSiFZJdseLg50hBOazdEtQ6jQZU37IkQDzhHSLpb25rvSGEuBgWyymnzewvqgjS7ocfNJFXSiADN1HwtzVllLZlL3t7oAy5tRv76ANKnqCKHWgsKdV+ToSAvrTvsofxtQ9aYe0B5YAAAAAAAAAA=",
 "best_khara_mixture.png": "data:image/webp;base64,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",
 "cb_allu_chips.png": "data:image/webp;base64,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",
 "cb_bundhi.png": "data:image/webp;base64,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",
 "cb_karam_janthukalu.png": "data:image/webp;base64,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",
 "cb_millets_laddu.png": "data:image/webp;base64,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",
 "cb_nuvvula_papad.png": "data:image/webp;base64,UklGRkQYAABXRUJQVlA4WAoAAAAQAAAAnwAAnwAAQUxQSKwEAAABoIZt2/FGeqLaTTq2XcyObdu2bdu2bdu27antYYro+57V5+99/05ETAD8Qb+PgU68cwJoO04YMGDB/V1DKlFIyTM3q5uGpaHDgYj4JRgAfIc38aEGfetHiHEvzMj5oxkAtMz4fm9SUW/vPJWNpDM0WvUdeVt2NfcE8N+HiMzne/deJz2akZdohnHfUeAjfwCADr+Q783m/nk8iFU3FYU+LuoMAP7rbXzwx+NXhwqRajUKtr46WQMAcj3jhYg/agFA3jbOxNFsF4aIZ50AjI+FfG8B4Lb3xzRP4mwTJWl08zZbLELYT9NbzjVj9tmehcgCW0RBe2YWishmOhARbbfzq59Oz2Ew+J4SR2JbX0PAzAUlVKx4j30H+jZo2LBh4ynHj1/7pQAMP3Xfjo+Kq5Xb5K8WROvv379/m1lUMHMkJ4BToIeaaErVrfuXu89iC6rj+8IAblPiV3ioh/fs8F8/ky5et6BKPsmtDTqchdYVHmph2uBAdc26euAzIqJlcwk18Ou69bYdVftBYaXpAuffykQ1Dy2kLM8ueyNQ5VObAECIr1KM27NQ/d91DBoSvslbGcZdDJLQnJyN9g1+Sii734HktF+oKTvj3HAk64u8MjPtZZCwmd3kpVvBIHEjVlWXkXFeOpL4cwPZBOxlkMxfGsgkYB+DpP5aWxa6NSyS+4qfDLQdU5HgtnWe0vnfRqL/rC2d60WyMUu0kuV9QTaMCJTIv/dpO+Gs3aXx2WZD0v9qIIlmmBWJ/7uhJE6HkfzM0QpSQJ2P5EP82N8kAYywUQBab9XXSmCnAcSkuR4iuff/ipRoW+EuitdqC1KjZYWHGO2ykCItKzyE6TYjVVpXeAhqlEAXaF3pKSDoPdKmdb6el2Ez0mdiZV5VEygEN+l5GDYhjcZX4ZH/PZXgJj1Xl2w6ia/C4bQN6ZQdzBHwglYmc+R4RSl4w/v/TM9o5bLX/+nXUQo7HjgHsZQyjCs4ik4yO3BpV9LJdSMXBEXRCDsGeOpW0khMMB8IiqIPy3QdL90aljqu+wP/3nbaYEaCwJAY2ogOEeJznzYe+ArRr6WN8+5CoKeNLhxjQHDFGLowtxLmdZcuXuQWpl/PUsUanTBok0kTsZVAxIDbNHHeVQzom0UPWf1A1FzP6eF5LnG0a+lhrVYcqBxHC3GVQWT9BlrYoBcLKsfTQUJlEF2/kQocy/XiQUgoDdzLBVIOspAvqRlI6r2feI5lOmkgOJR0d3OB1AMtZEtqBpJ7b3eQzLFMKx34HyTZQSPIMTCUXKGBIM9W0aSyDAG5tooilLmFbKBVNJnYJ621coHWUURCjKwgG2gVRaas1vKBVlFEYk+Y5AMtI0mE5oYygkY3GQJlNJIT5NhpJ8+lXLIC03XiJNUBmY9jCJM+WCc3026GKN8GaUH2pj0MQdIHa0GBxt0sMd701IIiTStSyfB7V3FQqq5dWDajapbMzKyUK32cQcGBLYbds6qW40zH5i1aVvMEpQcMDrWpkv35SCOoZYVOG+NVJ/nKyDygprrKa2/F2VSDSbyzpZY7qK3WM6TLmtsxNuXZEq+Or+KlA3XWeJaq37arsrs0r1fOA/6cHFZQOCByEwAAUEcAnQEqoACgAD6NNJVHpSKiITBcOxigEYlsANXyGV6eS35zzNuc/E75PqZ1ovWcA3op21vmg85X0Z/7HfN+ib9V7/M9IB//9gg/kvbR/e/xm80/H988z6Ma/Yrqcd7eK/fb8hdQLBX/VdtDqv+b9AjvZ4Aepr4l9gDgPvTPYA8mv/R8gf1v7BH6/em/7QP3Y9jH9gE44FRmMcDaKcEA2jYvLenBnaNJi+6c56ttAUdG4/7V4GKvg8KOkzTUnu0CIQY7qySX57RaEMAzkxdGO0NeCRuX3cTQE3CjRKk0ezDON8tIwwtMAXeaubznyLuC/lc9uHN2oTkHcGmWT1GFwM5HDQPh+vtosvjXz6YOAi0cWAIa0uCbffvMuevkJDBoXwEFaNkzxaX3kC015XpqhXTbkCUtAIedyqQIa9LZpO5pEr7aj/ItYvakW38wg1tSb9jMdsDnCnYAvCclBM3BzxvmMD0VR0Qh5UgLdj133vav4vf5lc87a1QLfoV/8ubSx/fTSCmXYJduasOGjZoGSQAHqUxtjL3Rg3ZBl6dVPenIwoACI9tewfkCGpS9/182+cBr82bA79dZFDl9+hLEgFHsCO8jba09Xeh5FaHCeGGMGXj5B00aNvntp07A9C577a9poryCY0JXXp4IX4oYQQbliH1Ptzr0xWgSZJRjFfzIgkqOlGjlw9WKfxaCWGtVDTDat7sz2O7ifV/+k24/TxVnHv72pHhf7PeR1jcfDcBi+tL/lGTy5xjxkxqjxO3//MUAAP78+EAABLeCTFVz5mEXHm6uke2+mtsmUP1O/XTtshLUxxaYfu1rHBYTM/idK7KPft7oEVVtK8cvXiGfHlG+RR3JXJzRho4nxjoI1hGwjWX5eUagRjxRjL4xvPoRkU0K5P85EsnhVG6nBgXu20hNpnEzOHEnKHaaRu8V6ja6+pA2ZWZXeObq17XjwC2atnUdpeCglcdFcVwxqB/wJadjaYEq4f0u5y9Rgp7nBEGZMPB2sYZ7bA+NT+FqAB+1Ay6rkbiafREpd0IvjTy2rs+bMuOUoRdUuieJRlkPaHDHZcMJQohWd+aHUZL8NPhvqTqu/4U7QrXDzNWEQqWgrYuNRLGmX7l7SW2wixVc0u1/H9uhgUOzl+aAaY4cx0Tc7P9E/YSjBDsbJzWhR6aUGLwNi+a3HKcV0duB08Wn9UyCLBqhp7j0gGVjuu6k0c0uunQ8pJCmu++Kw3jZXNjygGbZu/0ODs+KSESJUuF+jL20oLunItX9m0Z6TGv9JEtyLsU4i+yaU1jErklw8hzjRLFyGe/pK04AvT2CLib129LTwtZkPH5SYi65skXT0JbvLG0j1ohcvZSZZjToCMOuUyw3uIfnlWscCS4Bsp7kwIPHCMwzNKV+mD9YvbGgt5ljOZ7Kmj/Z5s5p/DugvyimjhHN9Wrow+oO09TnK/u49dQuFp6jhQ/nWwIePNPvYqMMh4yPW0hABxajKOMIlgiqzi8ZE2UQ40qN6RzvpTW+fFzpF0cREgkpf6f97nkTc3VmSqiGl30hC+4HA7QW5vGJ59HP/CfruVzjT4m7SFIiOwwdd8gu4UTAFUJa4ETd0PDUV4vzoRZdXOFqoVT3uFqYSXwHP+ZfXKteVn2zNNwyFAn4XcOzJhfVa6jbff36nCRDKGPqyMCVrQCkWlGOGCo8j5BOweMNKAntbDrU1M17fAJXjCmR0zCxK0uJAgOgQjVSVvUDntgPFtYArriJhoyW9UAHwvGd7THNvKTPf7cT95v6cIFbstIH8EF9gPihaRc+u9n8meml8fY5g5vpcXVoPIBDnTaJhg2M+YNfmFhHTGOiP1w5tyDfLvmvt+rGzxAvidU1vJ9hqTzrtp2p6Kqg9N5hOy8GVSAAuihbZPximfMtqn+Njbew1vz7acYoZxeGpBenfafwuiqRYNUf4BvSJnJbDrlxShp/iW4/kS8nOc2YgQRaS4q+t/xuRyI29uHjhmpYvAKltiR3Zl5duATL2kIPoWkHzD0cvsWTxrICKpVs2IpheJRN7e4OPt+VZCb0L6wONgPKlt1wDrCY4VgB6S39VAgeu+cudu0hbyixItSWuqSKy/MjA5O7Dzgv7wkui1uVchjUd7QpXLhrkxGplmWp0G7hzdscS0Rd9dKmUy2s/EMlHEtHz34Xky8mWfSyP6kC8lHjDYgJfAI5f4x/7B0bYaqkuIImLR8D422YAmxThmy6D6yvuInX+uRCFyVx3CpBjdwB7A9Q9CoUXPb7/5OIFiDuuXpTi19APgAej+CjtWd7InmVu2VU1J/jhNU3jFz+QqfDvur5Gr1J2iuAPznGNqjbH96EFzRXKBh0ls4oIoxMI3ee/Yjap7ALSmHgwRY3GiYq07cmmkZJODR23yfbrTRZjai7faULkpaIp1MPcHumP2Y14IbYvD6OSOAi3fsPKGUeUKjc8v3oBTAGWyIwqxVwuvFfG7gppE6TjtCrU8NqXN31uzgRJGnOARb/sLwrt8BCvM64xRdZCtDyQvc66H6hj7gyhjWbu1mg57upd8axiuemJ4T4s+/Fz4zn85der1brgE2/48g/j173co31qOm85/l2eke5PkmbAmkf+Fxj9VltstloONCVOdY6HioHHI0DG0JeBBlWcvaxfv+HH3jj1W9S8C1oiF5QsH6+1hKBaeUIiQ4JiHxqqrhgB+oCWby+KSlugnEwIGAqOxL8Wm6xzeevKvo0rcaSygXt4vSOm3qCbfkpVCnlUVyWL9+qnhvIiIDuP9QjX1jcl2pczdzBkSK1I9YEW/IXktLUIaIDx9gq/W+anasdkQwAzG4kEPZdaWjnJHkRue4evJSx36ZB0I6zHx5LVlabznC0qYzbB51eMNHvLfB13aL1B6Ql7f3VpYjVE7OKTXDQ9j6WmYrspUP9sZYbgM222XtiVXblQxd68JV/kU9lqG0s6vp13hfA5lwGcN++JfSZOWUkX0DEKtD+RbkXer/nvum3Whoxf8uaV7xCWjyELHt+0+J9ubzyCTF4EuI76ykSUbP4LEpPNrkKlwVMUdkwYeVs6R+CS3BdNE5CcJ8S4C5GhYx0Gp5K6XFntJW1z+18s2YDT0P3EBUNjEOb5MlzUbdkBrqKlB1GzNXjc8Vsm7Gq1quTOcc6YqGdEH1qBWEyDPRKiyfbBhACblS4j0tEdoihoKR/mTftdM47JdkQK+w8RvPHpA0t39X9FQM0AoDIfngP7amSCWM3LKg6tKFB/hLpHrQYQ8MKIT48DRsyTPWIeO0HuVzig42sVnBVByBGfOfISrlVDz48eNXZlTGGy6SGoFaKhhGpiyAlE5dPvmV6bn2muKzZ7x6tLoiOP6IQ+IRLk8urTQJ1cGHbDIgPGph6wScDq8TsLS5MlqUKDC2MdqJC5ZyjTuIzckT/61VfYxfu+mn8c0eCqRs0jWzX1tXXBCWQyYeIgJeIZYjDdsz9JPi4ZypP+FQ6JgGa5qgzVEfR1Nudj5Cp6x+YTrlGpTTpT5anTkC7w7xC0HgFuQEpocW3RECwLOicI9P3bo2qG5KE/qQe2cMcZzKafBW/yEIwelcPNTQP3tKB8OM4hD98p9l6fUROOeTySxc0LhCiLCN2ZB1hXTjN/3MMNKRZUiTqDMabl0ehop/RI41QTlTQUnW7Nro5mJd1VeWtGbFg0L2gNcqYjC748dOzPPKM2HYgPcSloe8XflWo3NCJzn3EWZCdjNL0LHIl+cjVF6kP3Hji8MwP9vJKzWvIfo2YzSzHyAd2Ad4kHpKKMrtjgw5AAhSHyDl6GwUyReRyEYeyr8RAoI12F73Z5NsnX2+Sre6Vq1gqQ0MXDm1Tyspg7n/nrvIzgGp32Pj6M2nhljTRJ1sf0mSVzdLYlflezxDOfmgXJUZAld0Em26iBmvnCh6qnHKa+FGPxKJ8urMxHiNH67wnHMzhv1uA0z6A8DlJOMTw0ReAfk/7euyeHvQUeioFSAtaV7pqWU0gdVqzVqVv7VI8SJDKA45DvUB+NlrwVeGl1vRwJ99Z0R+RLsM6p0+rX4mvTNMz70rWube2/JzWOEaiATtHnV9PTeNQ65S9cg4hZsT0nIMOZNw1FrMuZ/twzHtw8+pNbNkxqlY+/Xv0fzFt+KDGSkimlWpHz78oBfdFidKgDpt4QAslPGEvWainoAJBvYST5UafiE/Mt90V2arh24Zmpd6qv63lyD7wvUMFa9EKtWGqwiF2J4P95KF1xe3RCMyyOufsv5dr50Tv5cJkjZLNCAnTdqKy0gtr5QpGaJkjwh429IRU3vy0lUW3pU2zJy+C/cHnhg0p6kEwrWUKTH4rGoR8+vyWy5NNleu4PU4hUvFPgwc7Vvicljyju4nqQ7wu5612aTfrOI3Z6HwnxAm54RwiM48rAqk4H0TvSr5JMxH/vyXg0o+duQ9mF3cyeAgkU9szEwA5GXFO5VbsUxijHIQ6Gh3M6hbkczlPo+N9QQeP7OIkPSnP68miXfJToxH1qcB9cL8jK2ixptqUp/znoUJWTP0yP8xwOKzJMd8k5oam8edjenGYvk7a6NSYlXA7LODQ0xPu3LLkrop3GHL/Wd8rqHDNiyqovOyMYLPr5Paiq6PIiZZFz7aLo7BjUQBBdRoVtYmeo76qAKWiRL5K9WnPmIgZBQ6ibVfavh99/VA2v7k+CVJB3Ya98vBJglWQVa2SW1UNmxT9EPzFKtz80ojbdw5AvB1UcZelT4LT1PQWvEwfS36x+mZxLLmQzlhzX5rFGUsSfs6xNRLvLKGIA4g2G6vI/9Nm0/ynxNyb5jCP21i0dFT+d039eRyKVlLfk39K9sFgwdok8K6o9ADDiMp6HZM+K0CzJy88q/2sCrCM5zkccDKzFXAs16sr1Vl1StJkMJT/unn3T1RSLL8jjgW/sHQcXjauzB6qX8GBvZqKZBI62PdCLHHvSTN4yOiqLcILjnGRVwUBGxYJMT31G3csCw/tMWpY+LZbMwuKJgQkA5hGtgxy0cKcQinIVwf912YP3GuqtgUBXU26lhddje8I1twFSXVyb2tSRY0DhzqQq36Hv7rLSO+O4nNNvR+HfUmPVp/rRHKADq6Ds2NZQT3KEGRueMBuvvsbeqMxlTTIacWUQxT/3JkACyl8b/mPT/43Oz7h375aRdSUmwq+w0mDpMOgeSC/Z3NjRUb5m4DbdHyEsx1g5omDwMW0gLzWd0jjaU1irZR1cg+WmwA+PNuUM1Hpss6KtQ3tkEs3cucSyrMIZssldV2tv0Ph7+fkqIAk0dEYqtRsZWsAEKCNBWW/jAORM04xTcoUrqWYvYWjKrV9t5lk6sW30Djn6GorYD7bxt93r5e/cwXKgN9ANPIkXOOY7Ba/fjGoFuUogcLvbi9nMnavgTezpGIVtxql08zB9WSk+0M+7UEYNcsLIostysPbfKicdRMoT2MBkYhuIH06dtCEZeZe4UxW0US7jGUGymMcjJkA0NENPUB3kCl8M8t73s61TymtP7PUnlN2QhgAKR2PSC+2Dx12lSOeexZYiwYA0i1z3YAQrifvftioja/+Q0xoleR8kzvnPAjywwU/LcKNNohgKkRTMlXGkEvzwCDwEtqClIvur6ORlqBgMEQFgR3eeIEqkBIHKpJmO/ljQMdJyFiqBjUf4pSsHY1MWd1T9OLGfnUpnidu4WMnI8M2Lt7OLgwN9LWCMAw2il62/xNbir0y9BV+VfFOzZirN0T4YyBeOwRC+YKMhWWaPnjsMhW5l7GpJpw7Tl6iMCL4+Y4hhH86QJMoWLljNMUrjxlYi0JmWt+x4ZzR0UuCNmoc3Hx/zyw2uBOZ2g1CteqBXMpSskrPU0xCJ/IO4eGWFgY75xkljTKnuZk9vspjdFDkGqankwTqZS4FKiO1DWgTI24gKfFar5d8e4f6tsMu1Hds4kgzX1OUQlRLAHMgeXXvN+Sgy3+IWVjyQYBNkYDhLX3yFxx0KGMdRi/rvY5/usEa+vfP167uOvka9fFb04IcID2M6ss4Q2DdFSULALwwPsUXlR0oUHfP/A3h2MC21l7fZ2IALSmDKQEMGcHTIt6oS8M+U8PwpeWTMg8liEFvQiMHiXBxPrp1awGyGQL9qhS2S1KR/Aj9XUCBdFFpEVRe7um7lXn9Umh8RdqJOGPwMRyZmOTfUpqvCA6GZo2V3Brh4UwPG5KjIvwmACIp1jyC548T43EMM/+SLAy7oaqHVIwXFsD4B4wkDw8osL6uV2aeFSsCptrHn7CHMbWU0/VGmhgbKqIs1ow25AMMdxk1eKw7pTIUIB5AiMEhHj+7lguS5OAs02RzLUvdvlsVtkk2nS3wXeJDerCgWCK6m0Li+bs7teLSIcRF9AV0h6d8Zg+bd0KCJIy8wHLoB2d5rL/8ENLr3Du5M3KBJZfuibnS96Vo3z51ybFs2C9yNlBgxwV0LmX5rnYavegwR4YX9AgzoN4/hl88YP40Etq7/MwHv8p4SNyzMpY/AgrUsTqF6Jf2PR/ET6A+fSKrmwDwgyPbEU9zOPy0JL+m9MNp52VbCS8y2rEz/IeQThIpn/o5Pki3+xvAb5pcQiXNtETztaNXBsyrUJEQnnf0CDOO6HszKzclgcRlcZHU+gLtlwo8y3+T0tJMs4lMl0NsRHnSXeeZsAAAAAAAAA==",
 "cb_onion_whills.png": "data:image/webp;base64,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",
 "cb_palli_patti.png": "data:image/webp;base64,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",
 "cb_rice_papad.png": "data:image/webp;base64,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",
 "cb_sweet_chekki.png": "data:image/webp;base64,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",
 "cb_thill_patti.png": "data:image/webp;base64,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",
 "cb_tomato_chilli_papad.png": "data:image/webp;base64,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",
 "cb_uppava.png": "data:image/webp;base64,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",
 "loved_kara_murukku.png": "data:image/webp;base64,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",
 "loved_sunnunda_laddu.png": "data:image/webp;base64,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",
 "pickle_allam_velluli.png": "data:image/webp;base64,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",
 "pickle_bellam_avakaya.png": "data:image/webp;base64,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",
 "pickle_gongura.png": "data:image/webp;base64,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",
 "pickle_lemon.png": "data:image/webp;base64,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",
 "pickle_maagaya.png": "data:image/webp;base64,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",
 "pickle_pandu_mirapakaya.png": "data:image/webp;base64,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",
 "pickle_tomato.png": "data:image/webp;base64,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",
 "pickle_usirikaya.png": "data:image/webp;base64,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",
 "shop_gondh_laddu.png": "data:image/webp;base64,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",
 "shop_gulab_jamun.png": "data:image/webp;base64,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",
 "sp_allam_velluli_podi.png": "data:image/webp;base64,UklGRlYXAABXRUJQVlA4WAoAAAAQAAAAnwAAnwAAQUxQSHQFAAABoIVt2xlJ+lKt6bFqbNu2bdu2bdtc27Zt747tmTZ2qwvTle896Krq5M///4d7RcQE0P/rjnL32r2oarMobal48pIH5q3k1YU0pcM5hA5+WCuOiMo2yqMTZSuPv4YIr3/eu+LRC6lfvD6/fowmTLh4MwAOx0DKFYRM+GBBaR2YkA47f+intuKDm5dYkga2gZF+rJ7Cqr1n3v0nCNuvd1PW8KtgCMi41VVJFVvNToagjJvdFFTgvSDEZdzqph5Xq42fXTNFAXBz+LTRiiGi6Crjn/zRIwq85r+TlJOzUIfHbpliAPjMUBGRUXHBd5mC3G6lJiLK2+WlVGYBcLa5qoiiGx14yPYxrq1dt76wzEpN7GQZUfQBAcAAMFtiFT7FD/msc+0WIeRXpaTV9DMgs71lsZsCojDeLSWnggsfgIHNVtV8NQBhGe+Wkk9UbPt3GDm/z2tNsW/A4oDx8ezpxeRS6/n30hDaO9iagX4IzUD2D1uHNckvjRo/ItLPi1jR4AKEZ8CfcTRaDu4xPyNS5g0W5H0ZDs0a6rx8VcYv+ZzBkQApI3KV/6TJDsG9vk6r8v69bFiYPL1CZM3fNeFUxs1qzop5CZYyZ9/YWJCIDCKKrbLxNtgxAC92lvu8NTmDX84f0+b07smPf3MNYDj5QWMnxR0IWAfATGNI8esqzonbb7ItsmR83adFXmfUeMyEEhmBrFP5xWvZaPwZsBpy8kzhet1NDYCh0D/KijbOhFoZO0QbElAM8G6UWE3+gWrZuzZanMKth54BqwbwP9/OJUirD7IeMkO9jIzn2rsEiBl9HwpPf76pbVUfy4Laby7OY0v0qAtQPCP7ncY2VH8kAB28Pc+wqv0f0EKG91h5S4wlaWAtyPl5BQuMpT7oI+PzSrmKWuaDTjLez5ebEX5oZnBVVGT1z0A7s/pHFP8BWDvwe/lIBvigo+sjiP8AWnq+ZLimqXriGxxuOTR1a7gNuvJx3lAxL+rKX0VDFfxJV/4IQ/u0pUiYVbryVFSYdhl68nAMhS3wrZ5cKxeONunJHiOC2nd15E4tinSDqSF7KOKCX4J144+qkVHDv6CZKa0pt50y9MK7hHLtWprF+sDmFiN3ZOyDRl4oQ1YOC2rEBy5LKt3UiGVkafzX+uDraw1t0YczxS0a4deGo4ZFZS7pgjmLLDYe04UHta2iodma8FKMZaV/1YPMzmR9f48WvBBtQ553dSAwmOzsl6UBF0rbUuRvDXjEsIVWm8p7OIzsrZOgvEulbYp9R3mnDZtorqk470Cyu26C4r7Ia5vrtOLWkP3NkpV2pbIArtNK20AiNk1Q2NVKQhjPK2wDiTkgU1lXKwlCR5iVxMFVJGrJP6Hmj/MLQzOyWUVZ/UncvC+DlcM4FC0QNbgG9f5anoSe7VdO5mASO2q1l9WSPpVEdx0DK4SxlsSv8BVYGYw3ijqAKn8FVTJed5MjK38FVgPecJNDK38FFTK/XpwcW/lzsPzwtZscXHKrDyy9L+OdRMaUi5D+ZbejiGo/FZTdlVIOo9i9QZbbmfJOo7iDptxej3Ecuc/I7S0J0HSv1B6RgWupV2LpjUiGxlKfvI7GSYGMJR6wnE7kI0ka/X6DjFN25iV5llt7GxyKZZH+WXeSa/O3QjEub3nlks9x9w81y0uyzb/wTg5cakXRxRd5HGSmnf14UX2Scr3Fz36a4RtHOed5wA7wpf3y/ONjWpSMJXnHtxwWF4Lm/Qexs2/f+Odo33rFSaGHxGHO/PP58ZXLuEmxZU5d9Hht83o8506NGNKpsEFKLteq87bTJz5NSExIyIjMTEpISPzx1MnTu7q2bF2GlJ+3WrVqVZsvWL4s/IrxNatVq16Y/g83VlA4ILwRAABwQQCdASqgAKAAPpE4lkeloyIhMBnrWLASCWwA1BH23P9kuqfzvnDcp93frXUSscfF+ffPt6H9uT5lPPL9JH+l323efP7rgj39m8/fQz8ZPNnypRM8b/ZPqg2A2WLy11C8Lu0a2finZl/iHos70WgB5P/+z49Psb2DelX+53sffroneBUOYFawApq5kolbLcGhc6100eQLE3RMr7X9Zg5K9vNd2sHyADhxDxp2oySNf9wu53MbCj3ITIpnZboyrOqqtOYtuPCOMKttQBInuFwsbb4dvQdenRMBE8X7bFp+fjcAY7fKDv1ml32lway5f4aTFpD6ijgZ+Byb54nBawjM4WaBxJw7Z1/iyGqMB0beqAui2DJjQB0bRvqPofC1ziUlImuYHh3Z5Nnnt851j3NhFxKTiNIB4y/HcHhwflSu0A5MxbvLM/T3ELhLdWnc+JAeMMmeT1kpfjPuW1GXKIvCgtp2JnCQnzgzNsHvXxDMiN7sy59+Yr2CIw00KNDfOAN4ghTRZNV48wyLAf50wc/LizcE5DOHUsk4iP20LUbTQh3whd0otALtbvmiKNfM/RhNJIAhWZngIO3RiYvRu/hXLw2mh0B3ABisdUNr/Di2pM88jLh4rUuo0cRkJ8gVLs/stcZw5X+3Hha/Lq1cI7wR+C8PS0z2Q+qztWdTfUWOcg+VQDY9mdhI5S8uu+mJ8ODPt6WAAP78rRAAACva4NgXZiENVUTMwnYAZTPjxfefyzPTlzB9nvGwP3mK+S8Ug2e8zYkgMvQwwx5BnsS80BPCfCSQzDM0sQdl7B7+2YI1mUBEVffC4N+yybnht3CwMbfFxc95aLFfhY+BObVKN3fRb7mPTH4R17aZC3zFhadBKX81he7t/r8GXYUEzR7PjLNywr8dOkRCEjdU4ZlSYBueiFHchWMiCwpPT7TBGGrGve21I74SVYwTaOzOmHtIjpcyKCcI+pgdjsPoPdRvP6O7uZEzjD22moJlmg6w8ruofIrhzTaG4NoGkHvuID2KurRUSrQscdlYtrNJ/TWG1lRe4sPOWTAAas1DLy36XWxHqiU35utv5nxeTKuR3Z7H/Ug3WbI6cOf8kxiiWK3TlFNkazBktqqPlySCQe3Q6POBSeIU1iV8lXw9cYH0StyWKhA7QARLdraYlXiUBYRua2BF+xg7kr79lxYMoGn9OquZ4MYpXchd1E68GbIPapQnJDzchfSCCb14JbbsPJ23wHmgqn1nmY/uMwlQjbBBnFL76CQ2W08wdAsjnaNW799ujzVwXW/G/c1S5t0HWdyEABiMdRdtf9Fez/zozNZs9T2Yr0XTkI5ecYJ2bmMzTj9NXaueLgvM4qjWl1SvJAj50clX5UrxDnOf6qXm4s1/B2iZ/A79ZK6QwfAqYdWDGdci8blrsaLGjU+8koAug2XhpuX4DQnGTviQ1vq1hc98psLA96vIBKgpRlUmMMe+wqYGf12i0jvzCgb2kI11NKDZJIQP+4xFWYtEejiHx0h9bU8hOYPQqjXCrcS3YM92m4nhgAiRRRJlnUR7TJl1zgwjNfaVg6sqRlRNJozb0Pgcfnvo3vMYJ2n5D3GZ49ASv2ldFJEzMj+pCMlULaZpAq0vagCMDfP0cHz/XHnz2GH+/MivCdwPSbUQghv65IEuOu8Be1gvS58WvJjLZ8BnNNvX5RdNUfKbfUf3hrJnK6niLrbN25VRMYM7rXV5paTJI2U4myuEa0LgenfjyUMs+ZS1G17iyxN4N6iJ85Y9nD5zcq6GLhN5mwNk4ykUia39N94g7Fe0pzmdRodrGY7MznfxAlfW3wXbu7pU7+z4qlYEJLl8O4yMQT9iDd9u4W7YTQqrrW/6c8dgTnPxBYdX6zWgCtDREfmYg4kzFnODfDNktVeQnZEooFA1RNHdMfzk8JWPVyhKcp58jzHXTLR3BqH7TXSC67K+3wSkrXI2mB50c8qMZl5NE4x+itoVAT8zNNX7SRmjhcqUzgKYUlvvtxfarWPrcgxsnudpcgdSGNZRSEgoD0G2fNpN5iWQthIuDL/PU4p2DEwwXKorwuXpqwtq/+EJK1dyRZit5l47RLRHaKa+OQ0vNjF4b/etFiQ6rsHbu9iwhwc7H6XvYSHzOkMQJQZp5R3kv7/sWtlPmmLLujzBL7VakGncl02cgGwA6EBQ6X8+aneCyIk//UNr5TC7i6nA3zh7evo5pLNC/x2fa9/dk/KwAn0rsXHyBVdYa7g6CUE7ui9I8RXv+N/hkXIp5WcebGxmyJ+6SOiAvM1rwh3GN9ZgSvrARRTPqVz1dwrPnQVwloaVemPCb2FxlcZnwLtLoJhBlPANi7pxOYEvHBq8iuqVy88c3uPD2rtCODC9YIDuuWCuEYmk+ZWielLS5MxIKS49Pl9q1O3tgDfdqpQCIssO0oRl79VHVlcuYLxz7edZLZSq1WLPo3k4GwCWRqtAqEwG2HYgPZ6oYqgHFZjSFptEzNIscn93TFEJxZ52fLBWmEyRPamTLLgPb3jxVsbyW9k/cEPuGwdSmXX2B7EriMT9cFCj6vMdYCdqZ9qTaeqNsCPJST8sIW2fWzCLNM0r+mWtJYD/p2r9GTQif4u0eqj+V8Nux2Cr0fNI9dSsyzE5Dr6iW7AacZrnx6Fj29fB9kFDS9JJdPl9OoFMUOUIQfql92+DMMvJ41+EBhf1BOQnslPlM/nGG6fQGw4BkASuxbNcyeI2s297lx49DEKEoZosyJhObN6chdWRGy3slKVBEX7UmcwmdIfMN66mFY0MzxWWvnB3phGXcXeoHH33tKa6at9f+Rbg1GZ4wE7DW6aRjNXNCLgOO2e03DDoQubmBzAeraEXpFLT9jgPNbzN7nrJXmi5SW5tITWQ52aVk4C+nZdR69HwNS6YUxZwa/qQiBEnAAc62wkRHNfnHcbdYOlimB9dsZnoIoqQoNR1hDAHgyy7W4Znz/fleKMPZm6KjSEAOO+NZOjPiqTUWabPCgVUF5exYHzO5tVXJNSQl+oePD2JGQ9wd82FCDsjH+ueKE7yqxPb9GaLysCrlNOrwdctDHrUO5d30FIaA5EIoBG+GZoj//pqVQd6R0+OXujWvw5hKioU1v/VBQQql8SJCFnwp75RXA73/Xi4tG5AV9g5YkWkJGayUFcSsVbJe8KvCNK64Zbc78oU47yeFqNMTcigWc5xNOLq86hh+v4TjetFZiAG6n+KHLgGFYW15ZyyWCW6yDWEmKipz3O9DRydh/SNHknUKULbAHZ/SavtIH7rbh+ZkAGj2jqtakgr3jXfe1LML18fp37D98yHPT6zoRSuc2mDbOKmIXBJ9ESz3NBYqCXUHK8YtpEP63kBjS83xUAq9M3/Njg5DMQU0ZfQcQ7WSOiZdavWY3SIX3x05AboAWOUY9iGaVKTiyuktuMJvDhi592OZsWeVYb1ifKJPVDTfXcvc9RCZF2WiJRJ8iPg4+KybIJFY3wgzuaE3gJqyic3JH1yqw560/fzXFlp+j1xRjncggqueZLTnWXzURld/tzTfJWgpYt14s9XuzKgsQ/DDUFCotahIvOWTdTvPHWn+B+rwGQTKd94+RIFchMVV9YojzIyR8NGxvPV+t5+o45xdi0TWGFEYzxWfgqoVw3OqALC9gfyh2vsV8u0h1yQET8otVEXi9i5C1XaPG3D8qlq1X92xUoN3LVHLAI9knbp/XqLhSoXFk+jXuponDZFHv4vUfXmvmvzecZctU61K7BP7UTQj6BT/gyHuscAsBC9WfK+IZNE8rtJVMIPzgPdwM2ryclK02hhBVkuEnMlkjIzTdYdOpJ39sM8QZ7zVCBo1lj3y0TslhChCWTwkLv2eeUxSREsmwx6PfqyZ8zGjjs182EPBLO/A/5iOYF/Y5h1rv5EGEyRPgJb4uzt1NDYADZmdv7OxElVRWiiuU0QfM9nsNusInMdTsMdcs3tSpKd3eDMI/yI6KVM2KwwZjUuhRAowFWkc+UYa19VwZSeC5kBGcfeBEaYiu/orQNOqfbV9saE5ybXMhFlJEjH3khyg6oeWRQGYRyVG4RPO9JwBy8ha2fn4ipLkfStqfcrRWuIRDtrU65k8g90pitIVqodoYBGERcz26PwAMvBJwIOFPhSi00aI0wMhsYuqqZPvG61D5lJVT6/iIo2GcVbjrdqCLwah2V0SFSxeTCFjiu0YE0DX48FHKVSIWFn8lFyJdmnL3qMmCxqU/XHn2ML8rSk+AqBTPmP+S9QH3uUXgs8NVfA4dtvfVQYBitS+MeHC0WFxzGhFPupG+3gCz3mIN1ZO/z+wmC2H2dWCURugGtMAybZzTX4zhDdjP+EeZouHg9diBYdf9aUsdkqMBYUAuBv5N4XEbvZ7TWlVc/SKXnHrwwup9y9cQYmIn39jTUR93mm5gxK6RK1CR7F1XvnITMv1Y3mkFiCclw0PvQ8Orq4SVHuwpQ9KM1Ir4Ee88M0lSwFiXEjDVb5/hf/B5ZS/uHM0O+xO1eXOGhvC3ANgusBbaPEdThHb4SaGvf4Ows2kat9pGli/G4STbHRQkYnfJ93RQuTYiRcVl3SPHWovRfQ6uNwWj431Tju7NA9fPgV3B7pVnTt9J3NAN0sgh3pEzZvUbLlll7xfxrGvf/zx6e18lL0eJwt2daOJSqI6VRQ89zk3HifPgWW2Tt8y3lMh/zQbIJB8M20A6WHIB0EX/zKBwbZecnCz0lSGQla8PNbt/hko0fG6nl7PSr9ETky1BV7xaVjWL81JjLrBUOO4B9kaKHhdRDZVTPSaJZIZF/CzwMK2VDWDePqJMz5se87WOb7gdR9wYebome7A7uN9JCElErF9IqImxHwgs7j9w5CFXNQXypV2xm8BRv2X08tzlw23SfqWIVDcnCz15ahlu3SMIcuszR/L64CpaBqFgFIB0IpwGqfQY1+vyapabgCMTZnKMMz9MMVHaXy7+twseKIExmIF5DUwzLKXW2L2tSa8Pim9/5mOFckW53JH5sW6dAzMz9dlwC8jExkD4v8AhSQZaqFovv8eCzslCnxlGfg6xUAHdHbEHBpb64TCsba94uUBOWVx/otj6StgyX71CuKnWz8CJHnUky2t7JGCfBDKNE734RXFOr/3cTD+KeImjw1Hlm/7+WF8gUFKWpRpQObD6fy8SjP0Mhp95j04OgO1Rr03SfJSghqZGzNIb/64s1Y9IOfNyMQipql+XJj/giPA3ePw8pgVBH9sZj0y5XIZStEYHKjqSQiE+CN8XDaILWEi36g+uUyRytSMVsJRzC3dwqligZLjOc6hVLKQ8Vobaly7AXDIKFp+A3txzpOW2nJT80IqSr71XAOswYjym9j2LEAcxBvoSkqRbuYIHZUCkkGa6bcmybIoHqCXOsRhQPKu5/zQTa6VUensyVKIG/lrTPterFkfIMnFbk0OktGd/iV6wW84YHE3aLCunAZ5VhpRow4r/CHW0H+VRrE8UyGseeoJ+tOIpFMcGeqGFqTxWaF/gnabHqRckGxiVZuRWr9MDzJwGxGpylK2imunKQ3vE4HfRMG88erG4+Ep5WtImnxlqWOCFAim8J6Q8GK6ohxVahONAALBOjwf0RtFbBei+QYjq074zBCDfuNy2HjVU2XDNmZVyQuAY4nTb9gREN8PNmzOEOONIIOVrzpWQr/MEdXis8m8bSUV27o+FaojFQessSHwzgPL/bm4YVSAt7BHovdodLeRE4XYzwBwwJ9ga8SOOIZ7+ZpPSF8qipCQT7OKwVhtF8XgDcx+i548gMFw28vOF29ykvN+SU8MtBXL0riDsDfvv6cey2TKvJX4eFJGBVm2H/MKpBoctm/X7FrVBEuEkc70Dv0ahhWQCZma5E89nRt6KbPnLK/mrWlwI3RiKqCtP9PmGqDfFShTv10khq/Hv7I+DQ8VhooFe8VbY6QBFfwSVXd1O1ysABxODFAp+h75eNBdvP5t0tjd8BDWWkEA40V5a74ECVry7IBDa039qdJgNb0N5jlxwf+i4srifYdfHi96Ryp/4+EG1jykIPJ7T4CqLt/BhgY/ucuXQhsAAAAAAAAAAAA",
 "sp_chicken_masala.png": "data:image/webp;base64,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",
 "sp_daniya_powder.png": "data:image/webp;base64,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",
 "sp_garam_masala.png": "data:image/webp;base64,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",
 "sp_haldi_powder.png": "data:image/webp;base64,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",
 "sp_idli_karam_podi.png": "data:image/webp;base64,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",
 "sp_karvepaku_podi.png": "data:image/webp;base64,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",
 "sp_kura_karam_podi.png": "data:image/webp;base64,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",
 "sp_menthi_podi.png": "data:image/webp;base64,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",
 "sp_munagaku_podi.png": "data:image/webp;base64,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",
 "sp_mutton_masala.png": "data:image/webp;base64,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",
 "sp_putnala_podi.png": "data:image/webp;base64,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",
 "sp_sambhar_masala.png": "data:image/webp;base64,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",
 "redchilli_0.png": "data:image/webp;base64,UklGRpwGAABXRUJQVlA4WAoAAAAQAAAAXwAAOwAAQUxQSAcDAAABoHbbtilJVn9CZdu2bZtt27Zt27Zt23aXbbsqHHHWh8B98d6JiAkQkRY3Lhsnlo/8YWfiIcuGz03t+Pwgw+o99ueSa1uJ4ft/9v0hYvpzP94htv+56FLjFm272bh/dj1p3Ac7fq5n24U7toyzret/PB0xLXR1Pn6AadJufu6f1qbJZfE9V9jW4bfkhsNMk/3XpDcfY1qVE+fm4hdXM0xk8NNJPtqnTcQuqbnv12TmfHD/Cd2tEmn0RBpg5421rZLqJy+J50BfbWWVRL9AVeGbdlbtlShQ5dNGNtV6Gy3OYzGDGpz+QaqM7OVhc6o/C2hp0leErJmeRcsmfYI1j6COrO1uzKtOygd1bdlfcdH849VNqfmRGzxY0xKZsgsXJX931JLQrW6K3lY1eJ1ml5C674CLovfUCtrQ+btLSbs/3BR9rX2wBi/gyzJk9DacFP6fGqR+80kcUo6csAcnVbYeFZyhc+DDWmXJmWnclOQlsYDMXAHx8VJ+9HpwU9J31g/EQRtRng47SOyaDG4Kn3cPwMm7UFZ0F+fY1RncFOYf6LfwGbtRuEQ8DJ28AzdVMs/181Wj+3Ko8lN9L0SO2IYHCmvvHhLyzbivQZWNo8Xj/TbigSps++zUTjE/NL9+F6pK9mTxfO8NeKEA6587uHGlah75N2jBa9W8k4nzwINCSM+5e0z9CjQ/9rs0WsiCLlLJLm+DN6pA7p97DupTy4uG0x9cCmgh6yZIZeuctQ68UVUgu+rHx8+d3qVu1UiRcLRqoyk3/7EbtDjb95GK93lb8UpVKdRdS75/7bHbr736nufe/HqlAloc1u4vPqxzwQbwrCiuWhrmjBN/9nk7Q0U8J/9aB/FrjRPmAD6DTRfWEh83u2iOgp9Ivz1AfN7sjF8A/AH8cVRV8X/Dwz/ZDlQOsn+f3kSCGR562dc7KPQMIP7B0fUkwPUHnvHasiRFHSi6Z/4do2tJ4BtOuujlX9encY2v+vnZs4bXFiPDzQfvc+497/y9Zms8sXPVgu9fuv6EKX2bSkUBAFZQOCBuAwAAUBMAnQEqYAA8AD6RQppIpaQioSwVWqiwEglsANRIUUFHznmd1n/AfgDjkTcwkNtN5jPsA97f0gegB0h28UfuZ+0HtD5oB/IOsXjy+phqctjSQM3egH0nDeT3XvldOiUiyujPPiXYtqShMoSKL2qlU8mlu6PtII+FG/nbNb05e+00QC5CcUyI4vhphxopTREZguMnT3OOnBasmrdpqHbil8DcQAD7iOqFFY+MJKE/klJew0KyTpVmOCCwQVbP737cojLmRukIAr/yJ8WMGYT/seTfSdAo7ngieDaIIzoTFIM25cpvUDysRUzM+FRFP/lwjeznL2nFTQ+8s9CdoEiuqohtjmJzy+v3io1o7FjdYGYPEAxH7eAqoSYEzUrEDlVP6b9qWSAqhKGArajjmzYmzQC79lV7wPcEZC3PNFQO+ZSLH3vCc1DpNmzbmnWDJU4D4CVyfvi12OJ4JwdiFxl8uAJ3D+jJdhWJTKD5UZ+787cEIgKnnYmpgg+IEujZi8yCtEx6NNxpMSfobmLrIiRZA7fUQ6lrA/XuiI9OSZR0HCBUQDZZqr0s5hCnZFeH4aCTnvi5NEs/OVCraQs0OB/THOacvgGA+g6F4JdZjEtBIFgs5EgClKLLVYnDodBQaJfD2ZcTq4Hb7YL6Cg5RuIo4rQktjM5hoQlijQ4bKDBj944aJd0QGT8SbFMZpYXEiMlIVsaLNXtWNUEU4MMDUwkbuYPb4oM8knOiogJ+fuEO6LYmivWbChr28/2H2NPbxytOIISg/7X47gJqufzjIenVNBV57oZk+5GFph567bGqmKR434ryVn5urZEYizImivn3KtQ9fD2xuFXtcZj9b3DIX9+vBEwx7qD0ef8tu51UHtrohRDeMK2bgf4g6yU3lhuufBG4uyTgH0RUQw47AT0FoageC6NaQwVHVW3dF1ODkh0P37XG0lLYcqKOCeEPvKJNxJBrg0K/gWkL3jrf2LwLETMSOGuuCUdi/Jo1ljJBk7CrlQAatX5+nRBndCQF7mhguq9SsEriiY0Ahc6gUZ0IYZCBYwk3JG4H71q1Y4HZXs+HMvOJL+0ZXAF+96UgsYc2tMQJW7YI5ItU6DmTS8g9DCE/LLTxLIeg6Z4w4ohnL1sw5J8MlQRNIZT8CnL3Nib2navUP0vuTA+6uohKAAA=",
 "cumin_0.png": "data:image/webp;base64,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",
 "urad_0.png": "data:image/webp;base64,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",
 "chanadal_0.png": "data:image/webp;base64,UklGRs4KAABXRUJQVlA4WAoAAAAQAAAAXwAAVwAAQUxQSMEGAAANsHbbtuo28pLWvvc+kOxwihnDxcwUbOb+ZT36WzEzM1eFmZmZEztgSe+eDwLLeoqICaDzbMY495epzmPRrMGhr92prRGjT46f+MTNpOH3MxggXHH93FqkVqzf5E5eKl/y2CPXbjmyayg6YkTgpGiaMs3b7TdeOLhn08Ghct341NUrDlyuY4VFTAiTJK8YXFph5q0Dcd2+tSWa9q8D62qxUSuimSFwgBBykvOpwg1TZuf1Tw6fLMkd/1p+rGjUiiJGTCBaCiQkuRAUqoPTH7QNX58ow/S/rThKvR4LzABkIIEJAxwCF0KaTBp//40jr+7ouel/XHbYRmJRgCG6K3AuJEnmbxz/4KEti3tr/J9WHon12BBGS7WwzppN3vk0Ddc/khz5/ngvPXB5rxr1AgMQgAmM0QvkfEgTrp47efWHsWd0bX04NgpaCDBkdFMAQi4kqW6bk/6wpVeunLEiNGI0RMfWhdZC3vs8DD567Xere2RiMhRjNKwjo/sCcD7NwjXzD3003Atu7rKRRowYIDAQxlhLIWT51Y8lP6/pgVjxdYtYFIAAjLEVzS5kqX9i2vLvxu529rhoZqK1yehBYd4nuZ+8cOcPF8bqGh1TYfS+w1yoZOP/mLx6ZIwIitHUifWIwHzI0sFps944OjYuiYUZpRRyaSWb+fBLh8aELMaIqZX1FM7wWR5mLlj1QTEGzyxzMRqyFr0tAylUshvvufROvXt37nSFIbDeA4Q5n2eVZy5+3OhazBpGqc2FpFqZd+HdolsOMAME1nsCkE+zytyh97sFIooSC/B5ni0aerfojkwA5qwsKDqFNMsXnf2g6EqzDBmlls+q2aLht4tuREkAplIYCKSokOWV+UPvxi6YtSq9QppWFp1/pwsjQZLKJ+TSvPqn02+P7qsFhRz9IBLSPPz51EejOjFJzoGpZM0upHn+p1PvF6OwEe8lDJVP+DTP5574Ko7iskKgLwojybOB+5Yd7mwnN8upLzQ7n7nrn3jrfEdH6lf6hNIKrJ0MnHyW3z3zpfOdsHjmQIlGLVCouPsvLu5o1+QB7/sFmAtJxl/Xre7kzKZH8Zgw1Acw75NsyvxlKzuonRv0KcgoqcDayQQuZP6q6d9eaMee/Arn6I8yAO8r7s64ooMtg1c4H4SVR4A1gQkjCVl6/+9D7YrTIc0D/VRJ4m7LVhZtLqyameSJw1CZhDVJZpILofqnL460iUsv3F+t0E+FT7PBR74easX5z56elPnyCayV4UIlPHxqeRv2r30hpOXr2OSz1E/eW29jByqVzDuH9QWB4XyqxzceasOvE2/0eWJg6gOtXQjVh75oN/Lu/VcNpMLoC7ImF9KJpy60Yempx7KqDNEvHc67O5M11oZPBh8OGSZMfUEGIR245/eL7Y6vvr+Se8nom/KZbg2r2/F7nOUrGUTUJywk6WDY30H9g2k3VjNniP5oeJ/E+7afbGervvvvxMEAYCqdMJB3/oqjtXaw7th9WR4chqlsgEn4EK7b1gn/nzE9G0hQFH2xqTptaUfD382aMFiVgfqBQN5dS+e/rZs3Jc+cwFS+ZqcbrTO+3z1vQp56RVBf8F7Do+CrnQsmDFREv1Sw2aOJH+/626Rqpj4hiYdHA19s++tgJU9EVLkEIO8ao+PzLX+cNC53BipVs0leXeDLPfPHVTPvRETlQqKr9vn+5yZnAwkmSi98N+CLXXfeU6kEISuXSaK7xY+/zXk0HUidMJVJZrLuwOmXbnsgreYOSgVm6hbnXpzywJVZFoSBymKYxa5x5vWhP1+Z5cFhorRFbITuwS+L/3hFNuAkYSqFWVFzO8aCxb8uvCpU0oCJEhrEen146Ziw4qtbnq5UUk+TeskALDYatjWMDVu/rT92U1pJnKf3rREb9ZHljHXt0/VP3zQ+T71cK/WIgRX1mi3Pxgx2/u+6P45P08R5SfSuFbE+4nfvpBeLL/bcc1uSZkFyJtDYGViMtUZj42nfE/D1koHnrrM8Dd4J0YMWi6JWK37cQ8+e/nXn9Q8nSRaCl0wg0OgMrFUs6rUaP16ml9f+fPip2wdDmgTvJNFVIcBibNTqI3Hvp57ebmz7wN9z50BIfOIk14nAWgDCotVqjUun15ym923lT/XZ0yu5ksTLS0gCDNTCojXqjaJ+6eKWy5sp56V1PxbVR66vxNQrON8K0RwtxtpIo3Ho2JYhT3lt1f4Ng5MecZUsGMHhHA5ijA1s5OJF27v1ciFKfmjtvu2XZ06pT5us4NXwEH2sNfbu94d3jB+kLzaO1RcfqFtRr9eunWsWw5fHslQIIt0EAFZQOCDmAwAAEBoAnQEqYABYAD6FNpVHpSMiITVWrKigEIlkAMUMHQlf2XnP2nvTBfYZu4U53Lz4756K/z2lPWfQADg/pFprw7tvj3Io9lbkWCYeM2yfVtGjNPAd6umOzbzL0U4uG1S2rqsWVL1SJ3FexX3Mlex5LyYyRBuuuZhoVJ9y5RkUOA6YwOojJW2VvTWP041dZXYBsiYBzI8V4tWLs9FTZ4WrgYhoCjwQAOghvti1uSUHKYe6K7MviXBjzMg8c/qfnir70PWdL1G5OlHyOJHaqQCjZsOIHO7KN1Y/wADtHuSM+a8Q29jMdgg0x7rOc1zJCJl2p2/ShNu0HO6nnkUrT58WAhwVoxuq70aaWnHnIe4yvaPMEzGQwmbTeDuK9YG/tJw3oYqYYuNBD4mp7b3SXFNqf485A6xI7obiuSY4iuORQXGDZ4T7HKuwwlyaIaOygmraX1v6V8pFLCWkTXiGcmKAxtBIO3dVTEomg1WZtnIO2Rd5RWSHkcaPQxs/wUBLmAtkmELrEMvLvS0PmAyP+IzIUYM/LUxG7wgvxSD0q5587/b8Rz9TmgUqmv7gnEG7Q0fDUD/pQ+ixDOdB5tdycgTrLKwXxbIwsIQKUnY0H5kXmOL1jGo2vrITmVuKQnziMIyv0+BdgtYvJt3tKps+eafx0BCWW850krRivPXjH1aCz+ZnvnX/+xHf/sZL//sSXd6/WpWPDAMjdVAPOH34djLzayy/tVeM+7RSfEPLrcCzpQg+wdJB/6bn0dLQDnU+BWVsyorLue+cfvrMy3/H/BUhZSeOOWS/ZPHDeDx5TE2rHIURbIf9dcO5mrW5COige45Nf6y0aiX1dmqX0jc9EjIjUoXQdsqEywLoRHdXcEj9OM7Xv/WobX3dwkdBQdGgjUQ0+8F6rAKHJYogJs5dYGj3i3Q7ujxE7kYJUrQYvLBKPBIFXSWrh6OHPwTISs7rO773Z5HxxAGvE2C4N/ApZw4H7ZkCLcnfE1YdtuxGmHFla/Or3V5/4ucoZLXBLzSF43Yfo76rrBP0OIZXA2huAsb6hB73XqRPRWDqLJoTA5/yZC+IAQ5Qq5GVSC+1AttaQ9PidA/YNKRkspARog0eMGNKRHIdmB3I2FNhsOXxAvLP8wJIwAbxItYyKV+jZ6qZIEQ0u+qVA8Yl9wanZloMau8szn0PsNAIioUgtk3X/ODFN+7Fomqun+wz6aAyQP3R00hq6ZC1mxLVPdqO8A/l3+6+eHDmCwaKiuEwobmS3LQVkaCuO+GDnQe39p+3kchRaf65D9IvMrzN1SowMU7Ak8iv4ifkmbiXL8rzcUFODKTwf0C+imGQAAA=",
 "curryleaf_0.png": "data:image/webp;base64,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",
 "ginger_0.png": "data:image/webp;base64,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",
 "moringa_0.png": "data:image/webp;base64,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",
 "coriander_0.png": "data:image/webp;base64,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",
 "turmeric_0.png": "data:image/webp;base64,UklGRmwJAABXRUJQVlA4WAoAAAAQAAAAXwAASAAAQUxQSJoDAAABBoqSZJu2rc1n27Zt27Zt27Zt27Zt2zg29jlna80xx/Vda8z1AbUjYgIYZ3GJbc98+MPfv3rp6fvPOmLTBSbLpO16t/05JDq2jyr9TZ/ec+wuy06VJru3KPixxaMehVrrR5dvPd9k6VA84D/1E62AH/juzr2WmjS8wik96uNWP/TPq1ftPFcurC261MevY5e/umylQkAzPiEkME7F//3Q3nNnQ9m4QxMDhfJ3F607eRiXR96k4Ct/PXjgsoUAnnU2APFUWx/aKGvu+pqZsZV/jpnW2h793hkS/OAj8xlb5mcXiR0QX39jE1uTX1KqOUuA/H3eEpMZYq5PKpExpPLrvUfttGjWClv9VXXGQBlpeXNdM/kDm2rOGtIo/X/rVFbIH/zrSGQvqnbctawV2ODjmmBrnO7X0xazwipvRYI9pfH9/nkjLPxIWTAHSvdFUxthxit71Is5hL7LZjBCceevowCA4RdWNgIrvFBXwR7uy82sMPOF/6sXe+h/e2aNkN3klZILAG3awwrMcMjXNbGHNp02jRVY4cWy2kMrL61vhnlvHxTMofxzwkxWmOzon2vOHGjtpRWtkNvo3WGxJ77+8eZZI7Dg42XBGiBd509rhXnvKyv20NKNs1th6v0+q4o9ofT6LlMagQWu7/NqDVyt/apprNB4ou4DFEaum94KGzWFAFq6bBIrU9wtGoJELbtaYaNGEEj0xQpWJr2jEQQyct80RljsExcE0n/hDEbYpkklAY0Phu6Yzkj28BavQWj19JwNCjt84TW2REX/380IzH/Nf5FgDvTfHayQX/+Z/hCQz1e2AjOe8KdoAOW3ljMD6zzeI17iUmLClR6eyQ7TbP1Mb11iSrDeceYkdmDaI381J5VvNrAE23yrxKOx4bpusMUyLwzHk6CWPzbGbBe0qymqX1mDHT+PxI74nvPssdSLNTWDfrpgAMx6aY9aUXd1MQQK+/6umBD9b/VMoGu9XPOSnPjytblQmO3uQScGPpg/E+4MF/VGkpDo4JHZgJj09PbkvpwjE/Tkp3VrIuL1rkzg2f3+1yTQof1CI7dniyYg+tMiwcHmX2sSd0+aAix+X0ljEnVnZFJx8n2+lbj6dksHWPbFusbz9yppwewXtamXiXL6/WKpAWs91ON1YkTfmSFFmHqrxzu8wngE0LtzaQL51c969d+hSLzgaESu+ss2mdSdaaVdz3rw/e+++fbnP355+8rVcuMCVlA4IKwFAACwGgCdASpgAEkAPo04l0elIyIhMjpacKARiWwA0qkAOpqrZ5LzT7U2UAxMKbbteYrzhvPH32Teca7j/AeDflY/7XY72fkEoAuXFdDdJqD9Iv9w/Yr/TMR8gPtcQFWpVRk34ag1DWSedd9pdhV9hYHZvthBapSc9YrMQHSHyZcj0LFrrEdJY/nVUbXsOrhubwEpfCutVqRCPIxzSGnFWMBlKJS1S7d+TiR0ZW6shxG90KS2gw6KCxlOinTL6s4tybpOGmODrdFhv2ordtOVDNE0VYISWqV8DomakNpUhoAAzFUX8/5LgBDcCb0caT3kqGx1h8Uls+dLeyYi0xXQbA2EL7FKwAkasUOB5GR/62OSxbpaOWH3Nm/Slv8DiqxdopGd9OV+LG8i/Y9cd1IoUxh/v79RqFc+RQ4VnX87AqX4Lqt4IVAeulJyi0Q998LtogUB62aCX4MEFXb1kWZVo38MlIkfcfki+qfvrmfZ03Hy7cgc4FCPhGvAx/shiICaPECKiymB/mO1VtIcS9N5VJC9D0xtThfrK8tvHGRujfiHaqQtk92pQSXgeIUCuaQWpt/Ht1yyJDJgTmNEEZ62M7G4iAP/AjVjcMcHzsYXsSde1VWdTepdhHTr+A6+ACr2yswtaJHrZbf1boPA0KDTpBs73/c/7fuf99U9Qg4+/u29CgClUPqpr3yqqvk4KgLPxHzyxz5cq/sP8FMcNZGH8XOU9+UEycYuHA8wJy+yMeQ1FhIq3gOT4iXgBm/OK2p4raBqzO826K4DGclQ/Wb26WKpGGi5tPGFzTvflnyP1wGigD7yssX/IYviTJ7Tsee3RTUBppeN6yjnlcwjefPdEykGwBcEvMHG46Mocw3p13KLvDlpKmXPGt49UwPAs2xVj89W4abosl9Hc+eH3bRI67hsU5GVMDMmlrCwYjoK+j3YnwyR3lNQ45EcHOT97orsvOz0mh2UgIpd132keNnqj1NXZLGWVmN4fGRBBEa2/fqCTwoBUbEgCZdXl9+TsaPXWtYDltBXH/7Ncn+phJeSnpQbqqd7LBj+7Fp5H9A3NxV1q9KSq4TaokF/5fbJoVjxNc3BBaY+SAbLZScsjXJQZCLY5sCqVpdoV27y/uTT5u1GdlWdTjO9nO9SDZvJ217gIeWNPkfYs1FOc6W5wDzq2VJ+OAPdOqbS2ndaTEFiL7Tdgsa+As0kPNqFdKJRGSy/8Ave23UeaZGpHysfNMenFZSuSp/v5E3NqQnZD19EuGdeHQ5W7KwrG9YGdBaOUJXALPuVZftwGMhcokzT7UdSd/cQo8C8H1gANHjaJCNFIMzBMEfuPYPi5eTE6FuTZpspAgcM95e0PQl8TZ1SHjpKGxv6CeG/Irw+j4PH6o1qt4sJgRaa9ckjbGvLA0R2M6yDR2tix2onvKSQz7ZuaL4uGMq29kMz/PFi4GCADBmvyENLHbCadMiId+Spv6+VuhisOz12lvtD/RmGJoCDCm/bRW5wuZwSI5ZzQMVpZQTnU6ozyyD9/lKttTxuP/7SPho3gH4eSuuZ/od4o490klfZoHS/1nOI7eVu8B3fGjziKi9h8h1jPXQZrQTZ9Je80K7K5RfjVRZTR/I1PQYGMGi+eeMk7XWACNJKVMRcf822q+xitmqI9UX8VMMn6MQ62KYE+MQJe8EAtee2jbdTnV7lNv9cKT+hWcLtNYw9OfnyLx/mAyxGeTqXrhFlfVX7NpZCmljZ3W2T4wQRy3JXX2SwucmMaSAMXeamiWRh8Z0FFekpaviW3WVgMQfPPsB1aO7xCh8iglATi+lZWKFHT7UQoz8gqDgXTTA4tbhbGaknpwwHpqYpX3g4GJJUR9V+ZYYfs7CKteoZpkQHl2F/PR89rlerzi/LiYVWI0/NnMt62oWZvsy0+shkHvcEETd02cG24PdE8rl4rSeDk04AAAA=",
 "bayleaf_0.png": "data:image/webp;base64,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",
 "sesame_0.png": "data:image/webp;base64,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",
 "blackpepper_0.png": "data:image/webp;base64,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",
 "mustard_0.png": "data:image/webp;base64,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",
 "fenugreek_0.png": "data:image/webp;base64,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",
 "cloves_0.png": "data:image/webp;base64,UklGRoYJAABXRUJQVlA4WAoAAAAQAAAAXwAAMAAAQUxQSFADAAABkC1JtmlbY+vY9rVt27Zt27Zt27Zt27bNjbv37Ic1F+5a8wMiYgLo/xc+npnEXtozWHC2/Q8KqvK1hqdKFIal7C18aG1SFrRq67nnj1qaBBH/EAy/pxQMkLMGD4T0Q3YxZJr5E9KvpzvHmYgotvbWK3/AAGC2hcgc4G3uUcJItu1QeHNKnnyDr7sh/yYNpZh+eFPrB2eDDWEO9Ksys1fKeUqAb9+g+FWKgN0AXO7XqQxR+dDWv8CVi8pUOgZSsb+QvktnBK+N4DPt7lVLPRFctjxEJyaJv5kTf1tGe+b8+eQDD9iaVR9UoGu7UZuiOXF3/pva+7V1UeAZAHc/iyTNY53hx5g8ATIp6iZo1Q1Se0MiyrbfrTfg+7H+aUPDw0Mr3LOX0ShkBwfbvbybPoAxn127fv3aZzhmhmvThDHOoVSLHDA2w/pILcyzwPt8A4ZnGKxFobcQ6UwN/DZCqLPU+U7+JxRXO++yY5qYlfhNZxCpc6jXpH/4W1nORJ3dECf7fqSBLcNHwNNCjqq9h0hXhBK1YcDzVBJziImqvIdI2Y8tyajcX3xrSWYi6n92xtQPYCIBMDIs2w9P34i205KI9kDEjks7HJ7L1z2nA4mSHxMRAAYAb8fGk/dWQcnuimpjF9uX/BMhZb/tgnqVfTQHByY/feYQ0amQubxhltjUZ0XD8On77ylXJb/PZSfyPSCar0sbl1s5peakk8v7lQ8mopDTImH37zs/rp8RT0QUbCOyRedqv8suktc5khXPEx1hlRBR4LQbXyFShlUmUp77FwT7IhupzPRaNBcD1Zi7iea4vxpKNn3ujHN3fnpcLpfLeAyu1qRpQHjJZtWqVq3SeeHWV4Z4vf7Wdw5+97doo9Qn4+DdLz45tdp7WatTYfHFW8ze9eL4kPJW0qElZYHb2jxcnmqpklcff705su/M52/ffrzoYSEiMqfwJ71mf6+GAWDs0pBcj3kMtwdkzl8gQ6BfWPZcuXKnsZDec39Sw7fPbujmYX1qMnbgbjnH4/UTa7RdtHjx4qWjillTv+bdTiJjZ171iHdrQu3UpDRi9i/eWrPBSn8C92FWUmyikn8gdfydZjKYLU+/8WPHjp1QntT6tT54787du4PrpyadAlZQOCAQBgAAkBkAnQEqYAAxAD6NNpZHpSMiITK7aZigEYlsALsz6MTEmi6tjmMBcC/zfqw/wG6w52702f7vfX95k/wNfu/gPA/xY/Bo9/aZAjZAvF5MhcTShmSnuG1DOk0wREjaYWjfnkNbrODQnyo5xe3YSJ35DrpbdFtdT2w2kwJhJdGTjjFq593yWvm2zUEsXhda8Y76u+Ee2Ax5nVQ2sUMTaGU91M6ikFrPfq5IRZXTKDr8L5xPVgnLJBYxOoOYgK/oyucbiaEGXVZ8rsuTap9p8PPgg6QlxqagAP7/nRj/7/oUDXZbhzY+/kAewjB4QygNaQL3uWe35u/1l5aqV/Bn7xo1ys97W7aErjeCwQBCSbT2aOTGcomi8+szO6MSkitt0/po4jp5DgnURPj0ifvcyvktnZcFnS7FbYxgl20qhUlq7Pboqxu5Vc+CZIHkfXpgmca5tVjJBor1K6ywrzy/07gjj58J54MuFM4L5Lkpepf5/c+Ggf5SF/GKbpnfmwxJBOO12A4zywz1kK10vrMR2dtj3fQwz4e0SB2k0MN0xdgq2N3bdS4snnNS52Me+Zn/n4KveEpTkS/uFjHknyhUYJ+9pRPBEQrXSntRIAMKrDHw67In91gylkr7spjELzbDYNSa30QvdypeZ/yuqO1dPjjhH3TBaaBHbuwK0rV+QgoDn1UM/0/7BEBX2MMn009ZEf7vkqqfZkbXZiNFTEL5S5id9xWWB+iCIAZYmuVM7hX1GVz9h2J5QnWZP7ENfE3m55uWoUE2V44c7vvd7vhKsim47hK21tUB+X8wl3/20lSrd5c301or+v9MrZKTiyHB5Mf1VgahSv4zDN7QWhmUJq+H8gzZLP27SoWRWY4GWK2r0mQzjtJczhp9rSBxxmkcP1RM73eQLK9BxKrLEIDb+9tt6GD4hH/Motrb2DEGJLT+LCLCIIGBux4016FnnJaalbIB0RvlJ4PCJ+pX0yG6aOzyaQUF/iD1rHS8Y9elgjRw3Z7hLvpzXy/fqBQlzV7lcdFlS2A/0BVtqg04aG/k//PQHVt63zGBuSvU2CZumjTr2lFM8v13PqKPsEw3cfFcUJJan+7lxqHErooJXGfxMqBqvKSUiAm9fRAsJ867F6CXx6TT1Tmhg2FOTwl4EoNeg9i1MchoAVsSof5dqqSTZwuwIvdY8rPViACHKKQ75Fd2JQFrhKNSe7SZ+lQmdq1g0CFSl1PTChYml0UsEjrGYSGW56I3eB0lIzmnLLCMuZuTVipHdCHOIEwFgndvRt5kszrwRhR2hFPYV9kVQblfUi/w5wUgKHchGsTx12l3wynMw3ztaJmQSSpp5DWTkk60n3G4SuEXeHtSehpVwKByzgeMZDtbj4fvuJVrntNuYZypIMohLL8od6nnIl5OBcpWsh55eIW83drFpic/LoLrRMMy9QrMpX9E9cwHoyA9fPycnHOr4ditofFTOZHUj7j8bHH+LVawgB/3al8KP75rVaiF1c+1N8+W5gf9XDB/fMsKXz9oNNPgJ4Bkh/GwfvinIhpFjf/8J4EpIK5m6pLxbfkFGz39hYbHEMir0i+NgIdsSQ92aJ3lBE3YWZscXuPfHC4DY2r60NuMozzdhrU26GkiwogKv1jnJl3kivV0k9uk//I+L3h/cRK+PoQvMFYa3T4ncRiuB5X1G76gyjVqLVRB5QH/QRSsE+CLb0moBnREY+F2Ou+oZLITrJ4TTV/x3o3MDdwnpxkgTsLH6XVH9kn8kJckn0x4/VTEWRpZWiOvUosrG18KA9KxXO0iGZI6+x+EFA38KOkSoAHS1f7OdHpfxO5QaX5u2h0RKXgDtA8wK3C9eN284nxMOd2gHxAJiME+Zr14r+t0FS/Mc9jXIuqbwylOpRzOLzg2ml4z7qeJdx9ukTu1Tf3pZ4fkLMQHbx6KYUr6UhbWHVZus1UicbrbIX4fgIqAuvDx4EKGsRJ5+1cbyf5lZ1Jc7nd/xau/dzFJh4SKw5+9COn8T/5l///ZsSKP8OkYhqJ0E46FJrS6UYo0Lrks0gpVhSoJ2dBN7yvXwxDV6+/+6AjUAEdWAAAAAA==",
 "cinnamon_0.png": "data:image/webp;base64,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",
 "cardamom_0.png": "data:image/webp;base64,UklGRrQIAABXRUJQVlA4WAoAAAAQAAAAXwAALgAAQUxQSAADAAABkAVJsmlbc3zt+2zbtm3btm3btm3btm37XWOffVd/7HM218NnREwAaWxfBw2vpyAeZu2w9OKPX5G/nG7Y718fD+/cvXvvotbZrVwgIv9cecvkaz1iqHR4z4K5s9jov6B3+nJ5Av39lAUW6jBv3rjK6a1GSzXo0LPozxfPn5rSLJ1ZTrK+538yADHPV5Y2G8biSbZ6N+A+4fXGOp6uggbcg8zwNamJzElz9l7QsmlRi65KH5y5NQzMHYCozTklSXYwyGTA7pDCyx5/ZBDF78PNemoMNV/Wt5BpFpQK17/BbUQNPQV3fK6MIWqSPedHRfKfZdYR0WAwJQDEuZug7b40VodDN6keQVXGNGF4dPLMuRW1bfqg/k5V9Bm9OJNZE6tXcOHiJQoGpLxoGODd6iyq2VJ22HL6yo+wsG8XT3w0EHAyWJ3MY7bcg1xmpHeFTCoEjXkFgDEZRmbim83DSvgoCFwP3oYdrCQreCMYb4Df87K6C90EPt8r4SJTp/3gM8OH9pLNAOMTgPeliKjVjbfgNcPFICJzYLbV8ZwChA4ktQ+N5xWuJpcQtX7Mq4RLLSWWnAd4BdyVJDoOXu/vUVliztBu+tRJj/gTvTqU5DZ9yZ+xdpJpHy2A8SUi7GVlkjtSAE8/Lpg5unyJzBY3psSZukWAq5cDSH6SU5+c4GtkGQWJD7yM5wzGKqCA5NNErjBMV0KU9i5XgLmKCh/6rRpjxvjY10PBLICp8XzHthHHYNCfmRVkXvwFSlnYjTFpyeTbMUGzr09FZcKpYc09FZCl8IR9T98JotPpFONeP7u7qkexUEread7FF0wrZ9vUTVc9E8HcMeF0iyBS1Z4kU8PmTZs2bV43bZJQkraLgeZMmO4gohSdbkHmXB/SrWelzWESpgF2e5PLdH3WXb548eLFS0eHJCU9W8ovuBsHDb8KTcm9ycelg/RuSlRt0I5HH78xFzEfX45q3nzCwTdOydZ81YNkGNqSPk+JIWNGjx49tm3eLEREHrm6r773eFMI6RJWUDggjgUAALAYAJ0BKmAALwA+gTSVR6UjIiE3F2zIoBAJbAC2igFWfk5SQeM3mE21iP1L7cnzOfst63HpJ/5m+d7zDgAH8l7PPsg8z/Hv7lkQMpmSnwoTfHOKqdub+rfYG6SXobftU6XAFoyz+L3SXxcdGACof5YdzQ7D4LrTjabuj3Tla0rSUtbpLwfmZbDwslb0jXQQHHkaq8s9NlOApsY/Dh6r5pMQXs7eGOxRLLVT3eFikkT3QqaR1GNTFiVjayvpj1DulFSb0Pes7f6U+pw8gzAAAP7pOhuRbHXSZpG62Jhz9qGZ6LzT7z2gUIcue99vN2Jp0TUxmXqYKrw4G1VkzDu922j+8aXIuB2ZXyfPISqCWqe6qSsfGFh22YCwUwteEVuryZEgNq/KNxf2QNbeLhsIJLbF6hPTy6lmPa3MV428swpXteYGB5a0fD3xUOFg91vpEkTBAe6Y0n4+azmw5RQjGEACB+ChvP4yBp7Kx5gIV1B8L4W+sjnqea9Gj9zsurhhVe1QZ22gUnD3B2R9fzG7sStLxwryA7t7hVHAP8+kFlTT936E/BrzZkzPs5eaTldYBtDkPglmbEgXmPq0f00WKiVPFHDNbRRwcfS1L3V0gwn5UtlVYGgegUj9YBOrIiMnYIZbJwv/OZyRcIaBZKH9WIAXhnHMP3E6emJ5lyUOqyXCw5mt8aBDHQJqSN5M+rBSUbxd4XrIKsaWfU+4QSRPKRdjtxKQeEjCvI3EfA2m0yToU8fdjBtRfVL4L2Lq+U/4ENZOPayJZ9006lWovspUq+hbe+NxEe7bT3jZe8ldq/RhhcarLnx5VbQJUWMmIE3YexWn+ZLNkTqO4UJ3oKEftw65VSjv3jU+m1mvWob2/uGlUoHxCiNioIprlY7QM0yHGakeXmfbnPPgH6bc7jknxsw/5EefIviQcpN5uOMpZfzRMBMlyJ++KaahfvHBuP7CuBpaOVOQCfcYZQk/KBfeexvjrXBywCwUcEsxm/8AkGIRRXNwYKJoYc3zrNKly/ycpdporM3Kqe75FtTZ8aZMz1Qo5pukm0o3l+mJE3gYvp1EEcpxbPd44SukX1DvKbls7Vk2uPs21QXfIi3sdk0C7jxPvOPivcAvz8duN6eOd1OL6o02CYOjm9kw1tvFVjz4vqY1YRdw7ZMTcw3YuoOHHuYkFF2zyg+sF2Ayi0Z0Haopju/IGwv+hVbCy3paqwDSG5nGn1AOwZZ738RXdtloNY/T3x1vQbcLx0Hkqe12EexJ+HV/PM/JpQQfkV4PLj74UJSKry2tCDJNshEZ+7t4SxGtfj7szBKKQj3TbshpEk9CioesL1OydaTLSNSQfTlnipTwX6XdGvrhkgORwld6eb+NI6/+E6EvFp3Z/M0cuB3txO3cBKjQfOiawHske8PGOdonrwTgh3gcZM7IbSXngeNXOngznWPk85k890Us+Zq0NuwK6D+fASpRxnPXA45twnUYUiE/OK2SXjz/0m+RdcAEdQPcTq6X+OuBt1Jx+gShbx+yJnAo2gbR8PugVL2bmdaJfVqDIC4eHXaOCyoTt5ICr2+7ahNls25QtDFJdZ7t7Vx8o7WGzu/u/JvvxVV7Qu1TxxLkwpsdGUY9g6Emyx4eBcMWh+kgNr4OfYDG+hD0iVcmjzKCpqHpXS+9qCCFCGj/62ogcvdm2Ai1nCfsyM4FlXd/olMUS6P3w9iggKou8DbJiautGme6HKYfeDr5tAT8M98ngBtvwSl4lUsJZDsHVU2L7iAucUMkhgwRyS8LdP6KbtIN2GXXuOFxcSiu9LaE2R9sPr9QIUlI4WDiWbF6dVeRkBqoklBQyNL1rpSZW6DLJ7vuyWcwYkLbVBRCgY5AAtVnXV+BJQJ/UtQ1jOR2rqimVtny/67w74AAAA==",
 "staranise_0.png": "data:image/webp;base64,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",
 "roastedgram_0.png": "data:image/webp;base64,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",
 "tamarind_0.png": "data:image/webp;base64,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",
 "ing_coconut.png": "data:image/webp;base64,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",
 "ing_garlic.png": "data:image/webp;base64,UklGRsAFAABXRUJQVlA4WAoAAAAQAAAAXwAAXwAAQUxQSNgBAAABkETbtmlH5/3Ytm0b5WrZtm23bNu2bdu2bZsv/8TJu3eP6mWMiJgAKiHR3NEKmEVw3anHH56dM75mqAGk8N0v/nG+6ouN7T3whJ7lwl/v5QbGbC0X+WI1BUqbf0XjH1PcgRjv5mLd7YEj+m3x8G4PGN25uHd55jFN7jlwwMCeHjKYuLkkN23SuPWlYuOlRkRxW75w3t0eotlndt/14P4H1vZrGWr5ggvc7SmUru2l7yzioKZfuJCzFZHs3rCQ+mefubDvy4jk8EGMIh+0Eum9FN8z0fFQeEfM0J2xQHf6v+8MvAUG4PTtCZw63Q4c8xgF3ecy6Lg3vPUKus3wNhC6Ay7o/lyrCo751WQncJxVDR0PgLdch+64EbqJBE5tgu5DOLpt5uD+NSJwbyLRqWPR8Q1XdJ+j0F11RdeLwF1yA3crnbCtDiFRPsnxbaotiWp9Qwb94RoKiRs5ZMHl56pYDwZakeD2gXV6brijivJltD9JqXjUWfXolV4z9eK4MgpJa+Y7lLXOmmhPcs/V6lV7U5Lb8pw2/7aXI9mdLmnx82JHU5JeV/1BcX15tKqqLUH0bbbqzIXPfwrz9+eNQ6M6JfoqBFNnYZNasd/UyflOHV6ptKsplSgKVlA4IMIDAAAwFQCdASpgAGAAPpFCmEglpCIhLVRLaLASCWIAeVeZXkv3meTOVerPcHc8RpyG82PvIzePy90P1F7Bf60dZf0M0bBRCEAo3F/50EncA3YxBaxNU90csA2yfI6Xni32WWda3mL9ER+ccpauQxOrGnKy9qMP6wH+neXo2Y/Q0eNGQfmRfkMSR87hx1nXERmRlXtJwiKSFJ92ouVS5623P8zZbGPc54N7yAWI7dd/93sPlygAAP78XNKb/A6aktvZJsWVe/8qudT/zLgtKsl9o9dQ4XemW3fyJwPLNEETxaqlOJ8dyO3/uvL2Nzv39N7j1PqvgH8WGvjdYo2t9t+H+BJBnVB7/u0ZfyxXfbwLwCRr+pKa8s9yJp8SXLWH0VQZSdNzttok/nrX3Gqq+qiRD+IkJvtBFqn1gyQDh6VB1Lgw+54m2w/4Rc1caqAerUb+lROiS5fA8dwWG/FAtGValUUGaqaKQVr/ZKggPfYmm98GxKuCfbfWsWDX3tPrXo6eev5MLkYTlH0bnh7ncb6zs1lISJXvy/FCv6vY4bNofkLoFSUVKHDJqTosjpAx9gko7qokNDj4uYvVoDObACWn+ax8RUZYJfZWenJeD5FBbmlUxEjVy+0GjkQ0qz6d0FgFFWpWv4FAebLHgSH1ARXC85bpCGMClT0X8yd1WKvmKuqypiDUviLFEHZXCumHqK4uvq9h3xxqYmOPcZDMU7S3v6clV2qBRGEI3sAxU7Gso30bRgfr3dMUsfzicoG8/nAwB2VNwyS9FJo/gIuwkbTO5H94SCZPe3BwLxZuzVLOaI1Bff3RyhICe85W/6c5weLF3xCaLJLobcyswz8dvgd6APGO/S/UgjdsDBIFIhUle+Rp8atIHjnKlv/6ajqgCD4Dq75Rbwxn56OfCKEPWqbzLUA1rDIv5FZKdKL9s48FE6x8GcpY9IUYlS0CNmbazAHAwlcs196ZGpMUluHkGb2BszDQgxQz/H8AaQ889GXoZKSawNgBC9NiXgwLAX3l6RwLOGInUrMRh6uxAsy9nZqtNVDN4ySR/7b3/WHLM8tzzuPUlYcuC7nLFmPjY6Vis2zZaeEBr+AL+L4SbBlAhF5xNEaav/nstPY/VZJuH9WyXA6RvIRWVWPBNncA7E0BL16YcHkCBWyVVIGzn1jhOa37bNdl5P5IFD4oC9m2woqktp/Y/8aYcpwsPXjeKDRTLkA9kbRLeCEO/BvoJ6hRQ+DoMaX5jGl2pHVIHsDiOB6gqlVdzwY7cX/5LpP6kIOzyNEwAAAAAA==",
 "ing_raw_mango.png": "data:image/webp;base64,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",
 "ing_lemon.png": "data:image/webp;base64,UklGRvYEAABXRUJQVlA4WAoAAAAQAAAAXwAAXwAAQUxQSKoBAAABkETb2rE3T2zbdlLbtm1rZLsd2rZtGyPbtttfsZ+63/c+d5wVERNAJQT0KNVvzKjRoxpGWENK6bPqkpF/z3l1eGQwGscW697xv98f4ojEocXhHP7vgl0hOJoczmFNTwSD8J9pZq0X2kCodpm1z2yFoO5T1vNmkLjIFQbWd6S0FvdZ77v+ohwHf2Ld81pJcpxbxApOlzS0iFW8EiTH5h4rWXRl18gGXkKeqPF71o3RpUQ8VoeZv65KAMf8eIQ7OObtCej4UTV0/LQqOn5aDR0/rYaObwWj48XW6DLaouMT9ui+VULHc+Dd8EKX1RAd94A3A95eeBPQFXdG9yER3X5bdNMJ3MdUZZ4JKR5Pyk6xyDjioY51ne0WAcdDSGXbukvv5yl2IoRU92+x5KJJnaLDISTRucKEcyZFsvqQVKcK0z8pwS9jpBBRxXm5KphSBZFVn+cKmFMkEVU6nKvbRjdZZD/wq06bPUl8xY1Zhdq9mOpJAB2rd1r70KKF8d70aILpV7PX4gOnPhkNBlOGwWAwPj60aWAlbwJr5ZCQmpJSpnpKSkpqqBWVABBWUDggJgMAABASAJ0BKmAAYAA+kUKZSKWkIqErmJsgsBIJYgB5q5keIfza8GeA27vPSedLvgHoAdKhfgD9M3TV4a+ZUA/jvTJ9E39SUCBR8N8VL8Gb9Iz7Dqor0KKx85Sy8c5z1NI+FBgJwVdiYePs9pa22B9IRJHdo6PPdXmOyYAAOEnf6WoAUDX7AfK4t5jCFAH40HXZRw5xQFqGAXWbAAD+/FzQnvbV0vrNFoC828rX6bp2scsv1TZaqyTepYn8K6Of2d0ZVvr2k61s+vaI0H8XGocmJWeCEKc/7HOT1isGMgirueDbJS+H8Ass6FGga0QpOOEglGYFC9rl59YGYz3wad541uI5qmegV9B4dxzXj9nscLX/ipuNh5BCnD+pzzZs3xpvW+KFWDVcCzHluV9SqSGc5cJ3+gLBju3pdtV+JSMygdC25zAdM6R74gHi97b1L2qDP5jzEgF9BsORVrg0x3mGHIA3w5/oPfKRFfkyGscP3Jzq6s1sfE3Q0UtNjIUw7jn82IjyLCECbIYZ7NI+h+SQ1UNf0IjRsrzrb3ImnTRGEf2GmUwF2ULbeg+EFh5SW3+Gdv2xSmz5PXB7lIkdqA6m4VmF/q5NHqzapcaXxYSchAV9ThrdzvowKE0vTQPgKOv5LSuaFvnQ2d/CMsyfOGlm5jOpN8fPPfovPvQv7LD5nqbwHTuZvQB1U7DV0atQm15ny/mvMugsgz/LmtDe8ekkTEaYA4I2yBWJS54jjhOzMVOeIw9l1Pe5SyIGVCP2uBth1HgvYajK55cMxJ8mw4pGL2/5spsROweJXBRIr8zw1iuibuIQC/LE6tjORSQAgMe7mgN1RH5Fo6t9tMJiNA/MFJXXW1atO1mAyLXx8SXGmVk4D0jV0OPFA318ivDUVWYoX5GFGIGQL37OZLr5OvbFpl5eJv5HpX8aT2r2JAPeroDR5NCpcHOn+IzfK002qwmnyXqowSwoTl3KohBFxa4EpHPP7pRouhkvoIESx4JN3HatLAkkSRSb7knQQh42fOOvC28vf/DDB7Kv+cVf4z9BfA0+o1+uuk35m+Fjd4f8Ilyp8FAAAAAA",
 "ing_amla.png": "data:image/webp;base64,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",
 "ing_tomato.png": "data:image/webp;base64,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",
 "ing_gongura.png": "data:image/webp;base64,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",
 "ing_sesame_oil.png": "data:image/webp;base64,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",
 "ing_rice_flour.png": "data:image/webp;base64,UklGRhIFAABXRUJQVlA4WAoAAAAQAAAAXwAAXwAAQUxQSNkBAAABkARJtmlba5/7bPPbtm3bHtm2bZsz27Zt27Z19vr+567d0xcRERNACam7oHmlz9Fh04LSScLiQCWf/fw1M3+8fvxgLKRkR/gfOyOKm8//en1Ak2RYrLpLzmv9L8x8vTgSq+dndnAlkKhJn9nJZ62TobBGsdM3KmEoveSDY3ypnLdhfs2qBNR9xO78NN7HrOH8+sAHdq8e72tO/maD3rDA72smT502qU6EAZ47WbKe7pIWU3fQW1F8O06Yx0yW/qZti5Siwp6Js7/y+ZySwl+I+31SlBL03AT99XBKbMxnQtEd9EB3rXp2hU1/e1YNGzPvjUNnL/QFxwMUunGEbl7KNOCe31/lwsY8itDNV+hGEjh7lgK3LzGBW6fQHYkEtyWzhe1lAZJp0JceFjT7zsy0BG1jUpJqzOYkHuD0tdzQNPOeEGi8tX0GEvPSAH1rdVqSG3LHAO7lQYJV0R3SbHtOcpIdf0jWwRbtfUl6mTO33ot5PjeKTAyPLdVwvgy7vgcZG7X03Xc3vd8xYEyHQDLYN1+1Xd+du7XuRFNfMj+8WpvFq3duvffyxZtP+m9v3j05fKiQRwihVL7eqTJlyFe2/85lK9YNG7C+S+4C6UPCCbGHUhaRRQmtAwBWUDggEgMAAHASAJ0BKmAAYAA+kTyYSCWjIqEsektAsBIJaQDUlDANu+vL6wm+oS/d/9N+wR/Ht4z/YBECD/5IyrcmusEJR9ixebT0T1smN3jm8rjGbqUZqbvPgINq0jVyceXHUV6xcOEtdOsiHoBug5+8LtD2MWMH1p/886jTZjPlcPBRR8Eic+WDHw9borKkUDKVvodbnAl62+8H8hT8GFQQKAD+/FzQArP2sjv19O0IntEPgN59UvqVGnpsLfY8EaYL/WH+WCLQmLDEWtfioRGHyBdeP7uj1PeR+GfYY/8VL3xusnw2W4BplJkA9FVDJCtyb5fnuJlPpzB3yjKPg1fbjg6MmIjvo16gaa1Y9/vfDO8w8XX1eceFPZmSAjVD3ZB4qvk0AWuTOhQhyQSxh2twXpn/EvavNXZ3sG18xueL+IvPybpdbICrYTntJpNppeFPhRROccrCtA0b/T7H9AQUce+b3cDyTJ8SX63T/jZ5S98JCR1pEfcuDKoaehUjC6npElVz0hx/6lWnIvWCMVJP/gW0EeMy7PsQSyrEttdl/4ucBtyy9a2hHzjPApBjRMg9folno9jsuClfN25g8HZhKwpJ7oA3+6dXZAaFZWbJkeOgeDreFjBJkETI/GBaQvnGodDtFxA0qzkHkUcE7nA4Whj3Qx2ebiHwQuFgdvSBON9wl2oqVHzjNKIh9hzuZHNw+nk6qSSg+VFwaMi5qNuAN56P2VZVI8YTrmt7JePEpWjV6RF3fxSa+cN6R9iPmzvzEwuf/12V8aKN28LsG/XKyR7mO1jMfVmBsOIlJA/3zHuzsfgBC3BTR/i8ZrBdQ8C9x0JPlF1dsCIwlnRFZV+lvGCIwLmbfRKIJvnx+ZnIHFsP7p7dudAtHnasY6cvGImICG6U9G42apGSA2VnrurLSvGJ1BP5rmHYj/Vay5Zfo57Grgm/Pq42QT5NeVTZ+/oGNDKfODmm16eboc0rHN8XLu7B9E/7YPSEHFVHFyWJLtX1S85met1QGMR7piF7Llw815NEaFPm4CrX+7JFJtynR1lFgAAAAA==",
 "ing_gram_flour.png": "data:image/webp;base64,UklGRpANAABXRUJQVlA4WAoAAAAQAAAAXwAAXwAAQUxQSJ8EAAABkIVt29lIX9qxPWvbts3O2rZt27Zt27ZtW+PpdLCdfO9Bu2km+c/2JCImgP6Hl4zkXKhAPqOwCsxYUbHA6Xd3ChJRuhY+4qnykPH55B/Ia4Iztd32rYFwpNUAA5CRdOysWcaDBnmqpxdK+WewzwwAjPBPPzuIxGkj2J7i3aHCyOxa4hlUZOsKbzJK+pOo9oXFV2RWI3mxp9/43q56Cxk3/ikYDDXDw6hpXHg9vXVPkMFQl/lM2syncSaXrqTG78BQ37Jr/n3GLn/dOBup4lsw1GcGwIhtppuyw/oeByP1LZ11Ezo7HjI0GN1ON9XW3E6CBplfhYUE6SLjVlOJ11oAsK52BXsGbTW5V7VNtDZ+ViWjsWGn0EL9VndsUMFVI4Ygyb985atgTZh3dfco9Dzy3IdEmKO/ttFGugmn61GeM2BokRkJ0xu/BQAGMFMT0rgUXA07CYZmLe/iGfZPBqnnW6ddaRtJyvMUSPyRAu0ylMa1U8/03fqwki9Jrebt+ssMMGtHMWMJUbCbOtlv4e/LCZLTWoAZOj5TY8C5lpIq9X4AiUOJCo9/CD1zcmQiHq3u465Chm0p93q4Uzpv5426spWBP3UkxwLXRPVJE9roxph0x3Rnu9fPsUHWv2/uP/iFi4t+CYCxycWx7mYGAE6RmfWHuDbkuHfzhzaijOvs6uQQOW0TCPPn3VvbGR0JvSgQMIAbwQ6kHf+VBWIb3sCBwSkQDOPC8IH5lUwEQ7AM/B2upPhlWTQAzmRWQq0tAjoaoCTngRThMD4UVDIGLB55jYeSpl/FA3NbUmqYbBWPPFlRuTssHmzMkk7BBIiGAf798HDmf02CaOVwM4BXucRlndP11Ovnww3i4q0eAdmyuJO4ENGelAsIX9oVrOshLGZZRuTlKX7iilw58cLHNu4kLLxp4patvETiYuvnFeUMJDAw8LW10GzPBouJ7TAY8Z0EFXPp2MlPAJAwUtEEsDC2ZvYIMJ24cX1Zs1BFpt9gQchPVw9b2b1AYKALKTe9TxQGYMXrhuRwxpYXIUpmxLb3cMy/32sAbMN6Q8zxrZnI8Wy3wMwIP345QX/vSngZVCj/HgAu1PfMehm6T14VTCqWPhEDnM1Hob0/aIoBZscgz3FTgQIbz9tegKjq1nitsA3Cv6QokgHLyydP99Z3VoPIyZuIggZFawV3l5+eMbZB2HewAtyf0iVnxkw+lIplt/2WWSs7cgZRjtKewyIVzaRU7yVDs2w+O2rivfPBmc6A/8GYnkrG7FkXJVos8YkyawK2i4P6bzxrli22ViT3SSWXGrVmdTGFNez5HnZZZrB69tcHZ/RMv3OhKSwszDT+zJTAVCKD5EJEJM1jO/i59SdS29KXiDJ4kq3k7URaNZkBWF49mxW81B6rwXZwLYT0GLDg4+lpXXJm8qRcIxY//haVBLusQLbGI2b9hIkTdnzoUtVHB+SVJ4T+acxarOkp+c+vXxEpYIDtYG/3q2Pcichn+qluXnpwuNLQ8iVLVpr9AwDf3bhx46ZbA6WM7mTrldlAwnSeFms2nypoNBqNRSZnIxEH1axfNxPZDfES0v/LAFZQOCDKCAAAsCMAnQEqYABgAD6FOJVHpSOiITHbPPigEIloAMWEJpE5koZsBOzv/pvVjt6fMB55npN/1W+ibzN/gsEa/nPZl/ZvAvyQf/0Gkd/Id5BJlLgLvV6CExSUtyNqAH6J9IfPW9e+wJ/Mv7V1sf299kT9UnTRdCeqdCLqy8TNnqos7d9Gv5T6hpkG0YYswYmxQqTTX6I5mZ9RjeyAwS70bPqv+aEHGbCe0ix/CmRrj2G59L8jw0I/J5sd0byljC8e6TCbegSmh2ocPOYVEPBPITPXkRA6ysGUtOG6KrFFjRxJO+K0WD/oWW//vvdaUAklc20bEcOpyAjPp6HRmX2k6MTp0obhovGjjLwPzt5GhW02hRw8TsigB0snF3oWZ2CdzFecVjWy/WdgAP7+BtAEz63IyHjXe22Mwh8tlH4b9QZI8uDV+oJv/yjiWN3nvUVu9ywSs9WsEZZ9po3f1EGSqfl5zGD4EvCg4kCaRE/9uPyhoY+f5Y8sg+/uOtSIKO+Gb8dAUR2UwS3s89cIbqQHLDN1JDSGxOABYY4aW+2fS43BRlT0PLcQdZNcm0OLz/f5IJgg3vWmtr3D+FC8W1duqWPBNVg4POXlOa6Auu8E50OHKzcy0wghVKK/Geh+Pzy2PVhMo9FUINzLcYbtxCQnu+A7/zyHqoPuWw/6DzW0wV/A+hadBkSqGOAzWMFsDzeyZcauTBn4sNphla42b3kzALXWe0gVk/XZlDe8nrY4ZWZyYQrMuWP0ABdsljEj/e602k2yvPfOYrR7KS06+8mojEpPLy+W3wJLF8SnFeCEIw01KM2uJbvoQGcEZC0EBdbIYvqPf2LMggekZKjbzelAt50FAr8vx+buvCRaclwF/gYp3cHB3yHQh2rMKPSmm6ONBISF2x85aY3yOLdo6nQfaEUBj3giIvVCO9C1enMFt3jC1jKNzwnMSM3z18Lt9NW/hL6h/13VrtwuiSpJoUHq1bk/K9zJC9f+fr9t8THwId50pqC/FzrscaUdZuIy8EHx5mknPtgMR7LhWZsx7caBcmLywQ5dPybOiEuFtTyOtOGgDC94CjlHP07kG09FibDZSZQhVczeYH64wF0H4bzjc+rEO4Neq5Xc4D/HvUzuGxr2ZVrvxcJIXsJFXeNn8wlZhsb26r2oRCr2CJhxD7PYir8U5Z0ZywVDT+YmvCxrI/iEDJORSxgAKoXMnl6cziKPGmigAIzj3BWPhDLOL9i6hH/MmUvEqkS1S/b8aYS8k55rsudJk73J3hrtMqqxfGdJb1BKltdcPvwuTHb2n6TJ4f565wLwv4P5yVHSM7jt+5nXu1VdBIo6qbR0t4WDQNQ/swHjP6tDniZ1rKZ9pnGaRVyZfBT90JRZAq7efqmiUyAuLY1FBgUuiL0QURUvbaq2chPy5oqieZSjMVqZ97CZCwoUC088+sOwsr3nc1KvudP7EN44hUq77E/1+PeHRvgtY3Qe0mnfTg4cXXekH++PHs4obtqwj0PG4fo3D/P3f1fNnDdeN2QQVhFQTVyNsMh4DZewQj75/WcuOs35PZYfDx9Eih9rFyTERkO19Q8k4DG0PJwLaDGYeUWJ3UoEWlTBydGRDFjFomhW5kR1zKFAT7Zto9GBPBdgN1vJk/He33XlIHNmdZ7XkgCr20gaXy9HNzF/Bf+PnmLddkEtmcjmOKMH/sSnMfc0cxOsWAxhe6H7uAowowZgurKHckBhrEQ2vo55mFv+1giJoCBFBW+NvSYHqjzgqS0zga6BKqks9FlzOnHkDIamNpeEvYEvTiuFo8l7f7iuWPp+FlfzgPX8+m7mQXAr6zf3qjOyUMSk7g4Tu2F52lQ5ln5kB52eBv3aUxaGtA7IuNhAW2msbC2at1AAdVpEGQdy2SsP3PCTV5LyGMgRPA/zPgFM9e4O8NlbyvrDW4GpGqUT6Vcs3Xym4320j7brCMOl3khPk9nBmovohY4TugxFXA/KS0XSmaRqLdR4+ZA3NagLNegEd9rgA8ZI956z7Ko2H5DbPpGcKMNatqlqU3iTqSHRFYk3j/B4GoD3aysKISAwTuB8VzGded3V2lM0gNJYhbUXoYF3xnrBwLaBofGFDnxxAInEWCB8yeqk2aRBm4u3Urfk04I1XJlvCNuuP1yP9r8S2SH/+vM0d02WuzazQLCnkSYPxPLOPOu8vNRIEr7IYbaLLN0atcY62aWbUjCCXu/OibGffK9ThmaKCzRzFvhesxDmavrAm8P9OxwGA9EInsP2BTD88lZMS25VKUflUYZu6l44Bgynfh2HYKcwcf7ekfIaYOT/FOeGiA7ohYjK7k73QyqDgKzQ8FkTveNq1yT4j7l2sLT7d1/csHHvZHE3IgVSrgL/PifvXtbepaeHAT8Ouf1YYgV7qP8J0UrzrihQpiwJkPwcHRZQaXPvMfJLYTO+Dw7NDuZS0o71NjPWssw8BGdqVW5JO3uXZ3xjp5R27yZ3h1YIAQHaBAbuvuESAH7yUGpXUwYGSY+YXnVVmgC6iOPpRPAVRltdsJQzetTu9CjCxTJG5KnJKLbluzeVXgrOdD3lu6PMhVulxg4kNlF6hCVTO6SUnPz/LYkank2iX90ObCWXo85A9ICfLOeA5Z3kJsHeueWNPzaiLnmMmSwIH2BEJabe3WppE3h/slNNNIdTp7/mKXzsFCHZQPrWx2Oxx/wcZNsa6CIIwhP6x6VvrQcY2Gx4S/RRiir0xs7T4f/VD+pz+OjmBFFgGHZrjpLHyD9A7jLoEd5t070CW6sXtSMQQZEAPZqGJQDjDvHNSwXAnvCU7N3f9poX29e4WrTi6s+iarz3b8lUlOJB5TaRj7vEL8B7HXcVizi0+qVT33wNL0hnBxg/0+pvOTdae187ZTr//Bfgq1hF3dFv+feDDMPnpcvCERUwNAtq3qo7DIBOh2ehAcf9aVoOvJWa7tt3cRqXmb0CKLZ+HUH+7tPRxcOf5M2SjAx+MwFcGb/E4XsP/NoLNea8YqlpZgAAAAAA",
 "ing_ghee.png": "data:image/webp;base64,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",
 "ing_dry_fruits.png": "data:image/webp;base64,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",
 "ing_dates.png": "data:image/webp;base64,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",
 "ing_wheat_flour.png": "data:image/webp;base64,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",
 "ing_edible_gum.png": "data:image/webp;base64,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",
 "ing_khoa.png": "data:image/webp;base64,UklGRsAEAABXRUJQVlA4WAoAAAAQAAAAXwAAXwAAQUxQSMEBAAABkETbkiFb8WzbNoa2/Ua27fdt2+bUtm3btp/N+EZkzD5WREwA/JegTOKQKBnGnLJWd2HHMgumDBJWvsBvnvdnSDV+8rU+/H7dWHVepOxGnenGn9zowoeCe+HmV/gLHxdL8mBUuLMFf3HXKDXhVIxiFt7G37nTWCzdglNPO/A3n4kQR9Jp5q0+JNg4TV8Mw9rtL5DqKQdy0kGzll5DyjeTpChJWGSua0Lq7cu06DisetaPIh7zoOJ6AUW9aUlkDIpbQWScQEOJjBVoLHsH5Lk7p8Td2T9ezrF3VIG7icDdUTfu8MNyO+YQd8hzd1ePuxMKzF0LB+a2q3DXP4pCcINI+MSFgMRYoXCZ5O8D7d1CvTQkAEZ7Rei4U9daV1dXP0uGAlg/EOCwkauvk5OzkzLQDL1G74490Pa9TKq36cVL3K9CC0z2Unofaz4Je1KJgdHWXjovzCCpHWdSA6XhH8nUuYNsZKY1OZB0LZty5FZ7Z++v6f+hFj8QV14/IDBx/qlHz/t/Cjcv7kO8f6APsXe6jEDfVtW3GDh/0oy09EWLMuePSE1PnfH+mqP0rPfH4tQS8qYlKgC/Elb6ALJWivBfgABWUDgg2AIAADARAJ0BKmAAYAA+kUKaSKWkIqEo+AwAsBIJYwB6NElIPdu+2CV+ksobUF/VDqd+gh+u5/TuBVFVTZhfAOoP9IBMxyuv6b5cHT2rz/Mdcbe1L8jNaV+9PNVFj+9ev4TZ3w9sbkP7t4pDoVzgVEc7z+RY5L48MbuTcKYVU8mQaugnhAhvQFkk80LyOUJEyYb0FcWAAP77/VB5/i2YPLKTc/YxgD3yzxj4w+oP6H06A0CTPu2tba2MKpP+rvOtAc699llvEG0lISj4AM3E6z9MbszzJmSbvfC8FzNdNJ4O1PCxbTQNeQ3yTyjqAElbpaeWyatRPmcXUrK7TrhZg9TCDasCCj9HLf+Z+xLkGpxhnrUMa86jHkFClH9w1+jCxib1mr6H1PEyMsDKiCwmRNX/29zIEVMpGCfcK/+Gn74tF5Z9ui+FETIc4I4Ku4XQSkkYvqKhTAiRAc4A/zFnMeRkdF39AgeTzdvfyMPLG7ep6zo1UiehkVQRVSUZqHIGNATdZU/rg7rKAb8CPDcaETVz3EPvNjKDNyPUz8HebI/3XcYHc68NJWcmfREQ+55Ua4/XvtzURfO5CRcyE0ghGeQusrys/O6niU3MtpUg1APCnF1ANkz9ao4v+r0hot1aO8uyArvtHobsT2Mq9hxjUTjtq5snA6D538MU5X0qnibosP+wj9AzEMuOcHNX6bVQMTGKl7ChfDzX1x4bRNWgc/hg25QrVFA8MRmwWlc7ytw2n2je1z0nAOr9tr+XToOBp2SxdqiQFAbcoCHTmSzEgU2E0ArIvIr2lSzwFCA32qoNp/6HaXFyRyyCj1V0qASPVghlOYimx7u1X2Wk4o63dq7mO7AXOtQrTQIJ/yfHcwg2cdaxfshHM2aPu2ZLLoJJaxIw9391CIKTwMF5ezNri8N6XB8lgKkp0s3tGLD7JhBGXrL1dzck6EEGs6nRH/+0l44qdwzjpNOLAAAA",
 "ing_millets.png": "data:image/webp;base64,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",
 "ing_potato.png": "data:image/webp;base64,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",
 "ing_onion.png": "data:image/webp;base64,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",
 "ing_amma.png": "data:image/webp;base64,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",
 "peanut_0.png": "data:image/webp;base64,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",
 "jaggery_0.png": "data:image/webp;base64,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",
 "rocksalt_0.png": "data:image/webp;base64,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",
 "ajwain_0.png": "data:image/webp;base64,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"
}
