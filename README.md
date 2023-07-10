# Superyad Client

This is the client app of [superyard](https://github.com/FTChinese/superyard-react)

## Development

1. Clone
2. Run `npm install`
3. Run `npm run dev`

## Deploy

Run `npm run deploy` will perform those tasks

* Call `vite build` command to generated production index.html, js and css files into `dist` directory.
* Run `./scripts/html.prod.ts` to append url to static assets
* Copy `home.html` to backend project `superyard` template direcitory; copy js and css files to directory `superyard` under svn repo `ft-interact`.