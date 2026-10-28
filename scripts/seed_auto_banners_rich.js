const http = require('http');

const payload = JSON.stringify({
  doc_id: 'auto_banners',
  content: {
    banners: [
      {
        id: 'b1',
        image: 'assets/images/banner_1.jpg',
        title: 'Heritage Pickles',
        subtitle: 'Sun-dried spices & cold-pressed oil',
        link: {
          category: 'Pickles'
        }
      },
      {
        id: 'b2',
        image: 'assets/images/banner_2.jpg',
        title: 'Stone-Ground Podis',
        subtitle: 'Aromatic gun powders & Andhra karams',
        link: {
          category: 'Powders'
        }
      },
      {
        id: 'b3',
        image: 'assets/images/banner_3.jpg',
        title: 'Traditional Sweets',
        subtitle: 'Pure ghee, organic jaggery & dry fruits',
        link: {
          category: 'Sweets'
        }
      },
      {
        id: 'b4',
        image: 'assets/images/banner_4.jpg',
        title: 'Handcrafted Snacks',
        subtitle: 'Crispy murukku, mixture & spiced chips',
        link: {
          category: 'Snacks'
        }
      }
    ]
  }
});

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
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => console.log('Response for auto_banners:', d));
  }
);

req.on('error', console.error);
req.write(payload);
req.end();
