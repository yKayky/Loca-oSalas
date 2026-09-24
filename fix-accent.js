const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    if (['node_modules', '.git', '.next', 'dist'].includes(item)) continue;
    
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (stat.isFile() && /\.(ts|tsx|js|jsx|json|md|html|css)$/.test(item)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content.replace(/usuario/g, 'usuario').replace(/Usuarios/g, 'Usuarios');
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated content: ${fullPath}`);
      }
    }
  }
}
processDir('C:/Users/kayky/Downloads/Loca-oSalas');
