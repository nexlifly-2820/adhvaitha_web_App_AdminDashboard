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
            image: "assets/images/bowl_bellam_avakaya.png",
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
            image: "assets/images/bowl_karam_podi.png",
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
            image: "assets/images/bowl_sunnunda_laddu.png",
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
            image: "assets/images/bowl_kara_murukku.png",
            price: 129,
            mrp: 140,
            sold: "6.2K+",
            rating: 4.7,
            move: "up",
            moveBy: 3
          },
          {
            id: "p5",
            variantId: "v10",
            name: "Khara Mixture",
            image: "assets/images/bowl_khara_mixture.png",
            price: 149,
            mrp: 165,
            sold: "5.5K+",
            rating: 4.6,
            move: "down",
            moveBy: 1
          },
          {
            id: "p6",
            variantId: "v12",
            name: "Gongura Pickle",
            image: "assets/images/bowl_gongura_pickle.png",
            price: 130,
            mrp: 145,
            sold: "7.1K+",
            rating: 4.9,
            move: "up",
            moveBy: 2
          },
          {
            id: "p7",
            variantId: "v14",
            name: "Usiri Pickle",
            image: "assets/images/bowl_usiri_pickle.png",
            price: 130,
            mrp: 150,
            sold: "6.8K+",
            rating: 4.8,
            move: "up",
            moveBy: 1
          },
          {
            id: "p8",
            variantId: "v16",
            name: "Chakinalu",
            image: "assets/images/bowl_chakinalu.png",
            price: 110,
            mrp: 130,
            sold: "8.2K+",
            rating: 4.8,
            move: "new",
            moveBy: 0
          }
        ]
      }
    ]
  }
};

async function seed() {
  console.log("Seeding best_sellers with 8 items to live endpoint http://api.adhvaithafoods.in/app_settings.php?doc_id=best_sellers...");
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
    console.log("Verified Categories count:", verifyData.categories?.length);
    console.log("Verified Items count in 'All':", verifyData.categories?.[0]?.items?.length);
    console.log("Verified Items list:", verifyData.categories?.[0]?.items?.map(i => `${i.id}: ${i.name} (Sold: ${i.sold})`));
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}

seed();
