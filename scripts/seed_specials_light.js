const specialsData = {
  doc_id: "specials_light",
  content: {
    list: [
      {
        id: "avakaya",
        name: "Avakaya",
        image: "assets/images/avakaya_pickle.png"
      },
      {
        id: "karam_podi",
        name: "Karam Podi",
        image: "assets/images/special_idli_karam_podi.png"
      },
      {
        id: "murukku",
        name: "Murukku",
        image: "assets/images/chakralu.png"
      },
      {
        id: "sunnunda",
        name: "Sunnunda",
        image: "assets/images/sunnundalu.png"
      },
      {
        id: "mixture",
        name: "Mixture",
        image: "assets/images/mixture.png"
      },
      {
        id: "potato_chips",
        name: "Potato Chips",
        image: "assets/images/potato_chips.png"
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
