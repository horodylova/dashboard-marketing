"use client";

import { useState, useEffect } from 'react';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartTooltip } from '@progress/kendo-react-charts';
import { useMediaQuery } from '@progress/kendo-react-layout';

const FollowersGrowthCard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  const getPageViewsByDayOfWeek = (data) => {
    const dayOfWeekData = {
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
      Sunday: 0
    };

    data.forEach(item => {
      const date = new Date(item.date);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = dayNames[date.getDay()];
      dayOfWeekData[dayName] += item.landing_page_views || 0;
    });

    return Object.entries(dayOfWeekData).map(([day, views]) => ({
      day,
      views
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/get-campaign-data');
        const data = await response.json();
        const pageViewsData = getPageViewsByDayOfWeek(data.data);
        setChartData(pageViewsData);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (event) => {
    setSelectedDate(event.value);
  };

  const dayCategories = (isMobile || isTablet)
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
                {chartData.map((campaign, index) => (
                  <ChartSeriesItem
                    key={index}
                    type="column"
                    data={dayCategories.map(day => {
                      const fullDayName = day === 'Mon' ? 'Monday' :
                                         day === 'Tue' ? 'Tuesday' :
                                         day === 'Wed' ? 'Wednesday' :
                                         day === 'Thu' ? 'Thursday' :
                                         day === 'Fri' ? 'Friday' :
                                         day === 'Sat' ? 'Saturday' :
                                         day === 'Sun' ? 'Sunday' : day;
                      const dayData = chartData.find(d => d.day === fullDayName);
                      return dayData ? dayData.views : 0;
                    })}
                    name="Page Views"
                    color="#28a745"
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

export default FollowersGrowthCard;