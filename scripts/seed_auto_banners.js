const autoBannersData = {
  doc_id: "auto_banners",
  content: {
    banners: [
      {
        id: "b1",
        image: "assets/images/banner_1.jpg",
        link: {
          category: "Pickles"
        }
      },
      {
        id: "b2",
        image: "assets/images/banner_2.jpg",
        link: {
          category: "Powders"
        }
      },
      {
        id: "b3",
        image: "assets/images/banner_3.jpg",
        link: {
          category: "Sweets"
        }
      },
      {
        id: "b4",
        image: "assets/images/banner_4.jpg",
        link: {
          category: "Snacks"
        }
      }
    ]
  }
};

async function seed() {
  console.log("Seeding auto_banners to live endpoint http://api.adhvaithafoods.in/app_settings.php?doc_id=auto_banners...");
  try {
    const res = await fetch("http://api.adhvaithafoods.in/app_settings.php?doc_id=auto_banners", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(autoBannersData)
    });
    const result = await res.json();
    console.log("POST Result:", result);

    console.log("Verifying GET request for auto_banners...");
    const verifyRes = await fetch("http://api.adhvaithafoods.in/app_settings.php?doc_id=auto_banners");
    const verifyData = await verifyRes.json();
    console.log("Verified GET Data:", JSON.stringify(verifyData, null, 2));
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}

seed();
