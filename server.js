const express = require('express');
const path = require('path');
const { sortHackerNewsArticles } = require('./sortHackerNews'); // Import the function

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to run the script and return results
app.get('/run-script', async (req, res) => {
  const { results, limitedArticles } = await sortHackerNewsArticles();
  res.json({ results, limitedArticles });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
