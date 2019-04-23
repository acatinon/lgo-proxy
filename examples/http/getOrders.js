'use strict';

const util = require('util');
const axios = require('axios');

axios
  .get('http://localhost:3002/orders')
  .then(response => {
    console.log(`Code: ${response.status}`);
    console.log(util.inspect(response.data, { depth: 3 }));
  })
  .catch(error =>
    console.error(`Code: ${error.response.status}, data:`, error.response.data)
  );
