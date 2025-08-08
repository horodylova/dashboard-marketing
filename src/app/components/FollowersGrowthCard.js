"use client";

import { useState, useEffect } from 'react';
import { SvgIcon } from '@progress/kendo-react-common';
import { xIcon } from '@progress/kendo-svg-icons';
import { DatePicker, DateInput } from '@progress/kendo-react-dateinputs';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartLegend, ChartTooltip } from '@progress/kendo-react-charts';
import { getPageViewsByDayOfWeek, getActiveCampaignDates } from '../utils/campaignUtils';

const PageViewsByDayCard = () => {
  const [campaignData, setCampaignData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableDates, setAvailableDates] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
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
        
        const dates = getActiveCampaignDates(data);
        setAvailableDates(dates);
        
        const pageViewsData = getPageViewsByDayOfWeek(data, selectedDate);
        setChartData(pageViewsData);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, [selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.value);
  };

  const getCampaignColor = (campaignName) => {
    const colors = {
      'FB Story - Broad Audience': '#1877F2',
      'IG Story - Narrow Audience': '#E4405F', 
      'FB Feed - Lookalike': '#4267B2',
      'IG Reels - Retargeting': '#C13584'
    };
    return colors[campaignName] || '#666666';
  };

  const hasDataForSelectedDate = () => {
    if (!campaignData || !campaignData.data) return false;
    const dateString = selectedDate.toISOString().split('T')[0];
    return campaignData.data.some(item => item.date === dateString);
  };

  const getDateRange = () => {
    if (availableDates.length === 0) return '';
    const sortedDates = [...availableDates].sort();
    const firstDate = new Date(sortedDates[0]).toLocaleDateString();
    const lastDate = new Date(sortedDates[sortedDates.length - 1]).toLocaleDateString();
    return `${firstDate} - ${lastDate}`;
  };

  const dayCategories = isMobile 
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="k-d-flex k-flex-col k-col-span-md-6 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
      <div className="k-d-flex k-justify-content-between k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          Page Views by Day of Week
        </span>
        <div style={{ width: '164px' }}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            fillMode="flat"
            dateInput={() => (
              <>
                <DateInput ariaLabel="Page views date picker" value={selectedDate} />
                <span className="k-clear-value">
                  <SvgIcon icon={xIcon}></SvgIcon>
                </span>
              </>
            )}
          />
        </div>
      </div>
      <div className="k-px-4 k-pb-4 k-flex-1" style={{ minHeight: '300px', height: '300px' }}>
        {isLoading ? (
          <div className="k-d-flex k-justify-content-center k-align-items-center" style={{ height: '100%' }}>
            <p>Loading...</p>
          </div>
        ) : !hasDataForSelectedDate() ? (
          <div className="k-d-flex k-flex-col k-justify-content-center k-align-items-center" style={{ height: '100%' }}>
            <p className="k-font-size-md k-color-subtle k-text-center k-mb-2">
              No data available for {selectedDate.toLocaleDateString()}
            </p>
            {availableDates.length > 0 && (
              <p className="k-font-size-sm k-color-subtle k-text-center">
                Available data range: {getDateRange()}
              </p>
            )}
          </div>
        ) : (
          <div style={{ height: '100%' }}>
            <Chart>
              <ChartTooltip format="{0}: {1} page views" />
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
          </div>
        )}
      </div>
    </div>
  );
};

export default PageViewsByDayCard;