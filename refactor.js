const fs = require('fs');
const path = require('path');

const replacements = [
  // Portuguese terms
  { from: /Espaço/g, to: 'Espaço' },
  { from: /Espaços/g, to: 'Espaços' },
  { from: /espaço/g, to: 'espaço' },
  { from: /espaços/g, to: 'espaços' },
  { from: /Usuário/g, to: 'Usuário' },
  { from: /Usuarios/g, to: 'Usuarios' },
  { from: /usuario/g, to: 'usuario' },
  { from: /usuarios/g, to: 'usuarios' },
  { from: /Coworking/g, to: 'Coworking' },
  { from: /coworking/g, to: 'coworking' },

  // Code terms
  { from: /Espaco/g, to: 'Espaco' },
  { from: /espaco/g, to: 'espaco' },
  { from: /Espacos/g, to: 'Espacos' },
  { from: /espacos/g, to: 'espacos' },
  { from: /Usuário/g, to: 'Usuario' },
  { from: /usuario/g, to: 'usuario' },
  { from: /Usuarios/g, to: 'Usuarios' },
  { from: /usuarios/g, to: 'usuarios' },
  { from: /Reserva/g, to: 'Reserva' },
  { from: /reserva/g, to: 'reserva' },
  { from: /Reservas/g, to: 'Reservas' },
  { from: /reservas/g, to: 'reservas' },
];

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  for (const r of replacements) {
    newContent = newContent.replace(r.from, r.to);
  }
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated content: ${filePath}`);
  }
}

function processDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    // Skip node_modules, .git, .next, dist
    if (['node_modules', '.git', '.next', 'dist'].includes(item)) continue;
    
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (stat.isFile() && /\.(ts|tsx|js|jsx|json|md|html|css)$/.test(item)) {
      replaceInFile(fullPath);
    }
  }
}

// Rename files and dirs
function renamePaths(dir) {
    let items = fs.readdirSync(dir);
    for (let item of items) {
      if (['node_modules', '.git', '.next', 'dist'].includes(item)) continue;
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      let newItemName = item;
      // Do replacements on filename
      for (const r of replacements) {
        // We shouldn't replace regex blindly on strings, but since filenames don't have spaces usually, let's use string replace
        newItemName = newItemName.replace(/espaco/g, 'espaco');
        newItemName = newItemName.replace(/espacos/g, 'espacos');
        newItemName = newItemName.replace(/usuario/g, 'usuario');
        newItemName = newItemName.replace(/usuarios/g, 'usuarios');
        newItemName = newItemName.replace(/reserva/g, 'reserva');
        newItemName = newItemName.replace(/reservas/g, 'reservas');
      }
      
      let newPath = path.join(dir, newItemName);
      if (fullPath !== newPath) {
        fs.renameSync(fullPath, newPath);
        console.log(`Renamed: ${fullPath} -> ${newPath}`);
      }
      
      if (stat.isDirectory()) {
        renamePaths(newPath); // process new dir name
      }
    }
}

const basePath = 'C:/Users/kayky/Downloads/Loca-oSalas';
console.log("Renaming paths...");
renamePaths(basePath);
console.log("Replacing contents...");
processDir(basePath);
console.log("Done.");
