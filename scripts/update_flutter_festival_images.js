const fs = require('fs');

// 1. Update widgets/festival_section.dart
const festPath = 'C:/Users/DELL/Documents/adhvaitha_pickles_app/lib/widgets/festival_section.dart';
if (fs.existsSync(festPath)) {
  let content = fs.readFileSync(festPath, 'utf8').replace(/\r\n/g, '\n');
  if (!content.includes("import '../image_util.dart';")) {
    content = content.replace(
      "import 'loading_spinner.dart';",
      "import 'loading_spinner.dart';\nimport '../image_util.dart';"
    );
  }
  const oldImgRegex = /Widget _img\(String url, \{BoxFit fit = BoxFit\.cover, Alignment alignment = Alignment\.center\}\) \{[\s\S]*?\n  \}/;
  if (oldImgRegex.test(content)) {
    content = content.replace(
      oldImgRegex,
      "Widget _img(String url, {BoxFit fit = BoxFit.cover, Alignment alignment = Alignment.center}) {\n    return buildSmartImage(url, fit: fit, alignment: alignment);\n  }"
    );
    fs.writeFileSync(festPath, content, 'utf8');
    console.log('Successfully updated festival_section.dart to use buildSmartImage!');
  }
}

// 2. Update widgets/sankranti_festival_section.dart
const sankrantiPath = 'C:/Users/DELL/Documents/adhvaitha_pickles_app/lib/widgets/sankranti_festival_section.dart';
if (fs.existsSync(sankrantiPath)) {
  let content = fs.readFileSync(sankrantiPath, 'utf8').replace(/\r\n/g, '\n');
  if (!content.includes("import '../image_util.dart';")) {
    content = content.replace(
      "import '../navigation_util.dart';",
      "import '../navigation_util.dart';\nimport '../image_util.dart';"
    );
  }
  const oldBuildImgRegex = /Widget _buildImage\(String path\) \{[\s\S]*?\n  \}/;
  if (oldBuildImgRegex.test(content)) {
    content = content.replace(
      oldBuildImgRegex,
      "Widget _buildImage(String path) => buildSmartImage(path, fit: BoxFit.cover);"
    );
    fs.writeFileSync(sankrantiPath, content, 'utf8');
    console.log('Successfully updated sankranti_festival_section.dart to use buildSmartImage!');
  }
}
