const http = require('http');

const payload = JSON.stringify({
  doc_id: 'pickles',
  content: {
    settings: {
      enabled: true,
      eyebrow: 'HAND-MIXED · SUN-CURED',
      title: "Amma's Pickles",
      viewAllLabel: 'View all →',
      addLabel: 'Add to cart',
      chilliIcon: 'assets/images/chilli.png'
    },
    pickles: [
      {
        productId: 'mango_avakaya',
        variantId: '500g',
        name: 'Mango Avakaya',
        tag: 'Best Seller',
        description: 'Sun-dried raw mangoes with Guntur chillies & cold-pressed sesame oil.',
        cureNote: '3-week sun cured',
        thumb: 'assets/images/mango_close.jpg',
        spice: 4,
        price: 349,
        mrp: 399,
        theme: {
          c1: '#C2273A',
          c2: '#7A0F12',
          accent: '#FFD58A',
          accent2: '#E9C46A',
          glow: '#FFB450'
        },
        shots: [
          {
            url: 'assets/images/mango_bowl.jpg',
            caption: 'Tossed by hand in small batches',
            scaleFrom: 1.15,
            scaleTo: 1.0,
            ms: 3500
          },
          {
            url: 'assets/images/mango_jar.jpg',
            caption: 'Preserved in traditional bharanis',
            scaleFrom: 1.1,
            scaleTo: 1.1,
            panXFrom: 0,
            panXTo: 0.08,
            ms: 2500
          },
          {
            url: 'assets/images/mango_spoon.jpg',
            caption: 'Pairs perfectly with hot rice & ghee',
            scaleFrom: 1.0,
            scaleTo: 1.12,
            ms: 3000
          }
        ]
      },
      {
        productId: 'lemon_pickle',
        variantId: '250g',
        name: 'Lemon Pickle',
        tag: "Ammamma's Recipe",
        description: 'Juicy lemons aged with rock salt and roasted fenugreek.',
        cureNote: '1-year aged',
        thumb: 'assets/images/lemon_close.jpg',
        spice: 2,
        price: 149,
        mrp: 175,
        theme: {
          c1: '#D4AF37',
          c2: '#8A5A19',
          accent: '#FFF3E0',
          accent2: '#FFE0B2',
          glow: '#FFD54F'
        },
        shots: [
          {
            url: 'assets/images/lemon_bowl.jpg',
            caption: 'Freshly squeezed lemons',
            scaleFrom: 1.1,
            scaleTo: 1.0,
            ms: 3000
          },
          {
            url: 'assets/images/lemon_jar.jpg',
            caption: 'Aged to perfection',
            scaleFrom: 1.0,
            scaleTo: 1.1,
            panYFrom: 0,
            panYTo: 0.05,
            ms: 2800
          },
          {
            url: 'assets/images/lemon_spoon.jpg',
            caption: 'Tangy, spicy, and irresistible',
            scaleFrom: 1.05,
            scaleTo: 1.15,
            ms: 3200
          }
        ]
      },
      {
        productId: 'gongura_pickle',
        variantId: '250g',
        name: 'Gongura Pickle',
        tag: 'Andhra Special',
        description: 'Hand-picked sorrel leaves cooked with red chillies & garlic.',
        cureNote: 'Wood-fired',
        thumb: 'assets/images/gongura_close.jpg',
        spice: 5,
        price: 179,
        mrp: 210,
        theme: {
          c1: '#1F5A1E',
          c2: '#0B2E0B',
          accent: '#C5E1A5',
          accent2: '#9CCC65',
          glow: '#AED581'
        },
        shots: [
          {
            url: 'assets/images/gongura_bowl.jpg',
            caption: 'Farm fresh Gongura leaves',
            scaleFrom: 1.2,
            scaleTo: 1.0,
            ms: 3200
          },
          {
            url: 'assets/images/gongura_jar.jpg',
            caption: 'The authentic taste of Andhra',
            scaleFrom: 1.0,
            scaleTo: 1.05,
            panXFrom: -0.05,
            panXTo: 0.05,
            ms: 2500
          },
          {
            url: 'assets/images/gongura_spoon.jpg',
            caption: 'A burst of tangy heat',
            scaleFrom: 1.0,
            scaleTo: 1.1,
            ms: 3300
          }
        ]
      },
      {
        productId: 'garlic_pickle',
        variantId: '250g',
        name: 'Garlic Pickle',
        tag: 'Immunity Booster',
        description: 'Peeled garlic cloves roasted in mustard oil with traditional spices.',
        cureNote: 'Slow-roasted',
        thumb: 'assets/images/garlic_close.jpg',
        spice: 3,
        price: 199,
        mrp: 240,
        theme: {
          c1: '#8A4A1C',
          c2: '#3A1A05',
          accent: '#FFCC80',
          accent2: '#FFA726',
          glow: '#FFB74D'
        },
        shots: [
          {
            url: 'assets/images/garlic_bowl.jpg',
            caption: 'Plump garlic cloves roasted slow',
            scaleFrom: 1.1,
            scaleTo: 1.0,
            ms: 3000
          },
          {
            url: 'assets/images/garlic_jar.jpg',
            caption: 'Infused with cold-pressed mustard oil',
            scaleFrom: 1.0,
            scaleTo: 1.1,
            panXFrom: 0,
            panXTo: 0.06,
            ms: 2700
          },
          {
            url: 'assets/images/garlic_spoon.jpg',
            caption: 'Deep, savory & aromatic heat',
            scaleFrom: 1.05,
            scaleTo: 1.12,
            ms: 3100
          }
        ]
      }
    ]
  }
});

const req = http.request(
  {
    hostname: 'api.adhvaithafoods.in',
    port: 80,
    path: '/app_settings.php?doc_id=pickles',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  },
  res => {
    let d = '';
    res.on('data', c => (d += c));
    res.on('end', () => console.log('Response for pickles:', d));
  }
);

req.on('error', console.error);
req.write(payload);
req.end();
