"use client";

import { useState, useEffect } from 'react';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartSeriesLabels,
  ChartLegend,
} from '@progress/kendo-react-charts';

const SpendDistributionCard = () => {
  const [campaignData, setCampaignData] = useState([]);
  const [spendData, setSpendData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
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
        const result = await response.json();
        const data = result.data || result;
        
        if (!data || !Array.isArray(data)) {
          setSpendData([]);
          return;
        }
        
        setCampaignData(data);
        
        const campaignSpend = {};
        data.forEach(item => {
          if (item.spend && item.spend > 0) {
            if (!campaignSpend[item.campaign_name]) {
              campaignSpend[item.campaign_name] = 0;
            }
            campaignSpend[item.campaign_name] += parseFloat(item.spend);
          }
        });
        
        const spendDistribution = Object.entries(campaignSpend)
          .map(([name, spend]) => ({
            campaign: name,
            spend: Math.round(spend * 100) / 100,
            color: getCampaignColor(name)
          }))
          .filter(item => item.spend > 0)
          .sort((a, b) => b.spend - a.spend);
        
        setSpendData(spendDistribution);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
        setSpendData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, []);

  const getCampaignColor = (campaignName) => {
    const colors = {
      'Summer Sale 2025': '#E82C33',
      'Tech Product Launch': '#31A2ED',
      'Fitness App Promotion': '#59C55D',
      'B2B Software Demo': '#E23C7E'
    };
    return colors[campaignName] || '#0078d4';
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.value);
  };

  const getContainerStyle = () => {
    if (isTablet) {
      return { maxHeight: "392px", minHeight: "392px" };
    }
    return {};
  };

  return (
    <div className="k-d-flex k-flex-col k-col-span-md-3 k-col-span-xl-4 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl" style={getContainerStyle()}>
      <div className="k-d-flex k-justify-content-between k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          Spend Distribution per Campaign
        </span>
        <div style={{ width: '164px' }}>
          <DatePicker
            value={selectedDate}
            onChange={handleDateChange}
            fillMode="flat"
          />
        </div>
      </div>
      <div className="k-px-4 k-pb-4 k-flex-1 k-justify-content-center">
        {isLoading ? (
          <div className="k-d-flex k-align-items-center k-justify-content-center k-flex-1">
            <span className="k-color-subtle">Loading spend data...</span>
          </div>
        ) : spendData.length > 0 ? (
          <Chart style={{ height: isMobile ? '350px' : isTablet ? '320px' : '293px' }}>
            <ChartSeries>
              <ChartSeriesItem
                type="pie"
                data={spendData}
                categoryField="campaign"
                field="spend"
                colorField="color"
                padding={10}
                border={{ width: 3, color: '#fff' }}
                tooltip={{ 
                  visible: true,
                  format: '{0}: ${1}'
                }}
              >
                <ChartSeriesLabels 
                  position="center" 
                  format="${0}"
                  font="12px Arial"
                  color="white"
                  visible={true}
                />
              </ChartSeriesItem>
            </ChartSeries>
            <ChartLegend
              position="bottom"
              align="center"
              orientation="horizontal"
              padding={{ top: 20, bottom: 10 }}
              labels={{
                font: "14px Quicksand, sans-serif",
                color: "#656565"
              }}
            />
          </Chart>
        ) : (
          <div className="k-d-flex k-align-items-center k-justify-content-center k-flex-1">
            <span className="k-color-subtle">No spend data available</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpendDistributionCard;