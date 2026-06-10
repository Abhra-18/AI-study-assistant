const https = require('https');
require('dotenv').config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No API key found in .env");
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.error) {
        console.error("API Error:", parsed.error.message);
      } else if (parsed.models) {
        console.log("Available Models for this API Key:");
        parsed.models.forEach(m => {
          if (m.name.includes('gemini')) {
            console.log(`- ${m.name} (Supported methods: ${m.supportedGenerationMethods.join(', ')})`);
          }
        });
      }
    } catch (e) {
      console.error("Parse error:", e);
    }
  });
}).on('error', (e) => {
  console.error("Network error:", e);
});
