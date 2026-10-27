const fs = require('fs');
const file = 'C:/Users/DELL/Documents/adhvaitha_pickles_app/lib/home_page.dart';
let content = fs.readFileSync(file, 'utf8');

const target = "videoUrl: (homeVideoConfig['header_video_enabled'] != false && homeVideoConfig['enabled'] != false)";
const replacement = "videoUrl: (homeVideoConfig['header_video_enabled'] != false)";

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content, 'utf8');
  console.log('SUCCESS: decoupled header video check in Flutter home_page.dart');
} else {
  console.log('NOTE: target string not found or already replaced');
}
