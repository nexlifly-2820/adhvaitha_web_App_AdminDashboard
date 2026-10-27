const bestSellersData = {
  doc_id: "best_sellers",
  content: {
    settings: {
      enabled: true,
      kicker: "THIS MONTH'S CHAMPIONS",
      title: "Best",
      titleAccent: "sellers",
      subtitle: "Ranked by real orders from 12,000+ homes",
      intervalMs: 4000,
      rows: 3
    },
    categories: [
      {
        id: "all",
        name: "All",
        emoji: "🔥",
        items: [
          {
            id: "p1",
            variantId: "v1",
            name: "Bellam Avakaya",
            image: "assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg",
            price: 120,
            mrp: 136,
            sold: "12K+",
            rating: 4.8,
            move: "up",
            moveBy: 2
          },
          {
            id: "p2",
            variantId: "v4",
            name: "Idli Karam Podi",
            image: "assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg",
            price: 139,
            mrp: 150,
            sold: "9.8K+",
            rating: 4.9,
            move: "up",
            moveBy: 1
          },
          {
            id: "p3",
            variantId: "v8",
            name: "Sunnunda Laddu",
            image: "assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg",
            price: 199,
            mrp: 220,
            sold: "8.4K+",
            rating: 4.9,
            move: "new",
            moveBy: 0
          },
          {
            id: "p4",
            variantId: "v6",
            name: "Kara Murukku",
            image: "assets/images/karam_janthukalu_murukku_strings_snack.jpg",
            price: 129,
            mrp: 140,
            sold: "6.2K+",
            rating: 4.7,
            move: "up",
            moveBy: 3
          }
        ]
      },
      {
        id: "pickles",
        name: "Pickles",
        emoji: "🥭",
        items: [
          {
            id: "p1",
            variantId: "v1",
            name: "Bellam Avakaya",
            image: "assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg",
            price: 120,
            mrp: 136,
            sold: "12K+",
            rating: 4.8,
            move: "up",
            moveBy: 2
          }
        ]
      }
    ]
  }
};

async function seed() {
  console.log("Seeding best_sellers to live endpoint http://api.adhvaithafoods.in/app_settings.php?doc_id=best_sellers...");
  try {
    const res = await fetch("http://api.adhvaithafoods.in/app_settings.php?doc_id=best_sellers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bestSellersData)
    });
    const result = await res.json();
    console.log("POST Result:", result);

    console.log("Verifying GET request for best_sellers...");
    const verifyRes = await fetch("http://api.adhvaithafoods.in/app_settings.php?doc_id=best_sellers");
    const verifyData = await verifyRes.json();
    console.log("Verified GET Data categories:", verifyData.categories?.length);
    console.log("Verified Settings:", verifyData.settings);
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}

seed();
