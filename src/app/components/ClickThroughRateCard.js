"use client";

import { useState, useEffect } from 'react';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartTooltip, ChartLegend } from '@progress/kendo-react-charts';

const ClickThroughRateCard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getClicksByDayOfWeekAndCampaign = (data) => {
    if (!data || !Array.isArray(data)) {
      return { categories: [], series: [] };
    }
    
    const dayOfWeekData = {};
    const campaigns = {};

    data.forEach(item => {
      const date = new Date(item.date);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = dayNames[date.getDay()];
      
      if (!dayOfWeekData[dayName]) {
        dayOfWeekData[dayName] = {};
      }
      
      if (!dayOfWeekData[dayName][item.campaign_name]) {
        dayOfWeekData[dayName][item.campaign_name] = 0;
      }
      
      dayOfWeekData[dayName][item.campaign_name] += item.clicks || 0;
      campaigns[item.campaign_name] = true;
    });

    const fullCategories = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const shortCategories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const categories = isMobile ? shortCategories : fullCategories;
    const campaignNames = Object.keys(campaigns);
    const colors = ['#007bff', '#dc3545', '#28a745', '#ffc107'];
    
    const series = campaignNames.map((campaign, index) => ({
      name: campaign,
      data: fullCategories.map(day => dayOfWeekData[day]?.[campaign] || 0),
      color: colors[index % colors.length]
    }));

    return { categories, series };
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/get-campaign-data');
        const result = await response.json();
        const processedData = getClicksByDayOfWeekAndCampaign(result.data || result);
        setChartData(processedData);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isMobile]);

  const handleDateChange = (event) => {
    setSelectedDate(event.value);
  };

  return (
    <div className="k-d-flex k-flex-col k-col-span-md-6 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
      <div className="k-d-flex k-justify-content-between k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          Clicks by Day of Week
        </span>
        <div style={{ width: '164px' }}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            fillMode="flat"
          />
        </div>
      </div>
      <div className="k-px-4 k-pb-4 k-flex-1" style={{ minHeight: '300px', height: '300px' }}>
        {isLoading ? (
          <div className="k-d-flex k-justify-content-center k-align-items-center" style={{ height: '100%' }}>
            <p>Loading...</p>
          </div>
        ) : (
          <div style={{ height: '100%' }}>
            <Chart>
              <ChartTooltip format="{0}: {1} clicks" />
              <ChartLegend position="bottom" />
              <ChartCategoryAxis>
                <ChartCategoryAxisItem
                  categories={chartData.categories || []}
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
                {(chartData.series || []).map((series, index) => (
                  <ChartSeriesItem
                    key={index}
                    type="column"
                    data={series.data}
                    name={series.name}
                    color={series.color}
                  />
                ))}
              </ChartSeries>
            </Chart>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClickThroughRateCard;