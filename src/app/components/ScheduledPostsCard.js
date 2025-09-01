"use client";

import { useState, useEffect } from 'react';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartLegend, ChartTooltip } from '@progress/kendo-react-charts';
import { getMetricComparisonData } from '../utils/campaignUtils';

const MetricComparisonCard = () => {
  const [campaignData, setCampaignData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaignData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/get-campaign-data');
        const rawData = await response.json();
        const data = { data: rawData };
        setCampaignData(data);
        
        const metricsData = getMetricComparisonData(data, null);
        setChartData(metricsData);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, []);

  const normalizeValue = (value, max) => {
    return max > 0 ? (value / max) * 100 : 0;
  };

  const prepareRadarData = () => {
    if (chartData.length === 0) return { categories: [], series: [] };
    
    const maxLeads = Math.max(...chartData.map(item => item.leads));
    const maxClicks = Math.max(...chartData.map(item => item.clicks));
    const maxImpressions = Math.max(...chartData.map(item => item.impressions));
    
    const categories = ['Leads', 'Clicks', 'Impress.'];
    
    const series = chartData.map((campaign, index) => {
      const colors = ['#1877F2', '#E4405F', '#4267B2', '#C13584'];
      
      return {
        name: campaign.campaign,
        data: [
          normalizeValue(campaign.leads, maxLeads),
          normalizeValue(campaign.clicks, maxClicks),
          normalizeValue(campaign.impressions, maxImpressions)
        ],
        color: colors[index % colors.length]
      };
    });
    
    return { categories, series };
  };

  const radarConfig = prepareRadarData();

  return (
    <div className="k-d-flex k-flex-col k-col-span-md-6 k-col-span-xl-8 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl" style={{ minHeight: '450px' }}>
      <div className="k-d-flex k-flex-row k-justify-content-between k-align-items-center k-px-4 k-py-4">
        <div className="k-d-flex k-flex-col">
          <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
            Metric Comparison
          </span>
          <span className="k-font-size-sm k-color-subtle k-mt-1">
            Radar chart comparing campaign performance metrics: Leads, Clicks, and Impressions
          </span>
        </div>
      </div>
      <div className="k-d-flex k-px-4 k-flex-1" style={{ height: '350px', minHeight: '350px' }}>
        {isLoading ? (
          <div className="k-d-flex k-justify-content-center k-align-items-center" style={{ height: '100%', width: '100%' }}>
            <p>Loading...</p>
          </div>
        ) : chartData.length === 0 ? (
          <div className="k-d-flex k-flex-col k-justify-content-center k-align-items-center" style={{ height: '100%', width: '100%' }}>
            <p className="k-font-size-md k-color-subtle k-text-center k-mb-2">
              No campaign data available
            </p>
          </div>
        ) : (
          <div style={{ height: '100%', width: '100%' }}>
            <Chart>
              <ChartTooltip format="{0}: {1}%" />
              <ChartCategoryAxis>
                <ChartCategoryAxisItem
                  categories={radarConfig.categories}
                  startAngle={90}
                />
              </ChartCategoryAxis>
              <ChartValueAxis>
                <ChartValueAxisItem
                  labels={{ format: '{0}%' }}
                  majorGridLines={{ visible: true }}
                  min={0}
                  max={100}
                />
              </ChartValueAxis>
              <ChartSeries>
                {radarConfig.series.map((series) => (
                  <ChartSeriesItem
                    key={series.name}
                    type="radarArea"
                    data={series.data}
                    name={series.name}
                    color={series.color}
                    opacity={0.6}
                    markers={{ visible: true }}
                  />
                ))}              </ChartSeries>
              <ChartLegend position="bottom" orientation="horizontal" />
            </Chart>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricComparisonCard;