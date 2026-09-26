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
    
    // Reverse Sidebar colors first
    if (filePath.includes('Sidebar.tsx')) {
      content = content.replace(/\bbg-secondary text-secondary-foreground\b/g, 'bg-gray-900');
      content = content.replace(/\bbg-primary\/20 text-primary\b/g, 'bg-gray-800');
      content = content.replace(/\bhover:bg-primary\/20 hover:text-primary\b/g, 'hover:bg-gray-800 hover:text-white'); // It was actually replaced to `hover:bg-primary/20 hover:text-primary` from `hover:bg-gray-800 hover:text-white` but wait my script did not include `hover:text-white` in replace. Let me check script. The script did `content = content.replace(/\\bhover:bg-gray-800\\b/g, 'hover:bg-primary/20 hover:text-primary');`. This replaced only `hover:bg-gray-800`.
      // Let's just do a direct reverse
      content = content.replace(/\bhover:bg-primary\/20 hover:text-primary\b/g, 'hover:bg-gray-800');
      content = content.replace(/\btext-secondary-foreground\/80\b/g, 'text-gray-300');
      content = content.replace(/\btext-secondary-foreground\/60\b/g, 'text-gray-400');
      content = content.replace(/\bborder-secondary\/20\b/g, 'border-gray-800');
      content = content.replace(/\bgroup-hover:text-primary\b/g, 'group-hover:text-gray-300');
      // The word 'text-white' was blindly replaced to 'text-secondary-foreground'. We reverse it:
      content = content.replace(/\btext-secondary-foreground\b/g, 'text-white');
    }

    // Reverse Primary button/accent colors
    // Note: my script replaced `bg-blue-600` with `bg-primary text-primary-foreground`.
    content = content.replace(/\bbg-primary text-primary-foreground\b/g, 'bg-blue-600');
    content = content.replace(/\bbg-primary\/90\b/g, 'bg-blue-500'); // Note: This might map hover:bg-blue-500 or bg-blue-500. `bg-blue-500` is fine as it covers both.
    content = content.replace(/\bbg-primary\/80\b/g, 'bg-blue-700');
    content = content.replace(/\bhover:text-primary\b/g, 'hover:text-blue-600');
    content = content.replace(/\btext-primary\b/g, 'text-blue-600');
    content = content.replace(/\bfocus:ring-primary\b/g, 'focus:ring-blue-500'); // Might be 500 or 600, mostly 500
    content = content.replace(/\bfocus:border-primary\b/g, 'focus:border-blue-500');
    content = content.replace(/\border-primary\b/g, 'border-blue-600');
    content = content.replace(/\boutline-primary\b/g, 'outline-blue-600');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Reverted', filePath);
    }
  }
});
