const http = require('http');

const payload = JSON.stringify({
  doc_id: 'trust',
  content: {
    enabled: true,
    eyebrow: 'THE AMBHUJAKSHI PROMISE',
    heading: 'Everything we make comes',
    headingAccent: 'four promises',
    ribbon: 'SINCE 1982',
    logo: 'assets/images/AMBHUJAKSHI  logo.png',
    rating: '4.9',
    footer: 'Loved by 12,000+ families',
    tags: [
      {
        title: '100%\nNatural',
        sub: 'No preservatives',
        icon: 'leaf',
        color1: '#3FA34D',
        color2: '#1F7A35'
      },
      {
        title: "Amma's\nRecipe",
        sub: 'Authentic taste',
        icon: 'home',
        color1: '#E96446',
        color2: '#C23A22'
      },
      {
        title: 'Fast\nDelivery',
        sub: 'Freshness intact',
        icon: 'truck',
        color1: '#4A90E2',
        color2: '#2A64B2'
      },
      {
        title: 'Secure\nPacking',
        sub: 'No leaks or spills',
        icon: 'shield',
        color1: '#9B59B6',
        color2: '#7A2C9B'
      }
    ],
    shelf: [
      {
        label: 'Pickles',
        image: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
        category: 'Pickles'
      },
      {
        label: 'Powders',
        image: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg',
        category: 'Powders'
      },
      {
        label: 'Sweets',
        image: 'assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg',
        category: 'Sweets'
      },
      {
        label: 'Snacks',
        image: 'assets/images/karam_janthukalu_murukku_strings_snack.jpg',
        category: 'Snacks'
      },
      {
        label: 'Gifts',
        image: 'assets/images/good_food_text.png',
        category: 'Gifts'
      }
    ]
  }
});

const req = http.request(
  {
    hostname: 'api.adhvaithafoods.in',
    port: 80,
    path: '/app_settings.php?doc_id=trust',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  },
  res => {
    let d = '';
    res.on('data', c => (d += c));
    res.on('end', () => console.log('Response for trust:', d));
  }
);

req.on('error', console.error);
req.write(payload);
req.end();
