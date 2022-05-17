class URLBuilder {

  private paths: string[] = [];
  private query: URLSearchParams = new URLSearchParams();

  constructor(readonly base: string) {}

  addPath(p: string): URLBuilder {
    this.paths.push(p.trim());
    return this;
  }

  addQuery(key: string, value: string): URLBuilder {
    this.query.append(key, value);
    return this;
  }

  toString(): string {
    let url = `${this.base}/${this.paths.join('/')}`

    const qs = this.query.toString();
    if (qs) {
      url = `${url}?${qs}`;
    }

    return url;
  }
}

export function urlBuilder(base: string): URLBuilder {
  return new URLBuilder(base);
}
