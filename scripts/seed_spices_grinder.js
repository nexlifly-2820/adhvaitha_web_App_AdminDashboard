const spicesGrinderData = {
  doc_id: "spices_grinder",
  content: {
    settings: {
      enabled: true,
      kicker: "FROM WHOLE SPICE TO PODI",
      title: "Fresh ground",
      titleAccent: "spices",
      subtitle: "Pounded in stone, the way Ammamma did.",
      cardTag: "🪨 STONE-GROUND TODAY"
    },
    products: [
      {
        id: "p1",
        name: "Moringa Karam Podi",
        tagline: "Drumstick-leaf spice powder",
        image: "assets/images/munagaku_karam_podi_moringa_leaves_spice_powder.jpg",
        powderColor: "#6B7A2A",
        accentColor: "#A8D86A",
        glowColor: "#3A4A14",
        heat: 2,
        throwIn: [
          {
            name: "Moringa leaves",
            pieces: [
              "assets/images/moringa_0.png",
              "assets/images/moringa_1.png"
            ],
            count: 3,
            size: "big"
          },
          {
            name: "Dry red chilli",
            pieces: [
              "assets/images/redchilli_0.png",
              "assets/images/chillies_0.png"
            ],
            count: 2,
            size: "big"
          },
          {
            name: "Cumin",
            pieces: [
              "assets/images/cumin_0.png",
              "assets/images/cumin_1.png"
            ],
            count: 8,
            size: "small"
          }
        ],
        chips: [
          {
            name: "Moringa leaves",
            icon: "assets/images/moringa_0.png"
          },
          {
            name: "Red chilli",
            icon: "assets/images/redchilli_0.png"
          },
          {
            name: "Cumin",
            icon: "assets/images/cumin_0.png"
          }
        ],
        variants: [
          { id: "v1", label: "100g", price: 129, mrp: 149, inStock: true },
          { id: "v2", label: "250g", price: 249, mrp: 280, inStock: true }
        ]
      },
      {
        id: "p2",
        name: "Idli Karam Podi",
        tagline: "authentic gun powder spice blend",
        image: "assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg",
        powderColor: "#B8321E",
        accentColor: "#FF7A45",
        glowColor: "#7A2A14",
        heat: 3,
        throwIn: [
          {
            name: "Red chilli",
            pieces: [
              "assets/images/redchilli_0.png",
              "assets/images/chillies_1.png"
            ],
            count: 4,
            size: "big"
          },
          {
            name: "Urad dal",
            pieces: [
              "assets/images/urad_0.png",
              "assets/images/urad_1.png"
            ],
            count: 6,
            size: "small"
          }
        ],
        chips: [
          {
            name: "Red chilli",
            icon: "assets/images/redchilli_0.png"
          },
          {
            name: "Urad dal",
            icon: "assets/images/urad_0.png"
          }
        ],
        variants: [
          { id: "v3", label: "200g", price: 139, mrp: 150, inStock: true },
          { id: "v4", label: "500g", price: 320, mrp: 350, inStock: true }
        ]
      }
    ]
  }
};

async function seed() {
  console.log("Seeding spices_grinder to live endpoint http://api.adhvaithafoods.in/app_settings.php?doc_id=spices_grinder...");
  try {
    const res = await fetch("http://api.adhvaithafoods.in/app_settings.php?doc_id=spices_grinder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spicesGrinderData)
    });
    const result = await res.json();
    console.log("POST Result:", result);

    console.log("Verifying GET request for spices_grinder...");
    const verifyRes = await fetch("http://api.adhvaithafoods.in/app_settings.php?doc_id=spices_grinder");
    const verifyData = await verifyRes.json();
    console.log("Verified GET Data products count:", verifyData.products?.length);
    console.log("Verified Settings:", verifyData.settings);
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}

seed();
