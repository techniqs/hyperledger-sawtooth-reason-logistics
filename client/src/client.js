
import React from 'react';
import { hydrate } from 'react-dom';
import ApolloClient from 'apollo-client';
import Cookies from 'universal-cookie';
import { CookiesProvider } from 'react-cookie';
const { make: App } = require('./web/App.bs'); // BuckleScript output directory
import { InMemoryCache } from 'apollo-cache-inmemory';

const { createLinks } = require('./web/component/Graphql.bs');

const cookies = new Cookies();

const userToken = cookies.get('userToken');
const username = cookies.get('username');

const client = new ApolloClient({
	ssrForceFetchDelay: 100,
	link: createLinks({
		token: userToken
	}),
  connectToDevTools: true,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__)
});

hydrate(
	<CookiesProvider>
		<App apolloClient={client} isUserLoggedIn={!!userToken} />
	</CookiesProvider>,
	document.getElementById('root'));

if (module.hot) {
	module.hot.accept();
}
