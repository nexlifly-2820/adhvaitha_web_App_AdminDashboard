const pairingsList = [
  {
    id: 'breakfast',
    kicker: 'BREAKFAST',
    title: "Dosa's Best Friends",
    desc: 'Karam Podi + Avakaya',
    price: 379,
    imageA: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg',
    imageB: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
    colors: ['#5C0A0D', '#7A0F12', '#9B1D22'],
    pairs: [
      {
        id: 'br1',
        tag: 'BESTSELLER',
        imageA: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg',
        imageB: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
        name: 'Karam Podi + Avakaya',
        bestWith: 'Dosa · Idli',
        price: 379
      },
      {
        id: 'br2',
        tag: 'POPULAR',
        imageA: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg',
        imageB: 'assets/images/palli_patti_peanut_and_jaggery_chikki.jpg',
        name: 'Karam Podi + Masala Peanuts',
        bestWith: 'Dosa · Idli',
        price: 299
      },
      {
        id: 'br3',
        tag: '',
        imageA: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
        imageB: 'assets/images/palli_patti_peanut_and_jaggery_chikki.jpg',
        name: 'Avakaya + Masala Peanuts',
        bestWith: 'Dosa · Upma',
        price: 329
      }
    ]
  },
  {
    id: 'evening_tea',
    kicker: 'EVENING TEA',
    title: "Chai's Crunchy Partners",
    desc: 'Murukku + Banana Chips',
    price: 299,
    colors: ['#18453B', '#235D4E', '#2E7563'],
    pairs: [
      {
        id: 'et1',
        tag: 'CRUNCHY',
        imageA: 'assets/images/karam_janthukalu_murukku_strings_snack.jpg',
        imageB: 'assets/images/allu_chips_thinly_sliced_indian_potato_chips.jpg',
        name: 'Murukku + Banana Chips',
        bestWith: 'Evening tea',
        price: 299
      },
      {
        id: 'et2',
        tag: '',
        imageA: 'assets/images/khara_mixture_assorted_crunchy_savory_mix.jpg',
        imageB: 'assets/images/palli_patti_peanut_and_jaggery_chikki.jpg',
        name: 'Spicy Mixture + Masala Peanuts',
        bestWith: 'Evening tea',
        price: 279
      },
      {
        id: 'et3',
        tag: '',
        imageA: 'assets/images/karam_janthukalu_murukku_strings_snack.jpg',
        imageB: 'assets/images/khara_mixture_assorted_crunchy_savory_mix.jpg',
        name: 'Murukku + Spicy Mixture',
        bestWith: 'Evening tea',
        price: 319
      }
    ]
  },
  {
    id: 'after_meals',
    kicker: 'AFTER MEALS',
    title: 'Sweet Endings',
    desc: 'Sunnunda Laddu + Murukku',
    price: 399,
    colors: ['#8B4513', '#A0522D', '#B8860B'],
    pairs: [
      {
        id: 'am1',
        tag: 'TRADITIONAL',
        imageA: 'assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg',
        imageB: 'assets/images/karam_janthukalu_murukku_strings_snack.jpg',
        name: 'Sunnunda Laddu + Murukku',
        bestWith: 'After meals · Gifting',
        price: 399
      },
      {
        id: 'am2',
        tag: '',
        imageA: 'assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg',
        imageB: 'assets/images/allu_chips_thinly_sliced_indian_potato_chips.jpg',
        name: 'Sunnunda Laddu + Banana Chips',
        bestWith: 'After meals · Gifting',
        price: 379
      },
      {
        id: 'am3',
        tag: '',
        imageA: 'assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg',
        imageB: 'assets/images/khara_mixture_assorted_crunchy_savory_mix.jpg',
        name: 'Sunnunda Laddu + Spicy Mixture',
        bestWith: 'After meals · Gifting',
        price: 389
      }
    ]
  }
];

fetch('http://api.adhvaithafoods.in/app_settings.php?doc_id=pairings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ list: pairingsList })
})
.then(r => r.json())
.then(res => {
  console.log('BigRock Pairings updated successfully:', res);
})
.catch(err => {
  console.error('Error saving pairings:', err);
});
