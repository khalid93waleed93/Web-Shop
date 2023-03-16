const { build } = require('esbuild');
const { copy } = require('fs-extra');
const fs = require('fs-extra');

async function copyPublicFolder() {
  await copy('public', 'dist/public');
}

async function copyViewsFolder() {
  await copy('views', 'dist/views');
}
async function buildApp() {
    console.log('Building app');
  
    // Ensure dist folder
    await fs.ensureDir('dist');
  
    await build({
      entryPoints: ['server.ts'],
      bundle: true,
      platform: 'node',
      target: ['node14'],
      outfile: 'dist/server.js',
    });
  
    console.log('Copying public folder');
    await copyPublicFolder();
  
    console.log('Copying views folder');
    await copyViewsFolder();
  
    console.log('Build complete');
  }
  buildApp().catch((err) => {
    console.error(err);
    process.exit(1);
  });