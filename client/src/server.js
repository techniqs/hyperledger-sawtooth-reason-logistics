import React from 'react';
import express from 'express';
import { renderToStringWithData } from 'react-apollo';
import { CookiesProvider } from 'react-cookie';
import ApolloClient from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';


const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
const cookiesMiddleware = require('universal-cookie-express');

// important to read is dynamically via require, because globalConfig has to be processed before it
const {
  make: App
} = require('./web/App.bs'); // BuckleScript output directory

function detectAndSetUserToken(req, res) {
  const cookieUserToken = req.universalCookies.get('userToken');
  return cookieUserToken;
}

function detectAndSetUsername(req, res) {
  const cookieUserToken = req.universalCookies.get('username');
  return cookieUserToken;
}

function renderTemplate({ apolloState, markup }) {
	return `<!doctype html>
  <html lang="">
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      ${assets.client.js ? `<script src="${assets.client.js}" defer></script>` : ''}
      ${assets.client.css ? `<link rel="stylesheet" type="text/css" href="${assets.client.css}" />` : ''}
      <link rel="icon" href="/favicon.png" />
      <script>
		window.__APOLLO_STATE__ = ${apolloState};
      </script>
      <title>Sawtooth-Supply-Tracker</title>
    </head>
    <body>
        <div id="root">${markup}</div>
        <div id="modal-root"></div>
     </body>
  </html>`;
}

function getCookies(req, res) {
	req.universalCookies.cookies =
		{
			userToken: detectAndSetUserToken(req, res),
			username: detectAndSetUsername(req, res),
		};
	return req.universalCookies;
};

async function renderPage(req, res) {
	const token = detectAndSetUserToken(req, res);
	const cookiesForProvider = getCookies(req, res);
  const client = createApolloClient(token);
  
  let appWithData;
  try {
    appWithData = await renderToStringWithData(
      <CookiesProvider cookies={cookiesForProvider}>
        <App apolloClient={client} initialUrl={req._parsedOriginalUrl.pathname}
          isUserLoggedIn={!!token} search={req._parsedOriginalUrl.query} />
    </CookiesProvider>
      );
  } catch(err) {
    appWithData = "";
    console.error("SSR ERROR: \n", err);
  }

  return renderTemplate({
		apolloState: JSON.stringify(client.cache.extract()),
		markup: (appWithData)
	});
}
const { createLinks } = require('./web/component/Graphql.bs');

function createApolloClient(token) {
	return new ApolloClient({
		ssrMode: true,
		link: createLinks({
			credentials: 'same-origin',
			token: token
    }),
    cache: new InMemoryCache()
	});
}

const server = express();
server.use(cookiesMiddleware());

const publicPath = process.env.NODE_ENV === 'production' ? resolve(__dirname, 'public') : process.env.RAZZLE_PUBLIC_DIR;


console.log(`node env: ${process.env.NODE_ENV}`)
console.log(`razzle dir: ${process.env.RAZZLE_PUBLIC_DIR}`)
console.log(`dirname: ${__dirname}`)
console.log(`public path: ${publicPath}`)
server
  .disable('x-powered-by')
  .use('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-user: *\nDisallow: /");
  })
  .use(express.static(publicPath))
  .get('/*', async (req, res) => {
    let html;
    try {
      html = await renderPage(req, res);
      res.send(html);
    } catch(err) {
      console.log(err);
      res.redirect('/error')
    } 

    
});

export default server;