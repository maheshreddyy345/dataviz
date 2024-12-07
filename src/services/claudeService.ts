import axios from 'axios';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

interface ClaudeResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

export const processTextWithClaude = async (text: string): Promise<{ xAxis: string[]; yAxis: number[] }> => {
  try {
    const apiKey = process.env.REACT_APP_CLAUDE_API_KEY;
    if (!apiKey) {
      throw new Error('Claude API key not found. Please add REACT_APP_CLAUDE_API_KEY to your .env file');
    }

    const response = await axios.post<ClaudeResponse>(
      CLAUDE_API_URL,
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
          'x-api-key': apiKey,
          'anthropic-version': '2024-02-29'
        }
      }
    );

    const content = response.data.content[0].text;
    
    try {
      // Find the JSON object in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON object found in response');
      }
      
      const data = JSON.parse(jsonMatch[0]);
      
      // Validate the data structure
      if (!Array.isArray(data.xAxis) || !Array.isArray(data.yAxis)) {
        throw new Error('Invalid data format: xAxis and yAxis must be arrays');
      }
      
      if (data.xAxis.length !== data.yAxis.length) {
        throw new Error('Invalid data format: xAxis and yAxis must have the same length');
      }
      
      return data;
    } catch (parseError) {
      console.error('Error parsing Claude response:', content);
      throw new Error('Failed to parse data from Claude response');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error?.message || error.message;
      console.error('API Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      throw new Error(`API Error: ${errorMessage}`);
    }
    throw error;
  }
};
