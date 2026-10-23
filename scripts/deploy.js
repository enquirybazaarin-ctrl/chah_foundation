/**
 * CHAH Foundation — Production Automated Deployer for Hostinger FTPS
 * 
 * Features:
 * - High-speed FTPS with automatic reconnect and resume on socket blips
 * - Symlink-aware directory navigation (handles Hostinger's hbuilds/current symlink)
 * - Smart diffing: skips unchanged static chunks by file size
 * - Excludes non-production files: cache, dev, logs, diagnostics, standalone, types
 * - STRICT SAFETY: Never overwrites server .env or uploaded media files
 * - Touches tmp/restart.txt to restart Hostinger CloudLinux Passenger
 */

const fs = require('fs');
const path = require('path');
const ftp = require('basic-ftp');

const CONFIG = {
  host: process.env.HOSTINGER_FTP_HOST || '145.79.58.42',
  port: parseInt(process.env.HOSTINGER_FTP_PORT || '21', 10),
  user: process.env.HOSTINGER_FTP_USER || 'u605717783',
  password: process.env.HOSTINGER_FTP_PASSWORD || process.env.HOSTINGER_SSH_PASSWORD || 'ChahDeploy#2026!'
};

const NEXT_EXCLUDE_DIRS = [
  'node_modules', '.git', 'cache', 'dev', 'diagnostics', 'standalone', 'types', 'build', 'trace', 'trace-build', 'turbopack'
];

const APPS = {
  website: {
    name: 'Website (new.chahfoundation.com)',
    localDir: path.join(__dirname, '..', 'website'),
    remoteDir: '/domains/new.chahfoundation.com/hbuilds/current/nodejs',
    syncPlan: [
      { type: 'files', localSub: '', files: ['server.js', 'package.json'] },
      { type: 'files', localSub: '.next', files: [
        'BUILD_ID', 'package.json', 'build-manifest.json', 'prerender-manifest.json',
        'routes-manifest.json', 'images-manifest.json', 'app-path-routes-manifest.json',
        'required-server-files.json', 'required-server-files.js', 'export-marker.json',
        'fallback-build-manifest.json'
      ]},
      { type: 'dir', localSub: '.next/server', remoteSub: '.next/server', excludeDirs: NEXT_EXCLUDE_DIRS },
      { type: 'dir', localSub: '.next/static', remoteSub: '.next/static', excludeDirs: NEXT_EXCLUDE_DIRS },
      { type: 'dir', localSub: 'public', remoteSub: 'public', excludeDirs: ['.git'] },
      { type: 'dir', localSub: 'tmp', remoteSub: 'tmp', excludeDirs: [] }
    ],
    alwaysUpload: ['BUILD_ID', 'server.js', 'package.json', 'restart.txt']
  },
  admin: {
    name: 'Admin Portal (admin.chahfoundation.com)',
    localDir: path.join(__dirname, '..', 'admin'),
    remoteDir: '/domains/admin.chahfoundation.com/hbuilds/current/nodejs',
    syncPlan: [
      { type: 'files', localSub: '', files: ['server.js', 'package.json'] },
      { type: 'files', localSub: '.next', files: [
        'BUILD_ID', 'package.json', 'build-manifest.json', 'prerender-manifest.json',
        'routes-manifest.json', 'images-manifest.json', 'app-path-routes-manifest.json',
        'required-server-files.json', 'required-server-files.js', 'export-marker.json',
        'fallback-build-manifest.json'
      ]},
      { type: 'dir', localSub: '.next/server', remoteSub: '.next/server', excludeDirs: NEXT_EXCLUDE_DIRS },
      { type: 'dir', localSub: '.next/static', remoteSub: '.next/static', excludeDirs: NEXT_EXCLUDE_DIRS },
      { type: 'dir', localSub: 'public', remoteSub: 'public', excludeDirs: ['.git'] },
      { type: 'dir', localSub: 'tmp', remoteSub: 'tmp', excludeDirs: [] }
    ],
    alwaysUpload: ['BUILD_ID', 'server.js', 'package.json', 'restart.txt']
  },
  backend: {
    name: 'Backend API (api.chahfoundation.com)',
    localDir: path.join(__dirname, '..', 'backend'),
    remoteDir: '/domains/api.chahfoundation.com/hbuilds/current/nodejs',
    syncPlan: [
      { type: 'files', localSub: '', files: ['server.js', 'package.json'] },
      { type: 'dir', localSub: 'dist', remoteSub: 'dist', excludeDirs: ['node_modules', '.git'] },
      { type: 'dir', localSub: 'prisma', remoteSub: 'prisma', excludeDirs: ['node_modules', '.git'] },
      { type: 'dir', localSub: 'tmp', remoteSub: 'tmp', excludeDirs: [] }
    ],
    alwaysUpload: ['server.js', 'package.json', 'restart.txt']
  }
};

async function createClient() {
  const client = new ftp.Client();
  client.ftp.timeout = 60000;
  await client.access({
    host: CONFIG.host,
    port: CONFIG.port,
    user: CONFIG.user,
    password: CONFIG.password,
    secure: true,
    secureOptions: { rejectUnauthorized: false }
  });
  return client;
}

async function safeNavigate(clientHolder, remoteDir) {
  const target = remoteDir.startsWith('/') ? remoteDir : '/' + remoteDir;
  if (clientHolder.client.closed) {
    clientHolder.client = await createClient();
  }
  try {
    await clientHolder.client.cd(target);
  } catch (err) {
    const parts = target.split('/').filter(Boolean);
    let cur = '';
    for (const part of parts) {
      cur += '/' + part;
      try {
        await clientHolder.client.cd(cur);
      } catch (_) {
        try {
          await clientHolder.client.sendIgnoringError('MKD ' + part);
        } catch (_) {}
        await clientHolder.client.cd(cur);
      }
    }
  }
}

async function executeWithRetry(clientHolder, targetDir, fn, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (clientHolder.client.closed) {
        clientHolder.client = await createClient();
        if (targetDir) await safeNavigate(clientHolder, targetDir);
      }
      return await fn(clientHolder.client);
    } catch (err) {
      const isSocketError = err.message.includes('ECONNRESET') || 
                            err.message.includes('closed') || 
                            err.message.includes('ETIMEDOUT') ||
                            err.code === 'ECONNRESET';
      if (!isSocketError && attempt === maxRetries) throw err;

      console.warn(`    ⚠️ Connection dropped (${err.message}). Auto-reconnecting (attempt ${attempt}/${maxRetries})...`);
      try { clientHolder.client.close(); } catch (_) {}
      await new Promise(r => setTimeout(r, 1500));
      clientHolder.client = await createClient();
      if (targetDir) {
        await safeNavigate(clientHolder, targetDir);
      }
      if (attempt === maxRetries) throw err;
    }
  }
}

async function syncDir(clientHolder, localDir, remoteDir, appConfig, excludeDirs, stats) {
  const targetRemote = remoteDir.startsWith('/') ? remoteDir : '/' + remoteDir;
  await safeNavigate(clientHolder, targetRemote);

  const remoteEntries = await executeWithRetry(clientHolder, targetRemote, client => client.list());
  const remoteMap = new Map();
  for (const entry of remoteEntries) {
    remoteMap.set(entry.name, entry);
  }

  const localEntries = fs.readdirSync(localDir, { withFileTypes: true });

  // 1. Files
  for (const entry of localEntries) {
    if (entry.isFile()) {
      const fileName = entry.name;
      if (fileName.startsWith('.env') || fileName.endsWith('.log') || fileName.endsWith('.tsbuildinfo') || fileName.endsWith('.map')) {
        continue;
      }

      const localFilePath = path.join(localDir, fileName);
      const localStat = fs.statSync(localFilePath);
      const remoteFile = remoteMap.get(fileName);

      const isAlways = appConfig.alwaysUpload.includes(fileName);
      const isServerDir = localDir.replace(/\\/g, '/').includes('.next/server');
      const isCriticalServerFile = isServerDir && (
        fileName.endsWith('manifest.js') || 
        fileName.endsWith('.json') || 
        fileName === 'page.js' || 
        fileName.startsWith('page_') ||
        fileName.endsWith('.rsc')
      );
      const isTimeNewer = Boolean(remoteFile && remoteFile.modifiedAt && (localStat.mtimeMs > remoteFile.modifiedAt.getTime() + 3000));
      const needsUpload = isAlways || isCriticalServerFile || !remoteFile || remoteFile.size !== localStat.size || isTimeNewer;

      if (needsUpload) {
        process.stdout.write(`  ⬆️ [Upload] ${path.basename(localDir)}/${fileName} (${(localStat.size / 1024).toFixed(1)} KB)... `);
        await executeWithRetry(clientHolder, targetRemote, client => client.uploadFrom(localFilePath, fileName));
        process.stdout.write('✅\n');
        stats.uploaded++;
        stats.bytesUploaded += localStat.size;
      } else {
        stats.skipped++;
      }
    }
  }

  // 2. Subdirectories
  for (const entry of localEntries) {
    if (entry.isDirectory()) {
      const dirName = entry.name;
      if (excludeDirs.includes(dirName)) {
        continue;
      }

      const subLocal = path.join(localDir, dirName);
      const subRemote = `${targetRemote}/${dirName}`;
      await syncDir(clientHolder, subLocal, subRemote, appConfig, excludeDirs, stats);
      await safeNavigate(clientHolder, targetRemote);
    }
  }
}

async function deployApp(appKey) {
  const appConfig = APPS[appKey];
  if (!appConfig) {
    throw new Error(`Unknown app key: ${appKey}. Available: website, admin, backend, all`);
  }

  console.log(`\n============================================================`);
  console.log(`🚀 DEPLOYING: ${appConfig.name}`);
  console.log(`📍 Local Path:  ${appConfig.localDir}`);
  console.log(`📍 Remote Path: ${appConfig.remoteDir}`);
  console.log(`============================================================`);

  if (!fs.existsSync(appConfig.localDir)) {
    throw new Error(`Local directory does not exist: ${appConfig.localDir}`);
  }

  // Ensure local tmp/restart.txt exists with fresh timestamp
  const tmpDir = path.join(appConfig.localDir, 'tmp');
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  fs.writeFileSync(path.join(tmpDir, 'restart.txt'), `Restart triggered at: ${new Date().toISOString()}\n`);

  const clientHolder = { client: await createClient() };
  const stats = { uploaded: 0, skipped: 0, bytesUploaded: 0 };
  const startTime = Date.now();

  try {
    for (const item of appConfig.syncPlan) {
      if (item.type === 'files') {
        const localFolder = item.localSub ? path.join(appConfig.localDir, item.localSub) : appConfig.localDir;
        const remoteFolder = item.localSub ? `${appConfig.remoteDir}/${item.localSub}` : appConfig.remoteDir;

        if (fs.existsSync(localFolder)) {
          console.log(`\n📄 Syncing files in ${item.localSub || 'root'}...`);
          await safeNavigate(clientHolder, remoteFolder);
          const remoteList = await executeWithRetry(clientHolder, remoteFolder, client => client.list());
          const remoteMap = new Map();
          for (const r of remoteList) remoteMap.set(r.name, r);

          for (const fileName of item.files) {
            const localFilePath = path.join(localFolder, fileName);
            if (fs.existsSync(localFilePath)) {
              const localStat = fs.statSync(localFilePath);
              const remoteFile = remoteMap.get(fileName);
              const isAlways = appConfig.alwaysUpload.includes(fileName) || item.localSub === '.next';
              const isTimeNewer = Boolean(remoteFile && remoteFile.modifiedAt && (localStat.mtimeMs > remoteFile.modifiedAt.getTime() + 3000));

              if (isAlways || !remoteFile || remoteFile.size !== localStat.size || isTimeNewer) {
                process.stdout.write(`  ⬆️ [File] ${fileName} (${(localStat.size / 1024).toFixed(1)} KB)... `);
                await executeWithRetry(clientHolder, remoteFolder, client => client.uploadFrom(localFilePath, fileName));
                process.stdout.write('✅\n');
                stats.uploaded++;
                stats.bytesUploaded += localStat.size;
              } else {
                stats.skipped++;
              }
            }
          }
        }
      } else if (item.type === 'dir') {
        const localFolder = path.join(appConfig.localDir, item.localSub);
        const remoteFolder = `${appConfig.remoteDir}/${item.remoteSub}`;

        if (fs.existsSync(localFolder)) {
          console.log(`\n📁 Syncing directory: ${item.localSub}/...`);
          await syncDir(clientHolder, localFolder, remoteFolder, appConfig, item.excludeDirs, stats);
        }
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    const mbUploaded = (stats.bytesUploaded / (1024 * 1024)).toFixed(2);
    console.log(`\n✨ Successfully deployed ${appConfig.name}!`);
    console.log(`📊 Summary: ${stats.uploaded} files uploaded (${mbUploaded} MB), ${stats.skipped} files skipped (unchanged) in ${duration}s.`);
    console.log(`🔄 Hostinger Passenger restart.txt updated.`);
  } finally {
    try { clientHolder.client.close(); } catch (_) {}
  }
}

async function main() {
  const args = process.argv.slice(2);
  let targetApp = 'all';

  for (const arg of args) {
    if (arg.startsWith('--app=')) {
      targetApp = arg.replace('--app=', '').trim().toLowerCase();
    }
  }

  console.log(`⚡ CHAH Foundation Automated Hostinger Deployment Started`);
  console.log(`Target: ${targetApp}`);

  if (targetApp === 'all') {
    await deployApp('backend');
    await deployApp('website');
    await deployApp('admin');
  } else {
    await deployApp(targetApp);
  }

  console.log(`\n🎉 All deployments completed successfully!`);
}

main().catch(err => {
  console.error(`\n❌ Deployment Failed:`, err);
  process.exit(1);
});
