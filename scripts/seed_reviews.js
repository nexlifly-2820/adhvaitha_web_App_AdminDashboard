const http = require('http');

const payload = JSON.stringify({
  doc_id: 'reviews',
  content: {
    settings: {
      enabled: true,
      eyebrow: 'LETTERS FROM HOME',
      title: 'What families',
      titleAccent: 'write to Amma',
      subtitle: 'Real notes from real kitchens 💌',
      seeAllLabel: 'See all',
      writeLabel: '✍️ Write to Amma',
      ringText: '★ 1.2k REVIEWS ★ MADE WITH LOVE ★ ',
      wallTop: '#1F6B55',
      wallMid: '#0F3F33',
      wallBottom: '#082520',
      accent: '#FFD58A',
      gold: '#E9C46A',
      autoplayMs: 4200
    },
    summary: {
      average: 4.9,
      count: 1248
    },
    reviews: [
      {
        id: 'r1',
        productId: 'p1',
        productName: 'Avakaya Pickle',
        text: 'Dear Amma, the Avakaya pickle tastes exactly like my grandmother used to make in Vijayawada. It brought back so many childhood memories!',
        name: 'Siri M.',
        meta: 'Verified Purchaser · Hyderabad',
        photoUrl: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
        photoCaption: 'Opened today! 🏺',
        stars: 5,
        verified: true,
        tagBg: '#FDE8EA',
        tagFg: '#C2273A'
      },
      {
        id: 'r2',
        productId: 'p2',
        productName: 'Idli Karam Podi',
        text: 'The aroma of roasted chana dal and garlic when I opened the pouch was amazing. Eating hot idlis with ghee and this Podi every morning!',
        name: 'Rajesh V.',
        meta: 'Verified Purchaser · Bengaluru',
        photoUrl: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg',
        photoCaption: 'Perfect breakfast 😋',
        stars: 5,
        verified: true,
        tagBg: '#FFF0E0',
        tagFg: '#D2691E'
      },
      {
        id: 'r3',
        productId: 'p3',
        productName: 'Sunnunda Laddu',
        text: 'The pure cow ghee aroma and crunch of roasted urad dal laddus are unmatchable. My children finish the whole box in two days!',
        name: 'Ananya K.',
        meta: 'Verified Purchaser · Chennai',
        photoUrl: 'assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg',
        photoCaption: 'Kids loved it! 🎁',
        stars: 5,
        verified: true,
        tagBg: '#FEF3C7',
        tagFg: '#B45309'
      },
      {
        id: 'r4',
        productId: 'p4',
        productName: 'Gongura Pachadi',
        text: 'Being away from Andhra for 15 years, getting authentic sour & spicy Gongura Pachadi with hot steamed rice and raw onion is pure heavenly bliss.',
        name: 'Venkatesh P.',
        meta: 'Verified Purchaser · Mumbai',
        photoUrl: 'assets/images/banner_1.jpg',
        photoCaption: 'Tastes like home 🌿',
        stars: 5,
        verified: true,
        tagBg: '#DCFCE7',
        tagFg: '#166534'
      },
      {
        id: 'r5',
        productId: 'p5',
        productName: 'Kara Murukku',
        text: 'Super crispy, perfect spiciness, and not greasy at all! The handmade spiral texture is crisp and pairs so well with evening filter coffee.',
        name: 'Kavitha R.',
        meta: 'Verified Purchaser · Visakhapatnam',
        photoUrl: 'assets/images/karam_janthukalu_murukku_strings_snack.jpg',
        photoCaption: 'Tea time crunch ☕',
        stars: 5,
        verified: true,
        tagBg: '#FEF9C3',
        tagFg: '#854D0E'
      }
    ]
  }
});

const req = http.request(
  {
    hostname: 'api.adhvaithafoods.in',
    port: 80,
    path: '/app_settings.php?doc_id=reviews',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  },
  res => {
    let d = '';
    res.on('data', c => (d += c));
    res.on('end', () => console.log('Response for reviews:', d));
  }
);

req.on('error', console.error);
req.write(payload);
req.end();
