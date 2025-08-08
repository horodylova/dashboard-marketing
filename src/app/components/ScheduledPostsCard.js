"use client";

import { useState, useEffect } from 'react';
import { SvgIcon } from '@progress/kendo-react-common';
import { xIcon } from '@progress/kendo-svg-icons';
import { DatePicker, DateInput } from '@progress/kendo-react-dateinputs';
import { Popup } from '@progress/kendo-react-popup';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartLegend, ChartTooltip } from '@progress/kendo-react-charts';
import { getMetricComparisonData, getActiveCampaignDates } from '../utils/campaignUtils';

const MetricComparisonCard = () => {
  const [campaignData, setCampaignData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableDates, setAvailableDates] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [anchor, setAnchor] = useState(null);
  const [firstAvailableDate, setFirstAvailableDate] = useState("");

  useEffect(() => {
    const fetchCampaignData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/get-campaign-data');
        const data = await response.json();
        setCampaignData(data);
        
        const dates = getActiveCampaignDates(data);
        setAvailableDates(dates);
        
        if (dates.length > 0) {
          setFirstAvailableDate(dates[0]);
          setSelectedDate(new Date(dates[dates.length - 1]));
        }
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, []);

  useEffect(() => {
    if (!campaignData || !selectedDate) return;
    
    const dateString = selectedDate.toISOString().split('T')[0];
    
    if (!availableDates.includes(dateString)) {
      setChartData([]);
      return;
    }
    
    const metricsData = getMetricComparisonData(campaignData, selectedDate);
    setChartData(metricsData);
  }, [campaignData, selectedDate, availableDates]);

  const handleDateChange = (e) => {
    const newDate = e.value;
    setSelectedDate(newDate);
    
    const dateString = newDate.toISOString().split('T')[0];
    if (!availableDates.includes(dateString)) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  };

  const handleDatePickerClick = (e) => {
    setAnchor(e.target);
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
            Radar chart comparing campaign performance metrics: Leads, Clicks, and Impressions for selected date
          </span>
        </div>
        <div style={{ width: '164px' }} onClick={handleDatePickerClick}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            fillMode="flat"
          />
          {showPopup && anchor && (
            <Popup
              anchor={anchor}
              show={showPopup}
              popupClass="k-popup-content"
              animate={false}
              position="bottom"
            >
              <div className="k-p-3 k-bg-error-lighter k-color-error k-rounded-md">
                Data available from {firstAvailableDate}
              </div>
            </Popup>
          )}
        </div>
      </div>
      <div className="k-d-flex k-px-4 k-flex-1" style={{ height: '350px', minHeight: '350px' }}>
        {isLoading ? (
          <div className="k-d-flex k-justify-content-center k-align-items-center" style={{ height: '100%', width: '100%' }}>
            <p>Loading...</p>
          </div>
        ) : !hasDataForSelectedDate() ? (
          <div className="k-d-flex k-flex-col k-justify-content-center k-align-items-center" style={{ height: '100%', width: '100%' }}>
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
                ))}
              </ChartSeries>
              <ChartLegend position="bottom" orientation="horizontal" />
            </Chart>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricComparisonCard;