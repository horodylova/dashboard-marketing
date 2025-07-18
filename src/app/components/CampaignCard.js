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
    <div className="k-d-flex k-flex-row k-col-span-12 k-gap-4">
      {campaigns.map((campaign) => {
        const landingPageViews = calculateTotalLandingPageViews(campaignData, campaign.id);
        const leads = calculateTotalLeads(campaignData, campaign.id);
        const spend = getLatestSpend(campaignData, campaign.id);
        
        // Находим иконку для соответствующей платформы
        const icon = gridSvgIcons.find(icon => icon.name === campaign.platform?.toLowerCase())?.svg;

        return (
          <div 
            key={campaign.id}
            className="k-d-flex k-flex-col k-flex-1 k-border k-border-solid k-border-border k-overflow-hidden k-bg-surface-alt k-overflow-hidden k-elevation-1 k-rounded-xl"
          >
            <div className="k-d-flex k-p-3 k-gap-2 k-flex-wrap k-justify-content-center k-align-items-center">
              <div className="k-d-flex">
                {icon}
              </div>
              <div className="k-font-size-lg k-font-weight-bold">
                {campaign.name}
              </div>
            </div>
            <div className="k-d-flex k-gap-1 k-gap-sm-0 k-flex-sm-col k-px-4 k-pb-2 k-justify-content-between k-align-items-center k-font-size-sm k-flex-1">
              <div>{landingPageViews} page views</div>
              <div>{leads} leads</div>
              <div>${spend} spent</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CampaignCard;