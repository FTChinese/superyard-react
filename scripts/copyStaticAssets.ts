import { homedir } from 'os';
import { resolve } from 'path';
import * as shell from 'shelljs';
import { config } from './config';
import { CLIParser } from './lib/CLIParser';

const golandDir = `GolandProjects`;

const cli = (new CLIParser()).parse();

const serverProjectDir = resolve(
  homedir(),
  golandDir,
  'superyard',
);

const htmlOutDir = resolve(
  serverProjectDir,
  'web/template',
);

const jsCssOutDir = cli.isProd
  // To server.
  ? resolve(
      homedir(),
      'svn-online/ft-interact/superyard',
      config.projectNameClient
    )
  // To dev folder
  : resolve(
      serverProjectDir,
      'build/public/static/superyard',
      config.projectNameClient
    );

console.log(`Copy frontend assets to ${jsCssOutDir}`);
shell.mkdir('-p', jsCssOutDir);
shell.cp(`dist/assets/*.js`, jsCssOutDir);
shell.cp(`dist/assets/*.css`, jsCssOutDir);

console.log(`Copy go templates to ${htmlOutDir}`);
shell.mkdir('-p', htmlOutDir);
shell.cp(config.goTemplateFile, htmlOutDir);
shell.cp(config.versionFile, serverProjectDir);


