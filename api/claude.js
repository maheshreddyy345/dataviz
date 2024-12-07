const express = require('express');
const cors = require('cors');
const axios = require('axios');
const serverless = require('serverless-http');

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

router.post('/process', async (req, res) => {
  try {
    const { text } = req.body;
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: `Extract numerical data from this text and format it as a visualization-ready JSON object.
                   The JSON object should have exactly two fields:
                   - xAxis: array of labels (strings)
                   - yAxis: array of corresponding numbers
                   Return ONLY the JSON object, nothing else.
                   
                   Text: ${text}`
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.CLAUDE_API_KEY,
          'anthropic-version': '2024-02-29'
        }
      }
    );

    const content = response.data.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON object found in response');
    }
    
    const data = JSON.parse(jsonMatch[0]);
    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      error: 'API Error',
      message: error.message,
      details: error.response?.data
    });
  }
});

app.use('/.netlify/functions/claude', router);
module.exports.handler = serverless(app);
