// Only for development purposes so razzle works
import React from 'react';
import { hydrate } from 'react-dom';

const { make: App } = require('./web/App.bs'); // BuckleScript output directory


hydrate(
  <App  />,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept();
}
