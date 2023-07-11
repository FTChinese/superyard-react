import { renderIndex } from './lib/render';
import { resolve } from 'node:path';

async function generateFiles() {
  const to = resolve(process.cwd(), 'index.html');

  await renderIndex({
    baseHref: 'next',
    title: 'Superyard - FT中文网',
    footerMatrix: false,
    stripe: false,
    gtag: false,
    to,
  });

  console.log(`Dev html updated: ${to}`);
}

generateFiles()
  .catch(err => {
    console.error(err)
  });
