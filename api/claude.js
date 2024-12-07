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
    console.log('Received request body:', req.body);
    
    if (!process.env.CLAUDE_API_KEY) {
      console.error('CLAUDE_API_KEY is not set');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const { text } = req.body;
    if (!text) {
      console.error('No text provided in request');
      return res.status(400).json({ error: 'No text provided' });
    }

    console.log('Making request to Claude API...');
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

    console.log('Received response from Claude:', response.status);
    console.log('Response data:', JSON.stringify(response.data));

    if (!response.data.content || !response.data.content[0]) {
      throw new Error('Invalid response format from Claude API');
    }

    const content = response.data.content[0].text;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error('No JSON object found in response');
    }
    
    const data = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(data.xAxis) || !Array.isArray(data.yAxis)) {
      throw new Error('Invalid data format: xAxis and yAxis must be arrays');
    }

    console.log('Successfully parsed data:', data);
    res.json(data);
  } catch (error) {
    console.error('Error details:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      return res.status(error.response?.status || 500).json({
        error: 'API Error',
        message: error.response?.data?.error?.message || error.message,
        details: error.response?.data
      });
    }

    res.status(500).json({
      error: 'Server Error',
      message: error.message
    });
  }
});

app.use('/.netlify/functions/claude', router);
module.exports.handler = serverless(app);
