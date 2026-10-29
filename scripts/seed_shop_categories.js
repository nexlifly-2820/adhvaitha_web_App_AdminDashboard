// scripts/seed_shop_categories.js
const http = require('http');

const payload = {
  doc_id: "shop_categories",
  content: {
    settings: {
      enabled: true,
      eyebrow: "SHOP BY CATEGORY",
      titleStart: "Spin Amma's",
      titleAccent: "lazy susan",
      hint: "👆 Tap a bowl, a name or swipe to choose",
      products: true
    },
    categories: [
      {
        id: "1",
        slug: "pickle",
        name: "Pickles",
        label: "BESTSELLERS",
        subtitle: "Sun-cured in jaadis",
        image: "assets/images/avakaya_pickle.png",
        color1: "#E8432B",
        color2: "#9E1424",
        color3: "#4A0A0E",
        count: 12,
        products: []
      },
      {
        id: "2",
        slug: "snack",
        name: "Snacks",
        label: "CRISPY",
        subtitle: "Crunchy, tea-time ready",
        image: "assets/images/murukku_rings.png",
        color1: "#F59E2B",
        color2: "#C2410C",
        color3: "#5A1E04",
        count: 9,
        products: []
      },
      {
        id: "3",
        slug: "podi",
        name: "Podis",
        label: "MADE DAILY",
        subtitle: "Stone-ground fresh every week",
        image: "assets/images/karivepaku_podi.png",
        color1: "#3FA34D",
        color2: "#1D6B33",
        color3: "#0A2E16",
        count: 8,
        products: []
      },
      {
        id: "4",
        slug: "sweet",
        name: "Sweets",
        label: "FESTIVE",
        subtitle: "Pure ghee & jaggery",
        image: "assets/images/sweets.png",
        color1: "#E0579A",
        color2: "#9D174D",
        color3: "#4A0A26",
        count: 10,
        products: []
      },
      {
        id: "5",
        slug: "vadiyalu",
        name: "Vadiyalu",
        label: "FRY & ENJOY",
        subtitle: "Sun-dried on the terrace",
        image: "assets/images/snacks.png",
        color1: "#8B5CF6",
        color2: "#5B21B6",
        color3: "#26104F",
        count: 6,
        products: []
      },
      {
        id: "6",
        slug: "masala",
        name: "Masalas",
        label: "AROMATIC",
        subtitle: "Whole spices, slow-roasted",
        image: "assets/images/pickles.png",
        color1: "#B7791F",
        color2: "#7A4512",
        color3: "#3A1E06",
        count: 7,
        products: []
      }
    ]
  }
};

const dataString = JSON.stringify(payload);

const options = {
  hostname: 'api.adhvaithafoods.in',
  port: 80,
  path: '/app_settings.php?doc_id=shop_categories',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(dataString)
  }
};

console.log('Sending seed request to api.adhvaithafoods.in/app_settings.php?doc_id=shop_categories ...');

const req = http.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  res.on('end', () => {
    console.log('Response Status:', res.statusCode);
    console.log('Response Body:', responseData);
  });
});

req.on('error', (e) => {
  console.error('Problem with request:', e.message);
});

req.write(dataString);
req.end();
