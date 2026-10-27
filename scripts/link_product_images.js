const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/assets/images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Map authentic new AmbhuJakshi images to legacy and alternate filenames
const imageMappings = {
  // Sweets
  'sunnundalu.png': [
    'sunnunda_laddu_roasted_urad_dal_laddu.jpg',
    'sunnunda-laddu.jpg',
    'sunnunda_laddu.png',
    'sunnunda_laddu.jpg',
    'sunnundalu.jpg'
  ],
  'dry_fruit_laddu.png': [
    'dry_fruits_laddu_premium_dry_fruits_laddu.jpg',
    'dry-fruits-laddu.jpg',
    'dry_fruit_laddu.jpg',
    'dry_fruits_laddu.png',
    'dry_fruits_laddu.jpg'
  ],
  'gond_laddu.png': [
    'gondh_laddu_edible_gum_laddu.jpg',
    'gondh-laddu.jpg',
    'gond_laddu.jpg',
    'gondh_laddu.png',
    'gondh_laddu.jpg'
  ],
  'gulab_jamun.png': [
    'kova_gulam_jamun_rich_gulab_jamun_sweet.jpg',
    'kova-gulam-jamun.jpg',
    'kova_gulam_jamun.png',
    'kova_gulam_jamun.jpg',
    'gulab_jamun.jpg'
  ],
  'millet_laddu.png': [
    'millets_laddu_wholesome_multi-millet_laddu.jpg',
    'millets-laddu.jpg',
    'millet_laddu.jpg',
    'millets_laddu.png',
    'millets_laddu.jpg'
  ],
  'palli_chikki.png': [
    'palli_patti_peanut_and_jaggery_chikki.jpg',
    'palli-patti.jpg',
    'palli_patti.png',
    'palli_patti.jpg',
    'palli_chikki.jpg'
  ],
  'nuvvula_chikki.png': [
    'thill_patti_sesame_seed_and_jaggery_sweet.jpg',
    'thill-patti.jpg',
    'thill_patti.png',
    'thill_patti.jpg',
    'nuvvula_chikki.jpg'
  ],
  'dry_fruit_chikki.png': [
    'sweet_chekki_traditional_sweet_brittle.jpg',
    'sweet-chekki.jpg',
    'sweet_chekki.png',
    'sweet_chekki.jpg',
    'dry_fruit_chikki.jpg'
  ],

  // Pickles
  'avakaya_pickle.png': [
    'bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
    'bellam-avakaya.jpg',
    'bellam_avakaya.png',
    'bellam_avakaya.jpg',
    'avakaya_pickle.jpg',
    'mango-pickle.jpg'
  ],
  'mamidi_ooragaya.png': [
    'mamidi_ooragaya.jpg',
    'allam-avakaya.jpg'
  ],
  'usirikaya_pickle.png': [
    'usiri_pickle_amlagooseberry_pickle.jpg',
    'usiri-pickle.jpg',
    'usiri_pickle.png',
    'usiri_pickle.jpg',
    'usirikaya_pickle.jpg'
  ],
  'velluli_pickle.png': [
    'allam_velluli_pickle_ginger_garlic_pickle.jpg',
    'allam-velluli-pickle.jpg',
    'allam_velluli_pickle.png',
    'allam_velluli_pickle.jpg',
    'velluli_pickle.jpg'
  ],

  // Snacks & Vadiyalu
  'chakralu.png': [
    'karam_janthukalu_murukku_strings_snack.jpg',
    'karam-janthukalu.jpg',
    'karam_janthukalu.png',
    'karam_janthukalu.jpg',
    'chakinalu.jpg',
    'chakinalu.png',
    'chakralu.jpg'
  ],
  'murukku_rings.png': [
    'chakodi.jpg',
    'murukku_rings.jpg'
  ],
  'mixture.png': [
    'khara_mixture_assorted_crunchy_savory_mix.jpg',
    'khara-mixture.jpg',
    'khara_mixture.png',
    'khara_mixture.jpg',
    'mixture.jpg'
  ],
  'karam_boondi.png': [
    'bundhi_crispy_spiced_gram_flour_droplets.jpg',
    'bundhi.jpg',
    'bundhi.png',
    'bundhi.jpg',
    'karam_boondi.jpg'
  ],
  'potato_chips.png': [
    'allu_chips_thinly_sliced_indian_potato_chips.jpg',
    'allu-chips.jpg',
    'allu_chips.png',
    'allu_chips.jpg',
    'potato_chips.jpg'
  ],
  'biyyam_vadiyalu.png': [
    'rice_papad_crispy_rice_flour_papadums.jpg',
    'rice-papad.jpg',
    'rice_papad.png',
    'rice_papad.jpg',
    'biyyam_vadiyalu.jpg'
  ],
  'onion_chakra_vadiyalu.png': [
    'onion_whills_onion_flavored_crisp_wheels.jpg',
    'onion-whills.jpg',
    'onion_whills.png',
    'onion_whills.jpg',
    'onion_chakra_vadiyalu.jpg'
  ],
  'tomato_appadalu.png': [
    'tomato_chilli_papad_tangy_and_spicy_papads.jpg',
    'tomato-chilli-papad.jpg',
    'tomato_chilli_papad.png',
    'tomato_chilli_papad.jpg',
    'tomato_appadalu.jpg'
  ],
  'jonna_appadalu.png': [
    'jonna_appadalu.jpg'
  ],
  'nuvvula_papad.png': [
    'nuvvula-papad.jpg',
    'nuvvula_papad.jpg'
  ],
  'uppava.png': [
    'uppava.jpg',
    'pandu-mirchi.jpg'
  ],

  // Spice Podis & Masalas
  'moringa_karam_podi.png': [
    'munagaku_karam_podi_moringa_leaves_spice_powder.jpg',
    'munagaku-karam.jpg',
    'munagaku-powder.jpg',
    'munagaku_karam_podi.png',
    'munagaku_karam_podi.jpg',
    'moringa_karam_podi.jpg'
  ],
  'special_idli_karam_podi.png': [
    'special_idli_karam_podi_gun_powder_spice_for_idlis.jpg',
    'special-idli-karam.jpg',
    'special_idli_karam_podi.jpg',
    'idli_karam_podi.jpg',
    'idli_karam_podi.png'
  ],
  'special_kura_karam_podi.png': [
    'special_kura_karam_podi_all-purpose_curry_powder.jpg',
    'special-kura-karam.jpg',
    'special_kura_karam_podi.jpg',
    'kura_karam_podi.jpg',
    'kura_karam_podi.png',
    'mirchi-powder.jpg'
  ],
  'karivepaku_podi.png': [
    'karvepaku_karam_podi_curry_leaves_powder.jpg',
    'karvepaku-karam.jpg',
    'karvepaku_karam_podi.png',
    'karvepaku_karam_podi.jpg',
    'karivepaku_podi.jpg'
  ],
  'kandi_podi.png': [
    'kandi_podi.jpg'
  ],
  'nalla_karam_podi.png': [
    'nalla_karam_podi_traditional_black_curry_powder.jpg',
    'nalla_karam_podi.jpg'
  ],
  'putnala_karam_podi.png': [
    'putnala_podi_roasted_chana_dal_powder.jpg',
    'putnala-karam.jpg',
    'putnala_karam_podi.jpg',
    'putnala_podi.png',
    'putnala_podi.jpg'
  ],
  'allam_velluli_karam.png': [
    'allam_velluli_karam_podi_ginger_garlic_spice_powder.jpg',
    'allam-velluli-karam.jpg',
    'allam_velluli_karam_podi.png',
    'allam_velluli_karam_podi.jpg',
    'allam_velluli_karam.jpg'
  ],
  'dhaniya_powder.png': [
    'dhaniyala_karam_podi_coriander_seeds_powder.jpg',
    'daniya-powder.jpg',
    'daniya_powder.png',
    'daniya_powder.jpg',
    'dhaniya_powder.jpg'
  ],
  'turmeric_powder.png': [
    'haldi_powder_pure_turmeric_powder.jpg',
    'haldi-powder.jpg',
    'haldi_powder.png',
    'haldi_powder.jpg',
    'turmeric_powder.jpg'
  ],
  'garam_masala.png': [
    'garam_masala_powder_traditional_warm_spice_blend.jpg',
    'garam-masala.jpg',
    'garam_masala.jpg',
    'garam_masala_powder.png',
    'garam_masala_powder.jpg',
    'biryani-masala.jpg'
  ],
  'chicken_masala.png': [
    'chicken_masala_powder_chicken_curry_spice_blend.jpg',
    'chicken-masala.jpg',
    'chicken_masala.jpg',
    'chicken_masala_powder.png',
    'chicken_masala_powder.jpg'
  ],
  'mutton_masala.png': [
    'mutton_masala_powder_mutton_recipe_spice_blend.jpg',
    'mutton-masala.jpg',
    'mutton_masala.jpg',
    'mutton_masala_powder.png',
    'mutton_masala_powder.jpg'
  ],
  'sambar_podi.png': [
    'sambhar_masala_powder_authentic_sambhar_spice_blend.jpg',
    'sambhar-masala.jpg',
    'sambhar_masala_powder.png',
    'sambhar_masala_powder.jpg',
    'sambar_podi.jpg'
  ],
  'menthi_podi.png': [
    'menthi-podi.jpg',
    'menthi_podi.jpg'
  ]
};

let copiedCount = 0;
const folders = [
  path.join(__dirname, '../public/assets/images'),
  path.join(__dirname, '../public/images/products'),
  path.join(__dirname, '../public/images/images/products')
];

folders.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

for (const [sourceName, aliases] of Object.entries(imageMappings)) {
  const sourcePath = path.join(targetDir, sourceName);
  if (!fs.existsSync(sourcePath)) {
    console.warn(`Source image not found: ${sourceName}`);
    continue;
  }

  for (const alias of aliases) {
    folders.forEach(dir => {
      const destPath = path.join(dir, alias);
      try {
        fs.copyFileSync(sourcePath, destPath);
        copiedCount++;
      } catch (err) {
        console.error(`Failed to copy to ${destPath}:`, err.message);
      }
    });
  }
}

console.log(`Successfully mapped and linked ${copiedCount} product image aliases across all public directories!`);
