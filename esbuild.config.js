const { build } = require('esbuild');
const { copy } = require('fs-extra');
const fs = require('fs-extra');
// const  envFilePlugin  = require('esbuild-envfile-plugin'); 
const dotenv = require('dotenv');
const envVars = dotenv.config().parsed;

async function copyPublicFolder() {
  await copy('public', 'dist/public');
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
    external: ['pg-hstore'],
    define: {
      'process.env.DATABASE_URL': JSON.stringify(envVars.DATABASE_URL)
    },
  });

  console.log('Copying public folder');
  await copyPublicFolder();

  console.log('Copying views folder');
  await copyViewsFolder();

  console.log('Copying .env file');
  await copyEnvFile();

  console.log('Build complete');
}

buildApp().catch((err) => {
  console.error(err);
  process.exit(1);
});
