
import { resolve } from 'path';
import { Config } from './lib/config';
import { deploy } from './lib/deploy';
import { homedir } from 'node:os';

function buildConfig(props: {
  clientName: string;
  backendName: string;
  prod: boolean;
}): Config {

  // ~/GolandProjects/superyard
  const deployRootDir = resolve(
    homedir(),
    'GolandProjects',
    props.backendName,
  );

  // ~/GolandProjects/ftacademy/web/template/next.html
  const deployHtmlDir = resolve(
    deployRootDir,
    'web/template',
  );

  const deployAssetDir = props.prod
    // To server.
    // ~/svn-online/ft-interact/superyard/next
  ? resolve(
      homedir(),
      'svn-online/ft-interact/superyard',
      props.clientName,
    )
  // To dev folder
  : resolve(
      deployRootDir,
      'build/public/static/frontend',
      props.clientName
    );

  return {
    sourceHtmlFile: resolve(process.cwd(), 'dist/index.html'),
    sourceJsFile: `dist/assets/*.js`,
    sourceCssFile: `dist/assets/*.css`,

    deployRootDir,
    deployHtmlDir,
    deployAssetDir,

    staticPrefix: `/static/superyard/${props.clientName}`,
    packageDir: process.cwd(),

    targetHtmlFile: resolve(process.cwd(), `dist/${props.clientName}.html`),
    targetVersionFile: resolve(process.cwd(), `dist/client_version_${props.clientName}`),
  }
}

deploy(buildConfig({
  clientName: 'next',
  backendName: 'superyard',
  prod: true,
}))
  .catch(err => {
    console.error(err)
  });
