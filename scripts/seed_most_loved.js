const mostLovedData = {
  doc_id: "most_loved",
  content: {
    settings: {
      enabled: true,
      kicker: "THE LOVE CHART",
      title: "Most loved",
      titleAccent: "products",
      intervalMs: 2500,
      maxItems: 10
    },
    products: [
      {
        id: "p1",
        name: "Bellam Avakaya",
        short: "Avakaya",
        tagline: "sweet jaggery meets fiery mango",
        image: "assets/images/bowl_bellam_avakaya.png",
        loves: "2.1k",
        badge: "👑 No.1 this week",
        colors: ["#F7B733", "#E2722B"],
        rating: 4.8,
        soldToday: 320,
        spice: 2,
        variants: [
          { id: "v1", label: "250g", price: 120, mrp: 136, inStock: true },
          { id: "v2", label: "500g", price: 230, mrp: 260, inStock: true },
          { id: "v3", label: "1kg", price: 440, mrp: 500, inStock: true }
        ]
      },
      {
        id: "p2",
        name: "Idli Karam Podi",
        short: "Karam Podi",
        tagline: "authentic gun powder spice blend",
        image: "assets/images/bowl_karam_podi.png",
        loves: "1.8k",
        badge: "🔥 Bestseller",
        colors: ["#8E1B2B", "#5C0A0D"],
        rating: 4.9,
        soldToday: 280,
        spice: 3,
        variants: [
          { id: "v4", label: "200g", price: 139, mrp: 150, inStock: true },
          { id: "v5", label: "500g", price: 320, mrp: 350, inStock: true }
        ]
      },
      {
        id: "p3",
        name: "Kara Murukku",
        short: "Murukku",
        tagline: "crispy spiral festive savory",
        image: "assets/images/bowl_kara_murukku.png",
        loves: "1.4k",
        badge: "✨ Crunchy",
        colors: ["#18453B", "#235D4E"],
        rating: 4.7,
        soldToday: 195,
        spice: 1,
        variants: [
          { id: "v6", label: "250g", price: 129, mrp: 140, inStock: true },
          { id: "v7", label: "500g", price: 249, mrp: 270, inStock: true }
        ]
      },
      {
        id: "p4",
        name: "Sunnunda Laddu",
        short: "Sunnunda",
        tagline: "roasted urad dal & pure cow ghee",
        image: "assets/images/bowl_sunnunda_laddu.png",
        loves: "1.9k",
        badge: "🍯 Ghee Special",
        colors: ["#8B4513", "#B8860B"],
        rating: 4.9,
        soldToday: 210,
        spice: 0,
        variants: [
          { id: "v8", label: "250g", price: 199, mrp: 220, inStock: true },
          { id: "v9", label: "500g", price: 380, mrp: 420, inStock: true }
        ]
      },
      {
        id: "p5",
        name: "Gongura Pickle",
        short: "Gongura",
        tagline: "tangy sorrel leaves with garlic",
        image: "assets/images/bowl_gongura_pickle.png",
        loves: "1.6k",
        badge: "🌿 Andhra Pride",
        colors: ["#1E7A46", "#0F3F33"],
        rating: 4.9,
        soldToday: 245,
        spice: 3,
        variants: [
          { id: "v10", label: "250g", price: 130, mrp: 145, inStock: true },
          { id: "v11", label: "500g", price: 245, mrp: 275, inStock: true }
        ]
      }
    ]
  }
};

async function seed() {
  console.log("Seeding most_loved to live endpoint http://api.adhvaithafoods.in/app_settings.php?doc_id=most_loved...");
  try {
    const res = await fetch("http://api.adhvaithafoods.in/app_settings.php?doc_id=most_loved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mostLovedData)
    });
    const result = await res.json();
    console.log("POST Result:", result);

    console.log("Verifying GET request for most_loved...");
    const verifyRes = await fetch("http://api.adhvaithafoods.in/app_settings.php?doc_id=most_loved");
    const verifyData = await verifyRes.json();
    console.log("Verified GET Data:", JSON.stringify(verifyData, null, 2));
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}

seed();
