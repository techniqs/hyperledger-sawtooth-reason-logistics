import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';


const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);


// important to read is dynamically via require, because globalConfig has to be processed before it
const {
  make: App
} = require('./web/App.bs'); // BuckleScript output directory

function renderTemplate(markup) {
  return `<!doctype html>
  <html lang="">
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      ${assets.client.js ? `<script src="${assets.client.js}" defer></script>` : ''}
      ${assets.client.css ? `<link rel="stylesheet" type="text/css" href="${assets.client.css}" />` : ''}
      <link rel="icon" href="/favicon.png" />
      <title>hs-reason</title>
    </head>
    <body>
      <div id="root">${markup}</div>
     </body>
  </html>`;
}

async function renderPage(req, res) {

  let appWithData;
  try {
    appWithData = await renderToString(
        <App
          initialUrl = {req._parsedOriginalUrl.pathname}
          />
      );
  } catch(err) {
    appWithData = "";
  }


  return renderTemplate(appWithData);
}


const server = express();

const publicPath = process.env.NODE_ENV === 'production' ? resolve(__dirname, 'public') : process.env.RAZZLE_PUBLIC_DIR;


console.log(`node env: ${process.env.NODE_ENV}`)
console.log(`razzle dir: ${process.env.RAZZLE_PUBLIC_DIR}`)
console.log(`dirname: ${__dirname}`)
console.log(`public path: ${publicPath}`)
server
  .disable('x-powered-by')
  .use('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
  })
  .use(express.static(publicPath))
  .get('/*', async (req, res) => {
    let html;
    try {
      html = await renderPage(req, res);
      res.send(html);
    } catch(err) {
      res.redirect('/error')
    } 

    
});

export default server;