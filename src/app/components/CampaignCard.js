"use client";

import { useState, useEffect } from 'react';
import { gridSvgIcons } from '../svg-icons';
import { 
  getUniqueCampaigns, 
  calculateTotalLandingPageViews, 
  calculateTotalLeads, 
  getLatestSpend 
} from '../utils/campaignUtils';

const CampaignCard = () => {
  const [campaignData, setCampaignData] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        const response = await fetch('/api/get-campaign-data');
        const data = await response.json();
        setCampaignData(data);
        setCampaigns(getUniqueCampaigns(data));
      } catch (error) {
        console.error('Error fetching campaign data:', error);
      }
    };

    fetchCampaignData();
  }, []);

  if (!campaignData || campaigns.length === 0) {
    return <div className="k-col-span-12">Loading campaign data...</div>;
  }

  return (
    <div className="k-d-grid k-grid-cols-2 k-grid-cols-md-4 k-col-span-12 k-gap-4">
      {campaigns.map((campaign) => {
        const landingPageViews = calculateTotalLandingPageViews(campaignData, campaign.id);
        const leads = calculateTotalLeads(campaignData, campaign.id);
        const spend = getLatestSpend(campaignData, campaign.id);
        
        const icon = gridSvgIcons.find(icon => icon.name === campaign.platform?.toLowerCase())?.svg;

        return (
          <div 
            key={campaign.id}
            className="k-d-flex k-flex-col k-border k-border-solid k-border-border k-overflow-hidden k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl"
            style={{ minHeight: '120px' }}
          >
            <div className="k-d-flex k-p-2 k-p-md-3 k-gap-2 k-flex-wrap k-justify-content-center k-align-items-center k-flex-1">
              <div className="k-d-flex k-align-items-center k-justify-content-center" style={{ minHeight: '24px' }}>
                {icon}
              </div>
              <div className="k-font-size-sm k-font-size-md-lg k-font-weight-bold k-text-center" style={{ lineHeight: '1.2' }}>
                {campaign.name}
              </div>
            </div>
            <div className="k-d-flex k-flex-col k-gap-1 k-px-2 k-px-md-4 k-pb-2 k-font-size-xs k-font-size-md-sm">
              <div className="k-text-center">{landingPageViews} page views</div>
              <div className="k-text-center">{leads} leads</div>
              <div className="k-text-center">${spend} spent</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CampaignCard;