const { build } = require('esbuild');
const { copy } = require('fs-extra');
const fs = require('fs-extra');
// const  envFilePlugin  = require('esbuild-envfile-plugin'); 
const dotenv = require('dotenv');
const envVars = dotenv.config().parsed;

async function copyPublicFolder() {
  await copy('public', 'dist/public');
}
async function copyDataFolder() {
  try {
    await copy('data', 'dist/data')
  } catch (error) {
    await fs.ensureDir('dist/data/invoices');
  }
  await copy('data', 'dist/data');
}
async function copyViewsFolder() {
  await copy('views', 'dist/views');
}

async function copyEnvFile() {
  await copy('.env', 'dist/.env');
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
    // external: ['pg-hstore'],
    external: ['vm2'],
    define: {
      'process.env.DATABASE_URL': JSON.stringify(envVars.DATABASE_URL),
      'process.env.MONGODB_URL': JSON.stringify(envVars.MONGODB_URL)
    },
  });

  console.log('Copying public folder');
  await copyPublicFolder();

  console.log('Copying views folder');
  await copyViewsFolder();

  console.log('Copying .env file');
  await copyEnvFile();

  console.log('Copying Data folder');
  await copyDataFolder();

  console.log('Build complete');
}

buildApp().catch((err) => {
  console.error(err);
  process.exit(1);
});
