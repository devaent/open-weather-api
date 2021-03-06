const express = require('express');
const app = express();

require('./services/dataGatherer');
require('./routes/apiRoutes')(app);
require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Listening on port ', PORT);
});

