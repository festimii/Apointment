const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendor/mui', express.static(path.join(__dirname, 'node_modules', 'muicss', 'dist')));

app.listen(PORT, () => {
  console.log(`Frontend running on http://localhost:${PORT}`);
});
