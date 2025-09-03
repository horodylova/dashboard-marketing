"use client";

import { useState, useEffect } from 'react';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartLegend, ChartTooltip } from '@progress/kendo-react-charts';
import { SvgIcon } from '@progress/kendo-react-common';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { infoCircleIcon } from '@progress/kendo-svg-icons';
import { getMetricComparisonByDayOfWeek } from '../utils/campaignUtils';

const MetricComparisonCard = () => {
  const [campaignData, setCampaignData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchCampaignData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/campaign-data.json');
        const rawData = await response.json();
        const data = { data: rawData };
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
      const metricsData = getMetricComparisonByDayOfWeek(campaignData, selectedDate);
      setChartData(metricsData);
    }
  }, [campaignData, selectedDate]);

  const handleDateChange = (event) => {
    setSelectedDate(event.value);
  };

  const handleMouseEnter = (event) => {
    const rect = event.target.getBoundingClientRect();
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.bottom + 8
    });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const normalizeValue = (value, max) => {
    return max > 0 ? (value / max) * 100 : 0;
  };

  const prepareRadarData = () => {
    if (chartData.length === 0) return { categories: [], series: [] };
    
    const maxLeads = Math.max(...chartData.map(item => item.leads));
    const maxClicks = Math.max(...chartData.map(item => item.clicks));
    const maxImpressions = Math.max(...chartData.map(item => item.impressions));
    
    const categories = ['Leads', 'Clicks', 'Impressions'];
    
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

  const customTooltip = (e) => {
    if (!e || !e.series || !e.series.name) {
      return '';
    }
    
    const categories = ['leads', 'clicks', 'impressions'];
    const categoryNames = ['Leads', 'Clicks', 'Impressions'];
    const categoryIndex = e.category ? categories.indexOf(e.category.toLowerCase()) : -1;
    
    if (categoryIndex === -1) {
      return `${e.series.name}: ${e.value.toFixed(1)}%`;
    }
    
    const campaign = chartData.find(c => c.campaign === e.series.name);
    if (campaign) {
      const actualValue = campaign[categories[categoryIndex]];
      return `${e.series.name}\n${categoryNames[categoryIndex]}: ${actualValue}`;
    }
    
    return `${e.series.name}: ${e.value.toFixed(1)}%`;
  };

  return (
    <>
      <div className="k-d-flex k-flex-col k-col-span-md-6 k-col-span-xl-8 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl" style={{ minHeight: '450px' }}>
        <div className="k-d-flex k-flex-row k-justify-content-between k-align-items-center k-px-4 k-py-4">
          <div className="k-d-flex k-align-items-center k-gap-2">
            <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
              Campaign Metrics Comparison
            </span>
            <SvgIcon 
              icon={infoCircleIcon} 
              size="small" 
              className="k-color-subtle k-cursor-pointer"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </div>
          <div style={{ width: '164px' }}>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              fillMode="flat"
            />
          </div>
        </div>
        
        <div className="k-px-4 k-pb-4 k-flex-1" style={{ minHeight: '362px' }}>
          {isLoading ? (
            <div className="k-d-flex k-justify-content-center k-align-items-center" style={{ height: '362px' }}>
              <p>Loading...</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="k-d-flex k-justify-content-center k-align-items-center" style={{ height: '362px' }}>
              <p>No data available</p>
            </div>
          ) : (
            <div style={{ height: '100%', width: '100%' }}>
              <Chart>
                <ChartTooltip render={customTooltip} />
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
      
      {showTooltip && (
        <div 
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateX(-50%)',
            zIndex: 10000,
            backgroundColor: '#fff',
            color: '#333',
            padding: '12px 16px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid #ddd',
            fontSize: '13px',
            lineHeight: '1.4',
            width: '280px',
            pointerEvents: 'none'
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Campaign Metrics Comparison</div>
          <div>Radar chart comparing campaign performance metrics</div>
          <div>Three axes show: Leads, Clicks and Impressions</div>
          <div>Values are normalized relative to maximum (100%)</div>
          <div>Each colored area represents one campaign</div>
          <div 
            style={{
              position: 'absolute',
              top: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '0',
              height: '0',
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '6px solid #fff'
            }}
          ></div>
        </div>
      )}
    </>
  );
};

export default MetricComparisonCard;