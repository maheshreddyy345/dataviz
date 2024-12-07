import axios from 'axios';

interface ChartData {
  xAxis: string[];
  yAxis: number[];
}

export const processTextWithClaude = async (text: string): Promise<ChartData> => {
  try {
    console.log('Making API request with text:', text);
    
    const response = await axios.post<ChartData>(
      '/.netlify/functions/claude/process',
      { text },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Received response:', response.data);
    
    if (!response.data.xAxis || !response.data.yAxis) {
      throw new Error('Invalid data format received from server');
    }
    
    return response.data;
  } catch (error) {
    console.error('API request error:', error);
    if (axios.isAxiosError(error)) {
      const errorDetails = error.response?.data?.details || {};
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Error details:', errorDetails);
      throw new Error(`API Error: ${errorMessage}`);
    }
    throw error;
  }
};
