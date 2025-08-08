"use client";

import React, { useState, useEffect } from 'react';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartTooltip, ChartLegend } from '@progress/kendo-react-charts';
import { SvgIcon } from '@progress/kendo-react-common';
import { infoCircleIcon } from '@progress/kendo-svg-icons';

const getCampaignPerformanceMatrix = (data, selectedDate) => {
  if (!data || !data.data || !selectedDate) return [];
  
  const dateString = selectedDate.toISOString().split('T')[0];
  const filteredData = data.data.filter(item => item.date === dateString);
  
  const campaignMap = new Map();
  
  filteredData.forEach(item => {
    const campaignName = item.campaign_name;
    if (!campaignMap.has(campaignName)) {
      campaignMap.set(campaignName, {
        name: campaignName,
        spend: 0,
        clicks: 0,
        leads: 0,
        aiScore: item.ai_score || 0
      });
    }
    
    const campaign = campaignMap.get(campaignName);
    campaign.spend += parseFloat(item.spend) || 0;
    campaign.clicks += parseInt(item.clicks) || 0;
    campaign.leads += parseInt(item.leads) || 0;
  });
  
  return Array.from(campaignMap.values()).map(campaign => ({
    ...campaign,
    cpc: campaign.clicks > 0 ? campaign.spend / campaign.clicks : 0
  }));
};

const CampaignPerformanceMatrix = () => {
  const [campaignData, setCampaignData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableDates, setAvailableDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await fetch('/api/get-campaign-data');
        const data = await response.json();
        setCampaignData(data);
        
        const uniqueDates = new Set();
        data.data.forEach(item => {
          if (item.date) {
            uniqueDates.add(item.date);
          }
        });
        const dates = Array.from(uniqueDates).sort();
        setAvailableDates(dates);
        
        if (dates.length > 0) {
          setSelectedDate(new Date(dates[dates.length - 1]));
        }
        
        const matrixData = getCampaignPerformanceMatrix(data, selectedDate);
        setChartData(matrixData);
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
      const matrixData = getCampaignPerformanceMatrix(campaignData, selectedDate);
      setChartData(matrixData);
    }
  }, [selectedDate, campaignData]);

  const handleDateChange = (event) => {
    setSelectedDate(event.value);
  };

  const getAIScoreColor = (aiScore) => {
    if (!aiScore || aiScore === 0 || aiScore === null || aiScore === undefined) return '#6b7280';
    const score = parseFloat(aiScore);
    if (isNaN(score)) return '#6b7280';
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#84cc16';
    if (score >= 40) return '#eab308';
    if (score >= 20) return '#f97316';
    return '#ef4444';
  };

  const formatBubbleData = () => {
    return chartData.map(campaign => ({
      x: campaign.cpc,
      y: campaign.leads,
      size: Math.max(campaign.spend / 10, 5),
      category: campaign.name,
      color: getAIScoreColor(campaign.aiScore)
    }));
  };

  const dateString = selectedDate.toISOString().split('T')[0];

  return (
    <div className="k-d-flex k-flex-col k-col-span-md-6 k-col-span-xl-12 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
      <div className="k-d-flex k-justify-content-between k-align-items-center k-p-4">
        <div className="k-d-flex k-align-items-center k-gap-2">
          <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
            Campaign Performance Matrix
          </span>
          <div 
            className="k-position-relative"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <SvgIcon 
              icon={infoCircleIcon} 
              size="small" 
              className="k-color-subtle k-cursor-pointer"
            />
          </div>
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
        ) : availableDates.includes(dateString) ? (
          chartData.length > 0 ? (
            <Chart style={{ height: '362px' }}>
              <ChartTooltip format="{3}: CPC £{0}, Leads {1}, Spend £{2}" />
              <ChartCategoryAxis>
                <ChartCategoryAxisItem
                  title={{ text: 'Cost Per Click (CPC) - £' }}
                  labels={{ format: '£{0}' }}
                />
              </ChartCategoryAxis>
              <ChartValueAxis>
                <ChartValueAxisItem
                  title={{ text: 'Leads' }}
                  labels={{ format: '{0}' }}
                  min={0}
                />
              </ChartValueAxis>
              <ChartSeries>
                {chartData.map((campaign, index) => (
                  <ChartSeriesItem
                    key={campaign.name}
                    type="bubble"
                    data={[{
                      x: campaign.cpc,
                      y: campaign.leads,
                      size: Math.max(campaign.spend / 10, 10),
                      category: campaign.name
                    }]}
                    name={campaign.name}
                    color={getAIScoreColor(campaign.aiScore)}
                    xField="x"
                    yField="y"
                    sizeField="size"
                    categoryField="category"
                  />
                ))}
              </ChartSeries>
              <ChartLegend position="bottom" orientation="horizontal" />
            </Chart>
          ) : (
            <div className="k-d-flex k-justify-content-center k-align-items-center k-flex-col k-color-subtle" style={{ height: '362px' }}>
              <p>No campaigns found for the selected date.</p>
            </div>
          )
        ) : (
          <div className="k-d-flex k-justify-content-center k-align-items-center k-flex-col k-color-subtle" style={{ height: '362px' }}>
            <p>No data available for the selected date.</p>
            {availableDates.length > 0 && (
              <p>Data available from {availableDates[0]} to {availableDates[availableDates.length - 1]}.</p>
            )}
          </div>
        )}
      </div>
      {showTooltip && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 999999,
            maxWidth: '350px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            color: '#374151',
            fontSize: '13px',
            lineHeight: '1.4',
            pointerEvents: 'none',
            fontFamily: 'inherit'
          }}
        >
          <div style={{ fontWeight: '600', marginBottom: '10px', color: '#111827', fontSize: '14px' }}>Bubble Calculation:</div>
          <div style={{ marginBottom: '4px' }}>• X-axis: CPC (Cost Per Click) in £</div>
          <div style={{ marginBottom: '4px' }}>• Y-axis: Number of Leads</div>
          <div style={{ marginBottom: '4px' }}>• Bubble size: Spend amount ÷ 10</div>
          <div style={{ marginBottom: '10px' }}>• Color: AI Score</div>
          <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: '1.3' }}>
            <span style={{color: '#22c55e', marginRight: '3px'}}>■</span> Green: 80%+ | 
            <span style={{color: '#84cc16', marginRight: '3px'}}>■</span> Yellow-Green: 60-79% | 
            <span style={{color: '#eab308', marginRight: '3px'}}>■</span> Yellow: 40-59% | 
            <span style={{color: '#f97316', marginRight: '3px'}}>■</span> Orange: 20-39% | 
            <span style={{color: '#ef4444', marginRight: '3px'}}>■</span> Red: &lt;20%
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignPerformanceMatrix;