const http = require('http');

const payload = JSON.stringify({
  doc_id: 'wishlist',
  content: {
    settings: {
      enabled: true,
      eyebrow: 'MY WISHLIST',
      titleStart: "Amma's",
      titleAccent: 'pantry',
      titleEnd: 'for you',
      shareLabel: '↗ Share my shelf',
      fillLabel: 'Fill my basket',
      fairyLights: true,
      shareBase: 'https://ambhujakshi.com/wishlist/'
    },
    items: [
      {
        productId: 'mango_avakaya',
        variantId: '500g',
        name: 'Mango Avakaya',
        image: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
        price: 349,
        mrp: 399,
        addedPrice: 399,
        inStock: true,
        note: '₹50 OFF'
      },
      {
        productId: 'idli_karam',
        variantId: '250g',
        name: 'Special Idli Karam Podi',
        image: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg',
        price: 190,
        mrp: 210,
        addedPrice: 190,
        inStock: true,
        note: 'BACK!'
      },
      {
        productId: 'sunnunda_laddu',
        variantId: '500g',
        name: 'Sunnunda Laddu',
        image: 'assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg',
        price: 320,
        mrp: 350,
        addedPrice: 320,
        inStock: true,
        note: ''
      },
      {
        productId: 'kara_murukku',
        variantId: '250g',
        name: 'Kara Murukku',
        image: 'assets/images/karam_janthukalu_murukku_strings_snack.jpg',
        price: 129,
        mrp: 149,
        addedPrice: 149,
        inStock: true,
        note: '₹20 OFF'
      }
    ]
  }
});

const req = http.request(
  {
    hostname: 'api.adhvaithafoods.in',
    port: 80,
    path: '/app_settings.php?doc_id=wishlist',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  },
  res => {
    let d = '';
    res.on('data', c => (d += c));
    res.on('end', () => console.log('Response for wishlist settings:', d));
  }
);

req.on('error', console.error);
req.write(payload);
req.end();
