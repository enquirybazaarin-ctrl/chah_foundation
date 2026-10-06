const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/DELL/Amit_Pandey_Work_Space/Cspa/website/src/components/home';
const files = [
  'FeaturedCampaignsSection.tsx',
  'KnowAboutUs.tsx',
  'WhatWeDoSection.tsx',
  'ImpactProjectsSection.tsx'
];

for (const file of files) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace emerald with lime
  content = content.replace(/emerald-600/g, 'lime-400');
  content = content.replace(/emerald-700/g, 'lime-500');
  content = content.replace(/emerald-800/g, 'lime-600');
  content = content.replace(/emerald-50\b/g, 'lime-50');
  content = content.replace(/emerald-100/g, 'lime-100');
  content = content.replace(/emerald-200/g, 'lime-200');
  content = content.replace(/emerald-300/g, 'lime-300');
  content = content.replace(/emerald-500/g, 'lime-400');
  
  // Replace text-white on lime buttons to text-gray-950 for contrast
  content = content.replace(/text-white/g, 'text-gray-950');
  
  fs.writeFileSync(filePath, content);
}
console.log('Done replacing colors.');
