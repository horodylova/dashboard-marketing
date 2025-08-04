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
      const fetchCampaignTrendData = async () => {
        setIsLoading(true);
        try {
          const response = await fetch('/api/get-campaign-data');
          const data = await response.json();
          
          const today = new Date();
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 6);
          
          const filteredData = data.data
            .filter(item => item.campaign_id === selectedCampaign)
            .filter(item => {
              const itemDate = new Date(item.date);
              return itemDate >= sevenDaysAgo && itemDate <= today;
            })
            .map(item => {
              let aiScore = 0;
              if (item.ai_score) {
                if (typeof item.ai_score === 'string' && item.ai_score.includes('%')) {
                  aiScore = parseFloat(item.ai_score.replace('%', ''));
                } else {
                  aiScore = parseFloat(item.ai_score) || 0;
                }
              }
              return {
                date: new Date(item.date),
                aiScore: aiScore
              };
            })
            .sort((a, b) => a.date - b.date);

          const dailyData = [];
          for (let i = 0; i < 7; i++) {
            const currentDate = new Date(sevenDaysAgo);
            currentDate.setDate(sevenDaysAgo.getDate() + i);
            
            const dayData = filteredData.find(item => 
              item.date.toDateString() === currentDate.toDateString()
            );
            
            dailyData.push({
              date: formatDateLabel(currentDate),
              aiScore: dayData ? dayData.aiScore : null
            });
          }
          
          setChartData(dailyData);
        } catch (error) {
          console.error('Error fetching campaign trend data:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchCampaignTrendData();
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