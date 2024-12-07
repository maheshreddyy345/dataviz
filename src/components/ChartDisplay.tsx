import React, { useEffect, useRef } from 'react';
import ReactECharts from 'echarts-for-react';

interface ChartDisplayProps {
  data: {
    xAxis: string[];
    yAxis: number[];
  };
}

export const ChartDisplay: React.FC<ChartDisplayProps> = ({ data }) => {
  const chartRef = useRef(null);

  const option = {
    animation: true,
    animationDuration: 2000,
    xAxis: {
      type: 'category',
      data: data.xAxis
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: data.yAxis,
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(180, 180, 180, 0.2)'
      }
    }]
  };

  return (
    <div className="chart-container">
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: '400px', width: '100%' }}
      />
    </div>
  );
};
