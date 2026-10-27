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
        image: "assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg",
        colors: ["#F7B733", "#E2722B"],
        rating: 4.8,
        soldToday: 320,
        loves: "2.1k",
        spice: 2,
        badge: "👑 No.1 this week",
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
        image: "assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg",
        colors: ["#8E1B2B", "#5C0A0D"],
        rating: 4.9,
        soldToday: 280,
        loves: "1.8k",
        spice: 3,
        badge: "🔥 Bestseller",
        variants: [
          { id: "v4", label: "200g", price: 139, mrp: 150, inStock: true },
          { id: "v5", label: "500g", price: 320, mrp: 350, inStock: true }
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
