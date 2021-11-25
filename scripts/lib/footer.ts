interface Link {
  href: string;
  name: string;
}

export interface Footer {
  year: string;
  clientVersion: string;
  serverVersion: string;
}

/**
 * @description Nunjucks context to render footer section.
 */
export function buildFooter(): Footer {
  return {
    year: '{{footer.Year}}',
    clientVersion: '{{footer.ClientVersion}}',
    serverVersion: '{{footer.ServerVersion}}',
  }
}
