'use strict';

const axios = require('axios');

const orderId = process.argv[2] || '154211262112400001';
const reference = process.argv[3] || Date.now();

axios
  .delete(`http://localhost:3002/orders/${orderId}?reference=${reference}`)
  .then(response =>
    console.log(`Code: ${response.status}, data:`, response.data)
  )
  .catch(error =>
    console.error(`Code: ${error.response.status}, data:`, error.response.data)
  );
