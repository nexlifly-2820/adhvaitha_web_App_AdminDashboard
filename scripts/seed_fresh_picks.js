const http = require('http');

const freshPicksData = {
  doc_id: 'fresh_picks',
  content: {
    settings: {
      enabled: true,
      kicker: 'FRESH OFF THE STOVE',
      title: 'Fresh picks,',
      titleAccent: 'just for you',
      subtitle: "new from Amma's kitchen this week",
      intervalMs: 3400
    },
    products: [
      {
        id: 'p1',
        name: 'Chakralu',
        tagline: 'Sankranti spiral snack, made with pure rice flour',
        image: 'assets/images/chakralu.png',
        madeLabel: 'Made today, 6 AM',
        batch: 'Batch #24',
        badge: 'NEW',
        variants: [
          { id: 'v1', label: '250g', price: 100, mrp: 115, inStock: true },
          { id: 'v2', label: '500g', price: 190, mrp: 220, inStock: true }
        ]
      },
      {
        id: 'p2',
        name: 'Special Idli Karam Podi',
        tagline: 'freshly roasted lentils & Guntur red chillies',
        image: 'assets/images/special_idli_karam_podi.png',
        madeLabel: 'Made today, 7 AM',
        batch: 'Batch #25',
        badge: 'HOT',
        variants: [
          { id: 'v3', label: '100g', price: 85, mrp: 95, inStock: true },
          { id: 'v4', label: '250g', price: 190, mrp: 210, inStock: true }
        ]
      },
      {
        id: 'p3',
        name: 'Sunnunda Laddu',
        tagline: 'roasted urad dal & organic bellam with pure desi ghee',
        image: 'assets/images/sunnundalu.png',
        madeLabel: 'Made today, 5:30 AM',
        batch: 'Batch #26',
        badge: "AMMA'S SPECIAL",
        variants: [
          { id: 'v5', label: '250g', price: 199, mrp: 220, inStock: true },
          { id: 'v6', label: '500g', price: 380, mrp: 420, inStock: true }
        ]
      },
      {
        id: 'p4',
        name: 'Nuvvula Papad',
        tagline: 'hand-rolled sesame papadums sun-dried on terrace',
        image: 'assets/images/nuvvula_papad.png',
        madeLabel: 'Sun-dried yesterday',
        batch: 'Batch #27',
        badge: 'CRISP',
        variants: [
          { id: 'v7', label: '200g', price: 110, mrp: 125, inStock: true },
          { id: 'v8', label: '400g', price: 210, mrp: 240, inStock: true }
        ]
      }
    ]
  }
};

const payload = JSON.stringify(freshPicksData);

const req = http.request(
  {
    hostname: 'api.adhvaithafoods.in',
    port: 80,
    path: '/app_settings.php',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  },
  res => {
    let responseData = '';
    res.on('data', chunk => responseData += chunk);
    res.on('end', () => {
      console.log('BigRock Server Response:', responseData);
    });
  }
);

req.on('error', err => {
  console.error('Request error:', err);
});

req.write(payload);
req.end();
