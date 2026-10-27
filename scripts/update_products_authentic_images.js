const productToImageMap = {
  'usiri_pickle': 'assets/images/usirikaya_pickle.png',
  'uppava': 'assets/images/uppava.png',
  'tomato_chilli_papad': 'assets/images/tomato_appadalu.png',
  'thill_patti': 'assets/images/nuvvula_chikki.png',
  'sweet_chekki': 'assets/images/dry_fruit_chikki.png',
  'sunnunda_laddu': 'assets/images/sunnundalu.png',
  'special_kura_karam_podi': 'assets/images/special_kura_karam_podi.png',
  'special_idli_karam_podi': 'assets/images/special_idli_karam_podi.png',
  'sambhar_masala_powder': 'assets/images/sambar_podi.png',
  'rice_papad': 'assets/images/biyyam_vadiyalu.png',
  'putnala_karam_podi': 'assets/images/putnala_karam_podi.png',
  'palli_patti': 'assets/images/palli_chikki.png',
  'onion_whills': 'assets/images/onion_chakra_vadiyalu.png',
  'nuvvula_papad': 'assets/images/nuvvula_papad.png',
  'mutton_masala_powder': 'assets/images/mutton_masala.png',
  'munagaku_karam_podi_moringa_leaves_spice_powder': 'assets/images/moringa_karam_podi.png',
  'munagaku_karam_podi': 'assets/images/moringa_karam_podi.png',
  'millets_laddu': 'assets/images/millet_laddu.png',
  'menthi_podi': 'assets/images/menthi_podi.png',
  'kova_gulam_jamun': 'assets/images/gulab_jamun.png',
  'khara_mixture': 'assets/images/mixture.png',
  'karvepaku_karam_podi': 'assets/images/karivepaku_podi.png',
  'karam_janthukalu': 'assets/images/chakralu.png',
  'haldi_powder': 'assets/images/turmeric_powder.png',
  'gondh_laddu': 'assets/images/gond_laddu.png',
  'garam_masala_powder': 'assets/images/garam_masala.png',
  'garam_masala': 'assets/images/garam_masala.png',
  'dry_fruits_laddu': 'assets/images/dry_fruit_laddu.png',
  'daniya_powder': 'assets/images/dhaniya_powder.png',
  'chicken_masala_powder': 'assets/images/chicken_masala.png',
  'chakinalu': 'assets/images/chakralu.png',
  'bundhi': 'assets/images/karam_boondi.png',
  'bellam_avakaya': 'assets/images/avakaya_pickle.png',
  'allu_chips': 'assets/images/potato_chips.png',
  'allam_velluli_pickle': 'assets/images/velluli_pickle.png',
  'allam_velluli_karam_podi': 'assets/images/allam_velluli_karam.png'
};

async function updateAllProducts() {
  console.log('Fetching products from BigRock backend...');
  const res = await fetch('http://api.adhvaithafoods.in/app_products.php');
  const json = await res.json();
  const products = json.products || json;

  console.log(`Fetched ${products.length} products. Starting image update...`);

  let updatedCount = 0;
  for (const product of products) {
    const authenticImage = productToImageMap[product.id];
    if (authenticImage) {
      console.log(`Updating ${product.id} (${product.name}) -> ${authenticImage}`);
      const payload = {
        ...product,
        image: authenticImage
      };

      try {
        const postRes = await fetch('http://api.adhvaithafoods.in/app_products.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const postJson = await postRes.json();
        if (postJson.success) {
          updatedCount++;
        } else {
          console.warn(`Failed to update ${product.id}:`, postJson);
        }
      } catch (err) {
        console.error(`Error updating ${product.id}:`, err.message);
      }
    } else {
      console.log(`No explicit mapping for ${product.id}, leaving as is.`);
    }
  }

  console.log(`Successfully updated ${updatedCount} products with authentic AmbhuJakshi images!`);
}

updateAllProducts();
