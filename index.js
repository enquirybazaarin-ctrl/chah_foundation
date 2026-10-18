// CHAH Foundation Backend Entry Failsafe
const fs = require('fs');
if (fs.existsSync('./dist/server.js')) {
  require('./dist/server.js');
} else if (fs.existsSync('./backend/dist/server.js')) {
  require('./backend/dist/server.js');
} else {
  console.error("Entry file dist/server.js not found. Please run 'npm run build' first.");
}

