const mongoose = require('mongoose');
const keys = require('../config/keys/keys');
//connect to mongoose
mongoose
  .connect(keys.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('mongodb connected');
  })
  .catch((error) => {
    console.log(error);
  });
