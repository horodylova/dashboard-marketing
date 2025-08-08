"use client";

import { useState, useEffect } from 'react';
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartSeriesLabels,
  ChartLegend,
} from '@progress/kendo-react-charts';
import { 
  getUniqueCampaigns, 
  getLatestSpend 
} from '../utils/campaignUtils';

const SpendDistributionCard = () => {
  const [campaignData, setCampaignData] = useState(null);
  const [spendData, setSpendData] = useState([]);
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
      try {
        const response = await fetch('/api/get-campaign-data');
        const data = await response.json();
        setCampaignData(data);
        
        const campaigns = getUniqueCampaigns(data);
        const spendDistribution = campaigns.map(campaign => {
          const spend = getLatestSpend(data, campaign.id);
          return {
            campaign: campaign.name,
            spend: spend,
            color: getCampaignColor(campaign.name)
          };
        }).filter(item => item.spend > 0);
        
        setSpendData(spendDistribution);
      } catch (error) {
        console.error('Error fetching campaign data:', error);
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
    return colors[campaignName] || '#0078d4';
  };

  return (
    <div className="k-d-flex k-flex-col k-col-span-md-3 k-col-span-xl-4 k-border k-border-solid k-border-border k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl">
      <div className="k-d-flex k-justify-content-between k-align-items-center k-p-4">
        <span className="k-font-size-lg k-font-bold k-line-height-sm k-color-primary-emphasis">
          Spend Distribution per Campaign
        </span>
      </div>
      <div className="k-px-4 k-pb-4 k-flex-1 k-justify-content-center">
        {spendData.length > 0 ? (
          <Chart style={{ height: isMobile ? '350px' : '293px' }}>
            <ChartSeries>
              <ChartSeriesItem
                type="pie"
                legendItem={{ type: 'line' }}
                data={spendData}
                categoryField="campaign"
                field="spend"
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
                />
              </ChartSeriesItem>
            </ChartSeries>
            <ChartLegend
              position={isMobile ? "bottom" : "right"}
              align="center"
              orientation={isMobile ? "horizontal" : "vertical"}
              padding={isMobile ? { top: 20, bottom: 10 } : { left: 20, right: 20 }}
            />
          </Chart>
        ) : (
          <div className="k-d-flex k-align-items-center k-justify-content-center k-flex-1">
            <span className="k-color-subtle">Loading spend data...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpendDistributionCard;