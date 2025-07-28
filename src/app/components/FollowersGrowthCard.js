"use client";

import { useState, useEffect } from 'react';
import { SvgIcon } from '@progress/kendo-react-common';
import { xIcon } from '@progress/kendo-svg-icons';
import { DatePicker, DateInput } from '@progress/kendo-react-dateinputs';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartLegend, ChartTooltip } from '@progress/kendo-react-charts';
import { getPageViewsByDayOfWeek } from '../utils/campaignUtils';

const PageViewsByDayCard = () => {
  const [campaignData, setCampaignData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCampaignData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/get-campaign-data');
        const data = await response.json();
        setCampaignData(data);
        
        const pageViewsData = getPageViewsByDayOfWeek(data);
        setChartData(pageViewsData);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, []);

  const getCampaignColor = (campaignName) => {
    const colors = {
      'FB Story - Broad Audience': '#1877F2',
      'IG Story - Narrow Audience': '#E4405F', 
      'FB Feed - Lookalike': '#4267B2',
      'IG Reels - Retargeting': '#C13584'
    };
    return colors[campaignName] || '#666666';
  };

  return (
    <div className="k-d-flex k-flex-col k-col-span-md-6 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
      <div className="k-d-flex k-justify-content-between k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          Page Views by Day of Week
        </span>
        <div style={{ width: '164px' }}>
          <DatePicker
            value={new Date()}
            fillMode="flat"
            dateInput={() => (
              <>
                <DateInput ariaLabel="Page views date picker" value={new Date()} />
                <span className="k-clear-value">
                  <SvgIcon icon={xIcon}></SvgIcon>
                </span>
              </>
            )}
          />
        </div>
      </div>
      <div className="k-px-4 k-pb-4 k-flex-1">
        {isLoading ? (
          <div className="k-d-flex k-justify-content-center k-align-items-center k-flex-1">
            <p>Loading...</p>
          </div>
        ) : (
          <Chart>
            <ChartTooltip format="{0}: {1} page views" />
            <ChartCategoryAxis>
              <ChartCategoryAxisItem
                categories={['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']}
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
                    type="line"
                    data={campaign.data}
                    name={campaign.name}
                    color={getCampaignColor(campaign.name)}
                    markers={{ visible: true }}
                    legendItem={{ type: 'line' }}
                  />
                );
              })}
            </ChartSeries>
            <ChartLegend position="bottom" orientation="horizontal" />
          </Chart>
        )}
      </div>
    </div>
  );
};

export default PageViewsByDayCard;