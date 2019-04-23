'use strict';

const axios = require('axios');

const cancel = {
  order_id: '154211262112400001',
  reference: Date.now()
};

axios
  .post('http://localhost:3002/prepare-cancel', cancel)
  .then(response =>
    console.log(`Code: ${response.status}, data:`, response.data)
  )
  .catch(error =>
    console.error(`Code: ${error.response.status}, data:`, error.response.data)
  );
