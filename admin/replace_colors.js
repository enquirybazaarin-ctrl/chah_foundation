const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Primary button/accent colors
    content = content.replace(/\bbg-blue-600\b/g, 'bg-primary text-primary-foreground');
    content = content.replace(/\bbg-blue-500\b/g, 'bg-primary/90');
    content = content.replace(/\bbg-blue-700\b/g, 'bg-primary/80');
    content = content.replace(/\bhover:bg-blue-500\b/g, 'hover:bg-primary/90');
    content = content.replace(/\bhover:bg-blue-700\b/g, 'hover:bg-primary/90');
    content = content.replace(/\btext-blue-600\b/g, 'text-primary');
    content = content.replace(/\bhover:text-blue-600\b/g, 'hover:text-primary');
    content = content.replace(/\bfocus:ring-blue-500\b/g, 'focus:ring-primary');
    content = content.replace(/\bfocus:ring-blue-600\b/g, 'focus:ring-primary');
    content = content.replace(/\bfocus:border-blue-500\b/g, 'focus:border-primary');
    content = content.replace(/\border-blue-600\b/g, 'border-primary');
    content = content.replace(/\boutline-blue-600\b/g, 'outline-primary');
    
    // Sidebar colors mapping to Secondary (#00339b)
    if (filePath.includes('Sidebar.tsx')) {
      content = content.replace(/\bbg-gray-900\b/g, 'bg-secondary text-secondary-foreground');
      content = content.replace(/\bbg-gray-800\b/g, 'bg-primary/20 text-primary');
      content = content.replace(/\bhover:bg-gray-800\b/g, 'hover:bg-primary/20 hover:text-primary');
      content = content.replace(/\btext-white\b/g, 'text-secondary-foreground');
      content = content.replace(/\btext-gray-300\b/g, 'text-secondary-foreground/80');
      content = content.replace(/\btext-gray-400\b/g, 'text-secondary-foreground/60');
      content = content.replace(/\bborder-gray-800\b/g, 'border-secondary/20');
      content = content.replace(/\bgroup-hover:text-gray-300\b/g, 'group-hover:text-primary');
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
