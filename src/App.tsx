import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { processTextWithClaude } from './services/claudeService';
import './App.css';

interface ChartData {
  xAxis: string[];
  yAxis: number[];
}

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const processedData = await processTextWithClaude(inputText);
      setData(processedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(`Error: ${errorMessage}`);
      console.error('Error details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getChartOptions = () => {
    if (!data) return {};
    
    return {
      title: {
        text: 'Data Visualization',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: data.xAxis,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: data.yAxis,
        type: 'bar',
        animationDuration: 2000,
        animationEasing: 'cubicInOut'
      }]
    };
  };

  return (
    <div className="app">
      <header>
        <h1>DataViz</h1>
        <p>Transform your text into animated visualizations</p>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text with data..."
              rows={6}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading || !inputText.trim()}
            className="submit-button"
          >
            {loading ? 'Processing...' : 'Generate Visualization'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {data && (
          <div className="chart-container">
            <ReactECharts 
              option={getChartOptions()} 
              style={{ height: '400px', width: '100%' }}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
