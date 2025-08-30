"use client";

import React, { useState, useEffect } from 'react';
import { Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem, ChartTooltip, ChartLegend } from '@progress/kendo-react-charts';
import { SvgIcon } from '@progress/kendo-react-common';
import { infoCircleIcon } from '@progress/kendo-svg-icons';

const getCampaignPerformanceMatrix = (data) => {
  if (!data || !data.data) return [];
  
  const campaignMap = new Map();
  
  data.data.forEach(item => {
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
  const [isLoading, setIsLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

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
      const matrixData = getCampaignPerformanceMatrix(campaignData);
      setChartData(matrixData);
    }
  }, [campaignData]);

  const getAIScoreColor = (score) => {
    if (score >= 8) return '#28a745';
    if (score >= 6) return '#ffc107';
    if (score >= 4) return '#fd7e14';
    return '#dc3545';
  };

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
      </div>
      <div className="k-px-4 k-pb-4 k-flex-1" style={{ minHeight: '362px' }}>
        {isLoading ? (
          <div className="k-d-flex k-justify-content-center k-align-items-center" style={{ height: '362px' }}>
            <p>Loading...</p>
          </div>
        ) : (
          chartData.length > 0 ? (
            <Chart style={{ height: '362px' }}>
              <ChartTooltip format="{3}: CPC ${0}, Leads {1}, Spend ${2}" />
              <ChartCategoryAxis>
                <ChartCategoryAxisItem
                  title={{ text: 'Cost Per Click (CPC) - $' }}
                  labels={{ format: '${0}' }}
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
              <p>No campaign data available.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default CampaignPerformanceMatrix;