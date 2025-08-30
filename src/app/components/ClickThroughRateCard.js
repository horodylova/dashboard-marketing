"use client";

import { useState, useEffect } from 'react';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartLegend, ChartTooltip } from '@progress/kendo-react-charts';
import { getClicksByDayOfWeek } from '../utils/campaignUtils';

const ClicksByDayCard = () => {
  const [campaignData, setCampaignData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width <= 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchCampaignData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/get-campaign-data');
        const data = await response.json();
        setCampaignData(data);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, []);

  useEffect(() => {
    if (campaignData) {
      const clicksData = getClicksByDayOfWeek(campaignData);
      setChartData(clicksData);
    }
  }, [campaignData]);

  const getCampaignColor = (campaignName) => {
    const colors = {
      'FB Story - Broad Audience': '#1877F2',
      'IG Story - Narrow Audience': '#E4405F', 
      'FB Feed - Lookalike': '#4267B2',
      'IG Reels - Retargeting': '#C13584'
    };
    return colors[campaignName] || '#666666';
  };

  const dayCategories = (isMobile || isTablet)
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="k-d-flex k-flex-col k-col-span-md-6 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
      <div className="k-d-flex k-justify-content-between k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          Clicks by Day of Week
        </span>
      </div>
      <div className="k-d-flex k-flex-col k-px-4 k-pb-4 k-flex-1 k-gap-2" style={{ minHeight: '300px', height: '300px' }}>
        {isLoading ? (
          <div className="k-d-flex k-justify-content-center k-align-items-center" style={{ height: '100%' }}>
            <p>Loading...</p>
          </div>
        ) : (
          <div style={{ height: '100%' }}>
            <Chart>
              <ChartTooltip format="{0}: {1} clicks" />
              <ChartCategoryAxis>
                <ChartCategoryAxisItem
                  categories={dayCategories}
                />
              </ChartCategoryAxis>
              <ChartValueAxis>
                <ChartValueAxisItem
                  labels={{ format: '{0}' }}
                  majorGridLines={{ visible: true }}
                  min={0}
                />
              </ChartValueAxis>
              <ChartSeries>
                {chartData.map((campaign) => {
                  return (
                    <ChartSeriesItem
                      key={campaign.name}
                      type="column"
                      data={campaign.data}
                      name={campaign.name}
                      color={getCampaignColor(campaign.name)}
                    />
                  );
                })}
              </ChartSeries>
              <ChartLegend position="bottom" orientation="horizontal" />
            </Chart>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClicksByDayCard;