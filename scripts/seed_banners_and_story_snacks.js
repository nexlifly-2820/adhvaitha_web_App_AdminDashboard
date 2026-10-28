const http = require('http');

function postDoc(docData) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(docData);
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
          resolve(responseData);
        });
      }
    );
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  // 1. Auto Banner Carousel (doc_id: "auto_banners")
  const autoBannersPayload = {
    doc_id: 'auto_banners',
    content: {
      banners: [
        {
          id: 'b1',
          image: 'assets/images/banner_1.jpg',
          link: {
            category: 'Pickles'
          }
        },
        {
          id: 'b2',
          image: 'assets/images/banner_2.jpg',
          link: {
            category: 'Powders'
          }
        },
        {
          id: 'b3',
          image: 'assets/images/banner_3.jpg',
          link: {
            category: 'Sweets'
          }
        },
        {
          id: 'b4',
          image: 'assets/images/banner_4.jpg',
          link: {
            category: 'Snacks'
          }
        }
      ]
    }
  };

  console.log('Posting auto_banners...');
  const res1 = await postDoc(autoBannersPayload);
  console.log('auto_banners response:', res1);

  // 2. Snacks Story Flip (doc_id: "story_snacks")
  const storySnacksPayload = {
    doc_id: 'story_snacks',
    content: {
      list: [
        {
          id: 'murukku',
          name: 'Kara Murukku',
          image: 'assets/images/karam_janthukalu_murukku_strings_snack.jpg',
          price: 129,
          story: 'A crispy spiral snack made from rice flour and urad dal, prepared in our family kitchen for festive evenings.',
          since: '1985',
          ingredients: [
            {
              name: 'Rice Flour',
              image: 'assets/images/rice_papad_crispy_rice_flour_papadums.jpg'
            },
            {
              name: 'Urad Dal',
              image: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg'
            },
            {
              name: 'Spices',
              image: 'assets/images/special_kura_karam_podi_all-purpose_curry_powder.jpg'
            }
          ]
        },
        {
          id: 'mixture',
          name: 'Khara Mixture',
          image: 'assets/images/khara_mixture_assorted_crunchy_savory_mix.jpg',
          price: 149,
          story: 'A delicious assortment of spiced boondi, peanuts, and sev tossed with roasted curry leaves in pure oil.',
          since: '1992',
          ingredients: [
            {
              name: 'Gram Flour',
              image: 'assets/images/bundhi_crispy_spiced_gram_flour_droplets.jpg'
            },
            {
              name: 'Peanuts',
              image: 'assets/images/palli_patti_peanut_and_jaggery_chikki.jpg'
            },
            {
              name: 'Curry Leaves',
              image: 'assets/images/karvepaku_karam_podi_curry_leaves_powder.jpg'
            }
          ]
        },
        {
          id: 'sunnunda',
          name: 'Sunnunda Laddu',
          image: 'assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg',
          price: 199,
          story: 'Traditional roasted urad dal laddus sweetened with organic bellam (jaggery) and rich cow ghee.',
          since: '1978',
          ingredients: [
            {
              name: 'Urad Dal',
              image: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg'
            },
            {
              name: 'Pure Ghee',
              image: 'assets/images/good_food_text.png'
            },
            {
              name: 'Bellam',
              image: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg'
            }
          ]
        },
        {
          id: 'chips',
          name: 'Banana Chips',
          image: 'assets/images/allu_chips_thinly_sliced_indian_potato_chips.jpg',
          price: 119,
          story: 'Thinly sliced raw bananas fried in cold-pressed coconut oil and sprinkled with sea salt & black pepper.',
          since: '1998',
          ingredients: [
            {
              name: 'Raw Banana',
              image: 'assets/images/allu_chips_thinly_sliced_indian_potato_chips.jpg'
            },
            {
              name: 'Coconut Oil',
              image: 'assets/images/good_food_text.png'
            },
            {
              name: 'Sea Salt',
              image: 'assets/images/uppava_traditional_salted_pickle.jpg'
            }
          ]
        }
      ]
    }
  };

  console.log('Posting story_snacks...');
  const res2 = await postDoc(storySnacksPayload);
  console.log('story_snacks response:', res2);
}

main().catch(console.error);
