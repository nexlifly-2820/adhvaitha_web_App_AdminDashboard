const http = require('http');

const festivalConfigData = {
  doc_id: 'festival_config',
  content: {
    enabled: true,
    id: 'sankranti-2027',
    kicker: 'CELEBRATE',
    title: 'Sankranti',
    subtitle: 'Pindi vantalu, sweets & gift boxes, made fresh',
    chipsTitle: 'FESTIVE SPECIALS',
    theme: {
      bgTop: '#F9DFB3',
      bgBottom: '#F6D6A2',
      tile: '#B81D3B',
      line: '#EFCF8C',
      title: '#7A1240',
      kicker: '#5A1030',
      strip: '#D98F2E',
      chipBg: '#FDF3DD',
      accent: '#E9952C'
    },
    tiles: [
      {
        title: 'Pindi\nVantalu',
        image: 'assets/images/chakralu.png',
        image2: 'assets/images/karam_boondi.png',
        link: { category: 'Snacks' }
      },
      {
        title: 'Festive\nSweets',
        image: 'assets/images/sunnundalu.png',
        image2: 'assets/images/dry_fruit_laddu.png',
        link: { category: 'Sweets' }
      },
      {
        title: 'Gifting\nCorner',
        image: 'assets/images/gond_laddu.png',
        image2: 'assets/images/palli_chikki.png',
        link: { category: 'Combos' }
      },
      {
        title: 'Pickles\n& Podis',
        image: 'assets/images/avakaya_pickle.png',
        image2: 'assets/images/special_idli_karam_podi.png',
        link: { category: 'Pickles' }
      }
    ],
    strip: ['HOMEMADE', 'STONE-GROUND', 'FRESH BATCHES', 'PAN-INDIA'],
    chips: [
      {
        title: 'Sankranti\nEssentials',
        image: 'assets/images/sunnundalu.png',
        link: { tag: 'sankranti' }
      },
      {
        title: 'Snacks\n& More',
        image: 'assets/images/chakralu.png',
        link: { category: 'Snacks' }
      },
      {
        title: 'Under\n₹299',
        image: 'assets/images/special_idli_karam_podi.png',
        link: { maxPrice: 299 }
      },
      {
        title: 'Best\nSellers',
        image: 'assets/images/avakaya_pickle.png',
        link: { tag: 'bestseller' }
      },
      {
        title: 'Gift\nBoxes',
        image: 'assets/images/dry_fruit_laddu.png',
        link: { category: 'Combos' }
      }
    ],
    products: { tag: 'sankranti-2027', limit: 10 }
  }
};

const payload = JSON.stringify(festivalConfigData);

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
      console.log('BigRock Server Response for festival_config:', responseData);
    });
  }
);

req.on('error', err => {
  console.error('Request error:', err);
});

req.write(payload);
req.end();
