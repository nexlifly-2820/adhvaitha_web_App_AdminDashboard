const specialsData = {
  doc_id: "specials_light",
  content: {
    list: [
      {
        id: "avakaya",
        name: "Avakaya",
        image: "assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg"
      },
      {
        id: "karam_podi",
        name: "Karam Podi",
        image: "assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg"
      },
      {
        id: "murukku",
        name: "Murukku",
        image: "assets/images/karam_janthukalu_murukku_strings_snack.jpg"
      },
      {
        id: "sunnunda",
        name: "Sunnunda",
        image: "assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg"
      },
      {
        id: "mixture",
        name: "Mixture",
        image: "assets/images/khara_mixture_assorted_crunchy_savory_mix.jpg"
      },
      {
        id: "banana_chips",
        name: "Banana Chips",
        image: "assets/images/allu_chips_thinly_sliced_indian_potato_chips.jpg"
      }
    ]
  }
};

fetch('http://api.adhvaithafoods.in/app_settings.php?doc_id=specials_light', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(specialsData)
})
.then(r => r.json())
.then(res => {
  console.log('BigRock specials_light updated successfully:', res);
})
.catch(err => {
  console.error('Error saving specials_light:', err);
});
