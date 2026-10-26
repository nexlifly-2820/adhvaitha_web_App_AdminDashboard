const storySnacksData = {
  doc_id: "story_snacks",
  content: {
    list: [
      {
        id: "murukku",
        name: "Kara Murukku",
        image: "assets/images/karam_janthukalu_murukku_strings_snack.jpg",
        price: 129,
        story: "A crispy spiral snack made from rice flour and urad dal, prepared in our family kitchen for festive evenings.",
        since: "1985",
        ingredients: [
          { name: "Rice Flour", image: "assets/images/rice_papad_crispy_rice_flour_papadums.jpg" },
          { name: "Urad Dal", image: "assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg" },
          { name: "Spices", image: "assets/images/special_kura_karam_podi_all-purpose_curry_powder.jpg" }
        ]
      },
      {
        id: "mixture",
        name: "Khara Mixture",
        image: "assets/images/khara_mixture_assorted_crunchy_savory_mix.jpg",
        price: 149,
        story: "A delicious assortment of spiced boondi, peanuts, and sev tossed with roasted curry leaves in pure oil.",
        since: "1992",
        ingredients: [
          { name: "Gram Flour", image: "assets/images/bundhi_crispy_spiced_gram_flour_droplets.jpg" },
          { name: "Peanuts", image: "assets/images/palli_patti_peanut_and_jaggery_chikki.jpg" },
          { name: "Curry Leaves", image: "assets/images/karvepaku_karam_podi_curry_leaves_powder.jpg" }
        ]
      }
    ]
  }
};

// Also save to both doc_ids for compatibility
Promise.all([
  fetch('http://api.adhvaithafoods.in/app_settings.php?doc_id=story_snacks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(storySnacksData)
  }).then(r => r.json()),
  fetch('http://api.adhvaithafoods.in/app_settings.php?doc_id=snacks_with_story', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(storySnacksData)
  }).then(r => r.json())
])
.then(res => {
  console.log('BigRock story_snacks seeded successfully:', res);
})
.catch(err => {
  console.error('Error seeding story_snacks:', err);
});
