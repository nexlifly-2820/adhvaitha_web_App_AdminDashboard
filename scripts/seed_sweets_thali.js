const sweetsData = {
  doc_id: "sweets",
  content: {
    settings: {
      enabled: true,
      kicker: "MITHAI THALI",
      title: "Traditional sweets,",
      titleAccent: "timeless joy",
      subtitle: "Pure ghee. Jaggery. Just like Ammamma made.",
      intervalMs: 2800,
      badges: ["🧈 Pure desi ghee", "No preservatives"],
      giftTag: "🎁 Gift box available"
    },
    products: [
      {
        id: "p1",
        name: "Sunnunda Laddu",
        tagline: "roasted urad dal & organic jaggery",
        image: "assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg",
        tags: ["🧈 Pure Desi Ghee", "No Sugar"],
        giftBox: true,
        variants: [
          { id: "v1", label: "250g", price: 199, mrp: 220, inStock: true },
          { id: "v2", label: "500g", price: 380, mrp: 420, inStock: true }
        ]
      },
      {
        id: "p2",
        name: "Dry Fruits Laddu",
        tagline: "almonds, cashews, dates & pistachios",
        image: "assets/images/dry_fruits_laddu_premium_dry_fruits_laddu.jpg",
        tags: ["🥜 Loaded with nuts", "Energy Rich"],
        giftBox: true,
        variants: [
          { id: "v3", label: "250g", price: 240, mrp: 275, inStock: true },
          { id: "v4", label: "500g", price: 460, mrp: 520, inStock: true }
        ]
      },
      {
        id: "p3",
        name: "Gondh Laddu",
        tagline: "edible gum, ghee & wholesome dry fruits",
        image: "assets/images/gondh_laddu_edible_gum_laddu.jpg",
        tags: ["💪 Immunity Boost", "Winter Special"],
        giftBox: false,
        variants: [
          { id: "v5", label: "250g", price: 210, mrp: 235, inStock: true },
          { id: "v6", label: "500g", price: 410, mrp: 450, inStock: true }
        ]
      }
    ]
  }
};

async function seed() {
  console.log("Seeding sweets to live endpoint http://api.adhvaithafoods.in/app_settings.php?doc_id=sweets...");
  try {
    const res = await fetch("http://api.adhvaithafoods.in/app_settings.php?doc_id=sweets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sweetsData)
    });
    const result = await res.json();
    console.log("POST Result:", result);

    console.log("Verifying GET request for sweets...");
    const verifyRes = await fetch("http://api.adhvaithafoods.in/app_settings.php?doc_id=sweets");
    const verifyData = await verifyRes.json();
    console.log("Verified GET Data products count:", verifyData.products?.length);
    console.log("Verified Settings:", verifyData.settings);
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}

seed();
