import { resolve } from 'path';

export interface Config {
  projectNameClient: string;
  staticPrefix: string; // Used when rendering html template.
  goTemplateFile: string; // Intermediate file for html template.
  versionFile: string;
}

function buildConfig(): Config {

  const clientName = 'next';

  return {
    projectNameClient: clientName,
    staticPrefix: `/static/frontend/superyard/${clientName}`,
    goTemplateFile: resolve(process.cwd(), `dist/${clientName}.html`),
    versionFile: resolve(process.cwd(), 'dist/client_version_next'),
  }
}

export const config = buildConfig();
