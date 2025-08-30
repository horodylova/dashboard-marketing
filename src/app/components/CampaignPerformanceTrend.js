"use client";

import { useState, useEffect } from 'react';
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartValueAxis,
  ChartValueAxisItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartSeriesLabels
} from '@progress/kendo-react-charts';

const CampaignPerformanceTrend = ({ selectedCampaign, campaignName }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const formatDateLabel = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    if (selectedCampaign) {
      const fetchTrendData = async () => {
        if (!selectedCampaign) return;
        
        setIsLoading(true);
        try {
          const response = await fetch('/api/get-campaign-data');
          const data = await response.json();
          
          const campaignData = data.data.filter(item => 
            item.campaign_id === selectedCampaign.id
          ).sort((a, b) => new Date(a.date) - new Date(b.date));
          
          const last7Records = campaignData.slice(-7);
          
          const chartData = last7Records.map(item => ({
            date: new Date(item.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            }),
            aiScore: item.ai_score
          }));
          
          setChartData(chartData);
        } catch (error) {
          console.error('Error fetching campaign trend data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchTrendData();
    } else {
      setChartData([]);
    }
  }, [selectedCampaign]);

  const getYAxisRange = () => {
    if (chartData.length === 0) return { min: 0, max: 100 };
    
    const scores = chartData.filter(item => item.aiScore !== null).map(item => item.aiScore);
    if (scores.length === 0) return { min: 0, max: 100 };
    
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    
    const padding = (maxScore - minScore) * 0.1 || 5;
    
    return {
      min: Math.max(0, Math.floor(minScore - padding)),
      max: Math.min(100, Math.ceil(maxScore + padding))
    };
  };

  const yAxisRange = getYAxisRange();

  return (
    <div
      className="k-d-flex k-flex-col k-col-span-md-3 k-col-span-xl-3 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl"
      style={{ maxHeight: '392px', minHeight: '392px' }}
    >
      <div className="k-d-flex k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          AI Score Trend (Last 7 Days)
        </span>
      </div>
      
      {campaignName && (
        <div className="k-px-4 k-pb-2">
          <span className="k-font-size-sm k-color-subtle">{campaignName}</span>
        </div>
      )}
      
      <div className="k-px-4 k-d-flex k-justify-content-center k-flex-1" style={{ height: '280px', minHeight: '280px' }}>
        {isLoading ? (
          <div className="k-d-flex k-align-items-center k-justify-content-center k-flex-1">
            <span className="k-color-subtle">Loading...</span>
          </div>
        ) : selectedCampaign && chartData.length > 0 ? (
          <Chart style={{ height: '280px', width: '100%' }}>
            <ChartCategoryAxis>
              <ChartCategoryAxisItem 
                categories={chartData.map(item => item.date)}
                labels={{ 
                  rotation: -30, 
                  font: '11px Arial'
                }}
              />
            </ChartCategoryAxis>
            <ChartValueAxis>
              <ChartValueAxisItem 
                title={{ text: 'AI Score (%)' }}
                labels={{ font: '12px Arial' }}
                min={yAxisRange.min}
                max={yAxisRange.max}
              />
            </ChartValueAxis>
            <ChartSeries>
              <ChartSeriesItem 
                type="line" 
                data={chartData.map(item => item.aiScore !== null ? Math.round(item.aiScore * 10) / 10 : null)}
                markers={{ visible: true, size: 8 }}
                tooltip={{ visible: true, format: 'AI Score: {0}%' }}
                color="#0078d4"
                width={3}
                missingValues="gap"
              >
                <ChartSeriesLabels visible={false} />
              </ChartSeriesItem>
            </ChartSeries>
          </Chart>
        ) : (
          <div className="k-d-flex k-align-items-center k-justify-content-center k-flex-1">
            <span className="k-color-subtle">
              {selectedCampaign ? 'No data available' : 'Select a campaign to view trend'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignPerformanceTrend;