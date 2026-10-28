const fs = require('fs');
const path = require('path');

const brainDir = 'C:/Users/DELL/.gemini/antigravity-ide/brain/c7866afa-9c80-4f45-b18a-471e7d0c784e';

const banners = [
  { source: path.join(brainDir, 'ad_banner_pickles_zepto_1793179731022.jpg'), targetName: 'banner_1.jpg' },
  { source: path.join(brainDir, 'ad_banner_podis_zepto_1793179764459.jpg'), targetName: 'banner_2.jpg' },
  { source: path.join(brainDir, 'ad_banner_sweets_zepto_1793179791540.jpg'), targetName: 'banner_3.jpg' },
  { source: path.join(brainDir, 'ad_banner_snacks_zepto_1793179824327.jpg'), targetName: 'banner_4.jpg' }
];

const targetDirs = [
  'C:/Users/DELL/OneDrive/Documents/adhvaitha_web_App_AdminDashboard/public/assets/images',
  'C:/Users/DELL/OneDrive/Documents/adhvaitha_web_App_AdminDashboard/public/images/products',
  'C:/Users/DELL/OneDrive/Documents/adhvaitha_web_App_AdminDashboard/public/images/images/products',
  'C:/Users/DELL/Documents/adhvaitha_pickles_app/assets/images'
];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  banners.forEach(b => {
    if (fs.existsSync(b.source)) {
      const dest = path.join(dir, b.targetName);
      fs.copyFileSync(b.source, dest);
      console.log(`Copied ${b.targetName} -> ${dest}`);
    } else {
      console.error(`Source not found: ${b.source}`);
    }
  });
});
